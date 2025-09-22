import { Button } from "@/components/ui/button";
import * as ExcelJS from 'exceljs';
import { useContext } from 'react';
import { AppContext } from '../../contexts/AppContext';
import FileUploadArea from './FileUploadArea'; // Import FileUploadArea
import CalendarUpload from './CalendarUpload'; // Import CalendarUpload

const DataManagement = () => {
  const { state } = useContext(AppContext);

  const handleDownloadTemplate = () => {
    alert(`Downloading RFF and Duty template... (Not yet implemented)`);
  };

  const handleExportData = () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Teachers");

    worksheet.columns = [
      { header: 'ID', key: 'id', width: 10 },
      { header: 'Name', key: 'name', width: 30 },
      { header: 'Class Name', key: 'className', width: 20 },
      { header: 'Role', key: 'role', width: 20 },
    ];

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
    <div className="space-y-6">
      {/* Data Upload Section */}
      <div>
        <h3 className="text-lg font-medium mb-2">Upload Data</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Upload your school's RFF & Duty data (Excel) and school year calendar (CSV).
        </p>
        <div className="space-y-4">
          <FileUploadArea /> {/* For RFF & Duty .xlsx */}
          <CalendarUpload /> {/* For School Year Calendar .csv */}
        </div>
      </div>

      {/* Template Download Section */}
      <div>
        <h3 className="text-lg font-medium mb-2">Download Templates</h3>
        <Button onClick={handleDownloadTemplate}>RFF and Duty Template</Button>
      </div>

      {/* Data Export Section */}
      <div>
        <h3 className="text-lg font-medium mb-2">Export Application Data</h3>
        <Button onClick={handleExportData}>Export All Data to Excel</Button>
      </div>
    </div>
  );
};

export default DataManagement;
