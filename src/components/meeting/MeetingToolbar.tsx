
import { Button, makeStyles, tokens } from '@fluentui/react-components';
import { 
  Tag20Regular,
  Alert20Regular,
  MoreHorizontal20Regular,
  Send20Regular,
  Delete20Regular,
  ChevronDown20Regular
} from '@fluentui/react-icons';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const useStyles = makeStyles({
  toolbar: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100vw',
    padding: '8px',
    backgroundColor: tokens.colorNeutralBackground2,
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
  },
  toolbarLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  toolbarRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  dropdownTrigger: {
    border: 'none',
    background: 'transparent',
    padding: tokens.spacingVerticalS,
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalXS,
    cursor: 'pointer',
    borderRadius: tokens.borderRadiusSmall,
    '&:hover': {
      backgroundColor: tokens.colorNeutralBackground1Hover,
    }
  },
});

interface MeetingToolbarProps {
  selectedCategory: string;
  selectedReminder: string;
  onCategoryChange: (category: string) => void;
  onReminderChange: (reminder: string) => void;
  onSend: () => void;
  onDelete: () => void;
}

const MeetingToolbar = ({
  selectedCategory,
  selectedReminder,
  onCategoryChange,
  onReminderChange,
  onSend,
  onDelete
}: MeetingToolbarProps) => {
  const styles = useStyles();
  
  const categories = ['General', 'Team Meeting', 'Client Call', 'Review', 'Training'];
  const reminders = ['15 mins', '30 mins', '1 hour', '2 hours', '1 day'];

  return (
    <div className={styles.toolbar}>
      <div className={styles.toolbarLeft}>
        <Button
          appearance="primary"
          icon={<Send20Regular />}
          onClick={onSend}
        >
          Send
        </Button>
        <Button
          appearance="subtle"
          icon={<Delete20Regular />}
          onClick={onDelete}
        >
          Delete
        </Button>
      </div>

      <div className={styles.toolbarRight}>
        {/* Meeting Categories Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className={styles.dropdownTrigger}>
              <Tag20Regular />
              <span>{selectedCategory}</span>
              <ChevronDown20Regular />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="z-50 bg-white border shadow-lg">
            {categories.map((category) => (
              <DropdownMenuItem
                key={category}
                onClick={() => onCategoryChange(category)}
              >
                {category}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Meeting Reminders Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className={styles.dropdownTrigger}>
              <Alert20Regular />
              <span>{selectedReminder}</span>
              <ChevronDown20Regular />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="z-50 bg-white border shadow-lg">
            {reminders.map((reminder) => (
              <DropdownMenuItem
                key={reminder}
                onClick={() => onReminderChange(reminder)}
              >
                {reminder}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* More Options Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className={styles.dropdownTrigger}>
              <MoreHorizontal20Regular />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="z-50 bg-white border shadow-lg">
            <DropdownMenuItem>Save as Template</DropdownMenuItem>
            <DropdownMenuItem>Copy Meeting Link</DropdownMenuItem>
            <DropdownMenuItem>Export to Calendar</DropdownMenuItem>
            <DropdownMenuItem>Meeting Settings</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default MeetingToolbar;
