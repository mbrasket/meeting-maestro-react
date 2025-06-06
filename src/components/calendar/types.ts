
export interface CalendarItem {
  id: string;
  title: string;
  type: 'event' | 'task' | 'reminder' | 'milestone';
  startTime: string; // ISO string or time format HH:MM
  endTime?: string; // For events and tasks
  date: string; // YYYY-MM-DD
  isAllDay?: boolean;
  color?: string;
  description?: string;
}

export interface TimePosition {
  top: number; // pixels from top of day
  height: number; // pixels
  column: number; // for overlapping items
  totalColumns: number; // total columns needed for this time slot
}

export interface DragItem {
  type: 'calendar-item';
  item: CalendarItem;
  sourceType: 'toolbar' | 'calendar';
}

export interface DropResult {
  dayIndex: number;
  timeSlot: string; // HH:MM format
  isAllDay: boolean;
}

export const HOUR_HEIGHT = 84; // pixels
export const MINUTES_PER_HOUR = 60;
export const PRECISION_MINUTES = 5;
export const TOTAL_DAY_HEIGHT = 24 * HOUR_HEIGHT; // 2016px
