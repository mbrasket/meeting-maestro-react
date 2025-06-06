
import { useState } from 'react';
import { CalendarItem } from '../components/calendar/types';

export const useDragOverlay = () => {
  const [activeItem, setActiveItem] = useState<CalendarItem | null>(null);

  const setActiveOverlay = (item: CalendarItem | null) => {
    setActiveItem(item);
  };

  const clearOverlay = () => {
    setActiveItem(null);
  };

  return {
    activeItem,
    setActiveOverlay,
    clearOverlay,
  };
};
