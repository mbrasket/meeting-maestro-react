
import React from 'react';
import { format } from 'date-fns';

interface WeekHeaderProps {
  weekDays: Date[];
}

export const WeekHeader: React.FC<WeekHeaderProps> = ({ weekDays }) => {
  return (
    <div className="flex border-b border-border bg-muted/50">
      <div className="w-16 border-r border-border flex items-center justify-center text-xs font-medium">
        Time
      </div>
      {weekDays.map((day) => (
        <div
          key={day.toISOString()}
          className="flex-1 p-3 text-center border-r border-border last:border-r-0"
        >
          <div className="text-sm font-medium">{format(day, 'EEE')}</div>
          <div className="text-lg font-semibold">{format(day, 'd')}</div>
        </div>
      ))}
    </div>
  );
};
