
import {
  Field,
  makeStyles,
  tokens,
  Dropdown,
  Option,
  Input,
} from '@fluentui/react-components';
import { DatePicker } from '@fluentui/react-datepicker-compat';
import { Clock20Regular, Calendar20Regular, ChevronDown20Regular } from '@fluentui/react-icons';
import { FormData } from '../types';

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
  timeInputContainer: {
    position: 'relative',
    flex: 1,
  },
  timeInput: {
    flex: 1,
  },
  timeDropdownContainer: {
    display: 'flex',
    gap: tokens.spacingHorizontalXS,
    marginTop: tokens.spacingVerticalXS,
  },
  timeDropdown: {
    minWidth: '60px',
  },
  ampmDropdown: {
    minWidth: '55px',
  },
});

interface MeetingTimeFieldsProps {
  formData: FormData;
  onInputChange: (field: keyof FormData, value: string) => void;
}

const MeetingTimeFields = ({ formData, onInputChange }: MeetingTimeFieldsProps) => {
  const styles = useStyles();

  // Generate hour options (1-12)
  const hourOptions = Array.from({ length: 12 }, (_, i) => (i + 1).toString());
  
  // Generate minute options (00, 05, 15, 30, 45, 55)
  const minuteOptions = ['00', '05', '15', '30', '45', '55'];
  
  // AM/PM options
  const ampmOptions = ['AM', 'PM'];

  const parseDateTime = (dateTimeStr: string) => {
    if (!dateTimeStr) return { date: undefined, hour: '9', minute: '00', ampm: 'AM', displayTime: '' };
    
    const date = new Date(dateTimeStr);
    const hour = date.getHours();
    const displayHour = hour === 0 ? '12' : hour > 12 ? (hour - 12).toString() : hour.toString();
    const minute = date.getMinutes().toString().padStart(2, '0');
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayTime = `${displayHour}:${minute}${ampm}`;
    
    return {
      date,
      hour: displayHour,
      minute,
      ampm,
      displayTime
    };
  };

  const constructDateTime = (date: Date | undefined, hour: string, minute: string, ampm: string) => {
    if (!date) return '';
    
    let hour24 = parseInt(hour);
    if (ampm === 'PM' && hour24 !== 12) hour24 += 12;
    if (ampm === 'AM' && hour24 === 12) hour24 = 0;
    
    const newDate = new Date(date);
    newDate.setHours(hour24, parseInt(minute), 0, 0);
    
    return newDate.toISOString().slice(0, 16);
  };

  const parseTimeInput = (timeStr: string) => {
    // Handle formats like "9:00PM", "9:00 PM", "9PM", etc.
    const timeRegex = /^(\d{1,2}):?(\d{0,2})\s*(AM|PM)?$/i;
    const match = timeStr.trim().match(timeRegex);
    
    if (!match) return null;
    
    let hour = match[1];
    let minute = match[2] || '00';
    let ampm = match[3]?.toUpperCase() || 'AM';
    
    // Validate hour (1-12)
    const hourNum = parseInt(hour);
    if (hourNum < 1 || hourNum > 12) return null;
    
    // Validate minute
    const minuteNum = parseInt(minute);
    if (minuteNum < 0 || minuteNum > 59) return null;
    
    return { hour, minute, ampm };
  };

  const handleDateChange = (field: 'startTime' | 'endTime', date: Date | null | undefined) => {
    if (!date) return;
    
    const current = parseDateTime(formData[field]);
    const newDateTime = constructDateTime(date, current.hour, current.minute, current.ampm);
    onInputChange(field, newDateTime);
  };

  const handleTimeInputChange = (field: 'startTime' | 'endTime', timeStr: string) => {
    const current = parseDateTime(formData[field]);
    const currentDate = current.date || new Date();
    
    const parsed = parseTimeInput(timeStr);
    if (parsed) {
      const newDateTime = constructDateTime(currentDate, parsed.hour, parsed.minute, parsed.ampm);
      onInputChange(field, newDateTime);
    }
  };

  const handleTimeDropdownChange = (field: 'startTime' | 'endTime', timeType: 'hour' | 'minute' | 'ampm', value: string) => {
    const current = parseDateTime(formData[field]);
    const currentDate = current.date || new Date();
    
    const newTime = {
      hour: timeType === 'hour' ? value : current.hour,
      minute: timeType === 'minute' ? value : current.minute,
      ampm: timeType === 'ampm' ? value : current.ampm,
    };
    
    const newDateTime = constructDateTime(currentDate, newTime.hour, newTime.minute, newTime.ampm);
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
        <div className={styles.timeFieldWithIcon}>
          <div className={styles.iconContainer}>
            <Clock20Regular />
          </div>
          <div className={styles.timeInputContainer}>
            <Field className={styles.timeInput}>
              <Input
                appearance="underline"
                type="text"
                value={startTime.displayTime}
                onChange={(_, data) => handleTimeInputChange('startTime', data.value)}
                placeholder="9:00AM"
              />
            </Field>
            <div className={styles.timeDropdownContainer}>
              <Dropdown
                className={styles.timeDropdown}
                value={startTime.hour}
                selectedOptions={[startTime.hour]}
                onOptionSelect={(_, data) => handleTimeDropdownChange('startTime', 'hour', data.optionValue || '9')}
              >
                {hourOptions.map(hour => (
                  <Option key={hour} value={hour}>{hour}</Option>
                ))}
              </Dropdown>
              <Dropdown
                className={styles.timeDropdown}
                value={startTime.minute}
                selectedOptions={[startTime.minute]}
                onOptionSelect={(_, data) => handleTimeDropdownChange('startTime', 'minute', data.optionValue || '00')}
              >
                {minuteOptions.map(minute => (
                  <Option key={minute} value={minute}>{minute}</Option>
                ))}
              </Dropdown>
              <Dropdown
                className={styles.ampmDropdown}
                value={startTime.ampm}
                selectedOptions={[startTime.ampm]}
                onOptionSelect={(_, data) => handleTimeDropdownChange('startTime', 'ampm', data.optionValue || 'AM')}
              >
                {ampmOptions.map(period => (
                  <Option key={period} value={period}>{period}</Option>
                ))}
              </Dropdown>
            </div>
          </div>
        </div>
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
        <div className={styles.timeFieldWithIcon}>
          <div className={styles.iconContainer}>
            <Clock20Regular />
          </div>
          <div className={styles.timeInputContainer}>
            <Field className={styles.timeInput}>
              <Input
                appearance="underline"
                type="text"
                value={endTime.displayTime}
                onChange={(_, data) => handleTimeInputChange('endTime', data.value)}
                placeholder="10:00AM"
              />
            </Field>
            <div className={styles.timeDropdownContainer}>
              <Dropdown
                className={styles.timeDropdown}
                value={endTime.hour}
                selectedOptions={[endTime.hour]}
                onOptionSelect={(_, data) => handleTimeDropdownChange('endTime', 'hour', data.optionValue || '10')}
              >
                {hourOptions.map(hour => (
                  <Option key={hour} value={hour}>{hour}</Option>
                ))}
              </Dropdown>
              <Dropdown
                className={styles.timeDropdown}
                value={endTime.minute}
                selectedOptions={[endTime.minute]}
                onOptionSelect={(_, data) => handleTimeDropdownChange('endTime', 'minute', data.optionValue || '00')}
              >
                {minuteOptions.map(minute => (
                  <Option key={minute} value={minute}>{minute}</Option>
                ))}
              </Dropdown>
              <Dropdown
                className={styles.ampmDropdown}
                value={endTime.ampm}
                selectedOptions={[endTime.ampm]}
                onOptionSelect={(_, data) => handleTimeDropdownChange('endTime', 'ampm', data.optionValue || 'AM')}
              >
                {ampmOptions.map(period => (
                  <Option key={period} value={period}>{period}</Option>
                ))}
              </Dropdown>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MeetingTimeFields;
