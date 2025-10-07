const { body, validationResult } = require('express-validator');
const Book = require('../models/Book');

// Get all available books
const getAllBooks = async (req, res) => {
  try {
    const books = await Book.find({ status: 'available' })
      .populate('owner', 'name')
      .sort({ createdAt: -1 });
    
    res.json(books);
  } catch (error) {
    console.error('Error fetching books:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get single book by ID
const getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id)
      .populate('owner', 'name email');
    
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    
    res.json(book);
  } catch (error) {
    console.error('Error fetching book:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create new book
const createBook = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, author, condition, description } = req.body;
    const imagePath = req.file ? req.file.filename : null;

    const book = new Book({
      title,
      author,
      condition,
      description,
      imagePath,
      owner: req.user.userId
    });

    await book.save();
    await book.populate('owner', 'name');

    res.status(201).json({
      message: 'Book posted successfully',
      book
    });
  } catch (error) {
    console.error('Error posting book:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get user's books
const getUserBooks = async (req, res) => {
  try {
    const books = await Book.find({ owner: req.user.userId })
      .sort({ createdAt: -1 });
    
    res.json(books);
  } catch (error) {
    console.error('Error fetching user books:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update book
const updateBook = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, author, condition, description } = req.body;
    const imagePath = req.file ? req.file.filename : undefined;

    const updateData = { title, author, condition, description };
    if (imagePath) {
      updateData.imagePath = imagePath;
    }

    const book = await Book.findOneAndUpdate(
      { _id: req.params.id, owner: req.user.userId },
      updateData,
      { new: true }
    );

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    await book.populate('owner', 'name');

    res.json({
      message: 'Book updated successfully',
      book
    });
  } catch (error) {
    console.error('Error updating book:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete book
const deleteBook = async (req, res) => {
  try {
    const book = await Book.findOneAndDelete({ 
      _id: req.params.id, 
      owner: req.user.userId 
    });

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    res.json({ message: 'Book deleted successfully' });
  } catch (error) {
    console.error('Error deleting book:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Search books
const searchBooks = async (req, res) => {
  try {
    const { title, author, condition } = req.query;
    let query = { status: 'available' };

    if (title) {
      query.title = { $regex: title, $options: 'i' };
    }
    if (author) {
      query.author = { $regex: author, $options: 'i' };
    }
    if (condition) {
      query.condition = condition;
    }

    const books = await Book.find(query)
      .populate('owner', 'name')
      .sort({ createdAt: -1 });

    res.json(books);
  } catch (error) {
    console.error('Error searching books:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Validation middleware
const validateBook = [
  body('title').trim().isLength({ min: 1 }).withMessage('Title is required'),
  body('author').trim().isLength({ min: 1 }).withMessage('Author is required'),
  body('condition').isIn(['excellent', 'good', 'fair', 'poor']).withMessage('Invalid condition'),
  body('description').optional().trim()
];

module.exports = {
  getAllBooks,
  getBookById,
  createBook,
  getUserBooks,
  updateBook,
  deleteBook,
  searchBooks,
  validateBook
};
