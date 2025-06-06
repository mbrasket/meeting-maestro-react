
import { Text, Checkbox, makeStyles } from '@fluentui/react-components';
import { CalendarItem } from '../types';

const useStyles = makeStyles({
  taskContent: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
});

interface ItemContentProps {
  item: CalendarItem;
  onTaskToggle: () => void;
}

export const ItemContent = ({ item, onTaskToggle }: ItemContentProps) => {
  const styles = useStyles();

  if (item.type === 'task') {
    return (
      <div className={styles.taskContent}>
        <Checkbox 
          checked={item.completed || false}
          onChange={onTaskToggle}
        />
        <Text size={200} style={{ textDecoration: item.completed ? 'line-through' : 'none' }}>
          {item.title}
        </Text>
      </div>
    );
  }

  return (
    <Text size={200} weight="medium">
      {item.title}
    </Text>
  );
};
