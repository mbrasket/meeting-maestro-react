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
    borderTopWidth: '1px',
    borderRightWidth: '1px',
    borderBottomWidth: '1px',
    borderLeftWidth: '1px',
    borderTopStyle: 'solid',
    borderRightStyle: 'solid',
    borderBottomStyle: 'solid',
    borderLeftStyle: 'solid',
    borderTopColor: tokens.colorNeutralStroke1,
    borderRightColor: tokens.colorNeutralStroke1,
    borderBottomColor: tokens.colorNeutralStroke1,
    borderLeftColor: tokens.colorNeutralStroke1,
    borderRadius: tokens.borderRadiusSmall,
    backgroundColor: tokens.colorNeutralBackground1,
    '&:focus-within': {
      borderTopColor: tokens.colorBrandStroke1,
      borderRightColor: tokens.colorBrandStroke1,
      borderBottomColor: tokens.colorBrandStroke1,
      borderLeftColor: tokens.colorBrandStroke1,
      borderTopWidth: '2px',
      borderRightWidth: '2px',
      borderBottomWidth: '2px',
      borderLeftWidth: '2px',
    },
  },
  dualTimeInput: {
    fontFamily: 'monospace',
    letterSpacing: '0.5px',
    border: 'none',
    backgroundColor: 'transparent',
    padding: '4px 0',
    width: '90px',
    textAlign: 'center',
    '&:focus': {
      outline: 'none',
    },
  },
  arrowSeparator: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: '8px',
    paddingRight: '8px',
    color: tokens.colorNeutralForeground2,
    flexShrink: 0,
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

// Helper function to get next half hour
const getNextHalfHour = (addHours = 0) => {
  const now = new Date();
  now.setHours(now.getHours() + addHours);
  const minutes = now.getMinutes();
  const roundedMinutes = minutes <= 30 ? 30 : 60;
  
  if (roundedMinutes === 60) {
    now.setHours(now.getHours() + 1);
    now.setMinutes(0);
  } else {
    now.setMinutes(roundedMinutes);
  }
  
  const hours = now.getHours();
  const displayHours = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
  const period = hours >= 12 ? 'PM' : 'AM';
  
  return `${displayHours.toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')} ${period}`;
};

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
  
  // Set default values if not provided
  const defaultStartTime = value || getNextHalfHour();
  const defaultEndTime = endValue || getNextHalfHour(1);
  
  // For single mode, use the existing value
  const [displayValue, setDisplayValue] = useState(value || defaultStartTime);
  
  // Initialize with defaults if values are empty
  useEffect(() => {
    if (isDual && !value && onChange) {
      onChange(defaultStartTime);
    }
    if (isDual && !endValue && onEndChange) {
      onEndChange(defaultEndTime);
    }
  }, [isDual, value, endValue, onChange, onEndChange, defaultStartTime, defaultEndTime]);

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

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, isEndTime: boolean) => {
    const input = e.currentTarget;
    const position = input.selectionStart || 0;
    const currentValue = isEndTime ? (endValue || defaultEndTime) : (isDual ? (value || defaultStartTime) : displayValue);
    const section = getCurrentSection(position, currentValue);

    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      e.preventDefault();
      
      const parsed = parseTime(currentValue);
      if (!parsed) {
        const defaultTime = '12:00 AM';
        if (isDual) {
          if (isEndTime) {
            onEndChange?.(defaultTime);
          } else {
            onChange?.(defaultTime);
          }
        } else {
          setDisplayValue(defaultTime);
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
      
      if (isDual) {
        if (isEndTime) {
          onEndChange?.(newTime);
        } else {
          onChange?.(newTime);
        }
      } else {
        setDisplayValue(newTime);
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

  const handleChange = (e: ChangeEvent<HTMLInputElement>, isEndTime: boolean) => {
    let inputValue = e.target.value;

    // Remove any non-digit, non-colon, non-space, non-A, non-M, non-P characters
    inputValue = inputValue.replace(/[^0-9:AMP\s]/gi, '');

    // Convert to uppercase for AM/PM
    inputValue = inputValue.toUpperCase();

    if (isDual) {
      if (isEndTime) {
        onEndChange?.(inputValue);
      } else {
        onChange?.(inputValue);
      }
    } else {
      setDisplayValue(inputValue);
      onChange?.(inputValue);
    }
  };

  const handleBlur = (isEndTime: boolean) => {
    const currentValue = isEndTime ? (endValue || defaultEndTime) : (isDual ? (value || defaultStartTime) : displayValue);
    const parsed = parseTime(currentValue);
    if (parsed) {
      const formattedTime = formatTime(parsed.hours, parsed.minutes, parsed.period);
      if (formattedTime !== currentValue) {
        if (isDual) {
          if (isEndTime) {
            onEndChange?.(formattedTime);
          } else {
            onChange?.(formattedTime);
          }
        } else {
          setDisplayValue(formattedTime);
          onChange?.(formattedTime);
        }
      }
    }
  };

  useEffect(() => {
    if (!isDual) {
      setDisplayValue(value || defaultStartTime);
    }
  }, [value, isDual, defaultStartTime]);

  const inputComponent = isDual ? (
    <div className={styles.dualTimeContainer}>
      <Input
        ref={startInputRef}
        value={value || defaultStartTime}
        onChange={(e) => handleChange(e, false)}
        onKeyDown={(e) => handleKeyDown(e, false)}
        onBlur={() => handleBlur(false)}
        placeholder="12:00 AM"
        className={styles.dualTimeInput}
        maxLength={8}
      />
      <div className={styles.arrowSeparator}>
        <ArrowRight16Regular />
      </div>
      <Input
        ref={endInputRef}
        value={endValue || defaultEndTime}
        onChange={(e) => handleChange(e, true)}
        onKeyDown={(e) => handleKeyDown(e, true)}
        onBlur={() => handleBlur(true)}
        placeholder="01:00 PM"
        className={styles.dualTimeInput}
        maxLength={8}
      />
    </div>
  ) : (
    <Input
      value={displayValue}
      onChange={(e) => handleChange(e, false)}
      onKeyDown={(e) => handleKeyDown(e, false)}
      onBlur={() => handleBlur(false)}
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
