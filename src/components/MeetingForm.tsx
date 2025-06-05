
import { useState } from 'react';
import {
  Card,
  makeStyles,
  tokens,
} from '@fluentui/react-components';
import { FormData, RecurringPattern, OneOffInstance } from './meeting/types';
import { Person } from '../data/sampleData';
import MeetingToolbar from './meeting/MeetingToolbar';
import MeetingDetailsTab from './meeting/MeetingDetailsTab';
import MeetingSeriesPanel from './meeting/MeetingSeriesPanel';

const useStyles = makeStyles({
  container: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: tokens.spacingVerticalM,
    paddingTop: '80px', // Add space for fixed toolbar
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

// Helper function to get the next whole half hour
const getNextHalfHour = () => {
  const now = new Date();
  const minutes = now.getMinutes() <= 30 ? 30 : 0;
  if (minutes === 0) {
    now.setHours(now.getHours() + 1);
  }
  now.setMinutes(minutes);
  
  let hours = now.getHours();
  const period = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12;
  
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${period}`;
};

// Helper function to add 30 minutes to a time
const addThirtyMinutes = (timeStr: string) => {
  const match = timeStr.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) return timeStr;
  
  let hours = parseInt(match[1], 10);
  let minutes = parseInt(match[2], 10);
  const period = match[3].toUpperCase();
  
  minutes += 30;
  if (minutes >= 60) {
    minutes -= 60;
    hours += 1;
    if (hours > 12) {
      hours = 1;
    }
  }
  
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${period}`;
};

const MeetingForm = () => {
  const styles = useStyles();
  const [selectedCategory, setSelectedCategory] = useState('General');
  const [selectedReminder, setSelectedReminder] = useState('15 mins');
  
  // Get default values
  const today = new Date().toISOString().split('T')[0];
  const defaultStartTime = getNextHalfHour();
  const defaultEndTime = addThirtyMinutes(defaultStartTime);
  
  const [formData, setFormData] = useState<FormData>({
    title: '',
    coOrganizers: [],
    participants: [],
    optionalParticipants: [],
    description: '',
    startTime: defaultStartTime,
    endTime: defaultEndTime,
    startDate: today,
    location: [],
    isRecurring: false,
    recurringPattern: {
      weekdays: [false, false, false, false, false, false, false],
      startTime: '',
      endTime: '',
    },
    oneOffInstances: [],
  });

  const handleInputChange = (field: keyof FormData, value: string | boolean | Person[] | string[] | RecurringPattern | OneOffInstance[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCreateMeeting = () => {
    // Convert Person arrays to email strings and location array to string for backend compatibility
    const meetingData = {
      ...formData,
      coOrganizers: Array.isArray(formData.coOrganizers) ? formData.coOrganizers.map(p => p.email).join(', ') : '',
      participants: Array.isArray(formData.participants) ? formData.participants.map(p => p.email).join(', ') : '',
      optionalParticipants: Array.isArray(formData.optionalParticipants) ? formData.optionalParticipants.map(p => p.email).join(', ') : '',
      location: Array.isArray(formData.location) ? formData.location.join(', ') : formData.location,
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

      {formData.isRecurring && (
        <Card className={styles.card}>
          <div className={styles.content}>
            <MeetingSeriesPanel formData={formData} onInputChange={handleInputChange} />
          </div>
        </Card>
      )}
    </div>
  );
};

export default MeetingForm;
