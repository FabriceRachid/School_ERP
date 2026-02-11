import { Teacher } from "@/data/mock-data";

const STORAGE_KEY = "teachers";

export const getTeachers = (): Teacher[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error("Error loading teachers:", error);
    return [];
  }
};

export const saveTeachers = (teachers: Teacher[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(teachers));
  } catch (error) {
    console.error("Error saving teachers:", error);
  }
};

export const addTeacher = (teacher: Omit<Teacher, "id" | "userId">): Teacher => {
  const teachers = getTeachers();
  const newTeacher: Teacher = {
    ...teacher,
    id: `t${Date.now()}`,
    userId: `u${Date.now()}`, // Create a user ID for the teacher
  };
  teachers.push(newTeacher);
  saveTeachers(teachers);
  return newTeacher;
};

export const updateTeacher = (id: string, updates: Partial<Teacher>): Teacher | null => {
  const teachers = getTeachers();
  const index = teachers.findIndex(t => t.id === id);
  if (index === -1) return null;
  
  teachers[index] = { ...teachers[index], ...updates };
  saveTeachers(teachers);
  return teachers[index];
};

export const deleteTeacher = (id: string): boolean => {
  const teachers = getTeachers();
  const filtered = teachers.filter(t => t.id !== id);
  if (filtered.length === teachers.length) return false;
  
  saveTeachers(filtered);
  return true;
};

export const getTeachersBySchool = (schoolId: string): Teacher[] => {
  return getTeachers().filter(t => t.schoolId === schoolId);
};
