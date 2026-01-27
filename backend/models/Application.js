const mongoose = require('mongoose');

const ApplicationSchema = new mongoose.Schema({
    internship: {
        type: mongoose.Schema.ObjectId,
        ref: 'Internship',
        required: true
    },
    student: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'shortlisted', 'rejected', 'accepted'],
        default: 'pending'
    },
    resume: {
        type: String,
        required: true
    },
    message: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Prevent student from applying for the same internship twice
ApplicationSchema.index({ internship: 1, student: 1 }, { unique: true });

module.exports = mongoose.model('Application', ApplicationSchema);
