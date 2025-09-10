import React, { useState, useEffect, useMemo, useContext } from 'react';
import { AppContext } from '../contexts/AppContext';
import { loadDutyData, findDutiesForTeacher } from '../data/DutyRoster';
import { loadRFFData, findRFFForTeacher, findRFFForClass } from '../data/RFFRoster';
import { getRFFPaybackList } from '../data/RFFPaybackData';
import { getTeacherClass, getTeachersByRole, getTeacherInfo } from '../data/ClassTeacher';
import { loadTimeSlotsData, getSessionTitle } from '../data/TimeSlots';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { TeacherCasualSearch } from '../components/custom/TeacherCasualSearch';
import { cn } from '../lib/utils';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";


function CasualManagerPage() {
    const { state, dispatch } = useContext(AppContext);
    const { manualDuties } = state;
    const [selectedTeacher, setSelectedTeacher] = useState('');
    const [selectedCasual, setSelectedCasual] = useState('');
    // Removed searchTerm and casualSearchTerm as they are now managed internally by TeacherCasualSearch
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [schedule, setSchedule] = useState<any>(null);
    const [spreadsheetData, setSpreadsheetData] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    // Removed teacherComboboxOpen and casualComboboxOpen as they are now managed internally by TeacherCasualSearch
    const [isAddDutyModalOpen, setIsAddDutyModalOpen] = useState(false);
    const [newDutyTimeSlot, setNewDutyTimeSlot] = useState('');
    const [newDutyLocation, setNewDutyLocation] = useState('');


    useEffect(() => {
        async function loadAllData() {
            setIsLoading(true);
            await Promise.all([loadDutyData(), loadRFFData(), loadTimeSlotsData()]);
            setIsLoading(false);
        }
        loadAllData();
    }, []);

    const allTeachers = useMemo(() => {
        if (isLoading) return [];
        return getTeachersByRole('all').sort();
    }, [isLoading]);

    // Hardcoded casuals for now, similar to previous select options
    const allCasuals = useMemo(() => {
        return ["Casual A", "Casual B", "Casual C"].sort();
    }, []);

    const handleTeacherSelect = (teacher: string) => {
        setSelectedTeacher(teacher);
        // searchTerm is now managed by TeacherCasualSearch internally
    };

    const handleCasualSelect = (casual: string) => {
        setSelectedCasual(casual);
        // casualSearchTerm is now managed by TeacherCasualSearch internally
    };

    const handleDateChange = (offset: number) => {
        const currentDate = new Date(selectedDate);
        currentDate.setDate(currentDate.getDate() + offset);
        setSelectedDate(currentDate.toISOString().split('T')[0]);
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

    useEffect(() => {
        if (isLoading || !selectedTeacher) {
            setSchedule(null);
            return;
        }

        const date = new Date(selectedDate);
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const dayOfWeek = days[date.getUTCDay()];
        const options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const formattedDate = date.toLocaleDateString('en-AU', options);

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

        const generateTimeline = (duties: any[], rffSlots: any[]) => {
            const items: any[] = [];
            duties.forEach(duty => items.push({ type: 'duty', time: duty.timeSlot, description: `Duty: ${duty.area}` }));
            rffSlots.forEach(rff => {
                const description = rff.class === 'RFF'
                    ? `${rff.activity} (Own RFF)`
                    : `${rff.activity} for ${rff.class} (covered by ${rff.teacher})`;
                items.push({ type: 'rff', time: rff.timeSlot, description: description });
            });
            
            const formatTime = (timeStr: string) => {
                const parts = timeStr.split('-');
                const start = parts[0].replace('.', ':').trim();
                return start;
            };

            items.sort((a, b) => {
                const timeA = formatTime(a.time);
                const timeB = formatTime(b.time);
                return timeA.localeCompare(timeB);
            });

            const groupedItems: { [key: string]: any[] } = {};
            items.forEach(item => {
                const sessionTitle = getSessionTitle(item.time);
                if (!groupedItems[sessionTitle]) {
                    groupedItems[sessionTitle] = [];
                }
                groupedItems[sessionTitle].push({
                    ...item,
                    displayTime: item.time.replace(/\s*(am|pm)/gi, '').replace(/\./g, ':')
                });
            });

            return groupedItems;
        };

        const timeline = generateTimeline(duties, allRFFSlots);

        setSchedule({
            teacher: selectedTeacher,
            teacherClass: teacherClass,
            date: selectedDate,
            day: dayOfWeek,
            formattedDate: formattedDate,
            duties,
            rffSlots: allRFFSlots,
            timeline,
            assignedCasual: selectedCasual
        });
    }, [selectedTeacher, selectedDate, isLoading, selectedCasual]);


    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-6">Daily Casual Manager</h1>
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                <aside className="lg:col-span-1">
                    <Card className="p-6 flex flex-col gap-4">
                        <h2 className="text-xl font-bold mb-2">Controls</h2>
                        <TeacherCasualSearch
                            id="teacher-search"
                            label="Absent Teacher"
                            placeholder="Search for a teacher..."
                            items={allTeachers}
                            selectedValue={selectedTeacher}
                            onValueChange={handleTeacherSelect}
                            isLoading={isLoading}
                        />
                        <div className="control-group flex flex-col gap-2">
                            <Label htmlFor="date-select">Date</Label>
                            <div className="flex">
                                <Button variant="outline" onClick={() => handleDateChange(-1)} className="rounded-r-none">‹ Prev</Button>
                                <Input id="date-select" type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} className="rounded-none flex-grow"/>
                                <Button variant="outline" onClick={() => handleDateChange(1)} className="rounded-l-none">Next ›</Button>
                            </div>
                        </div>
                        <TeacherCasualSearch
                            id="casual-select"
                            label="Assign Casual"
                            placeholder="Search casual..."
                            items={allCasuals}
                            selectedValue={selectedCasual}
                            onValueChange={handleCasualSelect}
                            isLoading={isLoading}
                        />
                        <div className="control-group flex gap-2 mt-auto">
                            <Button onClick={() => setIsAddDutyModalOpen(true)} variant="outline" className="flex-grow">Add Duty</Button>
                            <Button 
                                onClick={handleGenerateSpreadsheet}
                                disabled={!selectedTeacher || !selectedCasual}
                                className="flex-grow"
                            >
                                Generate Data
                            </Button>
                        </div>
                    </Card>
                </aside>

                <main className="lg:col-span-3 flex flex-col gap-6">
                    {schedule && (
                        <>
                            <Card className="p-6">
                                <h2 className="text-xl font-bold mb-2">Schedule for {schedule.teacher} ({schedule.teacherClass || 'No class assigned'})</h2>
                                <p className="text-gray-600">{schedule.formattedDate}</p>
                                {schedule.assignedCasual && <p className="text-green-600 font-bold">Covered by: {schedule.assignedCasual}</p>}
                            </Card>
                            <Card className="p-6">
                                <h3 className="text-lg font-bold mb-4">Daily Timeline</h3>
                                {schedule.day === 'Saturday' || schedule.day === 'Sunday' ? (
                                    <p>It's the weekend! Hopefully {schedule.teacher} is enjoying their time off.</p>
                                ) : Object.keys(schedule.timeline).length > 0 ? (
                                    Object.keys(schedule.timeline).map(sessionTitle => (
                                        <div key={sessionTitle} className="mb-4 last:mb-0">
                                            <h4 className="font-bold mt-2 text-md">{sessionTitle}</h4>
                                            {schedule.timeline[sessionTitle].map((item: any, index: number) => (
                                                <div key={index} className={`timeline-item p-3 my-2 rounded-md border-l-4 ${item.type === 'duty' ? 'border-red-500 bg-red-100' : 'border-blue-500 bg-blue-100'}`}>
                                                    <div className="font-bold">{item.displayTime}</div>
                                                    <div>{item.description} {schedule.assignedCasual && item.type === 'duty' && `(Covered by ${schedule.assignedCasual})`}</div>
                                                </div>
                                            ))}
                                        </div>
                                    ))
                                ) : (
                                    <p>No duties or RFF slots found for this teacher on the selected day.</p>
                                )}
                            </Card>

                            {schedule.rffSlots.length > 0 && (
                                <Card className="p-6">
                                    <h3 className="text-lg font-bold mb-4">Suggested RFF Payback</h3>
                                    {getRFFPaybackList().length > 0 ? (
                                        <ol className="list-decimal list-inside pl-4">
                                            {getRFFPaybackList().map((teacher, index) => (
                                                <li key={index} className="mb-2">
                                                    {teacher.teacher}: {teacher.slotsOwed} {teacher.slotsOwed === 1 ? 'slot' : 'slots'} owed
                                                </li>
                                            ))}
                                        </ol>
                                    ) : (
                                        <p>No teachers currently owed RFF payback.</p>
                                    )}
                                </Card>
                            )}
                        </>
                    )}

                    {spreadsheetData && (
                        <Card className="p-6">
                            <h2 className="text-xl font-bold mb-4">Spreadsheet Preview</h2>
                            <textarea
                                className="w-full h-64 p-3 border rounded-md resize-y"
                                value={spreadsheetData}
                                onChange={e => setSpreadsheetData(e.target.value)}
                            />
                        </Card>
                    )}
                </main>
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

export default CasualManagerPage;
