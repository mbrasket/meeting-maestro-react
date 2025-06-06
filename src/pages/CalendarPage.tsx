
import { useState, useEffect } from 'react';
import { DragDropContext, DropResult } from '@hello-pangea/dnd';
import {
  makeStyles,
  tokens,
} from '@fluentui/react-components';
import CalendarGrid from '../components/calendar/CalendarGrid';
import ToolsPanel from '../components/calendar/ToolsPanel';
import { CalendarItem } from '../components/calendar/types';
import { snapToGrid } from '../components/calendar/utils/timeUtils';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    height: '100vh',
    paddingTop: '60px', // Space for navigation
    backgroundColor: tokens.colorNeutralBackground1,
  },
  mainContent: {
    flex: 1,
    overflow: 'hidden',
    minWidth: 0, // Prevent flex item from growing beyond container
  },
});

const CalendarPage = () => {
  const styles = useStyles();
  const [calendarItems, setCalendarItems] = useState<CalendarItem[]>([]);
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [selectedItemIds, setSelectedItemIds] = useState<Set<string>>(new Set());
  const [copyingItem, setCopyingItem] = useState<CalendarItem | null>(null);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setSelectedItemIds(new Set());
      } else if (event.key === 'Delete' && selectedItemIds.size > 0) {
        handleDeleteSelected();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedItemIds]);

  const handleAddItem = (item: CalendarItem) => {
    setCalendarItems(prev => [...prev, { ...item, id: Date.now().toString() }]);
  };

  const handleUpdateItem = (itemId: string, updates: Partial<CalendarItem>) => {
    setCalendarItems(prev => 
      prev.map(item => 
        item.id === itemId ? { ...item, ...updates } : item
      )
    );
  };

  const handleDeleteItem = (itemId: string) => {
    setCalendarItems(prev => prev.filter(item => item.id !== itemId));
    setSelectedItemIds(prev => {
      const newSet = new Set(prev);
      newSet.delete(itemId);
      return newSet;
    });
  };

  const handleSelectItem = (itemId: string, ctrlKey: boolean) => {
    setSelectedItemIds(prev => {
      const newSet = new Set(prev);
      
      if (ctrlKey) {
        // Multi-select: toggle the item
        if (newSet.has(itemId)) {
          newSet.delete(itemId);
        } else {
          newSet.add(itemId);
        }
      } else {
        // Single select: clear others and select this one
        if (newSet.has(itemId) && newSet.size === 1) {
          // If only this item is selected, deselect it
          newSet.clear();
        } else {
          // Select only this item
          newSet.clear();
          newSet.add(itemId);
        }
      }
      
      return newSet;
    });
  };

  const handleClearSelection = () => {
    setSelectedItemIds(new Set());
  };

  const handleDeleteSelected = () => {
    setCalendarItems(prev => prev.filter(item => !selectedItemIds.has(item.id)));
    setSelectedItemIds(new Set());
  };

  const handleCopyItem = (item: CalendarItem) => {
    console.log('Copy item requested:', item.id);
    setCopyingItem(item);
  };

  const handleBeforeDragStart = (initial: any) => {
    // Check if CTRL is pressed at the exact moment of drag start
    const isCtrlPressed = window.event?.ctrlKey || false;
    console.log('BeforeDragStart - CTRL pressed:', isCtrlPressed, 'draggableId:', initial.draggableId);
  };

  const handleDragStart = (initial: any) => {
    const { draggableId, source } = initial;
    
    // Check CTRL key state directly from the current event
    const isCtrlPressed = window.event?.ctrlKey || false;
    console.log('DragStart - CTRL pressed:', isCtrlPressed, 'draggableId:', draggableId);
    
    // Only handle cloning for existing calendar items (not tools)
    if (isCtrlPressed && !source.droppableId.startsWith('tools-')) {
      const originalItem = calendarItems.find(item => item.id === draggableId);
      if (originalItem) {
        console.log('Creating clone of item:', originalItem.id);
        
        // Create the clone immediately
        const cloneId = `${Date.now()}-clone`;
        const clonedItem: CalendarItem = {
          ...originalItem,
          id: cloneId,
          title: `${originalItem.title} (Copy)`,
        };
        
        // Add the clone to the calendar
        setCalendarItems(prev => [...prev, clonedItem]);
        setCopyingItem(clonedItem);
        console.log('Clone created with ID:', cloneId);
      }
    }
  };

  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) {
      // If drag was cancelled and we have a copying item (clone), remove it
      if (copyingItem) {
        console.log('Drag cancelled, removing clone:', copyingItem.id);
        setCalendarItems(prev => prev.filter(item => item.id !== copyingItem.id));
      }
      setCopyingItem(null);
      return;
    }

    console.log('Drag ended. Draggable ID:', draggableId);

    // Handle dragging from tools panel to calendar
    if (source.droppableId === 'tools-items' && destination.droppableId.includes('-')) {
      const [dateStr, slotStr] = destination.droppableId.split('-');
      const targetDate = new Date(dateStr);
      const targetSlot = parseInt(slotStr);
      
      // Convert slot to actual time (each slot is 5 minutes)
      const hours = Math.floor(targetSlot / 12);
      const minutes = (targetSlot % 12) * 5;
      targetDate.setHours(hours, minutes, 0, 0);
      
      // Determine type from draggableId - fix the milestone detection
      const type = draggableId.includes('milestone') ? 'milestone' :
                   draggableId.includes('event') ? 'event' : 
                   draggableId.includes('task') ? 'task' :
                   draggableId.includes('highlight') ? 'highlight' : 'event';
      
      // Create new item from tool template
      const duration = type === 'milestone' ? 0 : 60; // Default 1 hour, 0 for milestones
      
      const newItem: CalendarItem = {
        id: Date.now().toString(),
        type,
        title: `New ${type.charAt(0).toUpperCase() + type.slice(1)}`,
        startTime: snapToGrid(targetDate),
        endTime: snapToGrid(new Date(targetDate.getTime() + duration * 60 * 1000)),
        completed: false,
      };
      
      handleAddItem(newItem);
    }
    
    // Handle moving existing calendar items
    if (!source.droppableId.startsWith('tools-') && !destination.droppableId.startsWith('tools-')) {
      const item = calendarItems.find(item => item.id === draggableId);
      if (item) {
        const [dateStr, slotStr] = destination.droppableId.split('-');
        const targetDate = new Date(dateStr);
        const targetSlot = parseInt(slotStr);
        
        // Convert slot to actual time
        const hours = Math.floor(targetSlot / 12);
        const minutes = (targetSlot % 12) * 5;
        targetDate.setHours(hours, minutes, 0, 0);
        
        const duration = item.endTime.getTime() - item.startTime.getTime();
        const newStartTime = snapToGrid(targetDate);
        const newEndTime = new Date(newStartTime.getTime() + duration);
        
        console.log('Moving item to new position:', item.id);
        handleUpdateItem(item.id, {
          startTime: newStartTime,
          endTime: newEndTime,
        });
      }
    }

    // Clear copying state after drag operation
    setCopyingItem(null);
  };

  return (
    <DragDropContext 
      onBeforeDragStart={handleBeforeDragStart}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className={styles.container}>
        <div className={styles.mainContent}>
          <CalendarGrid
            items={calendarItems}
            currentWeek={currentWeek}
            onUpdateItem={handleUpdateItem}
            onDeleteItem={handleDeleteItem}
            onWeekChange={setCurrentWeek}
            selectedItemIds={selectedItemIds}
            onSelectItem={handleSelectItem}
            onClearSelection={handleClearSelection}
            onAddItem={handleAddItem}
            onCopyItem={handleCopyItem}
            isCtrlPressed={false}
          />
        </div>
        <ToolsPanel onAddItem={handleAddItem} />
      </div>
    </DragDropContext>
  );
};

export default CalendarPage;
