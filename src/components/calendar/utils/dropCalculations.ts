
export const calculateDropTime = (droppableId: string, mouseY: number, dropElement: Element): Date | null => {
  // Handle all-day drops
  if (droppableId.startsWith('allday-')) {
    const dayIndex = parseInt(droppableId.split('-')[1]);
    const today = new Date();
    const targetDate = new Date(today);
    targetDate.setDate(today.getDate() - today.getDay() + dayIndex);
    targetDate.setHours(0, 0, 0, 0);
    return targetDate;
  }

  // Handle time slot drops
  if (droppableId.startsWith('day-')) {
    const dayIndex = parseInt(droppableId.split('-')[1]);
    const today = new Date();
    const targetDate = new Date(today);
    targetDate.setDate(today.getDate() - today.getDay() + dayIndex);
    
    // Get mouse position relative to the drop element
    const rect = dropElement.getBoundingClientRect();
    const relativeY = mouseY - rect.top;
    
    // Calculate time slot from relative position with 5-minute precision
    // Each hour is 84px, so each 5-minute slot is 7px (84/12)
    const slot = Math.floor(relativeY / 7);
    const minutes = slot * 5;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    targetDate.setHours(hours, mins, 0, 0);
    return targetDate;
  }

  return null;
};

export const mousePositionToTimeSlot = (mouseY: number): number => {
  // Convert mouse Y position to 5-minute time slot (0-287)
  const slotHeight = 7; // 7px per 5-minute slot
  return Math.floor(mouseY / slotHeight);
};

export const timeSlotToPosition = (slot: number): number => {
  // Convert time slot to Y position
  return slot * 7; // 7px per 5-minute slot
};
