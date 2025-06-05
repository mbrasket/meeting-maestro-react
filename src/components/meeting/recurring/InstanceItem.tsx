
import {
  Button,
  Field,
  makeStyles,
  tokens,
} from '@fluentui/react-components';
import { DatePicker } from '@fluentui/react-datepicker-compat';
import { Delete20Regular } from '@fluentui/react-icons';
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
  dateTimeField: {
    flex: 1,
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

  const handleDateTimeChange = (date: Date | null | undefined) => {
    if (date) {
      // Format date to ISO string for storage
      const isoString = date.toISOString().slice(0, 16); // Remove seconds and timezone
      onUpdate({ ...instance, dateTime: isoString });
    }
  };

  // Convert stored datetime string to Date object for DatePicker
  const selectedDate = instance.dateTime ? new Date(instance.dateTime) : undefined;

  return (
    <div className={styles.instanceItem}>
      <Field className={styles.dateTimeField}>
        <DatePicker
          placeholder="Select date and time"
          value={selectedDate}
          onSelectDate={handleDateTimeChange}
          showTime={true}
          formatDate={(date) => date ? date.toLocaleString() : ''}
        />
      </Field>
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
