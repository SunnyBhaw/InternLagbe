const mongoose = require('mongoose');

const InternshipSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        maxlength: [100, 'Title cannot be more than 100 characters']
    },
    description: {
        type: String,
        required: true
    },
    company: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    location: {
        type: String,
        required: true
    },
    duration: {
        type: String,
        required: true
    },
    stipend: {
        type: String,
        default: 'Negotiable'
    },
    category: {
        type: String,
        required: true,
        enum: [
            'Software Development',
            'Web Development',
            'Mobile App Development',
            'UI/UX Design',
            'Data Science',
            'Digital Marketing',
            'Business Development',
            'Content Writing',
            'Graphic Design',
            'Other'
        ]
    },
    skills: {
        type: [String]
    },
    status: {
        type: String,
        enum: ['active', 'closed'],
        default: 'active'
    },
    deadline: {
        type: Date,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Internship', InternshipSchema);
