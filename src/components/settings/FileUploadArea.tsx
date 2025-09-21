import { useCallback, useContext, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { parseExcelData, type RFFRosterEntry } from '../../utils/excelParser';
import { AppContext } from '../../contexts/AppContext';
import { Button } from '@/components/ui/button';
import type { Teacher, DutySlot } from '../../types';

const FileUploadArea = () => {
  const { dispatch } = useContext(AppContext);
  const [parsedRoster, setParsedRoster] = useState<RFFRosterEntry[] | null>(null);
  const [parsedTeachers, setParsedTeachers] = useState<Teacher[] | null>(null);
  const [parsedDutySlots, setParsedDutySlots] = useState<DutySlot[] | null>(null); // New state for parsed duty slots
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [uploadMessage, setUploadMessage] = useState<string>('');

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });
      setParsedRoster(null); // Clear previous parsed data
      setParsedTeachers(null);
      setParsedDutySlots(null); // Clear previous parsed duty slots
      setUploadStatus('idle'); // Reset status
      setUploadMessage(''); // Clear message

      try {
        const data = await parseExcelData(acceptedFiles[0]);
        setParsedRoster(data.rffRoster); // Store parsed roster locally
        setParsedTeachers(data.teachers);
        setParsedDutySlots(data.dutySlots); // Store parsed duty slots locally
        setUploadStatus('success');
        setUploadMessage('File parsed successfully! Choose an action below.');
        console.log('Parsed RFF Roster:', data.rffRoster);
        console.log('Parsed Teachers:', data.teachers);
        console.log('Parsed Duty Slots:', data.dutySlots);
      } catch (error: any) {
        setUploadStatus('error');
        setUploadMessage(`Error: ${error.message || 'Failed to parse Excel file.'}`);
        dispatch({ type: 'SET_ERROR', payload: error.message || 'Failed to parse Excel file.' });
        console.error('Error parsing Excel file:', error);
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    }
  }, [dispatch]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
    },
  });

  const handleLoadData = () => {
    if (parsedRoster && parsedTeachers && parsedDutySlots) {
      dispatch({
        type: 'LOAD_RFF_ROSTER',
        payload: {
          rffRoster: parsedRoster,
          teachers: parsedTeachers,
          dutySlots: parsedDutySlots, // Include duty slots in payload
        },
      });
      alert('RFF Roster, Teachers, and Duties loaded into application state and persisted!');
      setParsedRoster(null); // Clear after loading
      setParsedTeachers(null);
      setParsedDutySlots(null);
    }
  };

  const handleDownloadJson = () => {
    if (parsedRoster) {
      const jsonString = JSON.stringify(parsedRoster, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'rff_roster.json';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      alert('RFF Roster JSON downloaded!');
      setParsedRoster(null); // Clear after downloading
    }
  };

  return (
    <div className="space-y-4">
      <div {...getRootProps()} className="border-2 border-dashed border-gray-400 rounded-lg p-8 text-center cursor-pointer">
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the Excel file here ...</p>
        ) : (
          <p>Drag 'n' drop your .xlsx file here, or click to select it</p>
        )}
      </div>

      {uploadStatus === 'success' && (
        <p className="text-green-600 text-center">{uploadMessage}</p>
      )}
      {uploadStatus === 'error' && (
        <p className="text-red-600 text-center">{uploadMessage}</p>
      )}

      {parsedRoster && parsedTeachers && parsedDutySlots && (
        <div className="flex justify-center space-x-4 mt-4">
          <Button onClick={handleLoadData}>Load Data into App</Button>
          <Button onClick={handleDownloadJson} variant="outline">Download JSON</Button>
        </div>
      )}
    </div>
  );
};

export default FileUploadArea;
