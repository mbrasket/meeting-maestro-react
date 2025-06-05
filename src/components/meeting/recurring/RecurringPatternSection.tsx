
import {
  Text,
  makeStyles,
  tokens,
} from '@fluentui/react-components';
import { RecurringPattern } from '../types';
import WeekdaySelector from './WeekdaySelector';
import TimeInput from '../meeting-details/TimeInput';

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
    alignItems: 'flex-end',
  },
  timeField: {
    flex: 1,
  },
  toText: {
    alignSelf: 'center',
    marginBottom: tokens.spacingVerticalS,
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
          <div className={styles.timeField}>
            <TimeInput
              label="Start Time"
              value={pattern.startTime}
              onChange={(time) => handleTimeChange('startTime', time)}
              placeholder="9:00 AM"
            />
          </div>
          <Text className={styles.toText}>to</Text>
          <div className={styles.timeField}>
            <TimeInput
              label="End Time"
              value={pattern.endTime}
              onChange={(time) => handleTimeChange('endTime', time)}
              placeholder="5:00 PM"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecurringPatternSection;
