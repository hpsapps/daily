import React, { useState, useContext } from 'react';
import { AppContext } from '../contexts/AppContext';
import { Button } from '../components/ui/button';
import { useScheduleData } from '../hooks/useScheduleData';
import { useTeacherAndCasualLists } from '../hooks/useTeacherAndCasualLists';
import { TeacherSearchCard } from '../components/features/home-dashboard/TeacherSearchCard';
import { ScheduleDisplayCard } from '../components/features/home-dashboard/ScheduleDisplayCard';
import { AssignCasualCard } from '../components/features/home-dashboard/AssignCasualCard';
import { AssignmentPreview } from '../components/features/home-dashboard/AssignmentPreview';
import AddManualDutyDialog from '../components/features/manual-duty/AddManualDutyDialog';

function NewHomePage() {
    const { dispatch } = useContext(AppContext);
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

            <AddManualDutyDialog
                isOpen={isAddDutyModalOpen}
                onOpenChange={setIsAddDutyModalOpen}
            />
        </div>
    );
}

export default NewHomePage;
