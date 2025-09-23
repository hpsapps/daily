import { useState } from 'react';
import { Button } from '../../ui/button';
import { Construction } from 'lucide-react';
import type { Schedule, ScheduleEntry } from '../../../types'; // Import Schedule and ScheduleEntry types

interface AssignmentPreviewProps {
    schedule: Schedule | null;
    onSpreadsheetDataChange: (data: string) => void;
    selectedCasual: string | null;
    onGenerateSpreadsheet: () => void;
    onAddManualDutyClick: () => void;
    setSchedule: React.Dispatch<React.SetStateAction<Schedule | null>>; // Add setSchedule prop
}

export function AssignmentPreview({ schedule, onSpreadsheetDataChange, selectedCasual, onGenerateSpreadsheet, onAddManualDutyClick, setSchedule }: AssignmentPreviewProps) {
    const [showMessage] = useState(false);

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
        const rffString = `"${rffs.join('\n')}"`;
        const classString = `"${classes.join('\n')}"`;
        const execReleaseString = `"${execReleases.join('\n')}"`;

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
            <div className="w-full p-3 border rounded-md bg-secondary whitespace-pre-wrap">
                {schedule.dailySchedule.length > 0 ? (
                    schedule.dailySchedule.map((entry, index) => (
                        <p key={index} className="mb-1" dangerouslySetInnerHTML={{ __html: formatScheduleLine(entry) }} />
                    ))
                ) : (
                    <p className="text-muted-foreground">No schedule details available for this day.</p>
                )}
            </div>

            <div className="flex space-x-2 mt-4">
                <Button variant="secondary" onClick={onAddManualDutyClick}>
                    Add Manual Duty
                </Button>
                <Button onClick={() => navigator.clipboard.writeText(generateSpreadsheetContent())}>
                    Copy to Clipboard
                </Button>
            </div>

            {showMessage && (
                <div className="rounded-md bg-amber-50 p-4 mt-4">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <Construction className="h-5 w-5 text-amber-800" />
                        </div>
                        <div className="ml-3">
                            <h3 className="text-sm font-medium text-amber-800">Feature in Progress...</h3>
                            <div className="mt-2 text-sm text-amber-800">
                                <p>Yeah, one day!!</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
