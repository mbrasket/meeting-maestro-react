
import React from 'react';
import { getWeekDates } from './utils/timeCalculations';

interface WeekHeaderProps {
  currentWeek: Date;
}

const WeekHeader: React.FC<WeekHeaderProps> = ({ currentWeek }) => {
  const weekDates = getWeekDates(currentWeek);
  const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <div className="flex border-b border-border bg-background">
      {/* Time column spacer */}
      <div className="w-16 border-r border-border"></div>
      
      {/* Day headers */}
      {weekDates.map((date, index) => (
        <div key={index} className="flex-1 p-2 text-center border-r border-border last:border-r-0">
          <div className="text-sm text-muted-foreground">{weekdays[index]}</div>
          <div className="text-lg font-semibold text-foreground">{date.getDate()}</div>
        </div>
      ))}
    </div>
  );
};

export default WeekHeader;
