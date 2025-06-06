
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
      const newState = {
        ctrlKey: event.ctrlKey,
        shiftKey: event.shiftKey,
        altKey: event.altKey,
      };
      
      // Only update if state actually changed to prevent infinite loops
      if (
        keyboardRef.current.ctrlKey !== newState.ctrlKey ||
        keyboardRef.current.shiftKey !== newState.shiftKey ||
        keyboardRef.current.altKey !== newState.altKey
      ) {
        keyboardRef.current = newState;
        console.log('Key state updated:', newState);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      updateKeyState(event);
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      updateKeyState(event);
    };

    const handleBlur = () => {
      console.log('Window blur - resetting keys');
      // Reset all keys when window loses focus
      keyboardRef.current = {
        ctrlKey: false,
        shiftKey: false,
        altKey: false,
      };
    };

    const handleVisibilityChange = () => {
      // Reset all keys when tab becomes hidden
      if (document.hidden) {
        console.log('Document hidden - resetting keys');
        keyboardRef.current = {
          ctrlKey: false,
          shiftKey: false,
          altKey: false,
        };
      }
    };

    // Use capture phase to get events before React DnD
    document.addEventListener('keydown', handleKeyDown, { capture: true });
    document.addEventListener('keyup', handleKeyUp, { capture: true });
    window.addEventListener('blur', handleBlur);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('keydown', handleKeyDown, { capture: true });
      document.removeEventListener('keyup', handleKeyUp, { capture: true });
      window.removeEventListener('blur', handleBlur);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return keyboardRef;
};
