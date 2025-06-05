
import { Person } from '../../data/sampleData';

export interface RecurringPattern {
  weekdays: boolean[]; // [Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday]
  startTime: string;
  endTime: string;
}

export interface OneOffInstance {
  id: string;
  dateTime: string;
}

export interface FormData {
  title: string;
  coOrganizers: Person[];
  participants: Person[];
  optionalParticipants: Person[];
  description: string;
  startTime: string;
  endTime: string;
  startDate: string; // Add the missing startDate field
  location: string | string[];
  isRecurring: boolean;
  recurringPattern: RecurringPattern;
  oneOffInstances: OneOffInstance[];
}
