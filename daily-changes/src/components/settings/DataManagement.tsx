import { Button } from "@/components/ui/button";
import * as XLSX from 'xlsx';
import { useContext } from 'react';
import { AppContext } from '../../contexts/AppContext';

const DataManagement = () => {
  const { state } = useContext(AppContext);

  const handleDownloadTemplate = (templateName: string) => {
    // Placeholder for template generation logic
    alert(`Downloading ${templateName} template... (Not yet implemented)`);
  };

  const handleExportData = () => {
    // Example: Exporting teachers data
    const ws = XLSX.utils.json_to_sheet(state.teachers);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Teachers");
    XLSX.writeFile(wb, "daily_changes_data.xlsx");
    console.log('Exporting all application data...');
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-medium mb-2">Download Templates</h3>
        <div className="flex space-x-2">
          <Button onClick={() => handleDownloadTemplate('RFF_Duties')}>RFF/Duties Template</Button>
          <Button onClick={() => handleDownloadTemplate('Teacher_Class_Map')}>Teacher-Class Map Template</Button>
        </div>
      </div>
      <div>
        <h3 className="text-lg font-medium mb-2">Export Application Data</h3>
        <Button onClick={handleExportData}>Export All Data to Excel</Button>
      </div>
    </div>
  );
};

export default DataManagement;
