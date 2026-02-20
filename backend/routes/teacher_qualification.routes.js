const express = require('express');
const TeacherQualificationController = require('../controllers/teacher_qualification.controller');
const { authMiddleware } = require('../middlewares/auth.middleware');

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// Teacher qualification routes
router.get('/teacher/:teacher_id/subjects', ...TeacherQualificationController.getQualifiedSubjects);
router.get('/subject/:subject_id/teachers', ...TeacherQualificationController.getQualifiedTeachers);
router.post('/qualification', ...TeacherQualificationController.addSubjectQualification);
router.delete('/qualification/teacher/:teacher_id/subject/:subject_id', ...TeacherQualificationController.removeSubjectQualification);
router.put('/qualification/bulk', ...TeacherQualificationController.bulkUpdateQualifications);

module.exports = router;