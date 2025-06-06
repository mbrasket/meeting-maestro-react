
import React, { useEffect, useRef } from 'react';
import { DragDropContext, DropResult } from '@hello-pangea/dnd';
import { WeekHeader } from './components/WeekHeader';
import { AllDayRow } from './components/AllDayRow';
import { TimeColumn } from './components/TimeColumn';
import { DayColumn } from './components/DayColumn';
import { Toolbar } from './components/Toolbar';
import { useDragDrop } from './hooks/useDragDrop';
import { getWeekDays } from './utils/timeUtils';

export const CalendarGrid: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { calendarItems, handleDragEnd, handleDragStart, handleDragUpdate } = useDragDrop();
  
  const weekDays = getWeekDays(new Date());

  // Auto-scroll to 8:30 AM (slot 102: 8*12 + 6)
  useEffect(() => {
    if (scrollRef.current) {
      const targetSlot = 102; // 8:30 AM
      const scrollTop = targetSlot * 7; // 7px per 5-minute slot (84px/12)
      scrollRef.current.scrollTop = scrollTop;
    }
  }, []);

  return (
    <div className="flex h-full bg-background">
      <DragDropContext 
        onDragEnd={handleDragEnd} 
        onDragStart={handleDragStart}
        onDragUpdate={handleDragUpdate}
      >
        <Toolbar />
        
        <div className="flex-1 flex flex-col">
          <WeekHeader weekDays={weekDays} />
          <AllDayRow weekDays={weekDays} items={calendarItems} />
          
          <div 
            ref={scrollRef}
            className="flex-1 flex overflow-y-auto"
            style={{ maxHeight: 'calc(100vh - 200px)' }}
          >
            <TimeColumn />
            <div className="flex-1 grid grid-cols-7 border-l border-border">
              {weekDays.map((day, index) => (
                <DayColumn
                  key={day.toISOString()}
                  day={day}
                  dayIndex={index}
                  items={calendarItems.filter(item => {
                    const itemDay = new Date(item.startTime).toDateString();
                    return itemDay === day.toDateString();
                  })}
                />
              ))}
            </div>
          </div>
        </div>
      </DragDropContext>
    </div>
  );
};
