
import React, { useState, useRef, useEffect, KeyboardEvent, ChangeEvent } from 'react';
import { Input, Field, makeStyles, tokens } from '@fluentui/react-components';

const useStyles = makeStyles({
  timeInput: {
    fontFamily: 'monospace',
    letterSpacing: '0.5px',
    paddingLeft: '12px',
    paddingRight: '12px',
    textAlign: 'left',
  },
});

interface TimeInputProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  label?: string;
  required?: boolean;
}

const TimeInput = ({ value = '', onChange, placeholder = 'HH:MM AM/PM', label, required }: TimeInputProps) => {
  const styles = useStyles();
  const inputRef = useRef<HTMLInputElement>(null);
  const [displayValue, setDisplayValue] = useState(value || '');

  // Get default time (next half hour from now)
  const getDefaultTime = (offsetHours = 0) => {
    const now = new Date();
    now.setHours(now.getHours() + offsetHours);
    const minutes = now.getMinutes() <= 30 ? 30 : 0;
    if (minutes === 0) {
      now.setHours(now.getHours() + 1);
    }
    now.setMinutes(minutes);
    
    let hours = now.getHours();
    const period = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${period}`;
  };

  // Initialize with default time if no value provided
  useEffect(() => {
    if (!value && !displayValue) {
      const defaultTime = getDefaultTime();
      setDisplayValue(defaultTime);
      onChange?.(defaultTime);
    } else {
      setDisplayValue(value || '');
    }
  }, [value]);

  // Parse time string to get components
  const parseTime = (timeStr: string) => {
    const match = timeStr.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
    if (match) {
      return {
        hours: parseInt(match[1], 10),
        minutes: parseInt(match[2], 10),
        period: match[3].toUpperCase() as 'AM' | 'PM'
      };
    }
    return null;
  };

  // Format time components to string
  const formatTime = (hours: number, minutes: number, period: 'AM' | 'PM') => {
    const h = hours.toString().padStart(2, '0');
    const m = minutes.toString().padStart(2, '0');
    return `${h}:${m} ${period}`;
  };

  // Determine which section cursor is in
  const getCurrentSection = (position: number) => {
    if (position <= 2) return 'hours';
    if (position >= 3 && position <= 5) return 'minutes';
    if (position >= 6) return 'period';
    return 'hours';
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    const input = inputRef.current;
    if (!input) return;

    const position = input.selectionStart || 0;
    const section = getCurrentSection(position);
    const parsed = parseTime(displayValue);

    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      e.preventDefault();
      
      if (!parsed) {
        const defaultTime = getDefaultTime();
        setDisplayValue(defaultTime);
        onChange?.(defaultTime);
        return;
      }

      const direction = e.key === 'ArrowUp' ? 'up' : 'down';
      let newHours = parsed.hours;
      let newMinutes = parsed.minutes;
      let newPeriod = parsed.period;

      if (section === 'hours') {
        if (direction === 'up') {
          newHours = newHours === 12 ? 1 : newHours + 1;
        } else {
          newHours = newHours === 1 ? 12 : newHours - 1;
        }
      } else if (section === 'minutes') {
        const increments = [0, 15, 30, 45];
        const currentIndex = increments.findIndex(m => m >= parsed.minutes);
        if (direction === 'up') {
          newMinutes = currentIndex < increments.length - 1 
            ? increments[currentIndex + 1] 
            : increments[0];
        } else {
          newMinutes = currentIndex > 0 
            ? increments[currentIndex - 1] 
            : increments[increments.length - 1];
        }
      } else if (section === 'period') {
        newPeriod = parsed.period === 'AM' ? 'PM' : 'AM';
      }

      const newTime = formatTime(newHours, newMinutes, newPeriod);
      setDisplayValue(newTime);
      onChange?.(newTime);

      setTimeout(() => {
        if (input) {
          input.setSelectionRange(position, position);
        }
      }, 0);
    }

    // Handle digit input for overwrite behavior
    if (/^\d$/.test(e.key)) {
      e.preventDefault();
      const digit = e.key;
      let newValue = displayValue;
      
      if (section === 'hours' && position <= 1) {
        const digitIndex = position;
        newValue = newValue.substring(0, digitIndex) + digit + newValue.substring(digitIndex + 1);
      } else if (section === 'minutes' && position >= 3 && position <= 4) {
        const digitIndex = position;
        newValue = newValue.substring(0, digitIndex) + digit + newValue.substring(digitIndex + 1);
      }
      
      setDisplayValue(newValue);
      const parsed = parseTime(newValue);
      if (parsed && parsed.hours >= 1 && parsed.hours <= 12 && 
          parsed.minutes >= 0 && parsed.minutes <= 59) {
        onChange?.(newValue);
      }
      
      setTimeout(() => {
        if (input) {
          input.setSelectionRange(position + 1, position + 1);
        }
      }, 0);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    // Only allow controlled changes through keyboard events
    // This prevents issues with cursor positioning
  };

  const handleBlur = () => {
    const parsed = parseTime(displayValue);
    if (parsed) {
      const formattedTime = formatTime(parsed.hours, parsed.minutes, parsed.period);
      if (formattedTime !== displayValue) {
        setDisplayValue(formattedTime);
        onChange?.(formattedTime);
      }
    }
  };

  const inputComponent = (
    <Input
      ref={inputRef}
      value={displayValue}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      onBlur={handleBlur}
      placeholder={placeholder}
      className={styles.timeInput}
      maxLength={8}
    />
  );

  if (label) {
    return (
      <Field label={label} required={required}>
        {inputComponent}
      </Field>
    );
  }

  return inputComponent;
};

export default TimeInput;
