
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
  },
  dualTimeInput: {
    fontFamily: 'monospace',
    letterSpacing: '0.5px',
    paddingRight: '60px', // Space for arrow overlay
  },
  arrowOverlay: {
    position: 'absolute',
    right: '45px',
    pointerEvents: 'none',
    color: tokens.colorNeutralForeground2,
    zIndex: 1,
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
  const inputRef = useRef<HTMLInputElement>(null);
  
  // For dual mode, combine both times into one display value
  const [displayValue, setDisplayValue] = useState(() => {
    if (isDual) {
      const startTime = value || '';
      const endTime = endValue || '';
      return startTime && endTime ? `${startTime} ${endTime}` : '';
    }
    return value || '';
  });
  
  const [cursorPosition, setCursorPosition] = useState(0);

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

  // Parse dual time string
  const parseDualTime = (timeStr: string) => {
    // Expected format: "HH:MM AM/PM HH:MM AM/PM"
    const parts = timeStr.trim().split(/\s+/);
    if (parts.length >= 4) {
      const startTime = `${parts[0]} ${parts[1]}`;
      const endTime = `${parts[2]} ${parts[3]}`;
      return { startTime, endTime };
    }
    return null;
  };

  // Format time components to string
  const formatTime = (hours: number, minutes: number, period: 'AM' | 'PM') => {
    const h = hours.toString().padStart(2, '0');
    const m = minutes.toString().padStart(2, '0');
    return `${h}:${m} ${period}`;
  };

  // Determine which section cursor is in for dual mode
  const getCurrentSection = (position: number, timeStr: string) => {
    if (!isDual) {
      if (position <= 2) return 'hours';
      if (position >= 3 && position <= 5) return 'minutes';
      if (position >= 6) return 'period';
      return 'hours';
    }

    // For dual mode, determine if we're in start or end time
    const firstTimeEnd = timeStr.indexOf(' ', timeStr.indexOf(' ') + 1); // Position after "HH:MM AM/PM"
    if (position <= firstTimeEnd) {
      // In start time
      if (position <= 2) return 'start-hours';
      if (position >= 3 && position <= 5) return 'start-minutes';
      return 'start-period';
    } else {
      // In end time
      const endTimeStart = firstTimeEnd + 1;
      const relativePos = position - endTimeStart;
      if (relativePos <= 2) return 'end-hours';
      if (relativePos >= 3 && relativePos <= 5) return 'end-minutes';
      return 'end-period';
    }
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

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    const input = inputRef.current;
    if (!input) return;

    const position = input.selectionStart || 0;
    const section = getCurrentSection(position, displayValue);

    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      e.preventDefault();
      
      if (isDual) {
        const parsed = parseDualTime(displayValue);
        if (!parsed) return;

        const startParsed = parseTime(parsed.startTime);
        const endParsed = parseTime(parsed.endTime);
        if (!startParsed || !endParsed) return;

        const direction = e.key === 'ArrowDown' ? 'up' : 'down';
        let newStartTime = parsed.startTime;
        let newEndTime = parsed.endTime;

        if (section.startsWith('start-')) {
          let newHours = startParsed.hours;
          let newMinutes = startParsed.minutes;
          let newPeriod = startParsed.period;

          if (section === 'start-hours') {
            if (direction === 'up') {
              newHours = newHours === 12 ? 1 : newHours + 1;
            } else {
              newHours = newHours === 1 ? 12 : newHours - 1;
            }
          } else if (section === 'start-minutes') {
            newMinutes = getNextMinute(startParsed.minutes, direction);
          } else if (section === 'start-period') {
            newPeriod = startParsed.period === 'AM' ? 'PM' : 'AM';
          }

          newStartTime = formatTime(newHours, newMinutes, newPeriod);
        } else if (section.startsWith('end-')) {
          let newHours = endParsed.hours;
          let newMinutes = endParsed.minutes;
          let newPeriod = endParsed.period;

          if (section === 'end-hours') {
            if (direction === 'up') {
              newHours = newHours === 12 ? 1 : newHours + 1;
            } else {
              newHours = newHours === 1 ? 12 : newHours - 1;
            }
          } else if (section === 'end-minutes') {
            newMinutes = getNextMinute(endParsed.minutes, direction);
          } else if (section === 'end-period') {
            newPeriod = endParsed.period === 'AM' ? 'PM' : 'AM';
          }

          newEndTime = formatTime(newHours, newMinutes, newPeriod);
        }

        const newDisplayValue = `${newStartTime} ${newEndTime}`;
        setDisplayValue(newDisplayValue);
        onChange?.(newStartTime);
        onEndChange?.(newEndTime);
      } else {
        // Single time mode logic (existing)
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
      }

      // Restore cursor position after state update
      setTimeout(() => {
        if (input) {
          input.setSelectionRange(position, position);
        }
      }, 0);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    let inputValue = e.target.value;
    const position = e.target.selectionStart || 0;

    // Remove any non-digit, non-colon, non-space, non-A, non-M, non-P characters
    inputValue = inputValue.replace(/[^0-9:AMP\s]/gi, '');

    // Convert to uppercase for AM/PM
    inputValue = inputValue.toUpperCase();

    setDisplayValue(inputValue);
    setCursorPosition(position);

    if (isDual) {
      const parsed = parseDualTime(inputValue);
      if (parsed) {
        const startParsed = parseTime(parsed.startTime);
        const endParsed = parseTime(parsed.endTime);
        
        if (startParsed && startParsed.hours >= 1 && startParsed.hours <= 12 && 
            startParsed.minutes >= 0 && startParsed.minutes <= 59) {
          onChange?.(parsed.startTime);
        }
        
        if (endParsed && endParsed.hours >= 1 && endParsed.hours <= 12 && 
            endParsed.minutes >= 0 && endParsed.minutes <= 59) {
          onEndChange?.(parsed.endTime);
        }
      }
    } else {
      // Single time validation
      const parsed = parseTime(inputValue);
      if (parsed && parsed.hours >= 1 && parsed.hours <= 12 && 
          parsed.minutes >= 0 && parsed.minutes <= 59) {
        onChange?.(inputValue);
      }
    }
  };

  const handleBlur = () => {
    if (isDual) {
      const parsed = parseDualTime(displayValue);
      if (parsed) {
        const startParsed = parseTime(parsed.startTime);
        const endParsed = parseTime(parsed.endTime);
        
        if (startParsed && endParsed) {
          const formattedStart = formatTime(startParsed.hours, startParsed.minutes, startParsed.period);
          const formattedEnd = formatTime(endParsed.hours, endParsed.minutes, endParsed.period);
          const formattedDisplay = `${formattedStart} ${formattedEnd}`;
          
          if (formattedDisplay !== displayValue) {
            setDisplayValue(formattedDisplay);
            onChange?.(formattedStart);
            onEndChange?.(formattedEnd);
          }
        }
      }
    } else {
      // Single time auto-complete
      const parsed = parseTime(displayValue);
      if (parsed) {
        const formattedTime = formatTime(parsed.hours, parsed.minutes, parsed.period);
        if (formattedTime !== displayValue) {
          setDisplayValue(formattedTime);
          onChange?.(formattedTime);
        }
      }
    }
  };

  useEffect(() => {
    if (isDual) {
      const startTime = value || '';
      const endTime = endValue || '';
      const newDisplayValue = startTime && endTime ? `${startTime} ${endTime}` : '';
      setDisplayValue(newDisplayValue);
    } else {
      setDisplayValue(value || '');
    }
  }, [value, endValue, isDual]);

  const inputComponent = isDual ? (
    <div className={styles.dualTimeContainer}>
      <Input
        ref={inputRef}
        value={displayValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        placeholder="HH:MM AM/PM HH:MM AM/PM"
        className={styles.dualTimeInput}
        maxLength={17} // "12:00 AM 12:00 PM"
      />
      <div className={styles.arrowOverlay}>
        <ArrowRight16Regular />
      </div>
    </div>
  ) : (
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
