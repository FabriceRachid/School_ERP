const express = require('express');
const CompositionController = require('../controllers/composition.controller');
const { authMiddleware } = require('../middlewares/auth.middleware');

const router = express.Router();
router.use(authMiddleware);

router.post('/', ...CompositionController.create);
router.get('/', ...CompositionController.list);
router.put('/:id', ...CompositionController.update);
router.post('/:id/uploads', ...CompositionController.upload);
router.get('/:id/uploads', ...CompositionController.getUploads);

module.exports = router;
