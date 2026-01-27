const Internship = require('../models/Internship');
const Application = require('../models/Application');


exports.createInternship = async (req, res) => {
    try {
        // Add user to req.body
        req.body.company = req.user.id;

        const internship = await Internship.create(req.body);

        res.status(201).json({
            success: true,
            data: internship
        });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};


exports.getMyInternships = async (req, res) => {
    try {
        const internships = await Internship.find({ company: req.user.id });

        res.status(200).json({
            success: true,
            count: internships.length,
            data: internships
        });
    } catch (err) {
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};


exports.updateInternship = async (req, res) => {
    try {
        let internship = await Internship.findById(req.params.id);

        if (!internship) {
            return res.status(404).json({ success: false, error: 'Internship not found' });
        }

        // Make sure user is internship owner
        if (internship.company.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ success: false, error: 'Not authorized to update this internship' });
        }

        internship = await Internship.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            success: true,
            data: internship
        });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};


exports.deleteInternship = async (req, res) => {
    try {
        const internship = await Internship.findById(req.params.id);

        if (!internship) {
            return res.status(404).json({ success: false, error: 'Internship not found' });
        }

        // Make sure user is internship owner
        if (internship.company.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ success: false, error: 'Not authorized to delete this internship' });
        }

        await internship.deleteOne();

        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (err) {
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};


exports.getInternships = async (req, res) => {
    try {
        const internships = await Internship.find({ 
            status: 'active',
            deadline: { $gt: new Date() } 
        }).populate({
            path: 'company',
            select: 'name email',
            populate: {
                path: 'companyProfile',
                select: 'companyName'
            }
        });

        res.status(200).json({
            success: true,
            count: internships.length,
            data: internships
        });
    } catch (err) {
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};


exports.getInternship = async (req, res) => {
    try {
        const internship = await Internship.findById(req.params.id).populate({
            path: 'company',
            select: 'name email',
            populate: {
                path: 'companyProfile',
                select: 'companyName'
            }
        });

        if (!internship) {
            return res.status(404).json({ success: false, error: 'Internship not found' });
        }

        res.status(200).json({
            success: true,
            data: internship
        });
    } catch (err) {
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};


exports.getCompanyStats = async (req, res) => {
    try {
        // 1. Get Active Postings
        const activePostings = await Internship.countDocuments({ 
            company: req.user.id,
            status: 'active' 
        });

        // 2. Get all internship IDs for this company
        const companyInternships = await Internship.find({ company: req.user.id });
        const internshipIds = companyInternships.map(i => i._id.toString());

        // 3. Get Total Applications for these internships
        const totalApplications = await Application.countDocuments({
            internship: { $in: internshipIds }
        });

        // 4. Get Shortlisted Applications
        const shortlisted = await Application.countDocuments({
            internship: { $in: internshipIds },
            status: 'shortlisted'
        });

        res.status(200).json({
            success: true,
            data: {
                activePostings,
                totalApplications,
                shortlisted
            }
        });
    } catch (err) {
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};
