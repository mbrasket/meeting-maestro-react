import { useState, useCallback, useRef, KeyboardEvent } from 'react';
import {
  Input,
  Field,
  Popover,
  PopoverTrigger,
  PopoverSurface,
  makeStyles,
  tokens,
} from '@fluentui/react-components';
import LocationChip from './LocationChip';
import LocationSuggestion from './LocationSuggestion';
import { useEffect } from 'react';

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
  underlineInput: {
    width: '100%',
  },
});

interface LocationPickerCoreProps {
  value: string[];
  onChange: (value: string[]) => void;
  placeholder: string;
  suggestions: string[];
  onAddToHistory?: (value: string) => void;
  hint?: string;
}

const LocationPickerCore = ({ 
  value, 
  onChange, 
  placeholder, 
  suggestions,
  onAddToHistory,
  hint 
}: LocationPickerCoreProps) => {
  const styles = useStyles();
  const [inputValue, setInputValue] = useState('');
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [selectedChipIndex, setSelectedChipIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const chipRefs = useRef<(HTMLDivElement | null)[]>([]);
  const popoverRef = useRef<HTMLDivElement>(null);
  const suggestionRefs = useRef<(HTMLDivElement | null)[]>([]);

  const filteredSuggestions = suggestions.filter(suggestion =>
    suggestion.toLowerCase().includes(inputValue.toLowerCase()) && 
    suggestion !== inputValue &&
    !value.includes(suggestion)
  );

  // Scroll selected item into view
  useEffect(() => {
    if (selectedIndex >= 0 && popoverRef.current && suggestionRefs.current[selectedIndex]) {
      const popover = popoverRef.current;
      const selectedItem = suggestionRefs.current[selectedIndex];
      
      if (selectedItem) {
        const popoverRect = popover.getBoundingClientRect();
        const itemRect = selectedItem.getBoundingClientRect();
        
        if (itemRect.bottom > popoverRect.bottom) {
          // Item is below visible area, scroll down
          popover.scrollTop += itemRect.bottom - popoverRect.bottom;
        } else if (itemRect.top < popoverRect.top) {
          // Item is above visible area, scroll up
          popover.scrollTop -= popoverRect.top - itemRect.top;
        }
      }
    }
  }, [selectedIndex]);

  const addLocation = useCallback((location: string) => {
    const trimmedLocation = location.trim();
    if (trimmedLocation && !value.includes(trimmedLocation)) {
      const newLocations = [...value, trimmedLocation];
      onChange(newLocations);
      
      if (onAddToHistory) {
        onAddToHistory(trimmedLocation);
      }
    }
    setInputValue('');
    setIsPopoverOpen(false);
    setSelectedIndex(-1);
    setSelectedChipIndex(-1);
    // Keep focus on input after adding location
    setTimeout(() => inputRef.current?.focus(), 0);
  }, [value, onChange, onAddToHistory]);

  const removeLocation = useCallback((locationToRemove: string) => {
    const newLocations = value.filter(location => location !== locationToRemove);
    onChange(newLocations);
    setSelectedChipIndex(-1);
  }, [value, onChange]);

  const removeLocationAtIndex = useCallback((index: number) => {
    if (index >= 0 && index < value.length) {
      const newLocations = value.filter((_, i) => i !== index);
      onChange(newLocations);
      
      // Adjust selected chip index after removal
      if (selectedChipIndex === index) {
        // If we removed the selected chip, move selection appropriately
        if (index > 0) {
          setSelectedChipIndex(index - 1);
          setTimeout(() => chipRefs.current[index - 1]?.focus(), 0);
        } else if (newLocations.length > 0) {
          setSelectedChipIndex(0);
          setTimeout(() => chipRefs.current[0]?.focus(), 0);
        } else {
          setSelectedChipIndex(-1);
          setTimeout(() => inputRef.current?.focus(), 0);
        }
      } else if (selectedChipIndex > index) {
        setSelectedChipIndex(selectedChipIndex - 1);
      }
    }
  }, [value, onChange, selectedChipIndex]);

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
    
    // Handle semicolon - convert current input to chip
    if (e.key === ';') {
      e.preventDefault();
      if (inputValue.trim()) {
        addLocation(inputValue);
      }
      return;
    }
    
    // Handle navigation between chips and input
    if (e.key === 'ArrowLeft') {
      if (isPopoverOpen) {
        // Dismiss flyout and don't navigate to chips yet
        e.preventDefault();
        setIsPopoverOpen(false);
        setSelectedIndex(-1);
        return;
      }
      
      if (cursorPosition === 0 && value.length > 0) {
        e.preventDefault();
        setSelectedChipIndex(value.length - 1);
        setTimeout(() => chipRefs.current[value.length - 1]?.focus(), 0);
        return;
      }
    }

    if (e.key === 'ArrowRight') {
      if (isPopoverOpen) {
        // Dismiss flyout
        e.preventDefault();
        setIsPopoverOpen(false);
        setSelectedIndex(-1);
        return;
      }
    }

    // Handle backspace when input is empty - remove last location
    if (e.key === 'Backspace' && inputValue === '' && cursorPosition === 0 && value.length > 0) {
      e.preventDefault();
      removeLocationAtIndex(value.length - 1);
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
          addLocation(filteredSuggestions[selectedIndex]);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setIsPopoverOpen(false);
        setSelectedIndex(-1);
        // Ensure focus stays on the input field
        setTimeout(() => inputRef.current?.focus(), 0);
        break;
    }
  };

  const handleChipKeyDown = (e: KeyboardEvent<HTMLDivElement>, index: number) => {
    switch (e.key) {
      case 'ArrowLeft':
        e.preventDefault();
        if (index > 0) {
          setSelectedChipIndex(index - 1);
          chipRefs.current[index - 1]?.focus();
        }
        break;
      case 'ArrowRight':
        e.preventDefault();
        if (index < value.length - 1) {
          setSelectedChipIndex(index + 1);
          chipRefs.current[index + 1]?.focus();
        } else {
          // Move to input
          setSelectedChipIndex(-1);
          inputRef.current?.focus();
        }
        break;
      case 'Backspace':
        e.preventDefault();
        removeLocationAtIndex(index);
        break;
      case 'Delete':
        e.preventDefault();
        removeLocationAtIndex(index);
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        removeLocation(value[index]);
        break;
    }
  };

  const handleOptionClick = (location: string) => {
    addLocation(location);
  };

  const getPlaceholder = () => {
    if (value.length === 0) {
      return placeholder;
    }
    return '';
  };

  return (
    <div className={styles.container}>
      <Field hint={hint}>
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
                    {value.map((location, index) => (
                      <LocationChip
                        key={`${location}-${index}`}
                        location={location}
                        isSelected={selectedChipIndex === index}
                        onRemove={removeLocation}
                        onKeyDown={(e) => handleChipKeyDown(e, index)}
                        onFocus={() => setSelectedChipIndex(index)}
                        chipRef={el => chipRefs.current[index] = el}
                      />
                    ))}
                  </div>
                )
              }
            />
          </PopoverTrigger>
          
          <PopoverSurface ref={popoverRef} className={styles.popoverSurface}>
            {filteredSuggestions.map((location, index) => (
              <div key={location} ref={el => suggestionRefs.current[index] = el}>
                <LocationSuggestion
                  location={location}
                  isSelected={selectedIndex === index}
                  onClick={handleOptionClick}
                  onMouseEnter={() => setSelectedIndex(index)}
                />
              </div>
            ))}
          </PopoverSurface>
        </Popover>
      </Field>
    </div>
  );
};

export default LocationPickerCore;
