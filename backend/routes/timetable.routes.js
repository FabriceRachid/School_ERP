const express = require('express');
const TimetableController = require('../controllers/timetable.controller');
const { authMiddleware } = require('../middlewares/auth.middleware');

const router = express.Router();

router.use(authMiddleware);

router.post('/', ...TimetableController.create);
router.put('/:id', ...TimetableController.update);
router.delete('/:id', ...TimetableController.delete);

module.exports = router;
