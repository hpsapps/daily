import { createContext, useReducer, type ReactNode, useEffect } from 'react';
import type { AppState, Teacher, TeacherClassMap, RFFSlot, DutySlot, RFFDebt, CasualTeacher, DutyAssignment } from '../types';
import { storage } from '../utils/storage';

type AppAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'LOAD_DATA'; payload: Partial<AppState> }
  | { type: 'ADD_RFF_DEBT'; payload: RFFDebt }
  | { type: 'ADD_CASUAL'; payload: CasualTeacher }
  | { type: 'UPDATE_CASUAL'; payload: CasualTeacher }
  | { type: 'DELETE_CASUAL'; payload: string }
  | { type: 'ADD_ABSENT_TEACHER'; payload: string }
  | { type: 'REMOVE_ABSENT_TEACHER'; payload: string }
  | { type: 'ADD_MANUAL_DUTY'; payload: DutyAssignment }
  | { type: 'DELETE_MANUAL_DUTY'; payload: number };

const APP_STORAGE_KEY = 'dailyChangesAppState';

const initialState: AppState = {
  teachers: [
    { id: 'T001', name: 'Alice Smith', className: 'Year 5' },
    { id: 'T002', name: 'Bob Johnson', className: 'Year 6' },
    { id: 'T003', name: 'Charlie Brown', className: 'Year 4' },
  ],
  teacherClassMap: [
    { teacherId: 'T001', className: 'Year 5' },
    { teacherId: 'T002', className: 'Year 6' },
    { teacherId: 'T003', className: 'Year 4' },
  ],
  rffSlots: [
    { id: 'RFF001', teacherId: 'T001', day: 'Monday', startTime: '09:00', endTime: '10:00', subject: 'Math', coveringTeacher: 'David Lee' },
    { id: 'RFF002', teacherId: 'T002', day: 'Tuesday', startTime: '11:00', endTime: '12:00', subject: 'English', coveringTeacher: 'Eve Davis' },
  ],
  dutySlots: [
    { id: 'D001', teacherId: 'T001', day: 'Monday', timeSlot: 'Recess', area: 'Playground' },
    { id: 'D002', teacherId: 'T002', day: 'Tuesday', timeSlot: 'Lunch 1', area: 'Canteen' },
  ],
  manualDuties: [],
  rffDebts: [
    { id: 'DEBT001', teacherId: 'T001', hoursOwed: 2.5, reason: 'Covering for sick leave', dateCreated: new Date('2025-08-20T09:00:00Z') },
    { id: 'DEBT002', teacherId: 'T002', hoursOwed: 1.0, reason: 'Professional development', dateCreated: new Date('2025-08-22T10:00:00Z'), dateCleared: new Date('2025-08-25T14:00:00Z'), clearedBy: 'Admin' },
  ],
  casuals: [
    { id: 'C001', name: 'Frank Green', email: 'frank@example.com', phone: '555-1111' },
    { id: 'C002', name: 'Grace Hall', email: 'grace@example.com', phone: '555-2222' },
  ],
  absentTeachers: [],
  assignments: [],
  casualInstructions: [],
  lastDataUpdate: new Date(),
  isLoading: false,
  error: null,
};

export const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}>({
  state: initialState,
  dispatch: () => null,
});

const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'LOAD_DATA':
      return { ...state, ...action.payload, lastDataUpdate: new Date(), isLoading: false, error: null };
    case 'ADD_RFF_DEBT':
      return { ...state, rffDebts: [...state.rffDebts, action.payload] };
    case 'ADD_CASUAL':
      return { ...state, casuals: [...state.casuals, action.payload] };
    case 'UPDATE_CASUAL':
      return {
        ...state,
        casuals: state.casuals.map(casual =>
          casual.id === action.payload.id ? action.payload : casual
        ),
      };
    case 'DELETE_CASUAL':
      return {
        ...state,
        casuals: state.casuals.filter(casual => casual.id !== action.payload),
      };
    case 'ADD_ABSENT_TEACHER':
      return {
        ...state,
        absentTeachers: [...state.absentTeachers, action.payload],
      };
    case 'REMOVE_ABSENT_TEACHER':
      return {
        ...state,
        absentTeachers: state.absentTeachers.filter(id => id !== action.payload),
      };
    case 'ADD_MANUAL_DUTY':
      return {
        ...state,
        manualDuties: [...state.manualDuties, action.payload],
      };
    case 'DELETE_MANUAL_DUTY':
      return {
        ...state,
        manualDuties: state.manualDuties.filter((_, index) => index !== action.payload),
      };
    default:
      return state;
  }
};

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(appReducer, initialState, (init) => {
    const storedState = storage.load(APP_STORAGE_KEY);
    if (storedState) {
      // Ensure Date objects are correctly re-instantiated if stored as strings
      storedState.lastDataUpdate = storedState.lastDataUpdate ? new Date(storedState.lastDataUpdate) : new Date();
      storedState.rffDebts = storedState.rffDebts?.map((debt: RFFDebt) => ({
        ...debt,
        dateCreated: new Date(debt.dateCreated),
        dateCleared: debt.dateCleared ? new Date(debt.dateCleared) : undefined,
      })) || [];
    }
    return storedState ? { ...init, ...storedState } : init;
  });

  useEffect(() => {
    storage.save(APP_STORAGE_KEY, state);
  }, [state]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};
