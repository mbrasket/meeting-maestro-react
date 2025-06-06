
import { makeStyles, tokens } from '@fluentui/react-components';
import { DroppableStateSnapshot } from '@hello-pangea/dnd';

const useStyles = makeStyles({
  ghostCard: {
    position: 'absolute',
    left: '2px', // Reduced from 6px
    right: '2px', // Reduced from 6px
    height: '28px',
    backgroundColor: tokens.colorBrandBackground,
    border: `2px dashed ${tokens.colorBrandStroke1}`,
    borderRadius: '4px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: tokens.colorNeutralForegroundOnBrand,
    fontSize: '12px',
    zIndex: '15',
    opacity: '0.7',
  },
});

interface GhostCardProps {
  snapshot: DroppableStateSnapshot;
}

export const GhostCard = ({ snapshot }: GhostCardProps) => {
  const styles = useStyles();

  if (!snapshot.isDraggingOver || !snapshot.draggingFromThisWith?.startsWith('tool-')) {
    return null;
  }

  return (
    <div className={styles.ghostCard}>
      Drop here
    </div>
  );
};
