
import { useRef, useEffect } from 'react';

interface KeyboardRefState {
  ctrlKey: boolean;
  shiftKey: boolean;
  altKey: boolean;
}

export const useKeyboardRef = () => {
  const keyboardRef = useRef<KeyboardRefState>({
    ctrlKey: false,
    shiftKey: false,
    altKey: false,
  });

  useEffect(() => {
    const updateKeyState = (event: KeyboardEvent) => {
      keyboardRef.current = {
        ctrlKey: event.ctrlKey,
        shiftKey: event.shiftKey,
        altKey: event.altKey,
      };
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      updateKeyState(event);
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      updateKeyState(event);
    };

    const handleBlur = () => {
      // Reset all keys when window loses focus
      keyboardRef.current = {
        ctrlKey: false,
        shiftKey: false,
        altKey: false,
      };
    };

    // Use capture phase to get events before React DnD
    document.addEventListener('keydown', handleKeyDown, { capture: true });
    document.addEventListener('keyup', handleKeyUp, { capture: true });
    window.addEventListener('blur', handleBlur);

    return () => {
      document.removeEventListener('keydown', handleKeyDown, { capture: true });
      document.removeEventListener('keyup', handleKeyUp, { capture: true });
      window.removeEventListener('blur', handleBlur);
    };
  }, []);

  return keyboardRef;
};
