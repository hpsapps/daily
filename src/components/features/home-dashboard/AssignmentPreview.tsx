import { useState } from 'react';
import { Button } from '../../ui/button';
import { Construction } from 'lucide-react';
import type { Schedule, ScheduleEntry } from '../../../types'; // Import Schedule and ScheduleEntry types
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../../ui/dialog'; // Import Dialog components

interface AssignmentPreviewProps {
    schedule: Schedule | null;
    selectedCasual: string | null;
    onGenerateSpreadsheet: () => void;
}

export function AssignmentPreview({ schedule, selectedCasual, onGenerateSpreadsheet }: AssignmentPreviewProps) {
    const [isUnderConstructionModalOpen, setIsUnderConstructionModalOpen] = useState(false);

    const handleUnderConstructionClick = () => {
        setIsUnderConstructionModalOpen(true);
    };

    // If no schedule or no selected casual, display a message or null
    if (!schedule || !selectedCasual) {
        return (
            <div className='p-4 mb-8' id="assignment-preview">
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                    Preview Day for {selectedCasual || '...'}
                </h2>
                <p className="text-muted-foreground">Select a casual teacher to load details.</p>
                <Button className="mt-4" onClick={onGenerateSpreadsheet} disabled={!selectedCasual}>
                    Load Details
                </Button>
            </div>
        );
    }

    const formatScheduleLine = (entry: ScheduleEntry) => {
        const time = `<span>${entry.time}</span>`;
        let descriptionContent: string = entry.description;
        let typeContent: string = entry.type;

        if (entry.type === 'RFF' || entry.type === 'Duty') {
            descriptionContent = `<em>${descriptionContent}</em>`;
            typeContent = `<strong>${typeContent}</strong>`;
            return `${time} ${descriptionContent} ${typeContent}`;
        } else if (entry.type === 'Class' || entry.type === 'Exec Release') {
            return `${time} ${descriptionContent}`;
        }
        return `${time} ${descriptionContent}`;
    };

    const generateSpreadsheetContent = () => {
        if (!schedule) return '';

        const absentTeacherName = schedule.selectedTeacherInfo.name || '';
        const className = schedule.selectedTeacherInfo.className || '';
        const casualTeacherName = selectedCasual || '';

        const duties: string[] = [];
        const rffs: string[] = [];
        const classes: string[] = [];
        const execReleases: string[] = [];

        schedule.dailySchedule.forEach(entry => {
            if (entry.type === 'Duty') {
                duties.push(`${entry.time} - ${entry.description}`);
            } else if (entry.type === 'RFF') {
                rffs.push(`${entry.time} - ${entry.description}`);
            } else if (entry.type === 'Class') {
                classes.push(`${entry.time} - ${entry.description}`);
            } else if (entry.type === 'Exec Release') {
                execReleases.push(`${entry.time} - ${entry.description}`);
            }
        });

        const dutyString = `"${duties.join('\n')}"`;

        // For RFF specialists, we want to include their classes and exec releases in the RFF column,
        // or perhaps in a combined "Schedule" column.
        // For now, let's combine all non-duty entries into the RFF column for simplicity,
        // as the user mentioned "RFF (multiple RFF in a single cell listing time - Class)"
        const combinedRffAndClasses = [...rffs, ...classes, ...execReleases].join('\n');
        const finalRffString = `"${combinedRffAndClasses}"`;


        return `${absentTeacherName}\t${className}\t${casualTeacherName}\t${dutyString}\t${finalRffString}`;
    };

    return (
        <div className='p-4 mb-8' id="assignment-preview">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
                {selectedCasual ? `Preview Day for ${selectedCasual}` : 'Spreadsheet Preview'}
            </h2>

            <div className="flex space-x-2 mt-4 mb-4">
                <Button onClick={() => navigator.clipboard.writeText(generateSpreadsheetContent())}>
                    Copy to Clipboard
                </Button>
                <Button onClick={handleUnderConstructionClick} disabled={!schedule}>
                    Send to Spreadsheet
                </Button>
                <Button onClick={handleUnderConstructionClick} disabled={!schedule || !selectedCasual}>
                    Send to Casual
                </Button>
            </div>

            <Dialog open={isUnderConstructionModalOpen} onOpenChange={setIsUnderConstructionModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="flex items-center">
                            <Construction className="mr-2 h-5 w-5 text-yellow-500" />
                            Under Construction!
                        </DialogTitle>
                        <DialogDescription>
                            This feature is still being built. We need more funding for this awesome functionality!
                        </DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
            <div className="w-full p-3 border rounded-md bg-secondary whitespace-pre-wrap">
                {schedule.dailySchedule.length > 0 ? (
                    schedule.dailySchedule.map((entry, index) => (
                        <p key={index} className="mb-1" dangerouslySetInnerHTML={{ __html: formatScheduleLine(entry) }} />
                    ))
                ) : (
                    <p className="text-muted-foreground">No schedule details available for this day.</p>
                )}
            </div>

        </div>
    );
}
