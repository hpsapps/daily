import React, { useState, useContext } from 'react';
import { AppContext } from '../contexts/AppContext';
import { Button } from '../components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from '../components/ui/label';
import { Input } from '../components/ui/input';
import { useScheduleData } from '../hooks/useScheduleData';
import { useTeacherAndCasualLists } from '../hooks/useTeacherAndCasualLists';
import { TeacherSearchCard } from '../components/page/home/TeacherSearchCard';
import { ScheduleDisplayCard } from '../components/page/home/ScheduleDisplayCard';
import { AssignCasualCard } from '../components/page/home/AssignCasualCard';
import { AssignmentPreview } from '../components/page/home/AssignmentPreview';

function NewHomePage() {
    const { dispatch } = useContext(AppContext);
    const [isAddDutyModalOpen, setIsAddDutyModalOpen] = useState(false);
    const [newDutyTimeSlot, setNewDutyTimeSlot] = useState('');
    const [newDutyLocation, setNewDutyLocation] = useState('');

    const {
        selectedTeacher,
        selectedCasual,
        selectedDates,
        schedule,
        spreadsheetData,
        isLoading,
        handleTeacherSelect,
        handleCasualSelect,
        setSelectedDates,
        handleGenerateSpreadsheet,
        setSpreadsheetData
    } = useScheduleData();

    const { allTeachers, allCasuals } = useTeacherAndCasualLists(isLoading);

    return (
        <div className="bg-secondary min-h-screen">
            <div className="container mx-auto px-4 py-8">
                <header className="mb-8">
                    <h1 className="text-3xl font-bold text-foreground">Teacher Roster Tool</h1>
                    <p className="text-muted-foreground">Manage RFF and duties for absent teachers</p>
                </header>

                <TeacherSearchCard
                    allTeachers={allTeachers}
                    selectedTeacher={selectedTeacher}
                    selectedDates={selectedDates}
                    isLoading={isLoading}
                    onTeacherSelect={handleTeacherSelect}
                    onDateChange={setSelectedDates}
                />

                <ScheduleDisplayCard schedule={schedule} />

                <AssignCasualCard
                    allCasuals={allCasuals}
                    selectedCasual={selectedCasual}
                    selectedTeacher={selectedTeacher}
                    isLoading={isLoading}
                    onCasualSelect={handleCasualSelect}
                    onGenerateSpreadsheet={handleGenerateSpreadsheet}
                />

                <AssignmentPreview
                    spreadsheetData={spreadsheetData}
                    onSpreadsheetDataChange={setSpreadsheetData}
                />
            </div>

            <Dialog open={isAddDutyModalOpen} onOpenChange={setIsAddDutyModalOpen}>
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
                        <Button variant="outline" onClick={() => setIsAddDutyModalOpen(false)}>Cancel</Button>
                        <Button onClick={() => {
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
                                setIsAddDutyModalOpen(false);
                            }
                        }}>Add Duty</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

export default NewHomePage;
