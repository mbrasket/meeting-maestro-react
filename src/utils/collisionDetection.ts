
import { CalendarItem } from '../components/calendar/types';

export interface CollisionInfo {
  hasCollision: boolean;
  conflictingItems: CalendarItem[];
}

export const detectCollisions = (
  draggedItem: CalendarItem,
  allItems: CalendarItem[],
  newStartTime: Date,
  newEndTime: Date
): CollisionInfo => {
  const conflictingItems = allItems.filter(item => {
    // Don't check collision with itself
    if (item.id === draggedItem.id) return false;

    // Check if events are on the same day
    const itemDay = new Date(item.startTime).toDateString();
    const draggedDay = newStartTime.toDateString();
    if (itemDay !== draggedDay) return false;

    // Check time overlap
    return (
      (newStartTime < item.endTime && newEndTime > item.startTime) ||
      (item.startTime < newEndTime && item.endTime > newStartTime)
    );
  });

  return {
    hasCollision: conflictingItems.length > 0,
    conflictingItems,
  };
};

export const isValidDropZone = (
  targetElement: Element | null,
  droppableId: string
): boolean => {
  // Check if dropping on a valid calendar slot
  if (!droppableId.includes('-')) return false;
  
  // Check if target is within calendar grid
  const isInCalendar = targetElement?.closest('[data-calendar-grid]') !== null;
  
  return isInCalendar;
};
