
import React, { useState } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import {
  Calendar,
  Clock,
  MapPin,
  Video,
  Users,
  Plus,
  X,
  Send,
} from 'lucide-react';

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
      case 'free': return 'bg-green-500';
      case 'busy': return 'bg-red-500';
      case 'tentative': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-50 min-h-screen">
      <Card className="bg-white shadow-lg">
        <CardHeader>
          <div className="flex items-center gap-3 mb-4">
            <Calendar className="text-blue-600 h-6 w-6" />
            <h1 className="text-2xl font-semibold text-gray-900">
              New Meeting
            </h1>
          </div>
        </CardHeader>
        
        <CardContent className="p-6 pt-0">
          <Tabs defaultValue="details" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="details">Meeting Details</TabsTrigger>
              <TabsTrigger value="scheduling">Scheduling Assistant</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="space-y-6 mt-6">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-sm font-medium">
                  Title *
                </Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Add a title"
                  className="w-full"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="startDate" className="text-sm font-medium">
                    Start Date
                  </Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startTime" className="text-sm font-medium">
                      Start Time
                    </Label>
                    <Input
                      id="startTime"
                      type="time"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      className="w-full"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endTime" className="text-sm font-medium">
                      End Time
                    </Label>
                    <Input
                      id="endTime"
                      type="time"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <Label className="text-sm font-semibold">Meeting Options</Label>
                <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg">
                  <Video className="text-blue-600 h-5 w-5" />
                  <div className="flex-1">
                    <p className="font-semibold">Teams meeting</p>
                    <p className="text-sm text-gray-600">Join this meeting online</p>
                  </div>
                  <Switch
                    checked={isTeamsMeeting}
                    onCheckedChange={setIsTeamsMeeting}
                  />
                </div>
              </div>

              {!isTeamsMeeting && (
                <div className="space-y-2">
                  <Label htmlFor="location" className="text-sm font-medium">
                    Location
                  </Label>
                  <div className="flex items-center gap-2">
                    <MapPin className="text-gray-600 h-4 w-4" />
                    <Input
                      id="location"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="Add location"
                      className="flex-1"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <Label className="text-sm font-semibold flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Attendees
                </Label>
                <div className="flex gap-2">
                  <Input
                    value={newAttendeeEmail}
                    onChange={(e) => setNewAttendeeEmail(e.target.value)}
                    placeholder="Enter email address"
                    className="flex-1"
                    onKeyDown={(e) => e.key === 'Enter' && addAttendee()}
                  />
                  <Button onClick={addAttendee} className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Add
                  </Button>
                </div>
                
                {attendees.length > 0 && (
                  <div className="space-y-2">
                    {attendees.map((attendee) => (
                      <div key={attendee.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>
                            {attendee.name.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="font-semibold">{attendee.name}</p>
                          <p className="text-sm text-gray-600">{attendee.email}</p>
                        </div>
                        <Badge className={`${getStatusColor(attendee.status)} text-white`}>
                          {attendee.status}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeAttendee(attendee.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm font-medium">
                  Description
                </Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Add a description..."
                  rows={4}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="agenda" className="text-sm font-medium">
                  Agenda
                </Label>
                <Textarea
                  id="agenda"
                  value={agenda}
                  onChange={(e) => setAgenda(e.target.value)}
                  placeholder="Add agenda items..."
                  rows={3}
                  className="w-full"
                />
              </div>
            </TabsContent>

            <TabsContent value="scheduling" className="space-y-6 mt-6">
              <h3 className="text-lg font-semibold">Free/Busy Times</h3>
              <div className="grid gap-4">
                {mockAvailability.map((slot, index) => (
                  <div key={index} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                    <Clock className="text-gray-600 h-4 w-4" />
                    <span className="w-20">{slot.time}</span>
                    <div className="flex-1 flex items-center gap-2">
                      <div
                        className={`w-4 h-4 rounded-full ${getStatusColor(slot.status).replace('bg-', 'bg-')}`}
                      />
                      <span className="capitalize">{slot.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>

          <Separator className="my-6" />

          <div className="flex justify-end gap-3">
            <Button variant="secondary">Cancel</Button>
            <Button className="flex items-center gap-2">
              <Send className="h-4 w-4" />
              Send Invitation
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MeetingForm;
