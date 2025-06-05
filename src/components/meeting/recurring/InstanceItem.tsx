
import {
  Button,
  Field,
  makeStyles,
  tokens,
} from '@fluentui/react-components';
import { DatePicker } from '@fluentui/react-datepicker-compat';
import { Delete20Regular, ArrowRight20Regular } from '@fluentui/react-icons';
import { OneOffInstance } from '../types';
import TimeInput from '../meeting-details/TimeInput';

const useStyles = makeStyles({
  instanceItem: {
    display: 'flex',
    alignItems: 'flex-end',
    gap: tokens.spacingHorizontalM,
    padding: tokens.spacingVerticalM,
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
    '&:last-child': {
      borderBottom: 'none',
    },
  },
  dateTimeContainer: {
    flex: 1,
    display: 'flex',
    gap: tokens.spacingHorizontalS,
    alignItems: 'flex-end',
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
      const dateString = date.toISOString().split('T')[0];
      onUpdate({ 
        ...instance, 
        date: dateString,
        dateTime: `${dateString}T${instance.startTime || '09:00'}:00`
      });
    }
  };

  const handleStartTimeChange = (timeValue: string) => {
    onUpdate({ 
      ...instance, 
      startTime: timeValue,
      dateTime: `${instance.date || new Date().toISOString().split('T')[0]}T${timeValue}:00`
    });
  };

  const handleEndTimeChange = (timeValue: string) => {
    onUpdate({ 
      ...instance, 
      endTime: timeValue
    });
  };

  // Extract date from dateTime or use current date
  const selectedDate = instance.date ? new Date(instance.date) : 
    instance.dateTime ? new Date(instance.dateTime) : undefined;

  return (
    <div className={styles.instanceItem}>
      <div className={styles.dateTimeContainer}>
        <Field required className={styles.dateField}>
          <DatePicker
            placeholder="Select date"
            value={selectedDate}
            onSelectDate={handleDateChange}
            formatDate={(date) => date?.toLocaleDateString() || ''}
            appearance="underline"
            allowTextInput={true}
            disableAutoFocus={false}
          />
        </Field>

        <div className={styles.timeField}>
          <TimeInput
            value={instance.startTime || ''}
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
            value={instance.endTime || ''}
            onChange={handleEndTimeChange}
            placeholder="End time"
            required
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
