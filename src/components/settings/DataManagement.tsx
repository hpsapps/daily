import { Button } from "@/components/ui/button";
import * as ExcelJS from 'exceljs';
import { useContext } from 'react';
import { AppContext } from '../../contexts/AppContext';

const DataManagement = () => {
  const { state } = useContext(AppContext);

  const handleDownloadTemplate = (templateName: string) => {
    // Placeholder for template generation logic
    alert(`Downloading ${templateName} template... (Not yet implemented)`);
  };

  const handleExportData = () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Teachers");

    // Define columns based on Teacher interface
    worksheet.columns = [
      { header: 'ID', key: 'id', width: 10 },
      { header: 'Name', key: 'name', width: 30 },
      { header: 'Class Name', key: 'className', width: 20 },
      { header: 'Role', key: 'role', width: 20 },
    ];

    // Add rows from state.teachers
    state.teachers.forEach(teacher => {
      worksheet.addRow(teacher);
    });

    workbook.xlsx.writeFile("daily_changes_data.xlsx")
      .then(() => {
        console.log('Exporting all application data...');
        alert('Data exported successfully!');
      })
      .catch(error => {
        console.error('Error exporting data:', error);
        alert('Failed to export data.');
      });
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
