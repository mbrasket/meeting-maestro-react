
import React from 'react';
import { Droppable } from '@hello-pangea/dnd';
import { DraggableItem } from './DraggableItem';
import { CalendarItemTemplate } from '../types';

const toolbarItems: CalendarItemTemplate[] = [
  {
    type: 'event',
    title: 'Meeting',
    duration: 60,
    color: 'bg-blue-500',
  },
  {
    type: 'task',
    title: 'Task',
    duration: 30,
    color: 'bg-green-500',
  },
  {
    type: 'milestone',
    title: 'Milestone',
    duration: 0,
    color: 'bg-purple-500',
  },
  {
    type: 'highlight',
    title: 'Highlight',
    duration: 15,
    color: 'bg-yellow-500',
  },
];

export const Toolbar: React.FC = () => {
  return (
    <div className="w-48 border-r border-border bg-muted/30 p-4">
      <h3 className="text-sm font-medium mb-4">Calendar Items</h3>
      <Droppable droppableId="toolbar" isDropDisabled={true}>
        {(provided) => (
          <div 
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="space-y-2"
          >
            {toolbarItems.map((template, index) => (
              <DraggableItem
                key={`${template.type}-${index}`}
                template={template}
                index={index}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};
