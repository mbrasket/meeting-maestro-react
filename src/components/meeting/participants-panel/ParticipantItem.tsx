
import { useState } from 'react';
import {
  Avatar,
  Text,
  Button,
  makeStyles,
  tokens,
} from '@fluentui/react-components';
import { Dismiss20Regular } from '@fluentui/react-icons';
import { Person } from '../../../data/sampleData';

const useStyles = makeStyles({
  item: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalS,
    padding: tokens.spacingVerticalXS,
    borderRadius: tokens.borderRadiusSmall,
    position: 'relative',
    '&:hover': {
      backgroundColor: tokens.colorNeutralBackground2,
    },
  },
  details: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    minWidth: 0,
  },
  name: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  email: {
    color: tokens.colorNeutralForeground2,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  role: {
    color: tokens.colorNeutralForeground3,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  deleteButton: {
    position: 'absolute',
    top: tokens.spacingVerticalXS,
    right: tokens.spacingHorizontalXS,
    transition: 'opacity 0.2s ease',
    minWidth: '24px',
    width: '24px',
    height: '24px',
  },
});

interface ParticipantItemProps {
  participant: Person;
  onRemove?: (participant: Person) => void;
}

const ParticipantItem = ({ participant, onRemove }: ParticipantItemProps) => {
  const styles = useStyles();
  const [isHovered, setIsHovered] = useState(false);

  const handleRemove = () => {
    if (onRemove) {
      onRemove(participant);
    }
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <div 
      className={styles.item}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Avatar
        image={{ src: participant.avatar }}
        name={participant.name}
        size={32}
      />
      <div className={styles.details}>
        <Text size={300} weight="semibold" className={styles.name} title={participant.name}>
          {participant.name}
        </Text>
        <Text size={200} className={styles.email} title={participant.email}>
          {participant.email}
        </Text>
        {participant.role && participant.department && (
          <Text size={100} className={styles.role} title={`${participant.role} • ${participant.department}`}>
            {participant.role} • {participant.department}
          </Text>
        )}
      </div>
      {onRemove && (
        <Button
          appearance="subtle"
          size="small"
          icon={<Dismiss20Regular />}
          className={styles.deleteButton}
          style={{ opacity: isHovered ? 1 : 0 }}
          onClick={handleRemove}
          title="Remove participant"
        />
      )}
    </div>
  );
};

export default ParticipantItem;
