const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');
const { authenticateToken, optionalAuth } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Public routes
router.get('/', optionalAuth, bookController.getAllBooks);
router.get('/search', optionalAuth, bookController.searchBooks);
router.get('/:id', optionalAuth, bookController.getBookById);

// Protected routes
router.post('/', authenticateToken, upload.single('image'), bookController.validateBook, bookController.createBook);
router.get('/my/books', authenticateToken, bookController.getUserBooks);
router.put('/:id', authenticateToken, upload.single('image'), bookController.validateBook, bookController.updateBook);
router.delete('/:id', authenticateToken, bookController.deleteBook);

module.exports = router;
