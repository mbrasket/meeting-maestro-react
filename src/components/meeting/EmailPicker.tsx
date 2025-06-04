
import { useState, useCallback } from 'react';
import {
  Combobox,
  Option,
  Tag,
  Field,
  makeStyles,
  tokens,
} from '@fluentui/react-components';
import { Dismiss12Regular } from '@fluentui/react-icons';

const useStyles = makeStyles({
  container: {
    flex: 1,
  },
  tagsContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: tokens.spacingHorizontalXS,
    marginBottom: tokens.spacingVerticalXS,
  },
  tag: {
    maxWidth: '200px',
  },
});

interface EmailPickerProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  suggestions: string[];
  onAddToHistory?: (value: string) => void;
  required?: boolean;
}

const EmailPicker = ({ 
  value, 
  onChange, 
  placeholder, 
  suggestions,
  onAddToHistory,
  required 
}: EmailPickerProps) => {
  const styles = useStyles();
  const [inputValue, setInputValue] = useState('');
  
  // Parse comma-separated emails into array
  const emails = value ? value.split(',').map(e => e.trim()).filter(e => e) : [];
  
  const validateEmail = (email: string) => {
    return email.includes('@') && email.includes('.');
  };

  const addEmail = useCallback((email: string) => {
    if (!email.trim()) return;
    
    const trimmedEmail = email.trim();
    if (!emails.includes(trimmedEmail)) {
      const newEmails = [...emails, trimmedEmail];
      onChange(newEmails.join(', '));
      
      if (validateEmail(trimmedEmail) && onAddToHistory) {
        onAddToHistory(trimmedEmail);
      }
    }
    setInputValue('');
  }, [emails, onChange, onAddToHistory]);

  const removeEmail = useCallback((emailToRemove: string) => {
    const newEmails = emails.filter(email => email !== emailToRemove);
    onChange(newEmails.join(', '));
  }, [emails, onChange]);

  const handleInputChange = (value: string) => {
    setInputValue(value);
    
    // Handle comma-separated input
    if (value.includes(',')) {
      const newEmails = value.split(',').map(e => e.trim()).filter(e => e);
      newEmails.forEach(email => addEmail(email));
      setInputValue('');
      return;
    }
  };

  const handleOptionSelect = (_, data) => {
    if (data.optionValue) {
      addEmail(data.optionValue);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && inputValue.trim()) {
      event.preventDefault();
      addEmail(inputValue);
    }
  };

  const filteredSuggestions = suggestions.filter(suggestion =>
    suggestion.toLowerCase().includes(inputValue.toLowerCase()) && 
    !emails.includes(suggestion)
  );

  return (
    <div className={styles.container}>
      <Field required={required}>
        {emails.length > 0 && (
          <div className={styles.tagsContainer}>
            {emails.map((email, index) => (
              <Tag
                key={index}
                dismissible
                dismissIcon={{ onClick: () => removeEmail(email) }}
                className={styles.tag}
                title={email}
              >
                {email}
              </Tag>
            ))}
          </div>
        )}
        
        <Combobox
          appearance="underline"
          placeholder={placeholder}
          value={inputValue}
          onInput={(e) => handleInputChange(e.target.value)}
          onOptionSelect={handleOptionSelect}
          onKeyDown={handleKeyDown}
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

export default EmailPicker;
