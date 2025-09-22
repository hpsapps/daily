import { useState, useContext } from 'react';
import { AppContext } from '../contexts/AppContext';
import { useScheduleData } from '../hooks/useScheduleData';
import { useTeacherAndCasualLists } from '../hooks/useTeacherAndCasualLists';
import { TeacherSearchCard } from '../components/features/home-dashboard/TeacherSearchCard';
import { ScheduleDisplayCard } from '../components/features/home-dashboard/ScheduleDisplayCard';
import { AssignCasualCard } from '../components/features/home-dashboard/AssignCasualCard';
import { AssignmentPreview } from '../components/features/home-dashboard/AssignmentPreview';
import AddManualDutyDialog from '../components/features/manual-duty/AddManualDutyDialog';
import { Card } from '@/components/ui/card';

function DailyCasualHome() {
    const { } = useContext(AppContext);
    const [isAddDutyModalOpen, setIsAddDutyModalOpen] = useState(false);

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
        currentDateIndex,
        handlePreviousDate,
        handleNextDate,
        handleGenerateSpreadsheet,
        setSpreadsheetData,
        termInfo,
        allTeachers // Destructure allTeachers from useScheduleData
    } = useScheduleData();

    const { allCasuals } = useTeacherAndCasualLists(); // Removed isLoading prop

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
                                allTeachers={allTeachers} // Use allTeachers from useScheduleData
                                selectedTeacher={selectedTeacher}
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
                                selectedTeacher={selectedTeacher}
                                isLoading={isLoading}
                                onCasualSelect={handleCasualSelect}
                                onGenerateSpreadsheet={handleGenerateSpreadsheet}
                            />
                        </div>
                    </div>
                </Card>

                {selectedTeacher && (
                    <Card className="p-6 mb-8 border" id="schedule-and-preview">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="flex flex-col">
                                <ScheduleDisplayCard
                                    schedule={schedule}
                                    selectedDates={selectedDates}
                                    currentDateIndex={currentDateIndex}
                                    onPreviousDate={handlePreviousDate}
                                    onNextDate={handleNextDate}
                                    termInfo={termInfo}
                                />
                            </div>
                            <div className="flex flex-col">
                                <AssignmentPreview
                                    spreadsheetData={spreadsheetData}
                                    onSpreadsheetDataChange={setSpreadsheetData}
                                    selectedCasual={selectedCasual}
                                />
                            </div>
                        </div>
                    </Card>
                )}
            </div>

            <AddManualDutyDialog
                isOpen={isAddDutyModalOpen}
                onOpenChange={setIsAddDutyModalOpen}
            />
        </div>
    );
}

export default DailyCasualHome;
