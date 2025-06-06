
import { useState } from 'react';
import {
  makeStyles,
  tokens,
  Text,
} from '@fluentui/react-components';
import { CalendarItem } from '../components/calendar/types';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    height: '100vh',
    paddingTop: '60px',
    backgroundColor: tokens.colorNeutralBackground1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholder: {
    textAlign: 'center',
    padding: tokens.spacingVerticalXXL,
  },
});

const CalendarPage = () => {
  const styles = useStyles();
  const [calendarItems, setCalendarItems] = useState<CalendarItem[]>([]);

  return (
    <div className={styles.container}>
      <div className={styles.placeholder}>
        <Text size={600} weight="semibold">
          Calendar Page
        </Text>
        <Text size={400}>
          Ready to build from scratch
        </Text>
      </div>
    </div>
  );
};

export default CalendarPage;
