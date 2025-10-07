const express = require('express');
const router = express.Router();
const requestController = require('../controllers/requestController');
const { authenticateToken } = require('../middleware/auth');

// All routes require authentication
router.post('/', authenticateToken, requestController.validateRequest, requestController.createRequest);
router.get('/received', authenticateToken, requestController.getReceivedRequests);
router.get('/sent', authenticateToken, requestController.getSentRequests);
router.get('/:id', authenticateToken, requestController.getRequestById);
router.put('/:id', authenticateToken, requestController.validateStatusUpdate, requestController.updateRequestStatus);
router.delete('/:id', authenticateToken, requestController.deleteRequest);

module.exports = router;
