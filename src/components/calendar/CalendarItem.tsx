
import React from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { CalendarItem as CalendarItemType } from './types';

interface CalendarItemProps {
  item: CalendarItemType;
  index: number;
  isAllDay?: boolean;
  position?: { top: number; height: number; column: number; totalColumns: number };
}

const CalendarItem: React.FC<CalendarItemProps> = ({ 
  item, 
  index, 
  isAllDay = false, 
  position 
}) => {
  const getItemColor = (type: string) => {
    switch (type) {
      case 'event': return 'bg-blue-500';
      case 'task': return 'bg-green-500';
      case 'reminder': return 'bg-yellow-500';
      case 'milestone': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  const getItemStyle = () => {
    if (isAllDay) {
      return {
        minWidth: '120px',
        maxWidth: '200px'
      };
    }

    if (position) {
      const width = position.totalColumns > 1 
        ? `${Math.floor(100 / position.totalColumns) - 1}%`
        : '98%';
      
      const left = position.totalColumns > 1 
        ? `${(position.column * 100) / position.totalColumns}%`
        : '1%';

      return {
        position: 'absolute' as const,
        top: `${position.top + 2}px`,
        height: `${Math.max(position.height - 4, 20)}px`,
        width,
        left,
        zIndex: 10
      };
    }

    return {};
  };

  return (
    <Draggable draggableId={item.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`
            ${getItemColor(item.type)} text-white text-xs p-1 rounded shadow-sm
            ${snapshot.isDragging ? 'opacity-80 shadow-lg' : ''}
            ${isAllDay ? 'inline-block' : 'cursor-move'}
            hover:shadow-md transition-shadow
          `}
          style={{
            ...getItemStyle(),
            ...provided.draggableProps.style
          }}
        >
          <div className="font-medium truncate">{item.title}</div>
          {!isAllDay && item.startTime && (
            <div className="text-xs opacity-90">
              {item.startTime}{item.endTime && ` - ${item.endTime}`}
            </div>
          )}
        </div>
      )}
    </Draggable>
  );
};

export default CalendarItem;
