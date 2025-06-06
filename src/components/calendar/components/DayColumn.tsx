
import { memo } from 'react';
import { Droppable } from '@hello-pangea/dnd';
import { makeStyles, tokens, Text } from '@fluentui/react-components';
import { format } from 'date-fns';
import { CalendarItem } from '../types';
import CalendarItemComponent from '../CalendarItemComponent';
import { calculateOverlapPositions } from '../utils/overlapCalculations';

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
    height: 'calc(288 * 7px)', // 288 slots * 7px each
    position: 'relative',
    minHeight: '2016px',
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
        transparent 29px,
        ${tokens.colorNeutralStroke2} 29px,
        ${tokens.colorNeutralStroke2} 30px,
        transparent 30px,
        transparent 41px,
        ${tokens.colorNeutralStroke1} 41px,
        ${tokens.colorNeutralStroke1} 42px
      )
    `,
    pointerEvents: 'none',
  },
});

interface DayColumnProps {
  day: Date;
  dayIndex: number;
  items: CalendarItem[];
  allItems: CalendarItem[];
  onUpdateItem: (itemId: string, updates: Partial<CalendarItem>) => void;
  onDeleteItem: (itemId: string) => void;
  selectedItemIds: Set<string>;
  onSelectItem: (itemId: string, ctrlKey: boolean) => void;
  onClearSelection: () => void;
}

export const DayColumn = memo(({
  day,
  dayIndex,
  items,
  allItems,
  onUpdateItem,
  onDeleteItem,
  selectedItemIds,
  onSelectItem,
  onClearSelection,
}: DayColumnProps) => {
  const styles = useStyles();

  // Calculate positions for all items in this day
  const itemsWithPositions = calculateOverlapPositions(items, 0);

  const handleItemRender = (item: CalendarItem, position: any) => {
    const startSlot = Math.floor(
      new Date(item.startTime).getHours() * 12 + 
      new Date(item.startTime).getMinutes() / 5
    );
    
    const endSlot = Math.floor(
      new Date(item.endTime).getHours() * 12 + 
      new Date(item.endTime).getMinutes() / 5
    );

    const topPosition = startSlot * 7; // 7px per slot
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
            className={styles.dropZone}
            style={{
              backgroundColor: snapshot.isDraggingOver 
                ? 'rgba(0, 120, 212, 0.05)' 
                : 'transparent',
            }}
          >
            {/* Background grid lines */}
            <div className={styles.timeSlotGrid} />
            
            {/* Render all items for this day */}
            {itemsWithPositions.map((itemData) => 
              handleItemRender(itemData.item, itemData)
            )}
            
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
});

DayColumn.displayName = 'DayColumn';
