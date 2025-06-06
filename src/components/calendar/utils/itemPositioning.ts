
import { CalendarItem, TimePosition, HOUR_HEIGHT } from '../types';
import { timeToPixels, calculateDuration } from './timeCalculations';

export const calculateItemPosition = (item: CalendarItem): TimePosition => {
  if (item.isAllDay) {
    return { top: 0, height: 0, column: 0, totalColumns: 1 };
  }

  const top = timeToPixels(item.startTime);
  const height = item.endTime ? calculateDuration(item.startTime, item.endTime) : HOUR_HEIGHT / 4; // Default 15min for tasks/reminders
  
  return { top, height, column: 0, totalColumns: 1 };
};

export const resolveOverlaps = (items: CalendarItem[]): Map<string, TimePosition> => {
  const positions = new Map<string, TimePosition>();
  const timeSlots: { [key: string]: CalendarItem[] } = {};
  
  // Group items by time overlap
  items.forEach(item => {
    if (item.isAllDay) {
      positions.set(item.id, calculateItemPosition(item));
      return;
    }
    
    const startPixels = timeToPixels(item.startTime);
    const endPixels = item.endTime ? timeToPixels(item.endTime) : startPixels + (HOUR_HEIGHT / 4);
    
    // Find overlapping time slots
    let assigned = false;
    for (let pixel = startPixels; pixel < endPixels; pixel += 5) {
      const slotKey = Math.floor(pixel / 5).toString();
      if (!timeSlots[slotKey]) timeSlots[slotKey] = [];
      if (!timeSlots[slotKey].includes(item)) {
        timeSlots[slotKey].push(item);
      }
    }
  });
  
  // Calculate columns for overlapping items
  const processedItems = new Set<string>();
  
  items.forEach(item => {
    if (processedItems.has(item.id) || item.isAllDay) return;
    
    const overlappingItems = findOverlappingItems(item, items);
    const totalColumns = overlappingItems.length;
    
    overlappingItems.forEach((overlappingItem, index) => {
      if (!processedItems.has(overlappingItem.id)) {
        const basePosition = calculateItemPosition(overlappingItem);
        positions.set(overlappingItem.id, {
          ...basePosition,
          column: index,
          totalColumns
        });
        processedItems.add(overlappingItem.id);
      }
    });
  });
  
  return positions;
};

const findOverlappingItems = (targetItem: CalendarItem, allItems: CalendarItem[]): CalendarItem[] => {
  const targetStart = timeToPixels(targetItem.startTime);
  const targetEnd = targetItem.endTime ? timeToPixels(targetItem.endTime) : targetStart + (HOUR_HEIGHT / 4);
  
  return allItems.filter(item => {
    if (item.isAllDay || item.id === targetItem.id) return false;
    
    const itemStart = timeToPixels(item.startTime);
    const itemEnd = item.endTime ? timeToPixels(item.endTime) : itemStart + (HOUR_HEIGHT / 4);
    
    return (itemStart < targetEnd && itemEnd > targetStart);
  }).sort((a, b) => timeToPixels(a.startTime) - timeToPixels(b.startTime));
};
