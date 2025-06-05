
import { useState, useCallback, useRef, KeyboardEvent, useEffect } from 'react';
import { Field, makeStyles } from '@fluentui/react-components';
import { Person } from '../../../data/sampleData';
import PersonChip from './PersonChip';
import PeoplePickerInput from './PeoplePickerInput';
import SuggestionsPopover from './SuggestionsPopover';
import { useKeyboardNavigation } from '../../../hooks/useKeyboardNavigation';
import { useChipNavigation } from '../../../hooks/useChipNavigation';

const useStyles = makeStyles({
  container: {
    flex: 1,
    position: 'relative',
  },
});

interface PeoplePickerCoreProps {
  value: Person[];
  onChange: (value: Person[]) => void;
  placeholder: string;
  suggestions: Person[];
  onAddToHistory?: (person: Person) => void;
  required?: boolean;
}

const PeoplePickerCore = ({ 
  value, 
  onChange, 
  placeholder, 
  suggestions,
  onAddToHistory,
  required 
}: PeoplePickerCoreProps) => {
  const styles = useStyles();
  const [inputValue, setInputValue] = useState('');
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const suggestionRefs = useRef<(HTMLDivElement | null)[]>([]);

  const filteredSuggestions = suggestions.filter(person =>
    (person.name.toLowerCase().includes(inputValue.toLowerCase()) ||
     person.email.toLowerCase().includes(inputValue.toLowerCase()) ||
     person.role?.toLowerCase().includes(inputValue.toLowerCase()) ||
     person.department?.toLowerCase().includes(inputValue.toLowerCase())) &&
    !value.find(p => p.id === person.id)
  );

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
    setTimeout(() => inputRef.current?.focus(), 0);
  }, [value, onChange, onAddToHistory]);

  const addTextAsPerson = useCallback((text: string) => {
    const trimmedText = text.trim();
    if (trimmedText && !value.find(p => p.name === trimmedText || p.email === trimmedText)) {
      const tempPerson: Person = {
        id: `temp-${Date.now()}`,
        name: trimmedText,
        email: trimmedText.includes('@') ? trimmedText : `${trimmedText}@company.com`,
        avatar: '',
        role: 'External',
        department: 'External'
      };
      
      const newPeople = [...value, tempPerson];
      onChange(newPeople);
      
      if (onAddToHistory) {
        onAddToHistory(tempPerson);
      }
    }
    setInputValue('');
    setIsPopoverOpen(false);
    setTimeout(() => inputRef.current?.focus(), 0);
  }, [value, onChange, onAddToHistory]);

  const removePerson = useCallback((personToRemove: Person) => {
    const newPeople = value.filter(person => person.id !== personToRemove.id);
    onChange(newPeople);
  }, [value, onChange]);

  const removePersonAtIndex = useCallback((person: Person, index: number) => {
    removePerson(person);
  }, [removePerson]);

  const {
    selectedIndex,
    handleKeyDown: handleNavigationKeyDown,
    resetSelection,
    setSelection
  } = useKeyboardNavigation({
    itemCount: filteredSuggestions.length,
    onSelect: (index) => addPerson(filteredSuggestions[index]),
    onEscape: () => {
      setIsPopoverOpen(false);
      setTimeout(() => inputRef.current?.focus(), 0);
    },
    isOpen: isPopoverOpen
  });

  const {
    selectedChipIndex,
    chipRefs,
    handleChipKeyDown,
    resetChipSelection,
    setChipSelection
  } = useChipNavigation(value, removePersonAtIndex);

  // Auto-select first suggestion when flyout opens
  useEffect(() => {
    if (isPopoverOpen && filteredSuggestions.length > 0) {
      setSelection(0);
    } else {
      resetSelection();
    }
  }, [isPopoverOpen, filteredSuggestions.length, setSelection, resetSelection]);
  
  // Scroll selected item into view
  useEffect(() => {
    if (selectedIndex >= 0 && popoverRef.current && suggestionRefs.current[selectedIndex]) {
      const popover = popoverRef.current;
      const selectedItem = suggestionRefs.current[selectedIndex];
      
      if (selectedItem) {
        const popoverRect = popover.getBoundingClientRect();
        const itemRect = selectedItem.getBoundingClientRect();
        
        if (itemRect.bottom > popoverRect.bottom) {
          popover.scrollTop += itemRect.bottom - popoverRect.bottom;
        } else if (itemRect.top < popoverRect.top) {
          popover.scrollTop -= popoverRect.top - itemRect.top;
        }
      }
    }
  }, [selectedIndex]);

  const handleInputChange = (newValue: string) => {
    setInputValue(newValue);
    setIsPopoverOpen(newValue.length > 0);
    resetChipSelection();
  };

  const handleInputFocus = () => {
    if (inputValue.length > 0) {
      setIsPopoverOpen(true);
    }
    resetChipSelection();
  };

  const handleInputBlur = (e: React.FocusEvent) => {
    const relatedTarget = e.relatedTarget as HTMLElement;
    if (relatedTarget && (relatedTarget.closest('[data-suggestion-option]') || relatedTarget.closest('[data-chip]'))) {
      return;
    }
    
    setTimeout(() => {
      setIsPopoverOpen(false);
      resetSelection();
      resetChipSelection();
    }, 200);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    const cursorPosition = inputRef.current?.selectionStart || 0;
    
    // Handle semicolon - convert current input to chip
    if (e.key === ';') {
      e.preventDefault();
      if (inputValue.trim()) {
        addTextAsPerson(inputValue);
      }
      return;
    }
    
    // Handle navigation between chips and input
    if (e.key === 'ArrowLeft') {
      if (isPopoverOpen) {
        e.preventDefault();
        setIsPopoverOpen(false);
        resetSelection();
        return;
      }
      
      if (cursorPosition === 0 && value.length > 0) {
        e.preventDefault();
        setChipSelection(value.length - 1);
        setTimeout(() => chipRefs.current[value.length - 1]?.focus(), 0);
        return;
      }
    }

    if (e.key === 'ArrowRight') {
      if (isPopoverOpen) {
        e.preventDefault();
        setIsPopoverOpen(false);
        resetSelection();
        return;
      }
    }

    // Handle backspace when input is empty - remove last person
    if (e.key === 'Backspace' && inputValue === '' && cursorPosition === 0 && value.length > 0) {
      e.preventDefault();
      removePerson(value[value.length - 1]);
      return;
    }

    // Handle suggestion navigation
    handleNavigationKeyDown(e);
  };

  const handleChipKeyDownWrapper = (e: KeyboardEvent<HTMLDivElement>, index: number) => {
    const result = handleChipKeyDown(e, index);
    if (result === 'focusInput') {
      inputRef.current?.focus();
    }
  };

  const handleSuggestionClick = (person: Person) => {
    addPerson(person);
  };

  const getPlaceholder = () => {
    return value.length === 0 ? placeholder : '';
  };

  const chipsContent = value.length > 0 ? (
    <>
      {value.map((person, index) => (
        <PersonChip
          key={person.id}
          person={person}
          isSelected={selectedChipIndex === index}
          onRemove={removePerson}
          onKeyDown={(e) => handleChipKeyDownWrapper(e, index)}
          onFocus={() => setChipSelection(index)}
          chipRef={el => chipRefs.current[index] = el}
        />
      ))}
    </>
  ) : null;

  return (
    <div className={styles.container}>
      <Field required={required}>
        <SuggestionsPopover
          ref={popoverRef}
          isOpen={isPopoverOpen}
          onOpenChange={setIsPopoverOpen}
          suggestions={filteredSuggestions}
          selectedIndex={selectedIndex}
          onSuggestionClick={handleSuggestionClick}
          onSuggestionHover={setSelection}
        >
          <PeoplePickerInput
            ref={inputRef}
            value={inputValue}
            placeholder={getPlaceholder()}
            onValueChange={handleInputChange}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            onKeyDown={handleKeyDown}
            chipsContent={chipsContent}
          />
        </SuggestionsPopover>
      </Field>
    </div>
  );
};

export default PeoplePickerCore;
