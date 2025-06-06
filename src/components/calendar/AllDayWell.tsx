
import React from 'react';
import { Droppable } from '@hello-pangea/dnd';
import { CalendarItem } from './types';
import CalendarItemComponent from './CalendarItem';

interface AllDayWellProps {
  dayIndex: number;
  items: CalendarItem[];
}

const AllDayWell: React.FC<AllDayWellProps> = ({ dayIndex, items }) => {
  const droppableId = `all-day-${dayIndex}`;

  return (
    <Droppable droppableId={droppableId} direction="horizontal">
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          className={`min-h-[40px] p-1 border-b border-border bg-background/50 ${
            snapshot.isDraggingOver ? 'bg-accent/20' : ''
          }`}
        >
          <div className="flex gap-1 flex-wrap">
            {items.map((item, index) => (
              <CalendarItemComponent
                key={item.id}
                item={item}
                index={index}
                isAllDay={true}
              />
            ))}
          </div>
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
};

export default AllDayWell;
