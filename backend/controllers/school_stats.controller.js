// School Statistics Controller - Fetches REAL data from database
const { pool } = require('../models');
const { asyncHandler } = require('../middlewares/error.middleware');
const { roleMiddleware } = require('../middlewares/hierarchical-role.middleware');

class SchoolStatsController {
  // Get real school statistics
  static getSchoolStats = [
    roleMiddleware('admin'),
    asyncHandler(async (req, res) => {
      try {
        const schoolId = req.user.schoolId;
        
        // Get total students count
        const studentsQuery = `
          SELECT COUNT(*) as total_students
          FROM students s
          JOIN users u ON s.user_id = u.id
          WHERE u.school_id = $1 AND u.role = 'student'
        `;
        const studentsResult = await pool.query(studentsQuery, [schoolId]);
        const totalStudents = parseInt(studentsResult.rows[0].total_students);

        // Get total parents count
        const parentsQuery = `
          SELECT COUNT(*) as total_parents
          FROM users
          WHERE school_id = $1 AND role = 'parent'
        `;
        const parentsResult = await pool.query(parentsQuery, [schoolId]);
        const totalParents = parseInt(parentsResult.rows[0].total_parents);

        // Get total teachers count
        const teachersQuery = `
          SELECT COUNT(*) as total_teachers
          FROM users
          WHERE school_id = $1 AND role = 'teacher'
        `;
        const teachersResult = await pool.query(teachersQuery, [schoolId]);
        const totalTeachers = parseInt(teachersResult.rows[0].total_teachers);

        // Get pending links count (students without parent links)
        const pendingLinksQuery = `
          SELECT COUNT(*) as pending_links
          FROM students s
          JOIN users u ON s.user_id = u.id
          LEFT JOIN parent_student_links psl ON s.id = psl.student_id
          WHERE u.school_id = $1 AND psl.id IS NULL
        `;
        const pendingLinksResult = await pool.query(pendingLinksQuery, [schoolId]);
        const pendingLinks = parseInt(pendingLinksResult.rows[0].pending_links);

        // Get classes count
        const classesQuery = `
          SELECT COUNT(*) as total_classes
          FROM classes
          WHERE school_id = $1
        `;
        const classesResult = await pool.query(classesQuery, [schoolId]);
        const totalClasses = parseInt(classesResult.rows[0].total_classes);

        // Get active accounts count
        const activeAccountsQuery = `
          SELECT COUNT(*) as active_accounts
          FROM users
          WHERE school_id = $1 AND status = 'active'
        `;
        const activeAccountsResult = await pool.query(activeAccountsQuery, [schoolId]);
        const activeAccounts = parseInt(activeAccountsResult.rows[0].active_accounts);

        // Get recent activity (last 7 days)
        const recentActivityQuery = `
          SELECT 
            COUNT(*) as recent_creations,
            STRING_AGG(role, ',') as created_roles
          FROM users
          WHERE school_id = $1 
          AND created_at >= NOW() - INTERVAL '7 days'
          GROUP BY school_id
        `;
        const recentActivityResult = await pool.query(recentActivityQuery, [schoolId]);
        const recentCreations = recentActivityResult.rows[0] ? 
          parseInt(recentActivityResult.rows[0].recent_creations) : 0;

        res.json({
          success: true,
          message: 'Statistiques récupérées avec succès',
          data: {
            totalStudents,
            totalParents,
            totalTeachers,
            pendingLinks,
            totalClasses,
            activeAccounts,
            recentCreations,
            timestamp: new Date().toISOString()
          }
        });
      } catch (error) {
        console.error('Error fetching school stats:', error);
        throw error;
      }
    })
  ];

  // Get students distribution by class (for charts)
  static getStudentsByClass = [
    roleMiddleware('admin'),
    asyncHandler(async (req, res) => {
      try {
        const schoolId = req.user.schoolId;
        
        const query = `
          SELECT 
            c.name as class_name,
            COUNT(s.id) as student_count,
            c.level
          FROM classes c
          LEFT JOIN students s ON c.id = s.class_id
          LEFT JOIN users u ON s.user_id = u.id
          WHERE c.school_id = $1
          GROUP BY c.id, c.name, c.level
          ORDER BY c.name
        `;
        
        const result = await pool.query(query, [schoolId]);
        
        res.json({
          success: true,
          message: 'Distribution des étudiants par classe',
          data: result.rows
        });
      } catch (error) {
        console.error('Error fetching students by class:', error);
        throw error;
      }
    })
  ];

  // Get account status distribution (for pie charts)
  static getAccountStatusDistribution = [
    roleMiddleware('admin'),
    asyncHandler(async (req, res) => {
      try {
        const schoolId = req.user.schoolId;
        
        const query = `
          SELECT 
            status,
            COUNT(*) as count,
            STRING_AGG(role, ',' ORDER BY role) as roles
          FROM users
          WHERE school_id = $1
          GROUP BY status
          ORDER BY status
        `;
        
        const result = await pool.query(query, [schoolId]);
        
        res.json({
          success: true,
          message: 'Distribution des statuts de compte',
          data: result.rows
        });
      } catch (error) {
        console.error('Error fetching account status distribution:', error);
        throw error;
      }
    })
  ];
}

module.exports = SchoolStatsController;