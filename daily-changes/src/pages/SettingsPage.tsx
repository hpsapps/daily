import SchoolInfoForm from '../components/settings/SchoolInfoForm';
import CasualTeacherManager from '../components/settings/CasualTeacherManager';
import DataManagement from '../components/settings/DataManagement';

const SettingsPage = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Settings</h1>
      <div className="space-y-8">
        <div>
          <h2 className="text-xl font-semibold mb-2">School Information</h2>
          <SchoolInfoForm />
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-2">Casual Teacher Management</h2>
          <CasualTeacherManager />
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-2">Data Management</h2>
          <DataManagement />
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
