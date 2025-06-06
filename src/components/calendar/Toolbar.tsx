
import React from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { CalendarItem } from './types';

const Toolbar: React.FC = () => {
  const toolbarItems: Omit<CalendarItem, 'id' | 'date' | 'startTime'>[] = [
    { title: 'New Event', type: 'event' },
    { title: 'New Task', type: 'task' },
    { title: 'New Reminder', type: 'reminder' },
    { title: 'New Milestone', type: 'milestone' }
  ];

  const getItemColor = (type: string) => {
    switch (type) {
      case 'event': return 'bg-blue-500 hover:bg-blue-600';
      case 'task': return 'bg-green-500 hover:bg-green-600';
      case 'reminder': return 'bg-yellow-500 hover:bg-yellow-600';
      case 'milestone': return 'bg-purple-500 hover:bg-purple-600';
      default: return 'bg-gray-500 hover:bg-gray-600';
    }
  };

  return (
    <div className="p-4 border-b border-border bg-background">
      <h3 className="text-sm font-medium text-foreground mb-3">Drag items to calendar</h3>
      <div className="flex gap-2 flex-wrap">
        {toolbarItems.map((item, index) => (
          <Draggable
            key={`toolbar-${item.type}`}
            draggableId={`toolbar-${item.type}-${index}`}
            index={index}
          >
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                {...provided.draggableProps}
                {...provided.dragHandleProps}
                className={`
                  ${getItemColor(item.type)} text-white text-xs px-3 py-2 rounded
                  cursor-grab active:cursor-grabbing transition-colors
                  ${snapshot.isDragging ? 'opacity-80 shadow-lg' : ''}
                `}
                style={provided.draggableProps.style}
              >
                {item.title}
              </div>
            )}
          </Draggable>
        ))}
      </div>
    </div>
  );
};

export default Toolbar;
