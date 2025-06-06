
import { useState } from 'react';
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
  };

  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    // Handle dragging from tools panel to calendar
    if (source.droppableId.startsWith('tools-') && destination.droppableId.includes('-')) {
      const [dateStr, slotStr] = destination.droppableId.split('-');
      const targetDate = new Date(dateStr);
      const targetSlot = parseInt(slotStr);
      
      // Convert slot to actual time (each slot is 5 minutes)
      const hours = Math.floor(targetSlot / 12);
      const minutes = (targetSlot % 12) * 5;
      targetDate.setHours(hours, minutes, 0, 0);
      
      // Create new item from tool template
      const newItem: CalendarItem = {
        id: Date.now().toString(),
        type: draggableId.includes('event') ? 'event' : 
              draggableId.includes('task') ? 'task' :
              draggableId.includes('highlight') ? 'highlight' : 'milestone',
        title: 'New Item',
        startTime: snapToGrid(targetDate),
        endTime: snapToGrid(new Date(targetDate.getTime() + 30 * 60 * 1000)),
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
        
        handleUpdateItem(item.id, {
          startTime: newStartTime,
          endTime: newEndTime,
        });
      }
    }
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className={styles.container}>
        <div className={styles.mainContent}>
          <CalendarGrid
            items={calendarItems}
            currentWeek={currentWeek}
            onUpdateItem={handleUpdateItem}
            onDeleteItem={handleDeleteItem}
            onWeekChange={setCurrentWeek}
          />
        </div>
        <ToolsPanel onAddItem={handleAddItem} />
      </div>
    </DragDropContext>
  );
};

export default CalendarPage;
