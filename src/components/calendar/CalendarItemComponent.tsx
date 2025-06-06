
import { useRef } from 'react';
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
}

const CalendarItemComponent = ({ 
  item, 
  index, 
  onUpdate, 
  onDelete, 
  isSelected, 
  onSelect,
  column = 0,
  totalColumns = 1
}: CalendarItemComponentProps) => {
  const styles = useStyles();
  const itemRef = useRef<HTMLDivElement>(null);
  const { isResizing, handleResizeMouseDown } = useItemResize(item, onUpdate);

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

  return (
    <Draggable draggableId={item.id} index={index} isDragDisabled={isResizing}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className={`${styles.item} ${getItemStyles()} ${snapshot.isDragging ? styles.dragging : ''}`}
          style={{
            height: `${calculateItemHeight(item)}px`,
            ...calculateItemPosition(column, totalColumns),
            ...provided.draggableProps.style,
          }}
          onClick={handleItemClick}
        >
          <div {...provided.dragHandleProps} style={{ height: '100%', width: '100%', position: 'relative' }}>
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
