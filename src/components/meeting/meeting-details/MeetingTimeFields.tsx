
import {
  Field,
  makeStyles,
  tokens,
} from '@fluentui/react-components';
import { ArrowRight20Regular, Calendar20Regular } from '@fluentui/react-icons';
import { DatePicker } from '@fluentui/react-datepicker-compat';
import { FormData } from '../types';
import TimeInput from './TimeInput';
import MeetingFieldWithIcon from './MeetingFieldWithIcon';

const useStyles = makeStyles({
  timeFieldsContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    width: '100%',
  },
  dateField: {
    flex: 1,
    minWidth: '120px',
  },
  timeField: {
    minWidth: '90px',
    flex: '0 0 auto',
  },
  arrowContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: tokens.colorNeutralForeground2,
    flex: '0 0 auto',
  },
});

interface MeetingTimeFieldsProps {
  formData: FormData;
  onInputChange: (field: keyof FormData, value: string) => void;
}

const MeetingTimeFields = ({ formData, onInputChange }: MeetingTimeFieldsProps) => {
  const styles = useStyles();

  const handleDateChange = (date: Date | null | undefined) => {
    if (date) {
      const dateString = date.toISOString().split('T')[0];
      onInputChange('startDate', dateString);
    }
  };

  const handleStartTimeChange = (timeValue: string) => {
    onInputChange('startTime', timeValue);
  };

  const handleEndTimeChange = (timeValue: string) => {
    onInputChange('endTime', timeValue);
  };

  // Convert string date to Date object for DatePicker
  const selectedDate = formData.startDate ? new Date(formData.startDate) : undefined;

  return (
    <MeetingFieldWithIcon icon={<Calendar20Regular />}>
      <div className={styles.timeFieldsContainer}>
        <Field required className={styles.dateField}>
          <DatePicker
            placeholder="Select date"
            value={selectedDate}
            onSelectDate={handleDateChange}
            formatDate={(date) => date?.toLocaleDateString() || ''}
            appearance="underline"
          />
        </Field>

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
    </MeetingFieldWithIcon>
  );
};

export default MeetingTimeFields;
