
import React from 'react';
import { makeStyles, tokens, Text } from '@fluentui/react-components';
import { format } from 'date-fns';
import { CalendarItem } from './types';
import CalendarItemComponent from './CalendarItemComponent';

const useStyles = makeStyles({
  grid: {
    display: 'grid',
    gridTemplateColumns: '60px repeat(7, 1fr)',
    height: '100%',
    overflow: 'auto',
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
    height: '60px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '12px',
    color: tokens.colorNeutralForeground2,
    borderBottomColor: tokens.colorNeutralStroke2,
    borderBottomWidth: '1px',
    borderBottomStyle: 'solid',
  },
  dayColumn: {
    position: 'relative',
    borderRightColor: tokens.colorNeutralStroke1,
    borderRightWidth: '1px',
    borderRightStyle: 'solid',
    minWidth: '120px',
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
  timeSlot: {
    height: '60px',
    borderBottomColor: tokens.colorNeutralStroke2,
    borderBottomWidth: '1px',
    borderBottomStyle: 'solid',
    position: 'relative',
  },
});

interface CalendarGridProps {
  items: CalendarItem[];
  weekDays: Date[];
  onUpdateItem: (itemId: string, updates: Partial<CalendarItem>) => void;
  onDeleteItem: (itemId: string) => void;
}

const CalendarGrid = ({ items, weekDays, onUpdateItem, onDeleteItem }: CalendarGridProps) => {
  const styles = useStyles();
  
  // Generate time slots for 24 hours
  const timeSlots = Array.from({ length: 24 }, (_, i) => i);

  const getItemsForDayAndHour = (day: Date, hour: number) => {
    return items.filter(item => {
      const itemStart = new Date(item.startTime);
      const itemEnd = new Date(item.endTime);
      const slotStart = new Date(day);
      slotStart.setHours(hour, 0, 0, 0);
      const slotEnd = new Date(day);
      slotEnd.setHours(hour + 1, 0, 0, 0);
      
      return itemStart < slotEnd && itemEnd > slotStart;
    });
  };

  return (
    <div 
      className={styles.grid}
      style={{ gridTemplateRows: '40px repeat(24, 60px)' }}
    >
      {/* Time column header */}
      <div className={styles.timeColumn}></div>
      
      {/* Day headers */}
      {weekDays.map((day, index) => (
        <div key={`day-header-${index}`} className={styles.dayHeader}>
          <Text size={300} weight="semibold">
            {format(day, 'EEE d')}
          </Text>
        </div>
      ))}
      
      {/* Time slots */}
      {timeSlots.map((hour) => (
        <React.Fragment key={`hour-${hour}`}>
          <div className={styles.timeColumn}>
            <div className={styles.timeLabel}>
              {hour.toString().padStart(2, '0')}:00
            </div>
          </div>
          {weekDays.map((day, dayIndex) => {
            const slotItems = getItemsForDayAndHour(day, hour);
            
            return (
              <div key={`slot-${hour}-day-${dayIndex}`} className={`${styles.dayColumn} ${styles.timeSlot}`}>
                {slotItems.map((item, itemIndex) => (
                  <CalendarItemComponent
                    key={item.id}
                    item={item}
                    onUpdate={(updates) => onUpdateItem(item.id, updates)}
                    onDelete={() => onDeleteItem(item.id)}
                  />
                ))}
              </div>
            );
          })}
        </React.Fragment>
      ))}
    </div>
  );
};

export default CalendarGrid;
