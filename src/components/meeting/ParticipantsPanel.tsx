
import {
  Card,
  Text,
  makeStyles,
  tokens,
} from '@fluentui/react-components';
import { Person } from '../../data/sampleData';
import ParticipantGroup from './participants-panel/ParticipantGroup';

const useStyles = makeStyles({
  panel: {
    height: '100vh',
    width: '300px',
    position: 'fixed',
    right: 0,
    top: 0,
    backgroundColor: tokens.colorNeutralBackground1,
    borderLeftColor: tokens.colorNeutralStroke1,
    borderLeftWidth: '1px',
    borderLeftStyle: 'solid',
    overflowY: 'auto',
    zIndex: 10,
  },
  header: {
    padding: tokens.spacingVerticalM,
    borderBottomColor: tokens.colorNeutralStroke1,
    borderBottomWidth: '1px',
    borderBottomStyle: 'solid',
    backgroundColor: tokens.colorNeutralBackground1,
    position: 'sticky',
    top: 0,
    zIndex: 11,
  },
  content: {
    padding: tokens.spacingVerticalM,
  },
});

interface ParticipantsPanelProps {
  coOrganizers: Person[];
  participants: Person[];
  optionalParticipants: Person[];
}

const ParticipantsPanel = ({ coOrganizers, participants, optionalParticipants }: ParticipantsPanelProps) => {
  const styles = useStyles();

  const totalCount = coOrganizers.length + participants.length + optionalParticipants.length;

  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <Text size={500} weight="semibold">
          Participants ({totalCount})
        </Text>
      </div>
      
      <div className={styles.content}>
        {coOrganizers.length > 0 && (
          <ParticipantGroup
            title="Co-organizers"
            participants={coOrganizers}
            count={coOrganizers.length}
          />
        )}
        
        {participants.length > 0 && (
          <ParticipantGroup
            title="Participants"
            participants={participants}
            count={participants.length}
          />
        )}
        
        {optionalParticipants.length > 0 && (
          <ParticipantGroup
            title="Optional"
            participants={optionalParticipants}
            count={optionalParticipants.length}
          />
        )}
        
        {totalCount === 0 && (
          <Text size={300} style={{ color: tokens.colorNeutralForeground2 }}>
            No participants added yet
          </Text>
        )}
      </div>
    </div>
  );
};

export default ParticipantsPanel;
