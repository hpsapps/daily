import React from 'react';
import { Button } from '../../ui/button';
import { Card } from '../../ui/card';
import { Label } from '../../ui/label';
import { TeacherCasualSearch } from '../../custom/TeacherCasualSearch';
import { Search, X } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '../../ui/popover';
import { Calendar } from '../../ui/calendar';
import { format } from 'date-fns';
import { cn } from '../../../lib/utils';

interface TeacherSearchCardProps {
    allTeachers: string[];
    selectedTeacher: string;
    selectedDates: Date[];
    isLoading: boolean;
    onTeacherSelect: (teacher: string) => void;
    onDateChange: (dates: Date[]) => void;
}

export function TeacherSearchCard({
    allTeachers,
    selectedTeacher,
    selectedDates,
    isLoading,
    onTeacherSelect,
    onDateChange
}: TeacherSearchCardProps) {

    const handleDateRemove = (dateToRemove: Date) => {
        onDateChange(selectedDates.filter(date => date.getTime() !== dateToRemove.getTime()));
    };

    return (
        <Card className="p-6 mb-8 border">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
                <span className="bg-primary text-primary-foreground rounded-full h-8 w-8 text-sm flex items-center justify-center mr-3">1</span>
                Search for Absent Teacher
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <Label htmlFor="teacher-search" className="block text-sm font-medium mb-1">Teacher Name</Label>
                    <div className="relative">
                        <TeacherCasualSearch
                            id="teacher-search"
                            placeholder="Start typing teacher name..."
                            items={allTeachers}
                            selectedValue={selectedTeacher}
                            onValueChange={onTeacherSelect}
                            isLoading={isLoading}
                        />
                        <Search className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    </div>
                </div>
                
                <div>
                    <Label htmlFor="date-select" className="block text-sm font-medium mb-1">Date(s)</Label>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant={"outline"}
                                className={cn(
                                    "w-full justify-start text-left font-normal",
                                    !selectedDates.length && "text-muted-foreground"
                                )}
                            >
                                {selectedDates.length > 0 ? (
                                    <span>{selectedDates.length} date(s) selected</span>
                                ) : (
                                    <span>Pick a date</span>
                                )}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 rounded-lg border shadow-sm">
                            <Calendar
                                mode="multiple"
                                selected={selectedDates}
                                onSelect={(dates) => onDateChange(dates || [])}
                                disabled={{ dayOfWeek: [0, 6] }}
                                initialFocus
                            />
                        </PopoverContent>
                    </Popover>
                    {selectedDates.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                            {selectedDates.sort((a, b) => a.getTime() - b.getTime()).map((date, index) => (
                                <div key={index} className="flex items-center bg-muted text-muted-foreground rounded-full pl-3 pr-1 py-1 text-xs">
                                    <span>{format(date, "dd MMM yy")}</span>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-5 w-5 ml-1 rounded-full"
                                        onClick={() => handleDateRemove(date)}
                                    >
                                        <X className="h-3 w-3" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </Card>
    );
}
