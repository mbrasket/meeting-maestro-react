
import {
  Button,
  Text,
  makeStyles,
  tokens,
} from '@fluentui/react-components';
import { Add20Regular } from '@fluentui/react-icons';
import { OneOffInstance } from '../types';
import InstanceItem from './InstanceItem';

const useStyles = makeStyles({
  section: {
    marginBottom: '24px',
    padding: tokens.spacingVerticalM,
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    borderRadius: tokens.borderRadiusMedium,
    backgroundColor: tokens.colorNeutralBackground1,
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: tokens.spacingVerticalM,
  },
  sectionTitle: {
    fontWeight: tokens.fontWeightSemibold,
  },
  addButton: {
    minWidth: 'auto',
  },
  instancesList: {
    display: 'flex',
    flexDirection: 'column',
  },
  emptyState: {
    textAlign: 'center',
    color: tokens.colorNeutralForeground3,
    padding: tokens.spacingVerticalL,
  },
});

// Helper function to get the next whole half hour
const getNextHalfHour = () => {
  const now = new Date();
  const minutes = now.getMinutes() <= 30 ? 30 : 0;
  if (minutes === 0) {
    now.setHours(now.getHours() + 1);
  }
  now.setMinutes(minutes);
  
  let hours = now.getHours();
  const period = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12;
  
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${period}`;
};

// Helper function to add 30 minutes to a time
const addThirtyMinutes = (timeStr: string) => {
  const match = timeStr.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) return timeStr;
  
  let hours = parseInt(match[1], 10);
  let minutes = parseInt(match[2], 10);
  const period = match[3].toUpperCase();
  
  minutes += 30;
  if (minutes >= 60) {
    minutes -= 60;
    hours += 1;
    if (hours > 12) {
      hours = 1;
    }
  }
  
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${period}`;
};

interface OneOffInstancesSectionProps {
  instances: OneOffInstance[];
  onInstancesChange: (instances: OneOffInstance[]) => void;
}

const OneOffInstancesSection = ({ instances, onInstancesChange }: OneOffInstancesSectionProps) => {
  const styles = useStyles();

  const handleAddInstance = () => {
    const today = new Date().toISOString().split('T')[0];
    const defaultStartTime = getNextHalfHour();
    const defaultEndTime = addThirtyMinutes(defaultStartTime);
    
    const newInstance: OneOffInstance = {
      id: `instance-${Date.now()}`,
      dateTime: `${today}T${defaultStartTime}:00`,
      date: today,
      startTime: defaultStartTime,
      endTime: defaultEndTime,
    };
    onInstancesChange([...instances, newInstance]);
  };

  const handleUpdateInstance = (updatedInstance: OneOffInstance) => {
    const updatedInstances = instances.map(instance =>
      instance.id === updatedInstance.id ? updatedInstance : instance
    );
    onInstancesChange(updatedInstances);
  };

  const handleDeleteInstance = (instanceId: string) => {
    const filteredInstances = instances.filter(instance => instance.id !== instanceId);
    onInstancesChange(filteredInstances);
  };

  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <Text className={styles.sectionTitle}>One-off instances</Text>
        <Button
          appearance="primary"
          icon={<Add20Regular />}
          className={styles.addButton}
          onClick={handleAddInstance}
        >
          Add instance
        </Button>
      </div>

      <div className={styles.instancesList}>
        {instances.length === 0 ? (
          <div className={styles.emptyState}>
            <Text>No instances added yet. Click "Add instance" to create one.</Text>
          </div>
        ) : (
          instances.map(instance => (
            <InstanceItem
              key={instance.id}
              instance={instance}
              onUpdate={handleUpdateInstance}
              onDelete={handleDeleteInstance}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default OneOffInstancesSection;
