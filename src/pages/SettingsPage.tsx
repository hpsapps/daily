import SchoolInfoForm from '../components/settings/SchoolInfoForm';
import CasualTeacherManager from '../components/settings/CasualTeacherManager';
import DataManagement from '../components/settings/DataManagement';
import CalendarUpload from '../components/settings/CalendarUpload';
import FileUploadArea from '../components/settings/FileUploadArea';
import RosterDisplay from '../components/settings/RosterDisplay';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../components/ui/accordion';

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
        <div>
          <h2 className="text-xl font-semibold mb-2">School Calendar</h2>
          <CalendarUpload />
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-2">Initial Data Upload</h2>
          <p className="mb-4">
            Upload your school's data using the Excel templates.
          </p>
          <FileUploadArea />
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
