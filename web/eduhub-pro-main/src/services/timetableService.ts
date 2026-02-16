// Enhanced Timetable Service
// Manages the relationship between teachers, subjects, and classes

interface TeacherAssignment {
  id: string;
  teacher_id: string;
  class_id: string;
  subject_id: string;
  academic_year: string;
  created_at: string;
}

interface ClassSubjectAssignment {
  class_id: string;
  subject_id: string;
  teacher_id: string;
  teacher_name: string;
  subject_name: string;
}

interface SubjectTeacherInfo {
  subject_id: string;
  subject_name: string;
  coefficient: number;
  teachers: {
    id: string;
    name: string;
    email: string;
  }[];
}

class TimetableService {
  private baseUrl = '/api/timetable';

  // Get all active teacher assignments for a specific class
  async getClassAssignments(classId: string): Promise<ClassSubjectAssignment[]> {
    try {
      const response = await fetch(`${this.baseUrl}/assignments/class/${classId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data.success ? data.data : [];
    } catch (error) {
      console.error('Error fetching class assignments:', error);
      // Return mock data if API fails
      return this.getMockClassAssignments(classId);
    }
  }

  // Get all subjects taught in a class with their assigned teachers
  async getClassSubjectTeachers(classId: string): Promise<SubjectTeacherInfo[]> {
    try {
      const response = await fetch(`${this.baseUrl}/class/${classId}/subjects-teachers`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data.success ? data.data : [];
    } catch (error) {
      console.error('Error fetching subject teachers:', error);
      // Return mock data if API fails
      return this.getMockSubjectTeachers(classId);
    }
  }

  // Assign a teacher to teach a subject in a class
  async assignTeacherToSubject(assignment: {
    teacher_id: string;
    class_id: string;
    subject_id: string;
    academic_year: string;
  }): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/assignments`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(assignment)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data.success === true;
    } catch (error) {
      console.error('Error assigning teacher to subject:', error);
      return false;
    }
  }

  // Remove teacher assignment from subject in class
  async removeTeacherAssignment(assignmentId: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/assignments/${assignmentId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data.success === true;
    } catch (error) {
      console.error('Error removing teacher assignment:', error);
      return false;
    }
  }

  // Mock data for fallback
  private getMockClassAssignments(classId: string): ClassSubjectAssignment[] {
    const mockData: Record<string, ClassSubjectAssignment[]> = {
      'c1': [
        { 
          class_id: 'c1', 
          subject_id: 'sub1', 
          teacher_id: 't1', 
          teacher_name: 'Ibrahim Traoré', 
          subject_name: 'Mathématiques' 
        },
        { 
          class_id: 'c1', 
          subject_id: 'sub2', 
          teacher_id: 't2', 
          teacher_name: 'Aminata Diallo', 
          subject_name: 'Français' 
        }
      ],
      'c2': [
        { 
          class_id: 'c2', 
          subject_id: 'sub1', 
          teacher_id: 't1', 
          teacher_name: 'Ibrahim Traoré', 
          subject_name: 'Mathématiques' 
        },
        { 
          class_id: 'c2', 
          subject_id: 'sub3', 
          teacher_id: 't1', 
          teacher_name: 'Ibrahim Traoré', 
          subject_name: 'Physique' 
        }
      ]
    };
    
    return mockData[classId] || [];
  }

  private getMockSubjectTeachers(classId: string): SubjectTeacherInfo[] {
    const mockData: Record<string, SubjectTeacherInfo[]> = {
      'c1': [
        { 
          subject_id: 'sub1', 
          subject_name: 'Mathématiques',
          coefficient: 4,
          teachers: [
            { id: 't1', name: 'Ibrahim Traoré', email: 'ibrahim.traore@school.com' }
          ]
        },
        { 
          subject_id: 'sub2', 
          subject_name: 'Français',
          coefficient: 3,
          teachers: [
            { id: 't2', name: 'Aminata Diallo', email: 'aminata.diallo@school.com' }
          ]
        }
      ],
      'c2': [
        { 
          subject_id: 'sub1', 
          subject_name: 'Mathématiques',
          coefficient: 4,
          teachers: [
            { id: 't1', name: 'Ibrahim Traoré', email: 'ibrahim.traore@school.com' }
          ]
        },
        { 
          subject_id: 'sub3', 
          subject_name: 'Physique',
          coefficient: 3,
          teachers: [
            { id: 't1', name: 'Ibrahim Traoré', email: 'ibrahim.traore@school.com' }
          ]
        }
      ]
    };
    
    return mockData[classId] || [];
  }
}

export const timetableService = new TimetableService();