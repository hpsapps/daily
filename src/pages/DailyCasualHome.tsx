import { useState, useContext } from 'react';
import { AppContext } from '../contexts/AppContext';
import { useScheduleData } from '../hooks/useScheduleData';
import { useTeacherAndCasualLists } from '../hooks/useTeacherAndCasualLists';
import { TeacherSearchCard } from '../components/features/home-dashboard/TeacherSearchCard';
import { EditableScheduleCard } from '../components/features/home-dashboard/EditableScheduleCard';
import { AssignCasualCard } from '../components/features/home-dashboard/AssignCasualCard';
// import { AssignmentPreview } from '../components/features/home-dashboard/AssignmentPreview'; // No longer needed
import AddManualDutyDialog from '../components/features/manual-duty/AddManualDutyDialog';
import { Card } from '@/components/ui/card';
import { EditDutyDialog } from '../components/features/home-dashboard/EditDutyDialog'; // Import EditDutyDialog
import ReassignRffDialog from '../components/features/home-dashboard/ReassignRffDialog'; // Import ReassignRffDialog
import type { ScheduleEntry, DutyAssignment } from '../types'; // Import ScheduleEntry and DutyAssignment types
import type { RFFRosterEntry } from '../utils/excelParser'; // Import RFFRosterEntry

