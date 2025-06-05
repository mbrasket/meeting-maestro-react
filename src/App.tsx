
import { FluentProvider, teamsLightTheme } from '@fluentui/react-components';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MeetingForm from './components/MeetingForm';

function App() {
  return (
    <FluentProvider theme={teamsLightTheme}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MeetingForm />} />
        </Routes>
      </BrowserRouter>
    </FluentProvider>
  );
}

export default App;
