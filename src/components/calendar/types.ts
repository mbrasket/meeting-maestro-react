
export type CalendarItemType = 'event' | 'task' | 'milestone' | 'highlight';

export interface CalendarItem {
  id: string;
  type: CalendarItemType;
  title: string;
  startTime: Date;
  endTime: Date;
  color?: string;
  completed?: boolean; // for tasks
  description?: string;
  participants?: string[];
  location?: string;
}

export interface TimeSlot {
  day: number; // 0-6 (Sunday to Saturday)
  slot: number; // 0-287 (5-minute increments in 24 hours)
}

export interface DragItem {
  type: CalendarItemType;
  template?: Partial<CalendarItem>;
  existingItem?: CalendarItem;
}
