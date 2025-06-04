
// This file is kept for compatibility but no longer needed with Fluent UI
// Fluent UI has built-in toast/notification system
export const useToast = () => {
  return {
    toast: (message: { title?: string; description?: string }) => {
      console.log('Toast:', message);
    },
  };
};
