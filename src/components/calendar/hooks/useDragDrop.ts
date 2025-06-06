
import { useState, useCallback } from 'react';
import { DropResult } from '@hello-pangea/dnd';
import { CalendarItem } from '../types';
import { calculateDropTime } from '../utils/dropCalculations';

export const useDragDrop = () => {
  const [calendarItems, setCalendarItems] = useState<CalendarItem[]>([]);

  const handleDragEnd = useCallback((result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    // Handle toolbar item drops
    if (source.droppableId === 'toolbar' || draggableId.startsWith('toolbar-')) {
      const dropTime = calculateDropTime(destination.droppableId, 0); // Default to start of slot
      
      if (dropTime) {
        const [, itemType] = draggableId.split('-');
        const duration = getDefaultDuration(itemType);
        
        const newItem: CalendarItem = {
          id: `item-${Date.now()}`,
          type: itemType as any,
          title: `New ${itemType}`,
          startTime: dropTime,
          endTime: new Date(dropTime.getTime() + duration * 60000),
          color: getItemColor(itemType),
        };

        setCalendarItems(prev => [...prev, newItem]);
      }
    }
    
    // Handle existing item moves
    else {
      const dropTime = calculateDropTime(destination.droppableId, 0);
      if (dropTime) {
        setCalendarItems(prev => 
          prev.map(item => {
            if (item.id === draggableId) {
              const duration = item.endTime.getTime() - item.startTime.getTime();
              return {
                ...item,
                startTime: dropTime,
                endTime: new Date(dropTime.getTime() + duration),
              };
            }
            return item;
          })
        );
      }
    }
  }, []);

  return {
    calendarItems,
    handleDragEnd,
    setCalendarItems,
  };
};

const getDefaultDuration = (type: string): number => {
  switch (type) {
    case 'event': return 60;
    case 'task': return 30;
    case 'milestone': return 0;
    case 'highlight': return 15;
    default: return 30;
  }
};

const getItemColor = (type: string): string => {
  switch (type) {
    case 'event': return '#3b82f6';
    case 'task': return '#10b981';
    case 'milestone': return '#8b5cf6';
    case 'highlight': return '#f59e0b';
    default: return '#6b7280';
  }
};
