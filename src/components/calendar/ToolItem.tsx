
import { Draggable } from '@hello-pangea/dnd';
import {
  makeStyles,
  tokens,
  Text,
  Card,
} from '@fluentui/react-components';
import { Flag, Clock, CheckSquare, Calendar } from 'lucide-react';
import { CalendarItemTemplate } from './types';

const useStyles = makeStyles({
  toolItem: {
    padding: tokens.spacingVerticalS,
    cursor: 'grab' as const,
    borderRadius: '4px' as const,
    border: `1px solid ${tokens.colorNeutralStroke1}`,
    display: 'flex' as const,
    alignItems: 'center' as const,
    gap: tokens.spacingHorizontalS,
    backgroundColor: tokens.colorNeutralBackground1,
    ':hover': {
      backgroundColor: tokens.colorNeutralBackground1Hover,
    },
  },
  dragging: {
    opacity: '0.5' as const,
  },
  icon: {
    color: tokens.colorNeutralForeground2,
  },
  content: {
    flex: '1' as const,
  },
  // Calendar item styles for drag preview
  dragPreview: {
    padding: '4px 8px',
    borderRadius: '4px',
    cursor: 'move',
    userSelect: 'none',
    minHeight: '40px',
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalS,
  },
  eventPreview: {
    backgroundColor: tokens.colorBrandBackground,
    border: `1px solid ${tokens.colorBrandStroke1}`,
    color: tokens.colorNeutralForegroundOnBrand,
  },
  taskPreview: {
    backgroundColor: tokens.colorPaletteGreenBackground1,
    border: `1px solid ${tokens.colorPaletteGreenBorder1}`,
  },
  highlightPreview: {
    backgroundColor: tokens.colorPaletteYellowBackground1,
    border: `1px solid ${tokens.colorPaletteYellowBorder1}`,
  },
  milestonePreview: {
    backgroundColor: tokens.colorPaletteRedBackground2,
    border: `1px solid ${tokens.colorPaletteRedBorder1}`,
    height: '20px',
  },
});

interface ToolItemProps {
  template: CalendarItemTemplate;
  index: number;
}

const ToolItem = ({ template, index }: ToolItemProps) => {
  const styles = useStyles();

  const getIcon = () => {
    switch (template.type) {
      case 'event':
        return <Calendar size={16} className={styles.icon} />;
      case 'task':
        return <CheckSquare size={16} className={styles.icon} />;
      case 'highlight':
        return <Clock size={16} className={styles.icon} />;
      case 'milestone':
        return <Flag size={16} className={styles.icon} />;
      default:
        return <Calendar size={16} className={styles.icon} />;
    }
  };

  const getDragPreviewStyle = () => {
    switch (template.type) {
      case 'event':
        return styles.eventPreview;
      case 'task':
        return styles.taskPreview;
      case 'highlight':
        return styles.highlightPreview;
      case 'milestone':
        return styles.milestonePreview;
      default:
        return styles.eventPreview;
    }
  };

  const draggableId = `tool-${template.type}-${template.title}-${index}`;

  return (
    <Draggable draggableId={draggableId} index={index}>
      {(provided, snapshot) => (
        <Card
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`${snapshot.isDragging ? `${styles.dragPreview} ${getDragPreviewStyle()}` : styles.toolItem} ${snapshot.isDragging ? styles.dragging : ''}`}
        >
          {getIcon()}
          <div className={styles.content}>
            <Text size={snapshot.isDragging ? 200 : 300} weight={snapshot.isDragging ? "medium" : undefined}>
              {template.title}
            </Text>
            {template.duration > 0 && !snapshot.isDragging && (
              <Text size={200} style={{ color: tokens.colorNeutralForeground2 }}>
                {template.duration}min
              </Text>
            )}
          </div>
        </Card>
      )}
    </Draggable>
  );
};

export default ToolItem;