function DailyCasualHome() {
    const { state, dispatch } = useContext(AppContext);
    const { dutySlots, rffRoster, teachers, manualDuties } = state;
    const [isAddDutyModalOpen, setIsAddDutyModalOpen] = useState(false);
    const [isEditDutyModalOpen, setIsEditDutyModalOpen] = useState(false);
    const [editingDutyEntry, setEditingDutyEntry] = useState<ScheduleEntry | null>(null);
    const [isReassignRffModalOpen, setIsReassignRffModalOpen] = useState(false);
    const [editingRffEntry, setEditingRffEntry] = useState<ScheduleEntry | null>(null);

    const {
        selectedTeacher,
        selectedCasual,
        selectedDates,
        schedule,
        isLoading,
        handleTeacherSelect,
        handleCasualSelect,
        setSelectedDates,
        currentDateIndex,
        handlePreviousDate,
        handleNextDate,
        termInfo,
        allTeachers,
        setSchedule,
    } = useScheduleData();

    const { allCasuals } = useTeacherAndCasualLists();

    // Handlers for Duty Editing
    const handleEditDutyClick = (entry: ScheduleEntry) => {
        setEditingDutyEntry(entry);
        setIsEditDutyModalOpen(true);
    };

    const handleSaveEditedDuty = (originalEntry: ScheduleEntry, updatedEntry: ScheduleEntry) => {
        if (!schedule || !selectedTeacher) return;

        const updatedDailySchedule = schedule.dailySchedule.map((e) =>
            e.time === originalEntry.time && e.description === originalEntry.description
                ? updatedEntry
                : e
        );
        setSchedule({ ...schedule, dailySchedule: updatedDailySchedule });

        const originalLocationNormalized = originalEntry.location || '';
        const originalWhenFromDescription = originalEntry.description.split(' at ')[0];
        const currentDateFormatted = schedule.date; // Use the formatted date from the schedule

        const wasManualDuty = manualDuties.some(
            (md) =>
                md.id === originalEntry.id && // Match by ID
                md.teacherId === selectedTeacher.id &&
                md.date === currentDateFormatted
        );

        if (wasManualDuty) {
            dispatch({
                type: 'UPDATE_MANUAL_DUTY',
                payload: {
                    original: {
                        id: originalEntry.id!, // Include the ID for matching
                        timeSlot: originalEntry.time,
                        location: originalLocationNormalized,
                        when: originalWhenFromDescription,
                        teacherId: selectedTeacher.id,
                        date: currentDateFormatted,
                    },
                    updated: {
                        id: updatedEntry.id!, // Use existing ID
                        timeSlot: updatedEntry.time,
                        location: updatedEntry.location || '',
                        when: updatedEntry.description.split(' at ')[0],
                        teacherId: selectedTeacher.id,
                        date: currentDateFormatted,
                        type: 'manual',
                        description: updatedEntry.description,
                    },
                },
            });
        } else {
            // If it's not a manual duty, it's an inherited duty that has been modified
            // We need to find the *true* original dutyId if this is a subsequent edit
            const existingModifiedInheritedDuty = state.modifiedInheritedDuties.find(
                (mid) => mid.updated.id === originalEntry.id
            );

            const trueOriginalDutyId = existingModifiedInheritedDuty
                ? existingModifiedInheritedDuty.original.dutyId
                : originalEntry.id!; // If it's the first edit, originalEntry.id is the dutySlot.id

            dispatch({
                type: 'UPDATE_INHERITED_DUTY',
                payload: {
                    original: {
                        dutyId: trueOriginalDutyId,
                        timeSlot: originalEntry.time, // This might be the modified timeSlot, but dutyId is key
                        teacherId: selectedTeacher.id,
                        date: currentDateFormatted,
                    },
                    updated: {
                        id: updatedEntry.id!, // Use existing ID
                        timeSlot: updatedEntry.time,
                        location: updatedEntry.location || '',
                        when: updatedEntry.description.split(' at ')[0],
                        teacherId: selectedTeacher.id,
                        date: currentDateFormatted,
                        type: 'inherited',
                        description: updatedEntry.description,
                    },
                },
            });
        }

        setIsEditDutyModalOpen(false);
        setEditingDutyEntry(null);
    };

    const handleResetDuty = (entryToReset: ScheduleEntry) => {
        if (!schedule || !selectedTeacher) return;

        const currentDateFormatted = schedule.date;

        // Find the corresponding modified inherited duty to get its original properties
        const modifiedEntry = state.modifiedInheritedDuties.find(
            (mid) => mid.updated.id === entryToReset.id
        );

        if (modifiedEntry) {
            dispatch({
                type: 'RESET_INHERITED_DUTY',
                payload: {
                    dutyId: modifiedEntry.original.dutyId,
                    timeSlot: modifiedEntry.original.timeSlot,
                    teacherId: modifiedEntry.original.teacherId,
                    date: modifiedEntry.original.date,
                },
            });
        } else {
            // If the duty is not found in modifiedInheritedDuties, it means it was never modified
            // or the modification was already reset. In this case, we do nothing.
            // The "Reset" button should only appear if it's in modifiedInheritedDuties.
            console.warn("Attempted to reset an inherited duty not found in modifiedInheritedDuties. This should not happen.");
        }
    };

    const handleRemoveDuty = (entryToRemove: ScheduleEntry) => {
        if (!schedule || !selectedTeacher) return;

        const updatedDailySchedule = schedule.dailySchedule.filter(
            (e) => !(e.time === entryToRemove.time && e.description === entryToRemove.description)
        );
        setSchedule({ ...schedule, dailySchedule: updatedDailySchedule });

        dispatch({
            type: 'REMOVE_MANUAL_DUTY',
            payload: {
                id: entryToRemove.id, // Use the ID for removal
                timeSlot: entryToRemove.time,
                location: entryToRemove.location,
                when: entryToRemove.description.split(' at ')[0],
                teacherId: selectedTeacher.id,
                date: schedule.date,
            } as DutyAssignment,
        });
    };

    // Handlers for RFF Editing
    const handleEditRffClick = (entry: ScheduleEntry) => {
        setEditingRffEntry(entry);
        setIsReassignRffModalOpen(true);
    };

    const handleSaveReassignedRff = (originalEntry: ScheduleEntry, updatedEntry: ScheduleEntry) => {
        if (!schedule || !selectedTeacher) return;

        const updatedDailySchedule = schedule.dailySchedule.map((e) =>
            e.id === originalEntry.id
                ? updatedEntry
                : e
        );
        setSchedule({ ...schedule, dailySchedule: updatedDailySchedule });

        // Find the original RFFRosterEntry to store in modifiedRffs
        const originalRffRosterEntry = rffRoster.find(rff => rff.id === originalEntry.id);

        if (originalRffRosterEntry) {
            dispatch({
                type: 'UPDATE_RFF',
                payload: {
                    original: {
                        id: originalEntry.id!, // Use the ScheduleEntry ID for matching
                    },
                    updated: updatedEntry,
                },
            });
        } else {
            console.warn("Original RFF Roster Entry not found for modification.");
        }

        setIsReassignRffModalOpen(false);
        setEditingRffEntry(null);
    };

    const handleResetRff = (entryToReset: ScheduleEntry) => {
        if (!schedule || !selectedTeacher) return;

        const modifiedRff = state.modifiedRffs.find(mrff => mrff.updated.id === entryToReset.id);

        if (modifiedRff) {
            dispatch({
                type: 'RESET_RFF',
                payload: {
                    id: modifiedRff.original.id, // Use the original ID for resetting
                },
            });
        } else {
            console.warn("Attempted to reset an RFF not found in modifiedRffs. This should not happen.");
        }
    };

    return (
        <div className="bg-secondary min-h-screen">
            <div className="container mx-auto px-4 py-8">
                <header className="mb-8">
                    <h1 className="text-3xl font-bold text-foreground">Daily Teacher Changes</h1>
                    <p className="text-muted-foreground">Manage RFF and duties for absent teachers</p>
                </header>

                <Card className="p-6 mb-8 border" id="assign-teacher">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="md:col-span-2 flex flex-col">
                            <TeacherSearchCard
                                allTeachers={allTeachers}
                                selectedTeacher={selectedTeacher?.id || ''}
                                selectedDates={selectedDates}
                                isLoading={isLoading}
                                onTeacherSelect={handleTeacherSelect}
                                onDateChange={setSelectedDates}
                            />
                        </div>

                        <div className="md:col-span-1 flex flex-col">
                            <AssignCasualCard
                                allCasuals={allCasuals}
                                selectedCasual={selectedCasual}
                                selectedTeacher={selectedTeacher?.name || ''}
                                isLoading={isLoading}
                                onCasualSelect={handleCasualSelect}
                            />
                        </div>
                    </div>
                </Card>

                {selectedTeacher && (
                    <Card className="p-6 mb-8 border" id="schedule-and-preview">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex flex-col">
                            <EditableScheduleCard
                                schedule={schedule}
                                selectedDates={selectedDates}
                                currentDateIndex={currentDateIndex}
                                onPreviousDate={handlePreviousDate}
                                onNextDate={handleNextDate}
                                termInfo={termInfo}
                                onAddManualDutyClick={() => setIsAddDutyModalOpen(true)}
                                selectedTeacher={selectedTeacher}
                                onEditDutyClick={handleEditDutyClick}
                                onResetDuty={handleResetDuty}
                                onRemoveDuty={handleRemoveDuty}
                                onEditRffClick={handleEditRffClick}
                                onResetRff={handleResetRff}
                                isEditDutyModalOpen={isEditDutyModalOpen}
                                onOpenChangeEditDutyModal={setIsEditDutyModalOpen}
                                editingDutyEntry={editingDutyEntry}
                                onSaveEditedDuty={handleSaveEditedDuty}
                                isReassignRffModalOpen={isReassignRffModalOpen}
                                onOpenChangeReassignRffModal={setIsReassignRffModalOpen}
                                editingRffEntry={editingRffEntry}
                                onSaveReassignedRff={handleSaveReassignedRff}
                            />
                        </div>
                        </div>
                    </Card>
                )}
            </div>

            <AddManualDutyDialog
                isOpen={isAddDutyModalOpen}
                onOpenChange={setIsAddDutyModalOpen}
                dutySlots={dutySlots}
                selectedTeacherId={selectedTeacher?.id || null}
                selectedDate={selectedDates[currentDateIndex] || null}
            />

            <EditDutyDialog
                isOpen={isEditDutyModalOpen}
                onOpenChange={setIsEditDutyModalOpen}
                entry={editingDutyEntry}
                dutySlots={dutySlots}
                onSave={handleSaveEditedDuty}
            />

            <ReassignRffDialog
                isOpen={isReassignRffModalOpen}
                onOpenChange={setIsReassignRffModalOpen}
                currentRff={editingRffEntry}
                schedule={schedule}
                selectedTeacher={selectedTeacher}
                onSave={handleSaveReassignedRff}
            />
        </div>
    );
}

export default DailyCasualHome;
