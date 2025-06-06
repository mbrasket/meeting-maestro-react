
import { useState } from 'react';
import { CalendarItem } from '../types';

export const useItemResize = (
  item: CalendarItem,
  onUpdate: (updates: Partial<CalendarItem>) => void,
  onResizeStart?: () => void,
  onResizeEnd?: () => void
) => {
  const [isResizing, setIsResizing] = useState(false);

  const handleResizeMouseDown = (direction: 'top' | 'bottom') => (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);
    onResizeStart?.();

    const startY = e.clientY;
    const startTime = new Date(item.startTime);
    const endTime = new Date(item.endTime);

    const handleMouseMove = (e: MouseEvent) => {
      const deltaY = e.clientY - startY;
      const deltaSlots = Math.round(deltaY / 7); // 7px per 5-minute slot

      if (direction === 'top') {
        const newStartTime = new Date(startTime);
        newStartTime.setMinutes(startTime.getMinutes() + deltaSlots * 5);
        if (newStartTime < endTime) {
          onUpdate({ startTime: newStartTime });
        }
      } else {
        const newEndTime = new Date(endTime);
        newEndTime.setMinutes(endTime.getMinutes() + deltaSlots * 5);
        if (newEndTime > startTime) {
          onUpdate({ endTime: newEndTime });
        }
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      onResizeEnd?.();
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  return { isResizing, handleResizeMouseDown };
};
