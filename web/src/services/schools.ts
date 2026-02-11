import { School } from "@/data/mock-data";

const STORAGE_KEY = "schools";

export const getSchools = (): School[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error("Error loading schools:", error);
    return [];
  }
};

export const saveSchools = (schools: School[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(schools));
  } catch (error) {
    console.error("Error saving schools:", error);
  }
};

export const addSchool = (school: Omit<School, "id">): School => {
  const schools = getSchools();
  const newSchool: School = {
    ...school,
    id: `s${Date.now()}`,
  };
  schools.push(newSchool);
  saveSchools(schools);
  return newSchool;
};

export const updateSchool = (id: string, updates: Partial<School>): School | null => {
  const schools = getSchools();
  const index = schools.findIndex(s => s.id === id);
  if (index === -1) return null;
  
  schools[index] = { ...schools[index], ...updates };
  saveSchools(schools);
  return schools[index];
};

export const deleteSchool = (id: string): boolean => {
  const schools = getSchools();
  const filtered = schools.filter(s => s.id !== id);
  if (filtered.length === schools.length) return false;
  
  saveSchools(filtered);
  return true;
};

export const toggleSchoolStatus = (id: string): School | null => {
  const schools = getSchools();
  const school = schools.find(s => s.id === id);
  if (!school) return null;
  
  school.status = school.status === "active" ? "inactive" : "active";
  saveSchools(schools);
  return school;
};
