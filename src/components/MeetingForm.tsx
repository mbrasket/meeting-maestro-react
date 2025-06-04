
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
import { 
  Tag, 
  Bell, 
  MoreHorizontal, 
  Send, 
  Trash2 
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const useStyles = makeStyles({
  container: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: tokens.spacingVerticalL,
    backgroundColor: tokens.colorNeutralBackground1,
    minHeight: '100vh',
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100vw',
    marginLeft: 'calc(-50vw + 50%)',
    padding: `${tokens.spacingVerticalM} ${tokens.spacingHorizontalXL}`,
    backgroundColor: tokens.colorNeutralBackground2,
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
    marginBottom: tokens.spacingVerticalL,
  },
  toolbarLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalM,
  },
  toolbarRight: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalS,
  },
  dropdownTrigger: {
    border: 'none',
    background: 'transparent',
    padding: tokens.spacingVerticalS,
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalXS,
    cursor: 'pointer',
    borderRadius: tokens.borderRadiusSmall,
    '&:hover': {
      backgroundColor: tokens.colorNeutralBackground1Hover,
    }
  },
  card: {
    marginBottom: tokens.spacingVerticalM,
  },
  formField: {
    marginBottom: tokens.spacingVerticalM,
  },
  fieldWithIcon: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalM,
    marginBottom: tokens.spacingVerticalM,
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

interface FormData {
  title: string;
  coOrganizers: string;
  participants: string;
  optionalParticipants: string;
  description: string;
  startTime: string;
  endTime: string;
  isRecurring: boolean;
  isTeamsMeeting: boolean;
  allowAnonymous: boolean;
  enableChat: boolean;
  enableRecording: boolean;
  lobbyBypass: string;
}

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

  const categories = ['General', 'Team Meeting', 'Client Call', 'Review', 'Training'];
  const reminders = ['15 mins', '30 mins', '1 hour', '2 hours', '1 day'];

  return (
    <div className={styles.container}>
      {/* Full-width Toolbar */}
      <div className={styles.toolbar}>
        <div className={styles.toolbarLeft}>
          <Button
            appearance="primary"
            icon={<Send size={16} />}
            onClick={handleSend}
          >
            Send
          </Button>
          <Button
            appearance="subtle"
            icon={<Trash2 size={16} />}
            onClick={handleDelete}
          >
            Delete
          </Button>
        </div>

        <div className={styles.toolbarRight}>
          {/* Meeting Categories Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className={styles.dropdownTrigger}>
                <Tag size={16} />
                <span>{selectedCategory}</span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="z-50 bg-white border shadow-lg">
              {categories.map((category) => (
                <DropdownMenuItem
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Meeting Reminders Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className={styles.dropdownTrigger}>
                <Bell size={16} />
                <span>{selectedReminder}</span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="z-50 bg-white border shadow-lg">
              {reminders.map((reminder) => (
                <DropdownMenuItem
                  key={reminder}
                  onClick={() => setSelectedReminder(reminder)}
                >
                  {reminder}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* More Options Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className={styles.dropdownTrigger}>
                <MoreHorizontal size={16} />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="z-50 bg-white border shadow-lg">
              <DropdownMenuItem>Save as Template</DropdownMenuItem>
              <DropdownMenuItem>Copy Meeting Link</DropdownMenuItem>
              <DropdownMenuItem>Export to Calendar</DropdownMenuItem>
              <DropdownMenuItem>Meeting Settings</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

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
              <div className={styles.fieldWithIcon}>
                <div className={styles.iconContainer}>
                  <DocumentText20Regular />
                </div>
                <Field required style={{ flex: 1 }}>
                  <Input
                    appearance="underline"
                    value={formData.title}
                    onChange={(_, data) => handleInputChange('title', data.value)}
                    placeholder="Enter meeting title"
                  />
                </Field>
              </div>

              {/* Co-organizers */}
              <div className={styles.fieldWithIcon}>
                <div className={styles.iconContainer}>
                  <PersonAdd20Regular />
                </div>
                <Field style={{ flex: 1 }}>
                  <Input
                    appearance="underline"
                    value={formData.coOrganizers}
                    onChange={(_, data) => handleInputChange('coOrganizers', data.value)}
                    placeholder="Enter co-organizer email addresses separated by commas"
                  />
                </Field>
              </div>

              {/* Participants */}
              <div className={styles.fieldWithIcon}>
                <div className={styles.iconContainer}>
                  <People20Regular />
                </div>
                <Field style={{ flex: 1 }}>
                  <Input
                    appearance="underline"
                    value={formData.participants}
                    onChange={(_, data) => handleInputChange('participants', data.value)}
                    placeholder="Enter participant email addresses separated by commas"
                  />
                </Field>
              </div>

              {/* Optional Participants */}
              <div className={styles.fieldWithIcon}>
                <div className={styles.iconContainer}>
                  <People20Regular />
                </div>
                <Field style={{ flex: 1 }}>
                  <Input
                    appearance="underline"
                    value={formData.optionalParticipants}
                    onChange={(_, data) => handleInputChange('optionalParticipants', data.value)}
                    placeholder="Enter optional participant email addresses separated by commas"
                  />
                </Field>
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
                      onChange={(_, data) => handleInputChange('startTime', data.value)}
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
                      onChange={(_, data) => handleInputChange('endTime', data.value)}
                    />
                  </Field>
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
                    onChange={(_, data) => handleInputChange('description', data.value)}
                    placeholder="Add meeting description (optional)"
                    rows={3}
                  />
                </Field>
              </div>

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
    </div>
  );
};

export default MeetingForm;
