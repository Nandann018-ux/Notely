const mongoose = require('mongoose');

const FolderSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});

// Ensure a user cannot have two folders with the same name
FolderSchema.index({ user: 1, name: 1 }, { unique: true });

module.exports = mongoose.model('Folder', FolderSchema);
