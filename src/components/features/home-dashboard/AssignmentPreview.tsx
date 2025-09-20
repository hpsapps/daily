import { Card } from '../../ui/card';

interface AssignmentPreviewProps {
    spreadsheetData: string;
    onSpreadsheetDataChange: (data: string) => void;
}

export function AssignmentPreview({ spreadsheetData, onSpreadsheetDataChange }: AssignmentPreviewProps) {
    if (!spreadsheetData) return null;

    return (
        <Card className="p-6 border">
            <h2 className="text-xl font-bold mb-4">Spreadsheet Preview</h2>
            <textarea
                className="w-full h-64 p-3 border rounded-md resize-y bg-secondary"
                value={spreadsheetData}
                onChange={e => onSpreadsheetDataChange(e.target.value)}
            />
        </Card>
    );
}
