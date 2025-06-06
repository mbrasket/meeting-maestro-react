
import { CalendarItem } from '../components/calendar/types';

export const generateDragId = (prefix: string): string => {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export const isDraggedFromTools = (draggedId: string): boolean => {
  return draggedId.startsWith('tool-');
};

export const isCalendarSlot = (droppableId: string): boolean => {
  return droppableId.includes('-') && !droppableId.startsWith('tools-');
};

export const parseSlotId = (slotId: string): { date: Date; slot: number } | null => {
  if (!isCalendarSlot(slotId)) return null;
  
  const [dateStr, slotStr] = slotId.split('-');
  const date = new Date(dateStr);
  const slot = parseInt(slotStr);
  
  if (isNaN(slot)) return null;
  
  return { date, slot };
};

export const createCloneId = (): string => {
  return generateDragId('clone');
};

export const isClonedItem = (itemId: string): boolean => {
  return itemId.startsWith('clone-');
};
