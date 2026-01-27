const Application = require('../models/Application');
const Internship = require('../models/Internship');


exports.applyForInternship = async (req, res) => {
    try {
        const internship = await Internship.findById(req.params.internshipId);

        if (!internship) {
            return res.status(404).json({ success: false, error: 'Internship not found' });
        }

        // Check if internship is active and deadline has not passed
        const isExpired = new Date(internship.deadline) < new Date();
        if (internship.status !== 'active' || isExpired) {
            return res.status(400).json({ 
                success: false, 
                error: isExpired ? 'This internship deadline has passed' : 'This internship is no longer accepting applications' 
            });
        }

        // Check for existing application
        const existingApplication = await Application.findOne({
            internship: req.params.internshipId,
            student: req.user.id
        });

        if (existingApplication) {
            return res.status(400).json({ success: false, error: 'You have already applied for this internship' });
        }

        // Check if file was uploaded
        if (!req.file) {
            return res.status(400).json({ success: false, error: 'Please upload a resume' });
        }

        const application = await Application.create({
            internship: req.params.internshipId,
            student: req.user.id,
            resume: req.file.path,
            message: req.body.message
        });

        res.status(201).json({
            success: true,
            data: application
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};


exports.getStudentApplications = async (req, res) => {
    try {
        const applications = await Application.find({ student: req.user.id })
            .populate({
                path: 'internship',
                select: 'title company location duration status',
                populate: {
                    path: 'company',
                    select: 'name',
                    populate: {
                        path: 'companyProfile',
                        select: 'companyName'
                    }
                }
            })
            .sort('-createdAt');

        res.status(200).json({
            success: true,
            count: applications.length,
            data: applications
        });
    } catch (err) {
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};


exports.getCompanyApplications = async (req, res) => {
    try {
        // Find internships owned by the company
        const internships = await Internship.find({ company: req.user.id });
        const internshipIds = internships.map(ins => ins._id);

        const applications = await Application.find({ internship: { $in: internshipIds } })
            .populate({
                path: 'internship',
                select: 'title'
            })
            .populate({
                path: 'student',
                select: 'name email',
                populate: {
                    path: 'studentProfile',
                    select: 'firstName lastName'
                }
            })
            .sort('-createdAt');

        res.status(200).json({
            success: true,
            count: applications.length,
            data: applications
        });
    } catch (err) {
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};


exports.updateApplicationStatus = async (req, res) => {
    try {
        let application = await Application.findById(req.params.id).populate('internship');

        if (!application) {
            return res.status(404).json({ success: false, error: 'Application not found' });
        }

        // Check if the company owns the internship
        if (application.internship.company.toString() !== req.user.id) {
            return res.status(401).json({ success: false, error: 'Not authorized to update this application' });
        }

        const { status } = req.body;
        if (!['pending', 'shortlisted', 'rejected', 'accepted'].includes(status)) {
            return res.status(400).json({ success: false, error: 'Invalid status' });
        }

        application.status = status;
        await application.save();

        res.status(200).json({
            success: true,
            data: application
        });
    } catch (err) {
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

exports.uploadFile = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, error: 'Please upload a file' });
        }

        res.status(200).json({
            success: true,
            filePath: req.file.path
        });
    } catch (err) {
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};
