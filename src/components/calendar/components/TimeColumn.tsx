
import { memo } from 'react';
import { makeStyles, tokens } from '@fluentui/react-components';
import { slotToTime } from '../utils/timeUtils';

const useStyles = makeStyles({
  timeColumn: {
    width: '60px',
    borderRightColor: tokens.colorNeutralStroke1,
    borderRightWidth: '1px',
    borderRightStyle: 'solid',
    backgroundColor: tokens.colorNeutralBackground1,
    position: 'sticky',
    left: 0,
    zIndex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  timeColumnHeader: {
    height: '40px',
    borderBottomColor: tokens.colorNeutralStroke1,
    borderBottomWidth: '1px',
    borderBottomStyle: 'solid',
    backgroundColor: tokens.colorNeutralBackground2,
  },
  timeLabel: {
    height: '84px', // Each hour is 84px (12 slots * 7px)
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '12px',
    fontWeight: tokens.fontWeightMedium,
    color: tokens.colorNeutralForeground2,
    borderBottomColor: tokens.colorNeutralStroke2,
    borderBottomWidth: '1px',
    borderBottomStyle: 'solid',
    flexShrink: 0,
  },
  emptyTimeSlot: {
    height: '7px',
    flexShrink: 0,
  },
});

export const TimeColumn = memo(() => {
  const styles = useStyles();
  
  // Generate time slots for every 5 minutes (288 slots in 24 hours)
  const timeSlots = Array.from({ length: 288 }, (_, i) => i);
  // Generate hourly slots (every 12 slots = 1 hour)
  const hourlySlots = Array.from({ length: 24 }, (_, i) => i * 12);

  return (
    <div className={styles.timeColumn}>
      {/* Header space */}
      <div className={styles.timeColumnHeader}></div>
      
      {/* Time labels */}
      {timeSlots.map((slot) => (
        <div key={`time-${slot}`}>
          {hourlySlots.includes(slot) ? (
            <div className={styles.timeLabel}>
              {slotToTime(slot)}
            </div>
          ) : (
            <div className={styles.emptyTimeSlot}></div>
          )}
        </div>
      ))}
    </div>
  );
});

TimeColumn.displayName = 'TimeColumn';
