import { useState } from 'react';
import SchoolInfoForm from '../components/settings/SchoolInfoForm';
import SchoolInfoDisplay from '../components/settings/SchoolInfoDisplay'; // Import the new display component
import CasualTeacherManager from '../components/settings/CasualTeacherManager';
import DataManagement from '../components/settings/DataManagement';
import RosterDisplay from '../components/settings/RosterDisplay';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../components/ui/accordion';

const SettingsPage = () => {
  const [isEditingSchoolInfo, setIsEditingSchoolInfo] = useState(false);

  const handleSchoolInfoSaved = () => {
    setIsEditingSchoolInfo(false);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Settings</h1>
      <div className="space-y-8">
        <div>
          <h2 className="text-xl font-semibold mb-2">School Information</h2>
          {isEditingSchoolInfo ? (
            <SchoolInfoForm onSave={handleSchoolInfoSaved} />
          ) : (
            <SchoolInfoDisplay onEdit={() => setIsEditingSchoolInfo(true)} />
          )}
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-2">Casual Teacher Management</h2>
          <CasualTeacherManager />
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-2">Data Management</h2>
          <DataManagement />
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">Current Roster Data</h2>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>View Loaded Roster (JSON)</AccordionTrigger>
              <AccordionContent>
                <RosterDisplay />
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
