
import { Link, useLocation } from 'react-router-dom';
import { 
  makeStyles, 
  tokens, 
  Tab, 
  TabList 
} from '@fluentui/react-components';

const useStyles = makeStyles({
  nav: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    height: '60px',
    backgroundColor: tokens.colorNeutralBackground1,
    borderBottomColor: tokens.colorNeutralStroke1,
    borderBottomWidth: '1px',
    borderBottomStyle: 'solid',
    zIndex: 100,
    display: 'flex',
    alignItems: 'center',
    paddingLeft: tokens.spacingHorizontalM,
  },
  tabList: {
    backgroundColor: 'transparent',
  },
  link: {
    textDecoration: 'none',
    color: 'inherit',
  },
});

const Navigation = () => {
  const styles = useStyles();
  const location = useLocation();
  
  const selectedValue = location.pathname === '/calendar' ? 'calendar' : 'meeting';

  return (
    <nav className={styles.nav}>
      <TabList className={styles.tabList} selectedValue={selectedValue}>
        <Link to="/" className={styles.link}>
          <Tab value="meeting">Meeting Form</Tab>
        </Link>
        <Link to="/calendar" className={styles.link}>
          <Tab value="calendar">Calendar</Tab>
        </Link>
      </TabList>
    </nav>
  );
};

export default Navigation;
