import { useContext } from 'react';
import { AppContext } from '../../contexts/AppContext';

const RosterDisplay = () => {
  const { state } = useContext(AppContext);
  const { rffRoster, teachers, dutySlots } = state;

  if (!rffRoster || rffRoster.length === 0) {
    return <p className="text-sm text-gray-500">No RFF Roster data loaded yet.</p>;
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-medium mb-2">Teachers Data</h3>
        <div className="overflow-x-auto">
          <pre className="bg-gray-100 p-4 rounded-md text-xs whitespace-pre-wrap">
            {JSON.stringify(teachers, null, 2)}
          </pre>
        </div>
      </div>
      <div>
        <h3 className="text-lg font-medium mb-2">RFF Roster Data</h3>
        <div className="overflow-x-auto">
          <pre className="bg-gray-100 p-4 rounded-md text-xs whitespace-pre-wrap">
            {JSON.stringify(rffRoster, null, 2)}
          </pre>
        </div>
      </div>
      <div>
        <h3 className="text-lg font-medium mb-2">Duties Data</h3>
        <div className="overflow-x-auto">
          <pre className="bg-gray-100 p-4 rounded-md text-xs whitespace-pre-wrap">
            {JSON.stringify(dutySlots, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default RosterDisplay;
