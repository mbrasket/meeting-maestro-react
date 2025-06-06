
import { useState, useCallback, useRef } from 'react';
import { DropResult } from '@hello-pangea/dnd';
import { CalendarItem } from '../types';
import { calculateDropTime, mousePositionToTimeSlot } from '../utils/dropCalculations';

export const useDragDrop = () => {
  const [calendarItems, setCalendarItems] = useState<CalendarItem[]>([]);
  const mousePositionRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Track mouse position during drag
  const updateMousePosition = useCallback((event: MouseEvent) => {
    mousePositionRef.current = { x: event.clientX, y: event.clientY };
  }, []);

  const handleDragEnd = useCallback((result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    // Get the current mouse position
    const mouseY = mousePositionRef.current.y;
    
    // Get the drop target element to calculate relative position
    const dropElement = document.querySelector(`[data-rbd-droppable-id="${destination.droppableId}"]`);
    let mouseOffset = 0;
    
    if (dropElement) {
      const rect = dropElement.getBoundingClientRect();
      mouseOffset = mouseY - rect.top;
    }

    // Handle toolbar item drops
    if (source.droppableId === 'toolbar' || draggableId.startsWith('toolbar-')) {
      const dropTime = calculateDropTime(destination.droppableId, mouseOffset);
      
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
      const dropTime = calculateDropTime(destination.droppableId, mouseOffset);
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

    // Remove mouse event listener
    document.removeEventListener('mousemove', updateMousePosition);
  }, [updateMousePosition]);

  const handleDragStart = useCallback(() => {
    // Add mouse event listener when drag starts
    document.addEventListener('mousemove', updateMousePosition);
  }, [updateMousePosition]);

  const handleDragUpdate = useCallback((update: any) => {
    // Track drag updates for visual feedback
    console.log('Drag update:', update);
  }, []);

  return {
    calendarItems,
    handleDragEnd,
    handleDragStart,
    handleDragUpdate,
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
