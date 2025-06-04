
import { useState, useCallback } from 'react';
import {
  Combobox,
  Option,
  Field,
  makeStyles,
  tokens,
  Text,
} from '@fluentui/react-components';
import { 
  Building20Regular, 
  VideoChat20Regular, 
  LocationLive20Regular,
  Globe20Regular 
} from '@fluentui/react-icons';
import { Location } from '../../data/sampleData';

const useStyles = makeStyles({
  container: {
    flex: 1,
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
  iconContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '20px',
    height: '20px',
    color: tokens.colorNeutralForeground2,
  },
});

interface EnhancedLocationPickerProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  suggestions: Location[];
  onAddToHistory?: (value: string) => void;
  hint?: string;
}

const getLocationIcon = (type: Location['type']) => {
  switch (type) {
    case 'room':
      return <Building20Regular />;
    case 'online':
      return <VideoChat20Regular />;
    case 'building':
      return <LocationLive20Regular />;
    case 'external':
      return <Globe20Regular />;
    default:
      return <LocationLive20Regular />;
  }
};

const getLocationTypeLabel = (type: Location['type']) => {
  switch (type) {
    case 'room':
      return 'Meeting Room';
    case 'online':
      return 'Online Meeting';
    case 'building':
      return 'Building Location';
    case 'external':
      return 'External Location';
    default:
      return 'Location';
  }
};

const EnhancedLocationPicker = ({ 
  value, 
  onChange, 
  placeholder, 
  suggestions,
  onAddToHistory,
  hint 
}: EnhancedLocationPickerProps) => {
  const styles = useStyles();
  const [inputValue, setInputValue] = useState(value);

  const handleInputChange = (newValue: string) => {
    setInputValue(newValue);
    onChange(newValue);
  };

  const handleOptionSelect = (_, data) => {
    if (data.optionValue) {
      const selectedLocation = suggestions.find(l => l.id === data.optionValue);
      if (selectedLocation) {
        setInputValue(selectedLocation.name);
        onChange(selectedLocation.name);
        
        if (onAddToHistory) {
          onAddToHistory(selectedLocation.name);
        }
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
        suggestion.name.toLowerCase().includes(inputValue.toLowerCase()) && 
        suggestion.name !== inputValue
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
          {filteredSuggestions.map((location) => (
            <Option key={location.id} value={location.id} text={location.name}>
              <div className={styles.optionContent}>
                <div className={styles.iconContainer}>
                  {getLocationIcon(location.type)}
                </div>
                <div className={styles.optionDetails}>
                  <Text weight="semibold">{location.name}</Text>
                  <Text className={styles.optionSecondaryText}>
                    {getLocationTypeLabel(location.type)}
                    {location.capacity && ` • Capacity: ${location.capacity}`}
                  </Text>
                  {location.address && (
                    <Text className={styles.optionSecondaryText} size={100}>
                      {location.address}
                    </Text>
                  )}
                  {location.equipment && location.equipment.length > 0 && (
                    <Text className={styles.optionSecondaryText} size={100}>
                      Equipment: {location.equipment.join(', ')}
                    </Text>
                  )}
                </div>
              </div>
            </Option>
          ))}
        </Combobox>
      </Field>
    </div>
  );
};

export default EnhancedLocationPicker;
