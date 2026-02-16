const pool = require('../db');

const mapRoleForWeb = (dbRole, schoolId) => {
  if (dbRole === 'teacher') return 'teacher';
  if (dbRole === 'admin' && schoolId) return 'admin_school';
  if (dbRole === 'admin' && !schoolId) return 'super_admin';
  return dbRole;
};

const normalizeDay = (dayOfWeek) => {
  const map = {
    monday: { web: 'Lundi', mobile: 0 },
    tuesday: { web: 'Mardi', mobile: 1 },
    wednesday: { web: 'Mercredi', mobile: 2 },
    thursday: { web: 'Jeudi', mobile: 3 },
    friday: { web: 'Vendredi', mobile: 4 }
  };

  return map[dayOfWeek] || { web: 'Lundi', mobile: 0 };
};

const toCycleId = (schoolId, cycleName) =>
  `${schoolId}-cy-${(cycleName || 'Cycle Général').toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;

class FrontendContractService {
  static async getTeacherSchoolIds(userId) {
    const query = `
      SELECT DISTINCT COALESCE(tsl.school_id, c.school_id, u.school_id) AS school_id
      FROM teachers t
      JOIN users u ON u.id = t.user_id
      LEFT JOIN teacher_school_links tsl ON tsl.teacher_id = t.id
      LEFT JOIN teacher_assignments ta ON ta.teacher_id = t.id
      LEFT JOIN classes c ON c.id = ta.class_id
      WHERE u.id = $1
    `;

    const { rows } = await pool.query(query, [userId]);
    const ids = rows
      .map((r) => r.school_id)
      .filter(Boolean);
    return [...new Set(ids)];
  }

  static async getUserContext(userId) {
    const query = `
      SELECT id, school_id, first_name, last_name, email, role, status
      FROM users
      WHERE id = $1 AND status = 'active'
      LIMIT 1
    `;

    const result = await pool.query(query, [userId]);
    return result.rows[0] || null;
  }

  static async getSchools() {
    const query = `
      SELECT
        s.id,
        s.name,
        s.address,
        s.phone,
        s.email,
        COALESCE(s.is_active, true) AS is_active,
        admin_user.id AS admin_id,
        COALESCE(student_stats.students_count, 0) AS students_count,
        COALESCE(teacher_stats.teachers_count, 0) AS teachers_count,
        COALESCE(class_stats.classes_count, 0) AS classes_count
      FROM schools s
      LEFT JOIN LATERAL (
        SELECT u.id
        FROM users u
        WHERE u.school_id = s.id AND u.role = 'admin' AND u.status = 'active'
        ORDER BY u.created_at ASC
        LIMIT 1
      ) admin_user ON true
      LEFT JOIN LATERAL (
        SELECT COUNT(*) AS classes_count
        FROM classes c
        WHERE c.school_id = s.id
      ) class_stats ON true
      LEFT JOIN LATERAL (
        SELECT COUNT(*) AS students_count
        FROM students st
        JOIN users u3 ON u3.id = st.user_id
        WHERE u3.school_id = s.id AND u3.status = 'active'
      ) student_stats ON true
      LEFT JOIN LATERAL (
        SELECT COUNT(DISTINCT t.id) AS teachers_count
        FROM teachers t
        JOIN users u4 ON u4.id = t.user_id
        LEFT JOIN teacher_school_links tsl ON tsl.teacher_id = t.id
        LEFT JOIN teacher_assignments ta ON ta.teacher_id = t.id
        LEFT JOIN classes cta ON cta.id = ta.class_id
        WHERE u4.status = 'active'
          AND (
            u4.school_id = s.id
            OR tsl.school_id = s.id
            OR cta.school_id = s.id
          )
      ) teacher_stats ON true
      ORDER BY s.name ASC
    `;

    const { rows } = await pool.query(query);
    return rows.map((school) => ({
      id: school.id,
      name: school.name,
      address: school.address || '',
      phone: school.phone || '',
      email: school.email || '',
      adminId: school.admin_id || null,
      studentsCount: Number(school.students_count || 0),
      teachersCount: Number(school.teachers_count || 0),
      classesCount: Number(school.classes_count || 0),
      isActive: Boolean(school.is_active)
    }));
  }

  static async getSchoolCycles(schoolId) {
    const query = `
      SELECT DISTINCT COALESCE(c.cycle_name, c.level, 'Cycle Général') AS cycle_name
      FROM classes c
      WHERE c.school_id = $1
      ORDER BY cycle_name
    `;

    const { rows } = await pool.query(query, [schoolId]);
    return rows.map((row) => ({
      id: toCycleId(schoolId, row.cycle_name),
      name: row.cycle_name,
      schoolId
    }));
  }

  static async getClasses(schoolId) {
    const query = `
      SELECT
        c.id,
        c.name,
        c.school_id,
        COALESCE(c.capacity, 40) AS capacity,
        COALESCE(c.cycle_name, c.level, 'Cycle Général') AS cycle_name,
        COALESCE(c.fees, 0) AS fees,
        COALESCE(st.students_count, 0) AS students_count,
        home_room.teacher_id AS main_teacher_id
      FROM classes c
      LEFT JOIN (
        SELECT class_id, COUNT(*) AS students_count
        FROM students
        GROUP BY class_id
      ) st ON st.class_id = c.id
      LEFT JOIN LATERAL (
        SELECT ta.teacher_id
        FROM teacher_assignments ta
        WHERE ta.class_id = c.id
        ORDER BY ta.created_at ASC
        LIMIT 1
      ) home_room ON true
      WHERE c.school_id = $1
      ORDER BY c.name ASC
    `;

    const { rows } = await pool.query(query, [schoolId]);
    return rows.map((c) => ({
      id: c.id,
      name: c.name,
      cycleId: toCycleId(schoolId, c.cycle_name),
      schoolId: c.school_id,
      capacity: Number(c.capacity),
      studentsCount: Number(c.students_count),
      mainTeacherId: c.main_teacher_id || undefined,
      fees: Number(c.fees)
    }));
  }

  static async getSubjects(schoolId) {
    const query = `
      SELECT id, name, coefficient, school_id
      FROM subjects
      WHERE school_id = $1
      ORDER BY name ASC
    `;

    const { rows } = await pool.query(query, [schoolId]);
    return rows.map((s) => ({
      id: s.id,
      name: s.name,
      coefficient: Number(s.coefficient || 1),
      schoolId: s.school_id
    }));
  }

  static async getTeachers(schoolId) {
    const query = `
      SELECT
        t.id,
        t.user_id,
        u.first_name,
        u.last_name,
        u.phone,
        COALESCE(u.school_id, $1) AS school_id,
        COALESCE(
          ARRAY_AGG(DISTINCT ta.subject_id) FILTER (WHERE ta.subject_id IS NOT NULL),
          ARRAY[]::uuid[]
        ) AS subjects,
        COALESCE(
          ARRAY_AGG(DISTINCT ta.class_id) FILTER (WHERE ta.class_id IS NOT NULL),
          ARRAY[]::uuid[]
        ) AS classes
      FROM teachers t
      JOIN users u ON u.id = t.user_id
      LEFT JOIN teacher_school_links tsl ON tsl.teacher_id = t.id
      LEFT JOIN teacher_assignments ta ON ta.teacher_id = t.id
      LEFT JOIN classes c2 ON c2.id = ta.class_id
      WHERE u.status = 'active'
      AND (
        u.school_id = $1
        OR tsl.school_id = $1
        OR c2.school_id = $1
      )
      GROUP BY t.id, t.user_id, u.first_name, u.last_name, u.phone, u.school_id
      ORDER BY u.last_name, u.first_name
    `;

    const { rows } = await pool.query(query, [schoolId]);
    return rows.map((t) => ({
      id: t.id,
      userId: t.user_id,
      firstName: t.first_name,
      lastName: t.last_name,
      phone: t.phone || '',
      schoolId: t.school_id,
      subjects: t.subjects,
      classes: t.classes
    }));
  }

  static async getStudents(schoolId) {
    const query = `
      SELECT
        st.id,
        st.student_id AS matricule,
        u.first_name,
        u.last_name,
        st.date_of_birth,
        CASE
          WHEN st.gender = 'female' THEN 'F'
          WHEN st.gender = 'male' THEN 'M'
          ELSE 'M'
        END AS gender,
        st.class_id,
        u.school_id,
        st.parent_name,
        st.parent_phone,
        st.enrollment_date
      FROM students st
      JOIN users u ON u.id = st.user_id
      WHERE u.school_id = $1 AND u.status = 'active'
      ORDER BY u.last_name, u.first_name
    `;

    const { rows } = await pool.query(query, [schoolId]);
    return rows.map((s) => ({
      id: s.id,
      matricule: s.matricule || '',
      firstName: s.first_name,
      lastName: s.last_name,
      dateOfBirth: s.date_of_birth ? new Date(s.date_of_birth).toISOString().slice(0, 10) : '',
      gender: s.gender,
      classId: s.class_id,
      schoolId: s.school_id,
      parentName: s.parent_name || '',
      parentPhone: s.parent_phone || '',
      enrollmentDate: s.enrollment_date ? new Date(s.enrollment_date).toISOString().slice(0, 10) : ''
    }));
  }

  static async getGrades(schoolId) {
    const query = `
      SELECT
        g.id,
        g.student_id,
        g.subject_id,
        g.teacher_id,
        st.class_id,
        g.evaluation_type,
        g.score,
        g.max_score,
        g.semester,
        g.date
      FROM grades g
      JOIN students st ON st.id = g.student_id
      JOIN users u ON u.id = st.user_id
      WHERE u.school_id = $1
      ORDER BY g.date DESC
    `;

    const { rows } = await pool.query(query, [schoolId]);
    return rows.map((g) => ({
      id: g.id,
      studentId: g.student_id,
      subjectId: g.subject_id,
      teacherId: g.teacher_id,
      classId: g.class_id,
      type: g.evaluation_type === 'exam' ? 'exam' : 'control',
      value: Number(g.score || 0),
      maxValue: Number(g.max_score || 20),
      period: g.semester || 'Trimestre 1',
      date: new Date(g.date).toISOString().slice(0, 10)
    }));
  }

  static async getPayments(schoolId) {
    const query = `
      SELECT
        p.id,
        p.student_id,
        p.amount,
        p.payment_date,
        p.payment_method,
        p.status,
        f.amount AS total_due,
        f.school_id
      FROM payments p
      JOIN fees f ON f.id = p.fee_id
      WHERE f.school_id = $1
      ORDER BY p.payment_date DESC
    `;

    const { rows } = await pool.query(query, [schoolId]);
    return rows.map((p) => {
      const totalDue = Number(p.total_due || p.amount || 0);
      const paidAmount = Number(p.amount || 0);
      const status =
        paidAmount >= totalDue && totalDue > 0
          ? 'paid'
          : paidAmount > 0
            ? 'partial'
            : 'unpaid';

      return {
        id: p.id,
        studentId: p.student_id,
        amount: paidAmount,
        totalDue,
        paidAmount,
        status,
        date: p.payment_date ? new Date(p.payment_date).toISOString().slice(0, 10) : '',
        method: p.payment_method || '',
        schoolId: p.school_id
      };
    });
  }

  static async getTimeSlots(schoolId) {
    const query = `
      SELECT
        ts.id,
        ts.class_id,
        ts.subject_id,
        ts.teacher_id,
        ts.day_of_week,
        ts.start_time,
        ts.end_time
      FROM timetable_slots ts
      JOIN classes c ON c.id = ts.class_id
      WHERE c.school_id = $1
      ORDER BY ts.day_of_week, ts.start_time
    `;

    const { rows } = await pool.query(query, [schoolId]);
    return rows.map((slot) => {
      const day = normalizeDay(slot.day_of_week);
      return {
        id: slot.id,
        classId: slot.class_id,
        schoolId,
        subjectId: slot.subject_id,
        teacherId: slot.teacher_id,
        day: day.web,
        startTime: slot.start_time?.slice(0, 5) || '08:00',
        endTime: slot.end_time?.slice(0, 5) || '09:00',
        mobileDay: day.mobile
      };
    });
  }

  static async getUsersForWeb() {
    const query = `
      SELECT id, email, first_name, last_name, role, school_id
      FROM users
      WHERE status = 'active'
      ORDER BY created_at ASC
    `;
    const { rows } = await pool.query(query);
    return rows.map((u) => ({
      id: u.id,
      email: u.email,
      name: `${u.first_name} ${u.last_name}`.trim(),
      role: mapRoleForWeb(u.role, u.school_id),
      schoolId: u.school_id || undefined
    }));
  }

  static async getWebBundle(user) {
    const userRole = mapRoleForWeb(user.role, user.school_id);
    const isSuperAdmin = userRole === 'super_admin';
    let schoolIds;
    if (isSuperAdmin) {
      schoolIds = (await this.getSchools()).map((s) => s.id);
    } else if (user.role === 'teacher') {
      schoolIds = await this.getTeacherSchoolIds(user.id);
      if (schoolIds.length === 0 && user.school_id) schoolIds = [user.school_id];
    } else {
      schoolIds = [user.school_id];
    }

    const allSchools = await this.getSchools();
    const schools = isSuperAdmin
      ? allSchools
      : allSchools.filter((s) => schoolIds.includes(s.id));
    const allUsers = await this.getUsersForWeb();
    const users = isSuperAdmin
      ? allUsers
      : allUsers.filter((u) => !u.schoolId || schoolIds.includes(u.schoolId));

    const classes = [];
    const cycles = [];
    const subjects = [];
    const teachers = [];
    const students = [];
    const grades = [];
    const payments = [];
    const timeSlots = [];

    for (const schoolId of schoolIds) {
      if (!schoolId) continue;
      const [schoolClasses, schoolCycles, schoolSubjects, schoolTeachers, schoolStudents, schoolGrades, schoolPayments, schoolTimeSlots] = await Promise.all([
        this.getClasses(schoolId),
        this.getSchoolCycles(schoolId),
        this.getSubjects(schoolId),
        this.getTeachers(schoolId),
        this.getStudents(schoolId),
        this.getGrades(schoolId),
        this.getPayments(schoolId),
        this.getTimeSlots(schoolId)
      ]);

      classes.push(...schoolClasses);
      cycles.push(...schoolCycles);
      subjects.push(...schoolSubjects);
      teachers.push(...schoolTeachers);
      students.push(...schoolStudents);
      grades.push(...schoolGrades);
      payments.push(...schoolPayments);
      timeSlots.push(...schoolTimeSlots.map(({ mobileDay, ...slot }) => slot));
    }

    return {
      users,
      schools,
      academicYears: [
        { id: 'current', label: '2025-2026', startDate: '2025-09-01', endDate: '2026-06-30', isCurrent: true }
      ],
      cycles,
      classes,
      subjects,
      students,
      teachers,
      grades,
      payments,
      timeSlots,
      attendance: []
    };
  }

  
    static async getUserNotifications(userId, limit = 50) {
    const query = `
      SELECT id, title, message, type, status, created_at
      FROM notifications
      WHERE recipient_id = $1
      ORDER BY created_at DESC
      LIMIT $2
    `;

    const { rows } = await pool.query(query, [userId, limit]);
    return rows.map((n) => ({
      id: n.id,
      title: n.title,
      message: n.message,
      type: n.type || 'announcement',
      date: n.created_at ? new Date(n.created_at).toISOString() : new Date().toISOString(),
      read: n.status === 'read'
    }));
  }

  static async getMobileStudentsForParent(parentUserId) {
    const query = `
      SELECT
        st.id,
        u.first_name,
        u.last_name,
        st.class_id,
        c.name AS class_name,
        c.school_id
      FROM parent_student_links psl
      JOIN students st ON st.id = psl.student_id
      JOIN users u ON u.id = st.user_id
      LEFT JOIN classes c ON c.id = st.class_id
      WHERE psl.parent_id = $1
        AND u.status = 'active'
      ORDER BY psl.is_primary DESC, u.last_name, u.first_name
    `;

    const { rows } = await pool.query(query, [parentUserId]);
    return rows.map((r) => ({
      id: r.id,
      firstName: r.first_name,
      lastName: r.last_name,
      classId: r.class_id,
      className: r.class_name || '',
      schoolId: r.school_id || null
    }));
  }

  static async getMobileStudentsForStudentUser(studentUserId) {
    const query = `
      SELECT
        st.id,
        u.first_name,
        u.last_name,
        st.class_id,
        c.name AS class_name,
        c.school_id
      FROM students st
      JOIN users u ON u.id = st.user_id
      LEFT JOIN classes c ON c.id = st.class_id
      WHERE st.user_id = $1
        AND u.status = 'active'
      LIMIT 1
    `;

    const { rows } = await pool.query(query, [studentUserId]);
    if (!rows[0]) return [];

    const r = rows[0];
    return [{
      id: r.id,
      firstName: r.first_name,
      lastName: r.last_name,
      classId: r.class_id,
      className: r.class_name || '',
      schoolId: r.school_id || null
    }];
  }

  static async getMobileBundle(user) {
    const notifications = await this.getUserNotifications(user.id);

    let students = [];
    if (user.role === 'parent') {
      students = await this.getMobileStudentsForParent(user.id);
    } else if (user.role === 'student') {
      students = await this.getMobileStudentsForStudentUser(user.id);
    }

    if (students.length === 0) {
      return {
        students: [],
        subjectsByStudent: {},
        scheduleByStudent: {},
        paymentsByStudent: {},
        notifications
      };
    }

    const schoolIds = [...new Set(students.map((s) => s.schoolId).filter(Boolean))];
    const studentIds = new Set(students.map((s) => s.id));
    const classByStudent = new Map(students.map((s) => [s.id, s.classId]));

    const allGrades = [];
    const allPayments = [];
    const allSlots = [];

    for (const schoolId of schoolIds) {
      const [schoolGrades, schoolPayments, schoolSlots] = await Promise.all([
        this.getGrades(schoolId),
        this.getPayments(schoolId),
        this.getTimeSlots(schoolId)
      ]);
      allGrades.push(...schoolGrades);
      allPayments.push(...schoolPayments);
      allSlots.push(...schoolSlots);
    }

    const grades = allGrades.filter((g) => studentIds.has(g.studentId));
    const payments = allPayments.filter((p) => studentIds.has(p.studentId));

    const subjectsByStudent = {};
    for (const grade of grades) {
      if (!subjectsByStudent[grade.studentId]) subjectsByStudent[grade.studentId] = [];
      const existing = subjectsByStudent[grade.studentId].find((s) => s.id === grade.subjectId);
      const gradeItem = {
        id: grade.id,
        label: grade.type === 'exam' ? 'Examen' : 'Contrôle',
        value: grade.value,
        outOf: grade.maxValue,
        date: grade.date,
        type: grade.type
      };

      if (existing) {
        existing.grades.push(gradeItem);
        const sum = existing.grades.reduce((acc, g) => acc + g.value, 0);
        existing.average = sum / existing.grades.length;
      } else {
        subjectsByStudent[grade.studentId].push({
          id: grade.subjectId,
          name: `Matière ${grade.subjectId.slice(0, 6)}`,
          teacher: '',
          average: grade.value,
          coefficient: 1,
          grades: [gradeItem]
        });
      }
    }

    const scheduleByStudent = {};
    for (const student of students) {
      const classId = classByStudent.get(student.id);
      const studentSlots = allSlots.filter((s) => s.classId === classId);
      scheduleByStudent[student.id] = studentSlots.map((s) => ({
        id: s.id,
        day: s.mobileDay,
        startTime: s.startTime,
        endTime: s.endTime,
        subject: s.subjectId,
        teacher: s.teacherId || '',
        room: ''
      }));
    }

    const paymentsByStudent = {};
    for (const p of payments) {
      if (!paymentsByStudent[p.studentId]) paymentsByStudent[p.studentId] = [];
      paymentsByStudent[p.studentId].push({
        id: p.id,
        label: 'Frais scolaires',
        amount: p.totalDue,
        paidAmount: p.paidAmount,
        dueDate: p.date || new Date().toISOString().slice(0, 10),
        status: p.status,
        type: 'mensualite'
      });
    }

    return {
      students: students.map((s) => ({
        id: s.id,
        firstName: s.firstName,
        lastName: s.lastName,
        class: s.className || s.classId || '',
        level: '',
        photo: '',
        averageGrade: 0,
        rank: 0,
        totalStudents: 0
      })),
      subjectsByStudent,
      scheduleByStudent,
      paymentsByStudent,
      notifications
    };
  }
}

module.exports = FrontendContractService;
