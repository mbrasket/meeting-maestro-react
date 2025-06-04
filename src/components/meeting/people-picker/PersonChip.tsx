
import { KeyboardEvent } from 'react';
import {
  Avatar,
  Text,
  makeStyles,
  tokens,
} from '@fluentui/react-components';
import { Dismiss12Regular } from '@fluentui/react-icons';
import { Person } from '../../../data/sampleData';

const useStyles = makeStyles({
  personaChip: {
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
    maxWidth: '120px',
    fontSize: tokens.fontSizeBase200,
    flexShrink: 0,
    cursor: 'pointer',
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
    '&:hover': {
      backgroundColor: tokens.colorNeutralBackground3,
    },
  },
});

interface PersonChipProps {
  person: Person;
  isSelected: boolean;
  onRemove: (person: Person) => void;
  onKeyDown: (e: KeyboardEvent<HTMLDivElement>) => void;
  onFocus: () => void;
  chipRef: (el: HTMLDivElement | null) => void;
}

const PersonChip = ({ person, isSelected, onRemove, onKeyDown, onFocus, chipRef }: PersonChipProps) => {
  const styles = useStyles();

  return (
    <div 
      key={person.id} 
      ref={chipRef}
      className={`${styles.personaChip} ${isSelected ? styles.selectedChip : ''}`}
      tabIndex={0}
      onKeyDown={onKeyDown}
      onFocus={onFocus}
      data-chip
    >
      <Avatar
        image={{ src: person.avatar }}
        name={person.name}
        size={16}
      />
      <Text size={200} truncate title={person.name}>
        {person.name}
      </Text>
      <button
        className={styles.dismissButton}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onRemove(person);
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            e.stopPropagation();
            onRemove(person);
          }
        }}
        aria-label={`Remove ${person.name}`}
      >
        <Dismiss12Regular />
      </button>
    </div>
  );
};

export default PersonChip;
