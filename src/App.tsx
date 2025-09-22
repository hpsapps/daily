import { Routes, Route } from 'react-router-dom';
import { AppProvider } from './contexts/AppContext';
import Navbar from './components/layout/Navbar';
import RFFPaybackPage from './pages/RFFPaybackPage';
import SettingsPage from './pages/SettingsPage';
import DailyCasualHome from './pages/DailyCasualHome';

function App() {
  return (
    <AppProvider>
      <Navbar />
      <Routes>
        <Route path="/" element={<DailyCasualHome />} />
        <Route path="/rff-payback" element={<RFFPaybackPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Routes>
    </AppProvider>
  );
}

export default App;
