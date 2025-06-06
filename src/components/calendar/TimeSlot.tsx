
import { Droppable } from '@hello-pangea/dnd';
import { makeStyles, tokens } from '@fluentui/react-components';
import { CalendarItem } from './types';
import CalendarItemComponent from './CalendarItemComponent';

const useStyles = makeStyles({
  slot: {
    height: '20px',
    position: 'relative',
    minHeight: '20px',
  },
  hourBorder: {
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
  },
  regularBorder: {
    borderBottom: `1px solid ${tokens.colorNeutralStroke3}`,
  },
  noBorder: {
    borderBottom: 'none',
  },
  dropZone: {
    backgroundColor: tokens.colorBrandBackground2,
    opacity: '0.3',
  },
});

interface TimeSlotProps {
  day: Date;
  slot: number;
  items: CalendarItem[];
  onUpdateItem: (itemId: string, updates: Partial<CalendarItem>) => void;
  onDeleteItem: (itemId: string) => void;
}

const TimeSlot = ({ day, slot, items, onUpdateItem, onDeleteItem }: TimeSlotProps) => {
  const styles = useStyles();
  const droppableId = `${day.toDateString()}-${slot}`;
  const isHourBoundary = slot % 12 === 0;
  
  // Check if this slot has any items that would cover the border
  const hasItemsInSlot = items.some(item => {
    const itemStartSlot = Math.floor(new Date(item.startTime).getHours() * 12 + new Date(item.startTime).getMinutes() / 5);
    return slot === itemStartSlot;
  });

  const getBorderStyle = () => {
    if (hasItemsInSlot) return styles.noBorder;
    return isHourBoundary ? styles.hourBorder : styles.regularBorder;
  };

  return (
    <Droppable droppableId={droppableId}>
      {(provided, snapshot) => (
        <div 
          ref={provided.innerRef}
          {...provided.droppableProps}
          className={`${styles.slot} ${getBorderStyle()} ${snapshot.isDraggingOver ? styles.dropZone : ''}`}
        >
          {items.map((item, index) => {
            // Only render the item in its starting slot to avoid duplicates
            const itemStartSlot = Math.floor(new Date(item.startTime).getHours() * 12 + new Date(item.startTime).getMinutes() / 5);
            if (slot === itemStartSlot) {
              return (
                <CalendarItemComponent
                  key={item.id}
                  item={item}
                  index={index}
                  onUpdate={(updates) => onUpdateItem(item.id, updates)}
                  onDelete={() => onDeleteItem(item.id)}
                />
              );
            }
            return null;
          })}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
};

export default TimeSlot;
