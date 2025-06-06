
import React from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { CalendarItem } from '../types';

interface CalendarItemProps {
  item: CalendarItem;
  index: number;
  isAllDay: boolean;
  position?: {
    top: number;
    height: number;
  };
  column?: {
    column: number;
    totalColumns: number;
  };
}

export const CalendarItemComponent: React.FC<CalendarItemProps> = ({ 
  item, 
  index, 
  isAllDay, 
  position,
  column 
}) => {
  const getItemColor = (type: string) => {
    switch (type) {
      case 'event': return 'bg-blue-500';
      case 'task': return 'bg-green-500';
      case 'milestone': return 'bg-purple-500';
      case 'highlight': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getItemStyle = () => {
    if (isAllDay) {
      return {
        margin: '2px',
        padding: '4px 8px',
      };
    }

    if (!position || !column) return {};

    const width = `calc(${100 / column.totalColumns}% - 4px)`;
    const left = `calc(${(column.column * 100) / column.totalColumns}% + 2px)`;

    return {
      position: 'absolute' as const,
      top: `${position.top + 2}px`,
      height: `${position.height - 4}px`,
      width,
      left,
      margin: 0,
      padding: '4px 8px',
    };
  };

  return (
    <Draggable draggableId={item.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`
            ${getItemColor(item.type)} 
            text-white text-sm rounded 
            shadow-sm cursor-pointer
            ${snapshot.isDragging ? 'shadow-lg z-50' : 'z-10'}
          `}
          style={{
            ...getItemStyle(),
            ...provided.draggableProps.style,
          }}
        >
          <div className="font-medium truncate">{item.title}</div>
          {item.location && (
            <div className="text-xs opacity-90 truncate">{item.location}</div>
          )}
        </div>
      )}
    </Draggable>
  );
};
