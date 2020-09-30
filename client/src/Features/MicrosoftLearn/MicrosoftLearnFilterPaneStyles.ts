import { FontWeights, FontSizes } from '@fluentui/react';
import { SimpleComponentStyles, IThemeOnlyProps } from '../../Core/Utils/FluentUI/typings.fluent-ui';

export type FilterPaneStyles = SimpleComponentStyles<
  | 'root'
  | 'title'
  | 'collapsePanelButton'
  | 'clearAll'
  | 'mainPanelActionButtons'
  | 'filterPanelTabView'
  | 'filterPanelFooter'
  | 'filterPanelHeader'
>;

export const FilterPaneStyles = ({ theme }: IThemeOnlyProps): FilterPaneStyles => ({
  root: [
    {
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: theme.palette.neutralLighterAlt,
      marginRight: `calc(${theme.spacing.l1} * 1.6)`,
      width: '300px'
    }
  ],
  title: [
    {
      color: theme.palette.neutralPrimary,
      fontWeight: FontWeights.semibold,
      fontSize: FontSizes.xLargePlus,
      marginBottom: `calc(${theme.spacing.l1}*0.75)`
    }
  ],
  collapsePanelButton: [
    {
      marginLeft: theme.spacing.s1,
      marginBottom: theme.spacing.l1
    }
  ],
  clearAll: [
    {
      color: theme.palette.themePrimary,
      fontSize: FontSizes.mediumPlus,
      padding: `0px`,
      selectors: {
        '.ms-Button-label': {
          margin: `0px`
        }
      }
    }
  ],
  mainPanelActionButtons: [
    {
      display: 'flex',
      flexDirection: 'row',
      width: `100%`,
      marginBottom: theme.spacing.s1,
      marginTop: theme.spacing.s1,
      selectors: {
        '.ms-Button-flexContainer': {
          width: `100%`,
          fontSize: FontSizes.mediumPlus,
          justifyContent: 'space-between'
        },
        '.buttonTitle': {
          fontWeight: FontWeights.semibold
        }
      }
    }
  ],

  filterPanelTabView: [
    {
      width: '340px',
      selectors: {
        '.ms-Panel-main': {
          width: '100%'
        }
      }
    }
  ],
  filterPanelFooter: [
    {
      width: '85%',
      position: 'absolute',
      bottom: '0px',
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-evenly',
      marginBottom: `calc(${theme.spacing.s1}*2)`
    }
  ],

  filterPanelHeader: [
    {
      width: '100%',
      marginLeft: `${theme.spacing.s1}`,
      alignSelf: 'center',
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      selectors: {
        '.backTitle': {
          marginLeft: theme.spacing.s1
        }
      }
    }
  ]
});
