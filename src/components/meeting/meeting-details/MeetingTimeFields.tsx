
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
    alignItems: 'center',
    gap: '8px',
    width: '100%',
  },
  dateField: {
    flex: 1,
    minWidth: '120px',
    '& input[type="date"]::-webkit-calendar-picker-indicator': {
      display: 'none',
    },
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

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onInputChange('startDate', e.target.value);
  };

  const handleStartTimeChange = (timeValue: string) => {
    onInputChange('startTime', timeValue);
  };

  const handleEndTimeChange = (timeValue: string) => {
    onInputChange('endTime', timeValue);
  };

  const handleDateKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Reverse arrow key behavior for date field: Down = increment, Up = decrement
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      const input = e.currentTarget;
      const currentValue = input.value;
      
      if (currentValue) {
        const date = new Date(currentValue);
        if (!isNaN(date.getTime())) {
          const direction = e.key === 'ArrowDown' ? 1 : -1; // Reversed
          date.setDate(date.getDate() + direction);
          
          const newValue = date.toISOString().split('T')[0];
          onInputChange('startDate', newValue);
        }
      }
    }
  };

  return (
    <MeetingFieldWithIcon icon={<Calendar20Regular />}>
      <div className={styles.timeFieldsContainer}>
        <Field required className={styles.dateField}>
          <Input
            appearance="underline"
            type="date"
            value={formData.startDate}
            onChange={handleDateChange}
            onKeyDown={handleDateKeyDown}
            placeholder="Select date"
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
