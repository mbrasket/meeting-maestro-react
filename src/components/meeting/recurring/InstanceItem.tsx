
import {
  Input,
  Field,
  Button,
  makeStyles,
  tokens,
} from '@fluentui/react-components';
import { Delete20Regular } from '@fluentui/react-icons';
import { OneOffInstance } from '../types';

const useStyles = makeStyles({
  instanceItem: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalM,
    padding: tokens.spacingVerticalS,
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    borderRadius: tokens.borderRadiusSmall,
    marginBottom: tokens.spacingVerticalS,
  },
  dateTimeField: {
    flex: 1,
  },
  deleteButton: {
    minWidth: 'auto',
    padding: tokens.spacingHorizontalXS,
    color: tokens.colorPaletteRedForeground1,
    '&:hover': {
      backgroundColor: tokens.colorPaletteRedBackground2,
    },
  },
});

interface InstanceItemProps {
  instance: OneOffInstance;
  onUpdate: (instance: OneOffInstance) => void;
  onDelete: (instanceId: string) => void;
}

const InstanceItem = ({ instance, onUpdate, onDelete }: InstanceItemProps) => {
  const styles = useStyles();

  const handleDateTimeChange = (value: string) => {
    onUpdate({ ...instance, dateTime: value });
  };

  return (
    <div className={styles.instanceItem}>
      <Field className={styles.dateTimeField}>
        <Input
          appearance="underline"
          type="datetime-local"
          value={instance.dateTime}
          onChange={(_, data) => handleDateTimeChange(data.value)}
        />
      </Field>
      <Button
        appearance="subtle"
        icon={<Delete20Regular />}
        className={styles.deleteButton}
        onClick={() => onDelete(instance.id)}
      />
    </div>
  );
};

export default InstanceItem;
