export interface Teacher {
  id: string;
  name: string;
  className?: string;
  email?: string;
  role?: string; // Added role property
}


export interface RFFSlot {
  id: string;
  teacherId: string;
  day: string;
  startTime: string;
  endTime: string;
  subject: string;
  coveringTeacher: string;
  location?: string;
}

export interface DutySlot {
  id: string;
  teacherId: string;
  day: string;
  timeSlot: string;
  area: string;
}

export interface RFFDebt {
  id: string;
  teacherId: string;
  hoursOwed: number;
  reason: string;
  dateCreated: Date;
  dateCleared?: Date;
  clearedBy?: string;
}

export interface CasualTeacher {
  id: string;
  name: string;
  email?: string;
  phone?: string;
}

export interface Assignment {
  casualId: string;
  absentTeacherId: string;
  classAssignments: ClassAssignment[];
  dutyAssignments: string[];
}

export interface ClassAssignment {
  timeSlot: string;
  assignedToClass: string;
  replacingTeacher?: string;
}

export interface CasualInstructions {
  casualId: string;
  casualName: string;
  date: Date;
  primaryClass: string;
  absentTeacher: string;
  rffAssignments: RFFAssignment[];
  dutyAssignments: DutyAssignment[];
  notes?: string;
}

export interface RFFAssignment {
  timeSlot: string;
  instruction: string;
}

import type { RFFRosterEntry } from '../utils/excelParser';


export interface DutyAssignment {
  timeSlot: string;
  location: string;
  type: 'inherited' | 'manual';
}

export interface ScheduleEntry {
  time: string;
  type: 'RFF' | 'Class' | 'Duty' | 'N/A' | 'Exec Release';
  description: string;
  class?: string;
  location?: string;
  teacherName?: string; // The teacher assigned to this slot
}

export interface Schedule {
  selectedTeacherInfo: Teacher;
  date: string;
  day: string;
  formattedDate: string;
  duties: DutyAssignment[];
  rffSlots: RFFRosterEntry[];
  assignedCasual: string;
  termInfo: { term?: number; week?: number; type: 'term' | 'holiday' | 'development'; description: string };
  dailySchedule: ScheduleEntry[]; // Comprehensive daily schedule
}

export interface AppState {
  teachers: Teacher[];
  rffSlots: RFFSlot[];
  dutySlots: DutySlot[];
  manualDuties: DutyAssignment[];
  rffDebts: RFFDebt[];
  casuals: CasualTeacher[];
  absentTeachers: string[];
  assignments: Assignment[];
  casualInstructions: CasualInstructions[];
  rffRoster: RFFRosterEntry[]; // New RFF Roster data
  lastDataUpdate: Date;
  isLoading: boolean;
  error: string | null;
}
