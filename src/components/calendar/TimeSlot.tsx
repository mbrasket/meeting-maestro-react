
import { useDrop } from 'react-dnd';
import { makeStyles, tokens } from '@fluentui/react-components';
import { CalendarItem, DragItem } from './types';
import { snapToGrid } from './utils/timeUtils';
import CalendarItemComponent from './CalendarItemComponent';

const useStyles = makeStyles({
  slot: {
    height: '60px',
    position: 'relative',
    borderBottomColor: tokens.colorNeutralStroke3,
    borderBottomWidth: '1px',
    borderBottomStyle: 'solid',
  },
  dropZone: {
    backgroundColor: tokens.colorBrandBackground2,
    opacity: 0.3,
  },
});

interface TimeSlotProps {
  day: Date;
  hour: number;
  items: CalendarItem[];
  onUpdateItem: (itemId: string, updates: Partial<CalendarItem>) => void;
  onDeleteItem: (itemId: string) => void;
}

const TimeSlot = ({ day, hour, items, onUpdateItem, onDeleteItem }: TimeSlotProps) => {
  const styles = useStyles();

  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'calendar-item',
    drop: (dragItem: DragItem) => {
      const startTime = new Date(day);
      startTime.setHours(hour, 0, 0, 0);
      
      if (dragItem.template) {
        // Create new item from template
        const newItem: Partial<CalendarItem> = {
          ...dragItem.template,
          startTime: snapToGrid(startTime),
          endTime: snapToGrid(new Date(startTime.getTime() + 30 * 60 * 1000)), // Default 30 min
        };
        console.log('Creating new item:', newItem);
      } else if (dragItem.existingItem) {
        // Move existing item
        const timeDiff = dragItem.existingItem.endTime.getTime() - dragItem.existingItem.startTime.getTime();
        const newStartTime = snapToGrid(startTime);
        const newEndTime = new Date(newStartTime.getTime() + timeDiff);
        
        onUpdateItem(dragItem.existingItem.id, {
          startTime: newStartTime,
          endTime: newEndTime,
        });
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  return (
    <div 
      ref={drop} 
      className={`${styles.slot} ${isOver ? styles.dropZone : ''}`}
    >
      {items.map((item) => (
        <CalendarItemComponent
          key={item.id}
          item={item}
          onUpdate={(updates) => onUpdateItem(item.id, updates)}
          onDelete={() => onDeleteItem(item.id)}
        />
      ))}
    </div>
  );
};

export default TimeSlot;
