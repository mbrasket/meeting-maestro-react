
import { useRef, useState } from 'react';
import { Draggable } from '@hello-pangea/dnd';
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
  onCopyItem
}: CalendarItemComponentProps) => {
  const styles = useStyles();
  const itemRef = useRef<HTMLDivElement>(null);
  const [isCopying, setIsCopying] = useState(false);
  const { isResizing, handleResizeMouseDown } = useItemResize(
    item, 
    onUpdate, 
    onResizeStart, 
    onResizeEnd
  );

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
    if (isCopying) {
      combinedStyle += ` ${styles.copying}`;
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

  const handleDragStart = (e: React.DragEvent) => {
    if (e.ctrlKey && onCopyItem) {
      setIsCopying(true);
      // Create a copy of the item for dragging
      onCopyItem(item);
    }
  };

  const handleDragEnd = () => {
    setIsCopying(false);
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

  return (
    <Draggable draggableId={item.id} index={index} isDragDisabled={isResizing}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className={`${styles.item} ${getItemStyles()} ${snapshot.isDragging ? styles.dragging : ''} ${isCopying ? styles.copying : ''}`}
          style={{
            height: `${calculateItemHeight(item)}px`,
            ...positionStyle,
            ...provided.draggableProps.style,
          }}
          onClick={handleItemClick}
        >
          <div 
            {...provided.dragHandleProps} 
            style={{ height: '100%', width: '100%', position: 'relative' }}
            onDragStart={(e) => {
              // Check if CTRL key is pressed at the start of drag
              if (e.ctrlKey && onCopyItem) {
                setIsCopying(true);
                onCopyItem(item);
              }
            }}
            onDragEnd={() => {
              setIsCopying(false);
            }}
          >
            <ItemContent item={item} onTaskToggle={handleTaskToggle} />
          </div>

          <ResizeHandles 
            onResizeMouseDown={handleResizeMouseDown} 
            isDragging={snapshot.isDragging}
          />
        </div>
      )}
    </Draggable>
  );
};

export default CalendarItemComponent;
