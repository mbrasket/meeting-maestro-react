
import {
  Field,
  makeStyles,
  tokens,
  Input,
} from '@fluentui/react-components';
import { ArrowRight20Regular, Calendar20Regular } from '@fluentui/react-icons';
import { FormData } from '../types';
import TimeInput from './TimeInput';
import MeetingFieldWithIcon from './MeetingFieldWithIcon';

const useStyles = makeStyles({
  timeFieldsContainer: {
    display: 'flex',
    gap: tokens.spacingHorizontalS,
    alignItems: 'center',
    width: '100%',
  },
  fieldGroup: {
    display: 'flex',
    flexDirection: 'column',
  },
  timeFieldsRow: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalXS,
    flex: 1,
  },
  dateField: {
    width: '120px',
  },
  timeField: {
    width: '90px',
  },
  arrowContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0 4px',
    color: tokens.colorNeutralForeground2,
  },
});

interface MeetingTimeFieldsProps {
  formData: FormData;
  onInputChange: (field: keyof FormData, value: string) => void;
}

const MeetingTimeFields = ({ formData, onInputChange }: MeetingTimeFieldsProps) => {
  const styles = useStyles();

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onInputChange('startDate', e.target.value);
  };

  const handleStartTimeChange = (timeValue: string) => {
    onInputChange('startTime', timeValue);
  };

  const handleEndTimeChange = (timeValue: string) => {
    onInputChange('endTime', timeValue);
  };

  return (
    <MeetingFieldWithIcon icon={<Calendar20Regular />}>
      <div className={styles.timeFieldsContainer}>
        <div className={styles.fieldGroup}>
          <Field required className={styles.dateField}>
            <Input
              appearance="underline"
              type="date"
              value={formData.startDate}
              onChange={handleDateChange}
              placeholder="Select date"
            />
          </Field>
        </div>

        <div className={styles.timeFieldsRow}>
          <div className={styles.timeField}>
            <TimeInput
              value={formData.startTime}
              onChange={handleStartTimeChange}
              placeholder="Start time"
              required
            />
          </div>
          <div className={styles.arrowContainer}>
            <ArrowRight20Regular />
          </div>
          <div className={styles.timeField}>
            <TimeInput
              value={formData.endTime}
              onChange={handleEndTimeChange}
              placeholder="End time"
              required
            />
          </div>
        </div>
      </div>
    </MeetingFieldWithIcon>
  );
};

export default MeetingTimeFields;
