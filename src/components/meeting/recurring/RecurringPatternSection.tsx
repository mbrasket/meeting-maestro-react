
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
              type="time"
              value={pattern.startTime}
              onChange={(_, data) => handleTimeChange('startTime', data.value)}
              placeholder="Start time"
            />
          </Field>
          <Text>to</Text>
          <Field className={styles.timeField}>
            <Input
              appearance="underline"
              type="time"
              value={pattern.endTime}
              onChange={(_, data) => handleTimeChange('endTime', data.value)}
              placeholder="End time"
            />
          </Field>
        </div>
      </div>
    </div>
  );
};

export default RecurringPatternSection;
