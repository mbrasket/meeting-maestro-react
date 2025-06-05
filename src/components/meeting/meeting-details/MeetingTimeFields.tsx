
import {
  Field,
  makeStyles,
  tokens,
} from '@fluentui/react-components';
import { DatePicker } from '@fluentui/react-datepicker-compat';
import { Calendar20Regular } from '@fluentui/react-icons';
import { FormData } from '../types';
import TimeInput from './TimeInput';

const useStyles = makeStyles({
  timeFieldsContainer: {
    display: 'flex',
    gap: tokens.spacingHorizontalM,
    marginBottom: '16px',
  },
  timeFieldGroup: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalXS,
  },
  timeFieldWithIcon: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalS,
    height: '32px',
    padding: `${tokens.spacingVerticalXS} ${tokens.spacingHorizontalS}`,
    borderRadius: tokens.borderRadiusSmall,
  },
  iconContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '20px',
    height: '20px',
    color: tokens.colorNeutralForeground2,
  },
  dateField: {
    flex: 1,
  },
});

interface MeetingTimeFieldsProps {
  formData: FormData;
  onInputChange: (field: keyof FormData, value: string) => void;
}

const MeetingTimeFields = ({ formData, onInputChange }: MeetingTimeFieldsProps) => {
  const styles = useStyles();

  const parseDateTime = (dateTimeStr: string) => {
    if (!dateTimeStr) return { date: undefined, timeString: '' };
    
    const date = new Date(dateTimeStr);
    const hour = date.getHours();
    const displayHour = hour === 0 ? 12 : hour > 12 ? (hour - 12).toString() : hour.toString();
    const minute = date.getMinutes().toString().padStart(2, '0');
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const timeString = `${displayHour}:${minute} ${ampm}`;
    
    return { date, timeString };
  };

  const constructDateTime = (date: Date | undefined, timeString: string) => {
    if (!date || !timeString) return '';
    
    const timeRegex = /^(\d{1,2}):(\d{2})\s*(AM|PM)$/i;
    const match = timeString.match(timeRegex);
    
    if (!match) return '';
    
    let hour = parseInt(match[1]);
    const minute = parseInt(match[2]);
    const ampm = match[3].toUpperCase();
    
    if (ampm === 'PM' && hour !== 12) hour += 12;
    if (ampm === 'AM' && hour === 12) hour = 0;
    
    const newDate = new Date(date);
    newDate.setHours(hour, minute, 0, 0);
    
    return newDate.toISOString().slice(0, 16);
  };

  const handleDateChange = (field: 'startTime' | 'endTime', date: Date | null | undefined) => {
    if (!date) return;
    
    const current = parseDateTime(formData[field]);
    const newDateTime = constructDateTime(date, current.timeString || '9:00 AM');
    onInputChange(field, newDateTime);
  };

  const handleTimeChange = (field: 'startTime' | 'endTime', timeString: string) => {
    const current = parseDateTime(formData[field]);
    const currentDate = current.date || new Date();
    const newDateTime = constructDateTime(currentDate, timeString);
    onInputChange(field, newDateTime);
  };

  const startTime = parseDateTime(formData.startTime);
  const endTime = parseDateTime(formData.endTime);

  return (
    <div className={styles.timeFieldsContainer}>
      <div className={styles.timeFieldGroup}>
        <div className={styles.timeFieldWithIcon}>
          <div className={styles.iconContainer}>
            <Calendar20Regular />
          </div>
          <Field required className={styles.dateField}>
            <DatePicker
              placeholder="Select start date"
              value={startTime.date}
              onSelectDate={(date) => handleDateChange('startTime', date)}
              formatDate={(date) => date ? date.toLocaleDateString() : ''}
            />
          </Field>
        </div>
        <TimeInput
          label="Start Time"
          value={startTime.timeString}
          onChange={(time) => handleTimeChange('startTime', time)}
          placeholder="9:00 AM"
          required
        />
      </div>

      <div className={styles.timeFieldGroup}>
        <div className={styles.timeFieldWithIcon}>
          <div className={styles.iconContainer}>
            <Calendar20Regular />
          </div>
          <Field required className={styles.dateField}>
            <DatePicker
              placeholder="Select end date"
              value={endTime.date}
              onSelectDate={(date) => handleDateChange('endTime', date)}
              formatDate={(date) => date ? date.toLocaleDateString() : ''}
            />
          </Field>
        </div>
        <TimeInput
          label="End Time"
          value={endTime.timeString}
          onChange={(time) => handleTimeChange('endTime', time)}
          placeholder="10:00 AM"
          required
        />
      </div>
    </div>
  );
};

export default MeetingTimeFields;
