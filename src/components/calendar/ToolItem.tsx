
import { Draggable } from '@hello-pangea/dnd';
import {
  makeStyles,
  tokens,
  Text,
  Checkbox,
} from '@fluentui/react-components';
import { Flag } from 'lucide-react';
import { CalendarItemTemplate } from './types';

const useStyles = makeStyles({
  toolItem: {
    position: 'relative',
    height: '60px', // Taller to look like calendar items
    cursor: 'grab',
    borderRadius: '4px',
    border: `1px solid ${tokens.colorNeutralStroke1}`,
    display: 'flex',
    alignItems: 'center',
    padding: '8px',
    userSelect: 'none',
    ':hover': {
      transform: 'translateY(-1px)',
      boxShadow: tokens.shadow4,
    },
  },
  // Calendar item styles matching CalendarItemComponent
  event: {
    backgroundColor: tokens.colorBrandBackground,
    border: `1px solid ${tokens.colorBrandStroke1}`,
    color: tokens.colorNeutralForegroundOnBrand,
  },
  task: {
    backgroundColor: tokens.colorPaletteGreenBackground1,
    border: `1px solid ${tokens.colorPaletteGreenBorder1}`,
  },
  highlight: {
    backgroundColor: tokens.colorPaletteYellowBackground1,
    border: `1px solid ${tokens.colorPaletteYellowBorder1}`,
  },
  milestone: {
    backgroundColor: tokens.colorPaletteRedBackground2,
    border: `1px solid ${tokens.colorPaletteRedBorder1}`,
    height: '32px', // Shorter for milestone
  },
  taskContent: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    width: '100%',
  },
  milestoneContent: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    width: '100%',
  },
  dragging: {
    opacity: '0.5',
  },
  dragPreview: {
    position: 'fixed',
    left: '4px',
    right: '4px',
    padding: '4px 8px',
    borderRadius: '4px',
    cursor: 'move',
    userSelect: 'none',
    minHeight: '40px',
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalS,
    zIndex: 1000,
    pointerEvents: 'none',
    width: '200px',
  },
});

interface ToolItemProps {
  template: CalendarItemTemplate;
  index: number;
}

const ToolItem = ({ template, index }: ToolItemProps) => {
  const styles = useStyles();

  const getItemStyles = () => {
    switch (template.type) {
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
  };

  const getDragPreviewStyle = () => {
    return getItemStyles(); // Use same styles for drag preview
  };

  const renderContent = () => {
    switch (template.type) {
      case 'task':
        return (
          <div className={styles.taskContent}>
            <Checkbox checked={false} disabled />
            <Text size={300} weight="medium">
              {template.title}
            </Text>
          </div>
        );
      case 'milestone':
        return (
          <div className={styles.milestoneContent}>
            <Flag size={14} />
            <Text size={300} weight="medium">
              {template.title}
            </Text>
          </div>
        );
      default:
        return (
          <Text size={300} weight="medium">
            {template.title}
          </Text>
        );
    }
  };

  const draggableId = `tool-${template.type}`;

  return (
    <Draggable draggableId={draggableId} index={index}>
      {(provided, snapshot) => (
        <>
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            className={`${styles.toolItem} ${getItemStyles()} ${snapshot.isDragging ? styles.dragging : ''}`}
          >
            {renderContent()}
          </div>
          
          {/* Render drag preview */}
          {snapshot.isDragging && (
            <div 
              className={`${styles.dragPreview} ${getDragPreviewStyle()}`}
              style={{
                transform: provided.draggableProps.style?.transform,
              }}
            >
              {renderContent()}
            </div>
          )}
        </>
      )}
    </Draggable>
  );
};

export default ToolItem;
