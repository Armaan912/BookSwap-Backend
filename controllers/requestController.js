const { body, validationResult } = require('express-validator');
const BookRequest = require('../models/BookRequest');
const Book = require('../models/Book');

// Create book request
const createRequest = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { book_id, message } = req.body;

    // Check if book exists and is available
    const book = await Book.findOne({ _id: book_id, status: 'available' });
    if (!book) {
      return res.status(400).json({ message: 'Book not available' });
    }

    // Check if user is not the owner
    if (book.owner.toString() === req.user.userId) {
      return res.status(400).json({ message: 'Cannot request your own book' });
    }

    // Check if request already exists
    const existingRequest = await BookRequest.findOne({
      book: book_id,
      requester: req.user.userId
    });

    if (existingRequest) {
      return res.status(400).json({ message: 'Request already exists' });
    }

    const request = new BookRequest({
      book: book_id,
      requester: req.user.userId,
      message
    });

    await request.save();
    await request.populate([
      { path: 'book', populate: { path: 'owner', select: 'name' } },
      { path: 'requester', select: 'name email' }
    ]);

    res.status(201).json({
      message: 'Request sent successfully',
      request
    });
  } catch (error) {
    console.error('Error creating request:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get received requests (for book owners)
const getReceivedRequests = async (req, res) => {
  try {
    const requests = await BookRequest.find()
      .populate({
        path: 'book',
        match: { owner: req.user.userId },
        populate: { path: 'owner', select: 'name' }
      })
      .populate('requester', 'name email')
      .sort({ createdAt: -1 });

    // Filter out requests where book is null (not owned by user)
    const filteredRequests = requests.filter(req => req.book !== null);
    
    res.json(filteredRequests);
  } catch (error) {
    console.error('Error fetching received requests:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get sent requests (for requesters)
const getSentRequests = async (req, res) => {
  try {
    const requests = await BookRequest.find({ requester: req.user.userId })
      .populate({
        path: 'book',
        populate: { path: 'owner', select: 'name email' }
      })
      .sort({ createdAt: -1 });
    
    res.json(requests);
  } catch (error) {
    console.error('Error fetching sent requests:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get single request by ID
const getRequestById = async (req, res) => {
  try {
    const request = await BookRequest.findById(req.params.id)
      .populate([
        { path: 'book', populate: { path: 'owner', select: 'name email' } },
        { path: 'requester', select: 'name email' }
      ]);

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    // Check if user is authorized to view this request
    const isOwner = request.book.owner._id.toString() === req.user.userId;
    const isRequester = request.requester._id.toString() === req.user.userId;

    if (!isOwner && !isRequester) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json(request);
  } catch (error) {
    console.error('Error fetching request:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update request status (accept/decline)
const updateRequestStatus = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { status } = req.body;

    // Check if request exists and user is the book owner
    const request = await BookRequest.findById(id).populate('book');
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    if (request.book.owner.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (request.status !== 'pending') {
      return res.status(400).json({ message: 'Request has already been processed' });
    }

    // Update request status
    request.status = status;
    await request.save();

    // If accepted, mark book as unavailable
    if (status === 'accepted') {
      await Book.findByIdAndUpdate(request.book._id, { status: 'unavailable' });
    }

    await request.populate([
      { path: 'book', populate: { path: 'owner', select: 'name email' } },
      { path: 'requester', select: 'name email' }
    ]);

    res.json({
      message: 'Request updated successfully',
      request
    });
  } catch (error) {
    console.error('Error updating request:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete request (requester can cancel their own request)
const deleteRequest = async (req, res) => {
  try {
    const request = await BookRequest.findOneAndDelete({
      _id: req.params.id,
      requester: req.user.userId,
      status: 'pending' // Only allow deletion of pending requests
    });

    if (!request) {
      return res.status(404).json({ message: 'Request not found or cannot be deleted' });
    }

    res.json({ message: 'Request cancelled successfully' });
  } catch (error) {
    console.error('Error deleting request:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Validation middleware
const validateRequest = [
  body('book_id').isMongoId().withMessage('Valid book ID is required'),
  body('message').trim().isLength({ min: 1 }).withMessage('Message is required')
];

const validateStatusUpdate = [
  body('status').isIn(['accepted', 'declined']).withMessage('Status must be either accepted or declined')
];

module.exports = {
  createRequest,
  getReceivedRequests,
  getSentRequests,
  getRequestById,
  updateRequestStatus,
  deleteRequest,
  validateRequest,
  validateStatusUpdate
};
