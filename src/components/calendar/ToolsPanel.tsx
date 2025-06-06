
import {
  makeStyles,
  tokens,
  Text,
  Card,
} from '@fluentui/react-components';
import { CalendarItem } from './types';
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

  const eventTemplates = [
    { type: 'event' as const, title: '30min Meeting', duration: 30 },
    { type: 'event' as const, title: '1hr Meeting', duration: 60 },
    { type: 'event' as const, title: 'Team Standup', duration: 15 },
    { type: 'event' as const, title: 'All Hands', duration: 60 },
  ];

  const taskTemplates = [
    { type: 'task' as const, title: 'Quick Task', duration: 15 },
    { type: 'task' as const, title: 'Focus Work', duration: 120 },
    { type: 'task' as const, title: 'Review', duration: 30 },
  ];

  const highlightTemplates = [
    { type: 'highlight' as const, title: 'Focus Time', duration: 120, color: '#FFF4E6' },
    { type: 'highlight' as const, title: 'Break Time', duration: 15, color: '#E6F7FF' },
    { type: 'highlight' as const, title: 'Deep Work', duration: 240, color: '#F6FFED' },
  ];

  const milestoneTemplates = [
    { type: 'milestone' as const, title: 'Deadline', duration: 0 },
    { type: 'milestone' as const, title: 'Checkpoint', duration: 0 },
    { type: 'milestone' as const, title: 'Review Due', duration: 0 },
  ];

  return (
    <div className={styles.panel}>
      <div className={styles.section}>
        <Text className={styles.sectionTitle} size={400} weight="semibold">
          Events
        </Text>
        <div className={styles.toolGrid}>
          {eventTemplates.map((template, index) => (
            <ToolItem key={index} template={template} />
          ))}
        </div>
      </div>

      <div className={styles.section}>
        <Text className={styles.sectionTitle} size={400} weight="semibold">
          Tasks
        </Text>
        <div className={styles.toolGrid}>
          {taskTemplates.map((template, index) => (
            <ToolItem key={index} template={template} />
          ))}
        </div>
      </div>

      <div className={styles.section}>
        <Text className={styles.sectionTitle} size={400} weight="semibold">
          Time Highlights
        </Text>
        <div className={styles.toolGrid}>
          {highlightTemplates.map((template, index) => (
            <ToolItem key={index} template={template} />
          ))}
        </div>
      </div>

      <div className={styles.section}>
        <Text className={styles.sectionTitle} size={400} weight="semibold">
          Milestones
        </Text>
        <div className={styles.toolGrid}>
          {milestoneTemplates.map((template, index) => (
            <ToolItem key={index} template={template} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ToolsPanel;
