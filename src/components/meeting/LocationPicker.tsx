import { useState, useCallback, useRef, KeyboardEvent } from 'react';
import {
  Input,
  Field,
  Popover,
  PopoverTrigger,
  PopoverSurface,
  makeStyles,
  tokens,
  Text,
} from '@fluentui/react-components';
import { Dismiss12Regular } from '@fluentui/react-icons';

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
  locationChip: {
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
  underlineInput: {
    width: '100%',
    '& input': {
      paddingLeft: 0,
    },
  },
});

interface LocationPickerProps {
  value: string[];
  onChange: (value: string[]) => void;
  placeholder: string;
  suggestions: string[];
  onAddToHistory?: (value: string) => void;
  hint?: string;
}

const LocationPicker = ({ 
  value, 
  onChange, 
  placeholder, 
  suggestions,
  onAddToHistory,
  hint 
}: LocationPickerProps) => {
  const styles = useStyles();
  const [inputValue, setInputValue] = useState('');
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [selectedChipIndex, setSelectedChipIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const chipRefs = useRef<(HTMLDivElement | null)[]>([]);

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

  const filteredSuggestions = suggestions.filter(suggestion =>
    suggestion.toLowerCase().includes(inputValue.toLowerCase()) && 
    suggestion !== inputValue &&
    !value.includes(suggestion)
  );

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
                      <div 
                        key={`${location}-${index}`}
                        ref={el => chipRefs.current[index] = el}
                        className={`${styles.locationChip} ${selectedChipIndex === index ? styles.selectedChip : ''}`}
                        tabIndex={0}
                        onKeyDown={(e) => handleChipKeyDown(e, index)}
                        onFocus={() => setSelectedChipIndex(index)}
                        data-chip
                      >
                        <Text size={200} truncate title={location}>
                          {location}
                        </Text>
                        <button
                          className={styles.dismissButton}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            removeLocation(location);
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              e.stopPropagation();
                              removeLocation(location);
                            }
                          }}
                          aria-label={`Remove ${location}`}
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
            {filteredSuggestions.map((location, index) => (
              <div
                key={location}
                className={styles.optionItem}
                onClick={() => handleOptionClick(location)}
                onMouseEnter={() => setSelectedIndex(index)}
                data-suggestion-option
                style={{
                  backgroundColor: selectedIndex === index ? tokens.colorNeutralBackground2 : 'transparent'
                }}
              >
                <Text weight="semibold">{location}</Text>
              </div>
            ))}
          </PopoverSurface>
        </Popover>
      </Field>
    </div>
  );
};

export default LocationPicker;
