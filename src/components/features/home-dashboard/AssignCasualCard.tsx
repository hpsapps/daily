import { Button } from '../../ui/button';
import { Card } from '../../ui/card';
import { Label } from '../../ui/label';
import { TeacherCasualSearch } from '../../custom/TeacherCasualSearch';
import { CheckCircle } from 'lucide-react';

interface AssignCasualCardProps {
    allCasuals: string[];
    selectedCasual: string;
    selectedTeacher: string;
    isLoading: boolean;
    onCasualSelect: (casual: string) => void;
    onGenerateSpreadsheet: () => void;
}

export function AssignCasualCard({
    allCasuals,
    selectedCasual,
    selectedTeacher,
    isLoading,
    onCasualSelect,
    onGenerateSpreadsheet
}: AssignCasualCardProps) {
    return (
        <Card className="p-6 mb-8 border" id="assign-teacher">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
                <span className="bg-primary text-primary-foreground rounded-full h-8 w-8 text-sm flex items-center justify-center mr-3">2</span>
                Assign Replacement Teacher
            </h2>
            
            <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1">
                    <Label htmlFor="casual-search" className="block text-sm font-medium mb-2">Casual Teacher</Label>
                    <div className="relative">
                        <TeacherCasualSearch
                            id="casual-search"
                            placeholder="Search casual teachers..."
                            items={allCasuals}
                            selectedValue={selectedCasual}
                            onValueChange={onCasualSelect}
                            isLoading={isLoading}
                        />
                    </div>
                </div>
            </div>
            
            {selectedCasual && (
                <div className="mt-6" id="assignment-confirmation">
                    <div className="bg-green-500/10 border border-green-500/20 rounded-md p-4">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <CheckCircle className="h-5 w-5 text-green-500" />
                            </div>
                            <div className="ml-3">
                                <h3 className="text-sm font-medium text-green-700">Assignment Complete</h3>
                                <div className="mt-2 text-sm text-green-600">
                                    <p>{selectedCasual} has been assigned to cover {selectedTeacher}'s classes and duties.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="mt-4">
                        <Button onClick={onGenerateSpreadsheet}>
                            Print Assignment Details
                        </Button>
                    </div>
                </div>
            )}
        </Card>
    );
}
