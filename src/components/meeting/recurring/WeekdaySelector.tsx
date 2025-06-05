
import {
  Button,
  makeStyles,
  tokens,
} from '@fluentui/react-components';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    gap: tokens.spacingHorizontalXS,
    flexWrap: 'wrap',
  },
  weekdayButton: {
    minWidth: '32px',
    height: '32px',
    padding: '0',
    borderRadius: tokens.borderRadiusCircular,
  },
  selectedButton: {
    backgroundColor: tokens.colorBrandBackground,
    color: tokens.colorNeutralForegroundOnBrand,
    '&:hover': {
      backgroundColor: tokens.colorBrandBackgroundHover,
    },
  },
});

interface WeekdaySelectorProps {
  selectedWeekdays: boolean[];
  onWeekdayChange: (weekdays: boolean[]) => void;
}

const WeekdaySelector = ({ selectedWeekdays, onWeekdayChange }: WeekdaySelectorProps) => {
  const styles = useStyles();
  const weekdayLabels = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

  const handleWeekdayToggle = (index: number) => {
    const newWeekdays = [...selectedWeekdays];
    newWeekdays[index] = !newWeekdays[index];
    onWeekdayChange(newWeekdays);
  };

  return (
    <div className={styles.container}>
      {weekdayLabels.map((label, index) => (
        <Button
          key={index}
          appearance={selectedWeekdays[index] ? 'primary' : 'outline'}
          className={`${styles.weekdayButton} ${selectedWeekdays[index] ? styles.selectedButton : ''}`}
          onClick={() => handleWeekdayToggle(index)}
        >
          {label}
        </Button>
      ))}
    </div>
  );
};

export default WeekdaySelector;
