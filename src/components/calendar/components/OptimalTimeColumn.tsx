
import { memo } from 'react';
import { makeStyles, tokens, Text } from '@fluentui/react-components';
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
    height: '84px',
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

export const OptimalTimeColumn = memo(() => {
  const styles = useStyles();
  
  const timeSlots = Array.from({ length: 288 }, (_, i) => i);
  const hourlySlots = Array.from({ length: 24 }, (_, i) => i * 12);

  return (
    <div className={styles.timeColumn}>
      <div className={styles.timeColumnHeader}></div>
      
      {timeSlots.map((slot) => (
        <div key={`time-${slot}`}>
          {hourlySlots.includes(slot) ? (
            <div className={styles.timeLabel}>
              <Text size={200} weight="medium">
                {slotToTime(slot)}
              </Text>
            </div>
          ) : (
            <div className={styles.emptyTimeSlot}></div>
          )}
        </div>
      ))}
    </div>
  );
});

OptimalTimeColumn.displayName = 'OptimalTimeColumn';
