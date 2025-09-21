import * as XLSX from 'xlsx';
import type { Teacher, RFFSlot, DutySlot, RFFDebt } from '../types';

export interface RFFRosterEntry {
  day: string;
  time: string;
  teacher: string;
  subject: string;
  class: string;
}

// Helper to extract unique teachers from RFF and Duty slots
const extractTeachers = (rffSlots: RFFSlot[], dutySlots: DutySlot[]): Teacher[] => {
  const teacherMap = new Map<string, Teacher>();

  rffSlots.forEach(slot => {
    if (!teacherMap.has(slot.teacherId)) {
      teacherMap.set(slot.teacherId, { id: slot.teacherId, name: slot.coveringTeacher }); // Assuming coveringTeacher is the teacher's name
    }
  });

  dutySlots.forEach(slot => {
    if (!teacherMap.has(slot.teacherId)) {
      teacherMap.set(slot.teacherId, { id: slot.teacherId, name: `Teacher ${slot.teacherId}` }); // Placeholder name
    }
  });

  return Array.from(teacherMap.values());
};

const parseTeachersFromSummary = (summarySheet: XLSX.WorkSheet): Teacher[] => {
  const summaryJson = XLSX.utils.sheet_to_json(summarySheet, { header: 1 }) as string[][];
  const teachersMap = new Map<string, Teacher>();

  // Assuming headers are: Teacher Name (Col A), Class (Col B), Class Type (Col C)
  for (let i = 1; i < summaryJson.length; i++) {
    const row = summaryJson[i];
    const teacherName = row[0]?.toString();
    const className = row[1]?.toString();
    const classType = row[2]?.toString();

    if (teacherName) {
      const teacher: Teacher = { id: teacherName, name: teacherName };
      if (className) {
        teacher.className = className;
      }
      if (classType === 'RFF') {
        teacher.role = 'RFF Specialist';
      } else if (classType === 'General Class') {
        // No specific role for general class teachers, but we have their class name
      }
      teachersMap.set(teacherName, teacher);
    }
  }
  return Array.from(teachersMap.values());
};

// This function is no longer needed as className is now part of the Teacher object
const parseDutyRosterSheet = (dutyRosterSheet: XLSX.WorkSheet): DutySlot[] => {
  const json = XLSX.utils.sheet_to_json(dutyRosterSheet, { header: 1 }) as string[][];
  const headers = json[0]; // Headers: Duty, Time, Area, Monday, Tuesday, ...
  const dutySlots: DutySlot[] = [];

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const headerMap: { [key: string]: number } = {};
  headers.forEach((h, i) => {
    if (typeof h === 'string') {
      headerMap[h] = i;
    }
  });

  for (let i = 1; i < json.length; i++) {
    const row = json[i];
    const dutyType = row[headerMap['Duty']]?.toString();
    const timeSlot = row[headerMap['Time']]?.toString();
    const area = row[headerMap['Area']]?.toString();

    if (dutyType && timeSlot && area) {
      daysOfWeek.forEach(day => {
        const teacherName = row[headerMap[day]]?.toString();
        if (teacherName) {
          // Assuming teacherName can be used as teacherId for now
          dutySlots.push({
            id: `${day}-${timeSlot}-${area}-${teacherName}`, // Unique ID for each duty slot
            teacherId: teacherName, // Use teacher name as ID
            day: day,
            timeSlot: timeSlot,
            area: area,
          });
        }
      });
    }
  }
  return dutySlots;
};

const parseRFFRosterSheet = (summarySheet: XLSX.WorkSheet, allDaysSheet: XLSX.WorkSheet): RFFRosterEntry[] => {
  const summaryJson = XLSX.utils.sheet_to_json(summarySheet, { header: 1 }) as string[][];
  const allDaysJson = XLSX.utils.sheet_to_json(allDaysSheet, { header: 1 }) as string[][];

  const rffTeachersMap = new Map<string, string>(); // RFF Teacher Name -> RFF Class/Subject
  const classTeachersMap = new Map<string, string>(); // Class Taught -> Class Teacher Name

  // Parse Summary sheet for RFF Teachers and Class Teachers
  // Assuming RFF Teacher Name is in column E, RFF Class in column F
  // Assuming Class Teacher Name is in column A, Class Taught in column B
  for (let i = 1; i < summaryJson.length; i++) {
    const row = summaryJson[i];
    if (row[4] && row[5]) { // RFF Teacher Name and RFF Class
      rffTeachersMap.set(row[4].toString(), row[5].toString());
    }
    if (row[0] && row[1]) { // Class Teacher Name and Class Taught
      classTeachersMap.set(row[1].toString(), row[0].toString());
    }
  }

  const rffRoster: RFFRosterEntry[] = [];
  let currentDay = '';
  let rffTeachers: string[] = [];
  let rffClasses: string[] = [];
  const timeSlots: string[] = [];

  allDaysJson.forEach((row, rowIndex) => {
    // Identify Day
    if (row[0] && ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].includes(row[0].toString())) {
      currentDay = row[0].toString();
      rffTeachers = [];
      rffClasses = [];
      timeSlots.length = 0; // Clear previous time slots
    } else if (currentDay) {
      // Identify RFF Teachers (row after Day)
      if (row[0] === 'RFF Teacher') {
        rffTeachers = row.slice(1).filter(Boolean).map(String);
      }
      // Identify RFF Classes (row after RFF Teacher)
      else if (row[0] === 'RFF Class') {
        rffClasses = row.slice(1).filter(Boolean).map(String);
      }
      // Identify Time Slots and Schedule
      else if (row[0] && row[0].match(/^\d{1,2}\.\d{2}-\d{1,2}\.\d{2}$/)) { // Regex for time format e.g., 9.10-9.50
        const time = row[0].toString();
        row.slice(1).forEach((cell, colIndex) => {
          if (cell && rffTeachers[colIndex] && rffClasses[colIndex]) {
            rffRoster.push({
              day: currentDay,
              time: time,
              teacher: rffTeachers[colIndex],
              subject: rffClasses[colIndex],
              class: cell.toString(),
            });
          }
        });
      }
    }
  });

  return rffRoster;
};

export const parseExcelData = (file: File): Promise<{
  teachers: Teacher[];
  rffSlots: RFFSlot[];
  dutySlots: DutySlot[]; // Now dynamically parsed
  rffDebts: RFFDebt[];
  rffRoster: RFFRosterEntry[];
}> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = event.target?.result;
        const workbook = XLSX.read(data, { type: 'array' });

        const summarySheet = workbook.Sheets['Summary'];
        const allDaysSheet = workbook.Sheets['ALL DAYS'];
        const dutyRosterSheet = workbook.Sheets['Duty Roster']; // New: Get Duty Roster sheet

        if (!summarySheet || !allDaysSheet || !dutyRosterSheet) {
          throw new Error('Required sheets (Summary, ALL DAYS, Duty Roster) are missing from the Excel file for Roster parsing.');
        }

        const rffRoster = parseRFFRosterSheet(summarySheet, allDaysSheet);
        const teachers = parseTeachersFromSummary(summarySheet);
        const dutySlots = parseDutyRosterSheet(dutyRosterSheet); // New: Parse duty slots

        // Other data types are not present in this specific RFF Roster upload.
        const rffSlots: RFFSlot[] = [];
        const rffDebts: RFFDebt[] = [];

        resolve({
          teachers,
          rffSlots,
          dutySlots, // Include dynamic duty slots
          rffDebts,
          rffRoster,
        });
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = (error) => {
      reject(error);
    };
    reader.readAsArrayBuffer(file);
  });
};
