
import {
  Field,
  makeStyles,
  tokens,
  Input,
} from '@fluentui/react-components';
import { DatePicker } from '@fluentui/react-datepicker-compat';
import { ArrowRight20Regular, Calendar20Regular } from '@fluentui/react-icons';
import { FormData } from '../types';
import TimeInput from './TimeInput';
import MeetingFieldWithIcon from './MeetingFieldWithIcon';

const useStyles = makeStyles({
  timeFieldsContainer: {
    display: 'flex',
    gap: tokens.spacingHorizontalM,
    alignItems: 'center',
  },
  fieldGroup: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  timeFieldsRow: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalS,
    flex: 2, // Takes 2/3 of the space compared to date field
  },
  dateField: {
    flex: 1, // Takes 1/3 of the space
  },
  timeField: {
    flex: 1,
  },
  arrowContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0 8px',
    color: tokens.colorNeutralForeground2,
  },
  dateInput: {
    '& input': {
      borderBottom: `1px solid ${tokens.colorNeutralStroke1}`,
      borderTop: 'none',
      borderLeft: 'none',
      borderRight: 'none',
      borderRadius: '0',
      paddingLeft: '0',
      paddingRight: '0',
    },
    '& button': {
      display: 'none !important',
    },
    '& svg': {
      display: 'none !important',
    },
    '& [data-icon-name]': {
      display: 'none !important',
    },
    '& .ms-DatePicker-event--without-label': {
      display: 'none !important',
    },
    '& .ms-Icon': {
      display: 'none !important',
    },
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
      const dateStr = date.toISOString().slice(0, 10); // YYYY-MM-DD format
      onInputChange('startDate', dateStr);
    }
  };

  const handleStartTimeChange = (timeValue: string) => {
    onInputChange('startTime', timeValue);
  };

  const handleEndTimeChange = (timeValue: string) => {
    onInputChange('endTime', timeValue);
  };

  // Parse the date from startDate if it exists
  const getDateValue = () => {
    if (formData.startDate) {
      const date = new Date(formData.startDate);
      return isNaN(date.getTime()) ? undefined : date;
    }
    return undefined;
  };

  return (
    <MeetingFieldWithIcon icon={<Calendar20Regular />}>
      <div className={styles.timeFieldsContainer}>
        <div className={styles.fieldGroup}>
          <Field required className={styles.dateField}>
            <DatePicker
              appearance="underline"
              placeholder="Select date"
              value={getDateValue()}
              onSelectDate={handleDateChange}
              formatDate={(date) => date ? date.toLocaleDateString() : ''}
              showMonthPickerAsOverlay={true}
              className={styles.dateInput}
              showGoToToday={false}
              allowTextInput={false}
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
