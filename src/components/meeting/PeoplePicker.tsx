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
    maxWidth: '100%',
  },
  personaChip: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalXXS,
    padding: `2px ${tokens.spacingHorizontalXXS}`,
    backgroundColor: tokens.colorNeutralBackground2,
    borderRadius: tokens.borderRadiusSmall,
    borderTopColor: tokens.colorNeutralStroke1,
    borderRightColor: tokens.colorNeutralStroke1,
    borderBottomColor: tokens.colorNeutralStroke1,
    borderLeftColor: tokens.colorNeutralStroke1,
    borderTopWidth: '1px',
    borderRightWidth: '1px',
    borderBottomWidth: '1px',
    borderLeftWidth: '1px',
    borderTopStyle: 'solid',
    borderRightStyle: 'solid',
    borderBottomStyle: 'solid',
    borderLeftStyle: 'solid',
    maxWidth: '120px',
    fontSize: tokens.fontSizeBase200,
    flexShrink: 0,
    cursor: 'pointer',
    '&:focus': {
      outline: `2px solid ${tokens.colorBrandStroke1}`,
      outlineOffset: '1px',
    },
  },
  selectedChip: {
    backgroundColor: tokens.colorBrandBackground2,
    borderTopColor: tokens.colorBrandStroke1,
    borderRightColor: tokens.colorBrandStroke1,
    borderBottomColor: tokens.colorBrandStroke1,
    borderLeftColor: tokens.colorBrandStroke1,
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
    borderTopColor: tokens.colorNeutralStroke1,
    borderRightColor: tokens.colorNeutralStroke1,
    borderBottomColor: tokens.colorNeutralStroke1,
    borderLeftColor: tokens.colorNeutralStroke1,
    borderTopWidth: '1px',
    borderRightWidth: '1px',
    borderBottomWidth: '1px',
    borderLeftWidth: '1px',
    borderTopStyle: 'solid',
    borderRightStyle: 'solid',
    borderBottomStyle: 'solid',
    borderLeftStyle: 'solid',
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
  const [selectedChipIndex, setSelectedChipIndex] = useState(-1);
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
    setSelectedChipIndex(-1);
    // Keep focus on input after adding person
    setTimeout(() => inputRef.current?.focus(), 0);
  }, [value, onChange, onAddToHistory]);

  const removePerson = useCallback((personToRemove: Person) => {
    const newPeople = value.filter(person => person.id !== personToRemove.id);
    onChange(newPeople);
    setSelectedChipIndex(-1);
  }, [value, onChange]);

  const removePersonAtIndex = useCallback((index: number) => {
    if (index >= 0 && index < value.length) {
      const newPeople = value.filter((_, i) => i !== index);
      onChange(newPeople);
      setSelectedChipIndex(-1);
    }
  }, [value, onChange]);

  const handleInputChange = (newValue: string) => {
    setInputValue(newValue);
    setIsPopoverOpen(newValue.length > 0);
    setSelectedIndex(-1);
    setSelectedChipIndex(-1);
  };

  const handleInputFocus = () => {
    if (inputValue.length > 0) {
      setIsPopoverOpen(true);
    }
    setSelectedChipIndex(-1);
  };

  const handleInputBlur = (e: React.FocusEvent) => {
    // Don't close if focus is moving to a suggestion option or chip
    const relatedTarget = e.relatedTarget as HTMLElement;
    if (relatedTarget && (relatedTarget.closest('[data-suggestion-option]') || relatedTarget.closest('[data-chip]'))) {
      return;
    }
    
    // Delay closing to allow clicks to register
    setTimeout(() => {
      setIsPopoverOpen(false);
      setSelectedIndex(-1);
      setSelectedChipIndex(-1);
    }, 200);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    const cursorPosition = inputRef.current?.selectionStart || 0;
    
    // Handle navigation between chips and input
    if (e.key === 'ArrowLeft' && cursorPosition === 0 && value.length > 0) {
      e.preventDefault();
      setSelectedChipIndex(value.length - 1);
      setIsPopoverOpen(false);
      return;
    }

    // Handle backspace when input is empty - remove last person
    if (e.key === 'Backspace' && inputValue === '' && cursorPosition === 0 && value.length > 0) {
      e.preventDefault();
      removePersonAtIndex(value.length - 1);
      return;
    }

    // Handle suggestion navigation only when popover is open
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

  const handleChipKeyDown = (e: KeyboardEvent<HTMLDivElement>, index: number) => {
    switch (e.key) {
      case 'ArrowLeft':
        e.preventDefault();
        if (index > 0) {
          setSelectedChipIndex(index - 1);
        }
        break;
      case 'ArrowRight':
        e.preventDefault();
        if (index < value.length - 1) {
          setSelectedChipIndex(index + 1);
        } else {
          // Move to input
          setSelectedChipIndex(-1);
          inputRef.current?.focus();
        }
        break;
      case 'Backspace':
        e.preventDefault();
        removePersonAtIndex(index);
        // Focus previous chip or input
        if (index > 0) {
          setTimeout(() => setSelectedChipIndex(index - 1), 0);
        } else {
          setSelectedChipIndex(-1);
          setTimeout(() => inputRef.current?.focus(), 0);
        }
        break;
      case 'Delete':
        e.preventDefault();
        removePersonAtIndex(index);
        // Focus next chip or input
        if (index < value.length - 1) {
          setTimeout(() => setSelectedChipIndex(index), 0);
        } else {
          setSelectedChipIndex(-1);
          setTimeout(() => inputRef.current?.focus(), 0);
        }
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        removePerson(value[index]);
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
          onOpenChange={(_, data) => {
            // Only close if explicitly requested, don't interfere with typing
            if (!data.open) {
              setIsPopoverOpen(false);
              setSelectedIndex(-1);
            }
          }}
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
                    {value.map((person, index) => (
                      <div 
                        key={person.id} 
                        className={`${styles.personaChip} ${selectedChipIndex === index ? styles.selectedChip : ''}`}
                        tabIndex={0}
                        onKeyDown={(e) => handleChipKeyDown(e, index)}
                        onFocus={() => setSelectedChipIndex(index)}
                        data-chip
                      >
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
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              e.stopPropagation();
                              removePerson(person);
                            }
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
              <div
                key={person.id}
                className={styles.optionItem}
                onClick={() => handleOptionClick(person)}
                onMouseEnter={() => setSelectedIndex(index)}
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
              </div>
            ))}
          </PopoverSurface>
        </Popover>
      </Field>
    </div>
  );
};

export default PeoplePicker;
