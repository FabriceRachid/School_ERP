import { Student } from "@/data/mock-data";

const STORAGE_KEY = "students";

export const getStudents = (): Student[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error("Error loading students:", error);
    return [];
  }
};

export const saveStudents = (students: Student[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
  } catch (error) {
    console.error("Error saving students:", error);
  }
};

export const addStudent = (student: Omit<Student, "id" | "matricule" | "enrollmentDate">): Student => {
  const students = getStudents();
  const newStudent: Student = {
    ...student,
    id: `st${Date.now()}`,
    matricule: `MAT-${String(students.length + 1).padStart(4, "0")}`,
    enrollmentDate: new Date().toISOString().split('T')[0],
  };
  students.push(newStudent);
  saveStudents(students);
  return newStudent;
};

export const updateStudent = (id: string, updates: Partial<Student>): Student | null => {
  const students = getStudents();
  const index = students.findIndex(s => s.id === id);
  if (index === -1) return null;
  
  students[index] = { ...students[index], ...updates };
  saveStudents(students);
  return students[index];
};

export const deleteStudent = (id: string): boolean => {
  const students = getStudents();
  const filtered = students.filter(s => s.id !== id);
  if (filtered.length === students.length) return false;
  
  saveStudents(filtered);
  return true;
};

export const getStudentsBySchool = (schoolId: string): Student[] => {
  return getStudents().filter(s => s.schoolId === schoolId);
};

export const getStudentsByClass = (classId: string): Student[] => {
  return getStudents().filter(s => s.classId === classId);
};
