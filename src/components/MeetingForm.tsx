
import { useState } from 'react';
import {
  Card,
  Tab,
  TabList,
  makeStyles,
  tokens,
} from '@fluentui/react-components';
import { 
  CalendarLtr20Regular, 
  Settings20Regular,
} from '@fluentui/react-icons';
import { FormData } from './meeting/types';
import MeetingToolbar from './meeting/MeetingToolbar';
import MeetingDetailsTab from './meeting/MeetingDetailsTab';
import MeetingSettingsTab from './meeting/MeetingSettingsTab';

const useStyles = makeStyles({
  container: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: tokens.spacingVerticalL,
    backgroundColor: tokens.colorNeutralBackground1,
    minHeight: '100vh',
  },
  card: {
    marginBottom: tokens.spacingVerticalM,
  },
  tabContent: {
    paddingTop: tokens.spacingVerticalM,
  },
});

const MeetingForm = () => {
  const styles = useStyles();
  const [selectedTab, setSelectedTab] = useState('details');
  const [selectedCategory, setSelectedCategory] = useState('General');
  const [selectedReminder, setSelectedReminder] = useState('15 mins');
  const [formData, setFormData] = useState<FormData>({
    title: '',
    coOrganizers: '',
    participants: '',
    optionalParticipants: '',
    description: '',
    startTime: '',
    endTime: '',
    location: '',
    isRecurring: false,
    isTeamsMeeting: true,
    allowAnonymous: false,
    enableChat: true,
    enableRecording: false,
    lobbyBypass: 'everyone',
  });

  const handleInputChange = (field: keyof FormData, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCreateMeeting = () => {
    console.log('Creating meeting with data:', formData);
    // Meeting creation logic would go here
  };

  const handleSend = () => {
    console.log('Sending meeting...');
    handleCreateMeeting();
  };

  const handleDelete = () => {
    console.log('Deleting meeting...');
  };

  return (
    <div className={styles.container}>
      <MeetingToolbar
        selectedCategory={selectedCategory}
        selectedReminder={selectedReminder}
        onCategoryChange={setSelectedCategory}
        onReminderChange={setSelectedReminder}
        onSend={handleSend}
        onDelete={handleDelete}
      />

      <Card className={styles.card}>
        <TabList
          selectedValue={selectedTab}
          onTabSelect={(_, data) => setSelectedTab(data.value as string)}
        >
          <Tab id="details" value="details" icon={<CalendarLtr20Regular />}>
            Meeting Details
          </Tab>
          <Tab id="settings" value="settings" icon={<Settings20Regular />}>
            Advanced Settings
          </Tab>
        </TabList>

        <div className={styles.tabContent}>
          {selectedTab === 'details' && (
            <MeetingDetailsTab formData={formData} onInputChange={handleInputChange} />
          )}

          {selectedTab === 'settings' && (
            <MeetingSettingsTab formData={formData} onInputChange={handleInputChange} />
          )}
        </div>
      </Card>
    </div>
  );
};

export default MeetingForm;
