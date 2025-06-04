
import { useState } from 'react';
import {
  Card,
  CardHeader,
  CardPreview,
  Input,
  Button,
  Switch,
  Tab,
  TabList,
  Avatar,
  Badge,
  Textarea,
  Field,
  Text,
  Title1,
  Subtitle1,
  Body1,
  makeStyles,
  tokens,
} from '@fluentui/react-components';
import { Calendar, Clock, Video, Users, Settings } from '@fluentui/react-icons';

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
  formField: {
    marginBottom: tokens.spacingVerticalM,
  },
  tabContent: {
    paddingTop: tokens.spacingVerticalM,
  },
  participantsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalS,
  },
  participantItem: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalM,
    padding: tokens.spacingVerticalS,
    borderRadius: tokens.borderRadiusMedium,
    backgroundColor: tokens.colorNeutralBackground2,
  },
  buttonGroup: {
    display: 'flex',
    gap: tokens.spacingHorizontalM,
    marginTop: tokens.spacingVerticalL,
  },
});

const MeetingForm = () => {
  const styles = useStyles();
  const [selectedTab, setSelectedTab] = useState('details');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startTime: '',
    endTime: '',
    isRecurring: false,
    allowAnonymous: false,
    enableChat: true,
    enableRecording: false,
  });

  const [participants] = useState([
    { id: 1, name: 'John Doe', email: 'john@company.com', role: 'Presenter' },
    { id: 2, name: 'Jane Smith', email: 'jane@company.com', role: 'Attendee' },
    { id: 3, name: 'Mike Johnson', email: 'mike@company.com', role: 'Attendee' },
  ]);

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCreateMeeting = () => {
    console.log('Creating meeting with data:', formData);
    // Meeting creation logic would go here
  };

  return (
    <div className={styles.container}>
      <Card className={styles.card}>
        <CardHeader
          header={<Title1>Create New Meeting</Title1>}
          description={<Subtitle1>Set up your Microsoft Teams meeting</Subtitle1>}
        />
      </Card>

      <Card className={styles.card}>
        <TabList
          selectedValue={selectedTab}
          onTabSelect={(_, data) => setSelectedTab(data.value as string)}
        >
          <Tab id="details" value="details" icon={<Calendar />}>
            Meeting Details
          </Tab>
          <Tab id="participants" value="participants" icon={<Users />}>
            Participants
          </Tab>
          <Tab id="settings" value="settings" icon={<Settings />}>
            Settings
          </Tab>
        </TabList>

        <div className={styles.tabContent}>
          {selectedTab === 'details' && (
            <div>
              <Field
                label="Meeting Title"
                required
                className={styles.formField}
              >
                <Input
                  value={formData.title}
                  onChange={(_, data) => handleInputChange('title', data.value)}
                  placeholder="Enter meeting title"
                />
              </Field>

              <Field
                label="Description"
                className={styles.formField}
              >
                <Textarea
                  value={formData.description}
                  onChange={(_, data) => handleInputChange('description', data.value)}
                  placeholder="Add meeting description (optional)"
                  rows={3}
                />
              </Field>

              <div style={{ display: 'flex', gap: tokens.spacingHorizontalM }}>
                <Field
                  label="Start Time"
                  required
                  style={{ flex: 1 }}
                >
                  <Input
                    type="datetime-local"
                    value={formData.startTime}
                    onChange={(_, data) => handleInputChange('startTime', data.value)}
                    contentBefore={<Clock />}
                  />
                </Field>

                <Field
                  label="End Time"
                  required
                  style={{ flex: 1 }}
                >
                  <Input
                    type="datetime-local"
                    value={formData.endTime}
                    onChange={(_, data) => handleInputChange('endTime', data.value)}
                    contentBefore={<Clock />}
                  />
                </Field>
              </div>

              <Field className={styles.formField}>
                <Switch
                  checked={formData.isRecurring}
                  onChange={(_, data) => handleInputChange('isRecurring', data.checked)}
                  label="Recurring meeting"
                />
              </Field>
            </div>
          )}

          {selectedTab === 'participants' && (
            <div>
              <Field
                label="Add Participants"
                className={styles.formField}
              >
                <Input
                  placeholder="Enter email addresses separated by commas"
                  contentBefore={<Users />}
                />
              </Field>

              <Body1 style={{ marginBottom: tokens.spacingVerticalM }}>
                Current Participants ({participants.length})
              </Body1>

              <div className={styles.participantsList}>
                {participants.map((participant) => (
                  <div key={participant.id} className={styles.participantItem}>
                    <Avatar
                      name={participant.name}
                      size={32}
                    />
                    <div style={{ flex: 1 }}>
                      <Text weight="semibold">{participant.name}</Text>
                      <br />
                      <Text size={200} style={{ color: tokens.colorNeutralForeground2 }}>
                        {participant.email}
                      </Text>
                    </div>
                    <Badge appearance="outline">
                      {participant.role}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          )}

          {selectedTab === 'settings' && (
            <div>
              <Field className={styles.formField}>
                <Switch
                  checked={formData.allowAnonymous}
                  onChange={(_, data) => handleInputChange('allowAnonymous', data.checked)}
                  label="Allow anonymous participants"
                />
              </Field>

              <Field className={styles.formField}>
                <Switch
                  checked={formData.enableChat}
                  onChange={(_, data) => handleInputChange('enableChat', data.checked)}
                  label="Enable meeting chat"
                />
              </Field>

              <Field className={styles.formField}>
                <Switch
                  checked={formData.enableRecording}
                  onChange={(_, data) => handleInputChange('enableRecording', data.checked)}
                  label="Enable meeting recording"
                />
              </Field>

              <Field
                label="Meeting Link"
                className={styles.formField}
              >
                <Input
                  value="https://teams.microsoft.com/l/meetup-join/..."
                  readOnly
                  contentBefore={<Video />}
                />
              </Field>
            </div>
          )}
        </div>
      </Card>

      <div className={styles.buttonGroup}>
        <Button
          appearance="primary"
          icon={<Video />}
          onClick={handleCreateMeeting}
          size="large"
        >
          Create Meeting
        </Button>
        <Button
          appearance="secondary"
          size="large"
        >
          Save as Template
        </Button>
      </div>
    </div>
  );
};

export default MeetingForm;
