
import { useState, useCallback, KeyboardEvent, useRef } from 'react';

export const useChipNavigation = <T>(
  items: T[],
  onRemove: (item: T, index: number) => void
) => {
  const [selectedChipIndex, setSelectedChipIndex] = useState(-1);
  const chipRefs = useRef<(HTMLDivElement | null)[]>([]);

  const handleChipKeyDown = useCallback((e: KeyboardEvent<HTMLDivElement>, index: number) => {
    switch (e.key) {
      case 'ArrowLeft':
        e.preventDefault();
        if (index > 0) {
          setSelectedChipIndex(index - 1);
          chipRefs.current[index - 1]?.focus();
        }
        break;
      case 'ArrowRight':
        e.preventDefault();
        if (index < items.length - 1) {
          setSelectedChipIndex(index + 1);
          chipRefs.current[index + 1]?.focus();
        } else {
          setSelectedChipIndex(-1);
          return 'focusInput';
        }
        break;
      case 'Backspace':
      case 'Delete':
        e.preventDefault();
        onRemove(items[index], index);
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        onRemove(items[index], index);
        break;
    }
    return null;
  }, [items, onRemove]);

  const resetChipSelection = useCallback(() => {
    setSelectedChipIndex(-1);
  }, []);

  const setChipSelection = useCallback((index: number) => {
    setSelectedChipIndex(index);
  }, []);

  return {
    selectedChipIndex,
    chipRefs,
    handleChipKeyDown,
    resetChipSelection,
    setChipSelection
  };
};
