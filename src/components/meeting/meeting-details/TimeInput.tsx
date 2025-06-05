
import React, { useState, useRef, useEffect, KeyboardEvent, ChangeEvent } from 'react';
import { Input, Field, makeStyles, tokens } from '@fluentui/react-components';
import { ArrowRight16Regular } from '@fluentui/react-icons';

const useStyles = makeStyles({
  timeInput: {
    fontFamily: 'monospace',
    letterSpacing: '0.5px',
  },
  dualTimeContainer: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    border: `1px solid ${tokens.colorNeutralStroke1}`,
    borderRadius: tokens.borderRadiusSmall,
    backgroundColor: tokens.colorNeutralBackground1,
    '&:focus-within': {
      borderColor: tokens.colorBrandStroke1,
      borderWidth: '2px',
    },
  },
  dualTimeInput: {
    fontFamily: 'monospace',
    letterSpacing: '0.5px',
    border: 'none',
    backgroundColor: 'transparent',
    '&:focus': {
      outline: 'none',
    },
  },
  arrowSeparator: {
    display: 'flex',
    alignItems: 'center',
    padding: `0 ${tokens.spacingHorizontalXS}`,
    color: tokens.colorNeutralForeground2,
  },
});

interface TimeInputProps {
  value?: string;
  endValue?: string;
  onChange?: (value: string) => void;
  onEndChange?: (value: string) => void;
  placeholder?: string;
  label?: string;
  required?: boolean;
  isDual?: boolean;
}

