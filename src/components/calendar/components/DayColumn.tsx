
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
            snapshot.isDraggedOver ? 'bg-primary/5' : ''
          }`}
        >
          {/* Time grid background */}
          {hours.map((hour) => (
            <div
              key={hour}
              className="relative border-b border-border"
              style={{ height: '84px' }}
            >
              <div 
                className="absolute top-1/2 left-0 right-0 border-t border-border/30"
              />
            </div>
          ))}

          {/* Calendar items */}
          {items.map((item, index) => {
            const position = calculateItemPosition(item);
            const column = overlapColumns.get(item.id) || { column: 0, totalColumns: 1 };
            
            return (
              <CalendarItemComponent
                key={item.id}
                item={item}
                index={index}
                position={position}
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
