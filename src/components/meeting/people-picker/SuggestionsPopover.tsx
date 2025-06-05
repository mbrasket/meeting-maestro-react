
import { forwardRef } from 'react';
import {
  Popover,
  PopoverTrigger,
  PopoverSurface,
  makeStyles,
  tokens,
} from '@fluentui/react-components';
import { Person } from '../../../data/sampleData';
import PersonSuggestion from './PersonSuggestion';

const useStyles = makeStyles({
  popoverSurface: {
    maxHeight: '200px',
    overflowY: 'auto',
    padding: 0,
    minWidth: '300px',
    backgroundColor: tokens.colorNeutralBackground1,
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
    borderRadius: tokens.borderRadiusMedium,
    boxShadow: tokens.shadow16,
    zIndex: 1000,
  },
});

interface SuggestionsPopoverProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  suggestions: Person[];
  selectedIndex: number;
  onSuggestionClick: (person: Person) => void;
  onSuggestionHover: (index: number) => void;
  children: React.ReactNode;
}

const SuggestionsPopover = forwardRef<HTMLDivElement, SuggestionsPopoverProps>(({
  isOpen,
  onOpenChange,
  suggestions,
  selectedIndex,
  onSuggestionClick,
  onSuggestionHover,
  children
}, ref) => {
  const styles = useStyles();

  return (
    <Popover
      open={isOpen && suggestions.length > 0}
      positioning="below-start"
      onOpenChange={(_, data) => {
        if (!data.open) {
          onOpenChange(false);
        }
      }}
    >
      <PopoverTrigger disableButtonEnhancement>
        {children}
      </PopoverTrigger>
      
      <PopoverSurface ref={ref} className={styles.popoverSurface}>
        {suggestions.map((person, index) => (
          <div key={person.id}>
            <PersonSuggestion
              person={person}
              isSelected={selectedIndex === index}
              onClick={onSuggestionClick}
              onMouseEnter={() => onSuggestionHover(index)}
            />
          </div>
        ))}
      </PopoverSurface>
    </Popover>
  );
});

SuggestionsPopover.displayName = 'SuggestionsPopover';

export default SuggestionsPopover;
