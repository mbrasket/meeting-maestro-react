
import {
  Avatar,
  Text,
  makeStyles,
  tokens,
} from '@fluentui/react-components';
import { Person } from '../../../data/sampleData';

const useStyles = makeStyles({
  item: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalS,
    padding: tokens.spacingVerticalXS,
    borderRadius: tokens.borderRadiusSmall,
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
});

interface ParticipantItemProps {
  participant: Person;
}

const ParticipantItem = ({ participant }: ParticipantItemProps) => {
  const styles = useStyles();

  return (
    <div className={styles.item}>
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
    </div>
  );
};

export default ParticipantItem;
