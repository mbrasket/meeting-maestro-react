
import { CalendarItem } from '../types';

export const calculateItemHeight = (item: CalendarItem): number => {
  const startSlot = Math.floor(new Date(item.startTime).getHours() * 12 + new Date(item.startTime).getMinutes() / 5);
  const endSlot = Math.floor(new Date(item.endTime).getHours() * 12 + new Date(item.endTime).getMinutes() / 5);
  return Math.max(1, endSlot - startSlot) * 7; // 7px per 5-minute slot (84px per hour)
};

export const calculateItemPosition = (column: number, totalColumns: number) => {
  const columnWidth = 100 / totalColumns;
  const left = column * columnWidth;
  return {
    left: `calc(${left}% + 2px)`, // Reduced from 4px
    width: `calc(${columnWidth}% - 4px)`, // Reduced from 8px (2px left + 2px right)
    paddingLeft: column > 0 ? '1px' : '0px', // Reduced from 2px
    paddingRight: column < totalColumns - 1 ? '1px' : '0px', // Reduced from 2px
  };
};
