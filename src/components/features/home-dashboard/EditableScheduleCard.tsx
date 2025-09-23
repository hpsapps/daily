import { useMemo, useContext } from 'react';
import { format } from 'date-fns';
import { ChevronLeft, ChevronRight, RotateCcw, X, Edit } from 'lucide-react';
import { Button } from '../../ui/button';
import type { Schedule, ScheduleEntry, DutyAssignment, Teacher } from '../../../types';
import type { RFFRosterEntry } from '../../../utils/excelParser';
import { cn } from '../../../utils/cn';
import { AppContext } from '../../../contexts/AppContext';

interface EditableScheduleCardProps {
    schedule: Schedule | null;
    selectedDates: Date[];
    currentDateIndex: number;
    onPreviousDate: () => void;
    onNextDate: () => void;
    termInfo?: { term?: number; week?: number; type: 'term' | 'holiday' | 'development'; description: string };
    onAddManualDutyClick: () => void;
    selectedTeacher: Teacher | null;
    onEditDutyClick: (entry: ScheduleEntry) => void;
    onResetDuty: (entry: ScheduleEntry) => void;
    onRemoveDuty: (entry: ScheduleEntry) => void;
    onEditRffClick: (entry: ScheduleEntry) => void;
    onResetRff: (entry: ScheduleEntry) => void;
    isEditDutyModalOpen: boolean;
    onOpenChangeEditDutyModal: (open: boolean) => void;
    editingDutyEntry: ScheduleEntry | null;
    onSaveEditedDuty: (originalEntry: ScheduleEntry, updatedEntry: ScheduleEntry) => void;
    isReassignRffModalOpen: boolean;
    onOpenChangeReassignRffModal: (open: boolean) => void;
    editingRffEntry: ScheduleEntry | null;
    onSaveReassignedRff: (originalEntry: ScheduleEntry, updatedEntry: ScheduleEntry) => void;
}

