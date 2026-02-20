// ===================== TYPES =====================

export type UserRole = "super_admin" | "admin_school" | "teacher";

export interface User {
  id: string;
  email: string;
  password?: string;
  name: string;
  role: UserRole;
  schoolId?: string;
  avatar?: string;
}

export interface School {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  adminId: string | null;
  logo?: string;
  studentsCount: number;
  teachersCount: number;
  classesCount: number;
  isActive?: boolean;
}

export interface AcademicYear {
  id: string;
  label: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
}

export interface Cycle {
  id: string;
  name: string;
  schoolId: string;
}

export interface ClassRoom {
  id: string;
  name: string;
  cycleId: string;
  schoolId: string;
  capacity: number;
  studentsCount: number;
  mainTeacherId?: string;
  fees: number;
  isActive?: boolean;
}

export interface Subject {
  id: string;
  name: string;
  coefficient: number;
  schoolId: string;
  isActive?: boolean;
}

export interface Student {
  id: string;
  matricule: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: "M" | "F";
  classId: string;
  schoolId: string;
  parentName: string;
  parentPhone: string;
  enrollmentDate: string;
  photo?: string;
  isActive?: boolean;
}

export interface Teacher {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  phone: string;
  schoolId: string;
  subjects: string[];
  classes: string[];
  isActive?: boolean;
}

export interface Grade {
  id: string;
  studentId: string;
  subjectId: string;
  teacherId: string;
  classId: string;
  type: "control" | "exam";
  value: number;
  maxValue: number;
  period: string;
  date: string;
}

export interface Payment {
  id: string;
  studentId: string;
  amount: number;
  totalDue: number;
  paidAmount: number;
  status: "paid" | "partial" | "unpaid";
  date: string;
  method: string;
  schoolId: string;
}

export interface Attendance {
  id: string;
  studentId: string;
  classId: string;
  date: string;
  status: "present" | "absent" | "late";
  teacherId: string;
}

export interface TimeSlot {
  id: string;
  classId: string;
  subjectId: string;
  teacherId: string;
  day: "Lundi" | "Mardi" | "Mercredi" | "Jeudi" | "Vendredi";
  startTime: string;
  endTime: string;
}

// ===================== MOCK DATA =====================

export let users: User[] = [
  { id: "u1", email: "superadmin@erp.edu", password: "admin123", name: "Jean Dupont", role: "super_admin" },
  { id: "u2", email: "admin@lycee-victor.edu", password: "admin123", name: "Marie Kouassi", role: "admin_school", schoolId: "s1" },
  { id: "u3", email: "admin@college-saint.edu", password: "admin123", name: "Paul Bamba", role: "admin_school", schoolId: "s2" },
  { id: "u4", email: "prof.math@lycee-victor.edu", password: "prof123", name: "Ibrahim Traoré", role: "teacher", schoolId: "s1" },
  { id: "u5", email: "prof.fr@lycee-victor.edu", password: "prof123", name: "Aminata Diallo", role: "teacher", schoolId: "s1" },
  { id: "u6", email: "prof.svt@college-saint.edu", password: "prof123", name: "Kofi Mensah", role: "teacher", schoolId: "s2" },
];

export let schools: School[] = [
  { id: "s1", name: "Lycée Victor Hugo", address: "Rue 12, Plateau, Abidjan", phone: "+225 07 00 00 01", email: "contact@lycee-victor.edu", adminId: "u2", studentsCount: 450, teachersCount: 28, classesCount: 12 },
  { id: "s2", name: "Collège Saint-Exupéry", address: "Bd de la Paix, Cocody", phone: "+225 07 00 00 02", email: "contact@college-saint.edu", adminId: "u3", studentsCount: 320, teachersCount: 18, classesCount: 9 },
  { id: "s3", name: "École Primaire Les Étoiles", address: "Av. Houphouët, Marcory", phone: "+225 07 00 00 03", email: "contact@etoiles.edu", adminId: "u2", studentsCount: 280, teachersCount: 15, classesCount: 8 },
];

export let academicYears: AcademicYear[] = [
  { id: "ay1", label: "2024-2025", startDate: "2024-09-02", endDate: "2025-06-30", isCurrent: true },
  { id: "ay2", label: "2023-2024", startDate: "2023-09-04", endDate: "2024-06-28", isCurrent: false },
];

