
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
  dropZone: {
    backgroundColor: tokens.colorBrandBackground2,
    opacity: '0.3',
    zIndex: '5', // Drop zone indication below items
  },
  ghostCard: {
    position: 'absolute',
    left: '4px',
    right: '4px',
    height: '40px', // Default height for ghost card
    backgroundColor: tokens.colorBrandBackground,
    border: `2px dashed ${tokens.colorBrandStroke1}`,
    borderRadius: '4px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: tokens.colorNeutralForegroundOnBrand,
    fontSize: '12px',
    zIndex: '15', // Ghost card above grid lines but below dragging items
    opacity: '0.7',
  },
});

interface TimeSlotProps {
  day: Date;
  slot: number;
  items: CalendarItem[];
  onUpdateItem: (itemId: string, updates: Partial<CalendarItem>) => void;
  onDeleteItem: (itemId: string) => void;
  selectedItemIds: Set<string>;
  onSelectItem: (itemId: string, ctrlKey: boolean) => void;
  onClearSelection: () => void;
}

const TimeSlot = ({ day, slot, items, onUpdateItem, onDeleteItem, selectedItemIds, onSelectItem, onClearSelection }: TimeSlotProps) => {
  const styles = useStyles();
  const droppableId = `${day.toDateString()}-${slot}`;
  const isHourBoundary = slot % 12 === 0;
  
  const getBorderStyle = () => {
    return isHourBoundary ? styles.hourBorder : styles.regularBorder;
  };

  const handleSlotClick = (e: React.MouseEvent) => {
    // Clear selection when clicking on empty time slot
    if (e.target === e.currentTarget) {
      onClearSelection();
    }
  };

  return (
    <Droppable droppableId={droppableId}>
      {(provided, snapshot) => (
        <div 
          ref={provided.innerRef}
          {...provided.droppableProps}
          className={`${styles.slot} ${getBorderStyle()} ${snapshot.isDraggingOver ? styles.dropZone : ''}`}
          onClick={handleSlotClick}
        >
          {/* Show ghost card when dragging from tools */}
          {snapshot.isDraggingOver && snapshot.draggingFromThisWith?.startsWith('tool-') && (
            <div className={styles.ghostCard}>
              Drop here
            </div>
          )}
          
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
                  isSelected={selectedItemIds.has(item.id)}
                  onSelect={onSelectItem}
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
