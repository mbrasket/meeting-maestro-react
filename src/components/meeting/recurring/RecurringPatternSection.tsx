
import {
  Input,
  Field,
  Text,
  makeStyles,
  tokens,
} from '@fluentui/react-components';
import { Clock20Regular } from '@fluentui/react-icons';
import { RecurringPattern } from '../types';
import WeekdaySelector from './WeekdaySelector';

const useStyles = makeStyles({
  section: {
    marginBottom: '24px',
    padding: tokens.spacingVerticalM,
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    borderRadius: tokens.borderRadiusMedium,
    backgroundColor: tokens.colorNeutralBackground1,
  },
  sectionTitle: {
    marginBottom: tokens.spacingVerticalM,
    fontWeight: tokens.fontWeightSemibold,
  },
  fieldGroup: {
    marginBottom: tokens.spacingVerticalM,
  },
  fieldLabel: {
    marginBottom: tokens.spacingVerticalXS,
    fontSize: tokens.fontSizeBase200,
    fontWeight: tokens.fontWeightMedium,
  },
  timeFields: {
    display: 'flex',
    gap: tokens.spacingHorizontalM,
    alignItems: 'center',
  },
  timeField: {
    flex: 1,
  },
  iconContainer: {
    display: 'flex',
    alignItems: 'center',
    color: tokens.colorNeutralForeground2,
  },
});

interface RecurringPatternSectionProps {
  pattern: RecurringPattern;
  onPatternChange: (pattern: RecurringPattern) => void;
}

const RecurringPatternSection = ({ pattern, onPatternChange }: RecurringPatternSectionProps) => {
  const styles = useStyles();

  const handleWeekdayChange = (weekdays: boolean[]) => {
    onPatternChange({ ...pattern, weekdays });
  };

  const validateAndFormatTime = (timeString: string): string => {
    // Remove any non-numeric characters except colon
    const cleaned = timeString.replace(/[^\d:]/g, '');
    
    // Try to parse various time formats
    const timeRegex = /^(\d{1,2}):?(\d{0,2})\s*(am|pm)?$/i;
    const match = cleaned.match(timeRegex);
    
    if (!match) return timeString; // Return original if no match
    
    let hours = parseInt(match[1], 10);
    let minutes = parseInt(match[2] || '0', 10);
    const period = match[3]?.toLowerCase();
    
    // Handle 12-hour format
    if (period) {
      if (period === 'pm' && hours !== 12) hours += 12;
      if (period === 'am' && hours === 12) hours = 0;
    }
    
    // Validate ranges
    if (hours > 23) hours = 23;
    if (minutes > 59) minutes = 59;
    
    // Format as HH:MM
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };

  const handleTimeBlur = (field: 'startTime' | 'endTime', value: string) => {
    const formattedTime = validateAndFormatTime(value);
    onPatternChange({ ...pattern, [field]: formattedTime });
  };

  const handleTimeChange = (field: 'startTime' | 'endTime', value: string) => {
    onPatternChange({ ...pattern, [field]: value });
  };

  return (
    <div className={styles.section}>
      <Text className={styles.sectionTitle}>Pattern</Text>
      
      <div className={styles.fieldGroup}>
        <Text className={styles.fieldLabel}>Weekdays</Text>
        <WeekdaySelector
          selectedWeekdays={pattern.weekdays}
          onWeekdayChange={handleWeekdayChange}
        />
      </div>

      <div className={styles.fieldGroup}>
        <Text className={styles.fieldLabel}>Time</Text>
        <div className={styles.timeFields}>
          <div className={styles.iconContainer}>
            <Clock20Regular />
          </div>
          <Field className={styles.timeField}>
            <Input
              appearance="underline"
              type="text"
              value={pattern.startTime}
              onChange={(_, data) => handleTimeChange('startTime', data.value)}
              onBlur={(e) => handleTimeBlur('startTime', e.target.value)}
              placeholder="Start time (e.g., 9:00 AM)"
            />
          </Field>
          <Text>to</Text>
          <Field className={styles.timeField}>
            <Input
              appearance="underline"
              type="text"
              value={pattern.endTime}
              onChange={(_, data) => handleTimeChange('endTime', data.value)}
              onBlur={(e) => handleTimeBlur('endTime', e.target.value)}
              placeholder="End time (e.g., 5:00 PM)"
            />
          </Field>
        </div>
      </div>
    </div>
  );
};

export default RecurringPatternSection;
