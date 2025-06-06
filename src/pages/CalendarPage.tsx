
import { useState, useEffect } from 'react';
import {
  makeStyles,
  tokens,
} from '@fluentui/react-components';
import OptimizedCalendarGrid from '../components/calendar/OptimizedCalendarGrid';
import ToolsPanel from '../components/calendar/ToolsPanel';
import { CalendarItem } from '../components/calendar/types';

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
    return () => document.removeEventListener('keydown', handleKeyDown);
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

  return (
    <div className={styles.container}>
      <div className={styles.mainContent}>
        <OptimizedCalendarGrid
          items={calendarItems}
          currentWeek={currentWeek}
          onUpdateItem={handleUpdateItem}
          onDeleteItem={handleDeleteItem}
          onWeekChange={setCurrentWeek}
          selectedItemIds={selectedItemIds}
          onSelectItem={handleSelectItem}
          onClearSelection={handleClearSelection}
          onAddItem={handleAddItem}
        />
      </div>
      <ToolsPanel onAddItem={handleAddItem} />
    </div>
  );
};

export default CalendarPage;
