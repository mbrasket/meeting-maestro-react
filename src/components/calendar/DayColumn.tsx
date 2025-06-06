
import React from 'react';
import { Droppable } from '@hello-pangea/dnd';
import { CalendarItem, HOUR_HEIGHT, TOTAL_DAY_HEIGHT } from './types';
import AllDayWell from './AllDayWell';
import CalendarItemComponent from './CalendarItem';
import { resolveOverlaps } from './utils/itemPositioning';

interface DayColumnProps {
  dayIndex: number;
  items: CalendarItem[];
}

const DayColumn: React.FC<DayColumnProps> = ({ dayIndex, items }) => {
  const allDayItems = items.filter(item => item.isAllDay);
  const timeItems = items.filter(item => !item.isAllDay);
  const positions = resolveOverlaps(timeItems);

  // Generate hour gridlines
  const hours = Array.from({ length: 24 }, (_, i) => i);

  return (
    <div className="flex-1 border-r border-border last:border-r-0">
      {/* All day well */}
      <AllDayWell dayIndex={dayIndex} items={allDayItems} />
      
      {/* Time area */}
      <div className="relative">
        <Droppable droppableId={`day-${dayIndex}`}>
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className={`relative ${snapshot.isDraggingOver ? 'bg-accent/10' : ''}`}
              style={{ height: `${TOTAL_DAY_HEIGHT}px` }}
            >
              {/* Hour gridlines */}
              {hours.map(hour => (
                <div key={hour}>
                  {/* Hour line */}
                  <div
                    className="absolute w-full border-t border-border"
                    style={{ top: `${hour * HOUR_HEIGHT}px` }}
                  />
                  {/* Half-hour line */}
                  <div
                    className="absolute w-full border-t border-border/30"
                    style={{ top: `${hour * HOUR_HEIGHT + HOUR_HEIGHT / 2}px` }}
                  />
                </div>
              ))}
              
              {/* Calendar items */}
              {timeItems.map((item, index) => {
                const position = positions.get(item.id);
                return (
                  <CalendarItemComponent
                    key={item.id}
                    item={item}
                    index={index}
                    position={position}
                  />
                );
              })}
              
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </div>
    </div>
  );
};

export default DayColumn;
