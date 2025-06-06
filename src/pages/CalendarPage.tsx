
import { useState, useEffect } from 'react';
import {
  makeStyles,
  tokens,
} from '@fluentui/react-components';
import CleanCalendarGrid from '../components/calendar/CleanCalendarGrid';
import CleanToolsPanel from '../components/calendar/CleanToolsPanel';
import { CalendarItem } from '../components/calendar/types';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    height: '100vh',
    paddingTop: '60px',
    backgroundColor: tokens.colorNeutralBackground1,
  },
  mainContent: {
    flex: 1,
    overflow: 'hidden',
    minWidth: 0,
  },
});

const CalendarPage = () => {
  const styles = useStyles();
  const [calendarItems, setCalendarItems] = useState<CalendarItem[]>([]);
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [selectedItemIds, setSelectedItemIds] = useState<Set<string>>(new Set());

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
    console.log('Adding item to calendar:', item);
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
        if (newSet.has(itemId)) {
          newSet.delete(itemId);
        } else {
          newSet.add(itemId);
        }
      } else {
        if (newSet.has(itemId) && newSet.size === 1) {
          newSet.clear();
        } else {
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
        <CleanCalendarGrid
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
      <CleanToolsPanel onAddItem={handleAddItem} />
    </div>
  );
};

export default CalendarPage;
