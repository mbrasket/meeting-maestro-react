
import { useState, useCallback, KeyboardEvent } from 'react';

interface UseKeyboardNavigationProps {
  itemCount: number;
  onSelect: (index: number) => void;
  onEscape?: () => void;
  isOpen: boolean;
}

export const useKeyboardNavigation = ({
  itemCount,
  onSelect,
  onEscape,
  isOpen
}: UseKeyboardNavigationProps) => {
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!isOpen || itemCount === 0) return false;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => prev < itemCount - 1 ? prev + 1 : 0);
        return true;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : itemCount - 1);
        return true;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < itemCount) {
          onSelect(selectedIndex);
        }
        return true;
      case 'Escape':
        e.preventDefault();
        onEscape?.();
        return true;
      default:
        return false;
    }
  }, [isOpen, itemCount, selectedIndex, onSelect, onEscape]);

  const resetSelection = useCallback(() => {
    setSelectedIndex(-1);
  }, []);

  const setSelection = useCallback((index: number) => {
    setSelectedIndex(index);
  }, []);

  return {
    selectedIndex,
    handleKeyDown,
    resetSelection,
    setSelection
  };
};
