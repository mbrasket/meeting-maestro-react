
import { Droppable } from '@hello-pangea/dnd';
import { makeStyles, tokens } from '@fluentui/react-components';
import { CalendarItem } from './types';
import CalendarItemComponent from './CalendarItemComponent';

const useStyles = makeStyles({
  slot: {
    height: '7px', // Each 5-minute slot is 7px (84px per hour ÷ 12 slots)
    position: 'relative',
    minHeight: '7px',
  },
  halfHourBorder: {
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
  },
  noBorder: {
    // No border for non-half-hour slots
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
    height: '28px', // Default height for ghost card (4 slots * 7px = 28px)
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
  allDayItems: CalendarItem[]; // All items for the day to calculate overlaps
  onUpdateItem: (itemId: string, updates: Partial<CalendarItem>) => void;
  onDeleteItem: (itemId: string) => void;
  selectedItemIds: Set<string>;
  onSelectItem: (itemId: string, ctrlKey: boolean) => void;
  onClearSelection: () => void;
}

// Helper function to calculate overlapping items and their positions
const calculateOverlapPositions = (items: CalendarItem[], currentSlot: number) => {
  const itemsWithPositions: Array<{
    item: CalendarItem;
    column: number;
    totalColumns: number;
    startSlot: number;
    endSlot: number;
  }> = [];

  // Convert items to slot ranges
  const itemRanges = items.map(item => {
    const startSlot = Math.floor(new Date(item.startTime).getHours() * 12 + new Date(item.startTime).getMinutes() / 5);
    const endSlot = Math.floor(new Date(item.endTime).getHours() * 12 + new Date(item.endTime).getMinutes() / 5);
    return { item, startSlot, endSlot };
  });

  // Find overlapping groups
  const processedItems = new Set<string>();
  
  itemRanges.forEach(({ item, startSlot, endSlot }) => {
    if (processedItems.has(item.id)) return;
    
    // Find all items that overlap with this one
    const overlappingItems = itemRanges.filter(({ item: otherItem, startSlot: otherStart, endSlot: otherEnd }) => {
      return (startSlot < otherEnd && endSlot > otherStart);
    });
    
    // Sort by start time for consistent column assignment
    overlappingItems.sort((a, b) => a.startSlot - b.startSlot);
    
    // Assign columns to overlapping items
    overlappingItems.forEach(({ item: overlappingItem, startSlot: overlapStart, endSlot: overlapEnd }, index) => {
      if (!processedItems.has(overlappingItem.id)) {
        itemsWithPositions.push({
          item: overlappingItem,
          column: index,
          totalColumns: overlappingItems.length,
          startSlot: overlapStart,
          endSlot: overlapEnd,
        });
        processedItems.add(overlappingItem.id);
      }
    });
  });

  return itemsWithPositions;
};

const TimeSlot = ({ 
  day, 
  slot, 
  items, 
  allDayItems, 
  onUpdateItem, 
  onDeleteItem, 
  selectedItemIds, 
  onSelectItem, 
  onClearSelection 
}: TimeSlotProps) => {
  const styles = useStyles();
  const droppableId = `${day.toDateString()}-${slot}`;
  
  // Show border only at half-hour increments (every 6 slots = 30 minutes)
  const isHalfHourBoundary = slot % 6 === 0;
  
  const getBorderStyle = () => {
    return isHalfHourBoundary ? styles.halfHourBorder : styles.noBorder;
  };

  const handleSlotClick = (e: React.MouseEvent) => {
    // Clear selection when clicking on empty time slot
    if (e.target === e.currentTarget) {
      onClearSelection();
    }
  };

  // Calculate positions for overlapping items
  const itemsWithPositions = calculateOverlapPositions(allDayItems, slot);

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
          
          {itemsWithPositions.map((itemData, index) => {
            const { item, column, totalColumns, startSlot } = itemData;
            
            // Only render the item in its starting slot to avoid duplicates
            if (slot === startSlot) {
              return (
                <CalendarItemComponent
                  key={item.id}
                  item={item}
                  index={index}
                  onUpdate={(updates) => onUpdateItem(item.id, updates)}
                  onDelete={() => onDeleteItem(item.id)}
                  isSelected={selectedItemIds.has(item.id)}
                  onSelect={onSelectItem}
                  column={column}
                  totalColumns={totalColumns}
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
