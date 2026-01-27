const StudentProfile = require('../models/StudentProfile');
const CompanyProfile = require('../models/CompanyProfile');
const User = require('../models/User');


exports.getProfile = async (req, res) => {
    try {
        let profile;
        if (req.user.role === 'student') {
            profile = await StudentProfile.findOne({ user: req.user.id });
        } else if (req.user.role === 'company') {
            profile = await CompanyProfile.findOne({ user: req.user.id });
        }

        if (!profile) {
            return res.status(404).json({
                success: false,
                error: 'Profile not found'
            });
        }

        res.status(200).json({
            success: true,
            data: profile
        });
    } catch (err) {
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};


exports.updateProfile = async (req, res) => {
    try {
        const profileFields = {
            user: req.user.id,
            ...req.body,
            isProfileComplete: true 
            // Assuming frontend only calls this when all required fields are present
        };

        let profile;
        if (req.user.role === 'student') {
            profile = await StudentProfile.findOneAndUpdate(
                { user: req.user.id },
                { $set: profileFields },
                { new: true, upsert: true, runValidators: true }
            );
        } else if (req.user.role === 'company') {
            profile = await CompanyProfile.findOneAndUpdate(
                { user: req.user.id },
                { $set: profileFields },
                { new: true, upsert: true, runValidators: true }
            );
        }

        res.status(200).json({
            success: true,
            data: profile
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};
