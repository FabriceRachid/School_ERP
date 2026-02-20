const pool = require('../db');
const { asyncHandler } = require('../middlewares/error.middleware');
const { roleMiddleware } = require('../middlewares/role.middleware');

const dayMap = {
  lundi: 'monday',
  mardi: 'tuesday',
  mercredi: 'wednesday',
  jeudi: 'thursday',
  vendredi: 'friday',
  monday: 'monday',
  tuesday: 'tuesday',
  wednesday: 'wednesday',
  thursday: 'thursday',
  friday: 'friday'
};

const normalizeDay = (value) => {
  const key = String(value || '').trim().toLowerCase();
  return dayMap[key] || null;
};

class TimetableController {
  static create = [
    roleMiddleware('admin'),
    asyncHandler(async (req, res) => {
      const body = req.body?.data && typeof req.body.data === 'object' ? req.body.data : (req.body || {});
      const {
        class_id,
        classId,
        subject_id,
        subjectId,
        teacher_id,
        teacherId,
        day_of_week,
        dayOfWeek,
        day,
        start_time,
        startTime,
        end_time,
        endTime,
        room
      } = body;

      const classIdValue = class_id || classId;
      const subjectIdValue = subject_id || subjectId;
      const teacherIdValue = teacher_id || teacherId;
      const dayValue = normalizeDay(day_of_week || dayOfWeek || day);
      const startTimeValue = start_time || startTime;
      const endTimeValue = end_time || endTime;

      if (!classIdValue || !subjectIdValue || !teacherIdValue || !dayValue || !startTimeValue || !endTimeValue) {
        return res.status(400).json({
          success: false,
          message: 'Missing required fields',
          required: ['class_id', 'subject_id', 'teacher_id', 'day_of_week', 'start_time', 'end_time']
        });
      }

      const schoolId = req.user.schoolId;

      const classResult = await pool.query(
        `SELECT id, school_id, academic_year FROM classes WHERE id = $1`,
        [classIdValue]
      );
      const classRow = classResult.rows[0];
      if (!classRow || classRow.school_id !== schoolId) {
        return res.status(400).json({ success: false, message: 'Invalid class for this school' });
      }

      const subjectResult = await pool.query(
        `SELECT id, school_id FROM subjects WHERE id = $1`,
        [subjectIdValue]
      );
      const subjectRow = subjectResult.rows[0];
      if (!subjectRow || subjectRow.school_id !== schoolId) {
        return res.status(400).json({ success: false, message: 'Invalid subject for this school' });
      }

      const teacherResult = await pool.query(
        `SELECT t.id
         FROM teachers t
         JOIN users u ON u.id = t.user_id
         LEFT JOIN teacher_school_links tsl ON tsl.teacher_id = t.id
         WHERE t.id = $1
           AND (
             u.school_id = $2
             OR tsl.school_id = $2
           )
         LIMIT 1`,
        [teacherIdValue, schoolId]
      );
      if (!teacherResult.rows[0]) {
        return res.status(400).json({ success: false, message: 'Invalid teacher for this school' });
      }

      const slotResult = await pool.query(
        `INSERT INTO timetable_slots (class_id, subject_id, teacher_id, day_of_week, start_time, end_time, room)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING id, class_id, subject_id, teacher_id, day_of_week, start_time, end_time, room, created_at`,
        [classIdValue, subjectIdValue, teacherIdValue, dayValue, startTimeValue, endTimeValue, room || null]
      );

      await pool.query(
        `INSERT INTO class_subjects (class_id, subject_id)
         VALUES ($1, $2)
         ON CONFLICT (class_id, subject_id) DO NOTHING`,
        [classIdValue, subjectIdValue]
      );

      await pool.query(
        `INSERT INTO teacher_assignments (teacher_id, class_id, subject_id, academic_year)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (teacher_id, class_id, subject_id, academic_year) DO NOTHING`,
        [teacherIdValue, classIdValue, subjectIdValue, classRow.academic_year]
      );

      return res.status(201).json({
        success: true,
        message: 'Timetable slot created successfully',
        data: slotResult.rows[0]
      });
    })
  ];

