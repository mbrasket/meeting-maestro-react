
import { forwardRef, KeyboardEvent } from 'react';
import { Input, makeStyles, tokens } from '@fluentui/react-components';

const useStyles = makeStyles({
  underlineInput: {
    width: '100%',
  },
  chipsContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalXXS,
    flexWrap: 'nowrap',
    overflow: 'hidden',
    paddingRight: tokens.spacingHorizontalXS,
    maxWidth: '100%',
  },
});

interface PeoplePickerInputProps {
  value: string;
  placeholder: string;
  onValueChange: (value: string) => void;
  onFocus: () => void;
  onBlur: (e: React.FocusEvent) => void;
  onKeyDown: (e: KeyboardEvent<HTMLInputElement>) => void;
  chipsContent?: React.ReactNode;
}

const PeoplePickerInput = forwardRef<HTMLInputElement, PeoplePickerInputProps>(({
  value,
  placeholder,
  onValueChange,
  onFocus,
  onBlur,
  onKeyDown,
  chipsContent
}, ref) => {
  const styles = useStyles();

  return (
    <Input
      ref={ref}
      appearance="underline"
      className={styles.underlineInput}
      value={value}
      onChange={(_, data) => onValueChange(data.value)}
      onFocus={onFocus}
      onBlur={onBlur}
      onKeyDown={onKeyDown}
      placeholder={placeholder}
      contentBefore={
        chipsContent && (
          <div className={styles.chipsContainer}>
            {chipsContent}
          </div>
        )
      }
    />
  );
});

PeoplePickerInput.displayName = 'PeoplePickerInput';

export default PeoplePickerInput;
