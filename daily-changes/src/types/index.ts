export interface Teacher {
  id: string;
  name: string;
  className?: string;
  email?: string;
}

export interface TeacherClassMap {
  teacherId: string;
  className: string;
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

export interface DutyAssignment {
  timeSlot: string;
  location: string;
  type: 'inherited' | 'manual';
}

export interface AppState {
  teachers: Teacher[];
  teacherClassMap: TeacherClassMap[];
  rffSlots: RFFSlot[];
  dutySlots: DutySlot[];
  rffDebts: RFFDebt[];
  casuals: CasualTeacher[];
  absentTeachers: string[];
  assignments: Assignment[];
  casualInstructions: CasualInstructions[];
  lastDataUpdate: Date;
  isLoading: boolean;
  error: string | null;
}
