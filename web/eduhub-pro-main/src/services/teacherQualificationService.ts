// Teacher Qualification Service
// Handles communication with the backend API for teacher-subject qualifications

interface TeacherQualification {
  id: string;
  teacher_id: string;
  subject_id: string;
  created_at: string;
}

interface QualifiedSubject {
  id: string;
  name: string;
  code: string;
  coefficient: number;
  school_id: string;
}

interface QualifiedTeacher {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
}

class TeacherQualificationService {
  private baseUrl = '/api/qualifications';

  // Get all subjects a teacher is qualified to teach
  async getQualifiedSubjects(teacherId: string): Promise<QualifiedSubject[]> {
    try {
      const response = await fetch(`${this.baseUrl}/teacher/${teacherId}/subjects`, {
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
      console.error('Error fetching qualified subjects:', error);
      // Return mock data if API fails
      return this.getMockQualifiedSubjects(teacherId);
    }
  }

  // Get all teachers qualified to teach a subject
  async getQualifiedTeachers(subjectId: string): Promise<QualifiedTeacher[]> {
    try {
      const response = await fetch(`${this.baseUrl}/subject/${subjectId}/teachers`, {
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
      console.error('Error fetching qualified teachers:', error);
      // Return mock data if API fails
      return this.getMockQualifiedTeachers(subjectId);
    }
  }

  // Add subject qualification to teacher
  async addSubjectQualification(teacherId: string, subjectId: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/qualification`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ teacher_id: teacherId, subject_id: subjectId })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data.success === true;
    } catch (error) {
      console.error('Error adding subject qualification:', error);
      return false;
    }
  }

  // Remove subject qualification from teacher
  async removeSubjectQualification(teacherId: string, subjectId: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/qualification/teacher/${teacherId}/subject/${subjectId}`, {
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
      console.error('Error removing subject qualification:', error);
      return false;
    }
  }

  // Bulk update teacher qualifications
  async bulkUpdateQualifications(teacherId: string, subjectIds: string[]): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/qualification/bulk`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ teacher_id: teacherId, subject_ids: subjectIds })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data.success === true;
    } catch (error) {
      console.error('Error bulk updating qualifications:', error);
      return false;
    }
  }

  // Mock data for fallback when API is unavailable
  private getMockQualifiedSubjects(teacherId: string): QualifiedSubject[] {
    const mockData: Record<string, QualifiedSubject[]> = {
      't1': [
        { id: 'sub1', name: 'Mathématiques', code: 'MATH', coefficient: 4, school_id: 's1' },
        { id: 'sub3', name: 'Physique', code: 'PHYS', coefficient: 3, school_id: 's1' }
      ],
      't2': [
        { id: 'sub2', name: 'Français', code: 'FR', coefficient: 3, school_id: 's1' },
        { id: 'sub7', name: 'Histoire-Géo', code: 'HG', coefficient: 2, school_id: 's1' }
      ],
      't3': [
        { id: 'sub10', name: 'Anglais', code: 'EN', coefficient: 2, school_id: 's2' }
      ]
    };
    
    return mockData[teacherId] || [];
  }

  private getMockQualifiedTeachers(subjectId: string): QualifiedTeacher[] {
    const mockData: Record<string, QualifiedTeacher[]> = {
      'sub1': [
        { id: 't1', first_name: 'Ibrahim', last_name: 'Traoré', email: 'ibrahim.traore@school.com' }
      ],
      'sub2': [
        { id: 't2', first_name: 'Aminata', last_name: 'Diallo', email: 'aminata.diallo@school.com' }
      ],
      'sub3': [
        { id: 't1', first_name: 'Ibrahim', last_name: 'Traoré', email: 'ibrahim.traore@school.com' }
      ]
    };
    
    return mockData[subjectId] || [];
  }
}

export const teacherQualificationService = new TeacherQualificationService();