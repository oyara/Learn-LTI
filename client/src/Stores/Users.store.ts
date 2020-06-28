import { action, observable } from 'mobx';
import { ChildStore } from './Core';
import { UsersService } from '../Services/Users.service';
import { toObservable } from '../Core/Utils/Mobx/toObservable';
import { filter, map, switchMap, tap } from 'rxjs/operators';
import { race } from 'rxjs';
import { User } from '../Models/User.model';
import { UserRole } from '../Models/UserRole.model';
import { UserDto } from '../Dtos/User.dto';
import _ from 'lodash';
import { AppAuthConfig } from '../Core/Auth/AppAuthConfig';
import { Account } from 'msal';

export class UsersStore extends ChildStore {
  private readonly roleIdToRoleDisplayName: Map<UserRole, string> = new Map<UserRole, string>([
    ['learner', 'Learner'],
    ['teacher', 'Teacher'],
    ['admin', 'Admin']
  ]);

  @observable userDetails: User | null = null;
  @observable userImageUrl = '';
  @observable participants: User[] | null = null;
  @observable account: Account | null = null;

  initialize(): void {
    const detailsFromPlatform = toObservable(
      () => this.root.platformStore.platform || this.root.platformStore.isNotAuthorized
    ).pipe(
      filter(platformObservable => !!platformObservable),
      map(() => AppAuthConfig.getAccountInfo()?.account),
      filter(account => !!account),
      filter(account => !!account?.name),
      map(account => account!),
      map(account => this.accountToUserModel(account))
    );

    const detailsFromAssignment = toObservable(() => this.root.assignmentStore.assignment).pipe(
      filter(assignment => !!assignment),
      map(assignment => assignment!.id),
      switchMap(assignmentId => UsersService.getCurrentUserDetails(assignmentId)),
      filter(user => !user.error),
      map(user => user as UserDto),
      filter(user => !!user?.givenName || !!user?.familyName),
      map(user => this.userDtoToModel(user))
    );

    race(detailsFromAssignment, detailsFromPlatform)
      .pipe(
        tap(user => (this.userDetails = user)),
        switchMap(() => UsersService.getCurrentUserImageBlob()),
        map(imageBlob => URL.createObjectURL(imageBlob))
      )
      .subscribe(imageUrl => (this.userImageUrl = imageUrl));
  }

  @action
  async initializeParticipants(): Promise<void> {
    const assignmentId = this.root.assignmentStore.assignment!.id;
    const participants = await UsersService.getAllParticipantsDetails(assignmentId);
    if (participants.error) {
      return;
    }

    this.participants = _.sortBy(
      participants.map(user => this.userDtoToModel(user)),
      'role',
      'familyName'
    );
  }

  private userDtoToModel(userDto: UserDto): User {
    const displayName =
      userDto.givenName || userDto.familyName
        ? `${userDto.givenName ? userDto.givenName + ' ' : ''}${userDto.familyName || ''}`
        : '';
    return {
      roleDisplayName: this.roleIdToRoleDisplayName.get(userDto.role)!,
      displayName,
      ...userDto
    };
  }
  private accountToUserModel(account: Account): User {
    return {
      roleDisplayName: '',
      displayName: account?.name || '',
      email: account?.userName || ''
    };
  }
}