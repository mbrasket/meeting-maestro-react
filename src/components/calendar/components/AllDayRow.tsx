
import React from 'react';
import { Droppable } from '@hello-pangea/dnd';
import { CalendarItem } from '../types';
import { CalendarItemComponent } from './CalendarItem';

interface AllDayRowProps {
  weekDays: Date[];
  items: CalendarItem[];
}

export const AllDayRow: React.FC<AllDayRowProps> = ({ weekDays, items }) => {
  const allDayItems = items.filter(item => 
    item.startTime.getHours() === 0 && 
    item.startTime.getMinutes() === 0 &&
    item.endTime.getHours() === 23 &&
    item.endTime.getMinutes() === 59
  );

  return (
    <div className="flex border-b border-border bg-muted/20" style={{ minHeight: '60px' }}>
      <div className="w-16 border-r border-border flex items-center justify-center text-xs font-medium">
        All Day
      </div>
      {weekDays.map((day, dayIndex) => (
        <Droppable key={`allday-${dayIndex}`} droppableId={`allday-${dayIndex}`}>
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className={`flex-1 p-1 border-r border-border last:border-r-0 min-h-[60px] ${
                snapshot.isDraggingOver ? 'bg-primary/10' : ''
              }`}
            >
              {allDayItems
                .filter(item => new Date(item.startTime).toDateString() === day.toDateString())
                .map((item, index) => (
                  <CalendarItemComponent 
                    key={item.id} 
                    item={item} 
                    index={index}
                    isAllDay={true}
                  />
                ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      ))}
    </div>
  );
};
