
import { FluentProvider, teamsLightTheme } from '@fluentui/react-components';
import MeetingForm from './components/MeetingForm';

function App() {
  return (
    <FluentProvider theme={teamsLightTheme}>
      <MeetingForm />
    </FluentProvider>
  );
}

export default App;
