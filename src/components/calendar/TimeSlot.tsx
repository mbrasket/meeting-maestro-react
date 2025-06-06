
import { useState } from 'react';
import { Droppable } from '@hello-pangea/dnd';
import { makeStyles, tokens } from '@fluentui/react-components';
import { CalendarItem } from './types';
import CalendarItemComponent from './CalendarItemComponent';

const useStyles = makeStyles({
  slot: {
    height: '7px', // Each 5-minute slot is 7px (84px per hour ÷ 12 slots)
    position: 'relative',
    minHeight: '7px',
    cursor: 'pointer',
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
  invalidDropZone: {
    backgroundColor: tokens.colorPaletteRedBackground1,
    opacity: '0.4',
    cursor: 'not-allowed',
  },
  selectedRangeOverlay: {
    position: 'absolute',
    left: '0',
    right: '0',
    backgroundColor: tokens.colorBrandBackground2,
    border: `2px solid ${tokens.colorBrandStroke1}`,
    borderRadius: '4px',
    opacity: '0.6',
    pointerEvents: 'none',
    zIndex: '10',
  },
  collisionWarning: {
    backgroundColor: tokens.colorPaletteRedBackground1,
    opacity: '0.6',
    border: `1px solid ${tokens.colorPaletteRedBorder1}`,
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
  onCopyItem: (item: CalendarItem) => void;
  isCtrlPressed?: boolean;
  timeRangeSelection?: any;
  dragCollisions?: Set<string>;
}

// Helper function to calculate overlapping items and their positions
const calculateOverlapPositions = (items: CalendarItem[], currentSlot: number, resizingItemId?: string) => {
  const itemsWithPositions: Array<{
    item: CalendarItem;
    column: number;
    totalColumns: number;
    startSlot: number;
    endSlot: number;
  }> = [];

  // If an item is being resized, calculate positions without that item to prevent layout jumps
  const itemsToProcess = resizingItemId 
    ? items.filter(item => item.id !== resizingItemId)
    : items;

  // Convert items to slot ranges
  const itemRanges = itemsToProcess.map(item => {
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
  onClearSelection,
  onCopyItem,
  isCtrlPressed = false,
  timeRangeSelection,
  dragCollisions = new Set()
}: TimeSlotProps) => {
  const styles = useStyles();
  const [resizingItemId, setResizingItemId] = useState<string | null>(null);
  const droppableId = `${day.toDateString()}-${slot}`;
  
  // Show border only at half-hour increments (every 6 slots = 30 minutes)
  const isHalfHourBoundary = slot % 6 === 0;
  
  const getBorderStyle = () => {
    return isHalfHourBoundary ? styles.halfHourBorder : styles.noBorder;
  };

  const handleSlotClick = (e: React.MouseEvent) => {
    // Clear selection when clicking on empty time slot
    if (e.target === e.currentTarget && !timeRangeSelection?.isSelecting) {
      onClearSelection();
    }
  };

  const handleSlotMouseDown = (e: React.MouseEvent) => {
    // Start time range selection on empty slots
    if (e.target === e.currentTarget && items.length === 0 && timeRangeSelection) {
      e.preventDefault();
      timeRangeSelection.startSelection(day, slot);
    }
  };

  const handleSlotMouseEnter = () => {
    // Update time range selection
    if (timeRangeSelection?.isSelecting) {
      timeRangeSelection.updateSelection(day, slot);
    }
  };

  const handleSlotMouseUp = () => {
    // End time range selection
    if (timeRangeSelection?.isSelecting) {
      timeRangeSelection.endSelection();
    }
  };

  const handleResizeStart = (itemId: string) => {
    setResizingItemId(itemId);
  };

  const handleResizeEnd = () => {
    setResizingItemId(null);
  };

  // Check if this slot is in the selected time range
  const isInSelectedRange = timeRangeSelection?.isSlotInRange(day, slot) || false;
  
  // Check if any items in this slot have collision warnings
  const hasCollisionWarning = items.some(item => dragCollisions.has(item.id));

  // Calculate positions for overlapping items
  const itemsWithPositions = calculateOverlapPositions(allDayItems, slot, resizingItemId);

  // Get selection bounds for continuous overlay
  const selectionBounds = timeRangeSelection?.getSelectionBounds();
  const shouldShowSelectionOverlay = selectionBounds && 
    day.toDateString() === selectionBounds.day.toDateString() && 
    slot === selectionBounds.startSlot;

  const getSlotStyles = () => {
    let slotStyles = `${styles.slot} ${getBorderStyle()}`;
    
    if (hasCollisionWarning) {
      slotStyles += ` ${styles.collisionWarning}`;
    }
    
    return slotStyles;
  };

  return (
    <Droppable droppableId={droppableId}>
      {(provided, snapshot) => (
        <div 
          ref={provided.innerRef}
          {...provided.droppableProps}
          className={`${getSlotStyles()} ${snapshot.isDraggingOver ? styles.dropZone : ''}`}
          onClick={handleSlotClick}
          onMouseDown={handleSlotMouseDown}
          onMouseEnter={handleSlotMouseEnter}
          onMouseUp={handleSlotMouseUp}
        >
          {/* Continuous selection overlay - only show at start slot */}
          {shouldShowSelectionOverlay && (
            <div 
              className={styles.selectedRangeOverlay}
              style={{
                top: '0px',
                height: `${selectionBounds.height}px`,
              }}
            />
          )}

          {/* Show ghost card when dragging from tools */}
          {snapshot.isDraggingOver && snapshot.draggingFromThisWith?.startsWith('tool-') && (
            <div className={styles.ghostCard}>
              Drop here
            </div>
          )}
          
          {// ... keep existing code (item rendering logic)}
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
                  isResizeActive={resizingItemId !== null && resizingItemId !== item.id}
                  onResizeStart={() => handleResizeStart(item.id)}
                  onResizeEnd={handleResizeEnd}
                  onCopyItem={onCopyItem}
                  isCtrlPressed={isCtrlPressed}
                  hasCollisionWarning={dragCollisions.has(item.id)}
                />
              );
            }
            return null;
          })}
          
          {/* Render resizing item separately to avoid column constraints */}
          {resizingItemId && allDayItems.some(item => item.id === resizingItemId) && (() => {
            const resizingItem = allDayItems.find(item => item.id === resizingItemId);
            if (!resizingItem) return null;
            
            const startSlot = Math.floor(new Date(resizingItem.startTime).getHours() * 12 + new Date(resizingItem.startTime).getMinutes() / 5);
            
            if (slot === startSlot) {
              return (
                <CalendarItemComponent
                  key={`resizing-${resizingItem.id}`}
                  item={resizingItem}
                  index={999} // High index to render on top
                  onUpdate={(updates) => onUpdateItem(resizingItem.id, updates)}
                  onDelete={() => onDeleteItem(resizingItem.id)}
                  isSelected={selectedItemIds.has(resizingItem.id)}
                  onSelect={onSelectItem}
                  column={0}
                  totalColumns={1}
                  isResizeActive={false}
                  onResizeStart={() => handleResizeStart(resizingItem.id)}
                  onResizeEnd={handleResizeEnd}
                  onCopyItem={onCopyItem}
                  isCtrlPressed={isCtrlPressed}
                  hasCollisionWarning={dragCollisions.has(resizingItem.id)}
                />
              );
            }
            return null;
          })()}
          
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
};

export default TimeSlot;
