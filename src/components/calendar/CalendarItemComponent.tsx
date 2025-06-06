
import { useState } from 'react';
import { makeStyles, tokens, Text, Button } from '@fluentui/react-components';
import { Trash } from 'lucide-react';
import { CalendarItem } from './types';

const useStyles = makeStyles({
  item: {
    position: 'absolute',
    top: '4px',
    left: '4px',
    right: '4px',
    backgroundColor: tokens.colorBrandBackground,
    border: `1px solid ${tokens.colorBrandStroke1}`,
    borderRadius: '4px',
    padding: '8px',
    color: tokens.colorNeutralForegroundOnBrand,
    cursor: 'pointer',
    zIndex: 10,
    ':hover': {
      backgroundColor: tokens.colorBrandBackgroundHover,
    },
  },
  event: {
    backgroundColor: tokens.colorBrandBackground,
    border: `1px solid ${tokens.colorBrandStroke1}`,
  },
  task: {
    backgroundColor: tokens.colorPaletteGreenBackground1,
    border: `1px solid ${tokens.colorPaletteGreenBorder1}`,
    color: tokens.colorNeutralForeground1,
  },
  highlight: {
    backgroundColor: tokens.colorPaletteYellowBackground1,
    border: `1px solid ${tokens.colorPaletteYellowBorder1}`,
    color: tokens.colorNeutralForeground1,
  },
  milestone: {
    backgroundColor: tokens.colorPaletteRedBackground2,
    border: `1px solid ${tokens.colorPaletteRedBorder1}`,
    color: tokens.colorNeutralForeground1,
    height: '20px',
  },
  content: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  deleteButton: {
    minWidth: '20px',
    height: '20px',
    padding: 0,
  },
});

interface CalendarItemComponentProps {
  item: CalendarItem;
  onUpdate: (updates: Partial<CalendarItem>) => void;
  onDelete: () => void;
}

const CalendarItemComponent = ({ item, onUpdate, onDelete }: CalendarItemComponentProps) => {
  const styles = useStyles();
  const [isEditing, setIsEditing] = useState(false);

  const getItemStyles = () => {
    switch (item.type) {
      case 'event':
        return styles.event;
      case 'task':
        return styles.task;
      case 'highlight':
        return styles.highlight;
      case 'milestone':
        return styles.milestone;
      default:
        return styles.event;
    }
  };

  const handleTitleClick = () => {
    setIsEditing(true);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate({ title: e.target.value });
  };

  const handleTitleBlur = () => {
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      setIsEditing(false);
    }
  };

  return (
    <div className={`${styles.item} ${getItemStyles()}`}>
      <div className={styles.content}>
        {isEditing ? (
          <input
            type="text"
            value={item.title}
            onChange={handleTitleChange}
            onBlur={handleTitleBlur}
            onKeyDown={handleKeyDown}
            autoFocus
            style={{ 
              background: 'transparent', 
              border: 'none', 
              outline: 'none',
              color: 'inherit',
              width: '100%',
            }}
          />
        ) : (
          <Text size={200} onClick={handleTitleClick}>
            {item.title}
          </Text>
        )}
        <Button
          appearance="subtle"
          icon={<Trash />}
          size="small"
          className={styles.deleteButton}
          onClick={onDelete}
        />
      </div>
    </div>
  );
};

export default CalendarItemComponent;
