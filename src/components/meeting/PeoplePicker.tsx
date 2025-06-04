
import { useState, useCallback, useRef } from 'react';
import {
  Input,
  Field,
  Popover,
  PopoverTrigger,
  PopoverSurface,
  makeStyles,
  tokens,
  Avatar,
  Text,
} from '@fluentui/react-components';
import { Dismiss12Regular } from '@fluentui/react-icons';
import { Person } from '../../data/sampleData';

const useStyles = makeStyles({
  container: {
    flex: 1,
    position: 'relative',
  },
  inputWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    minHeight: '32px',
  },
  chipsContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalXXS,
    flexWrap: 'nowrap',
    overflow: 'hidden',
    paddingRight: tokens.spacingHorizontalXS,
  },
  personaChip: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalXXS,
    padding: `2px ${tokens.spacingHorizontalXXS}`,
    backgroundColor: tokens.colorNeutralBackground2,
    borderRadius: tokens.borderRadiusSmall,
    border: `1px solid ${tokens.colorNeutralStroke1}`,
    maxWidth: '120px',
    fontSize: tokens.fontSizeBase200,
    flexShrink: 0,
  },
  dismissButton: {
    border: 'none',
    background: 'transparent',
    cursor: 'pointer',
    padding: '1px',
    borderRadius: tokens.borderRadiusSmall,
    display: 'flex',
    alignItems: 'center',
    '&:hover': {
      backgroundColor: tokens.colorNeutralBackground3,
    },
  },
  input: {
    flex: 1,
    minWidth: '100px',
    border: 'none',
    outline: 'none',
    background: 'transparent',
  },
  popoverSurface: {
    maxHeight: '200px',
    overflowY: 'auto',
    padding: 0,
    minWidth: '300px',
  },
  optionItem: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalS,
    padding: tokens.spacingVerticalS,
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: tokens.colorNeutralBackground2,
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
  underlineInput: {
    width: '100%',
    '& input': {
      paddingLeft: 0,
    },
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
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const addPerson = useCallback((person: Person) => {
    if (!value.find(p => p.id === person.id)) {
      const newPeople = [...value, person];
      onChange(newPeople);
      
      if (onAddToHistory) {
        onAddToHistory(person);
      }
    }
    setInputValue('');
    setIsPopoverOpen(false);
  }, [value, onChange, onAddToHistory]);

  const removePerson = useCallback((personToRemove: Person) => {
    const newPeople = value.filter(person => person.id !== personToRemove.id);
    onChange(newPeople);
  }, [value, onChange]);

  const handleInputChange = (newValue: string) => {
    setInputValue(newValue);
    setIsPopoverOpen(newValue.length > 0);
  };

  const handleInputFocus = () => {
    if (inputValue.length > 0) {
      setIsPopoverOpen(true);
    }
  };

  const handleInputBlur = () => {
    // Delay closing to allow for option selection
    setTimeout(() => setIsPopoverOpen(false), 150);
  };

  const handleOptionClick = (person: Person) => {
    addPerson(person);
  };

  const filteredSuggestions = suggestions.filter(person =>
    (person.name.toLowerCase().includes(inputValue.toLowerCase()) ||
     person.email.toLowerCase().includes(inputValue.toLowerCase()) ||
     person.role?.toLowerCase().includes(inputValue.toLowerCase()) ||
     person.department?.toLowerCase().includes(inputValue.toLowerCase())) &&
    !value.find(p => p.id === person.id)
  );

  const getPlaceholder = () => {
    if (value.length === 0) {
      return placeholder;
    }
    return '';
  };

  return (
    <div className={styles.container}>
      <Field required={required}>
        <Popover
          open={isPopoverOpen && filteredSuggestions.length > 0}
          onOpenChange={(_, data) => setIsPopoverOpen(data.open)}
        >
          <PopoverTrigger disableButtonEnhancement>
            <div className={styles.inputWrapper}>
              <Input
                ref={inputRef}
                appearance="underline"
                className={styles.underlineInput}
                value={inputValue}
                onChange={(_, data) => handleInputChange(data.value)}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
                placeholder={getPlaceholder()}
                contentBefore={
                  value.length > 0 && (
                    <div className={styles.chipsContainer}>
                      {value.map((person) => (
                        <div key={person.id} className={styles.personaChip}>
                          <Avatar
                            image={{ src: person.avatar }}
                            name={person.name}
                            size={16}
                          />
                          <Text size={200} truncate title={person.name}>
                            {person.name}
                          </Text>
                          <button
                            className={styles.dismissButton}
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              removePerson(person);
                            }}
                            aria-label={`Remove ${person.name}`}
                          >
                            <Dismiss12Regular />
                          </button>
                        </div>
                      ))}
                    </div>
                  )
                }
              />
            </div>
          </PopoverTrigger>
          
          <PopoverSurface className={styles.popoverSurface}>
            {filteredSuggestions.map((person) => (
              <div
                key={person.id}
                className={styles.optionItem}
                onClick={() => handleOptionClick(person)}
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
            ))}
          </PopoverSurface>
        </Popover>
      </Field>
    </div>
  );
};

export default PeoplePicker;
