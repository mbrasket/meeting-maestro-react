
import React from 'react';

export const TimeColumn: React.FC = () => {
  const hours = Array.from({ length: 24 }, (_, i) => i);

  return (
    <div className="w-16 border-r border-border bg-muted/50">
      {hours.map((hour) => (
        <div
          key={hour}
          className="relative border-b border-border"
          style={{ height: '84px' }}
        >
          <div className="absolute top-0 right-2 text-xs text-muted-foreground -translate-y-2">
            {hour.toString().padStart(2, '0')}:00
          </div>
          <div 
            className="absolute top-1/2 right-0 w-2 border-t border-border/50"
            style={{ borderColor: 'hsl(var(--border) / 0.3)' }}
          />
        </div>
      ))}
    </div>
  );
};
