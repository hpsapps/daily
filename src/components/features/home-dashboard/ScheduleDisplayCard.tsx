import { useMemo } from 'react';
import { Card } from '../../ui/card';
import { format } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../../ui/button';
import type { Schedule, ScheduleEntry } from '../../../types'; // Import Schedule and ScheduleEntry types
import { cn } from '../../../utils/cn'; // Import cn utility

interface ScheduleDisplayCardProps {
    schedule: Schedule | null; // Schedule can be null
    selectedDates: Date[];
    currentDateIndex: number;
    onPreviousDate: () => void;
    onNextDate: () => void;
    termInfo?: { term?: number; week?: number; type: 'term' | 'holiday' | 'development'; description: string }; // Make termInfo optional
}

export function ScheduleDisplayCard({
    schedule,
    selectedDates,
    currentDateIndex,
    onPreviousDate,
    onNextDate,
    termInfo
}: ScheduleDisplayCardProps) {
    if (!schedule) {
        return null;
    }

    const sortedDates = useMemo(() => {
        return [...selectedDates].sort((a, b) => a.getTime() - b.getTime());
    }, [selectedDates]);

    const isPreviousDisabled = currentDateIndex === 0;
    const isNextDisabled = currentDateIndex === sortedDates.length - 1;

    const currentSelectedDate = sortedDates[currentDateIndex];
    // Defensive check for currentSelectedDate
    if (!currentSelectedDate) {
        return null;
    }

    const isWeekend = (currentSelectedDate.getDay() === 0 || currentSelectedDate.getDay() === 6); // 0 for Sunday, 6 for Saturday
    const isTermBreak = termInfo?.type === 'holiday'; // Use optional chaining for termInfo

    return (
        <Card className="p-6 mb-8 border" id="teacher-results">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">
                    {schedule.selectedTeacherInfo.name || 'N/A'} - {schedule.selectedTeacherInfo.className || 'No class assigned'}
                </h2>
                <span className="text-sm bg-destructive/10 text-destructive px-3 py-1 rounded-full">Absent</span>
            </div>
            <div className="inline-flex items-center mt-2 border rounded-md mb-4">
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

                            if (entry.type === 'RFF') {
                                timeslotClass += " bg-primary/5 border border-primary"; // Soft primary background, primary border
                                badgeText = "RFF";
                                badgeClass = "bg-primary/10 text-primary";
                            } else if (entry.type === 'Duty') {
                                timeslotClass += " bg-green-50/50 border border-green-600"; // Very soft green background, green border
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

                            return (
                                <div key={index} className={timeslotClass}>
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <p className="font-medium">{entry.time}</p>
                                            <p className="text-sm text-muted-foreground">{description}</p>
                                        </div>
                                        <span className={cn("text-sm px-3 py-1 rounded-full", badgeClass)}>{badgeText}</span>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <p className="text-muted-foreground">No schedule found for this teacher on the selected day.</p>
                    )}
                </div>
            )}
        </Card>
    );
}
