const express = require('express');
const FrontendContractController = require('../controllers/frontend_contract.controller');
const { authMiddleware } = require('../middlewares/auth.middleware');

const router = express.Router();

router.post('/login', FrontendContractController.login);
router.get('/web/bootstrap', authMiddleware, FrontendContractController.bootstrapWeb);
router.get('/mobile/bootstrap', authMiddleware, FrontendContractController.bootstrapMobile);
router.put('/schools/:id', authMiddleware, FrontendContractController.updateSchool);

module.exports = router;
