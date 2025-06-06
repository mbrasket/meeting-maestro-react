
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
    position: 'absolute',
    left: '4px',
    right: '4px',
    borderRadius: '4px',
    padding: '4px 8px',
    cursor: 'move',
    userSelect: 'none',
  },
  event: {
    backgroundColor: tokens.colorBrandBackground,
    borderColor: tokens.colorBrandStroke1,
    borderWidth: '1px',
    borderStyle: 'solid',
    color: tokens.colorNeutralForegroundOnBrand,
  },
  task: {
    backgroundColor: tokens.colorPaletteGreenBackground1,
    borderColor: tokens.colorPaletteGreenBorder1,
    borderWidth: '1px',
    borderStyle: 'solid',
  },
  highlight: {
    backgroundColor: tokens.colorPaletteYellowBackground1,
    opacity: '0.6',
    borderColor: tokens.colorPaletteYellowBorder1,
    borderWidth: '1px',
    borderStyle: 'solid',
  },
  milestone: {
    height: '2px',
    backgroundColor: tokens.colorPaletteRedBackground2,
    display: 'flex',
    alignItems: 'center',
    paddingLeft: '4px',
  },
  resizeHandle: {
    position: 'absolute',
    left: '0',
    right: '0',
    height: '4px',
    cursor: 'ns-resize',
    backgroundColor: 'transparent',
    ':hover': {
      backgroundColor: tokens.colorNeutralStroke1,
    },
  },
  topHandle: {
    top: '-2px',
  },
  bottomHandle: {
    bottom: '-2px',
  },
  dragging: {
    opacity: '0.5',
  },
  taskContent: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
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
