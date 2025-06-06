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
import { useKeyboardRef } from '../hooks/useKeyboardRef';
import { useTimeRangeSelection } from '../hooks/useTimeRangeSelection';
import { detectCollisions } from '../utils/collisionDetection';

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
  ctrlIndicator: {
    position: 'fixed',
    top: '70px',
    right: '20px',
    backgroundColor: tokens.colorBrandBackground,
    color: tokens.colorNeutralForegroundOnBrand,
    padding: '8px 12px',
    borderRadius: '4px',
    fontSize: '12px',
    fontWeight: tokens.fontWeightSemibold,
    zIndex: 1000,
    opacity: '0.9',
  },
});

const CalendarPage = () => {
  const styles = useStyles();
  const [calendarItems, setCalendarItems] = useState<CalendarItem[]>([]);
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [selectedItemIds, setSelectedItemIds] = useState<Set<string>>(new Set());
  const [copyingItem, setCopyingItem] = useState<CalendarItem | null>(null);
  const [dragCollisions, setDragCollisions] = useState<Set<string>>(new Set());
  
  const keyboardRef = useKeyboardRef();
  const timeRangeSelection = useTimeRangeSelection();

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setSelectedItemIds(new Set());
        timeRangeSelection.clearSelection();
      } else if (event.key === 'Delete' && selectedItemIds.size > 0) {
        handleDeleteSelected();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedItemIds, timeRangeSelection]);

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
    timeRangeSelection.clearSelection();
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
    const ctrlState = keyboardRef.current.ctrlKey;
    console.log('BeforeDragStart - CTRL Debug:', {
      ctrlPressed: ctrlState,
      draggableId: initial.draggableId,
      source: initial.source,
      timestamp: new Date().toLocaleTimeString()
    });
  };

  const handleDragStart = (initial: any) => {
    const { draggableId, source } = initial;
    
    // Get the current CTRL state at the moment of drag start
    const isCtrlPressed = keyboardRef.current.ctrlKey;
    console.log('DragStart - CTRL Clone Debug:', {
      ctrlPressed: isCtrlPressed,
      draggableId: draggableId,
      sourceDroppableId: source.droppableId,
      isFromTools: source.droppableId.startsWith('tools-'),
      shouldClone: isCtrlPressed && !source.droppableId.startsWith('tools-'),
      timestamp: new Date().toLocaleTimeString()
    });
    
    // Only handle cloning for existing calendar items (not tools) when CTRL is pressed
    if (isCtrlPressed && !source.droppableId.startsWith('tools-')) {
      const originalItem = calendarItems.find(item => item.id === draggableId);
      if (originalItem) {
        console.log('Creating clone of item:', {
          originalId: originalItem.id,
          originalTitle: originalItem.title,
          timestamp: new Date().toLocaleTimeString()
        });
        
        // Create the clone immediately with a unique ID
        const cloneId = `clone-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const clonedItem: CalendarItem = {
          ...originalItem,
          id: cloneId,
          title: `${originalItem.title} (Copy)`,
        };
        
        // Add the clone to the calendar
        setCalendarItems(prev => {
          console.log('Adding clone to calendar items:', cloneId);
          return [...prev, clonedItem];
        });
        setCopyingItem(clonedItem);
        console.log('Clone created successfully:', {
          cloneId: cloneId,
          cloneTitle: clonedItem.title
        });
      } else {
        console.warn('Original item not found for cloning:', draggableId);
      }
    } else if (isCtrlPressed) {
      console.log('CTRL pressed but drag is from tools - no cloning');
    } else {
      console.log('CTRL not pressed - normal drag operation');
    }
  };

  const handleDragUpdate = (update: any) => {
    const { destination, draggableId } = update;
    
    if (destination && !destination.droppableId.startsWith('tools-')) {
      const [dateStr, slotStr] = destination.droppableId.split('-');
      const targetDate = new Date(dateStr);
      const targetSlot = parseInt(slotStr);
      
      // Convert slot to actual time
      const hours = Math.floor(targetSlot / 12);
      const minutes = (targetSlot % 12) * 5;
      targetDate.setHours(hours, minutes, 0, 0);
      
      const draggedItem = calendarItems.find(item => item.id === draggableId);
      if (draggedItem) {
        const duration = draggedItem.endTime.getTime() - draggedItem.startTime.getTime();
        const newStartTime = snapToGrid(targetDate);
        const newEndTime = new Date(newStartTime.getTime() + duration);
        
        // Check for collisions
        const collision = detectCollisions(draggedItem, calendarItems, newStartTime, newEndTime);
        
        if (collision.hasCollision) {
          setDragCollisions(new Set(collision.conflictingItems.map(item => item.id)));
        } else {
          setDragCollisions(new Set());
        }
      }
    } else {
      setDragCollisions(new Set());
    }
  };

  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;
    
    console.log('DragEnd - Final Debug:', {
      destination: destination?.droppableId,
      source: source.droppableId,
      draggableId,
      copyingItem: copyingItem?.id,
      timestamp: new Date().toLocaleTimeString()
    });
    
    // Clear collision indicators
    setDragCollisions(new Set());

    if (!destination) {
      // If drag was cancelled and we have a copying item (clone), remove it
      if (copyingItem) {
        console.log('Drag cancelled, removing clone:', copyingItem.id);
        setCalendarItems(prev => prev.filter(item => item.id !== copyingItem.id));
      }
      setCopyingItem(null);
      return;
    }

    // Handle dragging from tools panel to calendar
    if (source.droppableId === 'tools-items' && destination.droppableId.includes('-')) {
      const [dateStr, slotStr] = destination.droppableId.split('-');
      const targetDate = new Date(dateStr);
      const targetSlot = parseInt(slotStr);
      
      // Convert slot to actual time (each slot is 5 minutes)
      const hours = Math.floor(targetSlot / 12);
      const minutes = (targetSlot % 12) * 5;
      targetDate.setHours(hours, minutes, 0, 0);
      
      // Determine type from draggableId
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
      onDragUpdate={handleDragUpdate}
      onDragEnd={handleDragEnd}
    >
      <div className={styles.container}>
        {/* CTRL indicator with better debug info */}
        {keyboardRef.current.ctrlKey && (
          <div className={styles.ctrlIndicator}>
            CTRL: Clone Mode Active
          </div>
        )}
        
        {/* Enhanced debug panel */}
        {process.env.NODE_ENV === 'development' && (
          <div style={{
            position: 'fixed',
            top: '120px',
            right: '20px',
            backgroundColor: '#000',
            color: '#fff',
            padding: '8px',
            borderRadius: '4px',
            fontSize: '11px',
            maxWidth: '200px',
            zIndex: 999
          }}>
            <div>CTRL Debug:</div>
            <div>State: {keyboardRef.current.ctrlKey ? 'PRESSED' : 'released'}</div>
            <div>Items: {calendarItems.length}</div>
            <div>Copying: {copyingItem?.id || 'none'}</div>
          </div>
        )}

        <div className={styles.mainContent} data-calendar-grid>
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
            isCtrlPressed={keyboardRef.current.ctrlKey}
            timeRangeSelection={timeRangeSelection}
            dragCollisions={dragCollisions}
          />
        </div>
        <ToolsPanel onAddItem={handleAddItem} />
      </div>
    </DragDropContext>
  );
};

export default CalendarPage;
