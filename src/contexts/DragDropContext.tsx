
import React, { createContext, useContext, useState, ReactNode } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragOverEvent,
  DragEndEvent,
  Active,
  Over,
} from '@dnd-kit/core';
import {
  sortableKeyboardCoordinates,
} from '@dnd-kit/sortable';
import { CalendarItem } from '../components/calendar/types';

interface DragDropContextType {
  activeId: string | null;
  draggedItem: CalendarItem | null;
  isCloning: boolean;
  setDraggedItem: (item: CalendarItem | null) => void;
  setIsCloning: (cloning: boolean) => void;
}

const DragDropContextProvider = createContext<DragDropContextType | undefined>(undefined);

export const useDragDropContext = () => {
  const context = useContext(DragDropContextProvider);
  if (!context) {
    throw new Error('useDragDropContext must be used within a DragDropProvider');
  }
  return context;
};

interface DragDropProviderProps {
  children: ReactNode;
  onDragStart?: (event: DragStartEvent) => void;
  onDragOver?: (event: DragOverEvent) => void;
  onDragEnd?: (event: DragEndEvent) => void;
}

export const DragDropProvider = ({ 
  children, 
  onDragStart, 
  onDragOver, 
  onDragEnd 
}: DragDropProviderProps) => {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [draggedItem, setDraggedItem] = useState<CalendarItem | null>(null);
  const [isCloning, setIsCloning] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
    onDragStart?.(event);
  };

  const handleDragOver = (event: DragOverEvent) => {
    onDragOver?.(event);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveId(null);
    setDraggedItem(null);
    setIsCloning(false);
    onDragEnd?.(event);
  };

  const contextValue: DragDropContextType = {
    activeId,
    draggedItem,
    isCloning,
    setDraggedItem,
    setIsCloning,
  };

  return (
    <DragDropContextProvider.Provider value={contextValue}>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        {children}
        <DragOverlay>
          {draggedItem ? (
            <div style={{
              padding: '4px 8px',
              borderRadius: '4px',
              backgroundColor: '#0078d4',
              color: 'white',
              fontSize: '14px',
              opacity: 0.8,
              transform: 'rotate(5deg)',
            }}>
              {draggedItem.title}
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </DragDropContextProvider.Provider>
  );
};
