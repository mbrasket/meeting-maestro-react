
import React, { useState, useEffect, useRef } from 'react';
import { DragDropContext, DropResult } from '@hello-pangea/dnd';
import WeekHeader from './WeekHeader';
import TimeColumn from './TimeColumn';
import DayColumn from './DayColumn';
import Toolbar from './Toolbar';
import { CalendarItem, HOUR_HEIGHT } from './types';
import { getWeekDates, pixelsToTime } from './utils/timeCalculations';

const CalendarGrid: React.FC = () => {
  const [currentWeek] = useState(new Date());
  const [calendarItems, setCalendarItems] = useState<CalendarItem[]>([]);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Pre-scroll to 8:30 AM on mount
  useEffect(() => {
    if (scrollContainerRef.current) {
      const scrollTop = 8.5 * HOUR_HEIGHT; // 8:30 AM = 714px
      scrollContainerRef.current.scrollTop = scrollTop;
    }
  }, []);

  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;
    
    if (!destination) return;

    // Handle drag from toolbar
    if (source.droppableId === 'toolbar' || draggableId.startsWith('toolbar-')) {
      const itemType = draggableId.includes('event') ? 'event' :
                      draggableId.includes('task') ? 'task' :
                      draggableId.includes('reminder') ? 'reminder' : 'milestone';
      
      const newItem = createNewItem(destination, itemType);
      setCalendarItems(prev => [...prev, newItem]);
      return;
    }

    // Handle moving existing items
    const itemId = draggableId;
    setCalendarItems(prev => 
      prev.map(item => 
        item.id === itemId 
          ? updateItemPosition(item, destination)
          : item
      )
    );
  };

  const createNewItem = (destination: any, type: CalendarItem['type']): CalendarItem => {
    const weekDates = getWeekDates(currentWeek);
    const dayIndex = parseInt(destination.droppableId.replace('day-', '').replace('all-day-', ''));
    const date = weekDates[dayIndex].toISOString().split('T')[0];
    
    const isAllDay = destination.droppableId.includes('all-day');
    const startTime = isAllDay ? '00:00' : '09:00'; // Default to 9 AM for timed items
    
    return {
      id: `${type}-${Date.now()}`,
      title: `New ${type.charAt(0).toUpperCase() + type.slice(1)}`,
      type,
      startTime,
      endTime: type === 'event' ? '10:00' : undefined,
      date,
      isAllDay
    };
  };

  const updateItemPosition = (item: CalendarItem, destination: any): CalendarItem => {
    const weekDates = getWeekDates(currentWeek);
    const dayIndex = parseInt(destination.droppableId.replace('day-', '').replace('all-day-', ''));
    const date = weekDates[dayIndex].toISOString().split('T')[0];
    const isAllDay = destination.droppableId.includes('all-day');
    
    return {
      ...item,
      date,
      isAllDay
    };
  };

  const weekDates = getWeekDates(currentWeek);
  
  // Group items by day
  const itemsByDay = weekDates.map((date, index) => {
    const dateStr = date.toISOString().split('T')[0];
    return calendarItems.filter(item => item.date === dateStr);
  });

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="h-full flex flex-col bg-background">
        <Toolbar />
        
        <WeekHeader currentWeek={currentWeek} />
        
        <div 
          ref={scrollContainerRef}
          className="flex-1 flex overflow-auto"
        >
          <TimeColumn />
          
          <div className="flex-1 flex">
            {itemsByDay.map((dayItems, dayIndex) => (
              <DayColumn
                key={dayIndex}
                dayIndex={dayIndex}
                items={dayItems}
              />
            ))}
          </div>
        </div>
      </div>
    </DragDropContext>
  );
};

export default CalendarGrid;
