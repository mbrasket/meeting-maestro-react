
import { useState } from 'react';
import { Draggable } from '@hello-pangea/dnd';
import {
  makeStyles,
  tokens,
  Text,
  Checkbox,
} from '@fluentui/react-components';
import { Flag } from 'lucide-react';
import { CalendarItem } from './types';

const useStyles = makeStyles({
  item: {
    position: 'absolute' as const,
    left: '4px' as const,
    right: '4px' as const,
    borderRadius: '4px' as const,
    padding: '4px 8px' as const,
    cursor: 'move' as const,
    userSelect: 'none' as const,
  },
  event: {
    backgroundColor: tokens.colorBrandBackground,
    borderColor: tokens.colorBrandStroke1,
    borderWidth: '1px' as const,
    borderStyle: 'solid' as const,
    color: tokens.colorNeutralForegroundOnBrand,
  },
  task: {
    backgroundColor: tokens.colorPaletteGreenBackground1,
    borderColor: tokens.colorPaletteGreenBorder1,
    borderWidth: '1px' as const,
    borderStyle: 'solid' as const,
  },
  highlight: {
    backgroundColor: tokens.colorPaletteYellowBackground1,
    opacity: '0.6' as const,
    borderColor: tokens.colorPaletteYellowBorder1,
    borderWidth: '1px' as const,
    borderStyle: 'solid' as const,
  },
  milestone: {
    height: '2px' as const,
    backgroundColor: tokens.colorPaletteRedBackground2,
    display: 'flex' as const,
    alignItems: 'center' as const,
    paddingLeft: '4px' as const,
  },
  resizeHandle: {
    position: 'absolute' as const,
    left: '0' as const,
    right: '0' as const,
    height: '4px' as const,
    cursor: 'ns-resize' as const,
    backgroundColor: 'transparent' as const,
    ':hover': {
      backgroundColor: tokens.colorNeutralStroke1,
    },
  },
  topHandle: {
    top: '-2px' as const,
  },
  bottomHandle: {
    bottom: '-2px' as const,
  },
  dragging: {
    opacity: '0.5' as const,
  },
  taskContent: {
    display: 'flex' as const,
    alignItems: 'center' as const,
    gap: '4px' as const,
  },
});

interface CalendarItemComponentProps {
  item: CalendarItem;
  index: number;
  onUpdate: (updates: Partial<CalendarItem>) => void;
  onDelete: () => void;
}

const CalendarItemComponent = ({ item, index, onUpdate, onDelete }: CalendarItemComponentProps) => {
  const styles = useStyles();
  const [isResizing, setIsResizing] = useState(false);

  const getItemStyles = () => {
    switch (item.type) {
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

  const handleTaskToggle = () => {
    onUpdate({ completed: !item.completed });
  };

  if (item.type === 'milestone') {
    return (
      <Draggable draggableId={item.id} index={index}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            className={`${styles.item} ${styles.milestone} ${snapshot.isDragging ? styles.dragging : ''}`}
          >
            <Flag size={12} />
            <Text size={200} style={{ marginLeft: '4px' }}>
              {item.title}
            </Text>
          </div>
        )}
      </Draggable>
    );
  }

  return (
    <Draggable draggableId={item.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`${styles.item} ${getItemStyles()} ${snapshot.isDragging ? styles.dragging : ''}`}
        >
          {/* Resize handles */}
          {!isResizing && (
            <>
              <div className={`${styles.resizeHandle} ${styles.topHandle}`} />
              <div className={`${styles.resizeHandle} ${styles.bottomHandle}`} />
            </>
          )}
          
          {/* Content */}
          {item.type === 'task' ? (
            <div className={styles.taskContent}>
              <Checkbox 
                checked={item.completed || false}
                onChange={handleTaskToggle}
              />
              <Text size={200} style={{ textDecoration: item.completed ? 'line-through' : 'none' }}>
                {item.title}
              </Text>
            </div>
          ) : (
            <Text size={200} weight="medium">
              {item.title}
            </Text>
          )}
        </div>
      )}
    </Draggable>
  );
};

export default CalendarItemComponent;
