
import { Droppable } from '@hello-pangea/dnd';
import {
  makeStyles,
  tokens,
  Text,
} from '@fluentui/react-components';
import { CalendarItem, CalendarItemTemplate } from './types';
import ToolItem from './ToolItem';

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

interface ToolsPanelProps {
  onAddItem: (item: CalendarItem) => void;
}

const ToolsPanel = ({ onAddItem }: ToolsPanelProps) => {
  const styles = useStyles();

  const eventTemplates: CalendarItemTemplate[] = [
    { type: 'event', title: '30min Meeting', duration: 30 },
    { type: 'event', title: '1hr Meeting', duration: 60 },
    { type: 'event', title: 'Team Standup', duration: 15 },
    { type: 'event', title: 'All Hands', duration: 60 },
  ];

  const taskTemplates: CalendarItemTemplate[] = [
    { type: 'task', title: 'Quick Task', duration: 15 },
    { type: 'task', title: 'Focus Work', duration: 120 },
    { type: 'task', title: 'Review', duration: 30 },
  ];

  const highlightTemplates: CalendarItemTemplate[] = [
    { type: 'highlight', title: 'Focus Time', duration: 120, color: '#FFF4E6' },
    { type: 'highlight', title: 'Break Time', duration: 15, color: '#E6F7FF' },
    { type: 'highlight', title: 'Deep Work', duration: 240, color: '#F6FFED' },
  ];

  const milestoneTemplates: CalendarItemTemplate[] = [
    { type: 'milestone', title: 'Deadline', duration: 0 },
    { type: 'milestone', title: 'Checkpoint', duration: 0 },
    { type: 'milestone', title: 'Review Due', duration: 0 },
  ];

  const renderToolSection = (title: string, templates: CalendarItemTemplate[], droppableId: string) => (
    <div className={styles.section}>
      <Text className={styles.sectionTitle} size={400} weight="semibold">
        {title}
      </Text>
      <Droppable droppableId={droppableId}>
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={styles.toolGrid}
          >
            {templates.map((template, index) => (
              <ToolItem key={index} template={template} index={index} />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );

  return (
    <div className={styles.panel}>
      {renderToolSection('Events', eventTemplates, 'tools-events')}
      {renderToolSection('Tasks', taskTemplates, 'tools-tasks')}
      {renderToolSection('Time Highlights', highlightTemplates, 'tools-highlights')}
      {renderToolSection('Milestones', milestoneTemplates, 'tools-milestones')}
    </div>
  );
};

export default ToolsPanel;
