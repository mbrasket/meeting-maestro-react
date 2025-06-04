
import { FluentProvider, teamsLightTheme } from '@fluentui/react-components';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Index from './pages/Index';

function App() {
  return (
    <FluentProvider theme={teamsLightTheme}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
        </Routes>
      </BrowserRouter>
    </FluentProvider>
  );
}

export default App;
