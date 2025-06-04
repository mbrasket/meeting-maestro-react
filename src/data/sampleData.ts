
export interface Person {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role?: string;
  department?: string;
}

export interface Location {
  id: string;
  name: string;
  type: 'room' | 'building' | 'online' | 'external';
  capacity?: number;
  equipment?: string[];
  address?: string;
}

export const samplePeople: Person[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@company.com',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    role: 'Product Manager',
    department: 'Product'
  },
  {
    id: '2',
    name: 'Michael Chen',
    email: 'michael.chen@company.com',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    role: 'Senior Developer',
    department: 'Engineering'
  },
  {
    id: '3',
    name: 'Emily Rodriguez',
    email: 'emily.rodriguez@company.com',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    role: 'UX Designer',
    department: 'Design'
  },
  {
    id: '4',
    name: 'David Kim',
    email: 'david.kim@company.com',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    role: 'Marketing Director',
    department: 'Marketing'
  },
  {
    id: '5',
    name: 'Lisa Thompson',
    email: 'lisa.thompson@company.com',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&fit=crop&crop=face',
    role: 'Sales Manager',
    department: 'Sales'
  },
  {
    id: '6',
    name: 'James Wilson',
    email: 'james.wilson@company.com',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
    role: 'QA Engineer',
    department: 'Engineering'
  },
  {
    id: '7',
    name: 'Anna Kowalski',
    email: 'anna.kowalski@company.com',
    avatar: 'https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=150&h=150&fit=crop&crop=face',
    role: 'HR Business Partner',
    department: 'Human Resources'
  },
  {
    id: '8',
    name: 'Robert Brown',
    email: 'robert.brown@company.com',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face',
    role: 'Finance Analyst',
    department: 'Finance'
  }
];

export const sampleLocations: Location[] = [
  {
    id: '1',
    name: 'Conference Room Alpha',
    type: 'room',
    capacity: 10,
    equipment: ['Projector', 'Whiteboard', 'Video Conference'],
    address: 'Building A, Floor 2'
  },
  {
    id: '2',
    name: 'The Innovation Hub',
    type: 'room',
    capacity: 20,
    equipment: ['Smart Board', 'Video Conference', 'Sound System'],
    address: 'Building B, Floor 3'
  },
  {
    id: '3',
    name: 'Meeting Room Beta',
    type: 'room',
    capacity: 6,
    equipment: ['Monitor', 'Whiteboard'],
    address: 'Building A, Floor 1'
  },
  {
    id: '4',
    name: 'Microsoft Teams Meeting',
    type: 'online',
    capacity: 300,
    equipment: ['Screen Sharing', 'Recording', 'Breakout Rooms']
  },
  {
    id: '5',
    name: 'Main Auditorium',
    type: 'room',
    capacity: 100,
    equipment: ['Stage', 'Microphones', 'Lighting', 'Video Conference'],
    address: 'Building C, Ground Floor'
  },
  {
    id: '6',
    name: 'Zoom Meeting',
    type: 'online',
    capacity: 500,
    equipment: ['Screen Sharing', 'Recording', 'Breakout Rooms']
  },
  {
    id: '7',
    name: 'Coffee Corner',
    type: 'building',
    capacity: 4,
    equipment: ['Casual Seating'],
    address: 'Building A, Ground Floor'
  },
  {
    id: '8',
    name: 'Client Office Downtown',
    type: 'external',
    capacity: 8,
    equipment: ['Presentation Screen'],
    address: '123 Business St, Downtown'
  }
];
