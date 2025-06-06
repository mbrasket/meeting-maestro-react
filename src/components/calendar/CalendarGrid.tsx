import { useState } from 'react';
import {
  makeStyles,
  tokens,
  Text,
  Button,
} from '@fluentui/react-components';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { format, addWeeks, subWeeks } from 'date-fns';
import { CalendarItem } from './types';
import { getWeekDays, slotToTime } from './utils/timeUtils';
import TimeSlot from './TimeSlot';

const useStyles = makeStyles({
  container: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
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
  grid: {
    flex: 1,
    display: 'grid',
    gridTemplateColumns: '60px repeat(7, 1fr)',
    overflow: 'auto',
    position: 'relative',
  },
  timeColumn: {
    borderRightColor: tokens.colorNeutralStroke1,
    borderRightWidth: '1px',
    borderRightStyle: 'solid',
  },
  timeLabel: {
    height: '60px', // 12 slots * 5px each
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'center',
    paddingTop: '2px',
    fontSize: '11px',
    color: tokens.colorNeutralForeground2,
  },
  dayColumn: {
    position: 'relative',
    borderRightColor: tokens.colorNeutralStroke1,
    borderRightWidth: '1px',
    borderRightStyle: 'solid',
  },
  dayHeader: {
    height: '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomColor: tokens.colorNeutralStroke1,
    borderBottomWidth: '1px',
    borderBottomStyle: 'solid',
    backgroundColor: tokens.colorNeutralBackground2,
  },
});

interface CalendarGridProps {
  items: CalendarItem[];
  currentWeek: Date;
  onUpdateItem: (itemId: string, updates: Partial<CalendarItem>) => void;
  onDeleteItem: (itemId: string) => void;
  onWeekChange: (date: Date) => void;
}

const CalendarGrid = ({
  items,
  currentWeek,
  onUpdateItem,
  onDeleteItem,
  onWeekChange,
}: CalendarGridProps) => {
  const styles = useStyles();
  const weekDays = getWeekDays(currentWeek);

  const handlePreviousWeek = () => {
    onWeekChange(subWeeks(currentWeek, 1));
  };

  const handleNextWeek = () => {
    onWeekChange(addWeeks(currentWeek, 1));
  };

  // Generate time slots (every hour for display)
  const timeSlots = Array.from({ length: 24 }, (_, i) => i);

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
      </div>
      
      <div className={styles.grid} style={{ gridTemplateRows: '40px repeat(24, 60px)' }}>
        {/* Time column header */}
        <div className={styles.timeColumn}></div>
        
        {/* Day headers */}
        {weekDays.map((day, index) => (
          <div key={index} className={styles.dayHeader}>
            <Text size={300} weight="semibold">
              {format(day, 'EEE d')}
            </Text>
          </div>
        ))}
        
        {/* Time labels and day columns */}
        {timeSlots.map((hour) => (
          <>
            <div key={`time-${hour}`} className={styles.timeColumn}>
              <div className={styles.timeLabel}>
                {slotToTime(hour * 12)}
              </div>
            </div>
            {weekDays.map((day, dayIndex) => (
              <div key={`${hour}-${dayIndex}`} className={styles.dayColumn}>
                <TimeSlot
                  day={day}
                  hour={hour}
                  items={items.filter(item => {
                    const itemDay = new Date(item.startTime).toDateString();
                    const slotDay = day.toDateString();
                    const itemHour = new Date(item.startTime).getHours();
                    return itemDay === slotDay && itemHour === hour;
                  })}
                  onUpdateItem={onUpdateItem}
                  onDeleteItem={onDeleteItem}
                />
              </div>
            ))}
          </>
        ))}
      </div>
    </div>
  );
};

export default CalendarGrid;
