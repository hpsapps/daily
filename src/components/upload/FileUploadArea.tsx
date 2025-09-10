import { useCallback, useContext } from 'react';
import { useDropzone } from 'react-dropzone';
import { parseExcelData } from '../../utils/excelParser';
import { AppContext } from '../../contexts/AppContext';

const FileUploadArea = () => {
  const { dispatch } = useContext(AppContext);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });
      try {
        const data = await parseExcelData(acceptedFiles[0]);
        dispatch({ type: 'LOAD_DATA', payload: data });
        console.log('Parsed data:', data);
      } catch (error: any) {
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

  return (
    <div {...getRootProps()} className="border-2 border-dashed border-gray-400 rounded-lg p-8 text-center cursor-pointer">
      <input {...getInputProps()} />
      {isDragActive ? (
        <p>Drop the Excel file here ...</p>
      ) : (
        <p>Drag 'n' drop your .xlsx file here, or click to select it</p>
      )}
    </div>
  );
};

export default FileUploadArea;
