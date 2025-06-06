
import { Droppable } from '@hello-pangea/dnd';
import { makeStyles, tokens } from '@fluentui/react-components';
import { CalendarItem } from './types';
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
  const droppableId = `${day.toDateString()}-${hour}`;

  return (
    <Droppable droppableId={droppableId}>
      {(provided, snapshot) => (
        <div 
          ref={provided.innerRef}
          {...provided.droppableProps}
          className={`${styles.slot} ${snapshot.isDraggingOver ? styles.dropZone : ''}`}
        >
          {items.map((item, index) => (
            <CalendarItemComponent
              key={item.id}
              item={item}
              index={index}
              onUpdate={(updates) => onUpdateItem(item.id, updates)}
              onDelete={() => onDeleteItem(item.id)}
            />
          ))}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
};

export default TimeSlot;
