
import React from 'react';
import { HOUR_HEIGHT } from './types';

const TimeColumn: React.FC = () => {
  const hours = Array.from({ length: 24 }, (_, i) => i);

  return (
    <div className="w-16 border-r border-border bg-background">
      {hours.map(hour => (
        <div
          key={hour}
          className="relative text-xs text-muted-foreground text-right pr-2"
          style={{ height: `${HOUR_HEIGHT}px` }}
        >
          <div className="absolute -top-2 right-2">
            {hour.toString().padStart(2, '0')}:00
          </div>
          {/* Half-hour mark */}
          <div 
            className="absolute right-2 text-muted-foreground/50"
            style={{ top: `${HOUR_HEIGHT / 2 - 8}px` }}
          >
            {hour.toString().padStart(2, '0')}:30
          </div>
        </div>
      ))}
    </div>
  );
};

export default TimeColumn;
