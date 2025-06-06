
import { useRef, useState } from 'react';
import { useDraggable } from '@dnd-kit/core';
import { makeStyles, tokens } from '@fluentui/react-components';
import { CalendarItem } from './types';
import { useItemResize } from './hooks/useItemResize';
import { calculateItemHeight, calculateItemPosition } from './utils/itemCalculations';
import { MilestoneItem } from './components/MilestoneItem';
import { ResizeHandles } from './components/ResizeHandles';
import { ItemContent } from './components/ItemContent';

const useStyles = makeStyles({
  item: {
    position: 'absolute',
    top: '0',
    borderRadius: '4px',
    padding: '4px 8px',
    cursor: 'move',
    userSelect: 'none',
    zIndex: '10',
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
    zIndex: '15',
  },
  dragging: {
    opacity: '0.5',
    zIndex: '20',
  },
  resizing: {
    zIndex: '25', // Highest z-index during resize
  },
  copying: {
    opacity: '0.8',
    border: `2px dashed ${tokens.colorBrandStroke1}`,
    zIndex: '20',
  },
  collisionWarning: {
    border: `2px solid ${tokens.colorPaletteRedBorder1}`,
    backgroundColor: tokens.colorPaletteRedBackground1,
    '::after': {
      content: '"⚠"',
      position: 'absolute',
      top: '-8px',
      right: '-8px',
      width: '16px',
      height: '16px',
      backgroundColor: tokens.colorPaletteRedBackground2,
      color: tokens.colorNeutralForegroundOnBrand,
      borderRadius: '50%',
      fontSize: '10px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: '1',
    },
  },
});

interface CalendarItemComponentProps {
  item: CalendarItem;
  index: number;
  onUpdate: (updates: Partial<CalendarItem>) => void;
  onDelete: () => void;
  isSelected: boolean;
  onSelect: (itemId: string, ctrlKey: boolean) => void;
  column?: number;
  totalColumns?: number;
  isResizeActive?: boolean;
  onResizeStart?: () => void;
  onResizeEnd?: () => void;
  onCopyItem?: (item: CalendarItem) => void;
  isCtrlPressed?: boolean;
  hasCollisionWarning?: boolean;
}

const CalendarItemComponent = ({ 
  item, 
  index, 
  onUpdate, 
  onDelete, 
  isSelected, 
  onSelect,
  column = 0,
  totalColumns = 1,
  isResizeActive = false,
  onResizeStart,
  onResizeEnd,
  onCopyItem,
  isCtrlPressed = false,
  hasCollisionWarning = false
}: CalendarItemComponentProps) => {
  const styles = useStyles();
  const itemRef = useRef<HTMLDivElement>(null);
  const { isResizing, handleResizeMouseDown } = useItemResize(
    item, 
    onUpdate, 
    onResizeStart, 
    onResizeEnd
  );

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging,
  } = useDraggable({
    id: item.id,
    disabled: isResizing,
  });

  const getItemStyles = () => {
    const baseStyle = (() => {
      switch (item.type) {
        case 'event':
          return styles.event;
        case 'task':
          return styles.task;
        case 'highlight':
          return styles.highlight;
        default:
          return styles.event;
      }
    })();
    
    let combinedStyle = isSelected ? `${baseStyle} ${styles.selected}` : baseStyle;
    
    if (isResizing || isResizeActive) {
      combinedStyle += ` ${styles.resizing}`;
    }
    
    if (isDragging) {
      combinedStyle += ` ${styles.dragging}`;
    }
    
    if (hasCollisionWarning) {
      combinedStyle += ` ${styles.collisionWarning}`;
    }
    
    return combinedStyle;
  };

  const handleTaskToggle = () => {
    onUpdate({ completed: !item.completed });
  };

  const handleItemClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onSelect(item.id, e.ctrlKey);
  };

  if (item.type === 'milestone') {
    return (
      <MilestoneItem
        item={item}
        index={index}
        isSelected={isSelected}
        onSelect={onSelect}
        column={column}
        totalColumns={totalColumns}
      />
    );
  }

  // During resize, use full width to avoid layout jumps
  const positionStyle = isResizing || isResizeActive 
    ? { left: '4px', width: 'calc(100% - 8px)', paddingLeft: '4px', paddingRight: '4px' }
    : calculateItemPosition(column, totalColumns);

  const dragTransform = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : {};

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className={`${styles.item} ${getItemStyles()}`}
      style={{
        height: `${calculateItemHeight(item)}px`,
        ...positionStyle,
        ...dragTransform,
      }}
      onClick={handleItemClick}
    >
      <ItemContent item={item} onTaskToggle={handleTaskToggle} />

      <ResizeHandles 
        onResizeMouseDown={handleResizeMouseDown} 
        isDragging={isDragging}
      />
    </div>
  );
};

export default CalendarItemComponent;
