import {
    AlertCircle,
    Briefcase,
    Building2,
    Calendar,
    CheckCircle2,
    ChevronLeft,
    Clock,
    FileText,
    Loader2,
    MapPin,
    Send,
    X
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import StudentSidebar from '../components/StudentSidebar';
import api from '../utils/api';

const InternshipDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [internship, setInternship] = useState(null);
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState(null);
    const [showApplyModal, setShowApplyModal] = useState(false);
    
    // Application form state
    const [message, setMessage] = useState('');
    const [resume, setResume] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [userRes, internshipRes, profileRes] = await Promise.all([
                    api.get('/auth/me'),
                    api.get(`/internships/${id}`),
                    api.get('/profile/me').catch(() => ({ data: { data: null } }))
                ]);
                setUser(userRes.data.data);
                setInternship(internshipRes.data.data);
                setProfile(profileRes.data.data);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching data:', err);
                setError('Failed to load internship details');
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    const handleFileChange = (e) => {
        setResume(e.target.files[0]);
    };

    const handleApply = async (e) => {
        e.preventDefault();
        if (!resume) {
            setError('Please upload your resume');
            return;
        }

        setSubmitting(true);
        setError('');

        const formData = new FormData();
        formData.append('resume', resume);
        formData.append('message', message);

        try {
            await api.post(`/applications/apply/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            setSuccess(true);
            setSubmitting(false);
            setTimeout(() => {
                setShowApplyModal(false);
                navigate('/student/applications');
            }, 2000);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to submit application');
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-bg-primary">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!internship && !loading) {
        return (
            <div className="flex h-screen flex-col items-center justify-center bg-bg-primary">
                <h2 className="text-2xl font-black mb-4">Internship not found</h2>
                <Link to="/student/browse" className="text-primary font-bold hover:underline">Go back to marketplace</Link>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-bg-primary overflow-hidden font-sans text-text-primary">
            <StudentSidebar user={user} />
            
            <main className="flex-1 overflow-y-auto px-10 py-8 relative">
                <div className="max-w-5xl mx-auto">
                    {/* Back Button */}
                    <Link 
                        to="/student/browse" 
                        className="inline-flex items-center text-text-tertiary hover:text-primary transition-colors font-bold text-sm mb-8 group"
                    >
                        <ChevronLeft size={18} className="mr-1 group-hover:-translate-x-1 transition-transform" />
                        Back to Marketplace
                    </Link>
                    {/* Hero Header */}
                    <div className="bg-bg-primary p-10 rounded-[2.5rem] border border-border-light shadow-xl shadow-primary/5 mb-10 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-bl-[8rem] -mr-20 -mt-20 group-hover:scale-110 transition-transform duration-700"></div>
                        
                        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                            <div className="flex items-center gap-6">
                                <div className="h-20 w-20 rounded-3xl bg-primary/10 flex items-center justify-center text-primary border border-primary/5 shadow-inner">
                                    <Building2 size={40} />
                                </div>
                                <div>
                                    <h1 className="text-4xl font-black tracking-tight mb-2 leading-tight">{internship.title}</h1>
                                    <p className="text-primary font-black flex items-center text-lg">
                                        <Building2 size={18} className="mr-2 opacity-70" />
                                        {internship.company?.companyProfile?.companyName || internship.company?.name}
                                    </p>
                                </div>
                            </div>
                            
                            {/* Dynamic Status Badge */}
                            <div className="flex flex-col items-end gap-3">
                                {new Date(internship.deadline) < new Date() ? (
                                    <span className="bg-red-500/10 text-red-600 text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full border border-red-500/10">
                                        Closed
                                    </span>
                                ) : (
                                    <span className="bg-green-500/10 text-green-600 text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full border border-green-500/10">
                                        Active
                                    </span>
                                )}

                                <button 
                                    disabled={!profile?.isProfileComplete || new Date(internship.deadline) < new Date()}
                                    onClick={() => setShowApplyModal(true)}
                                    className={`px-10 py-4 rounded-2xl font-black text-lg transition-all shadow-lg flex items-center justify-center gap-3 ${
                                        profile?.isProfileComplete && new Date(internship.deadline) > new Date()
                                        ? 'bg-primary text-text-inverse hover:bg-primary-light hover:shadow-primary/30 active:scale-95' 
                                        : 'bg-bg-tertiary text-text-tertiary cursor-not-allowed border border-border-light shadow-none'
                                    }`}
                                >
                                    <Send size={20} strokeWidth={2.5} />
                                    {new Date(internship.deadline) < new Date() 
                                        ? 'Deadline Passed' 
                                        : (profile?.isProfileComplete ? 'Apply Now' : 'Profile Incomplete')}
                                </button>
                                {!profile?.isProfileComplete && new Date(internship.deadline) > new Date() && (
                                    <p className="text-[10px] font-black text-primary uppercase tracking-widest animate-pulse">
                                        Complete profile to unlock applications
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Quick Stats Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12 relative z-10">
                            {[
                                { icon: MapPin, label: "Location", value: internship.location },
                                { icon: Clock, label: "Duration", value: internship.duration },
                                { icon: Calendar, label: "Apply By", value: new Date(internship.deadline).toLocaleDateString() },
                                { icon: Briefcase, label: "Stipend", value: `tk ${internship.stipend}` }
                            ].map((stat, i) => (
                                <div key={i} className="flex flex-col">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-text-tertiary mb-1 flex items-center">
                                        <stat.icon size={12} className="mr-1.5" />
                                        {stat.label}
                                    </span>
                                    <span className="font-bold text-text-secondary">{stat.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Content Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                        {/* Description */}
                        <div className="lg:col-span-2 space-y-10">
                            <section>
                                <h2 className="text-2xl font-black mb-6 flex items-center">
                                    <div className="h-8 w-1.5 bg-primary rounded-full mr-4"></div>
                                    About the Internship
                                </h2>
                                <div className="bg-bg-tertiary/50 p-8 rounded-3xl border border-border-light text-text-secondary leading-relaxed font-bold whitespace-pre-wrap">
                                    {internship.description}
                                </div>
                            </section>

                            <section>
                                <h2 className="text-2xl font-black mb-6 flex items-center">
                                    <div className="h-8 w-1.5 bg-primary rounded-full mr-4"></div>
                                    Skills Required
                                </h2>
                                <div className="flex flex-wrap gap-3">
                                    {internship.skills?.map((skill, i) => (
                                        <span key={i} className="bg-primary/5 text-primary px-5 py-2 rounded-xl font-bold text-sm border border-primary/10 hover:bg-primary hover:text-text-inverse transition-all cursor-default">
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </section>
                        </div>

                        {/* Sidebar Info */}
                        <div className="space-y-6">
                            <div className="bg-bg-primary p-8 rounded-3xl border border-border-light shadow-sm">
                                <h3 className="text-lg font-black mb-6">Company Info</h3>
                                <div className="space-y-4">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-text-tertiary mb-1">Company Name</span>
                                        <span className="font-bold text-primary">{internship.company?.companyProfile?.companyName || internship.company?.name}</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-text-tertiary mb-1">Category</span>
                                        <span className="font-bold text-text-secondary">{internship.category}</span>
                                    </div>
                                    <div className="flex flex-col pt-4 border-t border-border-light">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-text-tertiary mb-1">Company Contact</span>
                                        <span className="font-bold text-xs truncate text-text-tertiary">{internship.company?.email}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-primary/5 p-8 rounded-3xl border border-primary/10">
                                <h3 className="text-lg font-black text-primary mb-2">Safety Note</h3>
                                <p className="text-xs font-bold text-primary/70 leading-relaxed">
                                    InternLagbe verifies all companies, but we recommend you never share sensitive personal details or pay any fees for internships.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Apply Modal */}
                {showApplyModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <div className="absolute inset-0 bg-primary/20 backdrop-blur-sm" onClick={() => setShowApplyModal(false)}></div>
                        
                        <div className="bg-bg-primary w-full max-w-xl rounded-[2.5rem] shadow-2xl relative z-10 overflow-hidden animate-in fade-in zoom-in duration-300 border border-border-light">
                            <div className="p-8 border-b border-border-light flex items-center justify-between bg-bg-tertiary/30">
                                <div>
                                    <h2 className="text-2xl font-black tracking-tight">Apply for Internship</h2>
                                    <p className="text-xs text-text-tertiary font-bold uppercase tracking-widest mt-1">{internship.title}</p>
                                </div>
                                <button onClick={() => setShowApplyModal(false)} className="h-10 w-10 flex items-center justify-center rounded-xl bg-bg-primary border border-border-light hover:bg-red-50 hover:text-red-500 transition-all">
                                    <X size={20} />
                                </button>
                            </div>

                            <form onSubmit={handleApply} className="p-8 space-y-8">
                                {error && (
                                    <div className="bg-red-50 border border-red-200 text-red-600 px-6 py-4 rounded-2xl text-sm font-bold flex items-center animate-shake">
                                        <AlertCircle size={18} className="mr-3 shrink-0" />
                                        {error}
                                    </div>
                                )}

                                {success ? (
                                    <div className="py-10 text-center space-y-4">
                                        <div className="h-20 w-20 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                                            <CheckCircle2 size={48} />
                                        </div>
                                        <h3 className="text-2xl font-black text-green-500">Application Submitted!</h3>
                                        <p className="text-text-tertiary font-bold">Redirecting you to your applications tracker...</p>
                                    </div>
                                ) : (
                                    <>
                                        <div>
                                            <label className="block text-[10px] font-black text-text-tertiary uppercase tracking-widest mb-3 ml-1">Upload Resume (PDF, DOCX)</label>
                                            <div className="relative group">
                                                <input 
                                                    type="file" 
                                                    accept=".pdf,.doc,.docx"
                                                    onChange={handleFileChange}
                                                    className="hidden" 
                                                    id="resume-upload"
                                                />
                                                <label 
                                                    htmlFor="resume-upload"
                                                    className={`w-full flex flex-col items-center justify-center py-10 border-2 border-dashed rounded-[2rem] transition-all cursor-pointer ${
                                                        resume 
                                                        ? 'bg-green-50/30 border-green-200' 
                                                        : 'bg-bg-tertiary border-border-medium hover:border-primary hover:bg-primary/5'
                                                    }`}
                                                >
                                                    {resume ? (
                                                        <>
                                                            <div className="h-12 w-12 bg-green-500/10 text-green-500 rounded-2xl flex items-center justify-center mb-3">
                                                                <FileText size={28} />
                                                            </div>
                                                            <span className="font-black text-green-600 text-sm">{resume.name}</span>
                                                            <span className="text-[10px] text-green-600/60 font-bold mt-1">Click to change file</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <div className="h-12 w-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                                                <FileText size={28} />
                                                            </div>
                                                            <span className="font-black text-text-secondary text-sm">Select PDF or Word Document</span>
                                                            <span className="text-[10px] text-text-tertiary font-bold mt-1 uppercase tracking-tighter">Max file size: 5MB</span>
                                                        </>
                                                    )}
                                                </label>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-[10px] font-black text-text-tertiary uppercase tracking-widest mb-3 ml-1">Message to Employer (Optional)</label>
                                            <textarea 
                                                className="w-full p-6 bg-bg-tertiary border border-border-medium rounded-[2rem] focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-bold min-h-[150px] placeholder:text-text-tertiary/50"
                                                placeholder="Briefly explain why you're a good fit..."
                                                value={message}
                                                onChange={(e) => setMessage(e.target.value)}
                                            ></textarea>
                                        </div>

                                        <button 
                                            type="submit"
                                            disabled={submitting}
                                            className="w-full bg-primary text-text-inverse py-5 rounded-[2rem] font-black text-xl hover:bg-primary-light transition-all shadow-xl hover:shadow-primary/30 active:scale-95 flex items-center justify-center gap-3 disabled:opacity-70 disabled:active:scale-100"
                                        >
                                            {submitting ? (
                                                <Loader2 size={24} className="animate-spin" />
                                            ) : (
                                                <>
                                                    <Send size={24} strokeWidth={2.5} />
                                                    Submit Application
                                                </>
                                            )}
                                        </button>
                                    </>
                                )}
                            </form>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default InternshipDetail;