  static update = [
    roleMiddleware('admin'),
    asyncHandler(async (req, res) => {
      const body = req.body?.data && typeof req.body.data === 'object' ? req.body.data : (req.body || {});
      const {
        class_id,
        classId,
        subject_id,
        subjectId,
        teacher_id,
        teacherId,
        day_of_week,
        dayOfWeek,
        day,
        start_time,
        startTime,
        end_time,
        endTime,
        room
      } = body;

      const slotResult = await pool.query(
        `SELECT ts.id, ts.class_id, ts.subject_id, ts.teacher_id, c.school_id, c.academic_year
         FROM timetable_slots ts
         JOIN classes c ON c.id = ts.class_id
         WHERE ts.id = $1`,
        [req.params.id]
      );
      const current = slotResult.rows[0];
      if (!current || current.school_id !== req.user.schoolId) {
        return res.status(404).json({ success: false, message: 'Timetable slot not found' });
      }

      const nextClassId = class_id || classId || current.class_id;
      const nextSubjectId = subject_id || subjectId || current.subject_id;
      const nextTeacherId = teacher_id || teacherId || current.teacher_id;
      const nextDay = normalizeDay(day_of_week || dayOfWeek || day) || null;
      const nextStartTime = start_time || startTime || null;
      const nextEndTime = end_time || endTime || null;

      const updatedResult = await pool.query(
        `UPDATE timetable_slots
         SET class_id = COALESCE($2, class_id),
             subject_id = COALESCE($3, subject_id),
             teacher_id = COALESCE($4, teacher_id),
             day_of_week = COALESCE($5, day_of_week),
             start_time = COALESCE($6, start_time),
             end_time = COALESCE($7, end_time),
             room = COALESCE($8, room),
             updated_at = NOW()
         WHERE id = $1
         RETURNING id, class_id, subject_id, teacher_id, day_of_week, start_time, end_time, room, updated_at`,
        [req.params.id, class_id || classId || null, subject_id || subjectId || null, teacher_id || teacherId || null, nextDay, nextStartTime, nextEndTime, room || null]
      );

      const updated = updatedResult.rows[0];
      if (!updated) {
        return res.status(404).json({ success: false, message: 'Timetable slot not found' });
      }

      const classRowResult = await pool.query(`SELECT academic_year FROM classes WHERE id = $1`, [nextClassId]);
      const academicYear = classRowResult.rows[0]?.academic_year || current.academic_year;

      await pool.query(
        `INSERT INTO class_subjects (class_id, subject_id)
         VALUES ($1, $2)
         ON CONFLICT (class_id, subject_id) DO NOTHING`,
        [nextClassId, nextSubjectId]
      );

      await pool.query(
        `INSERT INTO teacher_assignments (teacher_id, class_id, subject_id, academic_year)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (teacher_id, class_id, subject_id, academic_year) DO NOTHING`,
        [nextTeacherId, nextClassId, nextSubjectId, academicYear]
      );

      return res.json({
        success: true,
        message: 'Timetable slot updated successfully',
        data: updated
      });
    })
  ];

  static delete = [
    roleMiddleware('admin'),
    asyncHandler(async (req, res) => {
      const deleted = await pool.query(
        `DELETE FROM timetable_slots ts
         USING classes c
         WHERE ts.id = $1
           AND c.id = ts.class_id
           AND c.school_id = $2
         RETURNING ts.id`,
        [req.params.id, req.user.schoolId]
      );

      if (!deleted.rows[0]) {
        return res.status(404).json({ success: false, message: 'Timetable slot not found' });
      }

      return res.json({
        success: true,
        message: 'Timetable slot deleted successfully'
      });
    })
  ];
}

module.exports = TimetableController;
