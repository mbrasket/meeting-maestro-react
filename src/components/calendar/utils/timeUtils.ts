
import { format, startOfWeek, addDays, addMinutes } from 'date-fns';

// Convert time slot (0-287) to actual time
export const slotToTime = (slot: number): string => {
  const hours = Math.floor(slot / 12);
  const minutes = (slot % 12) * 5;
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
};

// Convert time string to slot number
export const timeToSlot = (timeStr: string): number => {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 12 + Math.floor(minutes / 5);
};

// Get week days starting from Sunday
export const getWeekDays = (date: Date): Date[] => {
  const start = startOfWeek(date, { weekStartsOn: 0 });
  return Array.from({ length: 7 }, (_, i) => addDays(start, i));
};

// Snap time to 5-minute increments
export const snapToGrid = (date: Date): Date => {
  const minutes = date.getMinutes();
  const snappedMinutes = Math.round(minutes / 5) * 5;
  const newDate = new Date(date);
  newDate.setMinutes(snappedMinutes);
  newDate.setSeconds(0);
  newDate.setMilliseconds(0);
  return newDate;
};

// Calculate duration in slots (5-minute increments)
export const calculateDurationSlots = (startTime: Date, endTime: Date): number => {
  const diffMs = endTime.getTime() - startTime.getTime();
  return Math.max(1, Math.round(diffMs / (5 * 60 * 1000)));
};

// Convert date and time to grid position
export const getGridPosition = (date: Date, weekStart: Date) => {
  const day = Math.floor((date.getTime() - weekStart.getTime()) / (24 * 60 * 60 * 1000));
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const slot = hours * 12 + Math.floor(minutes / 5);
  
  return { day: Math.max(0, Math.min(6, day)), slot };
};
