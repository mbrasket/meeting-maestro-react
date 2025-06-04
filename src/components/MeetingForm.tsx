
import { useState } from 'react';
import {
  Card,
  makeStyles,
  tokens,
} from '@fluentui/react-components';
import { FormData } from './meeting/types';
import MeetingToolbar from './meeting/MeetingToolbar';
import MeetingDetailsTab from './meeting/MeetingDetailsTab';

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
  content: {
    padding: tokens.spacingVerticalM,
  },
});

const MeetingForm = () => {
  const styles = useStyles();
  const [selectedCategory, setSelectedCategory] = useState('General');
  const [selectedReminder, setSelectedReminder] = useState('15 mins');
  const [formData, setFormData] = useState<FormData>({
    title: '',
    coOrganizers: [],
    participants: [],
    optionalParticipants: [],
    description: '',
    startTime: '',
    endTime: '',
    location: '',
    isRecurring: false,
    isTeamsMeeting: true,
    enableChat: true,
    enableRecording: false,
  });

  const handleInputChange = (field: keyof FormData, value: string | boolean | Person[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCreateMeeting = () => {
    // Convert Person arrays to email strings for backend compatibility
    const meetingData = {
      ...formData,
      coOrganizers: Array.isArray(formData.coOrganizers) ? formData.coOrganizers.map(p => p.email).join(', ') : '',
      participants: Array.isArray(formData.participants) ? formData.participants.map(p => p.email).join(', ') : '',
      optionalParticipants: Array.isArray(formData.optionalParticipants) ? formData.optionalParticipants.map(p => p.email).join(', ') : '',
    };
    
    console.log('Creating meeting with data:', meetingData);
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
        <div className={styles.content}>
          <MeetingDetailsTab formData={formData} onInputChange={handleInputChange} />
        </div>
      </Card>
    </div>
  );
};

export default MeetingForm;
