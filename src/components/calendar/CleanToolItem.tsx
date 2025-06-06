
import { Draggable } from '@hello-pangea/dnd';
import {
  makeStyles,
  tokens,
  Text,
  Checkbox,
} from '@fluentui/react-components';
import { Calendar, CheckSquare, Highlighter, Flag } from 'lucide-react';
import { CalendarItemTemplate, CalendarItemType } from './types';

const useStyles = makeStyles({
  toolItem: {
    padding: tokens.spacingVerticalS,
    borderRadius: tokens.borderRadiusMedium,
    borderColor: tokens.colorNeutralStroke1,
    borderWidth: '1px',
    borderStyle: 'solid',
    backgroundColor: tokens.colorNeutralBackground1,
    cursor: 'grab',
    userSelect: 'none',
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalS,
    transition: 'all 0.2s ease',
    '&:hover': {
      backgroundColor: tokens.colorNeutralBackground2,
      borderColor: tokens.colorNeutralStroke2,
    },
  },
  dragging: {
    opacity: 0.5,
    transform: 'scale(0.95)',
  },
  icon: {
    flexShrink: 0,
  },
});

interface CleanToolItemProps {
  template: CalendarItemTemplate;
  index: number;
}

const CleanToolItem = ({ template, index }: CleanToolItemProps) => {
  const styles = useStyles();

  const getIcon = () => {
    switch (template.type) {
      case 'event':
        return <Calendar size={16} />;
      case 'task':
        return <CheckSquare size={16} />;
      case 'highlight':
        return <Highlighter size={16} />;
      case 'milestone':
        return <Flag size={16} />;
      default:
        return <Calendar size={16} />;
    }
  };

  const renderContent = () => {
    switch (template.type) {
      case 'task':
        return (
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Checkbox disabled />
            <Text size={200} weight="medium">
              {template.title}
            </Text>
          </div>
        );
      default:
        return (
          <>
            <div className={styles.icon}>
              {getIcon()}
            </div>
            <Text size={200} weight="medium">
              {template.title}
            </Text>
          </>
        );
    }
  };

  return (
    <Draggable draggableId={`tool-${template.type}`} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`${styles.toolItem} ${snapshot.isDragging ? styles.dragging : ''}`}
        >
          {renderContent()}
        </div>
      )}
    </Draggable>
  );
};

export default CleanToolItem;
