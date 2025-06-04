import {
  Field,
  Textarea,
  makeStyles,
  tokens,
} from '@fluentui/react-components';
import { DocumentText20Regular } from '@fluentui/react-icons';
import { FormData } from '../types';

const useStyles = makeStyles({
  descriptionContainer: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: tokens.spacingHorizontalM,
    marginTop: tokens.spacingVerticalL,
    marginBottom: '16px',
    padding: `${tokens.spacingVerticalS} ${tokens.spacingHorizontalS}`,
    borderRadius: tokens.borderRadiusSmall,
    cursor: 'default',
  },
  descriptionIcon: {
    marginTop: '8px',
  },
  descriptionField: {
    flex: 1,
  },
  descriptionTextarea: {
    borderTopColor: tokens.colorNeutralStroke1,
    borderRightColor: tokens.colorNeutralStroke1,
    borderBottomColor: tokens.colorNeutralStroke1,
    borderLeftColor: tokens.colorNeutralStroke1,
    borderTopWidth: '1px',
    borderRightWidth: '1px',
    borderBottomWidth: '1px',
    borderLeftWidth: '1px',
    borderTopStyle: 'solid',
    borderRightStyle: 'solid',
    borderBottomStyle: 'solid',
    borderLeftStyle: 'solid',
    borderRadius: tokens.borderRadiusMedium,
    padding: tokens.spacingVerticalS,
    cursor: 'default',
    transition: 'border-width 0.1s ease, border-color 0.1s ease',
    '&:hover': {
      borderTopWidth: '2px !important',
      borderRightWidth: '2px !important',
      borderBottomWidth: '2px !important',
      borderLeftWidth: '2px !important',
      borderTopColor: `${tokens.colorBrandStroke1} !important`,
      borderRightColor: `${tokens.colorBrandStroke1} !important`,
      borderBottomColor: `${tokens.colorBrandStroke1} !important`,
      borderLeftColor: `${tokens.colorBrandStroke1} !important`,
    },
    '&:focus': {
      borderTopColor: `${tokens.colorBrandStroke1} !important`,
      borderRightColor: `${tokens.colorBrandStroke1} !important`,
      borderBottomColor: `${tokens.colorBrandStroke1} !important`,
      borderLeftColor: `${tokens.colorBrandStroke1} !important`,
      borderTopWidth: '2px !important',
      borderRightWidth: '2px !important',
      borderBottomWidth: '2px !important',
      borderLeftWidth: '2px !important',
      outline: 'none',
    }
  },
  iconContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '20px',
    height: '20px',
    color: tokens.colorNeutralForeground2,
  },
});

interface MeetingDescriptionFieldProps {
  formData: FormData;
  onInputChange: (field: keyof FormData, value: string) => void;
}

const MeetingDescriptionField = ({ formData, onInputChange }: MeetingDescriptionFieldProps) => {
  const styles = useStyles();

  return (
    <div className={styles.descriptionContainer}>
      <div className={`${styles.iconContainer} ${styles.descriptionIcon}`}>
        <DocumentText20Regular />
      </div>
      <Field className={styles.descriptionField}>
        <Textarea
          className={styles.descriptionTextarea}
          value={formData.description}
          onChange={(_, data) => onInputChange('description', data.value)}
          placeholder="Add meeting description (optional)"
          rows={3}
        />
      </Field>
    </div>
  );
};

export default MeetingDescriptionField;
