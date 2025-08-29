import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const SchoolInfoForm = () => {
  const [schoolName, setSchoolName] = useState('');
  const [schoolAddress, setSchoolAddress] = useState('');
  const [schoolPhone, setSchoolPhone] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('School Info Saved:', { schoolName, schoolAddress, schoolPhone });
    // Here you would typically dispatch an action to save this to global state or localStorage
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
