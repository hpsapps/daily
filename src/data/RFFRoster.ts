export interface RFF_Assignment {
  teacher: string;
  activity: string;
  class: string;
}

export interface RFF_TimeSlot {
  time: string;
  assignments: RFF_Assignment[];
}

export interface RFF_Data {
  [day: string]: RFF_TimeSlot[];
}

let rffData: RFF_Data = {};

export async function loadRFFData(): Promise<RFF_Data> {
  try {
    const response = await fetch('/data/RFF.json');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data: RFF_Data = await response.json();
    rffData = data;
    return data;
  } catch (error) {
    console.error("Could not load RFF data:", error);
    return {};
  }
}

export const rffNotes: { [key: string]: string } = {
  'KN': 'Narelle to cover 4C every even week as both Narelle and Gabi are 4 days per week',
  'Fed Rep': 'Maz to cover 5H in classroom for Gemma to have Fed Rep time',
  'ECT#': 'Karen to cover 3C and 6L (in classrooms) for Chelsea and Holly to have school funded ECT time. 3C odd weeks and 6L even weeks',
  'Christina': 'James to take whatever class Christina has for the day in the classroom for Christina to have RFF',
  '1G': 'Fi to cover 1A every even week as both Fi and Renee work 4 days per week',
  'ICT': 'Sport RFF and Karen to cover 1S in classroom for Giuseppe to have ICT coordinator RFF',
  '6H': 'Sport RFF to cover 6H in classroom for Christina to have RFF'
};

export const getTeachersFromRFFRoster = (): string[] => {
  const teachers = new Set<string>();
  for (const day in rffData) {
    rffData[day].forEach(timeSlot => {
      timeSlot.assignments.forEach(assignment => {
        if (assignment.teacher && assignment.teacher !== 'TBC') {
          teachers.add(assignment.teacher);
        }
      });
    });
  }
  return Array.from(teachers);
};

export const findRFFForTeacher = (teacherName: string, dayOfWeek: string): { timeSlot: string; activity: string; class: string; teacher: string; notes: string }[] => {
  const rffSlots: { timeSlot: string; activity: string; class: string; teacher: string; notes: string }[] = [];
  const dayData = rffData[dayOfWeek];

  if (dayData) {
    dayData.forEach(timeSlot => {
      timeSlot.assignments.forEach(assignment => {
        if (assignment.teacher === teacherName && assignment.class) {
          rffSlots.push({
            timeSlot: timeSlot.time,
            activity: assignment.activity,
            class: assignment.class,
            teacher: teacherName,
            notes: rffNotes[assignment.class] || ''
          });
        }
      });
    });
  }
  
  return rffSlots;
};

export const getRFFTimeSlots = (): string[] => {
  const timeSlots = new Set<string>();
  for (const day in rffData) {
    rffData[day].forEach(timeSlot => {
      timeSlots.add(timeSlot.time);
    });
  }
  return Array.from(timeSlots);
};

export const getTeacherActivities = (teacherName: string): string[] => {
  const activities = new Set<string>();
  for (const day in rffData) {
    rffData[day].forEach(timeSlot => {
      timeSlot.assignments.forEach(assignment => {
        if (assignment.teacher === teacherName && assignment.activity) {
          activities.add(assignment.activity);
        }
      });
    });
  }
  return Array.from(activities);
};

export const findRFFForClass = (className: string, dayOfWeek: string): { timeSlot: string; activity: string; class: string; teacher: string }[] => {
    const slots: { timeSlot: string; activity: string; class: string; teacher: string }[] = [];
    const dayData = rffData[dayOfWeek];

    if (dayData && className) {
        dayData.forEach(timeSlot => {
            timeSlot.assignments.forEach(assignment => {
                if (assignment.class && assignment.class.includes(className)) {
                    slots.push({
                        timeSlot: timeSlot.time,
                        activity: `RFF: ${assignment.activity}`,
                        class: assignment.class,
                        teacher: assignment.teacher
                    });
                }
            });
        });
    }
    return slots;
};
