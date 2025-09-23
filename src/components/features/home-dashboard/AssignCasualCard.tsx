import { Label } from '../../ui/label';
import { TeacherCasualSearch } from '../../custom/TeacherCasualSearch';
import { CheckCircle } from 'lucide-react';

interface AssignCasualCardProps {
    allCasuals: string[];
    selectedCasual: string;
    selectedTeacher: string;
    isLoading: boolean;
    onCasualSelect: (casual: string) => void;
}

export function AssignCasualCard({
    allCasuals,
    selectedCasual,
    selectedTeacher,
    isLoading,
    onCasualSelect
}: AssignCasualCardProps) {
    return (
        <div className='p-4 mb-8' id="assign-casual-card">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
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
                                    <p className="text-sm text-green-600">{selectedCasual} has been assigned to cover {selectedTeacher}.</p>
                            </div>
                        </div>
                    </div>
                    
                </div>
            )}
        </div>
    );
}
