import { useState, useRef, useEffect } from 'react';
import {
  Input,
  Field,
  makeStyles,
  tokens,
} from '@fluentui/react-components';

const useStyles = makeStyles({
  container: {
    position: 'relative',
    flex: 1,
  },
  dropdown: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: tokens.colorNeutralBackground1,
    border: `1px solid ${tokens.colorNeutralStroke1}`,
    borderRadius: tokens.borderRadiusMedium,
    boxShadow: tokens.shadow16,
    maxHeight: '200px',
    overflowY: 'auto',
    zIndex: 1000,
    marginTop: '2px',
  },
  dropdownItem: {
    padding: tokens.spacingVerticalS + ' ' + tokens.spacingHorizontalM,
    cursor: 'pointer',
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
    '&:hover': {
      backgroundColor: tokens.colorNeutralBackground1Hover,
    },
    '&:last-child': {
      borderBottom: 'none',
    },
  },
  selectedItem: {
    backgroundColor: tokens.colorNeutralBackground1Selected,
  },
});

interface AutocompleteInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  suggestions: string[];
  onAddToHistory?: (value: string) => void;
  hint?: string;
}

const AutocompleteInput = ({ 
  value, 
  onChange, 
  placeholder, 
  suggestions,
  onAddToHistory,
  hint 
}: AutocompleteInputProps) => {
  const styles = useStyles();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Filter suggestions based on current input - show all if empty, filter if not
  const filteredSuggestions = value.trim().length === 0 
    ? suggestions 
    : suggestions.filter(suggestion =>
        suggestion.toLowerCase().includes(value.toLowerCase()) && suggestion !== value
      );

  const handleInputChange = (newValue: string) => {
    onChange(newValue);
    setSelectedIndex(-1);
    // Show dropdown if we have suggestions
    setIsOpen(filteredSuggestions.length > 0 || suggestions.length > 0);
  };

  const handleSuggestionClick = (suggestion: string) => {
    onChange(suggestion);
    setIsOpen(false);
    setSelectedIndex(-1);
    if (onAddToHistory) {
      onAddToHistory(suggestion);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (!isOpen) return;

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        setSelectedIndex(prev => 
          prev < filteredSuggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        event.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        event.preventDefault();
        if (selectedIndex >= 0) {
          handleSuggestionClick(filteredSuggestions[selectedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setSelectedIndex(-1);
        break;
    }
  };

  const handleInputFocus = () => {
    // Always show dropdown on focus if we have suggestions
    if (suggestions.length > 0) {
      setIsOpen(true);
    }
  };

  const handleInputBlur = (event: React.FocusEvent) => {
    // Delay closing to allow click on suggestions
    setTimeout(() => {
      if (!containerRef.current?.contains(event.relatedTarget as Node)) {
        setIsOpen(false);
        setSelectedIndex(-1);
      }
    }, 150);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Update filtered suggestions when value or suggestions change
  useEffect(() => {
    const newFilteredSuggestions = value.trim().length === 0 
      ? suggestions 
      : suggestions.filter(suggestion =>
          suggestion.toLowerCase().includes(value.toLowerCase()) && suggestion !== value
        );
    
    if (isOpen && newFilteredSuggestions.length === 0 && suggestions.length > 0) {
      // Keep dropdown open but show "No matches" or all suggestions
      setIsOpen(true);
    }
  }, [value, suggestions, isOpen]);

  return (
    <div className={styles.container} ref={containerRef}>
      <Field style={{ flex: 1 }} hint={hint}>
        <Input
          appearance="underline"
          value={value}
          onChange={(_, data) => handleInputChange(data.value)}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
        />
      </Field>
      
      {isOpen && (
        <div className={styles.dropdown}>
          {filteredSuggestions.length > 0 ? (
            filteredSuggestions.map((suggestion, index) => (
              <div
                key={suggestion}
                className={`${styles.dropdownItem} ${
                  index === selectedIndex ? styles.selectedItem : ''
                }`}
                onClick={() => handleSuggestionClick(suggestion)}
              >
                {suggestion}
              </div>
            ))
          ) : suggestions.length > 0 ? (
            <div className={styles.dropdownItem} style={{ color: tokens.colorNeutralForeground3 }}>
              No matches found
            </div>
          ) : (
            <div className={styles.dropdownItem} style={{ color: tokens.colorNeutralForeground3 }}>
              Start typing to see suggestions
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AutocompleteInput;
