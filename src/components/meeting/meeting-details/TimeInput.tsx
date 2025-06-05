
import React, { useState, useRef, useEffect, KeyboardEvent, ChangeEvent } from 'react';
import { Input, Field, makeStyles, tokens } from '@fluentui/react-components';
import { ArrowRight16Regular } from '@fluentui/react-icons';

const useStyles = makeStyles({
  timeInput: {
    fontFamily: 'monospace',
    letterSpacing: '0.5px',
  },
  dualTimeContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalXS,
    width: '100%',
  },
  timeInputWrapper: {
    flex: 1,
  },
  arrowIcon: {
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
  endPlaceholder?: string;
  label?: string;
  required?: boolean;
  dualMode?: boolean;
}

const TimeInput = ({ 
  value = '', 
  endValue = '',
  onChange, 
  onEndChange,
  placeholder = 'HH:MM AM/PM',
  endPlaceholder = 'HH:MM AM/PM',
  label, 
  required,
  dualMode = false
}: TimeInputProps) => {
  const styles = useStyles();
  const startInputRef = useRef<HTMLInputElement>(null);
  const endInputRef = useRef<HTMLInputElement>(null);
  const [startDisplayValue, setStartDisplayValue] = useState(value || '');
  const [endDisplayValue, setEndDisplayValue] = useState(endValue || '');

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

  const createKeyDownHandler = (isEndTime: boolean) => (e: KeyboardEvent<HTMLInputElement>) => {
    const input = isEndTime ? endInputRef.current : startInputRef.current;
    if (!input) return;

    const position = input.selectionStart || 0;
    const displayValue = isEndTime ? endDisplayValue : startDisplayValue;
    const section = getCurrentSection(position, displayValue);
    const parsed = parseTime(displayValue);

    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      e.preventDefault();
      
      if (!parsed) {
        // Set default time if no valid time
        const defaultTime = '12:00 AM';
        if (isEndTime) {
          setEndDisplayValue(defaultTime);
          onEndChange?.(defaultTime);
        } else {
          setStartDisplayValue(defaultTime);
          onChange?.(defaultTime);
        }
        return;
      }

      // Reversed: ArrowDown increments, ArrowUp decrements
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
        setEndDisplayValue(newTime);
        onEndChange?.(newTime);
      } else {
        setStartDisplayValue(newTime);
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

  const createChangeHandler = (isEndTime: boolean) => (e: ChangeEvent<HTMLInputElement>) => {
    let inputValue = e.target.value;
    const position = e.target.selectionStart || 0;

    // Remove any non-digit, non-colon, non-space, non-A, non-M, non-P characters
    inputValue = inputValue.replace(/[^0-9:AMP\s]/gi, '');

    // Auto-format as user types
    if (inputValue.length >= 2 && !inputValue.includes(':')) {
      inputValue = inputValue.slice(0, 2) + ':' + inputValue.slice(2);
    }

    // Convert to uppercase for AM/PM
    inputValue = inputValue.toUpperCase();

    if (isEndTime) {
      setEndDisplayValue(inputValue);
    } else {
      setStartDisplayValue(inputValue);
    }

    // Validate and call onChange only if it's a complete time
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

  const createBlurHandler = (isEndTime: boolean) => () => {
    const displayValue = isEndTime ? endDisplayValue : startDisplayValue;
    const parsed = parseTime(displayValue);
    if (parsed) {
      const formattedTime = formatTime(parsed.hours, parsed.minutes, parsed.period);
      if (formattedTime !== displayValue) {
        if (isEndTime) {
          setEndDisplayValue(formattedTime);
          onEndChange?.(formattedTime);
        } else {
          setStartDisplayValue(formattedTime);
          onChange?.(formattedTime);
        }
      }
    }
  };

  useEffect(() => {
    setStartDisplayValue(value || '');
  }, [value]);

  useEffect(() => {
    setEndDisplayValue(endValue || '');
  }, [endValue]);

  const renderTimeInput = (
    inputValue: string,
    inputRef: React.RefObject<HTMLInputElement>,
    placeholder: string,
    isEndTime: boolean
  ) => (
    <Input
      ref={inputRef}
      value={inputValue}
      onChange={createChangeHandler(isEndTime)}
      onKeyDown={createKeyDownHandler(isEndTime)}
      onBlur={createBlurHandler(isEndTime)}
      placeholder={placeholder}
      className={styles.timeInput}
      maxLength={8}
    />
  );

  if (dualMode) {
    const content = (
      <div className={styles.dualTimeContainer}>
        <div className={styles.timeInputWrapper}>
          {renderTimeInput(startDisplayValue, startInputRef, placeholder, false)}
        </div>
        <ArrowRight16Regular className={styles.arrowIcon} />
        <div className={styles.timeInputWrapper}>
          {renderTimeInput(endDisplayValue, endInputRef, endPlaceholder, true)}
        </div>
      </div>
    );

    if (label) {
      return (
        <Field label={label} required={required}>
          {content}
        </Field>
      );
    }

    return content;
  }

  // Single mode (existing behavior)
  const singleInput = renderTimeInput(startDisplayValue, startInputRef, placeholder, false);

  if (label) {
    return (
      <Field label={label} required={required}>
        {singleInput}
      </Field>
    );
  }

  return singleInput;
};

export default TimeInput;
