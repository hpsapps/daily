export interface Duty {
  Duty: string;
  Time: string;
  Area: string;
  Monday: string | null;
  Tuesday: string | null;
  Wednesday: string | null;
  Thursday: string | null;
  Friday: string | null;
}

let dutyData: Duty[] = [];

export async function loadDutyData(): Promise<Duty[]> {
  try {
    const response = await fetch('/data/DutyRoster.json');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data: Duty[] = await response.json();
    dutyData = data;
    return data;
  } catch (error) {
    console.error("Could not load Duty data:", error);
    return [];
  }
}

export const getTeachersFromDutyRoster = (): string[] => {
  const teachers = new Set<string>();
  const daysOfWeek: (keyof Duty)[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  dutyData.forEach(dutyItem => {
    daysOfWeek.forEach(day => {
      const assignedTeacher = dutyItem[day];
      if (assignedTeacher && assignedTeacher !== 'CLOSED' && !assignedTeacher.includes('Team')) {
        const names = assignedTeacher.split('/');
        names.forEach(name => {
          const cleanName = name.trim().split(' ')[0];
          if (cleanName && cleanName.length > 1) {
            teachers.add(cleanName);
          }
        });
      }
    });
  });

  return Array.from(teachers);
};

export const findDutiesForTeacher = (teacherName: string, dayOfWeek: keyof Duty): { timeSlot: string; area: string; dutyType: string }[] => {
  const duties: { timeSlot: string; area: string; dutyType: string }[] = [];

  dutyData.forEach(dutyItem => {
    const assignedTeacher = dutyItem[dayOfWeek];

    if (assignedTeacher && (assignedTeacher === teacherName || assignedTeacher.includes(teacherName))) {
      duties.push({
        timeSlot: dutyItem.Time,
        area: dutyItem.Area,
        dutyType: dutyItem.Duty
      });
    }
  });

  return duties;
};
