import {
  Button,
  Field,
  Input,
  makeStyles,
  tokens,
} from '@fluentui/react-components';
import { DatePicker } from '@fluentui/react-datepicker-compat';
import { Delete20Regular, Clock20Regular } from '@fluentui/react-icons';
import { OneOffInstance } from '../types';

const useStyles = makeStyles({
  instanceItem: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalM,
    padding: tokens.spacingVerticalS,
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    borderRadius: tokens.borderRadiusSmall,
    marginBottom: tokens.spacingVerticalS,
  },
  dateTimeContainer: {
    flex: 1,
    display: 'flex',
    gap: tokens.spacingHorizontalS,
    alignItems: 'center',
  },
  dateField: {
    flex: 1,
  },
  timeField: {
    width: '120px',
  },
  deleteButton: {
    minWidth: 'auto',
    padding: tokens.spacingHorizontalXS,
    color: tokens.colorPaletteRedForeground1,
    '&:hover': {
      backgroundColor: tokens.colorPaletteRedBackground2,
    },
  },
});

interface InstanceItemProps {
  instance: OneOffInstance;
  onUpdate: (instance: OneOffInstance) => void;
  onDelete: (instanceId: string) => void;
}

const InstanceItem = ({ instance, onUpdate, onDelete }: InstanceItemProps) => {
  const styles = useStyles();

  const handleDateChange = (date: Date | null | undefined) => {
    if (date) {
      // Keep existing time if available
      const existingDateTime = instance.dateTime ? new Date(instance.dateTime) : new Date();
      const newDateTime = new Date(date);
      newDateTime.setHours(existingDateTime.getHours(), existingDateTime.getMinutes());
      onUpdate({ ...instance, dateTime: newDateTime.toISOString().slice(0, 16) });
    }
  };

  const handleTimeChange = (timeValue: string) => {
    // Parse time and combine with existing date
    const existingDate = instance.dateTime ? new Date(instance.dateTime) : new Date();
    const [hours, minutes] = timeValue.split(':').map(Number);
    
    if (!isNaN(hours) && !isNaN(minutes)) {
      const newDateTime = new Date(existingDate);
      newDateTime.setHours(hours, minutes);
      onUpdate({ ...instance, dateTime: newDateTime.toISOString().slice(0, 16) });
    }
  };

  const handleTimeBlur = (timeValue: string) => {
    // Validate and format time on blur
    const timeRegex = /^(\d{1,2}):?(\d{0,2})\s*(am|pm)?$/i;
    const match = timeValue.match(timeRegex);
    
    if (match) {
      let hours = parseInt(match[1], 10);
      let minutes = parseInt(match[2] || '0', 10);
      const period = match[3]?.toLowerCase();
      
      // Handle 12-hour format conversion
      if (period) {
        if (period === 'pm' && hours !== 12) hours += 12;
        if (period === 'am' && hours === 12) hours = 0;
      }
      
      // Validate ranges
      if (hours > 23) hours = 23;
      if (minutes > 59) minutes = 59;
      
      // Update with 24-hour format for storage
      const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
      handleTimeChange(formattedTime);
    }
  };

  // Extract date and time from stored datetime string
  const selectedDate = instance.dateTime ? new Date(instance.dateTime) : undefined;
  const timeValue = selectedDate ? 
    `${selectedDate.getHours().toString().padStart(2, '0')}:${selectedDate.getMinutes().toString().padStart(2, '0')}` : '';

  // Format time for display (12-hour format)
  const displayTime = selectedDate ? 
    selectedDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }) : '';

  return (
    <div className={styles.instanceItem}>
      <div className={styles.dateTimeContainer}>
        <Field className={styles.dateField}>
          <DatePicker
            placeholder="Select date"
            value={selectedDate}
            onSelectDate={handleDateChange}
            formatDate={(date) => date ? date.toLocaleDateString() : ''}
          />
        </Field>
        <Field className={styles.timeField}>
          <Input
            appearance="underline"
            type="text"
            value={displayTime}
            onChange={(_, data) => {
              // Allow free typing
            }}
            onBlur={(e) => handleTimeBlur(e.target.value)}
            placeholder="Time"
            contentBefore={<Clock20Regular />}
          />
        </Field>
      </div>
      <Button
        appearance="subtle"
        icon={<Delete20Regular />}
        className={styles.deleteButton}
        onClick={() => onDelete(instance.id)}
      />
    </div>
  );
};

export default InstanceItem;
