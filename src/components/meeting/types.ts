
import { Person } from '../../data/sampleData';

export interface FormData {
  title: string;
  coOrganizers: Person[];
  participants: Person[];
  optionalParticipants: Person[];
  description: string;
  startTime: string;
  endTime: string;
  location: string | string[];
  isRecurring: boolean;
}