const TimeInput = ({ 
  value = '', 
  endValue = '',
  onChange, 
  onEndChange,
  placeholder = 'HH:MM AM/PM', 
  label, 
  required,
  isDual = false 
}: TimeInputProps) => {
  const styles = useStyles();
  const startInputRef = useRef<HTMLInputElement>(null);
  const endInputRef = useRef<HTMLInputElement>(null);
  
  // For single mode, use the existing value
  const [displayValue, setDisplayValue] = useState(value || '');
  
  // Valid minute increments
  const minuteIncrements = [0, 5, 15, 30, 45, 55];

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
  const getCurrentSection = (position: number, timeStr: string) => {
    if (position <= 2) return 'hours';
    if (position >= 3 && position <= 5) return 'minutes';
    if (position >= 6) return 'period';
    return 'hours';
  };

  // Get next/previous minute increment
  const getNextMinute = (current: number, direction: 'up' | 'down') => {
    const currentIndex = minuteIncrements.findIndex(m => m >= current);
    if (direction === 'up') {
      return currentIndex < minuteIncrements.length - 1 
        ? minuteIncrements[currentIndex + 1] 
        : minuteIncrements[0];
    } else {
      return currentIndex > 0 
        ? minuteIncrements[currentIndex - 1] 
        : minuteIncrements[minuteIncrements.length - 1];
    }
  };

  const handleSingleTimeKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    const input = e.currentTarget;
    const position = input.selectionStart || 0;
    const section = getCurrentSection(position, displayValue);

    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      e.preventDefault();
      
      const parsed = parseTime(displayValue);
      if (!parsed) {
        const defaultTime = '12:00 AM';
        setDisplayValue(defaultTime);
        onChange?.(defaultTime);
        return;
      }

      const direction = e.key === 'ArrowDown' ? 'up' : 'down';
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
        newMinutes = getNextMinute(parsed.minutes, direction);
      } else if (section === 'period') {
        newPeriod = parsed.period === 'AM' ? 'PM' : 'AM';
      }

      const newTime = formatTime(newHours, newMinutes, newPeriod);
      setDisplayValue(newTime);
      onChange?.(newTime);

      // Restore cursor position after state update
      setTimeout(() => {
        if (input) {
          input.setSelectionRange(position, position);
        }
      }, 0);
    }
  };

  const handleDualTimeKeyDown = (e: KeyboardEvent<HTMLInputElement>, isEndTime: boolean) => {
    const input = e.currentTarget;
    const position = input.selectionStart || 0;
    const currentValue = isEndTime ? endValue : value;
    const section = getCurrentSection(position, currentValue);

    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      e.preventDefault();
      
      const parsed = parseTime(currentValue);
      if (!parsed) {
        const defaultTime = '12:00 AM';
        if (isEndTime) {
          onEndChange?.(defaultTime);
        } else {
          onChange?.(defaultTime);
        }
        return;
      }

      const direction = e.key === 'ArrowDown' ? 'up' : 'down';
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
        newMinutes = getNextMinute(parsed.minutes, direction);
      } else if (section === 'period') {
        newPeriod = parsed.period === 'AM' ? 'PM' : 'AM';
      }

      const newTime = formatTime(newHours, newMinutes, newPeriod);
      if (isEndTime) {
        onEndChange?.(newTime);
      } else {
        onChange?.(newTime);
      }

      // Restore cursor position after state update
      setTimeout(() => {
        if (input) {
          input.setSelectionRange(position, position);
        }
      }, 0);
    }
  };

  const handleSingleTimeChange = (e: ChangeEvent<HTMLInputElement>) => {
    let inputValue = e.target.value;

    // Remove any non-digit, non-colon, non-space, non-A, non-M, non-P characters
    inputValue = inputValue.replace(/[^0-9:AMP\s]/gi, '');

    // Convert to uppercase for AM/PM
    inputValue = inputValue.toUpperCase();

    setDisplayValue(inputValue);

    // Single time validation
    const parsed = parseTime(inputValue);
    if (parsed && parsed.hours >= 1 && parsed.hours <= 12 && 
        parsed.minutes >= 0 && parsed.minutes <= 59) {
      onChange?.(inputValue);
    }
  };

  const handleDualTimeChange = (e: ChangeEvent<HTMLInputElement>, isEndTime: boolean) => {
    let inputValue = e.target.value;

    // Remove any non-digit, non-colon, non-space, non-A, non-M, non-P characters
    inputValue = inputValue.replace(/[^0-9:AMP\s]/gi, '');

    // Convert to uppercase for AM/PM
    inputValue = inputValue.toUpperCase();

    const parsed = parseTime(inputValue);
    if (parsed && parsed.hours >= 1 && parsed.hours <= 12 && 
        parsed.minutes >= 0 && parsed.minutes <= 59) {
      if (isEndTime) {
        onEndChange?.(inputValue);
      } else {
        onChange?.(inputValue);
      }
    }
  };

  const handleSingleTimeBlur = () => {
    const parsed = parseTime(displayValue);
    if (parsed) {
      const formattedTime = formatTime(parsed.hours, parsed.minutes, parsed.period);
      if (formattedTime !== displayValue) {
        setDisplayValue(formattedTime);
        onChange?.(formattedTime);
      }
    }
  };

  const handleDualTimeBlur = (isEndTime: boolean) => {
    const currentValue = isEndTime ? endValue : value;
    const parsed = parseTime(currentValue);
    if (parsed) {
      const formattedTime = formatTime(parsed.hours, parsed.minutes, parsed.period);
      if (formattedTime !== currentValue) {
        if (isEndTime) {
          onEndChange?.(formattedTime);
        } else {
          onChange?.(formattedTime);
        }
      }
    }
  };

  useEffect(() => {
    if (!isDual) {
      setDisplayValue(value || '');
    }
  }, [value, isDual]);

  const inputComponent = isDual ? (
    <div className={styles.dualTimeContainer}>
      <Input
        ref={startInputRef}
        value={value}
        onChange={(e) => handleDualTimeChange(e, false)}
        onKeyDown={(e) => handleDualTimeKeyDown(e, false)}
        onBlur={() => handleDualTimeBlur(false)}
        placeholder="12:00 AM"
        className={styles.dualTimeInput}
        maxLength={8}
      />
      <div className={styles.arrowSeparator}>
        <ArrowRight16Regular />
      </div>
      <Input
        ref={endInputRef}
        value={endValue}
        onChange={(e) => handleDualTimeChange(e, true)}
        onKeyDown={(e) => handleDualTimeKeyDown(e, true)}
        onBlur={() => handleDualTimeBlur(true)}
        placeholder="01:00 PM"
        className={styles.dualTimeInput}
        maxLength={8}
      />
    </div>
  ) : (
    <Input
      value={displayValue}
      onChange={handleSingleTimeChange}
      onKeyDown={handleSingleTimeKeyDown}
      onBlur={handleSingleTimeBlur}
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
