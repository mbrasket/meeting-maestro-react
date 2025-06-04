import {
  Input,
  Switch,
  Field,
  Textarea,
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
  Clock20Regular, 
  People20Regular, 
  DocumentText20Regular,
  PersonAdd20Regular,
  Location20Regular,
  MoreHorizontal20Regular
} from '@fluentui/react-icons';
import { FormData } from './types';
import TeamsSettingsSection from './TeamsSettingsSection';
import EmailPicker from './EmailPicker';
import PeoplePicker from './PeoplePicker';
import EnhancedLocationPicker from './EnhancedLocationPicker';
import { samplePeople, sampleLocations, Person } from '../../data/sampleData';
import useAutocompleteHistory from '../../hooks/useAutocompleteHistory';

const useStyles = makeStyles({
  fieldWithIcon: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalM,
    marginBottom: tokens.spacingVerticalM,
  },
  fieldWithIconAndMenu: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalM,
    marginBottom: tokens.spacingVerticalM,
  },
  fieldContainer: {
    display: 'flex',
    alignItems: 'center',
    flex: 1,
    gap: tokens.spacingHorizontalS,
  },
  timeFieldsContainer: {
    display: 'flex',
    gap: tokens.spacingHorizontalM,
  },
  timeFieldWithIcon: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalM,
    flex: 1,
  },
  descriptionContainer: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: tokens.spacingHorizontalM,
    marginTop: tokens.spacingVerticalL,
    marginBottom: tokens.spacingVerticalM,
  },
  descriptionIcon: {
    marginTop: '8px',
  },
  descriptionField: {
    flex: 1,
  },
  descriptionTextarea: {
    border: `1px solid ${tokens.colorNeutralStroke1}`,
    borderRadius: tokens.borderRadiusMedium,
    padding: tokens.spacingVerticalS,
    '&:focus': {
      borderTopColor: tokens.colorBrandStroke1,
      borderRightColor: tokens.colorBrandStroke1,
      borderBottomColor: tokens.colorBrandStroke1,
      borderLeftColor: tokens.colorBrandStroke1,
      outline: 'none',
    }
  },
  iconContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '20px',
    height: '20px',
    color: tokens.colorNeutralForeground2,
  },
  formField: {
    marginBottom: tokens.spacingVerticalM,
  },
  menuButton: {
    minWidth: 'auto',
    padding: tokens.spacingHorizontalXS,
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
      <div className={styles.fieldWithIcon}>
        <div className={styles.iconContainer}>
          <DocumentText20Regular />
        </div>
        <Field required style={{ flex: 1 }}>
          <Input
            appearance="underline"
            value={formData.title}
            onChange={(_, data) => onInputChange('title', data.value)}
            placeholder="Enter meeting title"
          />
        </Field>
      </div>

      {/* Co-organizers with PeoplePicker */}
      <div className={styles.fieldWithIcon}>
        <div className={styles.iconContainer}>
          <PersonAdd20Regular />
        </div>
        <PeoplePicker
          value={formData.coOrganizers}
          onChange={(people) => handlePersonChange('coOrganizers', people)}
          placeholder="Search for co-organizers"
          suggestions={samplePeople}
          onAddToHistory={handleAddPersonToHistory}
        />
      </div>

      {/* Participants with style menu and PeoplePicker */}
      <div className={styles.fieldWithIconAndMenu}>
        <div className={styles.iconContainer}>
          <People20Regular />
        </div>
        <div className={styles.fieldContainer}>
          <PeoplePicker
            value={formData.participants}
            onChange={(people) => handlePersonChange('participants', people)}
            placeholder="Search for participants"
            suggestions={samplePeople}
            onAddToHistory={handleAddPersonToHistory}
            required
          />
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
        </div>
      </div>

      {/* Optional Participants with PeoplePicker */}
      <div className={styles.fieldWithIcon}>
        <div className={styles.iconContainer}>
          <People20Regular />
        </div>
        <PeoplePicker
          value={formData.optionalParticipants}
          onChange={(people) => handlePersonChange('optionalParticipants', people)}
          placeholder="Search for optional participants"
          suggestions={samplePeople}
          onAddToHistory={handleAddPersonToHistory}
        />
      </div>

      {/* Start Time + End Time */}
      <div className={styles.timeFieldsContainer}>
        <div className={styles.timeFieldWithIcon}>
          <div className={styles.iconContainer}>
            <Clock20Regular />
          </div>
          <Field required style={{ flex: 1 }}>
            <Input
              appearance="underline"
              type="datetime-local"
              value={formData.startTime}
              onChange={(_, data) => onInputChange('startTime', data.value)}
            />
          </Field>
        </div>

        <div className={styles.timeFieldWithIcon}>
          <div className={styles.iconContainer}>
            <Clock20Regular />
          </div>
          <Field required style={{ flex: 1 }}>
            <Input
              appearance="underline"
              type="datetime-local"
              value={formData.endTime}
              onChange={(_, data) => onInputChange('endTime', data.value)}
            />
          </Field>
        </div>
      </div>

      {/* Location with menu and LocationPicker */}
      <div className={styles.fieldWithIconAndMenu}>
        <div className={styles.iconContainer}>
          <Location20Regular />
        </div>
        <div className={styles.fieldContainer}>
          <LocationPicker
            value={locationValue}
            onChange={handleLocationChange}
            placeholder="Search for meeting room or location"
            suggestions={locationSuggestions}
            onAddToHistory={handleAddLocationToHistory}
          />
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
        </div>
      </div>

      {/* Description */}
      <div className={styles.descriptionContainer}>
        <div className={`${styles.iconContainer} ${styles.descriptionIcon}`}>
          <DocumentText20Regular />
        </div>
        <Field className={styles.descriptionField}>
          <Textarea
            className={styles.descriptionTextarea}
            value={formData.description}
            onChange={(_, data) => onInputChange('description', data.value)}
            placeholder="Add meeting description (optional)"
            rows={3}
          />
        </Field>
      </div>

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
