import * as ExcelJS from 'exceljs';
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

const parseTeachersFromSummary = (summarySheet: ExcelJS.Worksheet): Teacher[] => {
  const teachersMap = new Map<string, Teacher>();

  summarySheet.eachRow((row, rowNumber) => {
    if (rowNumber === 1) return; // Skip header row

    const teacherName = row.getCell(1).text;
    const className = row.getCell(2).text;
    const classType = row.getCell(3).text;

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
  });
  return Array.from(teachersMap.values());
};

const parseDutyRosterSheet = (dutyRosterSheet: ExcelJS.Worksheet): DutySlot[] => {
  const dutySlots: DutySlot[] = [];
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const headers: { [key: string]: number } = {};

  dutyRosterSheet.getRow(1).eachCell((cell, colNumber) => {
    if (typeof cell.value === 'string') {
      headers[cell.value] = colNumber;
    }
  });

  dutyRosterSheet.eachRow((row, rowNumber) => {
    if (rowNumber === 1) return; // Skip header row

    const dutyType = row.getCell(headers['Duty'])?.text;
    const timeSlot = row.getCell(headers['Time'])?.text;
    const area = row.getCell(headers['Area'])?.text;

    if (dutyType && timeSlot && area) {
      // Normalize timeSlot: replace dots with colons, remove am/pm, trim spaces
      const normalizedTimeSlot = timeSlot
        .replace(/\./g, ':') // Replace dots with colons
        .replace(/\s*am|\s*pm/gi, '') // Remove 'am' or 'pm' (case-insensitive)
        .replace(/\s-\s/g, '-') // Replace " - " with "-"
        .trim(); // Trim any remaining whitespace

      daysOfWeek.forEach(day => {
        const teacherName = row.getCell(headers[day])?.text;
        if (teacherName) {
          dutySlots.push({
            id: `${day}-${normalizedTimeSlot}-${area}-${teacherName}`,
            teacherId: teacherName,
            day: day,
            timeSlot: normalizedTimeSlot,
            area: area,
          });
        }
      });
    }
  });
  return dutySlots;
};

const parseRFFRosterSheet = (summarySheet: ExcelJS.Worksheet, allDaysSheet: ExcelJS.Worksheet): RFFRosterEntry[] => {
  const rffTeachersMap = new Map<string, string>(); // RFF Teacher Name -> RFF Class/Subject
  const classTeachersMap = new Map<string, string>(); // Class Taught -> Class Teacher Name

  // Parse Summary sheet for RFF Teachers and Class Teachers
  summarySheet.eachRow((row, rowNumber) => {
    if (rowNumber === 1) return; // Skip header row
    const rffTeacherName = row.getCell(5).text; // Column E
    const rffClass = row.getCell(6).text; // Column F
    const classTeacherName = row.getCell(1).text; // Column A
    const classTaught = row.getCell(2).text; // Column B

    if (rffTeacherName && rffClass) {
      rffTeachersMap.set(rffTeacherName, rffClass);
    }
    if (classTeacherName && classTaught) {
      classTeachersMap.set(classTaught, classTeacherName);
    }
  });

  const rffRoster: RFFRosterEntry[] = [];
  let currentDay = '';
  let rffTeachers: string[] = [];
  let rffClasses: string[] = [];

  allDaysSheet.eachRow((row, rowIndex) => {
    const firstCellText = row.getCell(1).text;

    // Identify Day
    if (['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].includes(firstCellText)) {
      currentDay = firstCellText;
      rffTeachers = [];
      rffClasses = [];
    } else if (currentDay) {
      // Identify RFF Teachers (row after Day)
      if (firstCellText === 'RFF Teacher') {
        row.eachCell((cell, colIndex) => {
          if (colIndex > 1 && cell.text) {
            rffTeachers.push(cell.text);
          }
        });
      }
      // Identify RFF Classes (row after RFF Teacher)
      else if (firstCellText === 'RFF Class') {
        row.eachCell((cell, colIndex) => {
          if (colIndex > 1 && cell.text) {
            rffClasses.push(cell.text);
          }
        });
      }
      // Identify Time Slots and Schedule
      else if (firstCellText.match(/^\d{1,2}([:.])\d{2}-\d{1,2}([:.])\d{2}$/)) { // Regex for time format e.g., 9:10-9:50 or 9.10-9.50
        const time = firstCellText.replace(/\./g, ':');
        row.eachCell((cell, colIndex) => {
          if (colIndex > 1 && cell.text && rffTeachers[colIndex - 2] && rffClasses[colIndex - 2]) {
            rffRoster.push({
              day: currentDay,
              time: time,
              teacher: rffTeachers[colIndex - 2],
              subject: rffClasses[colIndex - 2],
              class: cell.text.trim(), // Trim whitespace
            });
          }
        });
      }
    }
  });

  return rffRoster;
};

export const parseExcelData = async (file: File): Promise<{
  teachers: Teacher[];
  rffSlots: RFFSlot[];
  dutySlots: DutySlot[];
  rffDebts: RFFDebt[];
  rffRoster: RFFRosterEntry[];
}> => {
  const buffer = await file.arrayBuffer();
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(buffer);

  const summarySheet = workbook.getWorksheet('Summary');
  const allDaysSheet = workbook.getWorksheet('ALL DAYS');
  const dutyRosterSheet = workbook.getWorksheet('Duty Roster');

  if (!summarySheet || !allDaysSheet || !dutyRosterSheet) {
    throw new Error('Required sheets (Summary, ALL DAYS, Duty Roster) are missing from the Excel file for Roster parsing.');
  }

  const rffRoster = parseRFFRosterSheet(summarySheet, allDaysSheet);
  const teachers = parseTeachersFromSummary(summarySheet);
  const dutySlots = parseDutyRosterSheet(dutyRosterSheet);

  const rffSlots: RFFSlot[] = [];
  const rffDebts: RFFDebt[] = [];

  return {
    teachers,
    rffSlots,
    dutySlots,
        rffDebts,
    rffRoster,
  };
};
