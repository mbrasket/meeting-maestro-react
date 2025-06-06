
import { useCallback } from 'react';
import { DragStartEvent, DragOverEvent, DragEndEvent } from '@dnd-kit/core';
import { CalendarItem } from '../components/calendar/types';
import { snapToGrid } from '../components/calendar/utils/timeUtils';
import { useDragDropContext } from '../contexts/DragDropContext';
import { useKeyboardRef } from './useKeyboardRef';

interface UseDragAndDropProps {
  items: CalendarItem[];
  onUpdateItem: (itemId: string, updates: Partial<CalendarItem>) => void;
  onAddItem: (item: CalendarItem) => void;
  onDeleteItem: (itemId: string) => void;
  setCalendarItems: React.Dispatch<React.SetStateAction<CalendarItem[]>>;
}

export const useDragAndDrop = ({
  items,
  onUpdateItem,
  onAddItem,
  onDeleteItem,
  setCalendarItems,
}: UseDragAndDropProps) => {
  const { setDraggedItem, setIsCloning } = useDragDropContext();
  const keyboardRef = useKeyboardRef();

  const handleDragStart = useCallback((event: DragStartEvent) => {
    const { active } = event;
    const draggedId = active.id as string;
    
    // Check if CTRL is pressed for cloning
    const isCtrlPressed = keyboardRef.current.ctrlKey;
    console.log('DragStart - CTRL Clone Debug:', {
      ctrlPressed: isCtrlPressed,
      draggableId: draggedId,
      isFromTools: draggedId.startsWith('tool-'),
      shouldClone: isCtrlPressed && !draggedId.startsWith('tool-'),
      timestamp: new Date().toLocaleTimeString()
    });

    // Find the dragged item
    const item = items.find(item => item.id === draggedId);
    
    if (item) {
      setDraggedItem(item);
      
      // Handle cloning for existing calendar items when CTRL is pressed
      if (isCtrlPressed && !draggedId.startsWith('tool-')) {
        console.log('Creating clone of item:', {
          originalId: item.id,
          originalTitle: item.title,
          timestamp: new Date().toLocaleTimeString()
        });
        
        const cloneId = `clone-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const clonedItem: CalendarItem = {
          ...item,
          id: cloneId,
          title: `${item.title} (Copy)`,
        };
        
        setCalendarItems(prev => {
          console.log('Adding clone to calendar items:', cloneId);
          return [...prev, clonedItem];
        });
        
        setIsCloning(true);
        setDraggedItem(clonedItem);
        console.log('Clone created successfully:', {
          cloneId: cloneId,
          cloneTitle: clonedItem.title
        });
      }
    } else if (draggedId.startsWith('tool-')) {
      // Handle tool items
      const toolType = draggedId.replace('tool-', '');
      const toolItem: CalendarItem = {
        id: `temp-${Date.now()}`,
        type: toolType as any,
        title: `New ${toolType.charAt(0).toUpperCase() + toolType.slice(1)}`,
        startTime: new Date(),
        endTime: new Date(),
        completed: false,
      };
      setDraggedItem(toolItem);
    }
  }, [items, keyboardRef, setDraggedItem, setIsCloning, setCalendarItems]);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over) {
      // If drag was cancelled and we have a cloning operation, clean up
      const draggedId = active.id as string;
      if (draggedId.startsWith('clone-')) {
        console.log('Drag cancelled, removing clone:', draggedId);
        setCalendarItems(prev => prev.filter(item => item.id !== draggedId));
      }
      return;
    }

    const draggedId = active.id as string;
    const dropZoneId = over.id as string;

    console.log('DragEnd - Final Debug:', {
      destination: dropZoneId,
      draggableId: draggedId,
      timestamp: new Date().toLocaleTimeString()
    });

    // Handle dropping on calendar slots
    if (dropZoneId.includes('-')) {
      const [dateStr, slotStr] = dropZoneId.split('-');
      const targetDate = new Date(dateStr);
      const targetSlot = parseInt(slotStr);
      
      // Convert slot to actual time
      const hours = Math.floor(targetSlot / 12);
      const minutes = (targetSlot % 12) * 5;
      targetDate.setHours(hours, minutes, 0, 0);

      if (draggedId.startsWith('tool-')) {
        // Create new item from tool template
        const toolType = draggedId.replace('tool-', '');
        const duration = toolType === 'milestone' ? 0 : 60; // Default 1 hour, 0 for milestones
        
        const newItem: CalendarItem = {
          id: Date.now().toString(),
          type: toolType as any,
          title: `New ${toolType.charAt(0).toUpperCase() + toolType.slice(1)}`,
          startTime: snapToGrid(targetDate),
          endTime: snapToGrid(new Date(targetDate.getTime() + duration * 60 * 1000)),
          completed: false,
        };
        
        onAddItem(newItem);
      } else {
        // Move existing item
        const item = items.find(item => item.id === draggedId);
        if (item) {
          const duration = item.endTime.getTime() - item.startTime.getTime();
          const newStartTime = snapToGrid(targetDate);
          const newEndTime = new Date(newStartTime.getTime() + duration);
          
          console.log('Moving item to new position:', item.id);
          onUpdateItem(item.id, {
            startTime: newStartTime,
            endTime: newEndTime,
          });
        }
      }
    }
  }, [items, onUpdateItem, onAddItem, setCalendarItems]);

  return {
    handleDragStart,
    handleDragEnd,
  };
};
