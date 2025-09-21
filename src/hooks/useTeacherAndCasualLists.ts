import { useMemo, useContext } from 'react';
import { AppContext } from '../contexts/AppContext';
import { supportStaff } from '../data/ClassTeacher'; // Keep supportStaff for casuals

export function useTeacherAndCasualLists() { // Removed isLoading prop
  const { state } = useContext(AppContext);
  const { teachers } = state;

  const allTeachers = useMemo(() => {
    // Use dynamic teachers from AppContext
    return teachers.map(teacher => teacher.name).sort();
  }, [teachers]); // Depend on teachers from AppContext

  const allCasuals = useMemo(() => {
    return supportStaff.filter(staff => staff.role === 'Casual/Relief').map(staff => staff.teacher).sort();
  }, []);

  return { allTeachers, allCasuals };
}
