
import { makeStyles, tokens } from '@fluentui/react-components';

const useStyles = makeStyles({
  resizeHandle: {
    position: 'absolute',
    left: '0',
    right: '0',
    height: '4px',
    cursor: 'ns-resize',
    backgroundColor: 'transparent',
    zIndex: 15,
    ':hover': {
      backgroundColor: tokens.colorNeutralStroke1,
    },
  },
  topHandle: {
    top: '-2px',
  },
  bottomHandle: {
    bottom: '-2px',
  },
});

interface ResizeHandlesProps {
  onResizeMouseDown: (direction: 'top' | 'bottom') => (e: React.MouseEvent) => void;
  isDragging: boolean;
}

export const ResizeHandles = ({ onResizeMouseDown, isDragging }: ResizeHandlesProps) => {
  const styles = useStyles();

  if (isDragging) return null;

  return (
    <>
      <div 
        className={`${styles.resizeHandle} ${styles.topHandle}`}
        onMouseDown={onResizeMouseDown('top')}
      />
      <div 
        className={`${styles.resizeHandle} ${styles.bottomHandle}`}
        onMouseDown={onResizeMouseDown('bottom')}
      />
    </>
  );
};
