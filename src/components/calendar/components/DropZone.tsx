
import { ReactNode } from 'react';
import { DroppableProvided, DroppableStateSnapshot } from '@hello-pangea/dnd';
import { makeStyles, tokens } from '@fluentui/react-components';

const useStyles = makeStyles({
  slot: {
    height: '7px',
    position: 'relative',
    minHeight: '7px',
    padding: '1px 0px', // 1px top and bottom padding for vertical spacing
  },
  halfHourBorder: {
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
  },
  noBorder: {
    // No border for non-half-hour slots
  },
  dropZone: {
    backgroundColor: tokens.colorBrandBackground2,
    opacity: '0.3',
    zIndex: '5',
  },
});

interface DropZoneProps {
  provided: DroppableProvided;
  snapshot: DroppableStateSnapshot;
  isHalfHourBoundary: boolean;
  onSlotClick: (e: React.MouseEvent) => void;
  children: ReactNode;
}

export const DropZone = ({ 
  provided, 
  snapshot, 
  isHalfHourBoundary, 
  onSlotClick, 
  children 
}: DropZoneProps) => {
  const styles = useStyles();
  
  const getBorderStyle = () => {
    return isHalfHourBoundary ? styles.halfHourBorder : styles.noBorder;
  };

  return (
    <div 
      ref={provided.innerRef}
      {...provided.droppableProps}
      className={`${styles.slot} ${getBorderStyle()} ${snapshot.isDraggingOver ? styles.dropZone : ''}`}
      onClick={onSlotClick}
    >
      {children}
      {provided.placeholder}
    </div>
  );
};
