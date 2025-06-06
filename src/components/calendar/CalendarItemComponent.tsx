
import { useState, useRef } from 'react';
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
    zIndex: '10', // Ensure items appear above grid lines
  },
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
    opacity: '0.6',
    border: `1px solid ${tokens.colorPaletteYellowBorder1}`,
  },
  milestone: {
    height: '2px',
    backgroundColor: tokens.colorPaletteRedBackground2,
    display: 'flex',
    alignItems: 'center',
    paddingLeft: '4px',
    zIndex: '10', // Ensure milestones appear above grid lines
  },
  selected: {
    '::before': {
      content: '""',
      position: 'absolute',
      top: '-4px',
      left: '-4px',
      right: '-4px',
      bottom: '-4px',
      border: `3px solid ${tokens.colorBrandStroke1}`,
      borderRadius: '8px',
      backgroundColor: 'transparent',
      zIndex: '-1',
      boxShadow: `0 0 0 1px ${tokens.colorNeutralBackground1}, 0 0 8px ${tokens.colorBrandBackground2}`,
    },
    zIndex: '15', // Selected items appear above non-selected ones
  },
  resizeHandle: {
    position: 'absolute',
    left: '0',
    right: '0',
    height: '4px',
    cursor: 'ns-resize',
    backgroundColor: 'transparent',
    zIndex: 15, // Resize handles above items
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
    zIndex: '20', // Dragging items appear above everything
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
  isSelected: boolean;
  onSelect: (itemId: string, ctrlKey: boolean) => void;
}

const CalendarItemComponent = ({ item, index, onUpdate, onDelete, isSelected, onSelect }: CalendarItemComponentProps) => {
  const styles = useStyles();
  const [isResizing, setIsResizing] = useState(false);
  const itemRef = useRef<HTMLDivElement>(null);

  const getItemStyles = () => {
    const baseStyle = (() => {
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
    })();
    
    return isSelected ? `${baseStyle} ${styles.selected}` : baseStyle;
  };

  const handleTaskToggle = () => {
    onUpdate({ completed: !item.completed });
  };

  const handleItemClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onSelect(item.id, e.ctrlKey);
  };

  const calculateHeight = () => {
    const startSlot = Math.floor(new Date(item.startTime).getHours() * 12 + new Date(item.startTime).getMinutes() / 5);
    const endSlot = Math.floor(new Date(item.endTime).getHours() * 12 + new Date(item.endTime).getMinutes() / 5);
    return Math.max(1, endSlot - startSlot) * 7; // 7px per 5-minute slot (84px per hour)
  };

  const handleResizeMouseDown = (direction: 'top' | 'bottom') => (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);

    const startY = e.clientY;
    const startTime = new Date(item.startTime);
    const endTime = new Date(item.endTime);

    const handleMouseMove = (e: MouseEvent) => {
      const deltaY = e.clientY - startY;
      const deltaSlots = Math.round(deltaY / 7); // 7px per 5-minute slot

      if (direction === 'top') {
        const newStartTime = new Date(startTime);
        newStartTime.setMinutes(startTime.getMinutes() + deltaSlots * 5);
        if (newStartTime < endTime) {
          onUpdate({ startTime: newStartTime });
        }
      } else {
        const newEndTime = new Date(endTime);
        newEndTime.setMinutes(endTime.getMinutes() + deltaSlots * 5);
        if (newEndTime > startTime) {
          onUpdate({ endTime: newEndTime });
        }
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  if (item.type === 'milestone') {
    return (
      <Draggable draggableId={item.id} index={index} isDragDisabled={isResizing}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            className={`${styles.item} ${getItemStyles()} ${snapshot.isDragging ? styles.dragging : ''}`}
            style={{
              height: '7px',
              ...provided.draggableProps.style,
            }}
            onClick={handleItemClick}
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
    <Draggable draggableId={item.id} index={index} isDragDisabled={isResizing}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className={`${styles.item} ${getItemStyles()} ${snapshot.isDragging ? styles.dragging : ''}`}
          style={{
            height: `${calculateHeight()}px`,
            ...provided.draggableProps.style,
          }}
          onClick={handleItemClick}
        >
          {/* Drag handle - only the content area, not resize handles */}
          <div {...provided.dragHandleProps} style={{ height: '100%', width: '100%', position: 'relative' }}>
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

          {/* Resize handles - outside of drag handle */}
          {!snapshot.isDragging && (
            <>
              <div 
                className={`${styles.resizeHandle} ${styles.topHandle}`}
                onMouseDown={handleResizeMouseDown('top')}
              />
              <div 
                className={`${styles.resizeHandle} ${styles.bottomHandle}`}
                onMouseDown={handleResizeMouseDown('bottom')}
              />
            </>
          )}
        </div>
      )}
    </Draggable>
  );
};

export default CalendarItemComponent;
