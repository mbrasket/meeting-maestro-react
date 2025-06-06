
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
    left: `calc(${left}% + 4px)`, // Add 4px padding from left edge
    width: `calc(${columnWidth}% - 8px)`, // Subtract 8px total padding (4px left + 4px right)
    paddingLeft: column > 0 ? '2px' : '0px',
    paddingRight: column < totalColumns - 1 ? '2px' : '0px',
  };
};
