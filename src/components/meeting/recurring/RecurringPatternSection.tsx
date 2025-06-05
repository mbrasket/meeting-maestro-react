
import {
  Text,
  makeStyles,
  tokens,
} from '@fluentui/react-components';
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
    </div>
  );
};

export default RecurringPatternSection;
