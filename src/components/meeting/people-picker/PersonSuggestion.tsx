
import {
  Avatar,
  Text,
  makeStyles,
  tokens,
} from '@fluentui/react-components';
import { Person } from '../../../data/sampleData';

const useStyles = makeStyles({
  optionItem: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalS,
    padding: tokens.spacingVerticalS,
    cursor: 'pointer',
    border: 'none',
    background: 'transparent',
    width: '100%',
    textAlign: 'left',
    '&:hover': {
      backgroundColor: tokens.colorNeutralBackground2,
    },
    '&:focus': {
      backgroundColor: tokens.colorNeutralBackground2,
      outline: `2px solid ${tokens.colorBrandStroke1}`,
      outlineOffset: '-2px',
    },
  },
  optionDetails: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
  },
  optionSecondaryText: {
    color: tokens.colorNeutralForeground2,
    fontSize: tokens.fontSizeBase200,
  },
});

interface PersonSuggestionProps {
  person: Person;
  isSelected: boolean;
  onClick: (person: Person) => void;
  onMouseEnter: () => void;
}

const PersonSuggestion = ({ person, isSelected, onClick, onMouseEnter }: PersonSuggestionProps) => {
  const styles = useStyles();

  return (
    <div
      className={styles.optionItem}
      onClick={() => onClick(person)}
      onMouseEnter={onMouseEnter}
      data-suggestion-option
      style={{
        backgroundColor: isSelected ? tokens.colorNeutralBackground3 : 'transparent'
      }}
    >
      <Avatar
        image={{ src: person.avatar }}
        name={person.name}
        size={32}
      />
      <div className={styles.optionDetails}>
        <Text weight="semibold">{person.name}</Text>
        <Text className={styles.optionSecondaryText}>
          {person.role} • {person.department}
        </Text>
        <Text className={styles.optionSecondaryText} size={100}>
          {person.email}
        </Text>
      </div>
    </div>
  );
};

export default PersonSuggestion;
