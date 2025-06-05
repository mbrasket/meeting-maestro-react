
import {
  Field,
  makeStyles,
  tokens,
} from '@fluentui/react-components';
import { DatePicker } from '@fluentui/react-datepicker-compat';
import { Calendar20Regular, ChevronRight20Regular } from '@fluentui/react-icons';
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
  timeFieldsRow: {
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
  arrowContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0 8px',
    color: tokens.colorNeutralForeground2,
  },
  dateField: {
    flex: 1,
  },
  timeField: {
    flex: 1,
  },
});

interface MeetingTimeFieldsProps {
  formData: FormData;
  onInputChange: (field: keyof FormData, value: string) => void;
}

const MeetingTimeFields = ({ formData, onInputChange }: MeetingTimeFieldsProps) => {
  const styles = useStyles();

  const handleDateChange = (field: 'startTime', date: Date | null | undefined) => {
    if (date) {
      onInputChange(field, date.toISOString().slice(0, 16));
    }
  };

  const startDate = formData.startTime ? new Date(formData.startTime) : undefined;

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
              value={startDate}
              onSelectDate={(date) => handleDateChange('startTime', date)}
              formatDate={(date) => date ? date.toLocaleDateString() : ''}
              showMonthPickerAsOverlay={true}
            />
          </Field>
        </div>
      </div>

      <div className={styles.timeFieldGroup}>
        <div className={styles.timeFieldsRow}>
          <TimeInput
            value={formData.startTime}
            onChange={(value) => onInputChange('startTime', value)}
            placeholder="HH:MM AM/PM"
            required
          />
          <div className={styles.arrowContainer}>
            <ChevronRight20Regular />
          </div>
          <TimeInput
            value={formData.endTime}
            onChange={(value) => onInputChange('endTime', value)}
            placeholder="HH:MM AM/PM"
            required
          />
        </div>
      </div>
    </div>
  );
};

export default MeetingTimeFields;
