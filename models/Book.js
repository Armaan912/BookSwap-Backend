const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  author: {
    type: String,
    required: true,
    trim: true
  },
  condition: {
    type: String,
    required: true,
    enum: ['excellent', 'good', 'fair', 'poor']
  },
  description: {
    type: String,
    trim: true
  },
  imagePath: {
    type: String
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['available', 'unavailable'],
    default: 'available'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Book', bookSchema);
