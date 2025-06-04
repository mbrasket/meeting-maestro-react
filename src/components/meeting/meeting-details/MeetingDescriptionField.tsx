
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
    transition: 'background-color 0.1s ease',
    '&:hover': {
      backgroundColor: tokens.colorSubtleBackgroundHover,
    },
  },
  descriptionTextarea: {
    border: `1px solid ${tokens.colorNeutralStroke1}`,
    borderRadius: tokens.borderRadiusMedium,
    padding: tokens.spacingVerticalS,
    cursor: 'text',
    transition: 'border-color 0.1s ease',
    '&:hover': {
      borderColor: tokens.colorNeutralStroke1Hover,
    },
    '&:focus': {
      borderColor: tokens.colorBrandStroke1,
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
