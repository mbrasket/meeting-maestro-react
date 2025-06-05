
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
      onUpdate({ ...instance, dateTime: date.toISOString().slice(0, 16) });
    }
  };

  const selectedDate = instance.dateTime ? new Date(instance.dateTime) : undefined;

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
