
import { CalendarItemType } from '../types';

export interface DragState {
  isDragging: boolean;
  draggedItemId: string | null;
  draggedItemType: CalendarItemType | null;
  sourceType: 'tools' | 'calendar';
  targetDay: Date | null;
  targetSlot: number | null;
  isValidDrop: boolean;
}

export interface DropPosition {
  dayIndex: number;
  slot: number;
  targetDay: Date;
  isValid: boolean;
}
