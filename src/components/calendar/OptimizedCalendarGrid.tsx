
import { useState, useCallback, useMemo, useRef } from 'react';
import {
  makeStyles,
  tokens,
  Text,
  Button,
} from '@fluentui/react-components';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { format, addWeeks, subWeeks } from 'date-fns';
import { DragDropContext, DropResult, DragStart, DragUpdate } from '@hello-pangea/dnd';
import { CalendarItem } from './types';
import { getWeekDays, snapToGrid } from './utils/timeUtils';
import { DayColumn } from './components/DayColumn';
import { TimeColumn } from './components/TimeColumn';
import { DragGhost } from './components/DragGhost';

const useStyles = makeStyles({
  container: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: tokens.spacingVerticalM,
    borderBottomColor: tokens.colorNeutralStroke1,
    borderBottomWidth: '1px',
    borderBottomStyle: 'solid',
  },
  weekNavigation: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalM,
  },
  gridContainer: {
    flex: 1,
    display: 'flex',
    overflow: 'auto',
    minWidth: '800px',
    position: 'relative',
  },
  grid: {
    flex: 1,
    display: 'grid',
    gridTemplateColumns: 'repeat(7, 1fr)',
    position: 'relative',
  },
});

interface OptimizedCalendarGridProps {
  items: CalendarItem[];
  currentWeek: Date;
  onUpdateItem: (itemId: string, updates: Partial<CalendarItem>) => void;
  onDeleteItem: (itemId: string) => void;
  onWeekChange: (date: Date) => void;
  selectedItemIds: Set<string>;
  onSelectItem: (itemId: string, ctrlKey: boolean) => void;
  onClearSelection: () => void;
  onAddItem: (item: CalendarItem) => void;
}

interface DragState {
  isDragging: boolean;
  draggedItemId: string | null;
  draggedItemType: string | null;
  currentCoordinates: { x: number; y: number } | null;
  targetDay: Date | null;
  targetSlot: number | null;
}

