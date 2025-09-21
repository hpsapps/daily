import { useState, useEffect, useContext, useMemo } from 'react';
import { AppContext } from '../contexts/AppContext';
import { getTermAndWeek } from '../utils/termCalculator';
import type { DutyAssignment, Teacher, Schedule, ScheduleEntry } from '../types'; // Combined imports, DutySlot as type, Teacher, Schedule, and ScheduleEntry
import type { RFFRosterEntry } from '../utils/excelParser';
import { addDays } from 'date-fns'; // Import addDays

export function useScheduleData() {
    const { state } = useContext(AppContext);
    const { rffRoster, teachers, manualDuties, dutySlots } = state; // Get dutySlots from AppContext
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
        console.log('useScheduleData: Initial data loading check. rffRoster.length:', rffRoster.length, 'teachers.length:', teachers.length, 'dutySlots.length:', dutySlots.length);
        if (rffRoster.length > 0 && teachers.length > 0 && dutySlots.length > 0) {
            setIsLoading(false);
        } else {
            setIsLoading(true);
        }
    }, [rffRoster, teachers, dutySlots]);

    useEffect(() => {
        console.log('useScheduleData: selectedDates or currentDateIndex changed. selectedDates:', selectedDates, 'currentDateIndex:', currentDateIndex);
        // Ensure currentDateIndex is valid when selectedDates changes
        if (selectedDates.length === 0) {
            setCurrentDateIndex(0); // If no dates, reset index to 0
        } else if (currentDateIndex >= selectedDates.length) {
            setCurrentDateIndex(selectedDates.length - 1); // If index is out of bounds, set to last valid index
        }
    }, [selectedDates, currentDateIndex]);

    useEffect(() => {
        console.log('useScheduleData: Recalculating schedule. isLoading:', isLoading, 'selectedTeacher:', selectedTeacher, 'selectedDates.length:', selectedDates.length, 'currentDateIndex:', currentDateIndex);
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
                const assignedTeacher = teachers.find(t => t.id === duty.teacherId);
                return assignedTeacher?.name === selectedTeacher && duty.day === dayOfWeek;
            }
        ).map(duty => ({
            timeSlot: duty.timeSlot,
            location: duty.area, // Map area to location
            type: 'inherited' as 'inherited' // Cast to DutyAssignment type
        }));
        const duties: DutyAssignment[] = [...inheritedDuties, ...manualDuties];

        const allTimeSlots = [
            "9.10-9.50", "9.50-10.30", "10.30-11.10",
            "11.35-12.15", "12.15-12.55",
            "13.45-14.25", "14.25-15.05"
        ];

        const dailySchedule: ScheduleEntry[] = allTimeSlots.map(timeSlot => {
            const selectedTeacherShortName = currentTeacherInfo?.name.split(' ')[0];
            console.log(`Checking timeSlot: ${timeSlot} for teacher: ${selectedTeacherShortName}`);

            // Find RFF assignments for the selected teacher, matching by short name
            const rffAssignment = rffRoster.find(rff => {
                const match = rff.day === dayOfWeek && rff.time === timeSlot && rff.teacher === selectedTeacherShortName;
                if (match) {
                    console.log(`Found RFF assignment for ${selectedTeacherShortName} at ${timeSlot}:`, rff);
                }
                return match;
            });
            const dutyAssignment = duties.find(duty => duty.timeSlot === timeSlot);

            if (rffAssignment) {
                if (rffAssignment.class === 'RFF') {
                    return {
                        time: timeSlot,
                        type: 'RFF',
                        description: `${rffAssignment.subject}`,
                        class: rffAssignment.class,
                        teacherName: currentTeacherInfo?.name, // Use full name for display
                    };
                } else if (rffAssignment.subject?.startsWith('Exec')) {
                    return {
                        time: timeSlot,
                        type: 'Exec Release',
                        description: `${rffAssignment.subject} - ${rffAssignment.class}`,
                        class: rffAssignment.class,
                        teacherName: currentTeacherInfo?.name, // Use full name for display
                    };
                } else {
                    return {
                        time: timeSlot,
                        type: 'Class',
                        description: `${rffAssignment.subject} - ${rffAssignment.class}`,
                        class: rffAssignment.class,
                        teacherName: currentTeacherInfo?.name, // Use full name for display
                    };
                }
            } else if (dutyAssignment) {
                return {
                    time: timeSlot,
                    type: 'Duty',
                    description: `Duty at ${dutyAssignment.location}`,
                    location: dutyAssignment.location,
                    teacherName: currentTeacherInfo?.name,
                };
            } else {
                return {
                    time: timeSlot,
                    type: 'N/A',
                    description: 'N/A',
                    teacherName: currentTeacherInfo?.name,
                };
            }
        });

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
            console.log('handlePreviousDate: newIndex:', newIndex, 'selectedDates.length:', selectedDates.length);
            return newIndex;
        });
    };

    const handleNextDate = () => {
        setCurrentDateIndex(prevIndex => {
            const newIndex = Math.min(selectedDates.length - 1, prevIndex + 1);
            console.log('handleNextDate: newIndex:', newIndex, 'selectedDates.length:', selectedDates.length);
            return newIndex;
        });
    };

    const handleGenerateSpreadsheet = () => {
        if (!schedule) return;

        const dutiesToCover = [...schedule.duties, ...manualDuties]
            .map(d => `- ${d.timeSlot}: ${d.location}`) // Corrected to timeSlot and location
            .join('\n');

        const rffDetails = schedule.rffSlots
            .map((r: any) => `- ${r.time}: ${r.subject} at ${r.class || 'N/A'}`) // Corrected to time and subject
            .join('\n');

        const data = `Absent Teacher: ${schedule.selectedTeacherInfo.name}\n` + // Corrected to selectedTeacherInfo.name
                     `Casual Teacher: ${schedule.assignedCasual}\n` +
                     `Date: ${schedule.formattedDate}\n\n` +
                     `Duties to Cover:\n${dutiesToCover}\n\n` +
                     `RFF Locations:\n${rffDetails}`;
        setSpreadsheetData(data);
    };

    const allTeachers = useMemo(() => {
        return teachers.sort((a, b) => a.name.localeCompare(b.name)); // Sort by name
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
        termInfo: schedule?.termInfo, // Return termInfo explicitly
        allTeachers, // Return the list of teacher objects
    };
}
