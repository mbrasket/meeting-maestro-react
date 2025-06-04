
import { useState, useCallback, useRef, KeyboardEvent } from 'react';
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
  },
  popoverSurface: {
    maxHeight: '200px',
    overflowY: 'auto',
    padding: 0,
    minWidth: '300px',
    backgroundColor: tokens.colorNeutralBackground1,
    border: `1px solid ${tokens.colorNeutralStroke1}`,
    borderRadius: tokens.borderRadiusMedium,
    boxShadow: tokens.shadow16,
    zIndex: 1000,
  },
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
  const [selectedIndex, setSelectedIndex] = useState(-1);
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
    setSelectedIndex(-1);
  }, [value, onChange, onAddToHistory]);

  const removePerson = useCallback((personToRemove: Person) => {
    const newPeople = value.filter(person => person.id !== personToRemove.id);
    onChange(newPeople);
  }, [value, onChange]);

  const handleInputChange = (newValue: string) => {
    setInputValue(newValue);
    setIsPopoverOpen(newValue.length > 0);
    setSelectedIndex(-1);
  };

  const handleInputFocus = () => {
    if (inputValue.length > 0) {
      setIsPopoverOpen(true);
    }
  };

  const handleInputBlur = (e: React.FocusEvent) => {
    // Don't close if focus is moving to a suggestion option
    const relatedTarget = e.relatedTarget as HTMLElement;
    if (relatedTarget && relatedTarget.closest('[data-suggestion-option]')) {
      return;
    }
    
    setTimeout(() => {
      setIsPopoverOpen(false);
      setSelectedIndex(-1);
    }, 150);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!isPopoverOpen || filteredSuggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < filteredSuggestions.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev > 0 ? prev - 1 : filteredSuggestions.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < filteredSuggestions.length) {
          addPerson(filteredSuggestions[selectedIndex]);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setIsPopoverOpen(false);
        setSelectedIndex(-1);
        break;
    }
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
          positioning="below-start"
          onOpenChange={(_, data) => setIsPopoverOpen(data.open)}
        >
          <PopoverTrigger disableButtonEnhancement>
            <Input
              ref={inputRef}
              appearance="underline"
              className={styles.underlineInput}
              value={inputValue}
              onChange={(_, data) => handleInputChange(data.value)}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
              onKeyDown={handleKeyDown}
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
          </PopoverTrigger>
          
          <PopoverSurface className={styles.popoverSurface}>
            {filteredSuggestions.map((person, index) => (
              <button
                key={person.id}
                className={styles.optionItem}
                onClick={() => handleOptionClick(person)}
                onFocus={() => setSelectedIndex(index)}
                data-suggestion-option
                style={{
                  backgroundColor: selectedIndex === index ? tokens.colorNeutralBackground2 : 'transparent'
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
              </button>
            ))}
          </PopoverSurface>
        </Popover>
      </Field>
    </div>
  );
};

export default PeoplePicker;
