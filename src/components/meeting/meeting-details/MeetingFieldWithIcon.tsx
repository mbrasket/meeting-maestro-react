
import { ReactNode } from 'react';
import {
  makeStyles,
  tokens,
} from '@fluentui/react-components';

const useStyles = makeStyles({
  fieldWithIcon: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalM,
    marginBottom: '16px',
    height: '32px',
    padding: `${tokens.spacingVerticalXS} ${tokens.spacingHorizontalS}`,
    borderRadius: tokens.borderRadiusSmall,
    cursor: 'default',
    transition: 'background-color 0.1s ease',
    '&:hover': {
      backgroundColor: tokens.colorSubtleBackgroundHover,
    },
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

interface MeetingFieldWithIconProps {
  icon: ReactNode;
  children: ReactNode;
}

const MeetingFieldWithIcon = ({ icon, children }: MeetingFieldWithIconProps) => {
  const styles = useStyles();

  return (
    <div className={styles.fieldWithIcon}>
      <div className={styles.iconContainer}>
        {icon}
      </div>
      {children}
    </div>
  );
};

export default MeetingFieldWithIcon;
