
import { ReactNode } from 'react';
import {
  makeStyles,
  tokens,
} from '@fluentui/react-components';

const useStyles = makeStyles({
  fieldWithIconAndMenu: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalM,
    marginBottom: '16px',
    height: '32px',
    padding: `${tokens.spacingVerticalXS} ${tokens.spacingHorizontalS}`,
    borderRadius: tokens.borderRadiusSmall,
  },
  fieldContainer: {
    display: 'flex',
    alignItems: 'center',
    flex: 1,
    gap: tokens.spacingHorizontalS,
    height: '32px',
  },
  inputContainer: {
    flex: 1,
  },
  iconContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '20px',
    height: '20px',
    color: tokens.colorNeutralForeground2,
  },
});

interface MeetingFieldWithIconAndMenuProps {
  icon: ReactNode;
  children: ReactNode;
  menu: ReactNode;
}

const MeetingFieldWithIconAndMenu = ({ icon, children, menu }: MeetingFieldWithIconAndMenuProps) => {
  const styles = useStyles();

  return (
    <div className={styles.fieldWithIconAndMenu}>
      <div className={styles.iconContainer}>
        {icon}
      </div>
      <div className={styles.fieldContainer}>
        <div className={styles.inputContainer}>
          {children}
        </div>
        {menu}
      </div>
    </div>
  );
};

export default MeetingFieldWithIconAndMenu;
