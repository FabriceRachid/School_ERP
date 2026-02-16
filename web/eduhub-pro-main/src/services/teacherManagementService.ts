// Enhanced Teacher Management Service
// Handles teacher creation with subject qualifications

interface TeacherCreationData {
  user_id: string;
  specialization?: string;
  hire_date?: string;
  salary?: number;
  qualified_subjects: string[]; // Array of subject IDs
}

interface TeacherWithQualifications {
  id: string;
  user_id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  schoolId: string;
  subjects: string[]; // Qualified subjects
  classes: string[];
  specialization?: string;
  hire_date?: string;
  salary?: number;
}

class TeacherManagementService {
  private baseUrl = '/api/teachers';
  private qualificationUrl = '/api/qualifications';

  // Create new teacher with qualifications
  async createTeacherWithQualifications(teacherData: TeacherCreationData): Promise<TeacherWithQualifications | null> {
    try {
      // First create the teacher record
      const teacherResponse = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          user_id: teacherData.user_id,
          specialization: teacherData.specialization,
          hire_date: teacherData.hire_date,
          salary: teacherData.salary
        })
      });

      if (!teacherResponse.ok) {
        const errorData = await teacherResponse.json();
        throw new Error(errorData.message || 'Failed to create teacher');
      }

      const teacherResult = await teacherResponse.json();
      const teacherId = teacherResult.data.id;

      // Then add subject qualifications
      if (teacherData.qualified_subjects && teacherData.qualified_subjects.length > 0) {
        const qualificationPromises = teacherData.qualified_subjects.map(subjectId =>
          fetch(`${this.qualificationUrl}/qualification`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              teacher_id: teacherId,
              subject_id: subjectId
            })
          })
        );

        await Promise.all(qualificationPromises);
      }

      // Return the complete teacher data
      return {
        id: teacherId,
        user_id: teacherData.user_id,
        firstName: '', // Will be populated from user data
        lastName: '',
        email: '',
        phone: '',
        schoolId: '', // Will be populated from user data
        subjects: teacherData.qualified_subjects,
        classes: [],
        specialization: teacherData.specialization,
        hire_date: teacherData.hire_date,
        salary: teacherData.salary
      };
    } catch (error) {
      console.error('Error creating teacher with qualifications:', error);
      return null;
    }
  }

  // Update teacher qualifications
  async updateTeacherQualifications(teacherId: string, subjectIds: string[]): Promise<boolean> {
    try {
      const response = await fetch(`${this.qualificationUrl}/qualification/bulk`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          teacher_id: teacherId,
          subject_ids: subjectIds
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.success === true;
    } catch (error) {
      console.error('Error updating teacher qualifications:', error);
      return false;
    }
  }

  // Get all subjects for qualification selection
  async getAllSubjects(): Promise<any[]> {
    try {
      const response = await fetch('/api/subjects', {
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
      console.error('Error fetching subjects:', error);
      return []; // Return empty array instead of mock data to avoid confusion
    }
  }

  // Mock data for development
  getMockSubjects(): any[] {
    return [
      { id: 'sub1', name: 'Mathématiques', code: 'MATH', coefficient: 4 },
      { id: 'sub2', name: 'Français', code: 'FR', coefficient: 3 },
      { id: 'sub3', name: 'Physique', code: 'PHYS', coefficient: 3 },
      { id: 'sub4', name: 'Chimie', code: 'CHIM', coefficient: 3 },
      { id: 'sub5', name: 'Biologie', code: 'BIO', coefficient: 2 },
      { id: 'sub6', name: 'Géographie', code: 'GEO', coefficient: 2 },
      { id: 'sub7', name: 'Histoire', code: 'HIST', coefficient: 2 },
      { id: 'sub8', name: 'Anglais', code: 'EN', coefficient: 2 },
      { id: 'sub9', name: 'Informatique', code: 'INFO', coefficient: 2 },
      { id: 'sub10', name: 'Éducation Physique', code: 'EPS', coefficient: 1 }
    ];
  }
}

export const teacherManagementService = new TeacherManagementService();