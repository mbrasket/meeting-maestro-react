
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
      case 'free': return 'bg-green-100 text-green-800 border-green-200';
      case 'busy': return 'bg-red-100 text-red-800 border-red-200';
      case 'tentative': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Teams-style header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-purple-600 rounded flex items-center justify-center">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-semibold text-gray-900">New meeting</h1>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <Tabs defaultValue="details" className="w-full">
            <div className="border-b border-gray-200">
              <TabsList className="bg-transparent h-auto p-0 w-full justify-start">
                <TabsTrigger 
                  value="details" 
                  className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-purple-600 data-[state=active]:text-purple-600 rounded-none px-6 py-4 font-medium"
                >
                  Meeting details
                </TabsTrigger>
                <TabsTrigger 
                  value="scheduling" 
                  className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-purple-600 data-[state=active]:text-purple-600 rounded-none px-6 py-4 font-medium"
                >
                  Scheduling assistant
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="details" className="mt-0 p-6">
              <div className="space-y-6">
                {/* Title */}
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-sm font-medium text-gray-700">
                    Add a title
                  </Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Meeting title"
                    className="border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                  />
                </div>

                {/* Teams meeting toggle */}
                <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-600 rounded flex items-center justify-center">
                      <Video className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">Microsoft Teams meeting</div>
                      <div className="text-sm text-gray-600">Join this meeting online</div>
                    </div>
                  </div>
                  <Switch
                    checked={isTeamsMeeting}
                    onCheckedChange={setIsTeamsMeeting}
                    className="data-[state=checked]:bg-purple-600"
                  />
                </div>

                {/* Date and time */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">Start date</Label>
                    <Input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">Start time</Label>
                    <Input
                      type="time"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      className="border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">End time</Label>
                    <Input
                      type="time"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      className="border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                    />
                  </div>
                </div>

                {/* Location (only if not Teams meeting) */}
                {!isTeamsMeeting && (
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">Location</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="Add location"
                        className="pl-10 border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                      />
                    </div>
                  </div>
                )}

                {/* Attendees */}
                <div className="space-y-4">
                  <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Invite people
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      value={newAttendeeEmail}
                      onChange={(e) => setNewAttendeeEmail(e.target.value)}
                      placeholder="Enter names or email addresses"
                      className="flex-1 border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                      onKeyDown={(e) => e.key === 'Enter' && addAttendee()}
                    />
                    <Button 
                      onClick={addAttendee} 
                      className="bg-purple-600 hover:bg-purple-700 text-white"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add
                    </Button>
                  </div>
                  
                  {attendees.length > 0 && (
                    <div className="space-y-2">
                      {attendees.map((attendee) => (
                        <div key={attendee.id} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                          <Avatar className="w-8 h-8">
                            <AvatarFallback className="bg-purple-100 text-purple-600 text-sm">
                              {attendee.name.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="font-medium text-sm text-gray-900">{attendee.name}</div>
                            <div className="text-xs text-gray-500">{attendee.email}</div>
                          </div>
                          <Badge variant="outline" className={getStatusColor(attendee.status)}>
                            {attendee.status}
                          </Badge>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeAttendee(attendee.id)}
                            className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Add a message</Label>
                  <Textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Hi everyone, let's meet to discuss..."
                    rows={3}
                    className="border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                  />
                </div>

                {/* Agenda */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Agenda</Label>
                  <Textarea
                    value={agenda}
                    onChange={(e) => setAgenda(e.target.value)}
                    placeholder="Meeting agenda..."
                    rows={3}
                    className="border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="scheduling" className="mt-0 p-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Suggested times</h3>
                <div className="space-y-2">
                  {mockAvailability.map((slot, index) => (
                    <div key={index} className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                      <Clock className="w-5 h-5 text-gray-400" />
                      <span className="font-medium text-gray-900 w-20">{slot.time}</span>
                      <div className="flex-1">
                        <Badge variant="outline" className={getStatusColor(slot.status)}>
                          {slot.status}
                        </Badge>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="border-purple-200 text-purple-600 hover:bg-purple-50"
                      >
                        Select
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>

          {/* Footer */}
          <div className="border-t border-gray-200 px-6 py-4">
            <div className="flex justify-between items-center">
              <Button variant="ghost" className="text-gray-600 hover:text-gray-800">
                Cancel
              </Button>
              <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                <Send className="w-4 h-4 mr-2" />
                Send
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MeetingForm;
