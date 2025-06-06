
import { memo, useEffect, useState } from 'react';
import { Droppable } from '@hello-pangea/dnd';
import { makeStyles, tokens, Text } from '@fluentui/react-components';
import { format } from 'date-fns';
import { CalendarItem } from '../types';
import CalendarItemComponent from '../CalendarItemComponent';
import { calculateOverlapPositions } from '../utils/overlapCalculations';
import { DragState, DropPosition } from '../types/dragTypes';

const useStyles = makeStyles({
  dayColumn: {
    position: 'relative',
    borderRightColor: tokens.colorNeutralStroke1,
    borderRightWidth: '1px',
    borderRightStyle: 'solid',
    minWidth: '100px',
    height: '100%',
  },
  dayHeader: {
    height: '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomColor: tokens.colorNeutralStroke1,
    borderBottomWidth: '1px',
    borderBottomStyle: 'solid',
    backgroundColor: tokens.colorNeutralBackground2,
    position: 'sticky',
    top: 0,
    zIndex: 2,
  },
  dropZone: {
    height: 'calc(24 * 84px)',
    position: 'relative',
    minHeight: '2016px',
  },
  dropZoneActive: {
    backgroundColor: 'rgba(0, 120, 212, 0.05)',
  },
  dropZoneValid: {
    backgroundColor: 'rgba(16, 124, 16, 0.05)',
    borderColor: tokens.colorPaletteGreenBorder1,
    borderWidth: '2px',
    borderStyle: 'dashed',
  },
  timeSlotGrid: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundImage: `
      repeating-linear-gradient(
        to bottom,
        transparent 0px,
        transparent 6px,
        ${tokens.colorNeutralStroke3} 6px,
        ${tokens.colorNeutralStroke3} 7px
      ),
      repeating-linear-gradient(
        to bottom,
        transparent 0px,
        transparent 83px,
        ${tokens.colorNeutralStroke2} 83px,
        ${tokens.colorNeutralStroke2} 84px
      )
    `,
    pointerEvents: 'none',
  },
  dropIndicator: {
    position: 'absolute',
    left: '4px',
    right: '4px',
    height: '2px',
    backgroundColor: tokens.colorBrandBackground,
    borderRadius: '1px',
    zIndex: 20,
    transition: 'all 0.2s ease',
  },
});

interface OptimalDayColumnProps {
  day: Date;
  dayIndex: number;
  items: CalendarItem[];
  allItems: CalendarItem[];
  onUpdateItem: (itemId: string, updates: Partial<CalendarItem>) => void;
  onDeleteItem: (itemId: string) => void;
  selectedItemIds: Set<string>;
  onSelectItem: (itemId: string, ctrlKey: boolean) => void;
  onClearSelection: () => void;
  dragState: DragState;
  calculateDropPosition: (clientX: number, clientY: number) => DropPosition | null;
}

export const OptimalDayColumn = memo(({
  day,
  dayIndex,
  items,
  allItems,
  onUpdateItem,
  onDeleteItem,
  selectedItemIds,
  onSelectItem,
  onClearSelection,
  dragState,
  calculateDropPosition,
}: OptimalDayColumnProps) => {
  const styles = useStyles();
  const [dropIndicatorPosition, setDropIndicatorPosition] = useState<number | null>(null);

  const itemsWithPositions = calculateOverlapPositions(items, 0);

  const isTargetDay = dragState.isDragging && 
    dragState.targetDay?.toDateString() === day.toDateString();

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (dragState.isDragging && isTargetDay) {
        const position = calculateDropPosition(e.clientX, e.clientY);
        if (position && position.dayIndex === dayIndex) {
          setDropIndicatorPosition(position.slot * 7);
        }
      }
    };

    if (dragState.isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, [dragState.isDragging, isTargetDay, calculateDropPosition, dayIndex]);

  const getDropZoneClass = (snapshot: any) => {
    let className = styles.dropZone;
    
    if (snapshot.isDraggingOver) {
      className += ` ${styles.dropZoneActive}`;
      if (dragState.isValidDrop) {
        className += ` ${styles.dropZoneValid}`;
      }
    }
    
    return className;
  };

  const renderItem = (item: CalendarItem, position: any) => {
    const startSlot = Math.floor(
      new Date(item.startTime).getHours() * 12 + 
      new Date(item.startTime).getMinutes() / 5
    );
    
    const endSlot = Math.floor(
      new Date(item.endTime).getHours() * 12 + 
      new Date(item.endTime).getMinutes() / 5
    );

    const topPosition = startSlot * 7;
    const height = Math.max(1, endSlot - startSlot) * 7;

    return (
      <div
        key={item.id}
        style={{
          position: 'absolute',
          top: `${topPosition}px`,
          height: `${height}px`,
          left: `calc(${(position.column / position.totalColumns) * 100}% + 2px)`,
          width: `calc(${100 / position.totalColumns}% - 4px)`,
          zIndex: selectedItemIds.has(item.id) ? 15 : 10,
        }}
      >
        <CalendarItemComponent
          item={item}
          index={0}
          onUpdate={(updates) => onUpdateItem(item.id, updates)}
          onDelete={() => onDeleteItem(item.id)}
          isSelected={selectedItemIds.has(item.id)}
          onSelect={onSelectItem}
          column={position.column}
          totalColumns={position.totalColumns}
        />
      </div>
    );
  };

  return (
    <div className={styles.dayColumn}>
      <div className={styles.dayHeader}>
        <Text size={300} weight="semibold">
          {format(day, 'EEE d')}
        </Text>
      </div>
      
      <Droppable droppableId={`day-${dayIndex}`}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={getDropZoneClass(snapshot)}
          >
            <div className={styles.timeSlotGrid} />
            
            {isTargetDay && dropIndicatorPosition !== null && (
              <div 
                className={styles.dropIndicator}
                style={{
                  top: `${dropIndicatorPosition}px`,
                }}
              />
            )}
            
            {itemsWithPositions.map((itemData) => 
              renderItem(itemData.item, itemData)
            )}
            
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
});

OptimalDayColumn.displayName = 'OptimalDayColumn';
