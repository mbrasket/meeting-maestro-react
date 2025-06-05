
import {
  Input,
  Field,
  Dropdown,
  Option,
  makeStyles,
  tokens,
} from '@fluentui/react-components';
import { Clock20Regular } from '@fluentui/react-icons';
import { useState, useEffect } from 'react';

const useStyles = makeStyles({
  timeContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalXS,
  },
  timeInputField: {
    flex: 1,
  },
  timeDropdowns: {
    display: 'flex',
    gap: tokens.spacingHorizontalXS,
  },
  hourDropdown: {
    minWidth: '60px',
  },
  minuteDropdown: {
    minWidth: '60px',
  },
  ampmDropdown: {
    minWidth: '55px',
  },
});

interface TimeInputProps {
  label?: string;
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
}

const TimeInput = ({ label, value = '', onChange, placeholder = "9:00AM" }: TimeInputProps) => {
  const styles = useStyles();
  
  // Generate options
  const hourOptions = Array.from({ length: 12 }, (_, i) => (i + 1).toString());
  const minuteOptions = ['00', '05', '15', '30', '45', '55'];
  const ampmOptions = ['AM', 'PM'];

  const parseTime = (timeStr: string) => {
    if (!timeStr) return { hour: '9', minute: '00', ampm: 'AM', displayTime: '' };
    
    const timeRegex = /^(\d{1,2}):?(\d{0,2})\s*(AM|PM)?$/i;
    const match = timeStr.trim().match(timeRegex);
    
    if (!match) return { hour: '9', minute: '00', ampm: 'AM', displayTime: timeStr };
    
    let hour = match[1];
    let minute = match[2] || '00';
    let ampm = match[3]?.toUpperCase() || 'AM';
    
    // Validate and normalize
    const hourNum = parseInt(hour);
    if (hourNum < 1 || hourNum > 12) hour = '9';
    
    const minuteNum = parseInt(minute);
    if (minuteNum < 0 || minuteNum > 59) minute = '00';
    
    const displayTime = `${hour}:${minute}${ampm}`;
    
    return { hour, minute, ampm, displayTime };
  };

  const constructTimeString = (hour: string, minute: string, ampm: string) => {
    return `${hour}:${minute}${ampm}`;
  };

  const [timeState, setTimeState] = useState(() => parseTime(value));

  useEffect(() => {
    setTimeState(parseTime(value));
  }, [value]);

  const handleTextInputChange = (inputValue: string) => {
    const parsed = parseTime(inputValue);
    setTimeState({ ...parsed, displayTime: inputValue });
  };

  const handleTextInputBlur = (inputValue: string) => {
    const parsed = parseTime(inputValue);
    const newTimeString = constructTimeString(parsed.hour, parsed.minute, parsed.ampm);
    setTimeState({ ...parsed, displayTime: newTimeString });
    onChange?.(newTimeString);
  };

  const handleDropdownChange = (type: 'hour' | 'minute' | 'ampm', selectedValue: string) => {
    const newState = {
      ...timeState,
      [type]: selectedValue,
    };
    
    const newTimeString = constructTimeString(newState.hour, newState.minute, newState.ampm);
    setTimeState({ ...newState, displayTime: newTimeString });
    onChange?.(newTimeString);
  };

  return (
    <div className={styles.timeContainer}>
      <Field className={styles.timeInputField}>
        <Input
          appearance="underline"
          type="text"
          value={timeState.displayTime}
          onChange={(_, data) => handleTextInputChange(data.value)}
          onBlur={(e) => handleTextInputBlur(e.target.value)}
          placeholder={placeholder}
          contentBefore={<Clock20Regular />}
        />
      </Field>
      
      <div className={styles.timeDropdowns}>
        <Dropdown
          className={styles.hourDropdown}
          value={timeState.hour}
          selectedOptions={[timeState.hour]}
          onOptionSelect={(_, data) => handleDropdownChange('hour', data.optionValue || '9')}
        >
          {hourOptions.map(hour => (
            <Option key={hour} value={hour}>{hour}</Option>
          ))}
        </Dropdown>
        
        <Dropdown
          className={styles.minuteDropdown}
          value={timeState.minute}
          selectedOptions={[timeState.minute]}
          onOptionSelect={(_, data) => handleDropdownChange('minute', data.optionValue || '00')}
        >
          {minuteOptions.map(minute => (
            <Option key={minute} value={minute}>{minute}</Option>
          ))}
        </Dropdown>
        
        <Dropdown
          className={styles.ampmDropdown}
          value={timeState.ampm}
          selectedOptions={[timeState.ampm]}
          onOptionSelect={(_, data) => handleDropdownChange('ampm', data.optionValue || 'AM')}
        >
          {ampmOptions.map(period => (
            <Option key={period} value={period}>{period}</Option>
          ))}
        </Dropdown>
      </div>
    </div>
  );
};

export default TimeInput;
