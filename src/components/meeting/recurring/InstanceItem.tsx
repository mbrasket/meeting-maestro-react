
import {
  Button,
  Field,
  makeStyles,
  tokens,
} from '@fluentui/react-components';
import { DatePicker } from '@fluentui/react-datepicker-compat';
import { Delete20Regular } from '@fluentui/react-icons';
import { OneOffInstance } from '../types';
import TimeInput from '../meeting-details/TimeInput';

const useStyles = makeStyles({
  instanceItem: {
    display: 'flex',
    alignItems: 'flex-end',
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
    alignItems: 'flex-end',
  },
  dateField: {
    flex: 1,
    minWidth: 0,
  },
  timeField: {
    flex: 1,
    minWidth: 0,
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
      const existingDateTime = instance.dateTime ? new Date(instance.dateTime) : new Date();
      const newDateTime = new Date(date);
      newDateTime.setHours(existingDateTime.getHours(), existingDateTime.getMinutes());
      onUpdate({ ...instance, dateTime: newDateTime.toISOString().slice(0, 16) });
    }
  };

  const handleTimeChange = (timeValue: string) => {
    const existingDate = instance.dateTime ? new Date(instance.dateTime) : new Date();
    
    // Parse the time format "H:MM AM/PM"
    const timeRegex = /^(\d{1,2}):(\d{2})\s*(AM|PM)$/i;
    const match = timeValue.match(timeRegex);
    
    if (match) {
      let hours = parseInt(match[1]);
      const minutes = parseInt(match[2]);
      const ampm = match[3].toUpperCase();
      
      if (ampm === 'PM' && hours !== 12) hours += 12;
      if (ampm === 'AM' && hours === 12) hours = 0;
      
      const newDateTime = new Date(existingDate);
      newDateTime.setHours(hours, minutes);
      onUpdate({ ...instance, dateTime: newDateTime.toISOString().slice(0, 16) });
    }
  };

  // Extract date and time from stored datetime string
  const selectedDate = instance.dateTime ? new Date(instance.dateTime) : undefined;

  // Format time for display
  const displayTime = selectedDate ? 
    selectedDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }) : '';

  return (
    <div className={styles.instanceItem}>
      <div className={styles.dateTimeContainer}>
        <Field label="Date" className={styles.dateField}>
          <DatePicker
            placeholder="Select date"
            value={selectedDate}
            onSelectDate={handleDateChange}
            formatDate={(date) => date ? date.toLocaleDateString() : ''}
          />
        </Field>
        <div className={styles.timeField}>
          <TimeInput
            label="Time"
            value={displayTime}
            onChange={handleTimeChange}
            placeholder="9:00 AM"
          />
        </div>
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
