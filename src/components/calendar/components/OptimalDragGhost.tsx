
import { memo, useEffect, useState } from 'react';
import { Text, Checkbox } from '@fluentui/react-components';
import { Flag } from 'lucide-react';
import { CalendarItem } from '../types';
import { DragState } from '../types/dragTypes';

const ghostStyles: React.CSSProperties = {
  position: 'fixed',
  pointerEvents: 'none',
  zIndex: 1000,
  opacity: 0.8,
  transform: 'translate(-50%, -50%)',
  borderRadius: '4px',
  padding: '4px 8px',
  minHeight: '28px',
  minWidth: '120px',
  display: 'flex',
  alignItems: 'center',
  border: '2px dashed #0078d4',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
  backgroundColor: 'white',
};

const itemStyles = {
  event: {
    backgroundColor: '#0078d4',
    color: '#ffffff',
  },
  task: {
    backgroundColor: '#107c10',
    color: '#000000',
  },
  highlight: {
    backgroundColor: '#fff100',
    color: '#000000',
  },
  milestone: {
    backgroundColor: '#d13438',
    color: '#000000',
  },
};

interface OptimalDragGhostProps {
  dragState: DragState;
  allItems: CalendarItem[];
}

export const OptimalDragGhost = memo(({ dragState, allItems }: OptimalDragGhostProps) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    if (dragState.isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, [dragState.isDragging]);

  if (!dragState.isDragging) {
    return null;
  }

  const getItemPreview = () => {
    if (dragState.sourceType === 'tools') {
      const type = dragState.draggedItemType || 'event';
      return {
        type,
        title: `New ${type.charAt(0).toUpperCase() + type.slice(1)}`,
        style: itemStyles[type as keyof typeof itemStyles] || itemStyles.event,
      };
    }
    
    const existingItem = allItems.find(item => item.id === dragState.draggedItemId);
    if (existingItem) {
      const style = itemStyles[existingItem.type as keyof typeof itemStyles] || itemStyles.event;
      return {
        type: existingItem.type,
        title: existingItem.title,
        style,
        completed: existingItem.completed,
      };
    }
    
    return {
      type: 'event',
      title: 'Moving item...',
      style: itemStyles.event,
    };
  };

  const itemPreview = getItemPreview();

  const renderContent = () => {
    switch (itemPreview.type) {
      case 'task':
        return (
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Checkbox checked={itemPreview.completed || false} disabled />
            <Text size={200} weight="medium">
              {itemPreview.title}
            </Text>
          </div>
        );
      case 'milestone':
        return (
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Flag size={12} />
            <Text size={200} weight="medium">
              {itemPreview.title}
            </Text>
          </div>
        );
      default:
        return (
          <Text size={200} weight="medium">
            {itemPreview.title}
          </Text>
        );
    }
  };

  return (
    <div
      style={{
        ...ghostStyles,
        ...itemPreview.style,
        left: mousePosition.x,
        top: mousePosition.y,
        borderColor: dragState.isValidDrop ? '#107c10' : '#d13438',
      }}
    >
      {renderContent()}
    </div>
  );
});

OptimalDragGhost.displayName = 'OptimalDragGhost';
