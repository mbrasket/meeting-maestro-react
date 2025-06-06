
import { HOUR_HEIGHT, MINUTES_PER_HOUR, PRECISION_MINUTES } from '../types';

export const timeToPixels = (time: string): number => {
  const [hours, minutes] = time.split(':').map(Number);
  return (hours * HOUR_HEIGHT) + ((minutes / MINUTES_PER_HOUR) * HOUR_HEIGHT);
};

export const pixelsToTime = (pixels: number): string => {
  const totalMinutes = Math.round((pixels / HOUR_HEIGHT) * MINUTES_PER_HOUR / PRECISION_MINUTES) * PRECISION_MINUTES;
  const hours = Math.floor(totalMinutes / MINUTES_PER_HOUR);
  const minutes = totalMinutes % MINUTES_PER_HOUR;
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
};

export const calculateDuration = (startTime: string, endTime: string): number => {
  const startPixels = timeToPixels(startTime);
  const endPixels = timeToPixels(endTime);
  return endPixels - startPixels;
};

export const roundToNearestSlot = (pixels: number): number => {
  const slotHeight = (PRECISION_MINUTES / MINUTES_PER_HOUR) * HOUR_HEIGHT;
  return Math.round(pixels / slotHeight) * slotHeight;
};

export const getWeekDates = (startDate: Date): Date[] => {
  const dates = [];
  const currentDate = new Date(startDate);
  
  // Get to Monday of the week
  const dayOfWeek = currentDate.getDay();
  const daysToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  currentDate.setDate(currentDate.getDate() + daysToMonday);
  
  for (let i = 0; i < 7; i++) {
    dates.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  return dates;
};
