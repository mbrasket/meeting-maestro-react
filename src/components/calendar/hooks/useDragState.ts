
import { useState, useCallback } from 'react';
import { CalendarItem } from '../types';
import { DragState } from '../types/dragTypes';

interface SimpleDragState {
  isDragging: boolean;
  draggedItemId: string | null;
  draggedItemType: string | null;
}

export const useDragState = () => {
  const [dragState, setDragState] = useState<SimpleDragState>({
    isDragging: false,
    draggedItemId: null,
    draggedItemType: null,
  });

  const startDrag = useCallback((itemId: string, itemType: string) => {
    setDragState({
      isDragging: true,
      draggedItemId: itemId,
      draggedItemType: itemType,
    });
  }, []);

  const endDrag = useCallback(() => {
    setDragState({
      isDragging: false,
      draggedItemId: null,
      draggedItemType: null,
    });
  }, []);

  const getDragPreview = useCallback((allItems: CalendarItem[]) => {
    if (!dragState.draggedItemId) return null;
    
    // For tool items
    if (dragState.draggedItemId.startsWith('tool-')) {
      return {
        type: dragState.draggedItemType || 'event',
        title: `New ${dragState.draggedItemType || 'Event'}`,
        isFromTool: true,
      };
    }
    
    // For existing items
    const item = allItems.find(item => item.id === dragState.draggedItemId);
    if (item) {
      return {
        type: item.type,
        title: item.title,
        completed: item.completed,
        isFromTool: false,
      };
    }
    
    return null;
  }, [dragState]);

  return {
    dragState,
    startDrag,
    endDrag,
    getDragPreview,
  };
};
