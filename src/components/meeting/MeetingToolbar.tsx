
import { Button, makeStyles, tokens } from '@fluentui/react-components';
import { 
  Tag, 
  Bell, 
  MoreHorizontal, 
  Send, 
  Trash2,
  ChevronDown
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const useStyles = makeStyles({
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100vw',
    marginLeft: 'calc(-50vw + 50%)',
    padding: `${tokens.spacingVerticalM} ${tokens.spacingHorizontalXL}`,
    backgroundColor: tokens.colorNeutralBackground2,
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
    marginBottom: tokens.spacingVerticalL,
  },
  toolbarLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalM,
  },
  toolbarRight: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalS,
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
          icon={<Send size={16} />}
          onClick={onSend}
        >
          Send
        </Button>
        <Button
          appearance="subtle"
          icon={<Trash2 size={16} />}
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
              <Tag size={16} />
              <span>{selectedCategory}</span>
              <ChevronDown size={14} />
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
              <Bell size={16} />
              <span>{selectedReminder}</span>
              <ChevronDown size={14} />
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
              <MoreHorizontal size={16} />
              <ChevronDown size={14} />
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
