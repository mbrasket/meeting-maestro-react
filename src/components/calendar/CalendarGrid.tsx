import { useState, useRef } from 'react';
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
import { useDragAndDrop } from '../../hooks/useDragAndDrop';

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
    height: '84px', // Each hour is 84px (12 slots * 7px)
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '12px',
    fontWeight: tokens.fontWeightMedium,
    color: tokens.colorNeutralForeground2,
    borderBottomColor: tokens.colorNeutralStroke2,
    borderBottomWidth: '1px',
    borderBottomStyle: 'solid',
  },
  emptyTimeSlot: {
    height: '7px', // Regular 5-minute slot
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
  onAddItem: (item: CalendarItem) => void;
  onCopyItem: (item: CalendarItem) => void;
  isCtrlPressed?: boolean;
  timeRangeSelection?: any;
  dragCollisions?: Set<string>;
  setCalendarItems: React.Dispatch<React.SetStateAction<CalendarItem[]>>;
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
  onAddItem,
  onCopyItem,
  isCtrlPressed = false,
  timeRangeSelection,
  dragCollisions = new Set(),
  setCalendarItems,
}: CalendarGridProps) => {
  const styles = useStyles();
  const weekDays = getWeekDays(currentWeek);

  // Initialize drag and drop within the context
  const { handleDragStart, handleDragEnd } = useDragAndDrop({
    items,
    onUpdateItem,
    onAddItem,
    onDeleteItem,
    setCalendarItems,
  });

  const handlePreviousWeek = () => {
    onWeekChange(subWeeks(currentWeek, 1));
  };

  const handleNextWeek = () => {
    onWeekChange(addWeeks(currentWeek, 1));
  };

  const handleGridClick = (e: React.MouseEvent) => {
    // Only clear selection if clicking directly on the grid, not on items or their containers
    if (e.target === e.currentTarget) {
      onClearSelection();
    }
  };

  // Generate time slots for every 5 minutes (288 slots in 24 hours)
  const timeSlots = Array.from({ length: 288 }, (_, i) => i);
  // Generate hourly slots (every 12 slots = 1 hour)
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
      
      <div 
        className={styles.grid} 
        style={{ gridTemplateRows: '40px repeat(288, 7px)' }}
        onClick={handleGridClick}
      >
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
              {hourlySlots.includes(slot) ? (
                <div className={styles.timeLabel}>
                  {slotToTime(slot)}
                </div>
              ) : (
                <div className={styles.emptyTimeSlot}></div>
              )}
            </div>
            {weekDays.map((day, dayIndex) => {
              // Get all items for this day for overlap calculation
              const allDayItems = items.filter(item => {
                const itemDay = new Date(item.startTime).toDateString();
                const slotDay = day.toDateString();
                return itemDay === slotDay;
              });

              // Get items that span this specific slot
              const slotItems = items.filter(item => {
                const itemDay = new Date(item.startTime).toDateString();
                const slotDay = day.toDateString();
                const itemStartSlot = Math.floor(new Date(item.startTime).getHours() * 12 + new Date(item.startTime).getMinutes() / 5);
                const itemEndSlot = Math.floor(new Date(item.endTime).getHours() * 12 + new Date(item.endTime).getMinutes() / 5);
                return itemDay === slotDay && slot >= itemStartSlot && slot < itemEndSlot;
              });

              return (
                <div key={`${slot}-${dayIndex}`} className={styles.dayColumn}>
                  <TimeSlot
                    day={day}
                    slot={slot}
                    items={slotItems}
                    allDayItems={allDayItems}
                    onUpdateItem={onUpdateItem}
                    onDeleteItem={onDeleteItem}
                    selectedItemIds={selectedItemIds}
                    onSelectItem={onSelectItem}
                    onClearSelection={onClearSelection}
                    onCopyItem={onCopyItem}
                    isCtrlPressed={isCtrlPressed}
                    timeRangeSelection={timeRangeSelection}
                    dragCollisions={dragCollisions}
                  />
                </div>
              );
            })}
          </>
        ))}
      </div>
    </div>
  );
};

export default CalendarGrid;
