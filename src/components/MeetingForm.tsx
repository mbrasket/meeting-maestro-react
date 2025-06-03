
import React, { useState } from 'react';
import {
  Card,
  CardHeader,
  CardPreview,
  Text,
  Input,
  Label,
  Button,
  Textarea,
  Switch,
  Combobox,
  Option,
  Field,
  Avatar,
  Badge,
  Divider,
  TabList,
  Tab,
  TabValue,
} from '@fluentui/react-components';
import {
  CalendarLtr24Regular,
  Clock24Regular,
  Location24Regular,
  Video24Regular,
  People24Regular,
  Add24Regular,
  Dismiss24Regular,
  Send24Regular,
} from '@fluentui/react-icons';

interface Attendee {
  id: string;
  name: string;
  email: string;
  status: 'free' | 'busy' | 'tentative' | 'unknown';
}

const MeetingForm = () => {
  const [title, setTitle] = useState('');
  const [attendees, setAttendees] = useState<Attendee[]>([]);
  const [newAttendeeEmail, setNewAttendeeEmail] = useState('');
  const [isTeamsMeeting, setIsTeamsMeeting] = useState(false);
  const [location, setLocation] = useState('');
  const [startDate, setStartDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [description, setDescription] = useState('');
  const [agenda, setAgenda] = useState('');
  const [selectedTab, setSelectedTab] = useState<TabValue>('details');

  const mockAvailability = [
    { time: '9:00 AM', status: 'free' },
    { time: '10:00 AM', status: 'busy' },
    { time: '11:00 AM', status: 'free' },
    { time: '2:00 PM', status: 'tentative' },
    { time: '3:00 PM', status: 'free' },
  ];

  const addAttendee = () => {
    if (newAttendeeEmail.trim()) {
      const newAttendee: Attendee = {
        id: Date.now().toString(),
        name: newAttendeeEmail.split('@')[0],
        email: newAttendeeEmail,
        status: 'unknown',
      };
      setAttendees([...attendees, newAttendee]);
      setNewAttendeeEmail('');
    }
  };

  const removeAttendee = (id: string) => {
    setAttendees(attendees.filter(a => a.id !== id));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'free': return '#107c10';
      case 'busy': return '#d13438';
      case 'tentative': return '#faa06b';
      default: return '#8a8886';
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-50 min-h-screen">
      <Card className="bg-white shadow-lg border-0">
        <CardHeader>
          <div className="flex items-center gap-3 mb-4">
            <CalendarLtr24Regular className="text-blue-600" />
            <Text size={600} weight="semibold" className="text-gray-900">
              New Meeting
            </Text>
          </div>
        </CardHeader>
        
        <CardPreview className="p-6 pt-0">
          <TabList selectedValue={selectedTab} onTabSelect={(_, data) => setSelectedTab(data.value)}>
            <Tab value="details">Meeting Details</Tab>
            <Tab value="scheduling">Scheduling Assistant</Tab>
          </TabList>

          <div className="mt-6">
            {selectedTab === 'details' && (
              <div className="space-y-6">
                <Field label="Title" required>
                  <Input
                    value={title}
                    onChange={(_, data) => setTitle(data.value)}
                    placeholder="Add a title"
                    className="w-full"
                  />
                </Field>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Field label="Start Date">
                    <Input
                      type="date"
                      value={startDate}
                      onChange={(_, data) => setStartDate(data.value)}
                      className="w-full"
                    />
                  </Field>
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="Start Time">
                      <Input
                        type="time"
                        value={startTime}
                        onChange={(_, data) => setStartTime(data.value)}
                        className="w-full"
                      />
                    </Field>
                    <Field label="End Time">
                      <Input
                        type="time"
                        value={endTime}
                        onChange={(_, data) => setEndTime(data.value)}
                        className="w-full"
                      />
                    </Field>
                  </div>
                </div>

                <div className="space-y-4">
                  <Label className="text-sm font-semibold">Meeting Options</Label>
                  <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg">
                    <Video24Regular className="text-blue-600" />
                    <div className="flex-1">
                      <Text weight="semibold">Teams meeting</Text>
                      <Text size={200} className="text-gray-600">Join this meeting online</Text>
                    </div>
                    <Switch
                      checked={isTeamsMeeting}
                      onChange={(_, data) => setIsTeamsMeeting(data.checked)}
                    />
                  </div>
                </div>

                {!isTeamsMeeting && (
                  <Field label="Location">
                    <div className="flex items-center gap-2">
                      <Location24Regular className="text-gray-600" />
                      <Input
                        value={location}
                        onChange={(_, data) => setLocation(data.value)}
                        placeholder="Add location"
                        className="flex-1"
                      />
                    </div>
                  </Field>
                )}

                <div className="space-y-4">
                  <Label className="text-sm font-semibold flex items-center gap-2">
                    <People24Regular />
                    Attendees
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      value={newAttendeeEmail}
                      onChange={(_, data) => setNewAttendeeEmail(data.value)}
                      placeholder="Enter email address"
                      className="flex-1"
                      onKeyDown={(e) => e.key === 'Enter' && addAttendee()}
                    />
                    <Button
                      appearance="primary"
                      icon={<Add24Regular />}
                      onClick={addAttendee}
                    >
                      Add
                    </Button>
                  </div>
                  
                  {attendees.length > 0 && (
                    <div className="space-y-2">
                      {attendees.map((attendee) => (
                        <div key={attendee.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <Avatar name={attendee.name} size={32} />
                          <div className="flex-1">
                            <Text weight="semibold">{attendee.name}</Text>
                            <Text size={200} className="text-gray-600">{attendee.email}</Text>
                          </div>
                          <Badge
                            appearance="filled"
                            style={{ backgroundColor: getStatusColor(attendee.status) }}
                          >
                            {attendee.status}
                          </Badge>
                          <Button
                            appearance="subtle"
                            icon={<Dismiss24Regular />}
                            onClick={() => removeAttendee(attendee.id)}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <Field label="Description">
                  <Textarea
                    value={description}
                    onChange={(_, data) => setDescription(data.value)}
                    placeholder="Add a description..."
                    rows={4}
                    className="w-full"
                  />
                </Field>

                <Field label="Agenda">
                  <Textarea
                    value={agenda}
                    onChange={(_, data) => setAgenda(data.value)}
                    placeholder="Add agenda items..."
                    rows={3}
                    className="w-full"
                  />
                </Field>
              </div>
            )}

            {selectedTab === 'scheduling' && (
              <div className="space-y-6">
                <Text size={500} weight="semibold">Free/Busy Times</Text>
                <div className="grid gap-4">
                  {mockAvailability.map((slot, index) => (
                    <div key={index} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                      <Clock24Regular className="text-gray-600" />
                      <Text className="w-20">{slot.time}</Text>
                      <div className="flex-1 flex items-center gap-2">
                        <div
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: getStatusColor(slot.status) }}
                        />
                        <Text className="capitalize">{slot.status}</Text>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <Divider className="my-6" />

            <div className="flex justify-end gap-3">
              <Button appearance="secondary">Cancel</Button>
              <Button
                appearance="primary"
                icon={<Send24Regular />}
              >
                Send Invitation
              </Button>
            </div>
          </div>
        </CardPreview>
      </Card>
    </div>
  );
};

export default MeetingForm;
