import { Routes, Route } from 'react-router-dom';
import { AppProvider } from './contexts/AppContext';
import Navbar from './components/layout/Navbar';
import SetupPage from './pages/SetupPage';
import AbsenceManagementPage from './pages/AbsenceManagementPage';
import RFFPaybackPage from './pages/RFFPaybackPage';
import SettingsPage from './pages/SettingsPage';

function App() {
  return (
    <AppProvider>
      <Navbar />
      <Routes>
        <Route path="/" element={<AbsenceManagementPage />} />
        <Route path="/setup" element={<SetupPage />} />
        <Route path="/rff-payback" element={<RFFPaybackPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Routes>
    </AppProvider>
  );
}

export default App;
