
import { CalendarItem } from '../types';

interface ItemWithPosition {
  item: CalendarItem;
  column: number;
  totalColumns: number;
  startSlot: number;
  endSlot: number;
}

export const calculateOverlapPositions = (
  items: CalendarItem[], 
  currentSlot: number, 
  resizingItemId?: string
): ItemWithPosition[] => {
  const itemsWithPositions: ItemWithPosition[] = [];

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
