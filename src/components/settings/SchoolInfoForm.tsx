import { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface SchoolInfoFormProps {
  onSave: () => void;
}

const SchoolInfoForm = ({ onSave }: SchoolInfoFormProps) => {
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const schoolInfo = { name: schoolName, address: schoolAddress, phone: schoolPhone, email: schoolEmail };
    localStorage.setItem('schoolInfo', JSON.stringify(schoolInfo));
    onSave();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="schoolName">School Name</Label>
        <Input
          id="schoolName"
          type="text"
          value={schoolName}
          onChange={(e) => setSchoolName(e.target.value)}
          placeholder="e.g., Happy Valley High School"
        />
      </div>
      <div>
        <Label htmlFor="schoolAddress">Address</Label>
        <Input
          id="schoolAddress"
          type="text"
          value={schoolAddress}
          onChange={(e) => setSchoolAddress(e.target.value)}
          placeholder="e.g., 123 School Lane"
        />
      </div>
      <div>
        <Label htmlFor="schoolEmail">Email</Label>
        <Input
          id="schoolEmail"
          type="email"
          value={schoolEmail}
          onChange={(e) => setSchoolEmail(e.target.value)}
          placeholder="e.g., info@happyvalley.edu"
        />
      </div>
      <div>
        <Label htmlFor="schoolPhone">Phone Number</Label>
        <Input
          id="schoolPhone"
          type="tel"
          value={schoolPhone}
          onChange={(e) => setSchoolPhone(e.target.value)}
          placeholder="e.g., (123) 456-7890"
        />
      </div>
      <Button type="submit">Save School Info</Button>
    </form>
  );
};

export default SchoolInfoForm;
