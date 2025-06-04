
import {
  Input,
  Switch,
  Field,
  Body1,
  makeStyles,
  tokens,
} from '@fluentui/react-components';
import { FormData } from './types';

const useStyles = makeStyles({
  formField: {
    marginBottom: tokens.spacingVerticalM,
  },
});

interface MeetingSettingsTabProps {
  formData: FormData;
  onInputChange: (field: keyof FormData, value: string | boolean) => void;
}

const MeetingSettingsTab = ({ formData, onInputChange }: MeetingSettingsTabProps) => {
  const styles = useStyles();

  return (
    <div>
      <Body1 style={{ marginBottom: tokens.spacingVerticalM }}>
        Advanced meeting settings and configurations
      </Body1>
      
      <Field
        label="Lobby Bypass"
        className={styles.formField}
      >
        <Input
          value={formData.lobbyBypass}
          onChange={(_, data) => onInputChange('lobbyBypass', data.value)}
          placeholder="Who can bypass the lobby"
        />
      </Field>

      <Field className={styles.formField}>
        <Switch
          checked={formData.allowAnonymous}
          onChange={(_, data) => onInputChange('allowAnonymous', data.checked)}
          label="Advanced recording options"
        />
      </Field>
    </div>
  );
};

export default MeetingSettingsTab;
