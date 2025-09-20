import { useState } from 'react'; // Import useState
import { Card } from '../../ui/card';
import { Button } from '../../ui/button';
import { Construction } from 'lucide-react';

interface AssignmentPreviewProps {
    spreadsheetData: string;
    onSpreadsheetDataChange: (data: string) => void;
}

export function AssignmentPreview({ spreadsheetData, onSpreadsheetDataChange }: AssignmentPreviewProps) {
    const [showMessage, setShowMessage] = useState(false);

    if (!spreadsheetData) return null;

    return (
        <Card className="p-6 border">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
                Spreadsheet Preview
            </h2>
            <textarea
                className="w-full h-64 p-3 border rounded-md resize-y bg-secondary"
                value={spreadsheetData}
                onChange={e => onSpreadsheetDataChange(e.target.value)}
            />

            <Button className="mt-4" onClick={() => setShowMessage(true)}>
                Send to spreadsheet
            </Button>

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
        </Card>
    );
}
