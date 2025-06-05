
import { Person } from '../data/sampleData';

export const createPersonFromText = (text: string): Person => {
  const trimmedText = text.trim();
  return {
    id: `temp-${Date.now()}`,
    name: trimmedText,
    email: trimmedText.includes('@') ? trimmedText : `${trimmedText}@company.com`,
    avatar: '',
    role: 'External',
    department: 'External'
  };
};

export const filterSuggestions = (
  suggestions: Person[],
  searchValue: string,
  selectedPeople: Person[]
): Person[] => {
  const searchLower = searchValue.toLowerCase();
  return suggestions.filter(person =>
    (person.name.toLowerCase().includes(searchLower) ||
     person.email.toLowerCase().includes(searchLower) ||
     person.role?.toLowerCase().includes(searchLower) ||
     person.department?.toLowerCase().includes(searchLower)) &&
    !selectedPeople.find(p => p.id === person.id)
  );
};
