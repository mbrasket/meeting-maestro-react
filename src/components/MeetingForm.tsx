import { useState } from 'react';
import {
  Card,
  CardHeader,
  Input,
  Button,
  Switch,
  Tab,
  TabList,
  Textarea,
  Field,
  Title1,
  Subtitle1,
  Body1,
  makeStyles,
  tokens,
} from '@fluentui/react-components';
import { 
  CalendarLtr20Regular, 
  Clock20Regular, 
  Video20Regular, 
  People20Regular, 
  Settings20Regular,
  DocumentText20Regular,
  PersonAdd20Regular
} from '@fluentui/react-icons';

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
  buttonGroup: {
    display: 'flex',
    gap: tokens.spacingHorizontalM,
    marginTop: tokens.spacingVerticalL,
  },
  teamsSection: {
    marginTop: tokens.spacingVerticalL,
    padding: tokens.spacingVerticalM,
    borderRadius: tokens.borderRadiusMedium,
    backgroundColor: tokens.colorNeutralBackground2,
  },
});

const MeetingForm = () => {
  const styles = useStyles();
  const [selectedTab, setSelectedTab] = useState('details');
  const [formData, setFormData] = useState({
    title: '',
    coOrganizers: '',
    participants: '',
    optionalParticipants: '',
    description: '',
    startTime: '',
    endTime: '',
    isRecurring: false,
    isTeamsMeeting: true,
    allowAnonymous: false,
    enableChat: true,
    enableRecording: false,
    lobbyBypass: 'everyone',
  });

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
          <Tab id="details" value="details" icon={<CalendarLtr20Regular />}>
            Meeting Details
          </Tab>
          <Tab id="settings" value="settings" icon={<Settings20Regular />}>
            Advanced Settings
          </Tab>
        </TabList>

        <div className={styles.tabContent}>
          {selectedTab === 'details' && (
            <div>
              {/* Meeting Title */}
              <Field
                required
                className={styles.formField}
              >
                <Input
                  value={formData.title}
                  onChange={(_, data) => handleInputChange('title', data.value)}
                  placeholder="Enter meeting title"
                  contentBefore={<DocumentText20Regular />}
                />
              </Field>

              {/* Co-organizers */}
              <Field
                className={styles.formField}
              >
                <Input
                  value={formData.coOrganizers}
                  onChange={(_, data) => handleInputChange('coOrganizers', data.value)}
                  placeholder="Enter co-organizer email addresses separated by commas"
                  contentBefore={<PersonAdd20Regular />}
                />
              </Field>

              {/* Participants */}
              <Field
                className={styles.formField}
              >
                <Input
                  value={formData.participants}
                  onChange={(_, data) => handleInputChange('participants', data.value)}
                  placeholder="Enter participant email addresses separated by commas"
                  contentBefore={<People20Regular />}
                />
              </Field>

              {/* Optional Participants */}
              <Field
                className={styles.formField}
              >
                <Input
                  value={formData.optionalParticipants}
                  onChange={(_, data) => handleInputChange('optionalParticipants', data.value)}
                  placeholder="Enter optional participant email addresses separated by commas"
                  contentBefore={<People20Regular />}
                />
              </Field>

              {/* Start Time + End Time */}
              <div style={{ display: 'flex', gap: tokens.spacingHorizontalM }}>
                <Field
                  required
                  style={{ flex: 1 }}
                >
                  <Input
                    type="datetime-local"
                    value={formData.startTime}
                    onChange={(_, data) => handleInputChange('startTime', data.value)}
                    contentBefore={<Clock20Regular />}
                  />
                </Field>

                <Field
                  required
                  style={{ flex: 1 }}
                >
                  <Input
                    type="datetime-local"
                    value={formData.endTime}
                    onChange={(_, data) => handleInputChange('endTime', data.value)}
                    contentBefore={<Clock20Regular />}
                  />
                </Field>
              </div>

              {/* Description */}
              <Field
                className={styles.formField}
              >
                <Textarea
                  value={formData.description}
                  onChange={(_, data) => handleInputChange('description', data.value)}
                  placeholder="Add meeting description (optional)"
                  rows={3}
                />
              </Field>

              {/* Teams Meeting Options */}
              <div className={styles.teamsSection}>
                <Field className={styles.formField}>
                  <Switch
                    checked={formData.isTeamsMeeting}
                    onChange={(_, data) => handleInputChange('isTeamsMeeting', data.checked)}
                    label="Teams Meeting"
                  />
                </Field>

                {formData.isTeamsMeeting && (
                  <>
                    <Field
                      label="Meeting Link"
                      className={styles.formField}
                    >
                      <Input
                        value="https://teams.microsoft.com/l/meetup-join/..."
                        readOnly
                        contentBefore={<Video20Regular />}
                      />
                    </Field>

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
                  </>
                )}
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

          {selectedTab === 'settings' && (
            <div>
              <Body1 style={{ marginBottom: tokens.spacingVerticalM }}>
                Advanced meeting settings and configurations
              </Body1>
              
              <Field
                label="Lobby Bypass"
                className={styles.formField}
              >
                <Input
                  value={formData.lobbyBypass}
                  onChange={(_, data) => handleInputChange('lobbyBypass', data.value)}
                  placeholder="Who can bypass the lobby"
                />
              </Field>

              <Field className={styles.formField}>
                <Switch
                  checked={formData.allowAnonymous}
                  onChange={(_, data) => handleInputChange('allowAnonymous', data.checked)}
                  label="Advanced recording options"
                />
              </Field>
            </div>
          )}
        </div>
      </Card>

      <div className={styles.buttonGroup}>
        <Button
          appearance="primary"
          icon={<Video20Regular />}
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
