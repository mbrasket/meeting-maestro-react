
import React, { useState, useEffect, useRef } from 'react';
import { DragDropContext, DropResult } from '@hello-pangea/dnd';
import WeekHeader from './WeekHeader';
import TimeColumn from './TimeColumn';
import DayColumn from './DayColumn';
import Toolbar from './Toolbar';
import { CalendarItem, HOUR_HEIGHT } from './types';
import { getWeekDates, pixelsToTime, roundToNearestSlot } from './utils/timeCalculations';

const CalendarGrid: React.FC = () => {
  const [currentWeek] = useState(new Date());
  const [calendarItems, setCalendarItems] = useState<CalendarItem[]>([]);
  const [dragOverInfo, setDragOverInfo] = useState<{ dayIndex: number; time: string } | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const timeAreaRef = useRef<HTMLDivElement>(null);

  // Pre-scroll to 8:30 AM on mount
  useEffect(() => {
    if (scrollContainerRef.current) {
      const scrollTop = 8.5 * HOUR_HEIGHT; // 8:30 AM
      scrollContainerRef.current.scrollTop = scrollTop;
    }
  }, []);

  const calculateDropTime = (dropResult: DropResult, event?: any): string => {
    if (!timeAreaRef.current || !scrollContainerRef.current) return '09:00';
    
    // Get the mouse position relative to the time area
    const timeAreaRect = timeAreaRef.current.getBoundingClientRect();
    const scrollTop = scrollContainerRef.current.scrollTop;
    
    // Estimate drop position (this is a simplified approach)
    // In a real implementation, you'd want to capture mouse coordinates during drag
    const estimatedY = scrollTop + 200; // Fallback estimation
    
    const roundedPixels = roundToNearestSlot(estimatedY);
    return pixelsToTime(roundedPixels);
  };

  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;
    
    if (!destination) return;

    // Handle drag from toolbar
    if (source.droppableId === 'toolbar' || draggableId.startsWith('toolbar-')) {
      const itemType = draggableId.includes('event') ? 'event' :
                      draggableId.includes('task') ? 'task' :
                      draggableId.includes('reminder') ? 'reminder' : 'milestone';
      
      const newItem = createNewItem(destination, itemType, result);
      setCalendarItems(prev => [...prev, newItem]);
      return;
    }

    // Handle moving existing items
    const itemId = draggableId;
    setCalendarItems(prev => 
      prev.map(item => 
        item.id === itemId 
          ? updateItemPosition(item, destination, result)
          : item
      )
    );
  };

  const createNewItem = (destination: any, type: CalendarItem['type'], dropResult: DropResult): CalendarItem => {
    const weekDates = getWeekDates(currentWeek);
    const dayIndex = parseInt(destination.droppableId.replace('day-', '').replace('all-day-', ''));
    const date = weekDates[dayIndex].toISOString().split('T')[0];
    
    const isAllDay = destination.droppableId.includes('all-day');
    const startTime = isAllDay ? '00:00' : calculateDropTime(dropResult);
    
    // Calculate end time based on item type
    let endTime: string | undefined;
    if (type === 'event') {
      const [hours, minutes] = startTime.split(':').map(Number);
      const endHour = hours + 1; // Default 1-hour duration
      endTime = `${endHour.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    }
    
    return {
      id: `${type}-${Date.now()}`,
      title: `New ${type.charAt(0).toUpperCase() + type.slice(1)}`,
      type,
      startTime,
      endTime,
      date,
      isAllDay
    };
  };

  const updateItemPosition = (item: CalendarItem, destination: any, dropResult: DropResult): CalendarItem => {
    const weekDates = getWeekDates(currentWeek);
    const dayIndex = parseInt(destination.droppableId.replace('day-', '').replace('all-day-', ''));
    const date = weekDates[dayIndex].toISOString().split('T')[0];
    const isAllDay = destination.droppableId.includes('all-day');
    
    const newStartTime = isAllDay ? '00:00' : calculateDropTime(dropResult);
    
    // Maintain duration for events
    let newEndTime = item.endTime;
    if (item.endTime && !isAllDay) {
      const [startHours, startMinutes] = item.startTime.split(':').map(Number);
      const [endHours, endMinutes] = item.endTime.split(':').map(Number);
      const durationMinutes = (endHours * 60 + endMinutes) - (startHours * 60 + startMinutes);
      
      const [newStartHours, newStartMins] = newStartTime.split(':').map(Number);
      const newEndTotalMinutes = (newStartHours * 60 + newStartMins) + durationMinutes;
      const newEndHour = Math.floor(newEndTotalMinutes / 60);
      const newEndMin = newEndTotalMinutes % 60;
      
      newEndTime = `${newEndHour.toString().padStart(2, '0')}:${newEndMin.toString().padStart(2, '0')}`;
    }
    
    return {
      ...item,
      date,
      isAllDay,
      startTime: newStartTime,
      endTime: newEndTime
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
          
          <div 
            ref={timeAreaRef}
            className="flex-1 flex"
          >
            {itemsByDay.map((dayItems, dayIndex) => (
              <DayColumn
                key={dayIndex}
                dayIndex={dayIndex}
                items={dayItems}
              />
            ))}
          </div>
        </div>

        {/* Time slot indicator */}
        {dragOverInfo && (
          <div className="fixed bottom-4 right-4 bg-accent text-accent-foreground px-3 py-2 rounded shadow-lg z-50">
            Drop at {dragOverInfo.time}
          </div>
        )}
      </div>
    </DragDropContext>
  );
};

export default CalendarGrid;
