
import { useState, useCallback } from 'react';

interface AutocompleteHistory {
  emails: string[];
  locations: string[];
}

const STORAGE_KEY = 'meeting-autocomplete-history';

const useAutocompleteHistory = () => {
  const [history, setHistory] = useState<AutocompleteHistory>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : { emails: [], locations: [] };
    } catch {
      return { emails: [], locations: [] };
    }
  });

  const addEmail = useCallback((email: string) => {
    if (!email.trim()) return;
    
    setHistory(prev => {
      const newEmails = [email, ...prev.emails.filter(e => e !== email)].slice(0, 10);
      const newHistory = { ...prev, emails: newEmails };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory));
      return newHistory;
    });
  }, []);

  const addLocation = useCallback((location: string) => {
    if (!location.trim()) return;
    
    setHistory(prev => {
      const newLocations = [location, ...prev.locations.filter(l => l !== location)].slice(0, 10);
      const newHistory = { ...prev, locations: newLocations };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory));
      return newHistory;
    });
  }, []);

  return {
    emailHistory: history.emails,
    locationHistory: history.locations,
    addEmail,
    addLocation,
  };
};

export default useAutocompleteHistory;
