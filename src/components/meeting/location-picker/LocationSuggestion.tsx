
import {
  Text,
  makeStyles,
  tokens,
} from '@fluentui/react-components';

const useStyles = makeStyles({
  optionItem: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalS,
    padding: tokens.spacingVerticalS,
    cursor: 'pointer',
    border: 'none',
    background: 'transparent',
    width: '100%',
    textAlign: 'left',
    '&:hover': {
      backgroundColor: tokens.colorNeutralBackground2,
    },
    '&:focus': {
      backgroundColor: tokens.colorNeutralBackground2,
      outline: `2px solid ${tokens.colorBrandStroke1}`,
      outlineOffset: '-2px',
    },
  },
});

interface LocationSuggestionProps {
  location: string;
  isSelected: boolean;
  onClick: (location: string) => void;
  onMouseEnter: () => void;
}

const LocationSuggestion = ({ location, isSelected, onClick, onMouseEnter }: LocationSuggestionProps) => {
  const styles = useStyles();

  return (
    <div
      className={styles.optionItem}
      onClick={() => onClick(location)}
      onMouseEnter={onMouseEnter}
      data-suggestion-option
      style={{
        backgroundColor: isSelected ? tokens.colorNeutralBackground2 : 'transparent'
      }}
    >
      <Text weight="semibold">{location}</Text>
    </div>
  );
};

export default LocationSuggestion;
