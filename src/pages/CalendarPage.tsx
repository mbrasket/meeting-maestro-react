import { useState, useEffect } from 'react';
import {
  makeStyles,
  tokens,
} from '@fluentui/react-components';
import CalendarGrid from '../components/calendar/CalendarGrid';
import ToolsPanel from '../components/calendar/ToolsPanel';
import { CalendarItem } from '../components/calendar/types';
import { useKeyboardRef } from '../hooks/useKeyboardRef';
import { useTimeRangeSelection } from '../hooks/useTimeRangeSelection';
import { useDragAndDrop } from '../hooks/useDragAndDrop';
import { DragDropProvider } from '../contexts/DragDropContext';
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
  };

  const { handleDragStart, handleDragEnd } = useDragAndDrop({
    items: calendarItems,
    onUpdateItem: handleUpdateItem,
    onAddItem: handleAddItem,
    onDeleteItem: handleDeleteItem,
    setCalendarItems,
  });

  return (
    <DragDropProvider
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className={styles.container}>
        {/* CTRL indicator */}
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
    </DragDropProvider>
  );
};

export default CalendarPage;
