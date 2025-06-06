
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
    alignItems: 'flex-start',
    justifyContent: 'center',
    fontSize: '12px',
    fontWeight: tokens.fontWeightMedium,
    color: tokens.colorNeutralForeground2,
    flexShrink: 0,
    paddingTop: '4px',
  },
});

export const TimeColumn = memo(() => {
  const styles = useStyles();
  
  // Generate hourly time labels
  const hours = Array.from({ length: 24 }, (_, i) => i);

  return (
    <div className={styles.timeColumn}>
      {/* Header space */}
      <div className={styles.timeColumnHeader}></div>
      
      {/* Time labels - one per hour */}
      {hours.map((hour) => (
        <div key={`time-${hour}`} className={styles.timeLabel}>
          {slotToTime(hour * 12)}
        </div>
      ))}
    </div>
  );
});

TimeColumn.displayName = 'TimeColumn';
