import TeacherSelector from '../components/absence/TeacherSelector';
import CasualInstructionGenerator from '../components/assignment/CasualInstructionGenerator';
import DutyManager from '../components/assignment/DutyManager';

const AbsenceManagementPage = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Absence Management</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-1">
          <TeacherSelector />
        </div>
        <div className="md:col-span-2 space-y-4">
          {/* ConflictDisplay and AssignmentInterface will go here */}
          <CasualInstructionGenerator />
          <DutyManager />
        </div>
      </div>
    </div>
  );
};

export default AbsenceManagementPage;