export let cycles: Cycle[] = [
  { id: "cy1", name: "Second Cycle", schoolId: "s1" },
  { id: "cy2", name: "Premier Cycle", schoolId: "s2" },
];

export let classes: ClassRoom[] = [
  { id: "c1", name: "Terminale A", cycleId: "cy1", schoolId: "s1", capacity: 45, studentsCount: 42, mainTeacherId: "t1", fees: 150000, isActive: true },
  { id: "c2", name: "Terminale D", cycleId: "cy1", schoolId: "s1", capacity: 40, studentsCount: 38, mainTeacherId: "t2", fees: 175000, isActive: true },
  { id: "c3", name: "Première C", cycleId: "cy1", schoolId: "s1", capacity: 40, studentsCount: 35, mainTeacherId: "t1", fees: 160000, isActive: true },
  { id: "c4", name: "Seconde A", cycleId: "cy1", schoolId: "s1", capacity: 50, studentsCount: 48, mainTeacherId: "t2", fees: 140000, isActive: true },
  { id: "c5", name: "3ème", cycleId: "cy2", schoolId: "s2", capacity: 45, studentsCount: 40, fees: 120000, isActive: true },
  { id: "c6", name: "4ème", cycleId: "cy2", schoolId: "s2", capacity: 45, studentsCount: 43, fees: 110000, isActive: true },
  { id: "c7", name: "5ème", cycleId: "cy2", schoolId: "s2", capacity: 50, studentsCount: 47, fees: 100000, isActive: true },
];

export let subjects: Subject[] = [
  { id: "sub1", name: "Mathématiques", coefficient: 5, schoolId: "s1", isActive: true },
  { id: "sub2", name: "Français", coefficient: 4, schoolId: "s1", isActive: true },
  { id: "sub3", name: "Physique-Chimie", coefficient: 4, schoolId: "s1", isActive: true },
  { id: "sub4", name: "SVT", coefficient: 3, schoolId: "s1", isActive: true },
  { id: "sub5", name: "Anglais", coefficient: 3, schoolId: "s1", isActive: true },
  { id: "sub6", name: "Histoire-Géo", coefficient: 3, schoolId: "s1", isActive: true },
  { id: "sub7", name: "Philosophie", coefficient: 4, schoolId: "s1", isActive: true },
  { id: "sub8", name: "Mathématiques", coefficient: 4, schoolId: "s2", isActive: true },
  { id: "sub9", name: "Français", coefficient: 4, schoolId: "s2", isActive: true },
  { id: "sub10", name: "SVT", coefficient: 3, schoolId: "s2", isActive: true },
];

const firstNames = ["Aya", "Kouadio", "Fatou", "Moussa", "Adama", "Mariame", "Sékou", "Aïcha", "Yao", "Kadiatou", "Oumar", "Rokia", "Bakary", "Nafissatou", "Drissa"];
const lastNames = ["Koné", "Touré", "Diallo", "Ouattara", "Coulibaly", "Traoré", "Bamba", "Sylla", "Konaté", "Camara", "Cissé", "Sanogo", "Dembélé", "Keita", "Sow"];

function generateStudents(): Student[] {
  const students: Student[] = [];
  let idx = 0;
  const classIds = ["c1", "c2", "c3", "c4", "c5", "c6", "c7"];
  const schoolMap: Record<string, string> = { c1: "s1", c2: "s1", c3: "s1", c4: "s1", c5: "s2", c6: "s2", c7: "s2" };

  for (const classId of classIds) {
    const count = classId.startsWith("c5") || classId.startsWith("c6") || classId.startsWith("c7") ? 8 : 10;
    for (let i = 0; i < count; i++) {
      idx++;
      const fn = firstNames[idx % firstNames.length];
      const ln = lastNames[(idx * 3) % lastNames.length];
      const gender = idx % 3 === 0 ? "F" : "M";
      students.push({
        id: `st${idx}`,
        matricule: `MAT-${String(idx).padStart(4, "0")}`,
        firstName: fn,
        lastName: ln,
        dateOfBirth: `${2005 + (idx % 4)}-${String((idx % 12) + 1).padStart(2, "0")}-${String((idx % 28) + 1).padStart(2, "0")}`,
        gender: gender as "M" | "F",
        classId,
        schoolId: schoolMap[classId],
        parentName: `${firstNames[(idx + 5) % firstNames.length]} ${ln}`,
        parentPhone: `+225 07 ${String(idx * 11).padStart(2, "0")} ${String(idx * 7).padStart(2, "0")} ${String(idx * 3).padStart(2, "0")}`,
        enrollmentDate: "2024-09-02",
        isActive: true,
      });
    }
  }
  return students;
}

