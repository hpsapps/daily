import { useContext, useState } from 'react';
import { AppContext } from '../../contexts/AppContext';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import type { DutyAssignment } from '../../types';

const DutyManager = () => {
  const { state, dispatch } = useContext(AppContext);
  const { dutySlots } = state; // Assuming dutySlots contains all possible duties

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newDutyTimeSlot, setNewDutyTimeSlot] = useState('');
  const [newDutyLocation, setNewDutyLocation] = useState('');

  // Placeholder for actual assigned duties (inherited + manual)
  const assignedDuties: DutyAssignment[] = [
    // Example inherited duty
    { timeSlot: 'Recess', location: 'Playground', type: 'inherited' },
    // Example manual duty
    { timeSlot: 'Lunch 1', location: 'Canteen', type: 'manual' },
  ];

  const handleAddDuty = () => {
    if (!newDutyTimeSlot || !newDutyLocation) {
      alert('Time slot and location are required.');
      return;
    }
    const newDuty: DutyAssignment = {
      timeSlot: newDutyTimeSlot,
      location: newDutyLocation,
      type: 'manual',
    };
    // dispatch({ type: 'ADD_MANUAL_DUTY', payload: newDuty }); // Action to be defined
    console.log('Adding manual duty:', newDuty);
    setNewDutyTimeSlot('');
    setNewDutyLocation('');
    setIsAddModalOpen(false);
  };

  const handleDeleteDuty = (index: number) => {
    if (confirm('Are you sure you want to delete this duty?')) {
      // dispatch({ type: 'DELETE_DUTY', payload: index }); // Action to be defined
      console.log('Deleting duty at index:', index);
    }
  };

  return (
    <div>
      <Button onClick={() => setIsAddModalOpen(true)} className="mb-4">Add Manual Duty</Button>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Time Slot</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Type</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {assignedDuties.length > 0 ? (
              assignedDuties.map((duty, index) => (
                <TableRow key={index}>
                  <TableCell>{duty.timeSlot}</TableCell>
                  <TableCell>{duty.location}</TableCell>
                  <TableCell>{duty.type}</TableCell>
                  <TableCell className="text-right">
                    {duty.type === 'manual' && (
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteDuty(index)}
                      >
                        Delete
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center">
                  No duties assigned.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Add Manual Duty Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
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
            <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
            <Button onClick={handleAddDuty}>Add Duty</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DutyManager;
