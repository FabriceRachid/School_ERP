const Composition = require('../models/composition.model');
const Teacher = require('../models/teacher.model');
const { asyncHandler } = require('../middlewares/error.middleware');
const { roleMiddleware } = require('../middlewares/role.middleware');

class CompositionController {
  static create = [
    roleMiddleware('admin'),
    asyncHandler(async (req, res) => {
      const schoolId = req.user.schoolId;
      if (!schoolId) return res.status(400).json({ success: false, message: 'schoolId manquant' });

      const { class_id, academic_year, trimester, exam_date, instructions } = req.body;
      if (!class_id || !academic_year || !trimester || !exam_date) {
        return res.status(400).json({
          success: false,
          message: 'Champs requis manquants',
          required: ['class_id', 'academic_year', 'trimester', 'exam_date']
        });
      }

      const row = await Composition.create({
        school_id: schoolId,
        class_id,
        academic_year,
        trimester,
        exam_date,
        instructions,
        status: 'planned',
        created_by: req.user.userId
      });

      res.status(201).json({ success: true, message: 'Composition créée', data: row });
    })
  ];

  static list = [
    roleMiddleware('admin', 'teacher'),
    asyncHandler(async (req, res) => {
      const schoolId = req.user.schoolId;
      if (!schoolId) return res.status(400).json({ success: false, message: 'schoolId manquant' });
      const rows = await Composition.listBySchool(schoolId, req.query.academic_year || null);
      res.json({ success: true, data: rows, count: rows.length });
    })
  ];

  static update = [
    roleMiddleware('admin'),
    asyncHandler(async (req, res) => {
      const current = await Composition.findById(req.params.id);
      if (!current) return res.status(404).json({ success: false, message: 'Composition introuvable' });
      if (current.school_id !== req.user.schoolId) return res.status(403).json({ success: false, message: 'Accès refusé' });

      const row = await Composition.update(req.params.id, req.body || {});
      res.json({ success: true, message: 'Composition mise à jour', data: row });
    })
  ];

  static upload = [
    roleMiddleware('admin', 'teacher'),
    asyncHandler(async (req, res) => {
      const current = await Composition.findById(req.params.id);
      if (!current) return res.status(404).json({ success: false, message: 'Composition introuvable' });
      if (current.school_id !== req.user.schoolId) return res.status(403).json({ success: false, message: 'Accès refusé' });

      const { subject_id, subject_title, file_url, notes_summary, notes_uploaded } = req.body;
      if (!subject_id) return res.status(400).json({ success: false, message: 'subject_id requis' });

      let teacherId = null;
      if (req.user.role === 'teacher') {
        const teacher = await Teacher.findByUserId(req.user.userId);
        if (!teacher) return res.status(400).json({ success: false, message: 'Profil enseignant introuvable' });
        teacherId = teacher.id;
      } else {
        teacherId = req.body.teacher_id || null;
      }

      if (!teacherId) return res.status(400).json({ success: false, message: 'teacher_id requis' });

      const row = await Composition.upsertUpload({
        composition_id: req.params.id,
        teacher_id: teacherId,
        subject_id,
        subject_title,
        file_url,
        notes_summary,
        notes_uploaded
      });

      res.status(201).json({ success: true, message: 'Upload enregistré', data: row });
    })
  ];

  static getUploads = [
    roleMiddleware('admin', 'teacher'),
    asyncHandler(async (req, res) => {
      const current = await Composition.findById(req.params.id);
      if (!current) return res.status(404).json({ success: false, message: 'Composition introuvable' });
      if (current.school_id !== req.user.schoolId) return res.status(403).json({ success: false, message: 'Accès refusé' });

      const rows = await Composition.getUploads(req.params.id);
      res.json({ success: true, data: rows, count: rows.length });
    })
  ];
}

module.exports = CompositionController;
