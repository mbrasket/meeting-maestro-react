
import { useState, useCallback } from 'react';
import {
  Combobox,
  Option,
  Field,
  makeStyles,
  tokens,
  Avatar,
  Text,
} from '@fluentui/react-components';
import { Persona, PersonaPresence } from '@fluentui/react-persona';
import { Dismiss12Regular } from '@fluentui/react-icons';
import { Person } from '../../data/sampleData';

const useStyles = makeStyles({
  container: {
    flex: 1,
  },
  selectedPeopleContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: tokens.spacingHorizontalXS,
    marginBottom: tokens.spacingVerticalXS,
  },
  personaChip: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalXS,
    padding: `${tokens.spacingVerticalXXS} ${tokens.spacingHorizontalXS}`,
    backgroundColor: tokens.colorNeutralBackground2,
    borderRadius: tokens.borderRadiusSmall,
    border: `1px solid ${tokens.colorNeutralStroke1}`,
    maxWidth: '200px',
  },
  dismissButton: {
    border: 'none',
    background: 'transparent',
    cursor: 'pointer',
    padding: '2px',
    borderRadius: tokens.borderRadiusSmall,
    '&:hover': {
      backgroundColor: tokens.colorNeutralBackground3,
    },
  },
  optionContent: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalS,
    width: '100%',
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

interface PeoplePickerProps {
  value: Person[];
  onChange: (value: Person[]) => void;
  placeholder: string;
  suggestions: Person[];
  onAddToHistory?: (person: Person) => void;
  required?: boolean;
}

const PeoplePicker = ({ 
  value, 
  onChange, 
  placeholder, 
  suggestions,
  onAddToHistory,
  required 
}: PeoplePickerProps) => {
  const styles = useStyles();
  const [inputValue, setInputValue] = useState('');
  
  const addPerson = useCallback((person: Person) => {
    if (!value.find(p => p.id === person.id)) {
      const newPeople = [...value, person];
      onChange(newPeople);
      
      if (onAddToHistory) {
        onAddToHistory(person);
      }
    }
    setInputValue('');
  }, [value, onChange, onAddToHistory]);

  const removePerson = useCallback((personToRemove: Person) => {
    const newPeople = value.filter(person => person.id !== personToRemove.id);
    onChange(newPeople);
  }, [value, onChange]);

  const handleInputChange = (newValue: string) => {
    setInputValue(newValue);
  };

  const handleOptionSelect = (_, data) => {
    if (data.optionValue) {
      const selectedPerson = suggestions.find(p => p.id === data.optionValue);
      if (selectedPerson) {
        addPerson(selectedPerson);
      }
    }
  };

  const filteredSuggestions = suggestions.filter(person =>
    (person.name.toLowerCase().includes(inputValue.toLowerCase()) ||
     person.email.toLowerCase().includes(inputValue.toLowerCase()) ||
     person.role?.toLowerCase().includes(inputValue.toLowerCase()) ||
     person.department?.toLowerCase().includes(inputValue.toLowerCase())) &&
    !value.find(p => p.id === person.id)
  );

  return (
    <div className={styles.container}>
      <Field required={required}>
        {value.length > 0 && (
          <div className={styles.selectedPeopleContainer}>
            {value.map((person) => (
              <div key={person.id} className={styles.personaChip}>
                <Avatar
                  image={{ src: person.avatar }}
                  name={person.name}
                  size={20}
                />
                <Text size={200} truncate title={person.name}>
                  {person.name}
                </Text>
                <button
                  className={styles.dismissButton}
                  onClick={() => removePerson(person)}
                  aria-label={`Remove ${person.name}`}
                >
                  <Dismiss12Regular />
                </button>
              </div>
            ))}
          </div>
        )}
        
        <Combobox
          appearance="underline"
          placeholder={placeholder}
          value={inputValue}
          onInput={(e) => handleInputChange((e.target as HTMLInputElement).value)}
          onOptionSelect={handleOptionSelect}
        >
          {filteredSuggestions.map((person) => (
            <Option key={person.id} value={person.id}>
              <div className={styles.optionContent}>
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
            </Option>
          ))}
        </Combobox>
      </Field>
    </div>
  );
};

export default PeoplePicker;