export function EditableScheduleCard({
    schedule,
    selectedDates,
    currentDateIndex,
    onPreviousDate,
    onNextDate,
    termInfo,
    onAddManualDutyClick,
    selectedTeacher,
    onEditDutyClick,
    onResetDuty,
    onRemoveDuty,
    onEditRffClick,
    onResetRff,
    isEditDutyModalOpen,
    onOpenChangeEditDutyModal,
    editingDutyEntry,
    onSaveEditedDuty,
    isReassignRffModalOpen,
    onOpenChangeReassignRffModal,
    editingRffEntry,
    onSaveReassignedRff,
}: EditableScheduleCardProps) {
    const { state, dispatch } = useContext(AppContext);
    const { manualDuties, dutySlots, rffRoster } = state;

    const sortedDates = useMemo(() => {
        return [...selectedDates].sort((a, b) => a.getTime() - b.getTime());
    }, [selectedDates]);

    if (!schedule) {
        return null;
    }

    const isPreviousDisabled = currentDateIndex === 0;
    const isNextDisabled = currentDateIndex === sortedDates.length - 1;

    const currentSelectedDate = sortedDates[currentDateIndex];
    if (!currentSelectedDate) {
        return null;
    }

    const isWeekend = (currentSelectedDate.getDay() === 0 || currentSelectedDate.getDay() === 6);
    const isTermBreak = termInfo?.type === 'holiday';

    return (
        <div className='p-4 mb-8' id="schedule-display-card">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">
                    {schedule.selectedTeacherInfo?.name || 'N/A'} - {schedule.selectedTeacherInfo?.className || 'No class assigned'}
                </h2>
                <span className="text-sm bg-destructive/10 text-destructive px-3 py-1 rounded-full">Absent</span>
            </div>
            <div className="flex items-center justify-between mt-2 mb-4">
                <div className="inline-flex items-center border rounded-md">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onPreviousDate}
                        disabled={isPreviousDisabled}
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span className="text-sm px-2 min-w-[6rem] text-center">
                        {termInfo?.type === 'term' && termInfo.term && termInfo.week
                            ? `${format(currentSelectedDate, "EEE")} W${termInfo.week} T${termInfo.term}`
                            : format(currentSelectedDate, "EEE dd MMM")}
                    </span>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onNextDate}
                        disabled={isNextDisabled}
                    >
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
                <Button onClick={onAddManualDutyClick} className="ml-4">
                    Add Duty
                </Button>
            </div>

            {isWeekend || isTermBreak ? (
                <div className="text-center py-8 text-muted-foreground">
                    <p>
                        {isWeekend
                        ? `It's the weekend... Hopefully '${schedule.selectedTeacherInfo.name || 'the teacher'}' is off enjoying themselves.`
                        : `It's the term break... Hopefully '${schedule.selectedTeacherInfo.name || 'the teacher'}' is off enjoying themselves.`}
                    </p>
                </div>
            ) : (
                <div className="space-y-3">
                    {schedule.dailySchedule.length > 0 ? (
                        schedule.dailySchedule.map((entry: ScheduleEntry, index: number) => {
                            let timeslotClass = "p-4 rounded-lg";
                            let badgeText = "";
                            let badgeClass = "";
                            let description = entry.description;

                            const normalizedEntryLocation = entry.location || ''; // Normalize entry.location
                            const isManualDuty = manualDuties.some(
                                (md) => md.id === entry.id // Match by ID
                            );

                            const originalDuty = dutySlots.find(
                                (ds) =>
                                    ds.timeSlot === entry.time &&
                                    ds.teacherId === schedule.selectedTeacherInfo?.id
                            );

                            const isModified =
                                entry.type === 'Duty' &&
                                !isManualDuty &&
                                originalDuty &&
                                (entry.description !== `${originalDuty.when} at ${originalDuty.area}` ||
                                 entry.location !== originalDuty.area);

                            const isRffModified = state.modifiedRffs.some(
                                (mrff) => mrff.updated.id === entry.id
                            );

                            if (entry.type === 'RFF') {
                                timeslotClass += " bg-primary/5 border border-primary";
                                badgeText = "RFF";
                                badgeClass = "bg-primary/10 text-primary";
                            } else if (entry.type === 'Duty') {
                                timeslotClass += " bg-green-50/50 border border-green-600";
                                badgeText = "Duty";
                                badgeClass = "bg-green-500/10 text-green-600";
                            } else if (entry.type === 'Class') {
                                timeslotClass += " bg-white border border-gray-300";
                                badgeText = "Class";
                                badgeClass = "bg-blue-500/10 text-blue-600";
                            } else if (entry.type === 'Exec Release') {
                                timeslotClass += " bg-white border border-gray-300";
                                badgeText = "Exec Release";
                                badgeClass = "bg-purple-500/10 text-purple-600";
                            } else {
                                timeslotClass += " bg-white border border-gray-300";
                                badgeText = "N/A";
                                badgeClass = "bg-gray-500/10 text-gray-600";
                            }

                            if (isManualDuty) {
                                badgeText = "Added";
                                badgeClass = "bg-purple-500/10 text-purple-600";
                            }

                            return (
                                <div key={entry.id} className={timeslotClass}>
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <p className="font-medium">{entry.time}</p>
                                            <p className="text-sm text-muted-foreground">{description}</p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {entry.type === 'Duty' && isModified && (
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-6 w-6"
                                                    onClick={() => onResetDuty(entry)}
                                                >
                                                    <RotateCcw className="h-4 w-4 text-blue-500" />
                                                </Button>
                                            )}
                                            {entry.type === 'RFF' && isRffModified && (
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-6 w-6"
                                                    onClick={() => onResetRff(entry)}
                                                >
                                                    <RotateCcw className="h-4 w-4 text-blue-500" />
                                                </Button>
                                            )}
                                            {entry.type === 'Duty' && isManualDuty && (
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-6 w-6"
                                                    onClick={() => onRemoveDuty(entry)}
                                                >
                                                    <X className="h-4 w-4 text-red-500" />
                                                </Button>
                                            )}
                                            {((entry.type === 'Duty' && !isManualDuty) || entry.type === 'RFF') && (
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-6 w-6"
                                                    onClick={() => {
                                                        if (entry.type === 'Duty') {
                                                            onEditDutyClick(entry);
                                                        } else if (entry.type === 'RFF') {
                                                            onEditRffClick(entry);
                                                        }
                                                    }}
                                                >
                                                    <Edit className="h-4 w-4 text-gray-500" />
                                                </Button>
                                            )}
                                            <span className={cn("text-sm px-3 py-1 rounded-full", badgeClass)}>{badgeText}</span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <p className="text-muted-foreground">No schedule found for this teacher on the selected day.</p>
                    )}
                </div>
            )}

            {/* EditDutyDialog and ReassignRffDialog will be rendered in DailyCasualHome */}
        </div>
    );
}
