
import { Text, Checkbox } from '@fluentui/react-components';
import { DroppableStateSnapshot } from '@hello-pangea/dnd';
import { Flag } from 'lucide-react';
import { CalendarItem } from '../types';

// Simple CSS classes to avoid TypeScript issues with makeStyles
const ghostCardStyles = {
  position: 'absolute' as const,
  left: '2px',
  right: '2px',
  top: '1px',
  height: '26px',
  borderRadius: '4px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-start',
  fontSize: '12px',
  zIndex: 100,
  opacity: 0.9,
  padding: '2px 6px',
  border: '2px dashed #0078d4',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
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

const contentStyles = {
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
  width: '100%',
};

interface GhostCardProps {
  snapshot: DroppableStateSnapshot;
  allItems?: CalendarItem[];
}

interface ItemPreview {
  type: string;
  title: string;
  style: React.CSSProperties;
  completed?: boolean;
}

export const GhostCard = ({ snapshot, allItems = [] }: GhostCardProps) => {
  console.log('GhostCard render:', {
    isDraggingOver: snapshot.isDraggingOver,
    draggingFromThisWith: snapshot.draggingFromThisWith
  });

  if (!snapshot.isDraggingOver || !snapshot.draggingFromThisWith) {
    return null;
  }

  const draggableId = snapshot.draggingFromThisWith;
  
  const getItemPreview = (): ItemPreview => {
    // Handle tool items from the panel
    if (draggableId.startsWith('tool-')) {
      if (draggableId.includes('milestone')) {
        return {
          type: 'milestone',
          title: 'New Milestone',
          style: itemStyles.milestone,
        };
      }
      
      if (draggableId.includes('event')) {
        return {
          type: 'event',
          title: 'New Event',
          style: itemStyles.event,
        };
      }
      
      if (draggableId.includes('task')) {
        return {
          type: 'task',
          title: 'New Task',
          style: itemStyles.task,
        };
      }
      
      if (draggableId.includes('highlight')) {
        return {
          type: 'highlight',
          title: 'New Time Block',
          style: itemStyles.highlight,
        };
      }
    }
    
    // Handle existing calendar items being moved
    const existingItem = allItems.find(item => item.id === draggableId);
    if (existingItem) {
      const style = (() => {
        switch (existingItem.type) {
          case 'event':
            return itemStyles.event;
          case 'task':
            return itemStyles.task;
          case 'highlight':
            return itemStyles.highlight;
          case 'milestone':
            return itemStyles.milestone;
          default:
            return itemStyles.event;
        }
      })();
      
      return {
        type: existingItem.type,
        title: existingItem.title,
        style,
        completed: existingItem.completed,
      };
    }
    
    // Default fallback
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
          <div style={contentStyles}>
            <Checkbox checked={itemPreview.completed || false} disabled />
            <Text size={200} weight="medium">
              {itemPreview.title}
            </Text>
          </div>
        );
      case 'milestone':
        return (
          <div style={contentStyles}>
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

  // Apply milestone-specific height styling
  const cardStyle = itemPreview.type === 'milestone' 
    ? { ...ghostCardStyles, ...itemPreview.style, height: '16px' }
    : { ...ghostCardStyles, ...itemPreview.style };

  return (
    <div style={cardStyle}>
      {renderContent()}
    </div>
  );
};
