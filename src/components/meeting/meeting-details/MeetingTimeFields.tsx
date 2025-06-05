
import {
  Field,
  makeStyles,
  tokens,
  Input,
  Button,
  Popover,
  PopoverTrigger,
  PopoverSurface,
} from '@fluentui/react-components';
import { ArrowRight20Regular, Calendar20Regular } from '@fluentui/react-icons';
import { DatePicker } from '@fluentui/react-datepicker-compat';
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
  },
  timeField: {
    flex: 1,
    minWidth: '120px',
  },
  arrowContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: tokens.colorNeutralForeground2,
    flex: '0 0 auto',
  },
  datePickerButton: {
    width: '100%',
    justifyContent: 'flex-start',
    border: 'none',
    borderBottom: `1px solid ${tokens.colorNeutralStroke1}`,
    borderRadius: '0',
    padding: `${tokens.spacingVerticalXS} 0`,
    backgroundColor: 'transparent',
    '&:hover': {
      backgroundColor: 'transparent',
      borderBottomColor: tokens.colorNeutralStroke1Hover,
    },
    '&:focus': {
      borderBottomColor: tokens.colorBrandStroke1,
    },
  },
  datePickerPopover: {
    padding: tokens.spacingVerticalS,
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
      const newValue = date.toISOString().split('T')[0];
      onInputChange('startDate', newValue);
    }
  };

  const handleStartTimeChange = (timeValue: string) => {
    onInputChange('startTime', timeValue);
  };

  const handleEndTimeChange = (timeValue: string) => {
    onInputChange('endTime', timeValue);
  };

  // Convert string date to Date object for DatePicker
  const selectedDate = formData.startDate ? new Date(formData.startDate) : undefined;

  // Format date for display
  const formatDateForDisplay = (dateStr: string) => {
    if (!dateStr) return 'Select date';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  return (
    <MeetingFieldWithIcon icon={<Calendar20Regular />}>
      <div className={styles.timeFieldsContainer}>
        <Field required className={styles.dateField}>
          <Popover>
            <PopoverTrigger disableButtonEnhancement>
              <Button
                appearance="subtle"
                className={styles.datePickerButton}
              >
                {formatDateForDisplay(formData.startDate)}
              </Button>
            </PopoverTrigger>
            <PopoverSurface className={styles.datePickerPopover}>
              <DatePicker
                value={selectedDate}
                onSelectDate={handleDateChange}
                placeholder="Select a date"
                ariaLabel="Select a date"
              />
            </PopoverSurface>
          </Popover>
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
