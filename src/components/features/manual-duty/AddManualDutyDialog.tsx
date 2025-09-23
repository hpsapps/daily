import React, { useState, useContext, useEffect } from 'react';
import { AppContext } from '../../../contexts/AppContext';
import { Button } from '../../ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from '../../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { DutySlot } from '../../../types';

interface AddManualDutyDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  dutySlots: DutySlot[];
  selectedTeacherId: string | null; // Add selectedTeacherId prop
  selectedDate: Date | null; // Add selectedDate prop
}

const timeSlotMapping: { [key: string]: string } = {
  "Before School": "8:35-9:05",
  "Recess": "11:10-11:35",
  "First Lunch": "13:05-13:25",
  "Second Lunch": "13:25-13:45",
  "After School": "15:05", // Assuming 15:05-15:25 for consistency if needed
};

const AddManualDutyDialog: React.FC<AddManualDutyDialogProps> = ({ isOpen, onOpenChange, dutySlots, selectedTeacherId, selectedDate }) => {
  const { dispatch } = useContext(AppContext);
  const [selectedTimeSlotName, setSelectedTimeSlotName] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [generatedDescription, setGeneratedDescription] = useState('');
  const [availableLocations, setAvailableLocations] = useState<string[]>([]);

  const timeSlotOptions = Object.keys(timeSlotMapping);

  useEffect(() => {
    if (selectedTimeSlotName) {
      const timePeriod = timeSlotMapping[selectedTimeSlotName];
      const filteredLocations = Array.from(
        new Set(
          dutySlots
            .filter((slot) => slot.timeSlot === timePeriod)
            .map((slot) => slot.area)
        )
      ).sort();
      setAvailableLocations(filteredLocations);
      setSelectedLocation(''); // Reset selected location when time slot changes
    } else {
      setAvailableLocations([]);
      setSelectedLocation('');
    }
  }, [selectedTimeSlotName, dutySlots]);

  useEffect(() => {
    if (selectedTimeSlotName && selectedLocation) {
      setGeneratedDescription(`${selectedTimeSlotName} at ${selectedLocation}`);
    } else {
      setGeneratedDescription('');
    }
  }, [selectedTimeSlotName, selectedLocation]);

  const handleAddDuty = () => {
    const timePeriod = timeSlotMapping[selectedTimeSlotName];
    if (timePeriod && selectedLocation && generatedDescription) {
      dispatch({
        type: 'ADD_MANUAL_DUTY',
        payload: {
          id: crypto.randomUUID(), // Generate a unique ID for manual duties
          timeSlot: timePeriod,
          location: selectedLocation,
          type: 'manual',
          when: selectedTimeSlotName, // Store the user-friendly name here
          description: generatedDescription, // Add generated description
          teacherId: selectedTeacherId || undefined, // Add teacherId
          date: selectedDate?.toLocaleDateString('en-CA', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '-'), // Add date, format as YYYY-MM-DD
        }
      });
      setSelectedTimeSlotName('');
      setSelectedLocation('');
      setGeneratedDescription('');
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Manual Duty</DialogTitle>
          <DialogDescription>
            Add a new duty assignment for the selected teacher.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="timeSlot" className="text-right">
              Time Slot
            </Label>
            <Select onValueChange={setSelectedTimeSlotName} value={selectedTimeSlotName}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select a time slot" />
              </SelectTrigger>
              <SelectContent>
                {timeSlotOptions.map(option => (
                  <SelectItem key={option} value={option}>{option}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="location" className="text-right">
              Location
            </Label>
            <Select onValueChange={setSelectedLocation} value={selectedLocation} disabled={!selectedTimeSlotName}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select a location" />
              </SelectTrigger>
              <SelectContent>
                {availableLocations.map(location => (
                  <SelectItem key={location} value={location}>{location}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Description
            </Label>
            <p id="description" className="col-span-3 p-2 border rounded-md bg-secondary text-muted-foreground">
              {generatedDescription || 'Select time slot and location'}
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleAddDuty} disabled={!selectedTimeSlotName || !selectedLocation}>Add Duty</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddManualDutyDialog;
