const User = require('../models/User');
const Internship = require('../models/Internship');
const Application = require('../models/Application');

exports.getStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalStudents = await User.countDocuments({ role: 'student' });
        const totalCompanies = await User.countDocuments({ role: 'company' });
        const totalInternships = await Internship.countDocuments();

        // Latest activity snapshots
        const recentActivity = await Application.find()
            .populate({
                path: 'student',
                select: 'name',
                populate: {
                    path: 'studentProfile',
                    select: 'firstName lastName'
                }
            })
            .populate({
                path: 'internship',
                select: 'title',
                populate: {
                    path: 'company',
                    select: 'name',
                    populate: {
                        path: 'companyProfile',
                        select: 'companyName'
                    }
                }
            })
            .sort('-createdAt')
            .limit(4);

        res.status(200).json({
            success: true,
            data: {
                totalUsers,
                totalStudents,
                totalCompanies,
                totalInternships,
                recentActivity
            }
        });
    } catch (err) {
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};


exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.status(200).json({
            success: true,
            count: users.length,
            data: users
        });
    } catch (err) {
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};


exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }

        // Prevent admin from deleting themselves (optional but recommended)
        if (user._id.toString() === req.user._id.toString()) {
            return res.status(400).json({ success: false, error: 'Admin cannot delete themselves' });
        }

        await user.deleteOne();

        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (err) {
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

exports.getAllInternships = async (req, res) => {
    try {
        const internships = await Internship.find()
            .populate({
                path: 'company',
                select: 'name email',
                populate: {
                    path: 'companyProfile',
                    select: 'companyName'
                }
            })
            .sort('-createdAt');

        res.status(200).json({
            success: true,
            count: internships.length,
            data: internships
        });
    } catch (err) {
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

exports.getReports = async (req, res) => {
    try {
        // 1. User Growth Metrics
        const totalStudents = await User.countDocuments({ role: 'student' });
        const totalCompanies = await User.countDocuments({ role: 'company' });

        // 2. Application Status Distribution
        const appStats = await Application.aggregate([
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 }
                }
            }
        ]);

        const applicationSummary = {
            total: await Application.countDocuments(),
            pending: appStats.find(a => a._id === 'pending')?.count || 0,
            shortlisted: appStats.find(a => a._id === 'shortlisted')?.count || 0,
            accepted: appStats.find(a => a._id === 'accepted')?.count || 0,
            rejected: appStats.find(a => a._id === 'rejected')?.count || 0
        };

        // 3. Internship Category Distribution
        const categoryStats = await Internship.aggregate([
            {
                $group: {
                    _id: '$category',
                    count: { $sum: 1 }
                }
            },
            { $sort: { count: -1 } },
            { $limit: 5 }
        ]);

        // 4. Recent Activity (Latest 5 applications)
        const recentApplications = await Application.find()
            .populate({
                path: 'student',
                select: 'name',
                populate: {
                    path: 'studentProfile',
                    select: 'firstName lastName'
                }
            })
            .populate({
                path: 'internship',
                select: 'title',
                populate: {
                    path: 'company',
                    select: 'name',
                    populate: {
                        path: 'companyProfile',
                        select: 'companyName'
                    }
                }
            })
            .sort('-createdAt')
            .limit(5);

        res.status(200).json({
            success: true,
            data: {
                totalInternships: await Internship.countDocuments(),
                userGrowth: {
                    students: totalStudents,
                    companies: totalCompanies
                },
                applicationSummary,
                categoryStats,
                recentActivity: recentApplications
            }
        });
    } catch (err) {
        console.error('Report Error:', err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};
