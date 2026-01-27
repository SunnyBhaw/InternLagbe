const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect routes
exports.protect = async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        // Set token from Bearer token in header
        token = req.headers.authorization.split(' ')[1];
    }

    // Make sure token exists
    if (!token) {
        return res.status(401).json({ success: false, error: 'Not authorized to access this route' });
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = await User.findById(decoded.id);

        if (!req.user) {
            return res.status(401).json({ success: false, error: 'User not found' });
        }

        next();
    } catch (err) {
        return res.status(401).json({ success: false, error: 'Not authorized to access this route' });
    }
};

// Grant access to specific roles
exports.authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                error: `User role ${req.user.role} is not authorized to access this route`
            });
        }
        next();
    };
};


exports.verifyProfile = async (req, res, next) => {
    try {
        let profile;
        if (req.user.role === 'student') {
            const StudentProfile = require('../models/StudentProfile');
            profile = await StudentProfile.findOne({ user: req.user.id });
        } else if (req.user.role === 'company') {
            const CompanyProfile = require('../models/CompanyProfile');
            profile = await CompanyProfile.findOne({ user: req.user.id });
        }

        if (!profile || !profile.isProfileComplete) {
            return res.status(403).json({
                success: false,
                error: 'Please complete your profile to perform this action'
            });
        }

        next();
    } catch (err) {
        return res.status(500).json({ success: false, error: 'Server Error' });
    }
};
