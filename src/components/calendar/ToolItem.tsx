
import { Draggable } from '@hello-pangea/dnd';
import {
  makeStyles,
  tokens,
  Text,
  Card,
} from '@fluentui/react-components';
import { Flag, Clock, CheckSquare, Calendar } from 'lucide-react';
import { CalendarItemTemplate } from './types';

const useStyles = makeStyles({
  toolItem: {
    padding: tokens.spacingVerticalS,
    cursor: 'grab',
    borderRadius: '4px',
    borderColor: tokens.colorNeutralStroke1,
    borderWidth: '1px',
    borderStyle: 'solid',
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalS,
    backgroundColor: tokens.colorNeutralBackground1,
    ':hover': {
      backgroundColor: tokens.colorNeutralBackground1Hover,
    },
  },
  dragging: {
    opacity: '0.5',
  },
  icon: {
    color: tokens.colorNeutralForeground2,
  },
  content: {
    flex: '1',
  },
});

interface ToolItemProps {
  template: CalendarItemTemplate;
  index: number;
}

const ToolItem = ({ template, index }: ToolItemProps) => {
  const styles = useStyles();

  const getIcon = () => {
    switch (template.type) {
      case 'event':
        return <Calendar size={16} className={styles.icon} />;
      case 'task':
        return <CheckSquare size={16} className={styles.icon} />;
      case 'highlight':
        return <Clock size={16} className={styles.icon} />;
      case 'milestone':
        return <Flag size={16} className={styles.icon} />;
      default:
        return <Calendar size={16} className={styles.icon} />;
    }
  };

  const draggableId = `tool-${template.type}-${template.title}-${index}`;

  return (
    <Draggable draggableId={draggableId} index={index}>
      {(provided, snapshot) => (
        <Card
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`${styles.toolItem} ${snapshot.isDragging ? styles.dragging : ''}`}
        >
          {getIcon()}
          <div className={styles.content}>
            <Text size={300}>{template.title}</Text>
            {template.duration > 0 && (
              <Text size={200} style={{ color: tokens.colorNeutralForeground2 }}>
                {template.duration}min
              </Text>
            )}
          </div>
        </Card>
      )}
    </Draggable>
  );
};

export default ToolItem;
