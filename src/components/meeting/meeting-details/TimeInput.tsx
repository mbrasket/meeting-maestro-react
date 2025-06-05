
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
  
  return `${displayHours.toString().padStart(2, '0')}${now.getMinutes().toString().padStart(2, '0')} ${period}`;
};

const TimeInput = ({ 
  value = '', 
  endValue = '',
  onChange, 
  onEndChange,
  placeholder = 'HHMM AM/PM', 
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

  // Parse time string to get components (expecting HHMM AM/PM format)
  const parseTime = (timeStr: string) => {
    const match = timeStr.match(/^(\d{1,4})\s*(AM|PM)$/i);
    if (match) {
      const timeDigits = match[1].padStart(4, '0');
      const hours = parseInt(timeDigits.substring(0, 2), 10);
      const minutes = parseInt(timeDigits.substring(2, 4), 10);
      return {
        hours: hours === 0 ? 12 : hours > 12 ? hours - 12 : hours,
        minutes,
        period: match[2].toUpperCase() as 'AM' | 'PM'
      };
    }
    return null;
  };

  // Format time components to string (HHMM AM/PM format)
  const formatTime = (hours: number, minutes: number, period: 'AM' | 'PM') => {
    const h = hours.toString().padStart(2, '0');
    const m = minutes.toString().padStart(2, '0');
    return `${h}${m} ${period}`;
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, isEndTime: boolean) => {
    const input = e.currentTarget;
    const position = input.selectionStart || 0;
    const currentValue = isEndTime ? (endValue || defaultEndTime) : (isDual ? (value || defaultStartTime) : displayValue);

    // Handle digit input with overwrite behavior
    if (/\d/.test(e.key)) {
      e.preventDefault();
      
      const digits = currentValue.replace(/[^\d]/g, '').padStart(4, '0');
      const period = currentValue.includes('PM') ? 'PM' : 'AM';
      
      let newDigits = digits;
      
      // Determine which digit position to replace based on cursor position
      if (position <= 1) {
        // First digit (tens of hours)
        newDigits = e.key + digits.substring(1);
      } else if (position <= 2) {
        // Second digit (units of hours)
        newDigits = digits.substring(0, 1) + e.key + digits.substring(2);
      } else if (position <= 3) {
        // Third digit (tens of minutes)
        newDigits = digits.substring(0, 2) + e.key + digits.substring(3);
      } else if (position <= 4) {
        // Fourth digit (units of minutes)
        newDigits = digits.substring(0, 3) + e.key;
      }
      
      // Validate the time
      const hours = parseInt(newDigits.substring(0, 2), 10);
      const minutes = parseInt(newDigits.substring(2, 4), 10);
      
      if (hours >= 1 && hours <= 12 && minutes >= 0 && minutes <= 59) {
        const newTime = `${newDigits} ${period}`;
        
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
        
        // Move cursor to next position
        setTimeout(() => {
          const nextPos = Math.min(position + 1, 4);
          input.setSelectionRange(nextPos, nextPos);
        }, 0);
      }
    }
    
    // Handle AM/PM toggle
    else if (e.key.toLowerCase() === 'a' || e.key.toLowerCase() === 'p') {
      e.preventDefault();
      const period = e.key.toLowerCase() === 'a' ? 'AM' : 'PM';
      const digits = currentValue.replace(/[^\d]/g, '').padStart(4, '0');
      const newTime = `${digits} ${period}`;
      
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
    }
    
    // Handle backspace
    else if (e.key === 'Backspace') {
      e.preventDefault();
      const digits = currentValue.replace(/[^\d]/g, '').padStart(4, '0');
      const period = currentValue.includes('PM') ? 'PM' : 'AM';
      
      let newDigits = digits;
      if (position > 0) {
        const replacePos = Math.max(0, position - 1);
        newDigits = digits.substring(0, replacePos) + '0' + digits.substring(replacePos + 1);
      }
      
      const newTime = `${newDigits} ${period}`;
      
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
      
      setTimeout(() => {
        const newPos = Math.max(0, position - 1);
        input.setSelectionRange(newPos, newPos);
      }, 0);
    }
    
    // Handle arrow keys for navigation
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      // Allow default navigation behavior
    }
    
    // Prevent all other keys
    else {
      e.preventDefault();
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>, isEndTime: boolean) => {
    // Prevent normal change behavior since we handle everything in keyDown
    e.preventDefault();
  };

  const handleBlur = (isEndTime: boolean) => {
    const currentValue = isEndTime ? (endValue || defaultEndTime) : (isDual ? (value || defaultStartTime) : displayValue);
    const digits = currentValue.replace(/[^\d]/g, '').padStart(4, '0');
    const period = currentValue.includes('PM') ? 'PM' : 'AM';
    
    // Validate and format
    const hours = parseInt(digits.substring(0, 2), 10);
    const minutes = parseInt(digits.substring(2, 4), 10);
    
    if (hours >= 1 && hours <= 12 && minutes >= 0 && minutes <= 59) {
      const formattedTime = `${digits} ${period}`;
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
        placeholder="1200 AM"
        className={styles.dualTimeInput}
        maxLength={7}
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
        placeholder="0100 PM"
        className={styles.dualTimeInput}
        maxLength={7}
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
      maxLength={7}
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
