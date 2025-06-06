
import { FluentProvider, teamsLightTheme } from '@fluentui/react-components';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Navigation from './components/navigation/Navigation';
import MeetingPage from './pages/MeetingPage';
import CalendarPage from './pages/CalendarPage';

function App() {
  return (
    <FluentProvider theme={teamsLightTheme}>
      <DndProvider backend={HTML5Backend}>
        <Router>
          <Navigation />
          <Routes>
            <Route path="/" element={<MeetingPage />} />
            <Route path="/calendar" element={<CalendarPage />} />
          </Routes>
        </Router>
      </DndProvider>
    </FluentProvider>
  );
}

export default App;
