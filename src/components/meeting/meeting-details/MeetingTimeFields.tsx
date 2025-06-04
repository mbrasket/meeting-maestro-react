
import {
  Input,
  Field,
  makeStyles,
  tokens,
} from '@fluentui/react-components';
import { Clock20Regular } from '@fluentui/react-icons';
import { FormData } from '../types';

const useStyles = makeStyles({
  timeFieldsContainer: {
    display: 'flex',
    gap: tokens.spacingHorizontalM,
    marginBottom: '16px',
  },
  timeFieldWithIcon: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalM,
    flex: 1,
    height: '32px',
  },
  iconContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '20px',
    height: '20px',
    color: tokens.colorNeutralForeground2,
  },
  inputField: {
    flex: 1,
    height: '32px',
    '& input': {
      height: '32px',
    },
  },
});

interface MeetingTimeFieldsProps {
  formData: FormData;
  onInputChange: (field: keyof FormData, value: string) => void;
}

const MeetingTimeFields = ({ formData, onInputChange }: MeetingTimeFieldsProps) => {
  const styles = useStyles();

  return (
    <div className={styles.timeFieldsContainer}>
      <div className={styles.timeFieldWithIcon}>
        <div className={styles.iconContainer}>
          <Clock20Regular />
        </div>
        <Field required className={styles.inputField}>
          <Input
            appearance="underline"
            type="datetime-local"
            value={formData.startTime}
            onChange={(_, data) => onInputChange('startTime', data.value)}
          />
        </Field>
      </div>

      <div className={styles.timeFieldWithIcon}>
        <div className={styles.iconContainer}>
          <Clock20Regular />
        </div>
        <Field required className={styles.inputField}>
          <Input
            appearance="underline"
            type="datetime-local"
            value={formData.endTime}
            onChange={(_, data) => onInputChange('endTime', data.value)}
          />
        </Field>
      </div>
    </div>
  );
};

export default MeetingTimeFields;
