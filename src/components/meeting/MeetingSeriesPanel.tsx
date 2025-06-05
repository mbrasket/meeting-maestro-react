
import {
  Text,
  makeStyles,
  tokens,
} from '@fluentui/react-components';
import { FormData, RecurringPattern, OneOffInstance } from './types';
import RecurringPatternSection from './recurring/RecurringPatternSection';
import OneOffInstancesSection from './recurring/OneOffInstancesSection';

const useStyles = makeStyles({
  panelTitle: {
    marginBottom: tokens.spacingVerticalL,
    fontSize: tokens.fontSizeBase400,
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorNeutralForeground1,
  },
});

interface MeetingSeriesPanelProps {
  formData: FormData;
  onInputChange: (field: keyof FormData, value: string | boolean | RecurringPattern | OneOffInstance[]) => void;
}

const MeetingSeriesPanel = ({ formData, onInputChange }: MeetingSeriesPanelProps) => {
  const styles = useStyles();

  const handleRecurringPatternChange = (pattern: RecurringPattern) => {
    onInputChange('recurringPattern', pattern);
  };

  const handleOneOffInstancesChange = (instances: OneOffInstance[]) => {
    onInputChange('oneOffInstances', instances);
  };

  return (
    <div>
      <Text className={styles.panelTitle}>Series Configuration</Text>
      
      <RecurringPatternSection
        pattern={formData.recurringPattern}
        onPatternChange={handleRecurringPatternChange}
      />
      
      <OneOffInstancesSection
        instances={formData.oneOffInstances}
        onInstancesChange={handleOneOffInstancesChange}
      />
    </div>
  );
};

export default MeetingSeriesPanel;
