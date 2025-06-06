
import { ReactNode } from 'react';
import { DroppableProvided, DroppableStateSnapshot } from '@hello-pangea/dnd';

const slotStyles: React.CSSProperties = {
  height: '7px',
  position: 'relative',
  minHeight: '7px',
  padding: '1px 0px',
};

const halfHourBorderStyles: React.CSSProperties = {
  borderBottom: '1px solid #e1e1e1',
};

const dropZoneActiveStyles: React.CSSProperties = {
  backgroundColor: '#0078d4',
  opacity: 0.1,
  transition: 'all 0.2s ease',
};

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
  
  const getSlotStyle = (): React.CSSProperties => {
    const baseStyle = { ...slotStyles };
    
    if (isHalfHourBoundary) {
      Object.assign(baseStyle, halfHourBorderStyles);
    }
    
    if (snapshot.isDraggingOver) {
      Object.assign(baseStyle, dropZoneActiveStyles);
    }
    
    return baseStyle;
  };

  return (
    <div 
      ref={provided.innerRef}
      {...provided.droppableProps}
      style={getSlotStyle()}
      onClick={onSlotClick}
    >
      {children}
      {provided.placeholder}
    </div>
  );
};
