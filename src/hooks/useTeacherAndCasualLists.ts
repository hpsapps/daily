import { useMemo } from 'react';
import { getTeachersByRole, supportStaff } from '../data/ClassTeacher';

export function useTeacherAndCasualLists(isLoading: boolean) {
  const allTeachers = useMemo(() => {
    if (isLoading) return [];
    return getTeachersByRole('all').sort();
  }, [isLoading]);

  const allCasuals = useMemo(() => {
    return supportStaff.filter(staff => staff.role === 'Casual/Relief').map(staff => staff.teacher).sort();
  }, []);

  return { allTeachers, allCasuals };
}
