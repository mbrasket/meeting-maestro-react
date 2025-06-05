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
    gap: tokens.spacingHorizontalS,
    alignItems: 'center',
    width: '100%',
  },
  fieldGroup: {
    display: 'flex',
    flexDirection: 'column',
  },
  timeFieldsRow: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalXS,
    flex: 1,
  },
  dateField: {
    width: '120px', // Fixed narrow width for date
  },
  timeField: {
    width: '90px', // Fixed narrow width for time inputs
  },
  arrowContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0 4px',
    color: tokens.colorNeutralForeground2,
  },
  dateInput: {
    width: '100%',
    '& input': {
      border: 'none',
      borderBottom: `1px solid ${tokens.colorNeutralStroke1}`,
      borderRadius: '0',
      padding: `${tokens.spacingVerticalXS} 0`,
      backgroundColor: 'transparent',
      fontSize: tokens.fontSizeBase300,
      lineHeight: tokens.lineHeightBase300,
      minHeight: '32px',
      width: '100%',
    },
    '& input:focus': {
      borderBottomColor: tokens.colorBrandStroke1,
      outline: 'none',
      boxShadow: 'none',
    },
    '& input:hover': {
      borderBottomColor: tokens.colorNeutralStroke1Hover,
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
    '& .fui-CalendarDayGrid__button': {
      display: 'none !important',
    },
    '& [role="button"]': {
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
