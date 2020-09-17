import { observable, action } from 'mobx';
import { ChildStore } from './Core';
import { AssignmentService } from '../Services/Assignment.service';
import { Assignment } from '../Models/Assignment.model';
import { ErrorPageContent } from '../Core/Components/ErrorPageContent';

export type SaveResult = 'error' | 'success';

export class AssignmentStore extends ChildStore {
  @observable assignment: Assignment | null = null;
  @observable isChangingPublishState: boolean | null = null;
  @observable errorContent : ErrorPageContent | undefined = undefined;
  @observable updateSaveResult: SaveResult | null = null;
  @observable changeSaveResult: SaveResult | null = null;

  @action
  async initializeAssignment(assignmentId: string): Promise<void> {
    const assignment = await AssignmentService.getAssignment(assignmentId);
    if (assignment.error) {
      this.errorContent = ErrorPageContent.CreateFromServiceError(assignment.error);
      return;
    }
    const { deadline } = assignment;
    this.assignment = deadline ? { ...assignment, deadline: new Date(deadline) } : assignment;
  }

  @action
  async updateAssignmentDeadline(newDeadline: Date): Promise<void> {
    if (this.assignment) {
      this.assignment.deadline = newDeadline;
      const hasErrors = await AssignmentService.updateAssignment(this.assignment);
      this.updateSaveResult = hasErrors ? 'error' : 'success';
    }
  }

  @action
  async updateAssignmentDescription(newDescription: string): Promise<void> {
    if (this.assignment) {
      this.assignment.description = newDescription;
      const hasErrors = await AssignmentService.updateAssignment(this.assignment);
      this.updateSaveResult = hasErrors ? 'error' : 'success';
    }
  }

  @action
  async changeAssignmentPublishStatus(newPublishStatus: boolean): Promise<void> {
    if (this.assignment) {
      this.isChangingPublishState = true;
      const hasErrors = await AssignmentService.changeAssignmentPublishStatus(
        this.assignment.id,
        newPublishStatus
      );
      this.changeSaveResult = hasErrors ? 'error' : 'success';
      if (this.changeSaveResult === 'success') {
        this.assignment.publishStatus = newPublishStatus ? 'Published' : 'NotPublished';
      }
      this.isChangingPublishState = false;
    }
  }
}
