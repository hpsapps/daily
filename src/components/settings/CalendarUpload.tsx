import { Button } from "@/components/ui/button";

const CalendarUpload = () => {
  const handleUploadCalendar = () => {
    alert("Calendar upload coming soon!");
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-medium mb-2">School Calendar Management</h3>
        <p className="text-sm text-gray-500 mb-2">Upload a CSV file to update term dates.</p>
        <Button onClick={handleUploadCalendar}>Upload School Calendar (CSV)</Button>
      </div>
    </div>
  );
};

export default CalendarUpload;
