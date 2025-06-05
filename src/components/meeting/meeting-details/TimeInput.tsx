
import {
  Input,
  Field,
  makeStyles,
  tokens,
} from '@fluentui/react-components';
import { Clock20Regular } from '@fluentui/react-icons';
import { useState, useEffect } from 'react';

const useStyles = makeStyles({
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalXS,
  },
});

interface TimeInputProps {
  label?: string;
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  required?: boolean;
}

const TimeInput = ({ label, value = '', onChange, placeholder = "9:00 AM", required }: TimeInputProps) => {
  const styles = useStyles();
  const [displayValue, setDisplayValue] = useState(value);

  useEffect(() => {
    setDisplayValue(value);
  }, [value]);

  const parseAndFormatTime = (input: string): string => {
    if (!input.trim()) return '';

    // Remove any extra spaces and normalize
    const cleaned = input.trim().toLowerCase();
    
    // Handle various formats: 9, 9am, 9:00, 9:00am, 21:00, etc.
    const timeRegex = /^(\d{1,2}):?(\d{0,2})\s*(am|pm|a|p)?$/i;
    const match = cleaned.match(timeRegex);
    
    if (!match) return input; // Return original if no match
    
    let hours = parseInt(match[1]);
    let minutes = parseInt(match[2] || '0');
    let period = match[3];
    
    // Handle 24-hour format conversion
    if (!period && hours > 12) {
      period = 'pm';
      hours = hours - 12;
    } else if (!period) {
      period = hours < 12 ? 'am' : 'pm';
      if (hours === 0) hours = 12;
    }
    
    // Normalize period
    if (period) {
      period = period.charAt(0).toLowerCase() === 'a' ? 'AM' : 'PM';
    }
    
    // Handle 12-hour format edge cases
    if (period === 'AM' && hours === 12) hours = 12;
    if (period === 'PM' && hours === 12) hours = 12;
    
    // Validate ranges
    if (hours < 1 || hours > 12) hours = 9;
    if (minutes < 0 || minutes > 59) minutes = 0;
    
    return `${hours}:${minutes.toString().padStart(2, '0')} ${period}`;
  };

  const handleChange = (newValue: string) => {
    setDisplayValue(newValue);
  };

  const handleBlur = () => {
    const formatted = parseAndFormatTime(displayValue);
    setDisplayValue(formatted);
    onChange?.(formatted);
  };

  return (
    <Field label={label} required={required} className={styles.field}>
      <Input
        appearance="underline"
        type="text"
        value={displayValue}
        onChange={(_, data) => handleChange(data.value)}
        onBlur={handleBlur}
        placeholder={placeholder}
        contentBefore={<Clock20Regular />}
      />
    </Field>
  );
};

export default TimeInput;
