import { useMemo } from 'react';
import { Card } from '../../ui/card';
import { getTeacherInfo } from '../../../data/ClassTeacher';
import { format } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../../ui/button';

interface ScheduleDisplayCardProps {
    schedule: any;
    selectedDates: Date[];
    currentDateIndex: number;
    onPreviousDate: () => void;
    onNextDate: () => void;
    termInfo: { term?: number; week?: number; type: 'term' | 'holiday' | 'development'; description: string };
}

export function ScheduleDisplayCard({
    schedule,
    selectedDates,
    currentDateIndex,
    onPreviousDate,
    onNextDate,
    termInfo
}: ScheduleDisplayCardProps) {
    if (!schedule) return null;

    const sortedDates = useMemo(() => {
        return [...selectedDates].sort((a, b) => a.getTime() - b.getTime());
    }, [selectedDates]);

    const isPreviousDisabled = currentDateIndex === 0;
    const isNextDisabled = currentDateIndex === sortedDates.length - 1;

    const currentSelectedDate = sortedDates[currentDateIndex];
    const isWeekend = currentSelectedDate && (currentSelectedDate.getDay() === 0 || currentSelectedDate.getDay() === 6); // 0 for Sunday, 6 for Saturday
    const isTermBreak = termInfo.type === 'holiday';

    return (
        <Card className="p-6 mb-8 border" id="teacher-results">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">{schedule.teacher} - {schedule.teacherClass || 'No class assigned'}</h2>
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
                    {termInfo.type === 'term' && termInfo.term && termInfo.week
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
                            ? `It's the weekend... Hopefully '${schedule.teacher}' is off enjoying themselves.`
                            : `It's the term break... Hopefully '${schedule.teacher}' is off enjoying themselves.`}
                    </p>
                </div>
            ) : (
                <>
                    <h4 className="font-semibold mb-2">Duty</h4>
                    <div id="duties-container" className="space-y-3">
                        {schedule.duties.length > 0 ? (
                            schedule.duties.map((duty: any, index: number) => (
                                <div key={index} className="bg-secondary p-4 rounded-lg">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <p className="font-medium">{duty.timeSlot}</p>
                                            <p className="text-sm text-muted-foreground">Location: {duty.area || duty.location}</p>
                                        </div>
                                        <span className="text-sm bg-green-500/10 text-green-600 px-3 py-1 rounded-full">Duty</span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-muted-foreground">No duties scheduled for this day</p>
                        )}
                    </div>

                    <h4 className="font-semibold mb-2 mt-4">RFF Timeslots</h4>
                    <div className="space-y-3">
                        {schedule.rffSlots.length > 0 ? (
                            schedule.rffSlots.map((rff: any, index: number) => (
                                <div key={index} className="bg-secondary p-4 rounded-lg">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <p className="font-medium">{rff.timeSlot}</p>
                                            <p className="text-sm text-muted-foreground">Class: {rff.class} - {rff.activity.replace('RFF: ', '')} ({getTeacherInfo(rff.teacher)?.teacher})</p>
                                        </div>
                                        <span className="text-sm bg-primary/10 text-primary px-3 py-1 rounded-full">RFF</span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-muted-foreground">No RFF slots found for this teacher on the selected day.</p>
                        )}
                    </div>

                </>
            )}
        </Card>
    );
}
