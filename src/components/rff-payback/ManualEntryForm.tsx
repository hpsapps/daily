import { useState, useContext } from 'react';
import { AppContext } from '../../contexts/AppContext';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import type { RFFDebt } from '../../types';

const ManualEntryForm = () => {
  const { dispatch } = useContext(AppContext);
  const [teacherId, setTeacherId] = useState('');
  const [hoursOwed, setHoursOwed] = useState('');
  const [reason, setReason] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!teacherId || !hoursOwed || !reason) {
      alert('Please fill in all fields.');
      return;
    }

    const newDebt: RFFDebt = {
      id: `debt-${Date.now()}`, // Simple unique ID
      teacherId,
      hoursOwed: parseFloat(hoursOwed),
      reason,
      dateCreated: new Date(),
    };

    dispatch({ type: 'ADD_RFF_DEBT', payload: newDebt });

    console.log('New RFF Debt:', newDebt);

    // Clear form
    setTeacherId('');
    setHoursOwed('');
    setReason('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="teacherId">Teacher ID</Label>
        <Input
          id="teacherId"
          type="text"
          value={teacherId}
          onChange={(e) => setTeacherId(e.target.value)}
          placeholder="e.g., T001"
        />
      </div>
      <div>
        <Label htmlFor="hoursOwed">Hours Owed</Label>
        <Input
          id="hoursOwed"
          type="number"
          value={hoursOwed}
          onChange={(e) => setHoursOwed(e.target.value)}
          placeholder="e.g., 2.5"
          step="0.5"
        />
      </div>
      <div>
        <Label htmlFor="reason">Reason</Label>
        <Input
          id="reason"
          type="text"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="e.g., Covering absent colleague"
        />
      </div>
      <Button type="submit">Add RFF Debt</Button>
    </form>
  );
};

export default ManualEntryForm;
