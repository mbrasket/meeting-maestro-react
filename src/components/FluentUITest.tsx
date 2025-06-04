
import { Input, Field } from '@fluentui/react-components';

const FluentUITest = () => {
  return (
    <div style={{ padding: '20px', maxWidth: '400px' }}>
      <h3>Fluent UI Underline Input Test</h3>
      
      <Field label="Test Underline Input" style={{ marginBottom: '20px' }}>
        <Input 
          appearance="underline" 
          placeholder="Hover over this input to see underline change"
        />
      </Field>
      
      <Field label="Regular Input for Comparison" style={{ marginBottom: '20px' }}>
        <Input 
          appearance="outline" 
          placeholder="Regular input"
        />
      </Field>
      
      <Field label="Filled Input for Comparison">
        <Input 
          appearance="filled-darker" 
          placeholder="Filled input"
        />
      </Field>
    </div>
  );
};

export default FluentUITest;
