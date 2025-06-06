
import { FluentProvider, teamsLightTheme } from '@fluentui/react-components';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { DragDropContext } from '@hello-pangea/dnd';
import Navigation from './components/navigation/Navigation';
import MeetingPage from './pages/MeetingPage';
import CalendarPage from './pages/CalendarPage';

function App() {
  const handleDragEnd = (result: any) => {
    // This will be handled by the CalendarPage component
    console.log('Drag ended:', result);
  };

  return (
    <FluentProvider theme={teamsLightTheme}>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Router>
          <Navigation />
          <Routes>
            <Route path="/" element={<MeetingPage />} />
            <Route path="/calendar" element={<CalendarPage />} />
          </Routes>
        </Router>
      </DragDropContext>
    </FluentProvider>
  );
}

export default App;
