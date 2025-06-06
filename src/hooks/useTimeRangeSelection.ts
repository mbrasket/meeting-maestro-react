
import { useState, useCallback } from 'react';

interface TimeRange {
  startDay: Date;
  startSlot: number;
  endDay: Date;
  endSlot: number;
}

export const useTimeRangeSelection = () => {
  const [selectedRange, setSelectedRange] = useState<TimeRange | null>(null);
  const [isSelecting, setIsSelecting] = useState(false);

  const startSelection = useCallback((day: Date, slot: number) => {
    setIsSelecting(true);
    setSelectedRange({
      startDay: day,
      startSlot: slot,
      endDay: day,
      endSlot: slot,
    });
  }, []);

  const updateSelection = useCallback((day: Date, slot: number) => {
    if (!isSelecting || !selectedRange) return;

    setSelectedRange(prev => {
      if (!prev) return null;
      return {
        ...prev,
        endDay: day,
        endSlot: slot,
      };
    });
  }, [isSelecting, selectedRange]);

  const endSelection = useCallback(() => {
    setIsSelecting(false);
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedRange(null);
    setIsSelecting(false);
  }, []);

  const isSlotInRange = useCallback((day: Date, slot: number): boolean => {
    if (!selectedRange) return false;

    const dayStr = day.toDateString();
    const startDayStr = selectedRange.startDay.toDateString();
    const endDayStr = selectedRange.endDay.toDateString();

    // Same day selection
    if (dayStr === startDayStr && dayStr === endDayStr) {
      const minSlot = Math.min(selectedRange.startSlot, selectedRange.endSlot);
      const maxSlot = Math.max(selectedRange.startSlot, selectedRange.endSlot);
      return slot >= minSlot && slot <= maxSlot;
    }

    // Multi-day selection (future enhancement)
    return false;
  }, [selectedRange]);

  return {
    selectedRange,
    isSelecting,
    startSelection,
    updateSelection,
    endSelection,
    clearSelection,
    isSlotInRange,
  };
};
