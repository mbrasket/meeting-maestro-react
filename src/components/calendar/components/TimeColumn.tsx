
import React from 'react';

export const TimeColumn: React.FC = () => {
  const hours = Array.from({ length: 24 }, (_, i) => i);

  return (
    <div className="w-16 border-r border-border bg-muted/50">
      {hours.map((hour) => (
        <div
          key={hour}
          className="relative"
          style={{ height: '84px' }}
        >
          {/* Hour label */}
          <div className="absolute top-0 right-2 text-xs text-muted-foreground -translate-y-2">
            {hour.toString().padStart(2, '0')}:00
          </div>
          {/* Half-hour tick mark */}
          <div 
            className="absolute top-1/2 right-0 w-2 border-t border-border/50"
          />
          {/* Hour line */}
          <div className="absolute top-0 left-0 right-0 border-t border-border" />
        </div>
      ))}
    </div>
  );
};
