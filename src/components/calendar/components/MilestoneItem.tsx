
import { Draggable } from '@hello-pangea/dnd';
import { makeStyles, tokens, Text } from '@fluentui/react-components';
import { Flag } from 'lucide-react';
import { CalendarItem } from '../types';

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
    height: '4px', // Slightly taller for better visibility
    backgroundColor: tokens.colorPaletteRedBackground2,
    display: 'flex',
    alignItems: 'center',
    paddingLeft: '4px',
    zIndex: '10',
    border: `1px solid ${tokens.colorPaletteRedBorder1}`,
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

  const getItemStyles = () => {
    const baseStyle = styles.milestone;
    return isSelected ? `${baseStyle} ${styles.selected}` : baseStyle;
  };

  const handleItemClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onSelect(item.id, e.ctrlKey);
  };

  // Use consistent positioning calculation with padding
  const getPositionStyle = () => {
    const columnWidth = 100 / totalColumns;
    const left = column * columnWidth;
    return {
      left: `calc(${left}% + 2px)`, // Reduced from 4px
      width: `calc(${columnWidth}% - 4px)`, // Reduced from 8px (2px left + 2px right)
      height: '4px', // Reduced height to account for slot padding
      top: '1.5px', // Center vertically within the padded slot
    };
  };

  return (
    <Draggable draggableId={item.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`${styles.item} ${getItemStyles()} ${snapshot.isDragging ? styles.dragging : ''}`}
          style={{
            ...getPositionStyle(),
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
};
