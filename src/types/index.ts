export interface Teacher {
  id: string;
  name: string;
  className?: string;
  email?: string;
  role?: string;
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
  when: string;
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
  id: string; // Add unique ID for duty assignments
  timeSlot: string;
  location: string;
  type: 'inherited' | 'manual';
  when: string;
  description: string; // Add description property
  teacherId?: string; // Add optional teacherId property
  date?: string; // Add optional date property for manual duties
}

export interface ModifiedInheritedDuty {
  original: {
    dutyId: string; // Add dutyId to original for consistent matching
    timeSlot: string;
    teacherId: string;
    date: string;
  };
  updated: DutyAssignment;
}

export interface ModifiedRff {
  original: {
    id: string; // Use the ScheduleEntry ID for matching
  };
  updated: ScheduleEntry;
}

export interface ScheduleEntry {
  id: string; // Add unique ID for schedule entries
  time: string;
  type: 'RFF' | 'Class' | 'Duty' | 'N/A' | 'Exec Release';
  description: string;
  class?: string;
  location?: string;
  teacherName?: string;
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
  dailySchedule: ScheduleEntry[];
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
  rffRoster: RFFRosterEntry[];
  modifiedInheritedDuties: ModifiedInheritedDuty[]; // New state for modified inherited duties
  modifiedRffs: ModifiedRff[]; // New state for modified RFFs
  lastDataUpdate: Date;
  isLoading: boolean;
  error: string | null;
}
