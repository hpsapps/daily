import * as XLSX from 'xlsx';
import type { Teacher, TeacherClassMap, RFFSlot, DutySlot, RFFDebt } from '../types';

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

const parseRFFAndDutySheet = (sheet: XLSX.WorkSheet): { rffSlots: RFFSlot[], dutySlots: DutySlot[] } => {
  const json = XLSX.utils.sheet_to_json(sheet, { header: 1 }) as string[][];
  const headers = json[0];
  const dataRows = json.slice(1);

  const rffSlots: RFFSlot[] = [];
  const dutySlots: DutySlot[] = [];

  // Basic validation for required columns
  const requiredRFFHeaders = ['RFF ID', 'Teacher ID', 'Day', 'Start Time', 'End Time', 'Subject', 'Covering Teacher'];
  const requiredDutyHeaders = ['Duty ID', 'Teacher ID', 'Day', 'Time Slot', 'Area'];

  const hasRFFHeaders = requiredRFFHeaders.every(header => headers.includes(header));
  const hasDutyHeaders = requiredDutyHeaders.every(header => headers.includes(header));

  if (!hasRFFHeaders && !hasDutyHeaders) {
    throw new Error('RFF/Duties sheet is missing required headers for RFF or Duty data.');
  }

  dataRows.forEach((row: string[], index: number) => {
    const rowData: { [key: string]: string } = {};
    headers.forEach((header, i) => {
      rowData[header] = row[i];
    });

    // Parse RFF Slots
    if (hasRFFHeaders && rowData['RFF ID'] && rowData['Teacher ID'] && rowData['Day'] && rowData['Start Time'] && rowData['End Time'] && rowData['Subject'] && rowData['Covering Teacher']) {
      rffSlots.push({
        id: rowData['RFF ID'],
        teacherId: rowData['Teacher ID'],
        day: rowData['Day'],
        startTime: rowData['Start Time'],
        endTime: rowData['End Time'],
        subject: rowData['Subject'],
        coveringTeacher: rowData['Covering Teacher'],
        location: rowData['Location'], // Optional
      });
    }

    // Parse Duty Slots
    if (hasDutyHeaders && rowData['Duty ID'] && rowData['Teacher ID'] && rowData['Day'] && rowData['Time Slot'] && rowData['Area']) {
      dutySlots.push({
        id: rowData['Duty ID'],
        teacherId: rowData['Teacher ID'],
        day: rowData['Day'],
        timeSlot: rowData['Time Slot'],
        area: rowData['Area'],
      });
    }
  });

  return { rffSlots, dutySlots };
};

const parseTeacherClassMapSheet = (sheet: XLSX.WorkSheet): TeacherClassMap[] => {
  const json = XLSX.utils.sheet_to_json(sheet, { header: 1 }) as string[][];
  const headers = json[0];
  const dataRows = json.slice(1);

  const teacherClassMap: TeacherClassMap[] = [];

  const requiredHeaders = ['Teacher ID', 'Class Name'];
  if (!requiredHeaders.every(header => headers.includes(header))) {
    throw new Error('Teacher-Class Map sheet is missing required headers.');
  }

  dataRows.forEach((row: string[], index: number) => {
    const rowData: { [key: string]: string } = {};
    headers.forEach((header, i) => {
      rowData[header] = row[i];
    });

    if (rowData['Teacher ID'] && rowData['Class Name']) {
      teacherClassMap.push({
        teacherId: rowData['Teacher ID'],
        className: rowData['Class Name'],
      });
    }
  });

  return teacherClassMap;
};

export const parseExcelData = (file: File): Promise<{
  teachers: Teacher[];
  teacherClassMap: TeacherClassMap[];
  rffSlots: RFFSlot[];
  dutySlots: DutySlot[];
  rffDebts: RFFDebt[]; // RFF Debts are not parsed from sheets yet, will be handled manually or from another sheet
}> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = event.target?.result;
        const workbook = XLSX.read(data, { type: 'array' });

        // Assuming Sheet 2 for RFF/Duties and Sheet 3 for Teacher-Class Map
        // SheetNames are 0-indexed, so Sheet 2 is index 1, Sheet 3 is index 2
        const rffDutySheet = workbook.Sheets[workbook.SheetNames[1]];
        const teacherClassMapSheet = workbook.Sheets[workbook.SheetNames[2]];

        if (!rffDutySheet || !teacherClassMapSheet) {
          throw new Error('Required sheets (RFF/Duties and Teacher-Class Map) are missing from the Excel file.');
        }

        const { rffSlots, dutySlots } = parseRFFAndDutySheet(rffDutySheet);
        const teacherClassMap = parseTeacherClassMapSheet(teacherClassMapSheet);

        const teachers = extractTeachers(rffSlots, dutySlots);

        // RFF Debts are not parsed from sheets yet, will be handled manually or from another sheet
        const rffDebts: RFFDebt[] = [];

        resolve({
          teachers,
          teacherClassMap,
          rffSlots,
          dutySlots,
          rffDebts,
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
