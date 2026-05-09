 
const mongoose = require('mongoose')

const componentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  prompt: {
    type: String,
    required: true
  },
  framework: {
    type: String,
    required: true
  },
  code: {
    type: String,
    required: true
  },
  isPublic: {
    type: Boolean,
    default: false
  },
  isFavorite: {
    type: Boolean,
    default: false
  },
  shareId: {
    type: String,
    unique: true,
    sparse: true
  },
  forkCount: {
    type: Number,
    default: 0
  },
  forkedFrom: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Component',
    default: null
  }
}, { timestamps: true })

module.exports = mongoose.model('Component', componentSchema)