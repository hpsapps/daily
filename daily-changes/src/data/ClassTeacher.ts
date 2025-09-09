export interface ClassAssignment {
  teacher: string;
  class: string;
  yearLevel: string;
  fullTime: boolean;
  notes?: string;
}

export interface RFFSpecialist {
  teacher: string;
  subjects: string[];
  fullTime: boolean;
  notes?: string;
  role?: string;
}

export interface SupportStaff {
  teacher: string;
  role: string;
  duties?: string[];
  notes?: string;
}

export const classAssignments: ClassAssignment[] = [
  // Kindergarten Classes
  { teacher: 'Katherine', class: 'KB', yearLevel: 'Kindergarten', fullTime: true },
  { teacher: 'Sophie', class: 'KN', yearLevel: 'Kindergarten', fullTime: true },
  { teacher: 'Veronica', class: 'KV', yearLevel: 'Kindergarten', fullTime: true },
  { teacher: 'Bronwyn', class: 'KS', yearLevel: 'Kindergarten', fullTime: true },
  { teacher: 'Helen', class: 'KK', yearLevel: 'Kindergarten', fullTime: true },
  { teacher: 'Nikki', class: 'KE', yearLevel: 'Kindergarten', fullTime: true },
  
  // Year 1 Classes
  { teacher: 'Giuseppe', class: '1S', yearLevel: 'Year 1', fullTime: true, notes: 'ICT Coordinator' },
  { teacher: 'Renee', class: '1A', yearLevel: 'Year 1', fullTime: false, notes: '4 days per week' },
  { teacher: 'Sarah O', class: '1O', yearLevel: 'Year 1', fullTime: true },
  { teacher: 'Tarsh', class: '1D', yearLevel: 'Year 1', fullTime: true },
  { teacher: 'Aliy', class: '1MS', yearLevel: 'Year 1', fullTime: true },
  { teacher: 'Jen B', class: '1G', yearLevel: 'Year 1', fullTime: true },
  
  // Year 2 Classes
  { teacher: 'Tanya', class: '2H', yearLevel: 'Year 2', fullTime: true },
  { teacher: 'Liz C', class: '2E', yearLevel: 'Year 2', fullTime: true },
  { teacher: 'Susan', class: '2B', yearLevel: 'Year 2', fullTime: true },
  { teacher: 'Belinda', class: '2Y', yearLevel: 'Year 2', fullTime: true },
  { teacher: 'Elise', class: '2D', yearLevel: 'Year 2', fullTime: true },
  
  // Year 3 Classes
  { teacher: 'Chelsea', class: '3C', yearLevel: 'Year 3', fullTime: true, notes: 'ECT - Early Career Teacher' },
  { teacher: 'Kati H', class: '3H', yearLevel: 'Year 3', fullTime: true },
  { teacher: 'Jeanette', class: '3N', yearLevel: 'Year 3', fullTime: true },
  { teacher: 'Liz W', class: '3E', yearLevel: 'Year 3', fullTime: true },
  
  // Year 4 Classes
  { teacher: 'Claire D', class: '4W', yearLevel: 'Year 4', fullTime: true },
  { teacher: 'Gabrielle', class: '4C', yearLevel: 'Year 4', fullTime: false, notes: '4 days per week' },
  { teacher: 'Anna', class: '4I', yearLevel: 'Year 4', fullTime: true },
  
  // Year 5 Classes
  { teacher: 'Gemma', class: '5H', yearLevel: 'Year 5', fullTime: true, notes: 'Fed Rep arrangements' },
  { teacher: 'Rachel', class: '5F', yearLevel: 'Year 5', fullTime: true },
  { teacher: 'Dane', class: '5M', yearLevel: 'Year 5', fullTime: true },
  { teacher: 'Michael', class: '5E', yearLevel: 'Year 5', fullTime: true },


  // Year 6 Classes
  { teacher: 'Holly', class: '6L', yearLevel: 'Year 6', fullTime: true, notes: 'ECT - Early Career Teacher' },
  { teacher: 'Christina', class: '6W', yearLevel: 'Year 6', fullTime: true },
  { teacher: 'Kati', class: '6H', yearLevel: 'Year 6', fullTime: true }
];

