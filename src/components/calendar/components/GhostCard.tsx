
import { makeStyles, tokens, Text, Checkbox } from '@fluentui/react-components';
import { DroppableStateSnapshot } from '@hello-pangea/dnd';
import { Flag } from 'lucide-react';
import { CalendarItem } from '../types';

const useStyles = makeStyles({
  ghostCard: {
    position: 'absolute',
    left: '2px',
    right: '2px',
    top: '1px',
    height: '26px',
    borderRadius: '4px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    fontSize: '12px',
    zIndex: '50', // Much higher z-index to appear above everything
    opacity: '0.8',
    padding: '2px 6px',
    border: `3px dashed ${tokens.colorBrandStroke1}`, // Thicker, more visible border
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)', // Add shadow for visibility
  },
  // Item type styles matching CalendarItemComponent
  event: {
    backgroundColor: tokens.colorBrandBackground,
    color: tokens.colorNeutralForegroundOnBrand,
    borderColor: tokens.colorBrandStroke1,
  },
  task: {
    backgroundColor: tokens.colorPaletteGreenBackground1,
    borderColor: tokens.colorPaletteGreenBorder1,
    color: tokens.colorNeutralForeground1,
  },
  highlight: {
    backgroundColor: tokens.colorPaletteYellowBackground1,
    borderColor: tokens.colorPaletteYellowBorder1,
    color: tokens.colorNeutralForeground1,
  },
  milestone: {
    backgroundColor: tokens.colorPaletteRedBackground2,
    borderColor: tokens.colorPaletteRedBorder1,
    color: tokens.colorNeutralForeground1,
    height: '16px', // Shorter for milestone
  },
  taskContent: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    width: '100%',
  },
  milestoneContent: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    width: '100%',
  },
});

interface GhostCardProps {
  snapshot: DroppableStateSnapshot;
  allItems?: CalendarItem[];
}

export const GhostCard = ({ snapshot, allItems = [] }: GhostCardProps) => {
  const styles = useStyles();

  // Debug logging
  console.log('GhostCard render:', {
    isDraggingOver: snapshot.isDraggingOver,
    draggingFromThisWith: snapshot.draggingFromThisWith
  });

  if (!snapshot.isDraggingOver || !snapshot.draggingFromThisWith) {
    return null;
  }

  const draggableId = snapshot.draggingFromThisWith;
  
  // Determine item type and content from draggableId
  const getItemPreview = () => {
    if (draggableId.startsWith('tool-')) {
      // Handle tool items from the panel
      if (draggableId.includes('milestone')) {
        return {
          type: 'milestone',
          title: 'New Milestone',
          styleClass: styles.milestone,
        };
      } else if (draggableId.includes('event')) {
        return {
          type: 'event',
          title: 'New Event',
          styleClass: styles.event,
        };
      } else if (draggableId.includes('task')) {
        return {
          type: 'task',
          title: 'New Task',
          styleClass: styles.task,
        };
      } else if (draggableId.includes('highlight')) {
        return {
          type: 'highlight',
          title: 'New Time Block',
          styleClass: styles.highlight,
        };
      }
    } else {
      // Handle existing calendar items being moved
      const existingItem = allItems.find(item => item.id === draggableId);
      if (existingItem) {
        const styleClass = (() => {
          switch (existingItem.type) {
            case 'event':
              return styles.event;
            case 'task':
              return styles.task;
            case 'highlight':
              return styles.highlight;
            case 'milestone':
              return styles.milestone;
            default:
              return styles.event;
          }
        })();
        
        return {
          type: existingItem.type,
          title: existingItem.title,
          styleClass,
          completed: existingItem.completed,
        };
      }
    }
    
    // Default fallback
    return {
      type: 'event',
      title: 'Moving item...',
      styleClass: styles.event,
    };
  };

  const itemPreview = getItemPreview();

  const renderContent = () => {
    switch (itemPreview.type) {
      case 'task':
        return (
          <div className={styles.taskContent}>
            <Checkbox checked={itemPreview.completed || false} disabled />
            <Text size={200} weight="medium">
              {itemPreview.title}
            </Text>
          </div>
        );
      case 'milestone':
        return (
          <div className={styles.milestoneContent}>
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
      className={`${styles.ghostCard} ${itemPreview.styleClass}`}
      style={{ borderColor: 'inherit' }}
    >
      {renderContent()}
    </div>
  );
};