export let students: Student[] = generateStudents();

export let teachers: Teacher[] = [
  { id: "t1", userId: "u4", firstName: "Ibrahim", lastName: "Traoré", phone: "+225 07 11 22 33", schoolId: "s1", subjects: ["sub1", "sub3"], classes: ["c1", "c3"], isActive: true },
  { id: "t2", userId: "u5", firstName: "Aminata", lastName: "Diallo", phone: "+225 07 44 55 66", schoolId: "s1", subjects: ["sub2", "sub7"], classes: ["c2", "c4"], isActive: true },
  { id: "t3", userId: "u6", firstName: "Kofi", lastName: "Mensah", phone: "+225 07 77 88 99", schoolId: "s2", subjects: ["sub10"], classes: ["c5", "c6", "c7"], isActive: true },
];

function generateGrades(): Grade[] {
  const grades: Grade[] = [];
  let idx = 0;
  for (const student of students.slice(0, 20)) {
    const schoolSubjects = subjects.filter(s => s.schoolId === student.schoolId);
    for (const sub of schoolSubjects.slice(0, 3)) {
      idx++;
      const teacher = teachers.find(t => t.schoolId === student.schoolId);
      grades.push(
        { id: `g${idx}a`, studentId: student.id, subjectId: sub.id, teacherId: teacher?.id || "t1", classId: student.classId, type: "control", value: 10 + (idx % 10), maxValue: 20, period: "Trimestre 1", date: "2024-11-15" },
        { id: `g${idx}b`, studentId: student.id, subjectId: sub.id, teacherId: teacher?.id || "t1", classId: student.classId, type: "exam", value: 8 + (idx % 12), maxValue: 20, period: "Trimestre 1", date: "2024-12-10" }
      );
    }
  }
  return grades;
}

export let grades: Grade[] = generateGrades();

function generatePayments(): Payment[] {
  const payments: Payment[] = [];
  let idx = 0;
  for (const student of students) {
    idx++;
    const cls = classes.find(c => c.id === student.classId);
    const totalDue = cls?.fees || 150000;
    const statuses: Payment["status"][] = ["paid", "partial", "unpaid"];
    const status = statuses[idx % 3];
    const paidAmount = status === "paid" ? totalDue : status === "partial" ? Math.round(totalDue * 0.5) : 0;
    payments.push({
      id: `p${idx}`,
      studentId: student.id,
      amount: paidAmount > 0 ? paidAmount : 0,
      totalDue,
      paidAmount,
      status,
      date: paidAmount > 0 ? "2024-10-15" : "",
      method: paidAmount > 0 ? (idx % 2 === 0 ? "Espèces" : "Mobile Money") : "",
      schoolId: student.schoolId,
    });
  }
  return payments;
}

export let payments: Payment[] = generatePayments();

export let timeSlots: TimeSlot[] = [
  { id: "ts1", classId: "c1", subjectId: "sub1", teacherId: "t1", day: "Lundi", startTime: "08:00", endTime: "10:00" },
  { id: "ts2", classId: "c1", subjectId: "sub2", teacherId: "t2", day: "Lundi", startTime: "10:15", endTime: "12:15" },
  { id: "ts3", classId: "c1", subjectId: "sub3", teacherId: "t1", day: "Mardi", startTime: "08:00", endTime: "10:00" },
  { id: "ts4", classId: "c1", subjectId: "sub5", teacherId: "t2", day: "Mardi", startTime: "10:15", endTime: "12:15" },
  { id: "ts5", classId: "c1", subjectId: "sub4", teacherId: "t1", day: "Mercredi", startTime: "08:00", endTime: "10:00" },
  { id: "ts6", classId: "c1", subjectId: "sub6", teacherId: "t2", day: "Mercredi", startTime: "10:15", endTime: "12:15" },
  { id: "ts7", classId: "c1", subjectId: "sub7", teacherId: "t2", day: "Jeudi", startTime: "08:00", endTime: "10:00" },
  { id: "ts8", classId: "c1", subjectId: "sub1", teacherId: "t1", day: "Jeudi", startTime: "10:15", endTime: "12:15" },
  { id: "ts9", classId: "c1", subjectId: "sub2", teacherId: "t2", day: "Vendredi", startTime: "08:00", endTime: "10:00" },
  { id: "ts10", classId: "c1", subjectId: "sub3", teacherId: "t1", day: "Vendredi", startTime: "10:15", endTime: "12:15" },
  { id: "ts11", classId: "c5", subjectId: "sub8", teacherId: "t3", day: "Lundi", startTime: "08:00", endTime: "10:00" },
  { id: "ts12", classId: "c5", subjectId: "sub9", teacherId: "t3", day: "Lundi", startTime: "10:15", endTime: "12:15" },
  { id: "ts13", classId: "c5", subjectId: "sub10", teacherId: "t3", day: "Mardi", startTime: "08:00", endTime: "10:00" },
];

