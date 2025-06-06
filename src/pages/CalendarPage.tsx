
import { useState } from 'react';
import { 
  makeStyles, 
  tokens, 
  Text, 
  Button 
} from '@fluentui/react-components';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { format, addWeeks, subWeeks, startOfWeek, addDays } from 'date-fns';
import { CalendarItem } from '../components/calendar/types';
import CalendarGrid from '../components/calendar/CalendarGrid';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    paddingTop: '60px',
    backgroundColor: tokens.colorNeutralBackground1,
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: tokens.spacingVerticalM,
    borderBottomColor: tokens.colorNeutralStroke1,
    borderBottomWidth: '1px',
    borderBottomStyle: 'solid',
  },
  weekNavigation: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalM,
  },
  content: {
    flex: 1,
    overflow: 'hidden',
  },
});

const CalendarPage = () => {
  const styles = useStyles();
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [items, setItems] = useState<CalendarItem[]>([]);

  // Get week days
  const weekStart = startOfWeek(currentWeek, { weekStartsOn: 0 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const handlePreviousWeek = () => {
    setCurrentWeek(subWeeks(currentWeek, 1));
  };

  const handleNextWeek = () => {
    setCurrentWeek(addWeeks(currentWeek, 1));
  };

  const handleAddItem = () => {
    const newItem: CalendarItem = {
      id: Date.now().toString(),
      type: 'event',
      title: 'New Event',
      startTime: new Date(),
      endTime: new Date(Date.now() + 60 * 60 * 1000), // 1 hour later
    };
    setItems(prev => [...prev, newItem]);
  };

  const handleUpdateItem = (itemId: string, updates: Partial<CalendarItem>) => {
    setItems(prev => 
      prev.map(item => 
        item.id === itemId ? { ...item, ...updates } : item
      )
    );
  };

  const handleDeleteItem = (itemId: string) => {
    setItems(prev => prev.filter(item => item.id !== itemId));
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.weekNavigation}>
          <Button 
            appearance="subtle" 
            icon={<ChevronLeft />} 
            onClick={handlePreviousWeek}
          />
          <Text size={500} weight="semibold">
            {format(weekDays[0], 'MMM d')} - {format(weekDays[6], 'MMM d, yyyy')}
          </Text>
          <Button 
            appearance="subtle" 
            icon={<ChevronRight />} 
            onClick={handleNextWeek}
          />
        </div>
        <Button 
          appearance="primary" 
          icon={<Plus />} 
          onClick={handleAddItem}
        >
          Add Event
        </Button>
      </div>
      
      <div className={styles.content}>
        <CalendarGrid
          items={items}
          weekDays={weekDays}
          onUpdateItem={handleUpdateItem}
          onDeleteItem={handleDeleteItem}
        />
      </div>
    </div>
  );
};

export default CalendarPage;
