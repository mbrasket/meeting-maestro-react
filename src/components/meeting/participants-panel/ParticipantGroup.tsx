
import {
  Text,
  makeStyles,
  tokens,
} from '@fluentui/react-components';
import { Person } from '../../../data/sampleData';
import ParticipantItem from './ParticipantItem';

const useStyles = makeStyles({
  group: {
    marginBottom: tokens.spacingVerticalL,
  },
  header: {
    marginBottom: tokens.spacingVerticalS,
    paddingBottom: tokens.spacingVerticalXS,
    borderBottomColor: tokens.colorNeutralStroke2,
    borderBottomWidth: '1px',
    borderBottomStyle: 'solid',
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalS,
  },
});

interface ParticipantGroupProps {
  title: string;
  participants: Person[];
  count: number;
  onRemoveParticipant?: (participant: Person) => void;
}

const ParticipantGroup = ({ title, participants, count, onRemoveParticipant }: ParticipantGroupProps) => {
  const styles = useStyles();

  return (
    <div className={styles.group}>
      <div className={styles.header}>
        <Text size={400} weight="semibold">
          {title} ({count})
        </Text>
      </div>
      
      <div className={styles.list}>
        {participants.map((participant) => (
          <ParticipantItem 
            key={participant.id} 
            participant={participant} 
            onRemove={onRemoveParticipant}
          />
        ))}
      </div>
    </div>
  );
};

export default ParticipantGroup;
