
import { useState, useCallback, useRef } from 'react';
import { DropResult, DragUpdate } from '@hello-pangea/dnd';
import { CalendarItem } from '../types';
import { calculateDropTime } from '../utils/dropCalculations';

interface DragState {
  mouseX: number;
  mouseY: number;
  isDragging: boolean;
  cleanup?: () => void;
}

export const useDragDrop = () => {
  const [calendarItems, setCalendarItems] = useState<CalendarItem[]>([]);
  const dragStateRef = useRef<DragState>({ 
    mouseX: 0, 
    mouseY: 0, 
    isDragging: false 
  });

  const handleDragStart = useCallback(() => {
    dragStateRef.current.isDragging = true;
    
    const handleMouseMove = (e: MouseEvent) => {
      dragStateRef.current.mouseX = e.clientX;
      dragStateRef.current.mouseY = e.clientY;
    };

    document.addEventListener('mousemove', handleMouseMove);
    
    dragStateRef.current.cleanup = () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const handleDragUpdate = useCallback((update: DragUpdate) => {
    console.log('Drag update:', update, 'Mouse position:', dragStateRef.current.mouseY);
  }, []);

  const handleDragEnd = useCallback((result: DropResult) => {
    const { destination, source, draggableId } = result;
    
    if (dragStateRef.current.cleanup) {
      dragStateRef.current.cleanup();
    }
    dragStateRef.current.isDragging = false;

    if (!destination) return;

    const dropElement = document.querySelector(`[data-rbd-droppable-id="${destination.droppableId}"]`);
    if (!dropElement) return;

    const dropTime = calculateDropTime(
      destination.droppableId, 
      dragStateRef.current.mouseY, 
      dropElement
    );

    if (!dropTime) return;

    if (source.droppableId === 'toolbar' || draggableId.startsWith('toolbar-')) {
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
    } else {
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
