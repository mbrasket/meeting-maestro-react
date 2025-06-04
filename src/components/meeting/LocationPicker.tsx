
import { useState, useCallback } from 'react';
import {
  Combobox,
  Option,
  Field,
  makeStyles,
  tokens,
} from '@fluentui/react-components';

const useStyles = makeStyles({
  container: {
    flex: 1,
  },
});

interface LocationPickerProps {
  value: string;
  onChange: (value: string) => void;
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
  const [inputValue, setInputValue] = useState(value);

  const handleInputChange = (newValue: string) => {
    setInputValue(newValue);
    onChange(newValue);
  };

  const handleOptionSelect = (_, data) => {
    if (data.optionValue) {
      const selectedValue = data.optionValue;
      setInputValue(selectedValue);
      onChange(selectedValue);
      
      if (onAddToHistory) {
        onAddToHistory(selectedValue);
      }
    }
  };

  const handleBlur = () => {
    if (inputValue.trim() && onAddToHistory) {
      onAddToHistory(inputValue.trim());
    }
  };

  const filteredSuggestions = inputValue.trim().length === 0 
    ? suggestions 
    : suggestions.filter(suggestion =>
        suggestion.toLowerCase().includes(inputValue.toLowerCase()) && suggestion !== inputValue
      );

  return (
    <div className={styles.container}>
      <Field hint={hint}>
        <Combobox
          appearance="underline"
          placeholder={placeholder}
          value={inputValue}
          onInput={(e) => handleInputChange((e.target as HTMLInputElement).value)}
          onOptionSelect={handleOptionSelect}
          onBlur={handleBlur}
        >
          {filteredSuggestions.map((suggestion) => (
            <Option key={suggestion} value={suggestion}>
              {suggestion}
            </Option>
          ))}
        </Combobox>
      </Field>
    </div>
  );
};

export default LocationPicker;
