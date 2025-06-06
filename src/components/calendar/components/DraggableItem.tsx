
import React from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { CalendarItemTemplate } from '../types';

interface DraggableItemProps {
  template: CalendarItemTemplate;
  index: number;
}

export const DraggableItem: React.FC<DraggableItemProps> = ({ template, index }) => {
  return (
    <Draggable draggableId={`toolbar-${template.type}-${index}`} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`
            p-3 rounded-lg cursor-grab active:cursor-grabbing
            ${template.color} text-white
            ${snapshot.isDragging ? 'shadow-lg opacity-80' : 'shadow-sm'}
            hover:shadow-md transition-shadow
          `}
        >
          <div className="font-medium text-sm">{template.title}</div>
          <div className="text-xs opacity-90">
            {template.duration > 0 ? `${template.duration} min` : 'Instant'}
          </div>
        </div>
      )}
    </Draggable>
  );
};
