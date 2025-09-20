import React, { useState, useContext } from 'react';
import { AppContext } from '../../../contexts/AppContext';
import { Button } from '../../ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from '../../ui/label';
import { Input } from '../../ui/input';

interface AddManualDutyDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const AddManualDutyDialog: React.FC<AddManualDutyDialogProps> = ({ isOpen, onOpenChange }) => {
  const { dispatch } = useContext(AppContext);
  const [newDutyTimeSlot, setNewDutyTimeSlot] = useState('');
  const [newDutyLocation, setNewDutyLocation] = useState('');

  const handleAddDuty = () => {
    if (newDutyTimeSlot && newDutyLocation) {
      dispatch({
        type: 'ADD_MANUAL_DUTY',
        payload: {
          timeSlot: newDutyTimeSlot,
          location: newDutyLocation,
          type: 'manual'
        }
      });
      setNewDutyTimeSlot('');
      setNewDutyLocation('');
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Manual Duty</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="timeSlot" className="text-right">
              Time Slot
            </Label>
            <Input
              id="timeSlot"
              value={newDutyTimeSlot}
              onChange={(e) => setNewDutyTimeSlot(e.target.value)}
              className="col-span-3"
              placeholder="e.g., Recess, Lunch 1"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="location" className="text-right">
              Location
            </Label>
            <Input
              id="location"
              value={newDutyLocation}
              onChange={(e) => setNewDutyLocation(e.target.value)}
              className="col-span-3"
              placeholder="e.g., Playground, Library"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleAddDuty}>Add Duty</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddManualDutyDialog;
