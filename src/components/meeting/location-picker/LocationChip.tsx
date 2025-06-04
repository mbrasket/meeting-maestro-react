
import { KeyboardEvent } from 'react';
import {
  Text,
  makeStyles,
  tokens,
} from '@fluentui/react-components';
import { Dismiss12Regular } from '@fluentui/react-icons';

const useStyles = makeStyles({
  locationChip: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalXXS,
    padding: `2px ${tokens.spacingHorizontalXXS}`,
    backgroundColor: tokens.colorNeutralBackground2,
    borderRadius: tokens.borderRadiusSmall,
    borderTopColor: tokens.colorNeutralStroke1,
    borderRightColor: tokens.colorNeutralStroke1,
    borderBottomColor: tokens.colorNeutralStroke1,
    borderLeftColor: tokens.colorNeutralStroke1,
    borderTopWidth: '1px',
    borderRightWidth: '1px',
    borderBottomWidth: '1px',
    borderLeftWidth: '1px',
    borderTopStyle: 'solid',
    borderRightStyle: 'solid',
    borderBottomStyle: 'solid',
    borderLeftStyle: 'solid',
    maxWidth: '300px',
    fontSize: tokens.fontSizeBase200,
    flexShrink: 0,
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    '&:focus': {
      outline: `2px solid ${tokens.colorBrandStroke1}`,
      outlineOffset: '1px',
    },
  },
  selectedChip: {
    backgroundColor: tokens.colorBrandBackground2,
    borderTopColor: tokens.colorBrandStroke1,
    borderRightColor: tokens.colorBrandStroke1,
    borderBottomColor: tokens.colorBrandStroke1,
    borderLeftColor: tokens.colorBrandStroke1,
  },
  dismissButton: {
    border: 'none',
    background: 'transparent',
    cursor: 'pointer',
    padding: '1px',
    borderRadius: tokens.borderRadiusSmall,
    display: 'flex',
    alignItems: 'center',
    flexShrink: 0,
    '&:hover': {
      backgroundColor: tokens.colorNeutralBackground3,
    },
  },
});

interface LocationChipProps {
  location: string;
  isSelected: boolean;
  onRemove: (location: string) => void;
  onKeyDown: (e: KeyboardEvent<HTMLDivElement>) => void;
  onFocus: () => void;
  chipRef: (el: HTMLDivElement | null) => void;
}

const LocationChip = ({ location, isSelected, onRemove, onKeyDown, onFocus, chipRef }: LocationChipProps) => {
  const styles = useStyles();

  return (
    <div 
      ref={chipRef}
      className={`${styles.locationChip} ${isSelected ? styles.selectedChip : ''}`}
      tabIndex={0}
      onKeyDown={onKeyDown}
      onFocus={onFocus}
      data-chip
    >
      <Text size={200} truncate title={location} style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {location}
      </Text>
      <button
        className={styles.dismissButton}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onRemove(location);
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            e.stopPropagation();
            onRemove(location);
          }
        }}
        aria-label={`Remove ${location}`}
      >
        <Dismiss12Regular />
      </button>
    </div>
  );
};

export default LocationChip;
