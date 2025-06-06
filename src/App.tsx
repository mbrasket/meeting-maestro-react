
import { FluentProvider, teamsLightTheme } from '@fluentui/react-components';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/navigation/Navigation';
import MeetingPage from './pages/MeetingPage';
import CalendarPage from './pages/CalendarPage';

function App() {
  return (
    <FluentProvider theme={teamsLightTheme}>
      <Router>
        <Navigation />
        <Routes>
          <Route path="/" element={<MeetingPage />} />
          <Route path="/calendar" element={<CalendarPage />} />
        </Routes>
      </Router>
    </FluentProvider>
  );
}

export default App;
