
import { 
  Input,
  Switch,
  Field,
  makeStyles,
  tokens,
} from '@fluentui/react-components';
import { Video20Regular } from '@fluentui/react-icons';
import { FormData } from './types';

const useStyles = makeStyles({
  teamsSection: {
    marginTop: tokens.spacingVerticalL,
    padding: tokens.spacingVerticalM,
    borderRadius: tokens.borderRadiusMedium,
    backgroundColor: tokens.colorNeutralBackground2,
  },
  formField: {
    marginBottom: tokens.spacingVerticalM,
  },
});

interface TeamsSettingsSectionProps {
  formData: FormData;
  onInputChange: (field: keyof FormData, value: string | boolean) => void;
}

const TeamsSettingsSection = ({ formData, onInputChange }: TeamsSettingsSectionProps) => {
  const styles = useStyles();

  return (
    <div className={styles.teamsSection}>
      <Field className={styles.formField}>
        <Switch
          checked={formData.isTeamsMeeting}
          onChange={(_, data) => onInputChange('isTeamsMeeting', data.checked)}
          label="Teams Meeting"
        />
      </Field>

      {formData.isTeamsMeeting && (
        <>
          <Field
            label="Meeting Link"
            className={styles.formField}
          >
            <Input
              value="https://teams.microsoft.com/l/meetup-join/..."
              readOnly
              contentBefore={<Video20Regular />}
            />
          </Field>

          <Field className={styles.formField}>
            <Switch
              checked={formData.allowAnonymous}
              onChange={(_, data) => onInputChange('allowAnonymous', data.checked)}
              label="Allow anonymous participants"
            />
          </Field>

          <Field className={styles.formField}>
            <Switch
              checked={formData.enableChat}
              onChange={(_, data) => onInputChange('enableChat', data.checked)}
              label="Enable meeting chat"
            />
          </Field>

          <Field className={styles.formField}>
            <Switch
              checked={formData.enableRecording}
              onChange={(_, data) => onInputChange('enableRecording', data.checked)}
              label="Enable meeting recording"
            />
          </Field>
        </>
      )}
    </div>
  );
};

export default TeamsSettingsSection;
