import { useState, useCallback, useMemo, useRef } from 'react';
import {
  makeStyles,
  tokens,
  Text,
  Button,
} from '@fluentui/react-components';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { format, addWeeks, subWeeks } from 'date-fns';
import { DragDropContext, DropResult, DragStart, DragUpdate, BeforeCapture } from '@hello-pangea/dnd';
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
  sourceType: 'tools' | 'calendar';
  targetDay: Date | null;
  targetSlot: number | null;
  isValidDrop: boolean;
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
    sourceType: 'calendar',
    targetDay: null,
    targetSlot: null,
    isValidDrop: false,
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

  const calculateDropPosition = useCallback((clientX: number, clientY: number) => {
    if (!gridRef.current) return null;

    const gridRect = gridRef.current.getBoundingClientRect();
    const timeColumnWidth = 60;
    const headerHeight = 40;
    
    // Calculate which day column we're over
    const relativeX = clientX - gridRect.left - timeColumnWidth;
    const dayColumnWidth = (gridRect.width - timeColumnWidth) / 7;
    const dayIndex = Math.floor(relativeX / dayColumnWidth);
    
    if (dayIndex < 0 || dayIndex >= 7) return null;
    
    // Calculate time slot
    const relativeY = clientY - gridRect.top - headerHeight;
    const slot = Math.max(0, Math.min(287, Math.floor(relativeY / 7)));
    
    return {
      dayIndex,
      slot,
      targetDay: weekDays[dayIndex],
      isValid: dayIndex >= 0 && dayIndex < 7 && slot >= 0 && slot <= 287,
    };
  }, [weekDays]);

  const handleBeforeCapture = useCallback((before: BeforeCapture) => {
    const item = items.find(item => item.id === before.draggableId);
    const sourceType = before.draggableId.startsWith('tool-') ? 'tools' : 'calendar';
    const type = sourceType === 'tools' 
      ? before.draggableId.replace('tool-', '')
      : item?.type || 'event';

    setDragState({
      isDragging: true,
      draggedItemId: before.draggableId,
      draggedItemType: type,
      sourceType,
      targetDay: null,
      targetSlot: null,
      isValidDrop: false,
    });
  }, [items]);

  const handleDragStart = useCallback((start: DragStart) => {
    // Additional setup if needed
  }, []);

  const handleDragUpdate = useCallback((update: DragUpdate) => {
    if (!update.destination) {
      setDragState(prev => ({ ...prev, isValidDrop: false, targetDay: null, targetSlot: null }));
      return;
    }

    // For day-based drops, extract day and use mouse position for slot
    if (update.destination.droppableId.startsWith('day-')) {
      const dayIndex = parseInt(update.destination.droppableId.replace('day-', ''));
      const targetDay = weekDays[dayIndex];
      
      setDragState(prev => ({
        ...prev,
        targetDay,
        targetSlot: null, // Will be calculated on mouse position in drop
        isValidDrop: true,
      }));
    }
  }, [weekDays]);

  const handleDragEnd = useCallback((result: DropResult) => {
    const { destination, source, draggableId } = result;

    // Clear drag state
    setDragState({
      isDragging: false,
      draggedItemId: null,
      draggedItemType: null,
      sourceType: 'calendar',
      targetDay: null,
      targetSlot: null,
      isValidDrop: false,
    });

    if (!destination) return;

    // Handle dragging from tools panel to calendar
    if (source.droppableId === 'tools-items' && destination.droppableId.startsWith('day-')) {
      const dayIndex = parseInt(destination.droppableId.replace('day-', ''));
      const targetDate = new Date(weekDays[dayIndex]);
      
      // Set to 9 AM as default drop time
      targetDate.setHours(9, 0, 0, 0);
      
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
        
        // Keep the same time of day when moving between days
        const originalTime = new Date(item.startTime);
        targetDate.setHours(originalTime.getHours(), originalTime.getMinutes(), 0, 0);
        
        const duration = item.endTime.getTime() - item.startTime.getTime();
        const newStartTime = snapToGrid(targetDate);
        const newEndTime = new Date(newStartTime.getTime() + duration);
        
        onUpdateItem(item.id, {
          startTime: newStartTime,
          endTime: newEndTime,
        });
      }
    }
  }, [weekDays, items, onAddItem, onUpdateItem]);

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
      onBeforeCapture={handleBeforeCapture}
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
                dragState={dragState}
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
