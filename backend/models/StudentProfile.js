const mongoose = require('mongoose');

const StudentProfileSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    bio: {
        type: String,
        trim: true
    },
    skills: {
        type: [String],
        default: []
    },
    education: [
        {
            institution: String,
            degree: String,
            fieldOfStudy: String,
            from: Date,
            to: Date,
            current: Boolean
        }
    ],
    resume: {
        type: String // File path
    },
    isProfileComplete: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('StudentProfile', StudentProfileSchema);
