
import {
  Input,
  Switch,
  Field,
  MenuButton,
  Menu,
  MenuTrigger,
  MenuPopover,
  MenuList,
  MenuItem,
  makeStyles,
  tokens,
} from '@fluentui/react-components';
import { 
  People20Regular, 
  DocumentText20Regular,
  PersonAdd20Regular,
  Location20Regular,
  MoreHorizontal20Regular
} from '@fluentui/react-icons';
import { FormData } from './types';
import TeamsSettingsSection from './TeamsSettingsSection';
import PeoplePicker from './PeoplePicker';
import LocationPicker from './LocationPicker';
import { samplePeople, sampleLocations, Person } from '../../data/sampleData';
import useAutocompleteHistory from '../../hooks/useAutocompleteHistory';
import MeetingFieldWithIcon from './meeting-details/MeetingFieldWithIcon';
import MeetingFieldWithIconAndMenu from './meeting-details/MeetingFieldWithIconAndMenu';
import MeetingTimeFields from './meeting-details/MeetingTimeFields';
import MeetingDescriptionField from './meeting-details/MeetingDescriptionField';

const useStyles = makeStyles({
  formField: {
    marginBottom: '16px',
  },
  menuButton: {
    minWidth: 'auto',
    padding: tokens.spacingHorizontalXS,
  },
  inputField: {
    flex: 1,
    height: '32px',
    '& input': {
      height: '32px',
      cursor: 'default',
      transition: 'border-color 0.1s ease',
      '&:hover': {
        borderBottomColor: tokens.colorBrandStroke1,
      },
    },
  },
});

interface MeetingDetailsTabProps {
  formData: FormData;
  onInputChange: (field: keyof FormData, value: string | boolean | Person[] | string[]) => void;
}

const MeetingDetailsTab = ({ formData, onInputChange }: MeetingDetailsTabProps) => {
  const styles = useStyles();
  const { emailHistory, locationHistory, addEmail, addLocation } = useAutocompleteHistory();

  const handlePersonChange = (field: 'coOrganizers' | 'participants' | 'optionalParticipants', people: Person[]) => {
    onInputChange(field, people);
  };

  const handleAddPersonToHistory = (person: Person) => {
    addEmail(person.email);
  };

  const handleLocationChange = (locations: string[]) => {
    onInputChange('location', locations);
  };

  const handleAddLocationToHistory = (location: string) => {
    addLocation(location);
  };

  // Convert location string to array for the picker, handling both string and array values
  const locationValue = Array.isArray(formData.location) 
    ? formData.location 
    : formData.location ? [formData.location] : [];

  // Combine suggestions from sample data and history
  const locationSuggestions = [...new Set([...locationHistory, ...sampleLocations.map(l => l.name)])];

  return (
    <div>
      {/* Meeting Title */}
      <MeetingFieldWithIcon icon={<DocumentText20Regular />}>
        <Field required className={styles.inputField}>
          <Input
            appearance="underline"
            value={formData.title}
            onChange={(_, data) => onInputChange('title', data.value)}
            placeholder="Enter meeting title"
          />
        </Field>
      </MeetingFieldWithIcon>

      {/* Co-organizers with PeoplePicker */}
      <MeetingFieldWithIcon icon={<PersonAdd20Regular />}>
        <PeoplePicker
          value={formData.coOrganizers}
          onChange={(people) => handlePersonChange('coOrganizers', people)}
          placeholder="Search for co-organizers"
          suggestions={samplePeople}
          onAddToHistory={handleAddPersonToHistory}
        />
      </MeetingFieldWithIcon>

      {/* Participants with style menu and PeoplePicker */}
      <MeetingFieldWithIconAndMenu 
        icon={<People20Regular />}
        menu={
          <Menu>
            <MenuTrigger disableButtonEnhancement>
              <MenuButton
                appearance="subtle"
                icon={<MoreHorizontal20Regular />}
                className={styles.menuButton}
              />
            </MenuTrigger>
            <MenuPopover>
              <MenuList>
                <MenuItem>Format as list</MenuItem>
                <MenuItem>Format as table</MenuItem>
                <MenuItem>Import from contacts</MenuItem>
              </MenuList>
            </MenuPopover>
          </Menu>
        }
      >
        <PeoplePicker
          value={formData.participants}
          onChange={(people) => handlePersonChange('participants', people)}
          placeholder="Search for participants"
          suggestions={samplePeople}
          onAddToHistory={handleAddPersonToHistory}
          required
        />
      </MeetingFieldWithIconAndMenu>

      {/* Optional Participants with PeoplePicker */}
      <MeetingFieldWithIcon icon={<People20Regular />}>
        <PeoplePicker
          value={formData.optionalParticipants}
          onChange={(people) => handlePersonChange('optionalParticipants', people)}
          placeholder="Search for optional participants"
          suggestions={samplePeople}
          onAddToHistory={handleAddPersonToHistory}
        />
      </MeetingFieldWithIcon>

      {/* Start Time + End Time */}
      <MeetingTimeFields formData={formData} onInputChange={onInputChange} />

      {/* Location with menu and LocationPicker */}
      <MeetingFieldWithIconAndMenu 
        icon={<Location20Regular />}
        menu={
          <Menu>
            <MenuTrigger disableButtonEnhancement>
              <MenuButton
                appearance="subtle"
                icon={<MoreHorizontal20Regular />}
                className={styles.menuButton}
              />
            </MenuTrigger>
            <MenuPopover>
              <MenuList>
                <MenuItem>Browse meeting rooms</MenuItem>
                <MenuItem>Add online meeting link</MenuItem>
                <MenuItem>Get directions</MenuItem>
              </MenuList>
            </MenuPopover>
          </Menu>
        }
      >
        <LocationPicker
          value={locationValue}
          onChange={handleLocationChange}
          placeholder="Search for meeting room or location"
          suggestions={locationSuggestions}
          onAddToHistory={handleAddLocationToHistory}
        />
      </MeetingFieldWithIconAndMenu>

      {/* Description */}
      <MeetingDescriptionField formData={formData} onInputChange={onInputChange} />

      {/* Teams Meeting Options */}
      <TeamsSettingsSection formData={formData} onInputChange={onInputChange} />

      <Field className={styles.formField}>
        <Switch
          checked={formData.isRecurring}
          onChange={(_, data) => onInputChange('isRecurring', data.checked)}
          label="Recurring meeting"
        />
      </Field>
    </div>
  );
};

export default MeetingDetailsTab;