const OptimizedCalendarGrid = ({
  items,
  currentWeek,
  onUpdateItem,
  onDeleteItem,
  onWeekChange,
  selectedItemIds,
  onSelectItem,
  onClearSelection,
  onAddItem,
}: OptimizedCalendarGridProps) => {
  const styles = useStyles();
  const weekDays = getWeekDays(currentWeek);
  const gridRef = useRef<HTMLDivElement>(null);
  
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    draggedItemId: null,
    draggedItemType: null,
    currentCoordinates: null,
    targetDay: null,
    targetSlot: null,
  });

  // Memoize items by day for performance
  const itemsByDay = useMemo(() => {
    const byDay = new Map<string, CalendarItem[]>();
    weekDays.forEach(day => {
      const dayKey = day.toDateString();
      byDay.set(dayKey, items.filter(item => 
        new Date(item.startTime).toDateString() === dayKey
      ));
    });
    return byDay;
  }, [items, weekDays]);

  const handleDragStart = useCallback((start: DragStart) => {
    const item = items.find(item => item.id === start.draggableId);
    const type = start.draggableId.startsWith('tool-') 
      ? start.draggableId.replace('tool-', '')
      : item?.type || 'event';

    setDragState(prev => ({
      ...prev,
      isDragging: true,
      draggedItemId: start.draggableId,
      draggedItemType: type,
    }));

    // Add mouse move listener for real-time coordinates
    const handleMouseMove = (e: MouseEvent) => {
      setDragState(prev => ({
        ...prev,
        currentCoordinates: { x: e.clientX, y: e.clientY },
      }));
    };

    document.addEventListener('mousemove', handleMouseMove);
    
    // Clean up on drag end
    const cleanup = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', cleanup);
    };
    document.addEventListener('mouseup', cleanup);
  }, [items]);

  const handleDragUpdate = useCallback((update: DragUpdate) => {
    // Update is handled by mouse events for better performance
  }, []);

  const handleDragEnd = useCallback((result: DropResult) => {
    const { destination, source, draggableId } = result;

    // Clear drag state
    setDragState({
      isDragging: false,
      draggedItemId: null,
      draggedItemType: null,
      currentCoordinates: null,
      targetDay: null,
      targetSlot: null,
    });

    if (!destination) return;

    // Handle dragging from tools panel to calendar
    if (source.droppableId === 'tools-items' && destination.droppableId.startsWith('day-')) {
      const dayIndex = parseInt(destination.droppableId.replace('day-', ''));
      const targetDate = new Date(weekDays[dayIndex]);
      
      // Use current mouse position to calculate exact drop position
      if (dragState.currentCoordinates && gridRef.current) {
        const gridRect = gridRef.current.getBoundingClientRect();
        const timeColumnWidth = 60; // Width of time column
        const relativeY = dragState.currentCoordinates.y - gridRect.top - 40; // Subtract header height
        
        // Calculate slot based on Y position (7px per slot)
        const slot = Math.max(0, Math.min(287, Math.floor(relativeY / 7)));
        const hours = Math.floor(slot / 12);
        const minutes = (slot % 12) * 5;
        
        targetDate.setHours(hours, minutes, 0, 0);
      }
      
      const type = draggableId.includes('milestone') ? 'milestone' :
                   draggableId.includes('event') ? 'event' : 
                   draggableId.includes('task') ? 'task' :
                   draggableId.includes('highlight') ? 'highlight' : 'event';
      
      const duration = type === 'milestone' ? 0 : 60;
      
      const newItem: CalendarItem = {
        id: Date.now().toString(),
        type,
        title: `New ${type.charAt(0).toUpperCase() + type.slice(1)}`,
        startTime: snapToGrid(targetDate),
        endTime: snapToGrid(new Date(targetDate.getTime() + duration * 60 * 1000)),
        completed: false,
      };
      
      onAddItem(newItem);
    }
    
    // Handle moving existing calendar items
    if (!source.droppableId.startsWith('tools-') && !destination.droppableId.startsWith('tools-')) {
      const item = items.find(item => item.id === draggableId);
      if (item && destination.droppableId.startsWith('day-')) {
        const dayIndex = parseInt(destination.droppableId.replace('day-', ''));
        const targetDate = new Date(weekDays[dayIndex]);
        
        // Use current mouse position for precise drop location
        if (dragState.currentCoordinates && gridRef.current) {
          const gridRect = gridRef.current.getBoundingClientRect();
          const relativeY = dragState.currentCoordinates.y - gridRect.top - 40; // Subtract header height
          
          const slot = Math.max(0, Math.min(287, Math.floor(relativeY / 7)));
          const hours = Math.floor(slot / 12);
          const minutes = (slot % 12) * 5;
          
          targetDate.setHours(hours, minutes, 0, 0);
        }
        
        const duration = item.endTime.getTime() - item.startTime.getTime();
        const newStartTime = snapToGrid(targetDate);
        const newEndTime = new Date(newStartTime.getTime() + duration);
        
        onUpdateItem(item.id, {
          startTime: newStartTime,
          endTime: newEndTime,
        });
      }
    }
  }, [dragState, weekDays, items, onAddItem, onUpdateItem]);

  const handlePreviousWeek = () => {
    onWeekChange(subWeeks(currentWeek, 1));
  };

  const handleNextWeek = () => {
    onWeekChange(addWeeks(currentWeek, 1));
  };

  const handleGridClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClearSelection();
    }
  };

  return (
    <DragDropContext 
      onDragStart={handleDragStart}
      onDragUpdate={handleDragUpdate}
      onDragEnd={handleDragEnd}
    >
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.weekNavigation}>
            <Button 
              appearance="subtle" 
              icon={<ChevronLeft />} 
              onClick={handlePreviousWeek}
            />
            <Text size={500} weight="semibold">
              {format(weekDays[0], 'MMM d')} - {format(weekDays[6], 'MMM d, yyyy')}
            </Text>
            <Button 
              appearance="subtle" 
              icon={<ChevronRight />} 
              onClick={handleNextWeek}
            />
          </div>
        </div>
        
        <div className={styles.gridContainer} ref={gridRef}>
          <TimeColumn />
          
          <div 
            className={styles.grid}
            onClick={handleGridClick}
          >
            {weekDays.map((day, dayIndex) => (
              <DayColumn
                key={day.toDateString()}
                day={day}
                dayIndex={dayIndex}
                items={itemsByDay.get(day.toDateString()) || []}
                allItems={items}
                onUpdateItem={onUpdateItem}
                onDeleteItem={onDeleteItem}
                selectedItemIds={selectedItemIds}
                onSelectItem={onSelectItem}
                onClearSelection={onClearSelection}
              />
            ))}
          </div>
          
          {dragState.isDragging && (
            <DragGhost
              dragState={dragState}
              allItems={items}
            />
          )}
        </div>
      </div>
    </DragDropContext>
  );
};

export default OptimizedCalendarGrid;
