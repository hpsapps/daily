import React, { useState, useContext, useEffect } from 'react';
import { AppContext } from '../../../contexts/AppContext';
import { Button } from '../../ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription, // Import DialogDescription
} from "@/components/ui/dialog";
import { Label } from '../../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { Schedule, ScheduleEntry, Teacher } from '../../../types';

interface ReassignRffDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  currentRff: ScheduleEntry | null; // The RFF entry being edited
  schedule: Schedule | null;
  selectedTeacher: Teacher | null; // Add selectedTeacher prop
  onSave: (originalEntry: ScheduleEntry, updatedEntry: ScheduleEntry) => void; // Add onSave prop
}

const ReassignRffDialog: React.FC<ReassignRffDialogProps> = ({ isOpen, onOpenChange, currentRff, schedule, selectedTeacher, onSave }) => {
  const { state } = useContext(AppContext);
  // Get all unique class names and sort them alphabetically
  const allClasses = Array.from(new Set(state.teachers.filter(t => t.className).map(t => t.className!))).sort();

  const [reassignedClass, setReassignedClass] = useState('');

  useEffect(() => {
    if (currentRff?.class) { // Use optional chaining for safer access
      setReassignedClass(currentRff.class);
    } else {
      setReassignedClass(''); // Reset if no class is found
    }
  }, [currentRff]);

  const handleReassignRff = () => {
    if (!schedule || !currentRff || !reassignedClass || !selectedTeacher) return;

    const updatedEntry: ScheduleEntry = {
      ...currentRff,
      class: reassignedClass,
      description: `Class with ${selectedTeacher.name} for ${reassignedClass}`, // Update description
    };
    onSave(currentRff, updatedEntry); // Pass original entry and updated entry
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Reassign RFF</DialogTitle>
          <DialogDescription>
            Reassign the RFF period for {currentRff?.time} - {currentRff?.description}.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="rffClass" className="text-right">
              Assign to Class
            </Label>
            <Select onValueChange={setReassignedClass} value={reassignedClass}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select a class" />
              </SelectTrigger>
              <SelectContent>
                {allClasses.map(className => (
                  <SelectItem key={className} value={className}>{className}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleReassignRff}>Reassign RFF</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReassignRffDialog;
