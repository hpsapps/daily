import { createContext, useReducer, type ReactNode, useEffect } from 'react';
import type { AppState, Teacher, DutySlot, RFFDebt, CasualTeacher, DutyAssignment, ModifiedRff, ScheduleEntry } from '../types';
import type { RFFRosterEntry } from '../utils/excelParser';
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
  | { type: 'REMOVE_MANUAL_DUTY'; payload: Partial<DutyAssignment> }
  | { type: 'UPDATE_MANUAL_DUTY'; payload: { original: { id: string; timeSlot: string; location: string; when: string; teacherId?: string; date?: string; }; updated: DutyAssignment } }
  | { type: 'UPDATE_INHERITED_DUTY'; payload: { original: { dutyId: string; timeSlot: string; teacherId: string; date: string; }; updated: DutyAssignment } }
  | { type: 'RESET_INHERITED_DUTY'; payload: { dutyId: string; timeSlot: string; teacherId: string; date: string; } } // New action type for resetting inherited duties
  | { type: 'UPDATE_RFF'; payload: ModifiedRff } // New action type for updating RFFs
  | { type: 'RESET_RFF'; payload: { id: string; } } // New action type for resetting RFFs, only needs the ID
  | { type: 'LOAD_RFF_ROSTER'; payload: { rffRoster: RFFRosterEntry[]; teachers: Teacher[]; dutySlots: DutySlot[]; } };

const APP_STORAGE_KEY = 'dailyChangesAppState';

const initialState: AppState = {
  teachers: [
    { id: 'T001', name: 'Alice Smith', className: 'Year 5' },
    { id: 'T002', name: 'Bob Johnson', className: 'Year 6' },
    { id: 'T003', name: 'Charlie Brown', className: 'Year 4' },
  ],
  rffSlots: [], // No longer static
  dutySlots: [], // No longer static, will be loaded dynamically
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
  rffRoster: [], // Initialize new RFF Roster data
  modifiedInheritedDuties: [], // Initialize new state for modified inherited duties
  modifiedRffs: [], // Initialize new state for modified RFFs
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
    case 'REMOVE_MANUAL_DUTY':
      return {
        ...state,
        manualDuties: state.manualDuties.filter(
          (duty) => duty.id !== action.payload.id
        ),
      };
    case 'UPDATE_MANUAL_DUTY':
      return {
        ...state,
        manualDuties: state.manualDuties.map((duty) =>
          duty.id === action.payload.original.id
            ? action.payload.updated
            : duty
        ),
      };
    case 'UPDATE_INHERITED_DUTY':
      const existingDutyIndex = state.modifiedInheritedDuties.findIndex(
        (duty) =>
          duty.original.dutyId === action.payload.original.dutyId
      );

      if (existingDutyIndex !== -1) {
        // Update existing modified duty
        const updatedModifiedDuties = [...state.modifiedInheritedDuties];
        updatedModifiedDuties[existingDutyIndex] = action.payload;
        return {
          ...state,
          modifiedInheritedDuties: updatedModifiedDuties,
        };
      } else {
        // Add new modified duty
        return {
          ...state,
          modifiedInheritedDuties: [...state.modifiedInheritedDuties, action.payload],
        };
      }
    case 'RESET_INHERITED_DUTY':
      return {
        ...state,
        modifiedInheritedDuties: state.modifiedInheritedDuties.filter(
          (duty) =>
            !(
              duty.original.dutyId === action.payload.dutyId
            )
        ),
      };
    case 'UPDATE_RFF':
      const existingRffIndex = state.modifiedRffs.findIndex(
        (rff) => rff.original.id === action.payload.original.id
      );

      if (existingRffIndex !== -1) {
        const updatedModifiedRffs = [...state.modifiedRffs];
        updatedModifiedRffs[existingRffIndex] = action.payload;
        return {
          ...state,
          modifiedRffs: updatedModifiedRffs,
        };
      } else {
        return {
          ...state,
          modifiedRffs: [...state.modifiedRffs, action.payload],
        };
      }
    case 'RESET_RFF':
      return {
        ...state,
        modifiedRffs: state.modifiedRffs.filter(
          (rff) => rff.original.id !== action.payload.id
        ),
      };
    case 'LOAD_RFF_ROSTER':
      return {
        ...state,
        rffRoster: action.payload.rffRoster,
        teachers: action.payload.teachers,
        dutySlots: action.payload.dutySlots, // Update dutySlots
        lastDataUpdate: new Date(),
        isLoading: false,
        error: null,
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
      storedState.rffRoster = storedState.rffRoster || [];
      storedState.teachers = storedState.teachers || [];
      storedState.dutySlots = storedState.dutySlots || []; // Initialize if not present
      storedState.manualDuties = storedState.manualDuties || []; // Initialize manualDuties
      storedState.modifiedInheritedDuties = storedState.modifiedInheritedDuties || []; // Initialize modifiedInheritedDuties
      // storedState.modifiedRffs = storedState.modifiedRffs || []; // Initialize modifiedRffs - Disable persistence for testing
    }
    return storedState ? { ...init, ...storedState } : init;
  });

  useEffect(() => {
    // storage.save(APP_STORAGE_KEY, state); // Disable persistence for testing
  }, [state]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};
