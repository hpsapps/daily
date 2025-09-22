import { useMemo, useContext } from 'react';
import { AppContext } from '../contexts/AppContext';
export function useTeacherAndCasualLists() {
  const { state } = useContext(AppContext);
  const { teachers, casuals } = state;

  const allTeachers = useMemo(() => {
    return teachers.map(teacher => teacher.name).sort();
  }, [teachers]);

  const allCasuals = useMemo(() => {
    return casuals.map(casual => casual.name).sort();
  }, [casuals]);

  return { allTeachers, allCasuals };
}
