
import { useState, useEffect } from 'react';

interface KeyboardState {
  ctrlKey: boolean;
  shiftKey: boolean;
  altKey: boolean;
}

export const useKeyboardState = () => {
  const [keyboardState, setKeyboardState] = useState<KeyboardState>({
    ctrlKey: false,
    shiftKey: false,
    altKey: false,
  });

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      setKeyboardState({
        ctrlKey: event.ctrlKey,
        shiftKey: event.shiftKey,
        altKey: event.altKey,
      });
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      setKeyboardState({
        ctrlKey: event.ctrlKey,
        shiftKey: event.shiftKey,
        altKey: event.altKey,
      });
    };

    const handleBlur = () => {
      // Reset all keys when window loses focus
      setKeyboardState({
        ctrlKey: false,
        shiftKey: false,
        altKey: false,
      });
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    window.addEventListener('blur', handleBlur);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('blur', handleBlur);
    };
  }, []);

  return keyboardState;
};