export let attendance: Attendance[] = [];

export interface FrontendBundle {
  users: User[];
  schools: School[];
  academicYears: AcademicYear[];
  cycles: Cycle[];
  classes: ClassRoom[];
  subjects: Subject[];
  students: Student[];
  teachers: Teacher[];
  grades: Grade[];
  payments: Payment[];
  timeSlots: TimeSlot[];
  attendance: Attendance[];
}

const FRONTEND_BUNDLE_KEY = "erp_frontend_bundle";

export function hydrateFrontendBundle(bundle: Partial<FrontendBundle>) {
  if (bundle.users) users = bundle.users;
  if (bundle.schools) schools = bundle.schools;
  if (bundle.academicYears) academicYears = bundle.academicYears;
  if (bundle.cycles) cycles = bundle.cycles;
  if (bundle.classes) classes = bundle.classes;
  if (bundle.subjects) subjects = bundle.subjects;
  if (bundle.students) students = bundle.students;
  if (bundle.teachers) teachers = bundle.teachers;
  if (bundle.grades) grades = bundle.grades;
  if (bundle.payments) payments = bundle.payments;
  if (bundle.timeSlots) timeSlots = bundle.timeSlots;
  if (bundle.attendance) attendance = bundle.attendance;
}

export function saveFrontendBundle(bundle: Partial<FrontendBundle>) {
  hydrateFrontendBundle(bundle);
  localStorage.setItem(FRONTEND_BUNDLE_KEY, JSON.stringify(bundle));
}

export function restoreFrontendBundle() {
  const raw = localStorage.getItem(FRONTEND_BUNDLE_KEY);
  if (!raw) return;

  try {
    const parsed = JSON.parse(raw) as Partial<FrontendBundle>;
    hydrateFrontendBundle(parsed);
  } catch {
    localStorage.removeItem(FRONTEND_BUNDLE_KEY);
  }
}

export function clearFrontendBundle() {
  localStorage.removeItem(FRONTEND_BUNDLE_KEY);
}

// Helper functions
export function getSchoolById(id: string) { return schools.find(s => s.id === id); }
export function getClassById(id: string) { return classes.find(c => c.id === id); }
export function getStudentsByClass(classId: string) { return students.filter(s => s.classId === classId); }
export function getStudentsBySchool(schoolId: string) { return students.filter(s => s.schoolId === schoolId); }
export function getTeachersBySchool(schoolId: string) { return teachers.filter(t => t.schoolId === schoolId); }
export function getClassesBySchool(schoolId: string) { return classes.filter(c => c.schoolId === schoolId); }
export function getCyclesBySchool(schoolId: string) { return cycles.filter(c => c.schoolId === schoolId); }
export function getSubjectsBySchool(schoolId: string) { return subjects.filter(s => s.schoolId === schoolId); }
export function getGradesByStudent(studentId: string) { return grades.filter(g => g.studentId === studentId); }
export function getGradesByClass(classId: string) { return grades.filter(g => g.classId === classId); }
export function getPaymentsBySchool(schoolId: string) { return payments.filter(p => p.schoolId === schoolId); }
export function getPaymentsByStudent(studentId: string) { return payments.filter(p => p.studentId === studentId); }
export function getTimeSlotsByClass(classId: string) { return timeSlots.filter(ts => ts.classId === classId); }
export function getSubjectById(id: string) { return subjects.find(s => s.id === id); }
export function getTeacherById(id: string) { return teachers.find(t => t.id === id); }
export function getUserById(id: string) { return users.find(u => u.id === id); }
