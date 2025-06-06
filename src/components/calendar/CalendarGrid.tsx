
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
    minWidth: '800px',
  },
  timeColumn: {
    borderRightColor: tokens.colorNeutralStroke1,
    borderRightWidth: '1px',
    borderRightStyle: 'solid',
    position: 'sticky',
    left: 0,
    backgroundColor: tokens.colorNeutralBackground1,
    zIndex: 1,
  },
  timeLabel: {
    height: '20px', // Each 5-minute slot is 20px
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
    minWidth: '100px',
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
    position: 'sticky',
    top: 0,
    zIndex: 2,
  },
});

interface CalendarGridProps {
  items: CalendarItem[];
  currentWeek: Date;
  onUpdateItem: (itemId: string, updates: Partial<CalendarItem>) => void;
  onDeleteItem: (itemId: string) => void;
  onWeekChange: (date: Date) => void;
  selectedItemIds: Set<string>;
  onSelectItem: (itemId: string, ctrlKey: boolean) => void;
  onClearSelection: () => void;
}

const CalendarGrid = ({
  items,
  currentWeek,
  onUpdateItem,
  onDeleteItem,
  onWeekChange,
  selectedItemIds,
  onSelectItem,
  onClearSelection,
}: CalendarGridProps) => {
  const styles = useStyles();
  const weekDays = getWeekDays(currentWeek);

  const handlePreviousWeek = () => {
    onWeekChange(subWeeks(currentWeek, 1));
  };

  const handleNextWeek = () => {
    onWeekChange(addWeeks(currentWeek, 1));
  };

  // Generate time slots for every 5 minutes (288 slots in 24 hours)
  const timeSlots = Array.from({ length: 288 }, (_, i) => i);
  // Only show hourly labels
  const hourlySlots = Array.from({ length: 24 }, (_, i) => i * 12);

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
      
      <div className={styles.grid} style={{ gridTemplateRows: '40px repeat(288, 20px)' }}>
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
        {timeSlots.map((slot) => (
          <>
            <div key={`time-${slot}`} className={styles.timeColumn}>
              <div className={styles.timeLabel}>
                {hourlySlots.includes(slot) ? slotToTime(slot) : ''}
              </div>
            </div>
            {weekDays.map((day, dayIndex) => (
              <div key={`${slot}-${dayIndex}`} className={styles.dayColumn}>
                <TimeSlot
                  day={day}
                  slot={slot}
                  items={items.filter(item => {
                    const itemDay = new Date(item.startTime).toDateString();
                    const slotDay = day.toDateString();
                    const itemStartSlot = Math.floor(new Date(item.startTime).getHours() * 12 + new Date(item.startTime).getMinutes() / 5);
                    const itemEndSlot = Math.floor(new Date(item.endTime).getHours() * 12 + new Date(item.endTime).getMinutes() / 5);
                    return itemDay === slotDay && slot >= itemStartSlot && slot < itemEndSlot;
                  })}
                  onUpdateItem={onUpdateItem}
                  onDeleteItem={onDeleteItem}
                  selectedItemIds={selectedItemIds}
                  onSelectItem={onSelectItem}
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
