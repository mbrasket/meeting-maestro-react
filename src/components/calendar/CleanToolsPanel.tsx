
import { Droppable } from '@hello-pangea/dnd';
import {
  makeStyles,
  tokens,
  Text,
} from '@fluentui/react-components';
import { CalendarItem, CalendarItemTemplate } from './types';
import CleanToolItem from './CleanToolItem';

const useStyles = makeStyles({
  panel: {
    width: '280px',
    height: '100%',
    backgroundColor: tokens.colorNeutralBackground2,
    borderLeftColor: tokens.colorNeutralStroke1,
    borderLeftWidth: '1px',
    borderLeftStyle: 'solid',
    padding: tokens.spacingVerticalM,
    overflowY: 'auto',
  },
  section: {
    marginBottom: tokens.spacingVerticalL,
  },
  sectionTitle: {
    marginBottom: tokens.spacingVerticalS,
    paddingLeft: tokens.spacingHorizontalS,
  },
  toolGrid: {
    display: 'grid',
    gap: tokens.spacingVerticalS,
  },
});

interface CleanToolsPanelProps {
  onAddItem: (item: CalendarItem) => void;
}

const CleanToolsPanel = ({ onAddItem }: CleanToolsPanelProps) => {
  const styles = useStyles();

  const templates: CalendarItemTemplate[] = [
    { type: 'event', title: 'Event', duration: 60 },
    { type: 'task', title: 'Task', duration: 60 },
    { type: 'highlight', title: 'Time Block', duration: 120 },
    { type: 'milestone', title: 'Milestone', duration: 0 },
  ];

  return (
    <div className={styles.panel}>
      <div className={styles.section}>
        <Text className={styles.sectionTitle} size={400} weight="semibold">
          Calendar Items
        </Text>
        <Droppable droppableId="tools-items">
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className={styles.toolGrid}
            >
              {templates.map((template, index) => (
                <CleanToolItem key={template.type} template={template} index={index} />
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </div>
    </div>
  );
};

export default CleanToolsPanel;
