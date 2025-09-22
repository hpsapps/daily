import { useState, useEffect, useContext, useMemo } from 'react';
import { AppContext } from '../contexts/AppContext';
import { getTermAndWeek } from '../utils/termCalculator';
import type { DutyAssignment, Teacher, Schedule, ScheduleEntry } from '../types';
import type { RFFRosterEntry } from '../utils/excelParser';
import { addDays } from 'date-fns';

export function useScheduleData() {
    const { state } = useContext(AppContext);
    const { rffRoster, teachers, manualDuties, dutySlots } = state;
    const [selectedTeacher, setSelectedTeacher] = useState('');
    const [selectedCasual, setSelectedCasual] = useState('');
    const [selectedDates, setSelectedDates] = useState<Date[]>(() => {
        let initialDate = new Date();
        let termInfo = getTermAndWeek(initialDate);

        // Find the next valid school day
        while (termInfo.type !== 'term' || initialDate.getDay() === 0 || initialDate.getDay() === 6) {
            initialDate = addDays(initialDate, 1);
            termInfo = getTermAndWeek(initialDate);
        }
        return [initialDate];
    });
    const [currentDateIndex, setCurrentDateIndex] = useState(0);
    const [schedule, setSchedule] = useState<Schedule | null>(null);
    const [spreadsheetData, setSpreadsheetData] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (rffRoster.length > 0 && teachers.length > 0 && dutySlots.length > 0) {
            setIsLoading(false);
        } else {
            setIsLoading(true);
        }
    }, [rffRoster, teachers, dutySlots]);

    useEffect(() => {
        // Ensure currentDateIndex is valid when selectedDates changes
        if (selectedDates.length === 0) {
            setCurrentDateIndex(0); // If no dates, reset index to 0
        } else if (currentDateIndex >= selectedDates.length) {
            setCurrentDateIndex(selectedDates.length - 1); // If index is out of bounds, set to last valid index
        }
    }, [selectedDates, currentDateIndex]);

    useEffect(() => {
        if (isLoading || !selectedTeacher || selectedDates.length === 0) {
            setSchedule(null);
            // If selectedDates is empty, reset currentDateIndex to 0 to prevent out-of-bounds access
            if (selectedDates.length === 0 && currentDateIndex !== 0) {
                setCurrentDateIndex(0);
            }
            return;
        }

        const date = selectedDates[currentDateIndex];
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const dayOfWeek = days[date.getDay()];
        const options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const formattedDate = date.toLocaleDateString('en-AU', options);

        const termInfo = getTermAndWeek(date);

        // --- Dynamic Data from AppContext ---
        const currentTeacherInfo = teachers.find(t => t.id === selectedTeacher);
        const teacherClass = currentTeacherInfo?.className;
        const isRFFSpecialist = currentTeacherInfo?.role === 'RFF Specialist';

        // Create a map from short RFF teacher names to full teacher names (IDs)
        const rffTeacherNameToIdMap = new Map<string, string>();
        teachers.forEach(t => {
            // Assuming short names are the first word of the full name
            const shortName = t.name.split(' ')[0];
            rffTeacherNameToIdMap.set(shortName, t.id);
        });

        let allRFFSlots: RFFRosterEntry[] = [];
        if (isRFFSpecialist) {
            allRFFSlots = rffRoster.filter(rff =>
                rff.day === dayOfWeek && rff.teacher === currentTeacherInfo?.name.split(' ')[0] && rff.class === 'RFF' // Match by short name
            );
        } else if (teacherClass) {
            allRFFSlots = rffRoster.filter(rff =>
                rff.day === dayOfWeek && rff.class === teacherClass
            );
        }

        // Use dynamic dutySlots from AppContext and merge with manual duties
        const inheritedDuties = dutySlots.filter(
            (duty) => {
                // Match duty.teacherId directly with selectedTeacher (which is the teacher's ID)
                return duty.teacherId === selectedTeacher && duty.day === dayOfWeek;
            }
        ).map(duty => ({
            timeSlot: duty.timeSlot,
            location: duty.area, // Map area to location
            type: 'inherited' as 'inherited' // Cast to DutyAssignment type
        }));
        const duties: DutyAssignment[] = [...inheritedDuties, ...manualDuties];

        const allTimeSlots = [
            "8:35-9:05", // Duty time
            "9:10-9:50",
            "9:50-10:30",
            "10:30-11:10",
            "11:10-11:35", // Duty time
            "11:35-12:15",
            "12:15-12:55",
            "13:05-13:25", // Duty time
            "13:25-13:45", // Duty time
            "13:45-14:25",
            "14:25-15:05",
            "15:05-15:25" // Duty time
        ];

        const dailySchedule: ScheduleEntry[] = allTimeSlots.map(timeSlot => {
            const selectedTeacherShortName = currentTeacherInfo?.name.split(' ')[0];

            // Find RFF assignments for the selected teacher (RFF Specialist's direct assignments)
            const rffAssignment = rffRoster.find(rff => {
                return isRFFSpecialist && rff.day === dayOfWeek && rff.time === timeSlot && rff.teacher === selectedTeacherShortName;
            });

            // Find RFF assignments for the selected teacher's class (for non-RFF Specialists)
            let rffClassAssignment: RFFRosterEntry | undefined;
            if (!isRFFSpecialist && teacherClass) {
                rffClassAssignment = rffRoster.find(rff =>
                    rff.day === dayOfWeek && rff.time === timeSlot && rff.class === teacherClass
                );
            }

            const dutyAssignment = duties.find(duty => duty.timeSlot === timeSlot);

            if (rffAssignment) { // This block handles RFF Specialist's direct RFF assignments
                const entry: ScheduleEntry = {
                    time: timeSlot,
                    type: 'RFF',
                    description: `${rffAssignment.subject}`,
                    teacherName: currentTeacherInfo?.name,
                    location: undefined, // Explicitly set to undefined
                    class: undefined, // Explicitly set to undefined
                };
                if (rffAssignment.class === 'RFF') {
                    entry.class = rffAssignment.class;
                } else if (rffAssignment.subject?.startsWith('Exec')) {
                    entry.type = 'Exec Release';
                    entry.description = `${rffAssignment.subject} - ${rffAssignment.class}`;
                    entry.class = rffAssignment.class;
                } else {
                    entry.type = 'Class';
                    entry.description = `${rffAssignment.subject} - ${rffAssignment.class}`;
                    entry.class = rffAssignment.class;
                }
                return entry;
            } else if (rffClassAssignment) { // This block handles non-RFF teacher's class RFF sessions
                return {
                    time: timeSlot,
                    type: 'RFF', // Display as RFF for the class
                    description: `Class with ${rffClassAssignment.teacher} for ${rffClassAssignment.subject}`,
                    class: rffClassAssignment.class,
                    teacherName: currentTeacherInfo?.name,
                    location: undefined, // Explicitly set to undefined
                };
            } else if (dutyAssignment) {
                return {
                    time: timeSlot,
                    type: 'Duty',
                    description: `Duty at ${dutyAssignment.location}`,
                    location: dutyAssignment.location,
                    teacherName: currentTeacherInfo?.name,
                    class: undefined, // Explicitly set to undefined
                };
            }
            return null; // Return null for N/A slots
        }).filter((entry): entry is ScheduleEntry => entry !== null); // Filter out null entries

        setSchedule({
            selectedTeacherInfo: currentTeacherInfo!,
            date: date.toISOString().split('T')[0],
            day: dayOfWeek,
            formattedDate: formattedDate,
            duties,
            rffSlots: allRFFSlots,
            assignedCasual: selectedCasual,
            termInfo: termInfo,
            dailySchedule: dailySchedule,
        });
    }, [selectedTeacher, selectedDates, currentDateIndex, isLoading, selectedCasual, manualDuties, rffRoster, teachers, dutySlots]);

    const handleTeacherSelect = (teacher: string) => {
        setSelectedTeacher(teacher);
    };

    const handleCasualSelect = (casual: string) => {
        setSelectedCasual(casual);
    };

    const handlePreviousDate = () => {
        setCurrentDateIndex(prevIndex => {
            const newIndex = Math.max(0, prevIndex - 1);
            return newIndex;
        });
    };

    const handleNextDate = () => {
        setCurrentDateIndex(prevIndex => {
            const newIndex = Math.min(selectedDates.length - 1, prevIndex + 1);
            return newIndex;
        });
    };

    const handleGenerateSpreadsheet = () => {
        if (!schedule) return;

        const dutiesToCover = [...schedule.duties, ...manualDuties]
            .map(d => `- ${d.timeSlot}: ${d.location}`)
            .join('\n');

        const rffDetails = schedule.rffSlots
            .map((r: any) => `- ${r.time}: ${r.subject} at ${r.class || 'N/A'}`)
            .join('\n');

        const data = `Absent Teacher: ${schedule.selectedTeacherInfo.name}\n` +
                     `Casual Teacher: ${schedule.assignedCasual}\n` +
                     `Date: ${schedule.formattedDate}\n\n` +
                     `Duties to Cover:\n${dutiesToCover}\n\n` +
                     `RFF Locations:\n${rffDetails}`;
        setSpreadsheetData(data);
    };

    const allTeachers = useMemo(() => {
        return teachers.sort((a, b) => a.name.localeCompare(b.name));
    }, [teachers]);

    return {
        selectedTeacher,
        selectedCasual,
        selectedDates,
        schedule,
        spreadsheetData,
        isLoading,
        handleTeacherSelect,
        handleCasualSelect,
        setSelectedDates,
        currentDateIndex,
        handlePreviousDate,
        handleNextDate,
        handleGenerateSpreadsheet,
        setSpreadsheetData,
        termInfo: schedule?.termInfo,
        allTeachers,
    };
}
