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
    borderRadius: tokens.borderRadiusSmall,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    fontSize: tokens.fontSizeBase200,
    zIndex: 100,
    opacity: '0.9',
    paddingTop: '2px',
    paddingBottom: '2px',
    paddingLeft: '6px',
    paddingRight: '6px',
    borderWidth: tokens.strokeWidthThick,
    borderStyle: 'dashed',
    borderColor: tokens.colorBrandStroke1,
    boxShadow: tokens.shadow16,
  },
  event: {
    backgroundColor: tokens.colorBrandBackground,
    color: tokens.colorNeutralForegroundOnBrand,
  },
  task: {
    backgroundColor: tokens.colorPaletteGreenBackground1,
    color: tokens.colorNeutralForeground1,
  },
  highlight: {
    backgroundColor: tokens.colorPaletteYellowBackground1,
    color: tokens.colorNeutralForeground1,
  },
  milestone: {
    backgroundColor: tokens.colorPaletteRedBackground2,
    color: tokens.colorNeutralForeground1,
  },
  milestoneCard: {
    height: '16px',
  },
  taskContent: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalXXS,
    width: '100%',
  },
  milestoneContent: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalXXS,
    width: '100%',
  },
});

interface GhostCardProps {
  snapshot: DroppableStateSnapshot;
  allItems?: CalendarItem[];
}

interface ItemPreview {
  type: string;
  title: string;
  styleClass: string;
  completed?: boolean;
}

export const GhostCard = ({ snapshot, allItems = [] }: GhostCardProps) => {
  const styles = useStyles();

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
          styleClass: styles.milestone,
        };
      }
      
      if (draggableId.includes('event')) {
        return {
          type: 'event',
          title: 'New Event',
          styleClass: styles.event,
        };
      }
      
      if (draggableId.includes('task')) {
        return {
          type: 'task',
          title: 'New Task',
          styleClass: styles.task,
        };
      }
      
      if (draggableId.includes('highlight')) {
        return {
          type: 'highlight',
          title: 'New Time Block',
          styleClass: styles.highlight,
        };
      }
    }
    
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

  // Apply milestone-specific height styling
  const cardClasses = itemPreview.type === 'milestone' 
    ? `${styles.ghostCard} ${styles.milestoneCard} ${itemPreview.styleClass}`
    : `${styles.ghostCard} ${itemPreview.styleClass}`;

  return (
    <div className={cardClasses}>
      {renderContent()}
    </div>
  );
};
