import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PencilIcon } from 'lucide-react';

interface SchoolInfoDisplayProps {
  onEdit: () => void;
}

const SchoolInfoDisplay = ({ onEdit }: SchoolInfoDisplayProps) => {
  const [schoolName, setSchoolName] = useState('');
  const [schoolAddress, setSchoolAddress] = useState('');
  const [schoolPhone, setSchoolPhone] = useState('');
  const [schoolEmail, setSchoolEmail] = useState('');

  useEffect(() => {
    const savedSchoolInfo = localStorage.getItem('schoolInfo');
    if (savedSchoolInfo) {
      const { name, address, phone, email } = JSON.parse(savedSchoolInfo);
      setSchoolName(name || '');
      setSchoolAddress(address || '');
      setSchoolPhone(phone || '');
      setSchoolEmail(email || '');
    }
  }, []);

  return (
    <Card className="p-4">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-medium">School Information</CardTitle>
        <Button variant="ghost" size="icon" onClick={onEdit}>
          <PencilIcon className="h-4 w-4 text-muted-foreground" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-2">
        <p><strong>Name:</strong> {schoolName || 'N/A'}</p>
        <p><strong>Address:</strong> {schoolAddress || 'N/A'}</p>
        <p><strong>Email:</strong> {schoolEmail || 'N/A'}</p>
        <p><strong>Phone:</strong> {schoolPhone || 'N/A'}</p>
      </CardContent>
    </Card>
  );
};

export default SchoolInfoDisplay;
