
import { TimeInput as HeroTimeInput } from '@heroui/react';
import { Time } from '@internationalized/date';
import {
  Field,
  makeStyles,
  tokens,
} from '@fluentui/react-components';
import { Clock20Regular } from '@fluentui/react-icons';

const useStyles = makeStyles({
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalXS,
  },
  heroTimeInput: {
    '& .hero-input': {
      backgroundColor: 'transparent',
      border: 'none',
      borderBottom: `1px solid ${tokens.colorNeutralStroke1}`,
      borderRadius: '0',
      padding: `${tokens.spacingVerticalXS} 0`,
      fontSize: tokens.fontSizeBase300,
      fontFamily: tokens.fontFamilyBase,
      color: tokens.colorNeutralForeground1,
      '&:focus': {
        borderBottomColor: tokens.colorBrandStroke1,
        outline: 'none',
        boxShadow: 'none',
      },
    },
    '& .hero-input-wrapper': {
      backgroundColor: 'transparent',
      border: 'none',
      boxShadow: 'none',
    },
    '& .hero-label': {
      fontSize: tokens.fontSizeBase200,
      color: tokens.colorNeutralForeground2,
      fontFamily: tokens.fontFamilyBase,
      fontWeight: tokens.fontWeightRegular,
    },
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

  // Convert string time to Time object for HeroUI
  const parseTimeString = (timeStr: string): Time | null => {
    if (!timeStr) return null;
    
    const timeRegex = /^(\d{1,2}):(\d{2})\s*(AM|PM)$/i;
    const match = timeStr.match(timeRegex);
    
    if (!match) return null;
    
    let hours = parseInt(match[1]);
    const minutes = parseInt(match[2]);
    const ampm = match[3].toUpperCase();
    
    if (ampm === 'PM' && hours !== 12) hours += 12;
    if (ampm === 'AM' && hours === 12) hours = 0;
    
    return new Time(hours, minutes);
  };

  // Convert Time object to string for our component
  const formatTimeToString = (time: Time): string => {
    let hours = time.hour;
    const minutes = time.minute;
    const ampm = hours >= 12 ? 'PM' : 'AM';
    
    if (hours === 0) hours = 12;
    else if (hours > 12) hours -= 12;
    
    return `${hours}:${minutes.toString().padStart(2, '0')} ${ampm}`;
  };

  const handleTimeChange = (time: Time | null) => {
    if (time) {
      const timeString = formatTimeToString(time);
      onChange?.(timeString);
    }
  };

  const timeValue = parseTimeString(value);

  return (
    <Field label={label} required={required} className={styles.field}>
      <div style={{ display: 'flex', alignItems: 'center', gap: tokens.spacingHorizontalXS }}>
        <Clock20Regular style={{ color: tokens.colorNeutralForeground2 }} />
        <div className={styles.heroTimeInput}>
          <HeroTimeInput
            value={timeValue}
            onChange={handleTimeChange}
            variant="underlined"
            size="sm"
            classNames={{
              input: 'hero-input',
              inputWrapper: 'hero-input-wrapper',
              label: 'hero-label',
            }}
          />
        </div>
      </div>
    </Field>
  );
};

export default TimeInput;
