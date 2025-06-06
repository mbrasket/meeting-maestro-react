
import { useDraggable } from '@dnd-kit/core';
import { makeStyles, tokens, Text } from '@fluentui/react-components';
import { Flag } from 'lucide-react';
import { CalendarItem } from '../types';
import { calculateItemPosition } from '../utils/itemCalculations';

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
  milestone: {
    height: '2px',
    backgroundColor: tokens.colorPaletteRedBackground2,
    display: 'flex',
    alignItems: 'center',
    paddingLeft: '4px',
    zIndex: '10',
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

interface MilestoneItemProps {
  item: CalendarItem;
  index: number;
  isSelected: boolean;
  onSelect: (itemId: string, ctrlKey: boolean) => void;
  column: number;
  totalColumns: number;
}

export const MilestoneItem = ({ 
  item, 
  index, 
  isSelected, 
  onSelect,
  column,
  totalColumns
}: MilestoneItemProps) => {
  const styles = useStyles();

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging,
  } = useDraggable({
    id: item.id,
  });

  const getItemStyles = () => {
    const baseStyle = styles.milestone;
    return isSelected ? `${baseStyle} ${styles.selected}` : baseStyle;
  };

  const handleItemClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onSelect(item.id, e.ctrlKey);
  };

  const dragTransform = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : {};

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className={`${styles.item} ${getItemStyles()} ${isDragging ? styles.dragging : ''}`}
      style={{
        height: '7px',
        ...calculateItemPosition(column, totalColumns),
        ...dragTransform,
      }}
      onClick={handleItemClick}
    >
      <Flag size={12} />
      <Text size={200} style={{ marginLeft: '4px' }}>
        {item.title}
      </Text>
    </div>
  );
};
