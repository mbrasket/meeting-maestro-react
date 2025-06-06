
import React from 'react';
import { Droppable } from '@hello-pangea/dnd';
import { CalendarItem } from '../types';
import { CalendarItemComponent } from './CalendarItem';
import { calculateItemPosition, calculateOverlapColumns } from '../utils/itemPositioning';

interface DayColumnProps {
  day: Date;
  dayIndex: number;
  items: CalendarItem[];
}

export const DayColumn: React.FC<DayColumnProps> = ({ day, dayIndex, items }) => {
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const overlapColumns = calculateOverlapColumns(items);

  return (
    <Droppable droppableId={`day-${dayIndex}`}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          className={`relative border-r border-border last:border-r-0 ${
            snapshot.isDraggingOver ? 'bg-primary/5' : ''
          }`}
          style={{ minHeight: '2016px' }} // 24 hours * 84px
        >
          {/* Time grid background with hour and half-hour lines */}
          {hours.map((hour) => (
            <div
              key={hour}
              className="relative"
              style={{ height: '84px' }}
            >
              {/* Hour line (darker) */}
              <div 
                className="absolute top-0 left-0 right-0 border-t border-border"
              />
              {/* Half-hour line (lighter) */}
              <div 
                className="absolute left-0 right-0 border-t border-border/30"
                style={{ top: '42px' }}
              />
              {/* Quarter hour lines (very light) for 5-minute precision guides */}
              {Array.from({ length: 12 }, (_, i) => (
                <div
                  key={i}
                  className="absolute left-0 right-0 border-t border-border/10"
                  style={{ top: `${i * 7}px` }}
                />
              ))}
            </div>
          ))}

          {/* Calendar items with 2px padding */}
          {items.map((item, index) => {
            const position = calculateItemPosition(item);
            const column = overlapColumns.get(item.id) || { column: 0, totalColumns: 1 };
            
            return (
              <CalendarItemComponent
                key={item.id}
                item={item}
                index={index}
                position={{
                  top: position.top + 2,
                  height: Math.max(14, position.height - 4) // Minimum height with padding
                }}
                column={column}
                isAllDay={false}
              />
            );
          })}
          
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
};
