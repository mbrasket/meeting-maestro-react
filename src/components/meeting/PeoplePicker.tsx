
import { Person } from '../../data/sampleData';
import PeoplePickerCore from './people-picker/PeoplePickerCore';

interface PeoplePickerProps {
  value: Person[];
  onChange: (value: Person[]) => void;
  placeholder: string;
  suggestions: Person[];
  onAddToHistory?: (person: Person) => void;
  required?: boolean;
}

const PeoplePicker = (props: PeoplePickerProps) => {
  return <PeoplePickerCore {...props} />;
};

export default PeoplePicker;
