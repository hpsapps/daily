import { useState, useEffect, useContext } from 'react';
import { AppContext } from '../contexts/AppContext';
import { loadDutyData, findDutiesForTeacher } from '../data/DutyRoster';
import { loadRFFData, findRFFForTeacher, findRFFForClass } from '../data/RFFRoster';
import { getTeacherClass, getTeacherInfo } from '../data/ClassTeacher';
import { loadTimeSlotsData } from '../data/TimeSlots';
import { getTermAndWeek } from '../utils/termCalculator';

export function useScheduleData() {
    const { state } = useContext(AppContext);
    const { manualDuties } = state;
    const [selectedTeacher, setSelectedTeacher] = useState('');
    const [selectedCasual, setSelectedCasual] = useState('');
    const [selectedDates, setSelectedDates] = useState<Date[]>([new Date()]);
    const [currentDateIndex, setCurrentDateIndex] = useState(0);
    const [schedule, setSchedule] = useState<any>(null);
    const [spreadsheetData, setSpreadsheetData] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function loadAllData() {
            setIsLoading(true);
            await Promise.all([loadDutyData(), loadRFFData(), loadTimeSlotsData()]);
            setIsLoading(false);
        }
        loadAllData();
    }, []);

    useEffect(() => {
        // Ensure currentDateIndex is valid when selectedDates changes
        if (selectedDates.length > 0 && currentDateIndex >= selectedDates.length) {
            setCurrentDateIndex(selectedDates.length - 1);
        } else if (selectedDates.length === 0) {
            setCurrentDateIndex(0);
        }
    }, [selectedDates, currentDateIndex]);

    useEffect(() => {
        if (isLoading || !selectedTeacher || selectedDates.length === 0) {
            setSchedule(null);
            return;
        }

        const date = selectedDates[currentDateIndex]; // Use currentDateIndex
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const dayOfWeek = days[date.getDay()];
        const options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const formattedDate = date.toLocaleDateString('en-AU', options);

        const termInfo = getTermAndWeek(date); // Get term and week information

        const inheritedDuties = findDutiesForTeacher(selectedTeacher, dayOfWeek as any);
        const duties = [...inheritedDuties, ...manualDuties];
        const teacherClass = getTeacherClass(selectedTeacher);
        const teacherInfo = getTeacherInfo(selectedTeacher);
        const isRFFSpecialist = teacherInfo && teacherInfo.role === 'RFF Specialist';

        let allRFFSlots: any[] = [];
        if (isRFFSpecialist) {
            allRFFSlots = findRFFForTeacher(selectedTeacher, dayOfWeek).filter(rff => rff.class === 'RFF');
        } else {
            allRFFSlots = findRFFForClass(teacherClass || '', dayOfWeek);
        }
        
        setSchedule({
            teacher: selectedTeacher,
            teacherClass: teacherClass,
            date: date.toISOString().split('T')[0],
            day: dayOfWeek,
            formattedDate: formattedDate,
            duties,
            rffSlots: allRFFSlots,
            assignedCasual: selectedCasual,
            termInfo: termInfo // Add termInfo to the schedule
        });
    }, [selectedTeacher, selectedDates, currentDateIndex, isLoading, selectedCasual, manualDuties]); // Add currentDateIndex to dependencies

    const handleTeacherSelect = (teacher: string) => {
        setSelectedTeacher(teacher);
    };

    const handleCasualSelect = (casual: string) => {
        setSelectedCasual(casual);
    };

    const handlePreviousDate = () => {
        setCurrentDateIndex(prevIndex => Math.max(0, prevIndex - 1));
    };

    const handleNextDate = () => {
        setCurrentDateIndex(prevIndex => Math.min(selectedDates.length - 1, prevIndex + 1));
    };

    const handleGenerateSpreadsheet = () => {
        if (!schedule) return;

        const dutiesToCover = [...schedule.duties, ...manualDuties]
            .map(d => `- ${d.timeSlot || d.time}: ${d.area || d.location}`)
            .join('\n');

        const rffDetails = schedule.rffSlots
            .map((r: any) => `- ${r.timeSlot}: ${r.activity} at ${r.location || 'N/A'}`)
            .join('\n');

        const data = `Absent Teacher: ${schedule.teacher}\n` +
                     `Casual Teacher: ${schedule.assignedCasual}\n` +
                     `Date: ${schedule.formattedDate}\n\n` +
                     `Duties to Cover:\n${dutiesToCover}\n\n` +
                     `RFF Locations:\n${rffDetails}`;
        setSpreadsheetData(data);
    };

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
        termInfo: schedule?.termInfo // Return termInfo explicitly
    };
}
