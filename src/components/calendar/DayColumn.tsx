
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
        <Droppable 
          droppableId={`day-${dayIndex}`}
          type="CALENDAR_ITEM"
        >
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

              {/* 5-minute time slots for visual feedback and precise dropping */}
              {Array.from({ length: 24 * 12 }, (_, slotIndex) => {
                const totalMinutes = slotIndex * 5;
                const hours = Math.floor(totalMinutes / 60);
                const minutes = totalMinutes % 60;
                const timeLabel = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
                const top = (totalMinutes / 60) * HOUR_HEIGHT;
                
                return (
                  <div
                    key={slotIndex}
                    className={`absolute w-full transition-colors ${
                      snapshot.isDraggingOver 
                        ? 'hover:bg-primary/20 border-b border-primary/30' 
                        : ''
                    }`}
                    style={{ 
                      top: `${top}px`,
                      height: `${HOUR_HEIGHT / 12}px` // 5-minute slot height (7px)
                    }}
                    data-time={timeLabel}
                    data-slot-index={slotIndex}
                  />
                );
              })}
              
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
