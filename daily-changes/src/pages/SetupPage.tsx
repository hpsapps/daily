import FileUploadArea from '../components/upload/FileUploadArea';

const SetupPage = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Setup</h1>
      <p className="mb-4">
        Upload your school's data using the Excel templates.
      </p>
      <FileUploadArea />
    </div>
  );
};

export default SetupPage;
