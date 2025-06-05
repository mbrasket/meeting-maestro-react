
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

interface OneOffInstancesSectionProps {
  instances: OneOffInstance[];
  onInstancesChange: (instances: OneOffInstance[]) => void;
}

const OneOffInstancesSection = ({ instances, onInstancesChange }: OneOffInstancesSectionProps) => {
  const styles = useStyles();

  const handleAddInstance = () => {
    const newInstance: OneOffInstance = {
      id: `instance-${Date.now()}`,
      dateTime: '',
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
