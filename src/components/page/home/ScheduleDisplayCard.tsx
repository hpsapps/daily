import React from 'react';
import { Card } from '../../ui/card';
import { getTeacherInfo } from '../../../data/ClassTeacher';

interface ScheduleDisplayCardProps {
    schedule: any;
}

export function ScheduleDisplayCard({ schedule }: ScheduleDisplayCardProps) {
    if (!schedule) return null;

    return (
        <Card className="p-6 mb-8 border" id="teacher-results">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium">{schedule.teacher} - {schedule.teacherClass || 'No class assigned'}</h3>
                <span className="text-sm bg-destructive/10 text-destructive px-3 py-1 rounded-full">Absent</span>
            </div>
            
            <h4 className="font-semibold mb-2 mt-4">RFF Timeslots</h4>
            <div className="space-y-3">
                {schedule.rffSlots.length > 0 ? (
                    schedule.rffSlots.map((rff: any, index: number) => (
                        <div key={index} className="bg-secondary p-4 rounded-lg">
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="font-medium">{rff.timeSlot}</p>
                                    <p className="text-sm text-muted-foreground">Class: {rff.class} ({getTeacherInfo(rff.teacher)?.teacher})</p>
                                </div>
                                <span className="text-sm bg-primary/10 text-primary px-3 py-1 rounded-full">RFF</span>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-muted-foreground">No RFF slots found for this teacher on the selected day.</p>
                )}
            </div>
            
            <h4 className="font-semibold mb-2 mt-6">Duties</h4>
            <div id="duties-container" className="space-y-3">
                {schedule.duties.length > 0 ? (
                    schedule.duties.map((duty: any, index: number) => (
                        <div key={index} className="bg-secondary p-4 rounded-lg">
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="font-medium">{duty.timeSlot}</p>
                                    <p className="text-sm text-muted-foreground">Location: {duty.area || duty.location}</p>
                                </div>
                                <span className="text-sm bg-green-500/10 text-green-600 px-3 py-1 rounded-full">Duty</span>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-muted-foreground">No duties scheduled for this day</p>
                )}
            </div>
        </Card>
    );
}
