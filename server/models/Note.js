const mongoose = require('mongoose')

const NoteSchema = new mongoose.Schema({

  id: {
    type: String,
    required: true,
    unique: true
  },

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  title: { type: String, default: '' },
  content: { type: String, default: '' },
  tags: [{ type: String }],
  lastModified: { type: Number, required: true },
  isDeleted: { type: Boolean, default: false },
  createdAt: { type: Number, default: Date.now }
}, {
  timestamps: false
})

NoteSchema.index({ userId: 1, lastModified: -1 })

module.exports = mongoose.model('Note', NoteSchema)
