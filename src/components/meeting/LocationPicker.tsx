
import LocationPickerCore from './location-picker/LocationPickerCore';

interface LocationPickerProps {
  value: string[];
  onChange: (value: string[]) => void;
  placeholder: string;
  suggestions: string[];
  onAddToHistory?: (value: string) => void;
  hint?: string;
}

const LocationPicker = (props: LocationPickerProps) => {
  return <LocationPickerCore {...props} />;
};

export default LocationPicker;