export const rffSpecialists: RFFSpecialist[] = [
  { teacher: 'Alice', subjects: ['Music'], fullTime: true },
  { teacher: 'James', subjects: ['Sport'], fullTime: true, notes: 'Covers for Christina RFF' },
  { teacher: 'Maz', subjects: ['Sport'], fullTime: true, notes: 'Fed Rep cover for 5H' },
  { teacher: 'Christine', subjects: ['Library'], fullTime: true },
  { teacher: 'Karen R', subjects: ['Library'], fullTime: true, notes: 'ECT coordinator support' },
  { teacher: 'Savanah', subjects: ['Executive'], fullTime: true, role: 'Assistant Principal' },
  { teacher: 'Glenda', subjects: ['Executive'], fullTime: true, role: 'Deputy Principal' }
];

export const supportStaff: SupportStaff[] = [
  { teacher: 'Lisa', role: 'Administration', duties: ['Gate duty', 'Office support'] },
  { teacher: 'Priscilla', role: 'Casual/Relief', duties: ['After school gate duty'] },
  { teacher: 'Narelle', role: 'Support', notes: 'Covers 4C on even weeks' },
  { teacher: 'Fiona', role: 'Support', notes: 'Covers 1A on even weeks' },
  { teacher: 'Daana', role: 'Support', duties: ['Garden supervision'] },
  { teacher: 'Matt', role: 'Support', duties: ['Lunch supervision Week 1 only'] }
];

export const getTeacherClass = (teacherName: string): string | null => {
  const assignment = classAssignments.find(item => item.teacher === teacherName);
  return assignment ? assignment.class : null;
};

export const getClassTeacher = (className: string): string | null => {
  const assignment = classAssignments.find(item => item.class === className);
  return assignment ? assignment.teacher : null;
};

export const getClassesByYearLevel = (yearLevel: string): { teacher: string; class: string }[] => {
  return classAssignments
    .filter(item => item.yearLevel === yearLevel)
    .map(item => ({ teacher: item.teacher, class: item.class }));
};

export const getTeachersByRole = (roleType: 'classroom' | 'rff' | 'specialist' | 'support' | 'all' = 'classroom'): string[] => {
  switch (roleType) {
    case 'classroom':
      return classAssignments.map(item => item.teacher);
    case 'rff':
    case 'specialist':
      return rffSpecialists.map(item => item.teacher);
    case 'support':
      return supportStaff.map(item => item.teacher);
    case 'all':
      return [
        ...classAssignments.map(item => item.teacher),
        ...rffSpecialists.map(item => item.teacher),
        ...supportStaff.map(item => item.teacher)
      ];
    default:
      return [];
  }
};

export const getTeacherInfo = (teacherName: string): (ClassAssignment | RFFSpecialist | SupportStaff) & { role: string } | null => {
  let info: ClassAssignment | RFFSpecialist | SupportStaff | undefined;
  
  info = classAssignments.find(item => item.teacher === teacherName);
  if (info) return { ...info, role: 'Classroom Teacher' };
  
  info = rffSpecialists.find(item => item.teacher === teacherName);
  if (info) return { ...info, role: 'RFF Specialist' };
  
  info = supportStaff.find(item => item.teacher === teacherName);
  if (info) return { ...info, role: 'Support Staff' };
  
  return null;
};

export const getYearLevelFromClass = (classCode: string): string | null => {
  if (!classCode) return null;
  
  const firstChar = classCode.charAt(0);
  switch (firstChar) {
    case 'K': return 'Kindergarten';
    case '1': return 'Year 1';
    case '2': return 'Year 2';
    case '3': return 'Year 3';
    case '4': return 'Year 4';
    case '5': return 'Year 5';
    case '6': return 'Year 6';
    default: return null;
  }
};

export const getAllClasses = (): string[] => {
  return classAssignments.map(item => item.class).sort((a, b) => {
    const yearA = a.charAt(0);
    const yearB = b.charAt(0);
    if (yearA !== yearB) {
      if (yearA === 'K') return -1;
      if (yearB === 'K') return 1;
      return yearA.localeCompare(yearB);
    }
    return a.localeCompare(b);
  });
};

export const partTimeArrangements = {
  'Gabrielle': {
    workDays: 4,
    coverTeacher: 'Narelle',
    coverSchedule: 'Even weeks',
    notes: '4C covered by Narelle on even weeks'
  },
  'Renee': {
    workDays: 4,
    coverTeacher: 'Fiona',
    coverSchedule: 'Even weeks',
    notes: '1A covered by Fiona on even weeks'
  }
};

export default {
  classAssignments,
  rffSpecialists,
  supportStaff,
  partTimeArrangements,
  getTeacherClass,
  getClassTeacher,
  getClassesByYearLevel,
  getTeachersByRole,
  getTeacherInfo,
  getYearLevelFromClass,
  getAllClasses
};
