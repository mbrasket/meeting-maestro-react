
import { useState } from 'react';
import { Droppable } from '@hello-pangea/dnd';
import { CalendarItem } from './types';
import CalendarItemComponent from './CalendarItemComponent';
import { DropZone } from './components/DropZone';
import { GhostCard } from './components/GhostCard';
import { calculateOverlapPositions } from './utils/overlapCalculations';

interface TimeSlotProps {
  day: Date;
  slot: number;
  items: CalendarItem[];
  allDayItems: CalendarItem[];
  onUpdateItem: (itemId: string, updates: Partial<CalendarItem>) => void;
  onDeleteItem: (itemId: string) => void;
  selectedItemIds: Set<string>;
  onSelectItem: (itemId: string, ctrlKey: boolean) => void;
  onClearSelection: () => void;
  allItems?: CalendarItem[]; // Add this to get access to all items for drag preview
}

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
  allItems = [] // Default to empty array
}: TimeSlotProps) => {
  const [resizingItemId, setResizingItemId] = useState<string | null>(null);
  const droppableId = `${day.toDateString()}-${slot}`;
  
  // Show border only at half-hour increments (every 6 slots = 30 minutes)
  const isHalfHourBoundary = slot % 6 === 0;

  const handleSlotClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClearSelection();
    }
  };

  const handleResizeStart = (itemId: string) => {
    setResizingItemId(itemId);
  };

  const handleResizeEnd = () => {
    setResizingItemId(null);
  };

  const itemsWithPositions = calculateOverlapPositions(allDayItems, slot, resizingItemId);

  const renderItem = (item: CalendarItem, column: number, totalColumns: number, index: number, key: string) => (
    <CalendarItemComponent
      key={key}
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
    />
  );

  return (
    <Droppable droppableId={droppableId}>
      {(provided, snapshot) => (
        <DropZone
          provided={provided}
          snapshot={snapshot}
          isHalfHourBoundary={isHalfHourBoundary}
          onSlotClick={handleSlotClick}
        >
          <GhostCard snapshot={snapshot} allItems={allItems} />
          
          {itemsWithPositions.map((itemData, index) => {
            const { item, column, totalColumns, startSlot } = itemData;
            
            // Only render the item in its starting slot to avoid duplicates
            if (slot === startSlot) {
              return renderItem(item, column, totalColumns, index, item.id);
            }
            return null;
          })}
          
          {/* Render resizing item separately to avoid column constraints */}
          {resizingItemId && allDayItems.some(item => item.id === resizingItemId) && (() => {
            const resizingItem = allDayItems.find(item => item.id === resizingItemId);
            if (!resizingItem) return null;
            
            const startSlot = Math.floor(new Date(resizingItem.startTime).getHours() * 12 + new Date(resizingItem.startTime).getMinutes() / 5);
            
            if (slot === startSlot) {
              return renderItem(resizingItem, 0, 1, 999, `resizing-${resizingItem.id}`);
            }
            return null;
          })()}
        </DropZone>
      )}
    </Droppable>
  );
};

export default TimeSlot;
