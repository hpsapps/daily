import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription,
} from "@/components/ui/dialog";
import { Button } from '../../ui/button';
import { Label } from '../../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { ScheduleEntry, DutySlot } from '../../../types';

interface EditDutyDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    entry: ScheduleEntry | null;
    dutySlots: DutySlot[];
    onSave: (originalEntry: ScheduleEntry, updatedEntry: ScheduleEntry) => void;
}

const timeSlotMapping: { [key: string]: string } = {
    "Before School": "8:35-9:05",
    "Recess": "11:10-11:35",
    "First Lunch": "13:05-13:25",
    "Second Lunch": "13:25-13:45",
    "After School": "15:05-15:25",
};

export const EditDutyDialog: React.FC<EditDutyDialogProps> = ({ isOpen, onOpenChange, entry, dutySlots, onSave }) => {
    const [selectedTimeSlotName, setSelectedTimeSlotName] = useState('');
    const [selectedLocation, setSelectedLocation] = useState('');
    const [generatedDescription, setGeneratedDescription] = useState('');
    const [availableLocations, setAvailableLocations] = useState<string[]>([]);

    const timeSlotOptions = Object.keys(timeSlotMapping);

    useEffect(() => {
        if (entry && entry.type === 'Duty') {
            const whenFromDescription = entry.description.split(' at ')[0];
            setSelectedTimeSlotName(whenFromDescription);
            setSelectedLocation(entry.location || '');
        } else {
            setSelectedTimeSlotName('');
            setSelectedLocation('');
        }
    }, [entry]);

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
            // Only reset selectedLocation if the current one is not in the new availableLocations
            if (!filteredLocations.includes(selectedLocation)) {
                setSelectedLocation('');
            }
        } else {
            setAvailableLocations([]);
            setSelectedLocation('');
        }
    }, [selectedTimeSlotName, dutySlots, selectedLocation]); // Added selectedLocation to dependencies

    useEffect(() => {
        if (selectedTimeSlotName && selectedLocation) {
            setGeneratedDescription(`${selectedTimeSlotName} at ${selectedLocation}`);
        } else {
            setGeneratedDescription('');
        }
    }, [selectedTimeSlotName, selectedLocation]);

    const handleSave = () => {
        const timePeriod = timeSlotMapping[selectedTimeSlotName];
        if (entry && timePeriod && selectedLocation && generatedDescription) {
            const updatedEntry: ScheduleEntry = {
                ...entry,
                description: generatedDescription,
                location: selectedLocation,
                time: timePeriod,
            };
            onSave(entry, updatedEntry);
            onOpenChange(false);
        }
    };

    if (!entry || entry.type !== 'Duty') {
        return null;
    }

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Duty</DialogTitle>
                    <DialogDescription>
                        Modify the details of this duty assignment.
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
                    <Button onClick={handleSave} disabled={!selectedTimeSlotName || !selectedLocation}>Save Changes</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
