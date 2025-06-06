
import { CalendarItem } from '../types';

export const calculateItemPosition = (item: CalendarItem) => {
  const startHour = item.startTime.getHours();
  const startMinute = item.startTime.getMinutes();
  const endHour = item.endTime.getHours();
  const endMinute = item.endTime.getMinutes();

  const startSlot = startHour * 12 + Math.floor(startMinute / 5);
  const endSlot = endHour * 12 + Math.floor(endMinute / 5);
  
  const top = startSlot * 7; // 7px per 5-minute slot
  const height = Math.max(7, (endSlot - startSlot) * 7); // Minimum 5 minutes

  return { top, height };
};

export const calculateOverlapColumns = (items: CalendarItem[]): Map<string, { column: number; totalColumns: number }> => {
  const result = new Map();
  
  // Sort items by start time
  const sortedItems = [...items].sort((a, b) => a.startTime.getTime() - b.startTime.getTime());
  
  // Group overlapping items
  const overlapGroups: CalendarItem[][] = [];
  
  for (const item of sortedItems) {
    let addedToGroup = false;
    
    for (const group of overlapGroups) {
      const hasOverlap = group.some(groupItem => 
        item.startTime < groupItem.endTime && item.endTime > groupItem.startTime
      );
      
      if (hasOverlap) {
        group.push(item);
        addedToGroup = true;
        break;
      }
    }
    
    if (!addedToGroup) {
      overlapGroups.push([item]);
    }
  }
  
  // Assign columns within each group
  for (const group of overlapGroups) {
    const totalColumns = group.length;
    group.forEach((item, index) => {
      result.set(item.id, {
        column: index,
        totalColumns,
      });
    });
  }
  
  // Handle non-overlapping items
  for (const item of sortedItems) {
    if (!result.has(item.id)) {
      result.set(item.id, { column: 0, totalColumns: 1 });
    }
  }
  
  return result;
};
