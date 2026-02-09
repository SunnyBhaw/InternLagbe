import {
    AlertCircle,
    BookOpen,
    Camera,
    Check,
    Edit3,
    ExternalLink,
    FileText,
    Loader2,
    Mail,
    Plus,
    Save,
    Trash2,
    User as UserIcon,
    X
} from 'lucide-react';
import { useEffect, useState } from 'react';
import MobileHeader from '../components/MobileHeader';
import StudentSidebar from '../components/StudentSidebar';
import api from '../utils/api';

const StudentProfile = () => {
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        bio: '',
        skills: [],
        education: []
    });

    // Local state for adding items
    const [currentSkill, setCurrentSkill] = useState('');
    const [currentEdu, setCurrentEdu] = useState({
        institution: '',
        degree: '',
        fieldOfStudy: '',
        from: '',
        to: '',
        current: false
    });
    const [resumeFile, setResumeFile] = useState(null);

    useEffect(() => {
        fetchProfileData();
    }, []);

    const fetchProfileData = async () => {
        try {
            const [userRes, profileRes] = await Promise.all([
                api.get('/auth/me'),
                api.get('/profile/me').catch(() => ({ data: { data: null } }))
            ]);
            setUser(userRes.data.data);
            const profileData = profileRes.data.data;
            setProfile(profileData);
            
            if (profileData) {
                setFormData({
                    firstName: profileData.firstName || '',
                    lastName: profileData.lastName || '',
                    bio: profileData.bio || '',
                    skills: profileData.skills || [],
                    education: profileData.education || []
                });
            }
            setLoading(false);
        } catch (err) {
            console.error('Error fetching profile:', err);
            setLoading(false);
        }
    };

    const handleAddSkill = (e) => {
        if (e.key === 'Enter' && currentSkill.trim()) {
            e.preventDefault();
            if (!formData.skills.includes(currentSkill.trim())) {
                setFormData({ ...formData, skills: [...formData.skills, currentSkill.trim()] });
            }
            setCurrentSkill('');
        }
    };

    const removeSkill = (skillToRemove) => {
        setFormData({ ...formData, skills: formData.skills.filter(s => s !== skillToRemove) });
    };

    const handleAddEdu = () => {
        if (currentEdu.institution && currentEdu.degree) {
            setFormData({ ...formData, education: [...formData.education, currentEdu] });
            setCurrentEdu({ institution: '', degree: '', fieldOfStudy: '', from: '', to: '', current: false });
        }
    };

    const removeEdu = (index) => {
        setFormData({ ...formData, education: formData.education.filter((_, i) => i !== index) });
    };

    const handleSave = async () => {
        setLoading(true);
        setError('');
        setSuccess('');
        try {
            let resumePath = profile?.resume || '';
            
            if (resumeFile) {
                const resumeFormData = new FormData();
                resumeFormData.append('resume', resumeFile);
                const uploadRes = await api.post('/applications/upload', resumeFormData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                resumePath = uploadRes.data.filePath;
            }

            const res = await api.post('/profile', {
                ...formData,
                resume: resumePath
            });

            setProfile(res.data.data);
            setIsEditing(false);
            setSuccess('Profile updated successfully!');
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    if (loading && !profile && !user) {
        return (
            <div className="flex h-screen items-center justify-center bg-bg-primary">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="flex flex-col lg:flex-row h-screen bg-bg-primary overflow-hidden font-sans text-text-primary">
            <StudentSidebar user={user} isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
            
            <div className="flex-1 flex flex-col overflow-hidden">
                <MobileHeader isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} role="student" />
                
                <main className="flex-1 overflow-y-auto p-4 md:p-10 custom-scrollbar">
                    <div className="max-w-6xl mx-auto">
                        {/* Header */}
                        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 md:mb-10 gap-6">
                            <div>
                                <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-2">My Profile</h1>
                                <p className="text-text-tertiary font-bold tracking-wide uppercase text-[10px] md:text-xs">
                                    Manage your professional identity
                                </p>
                            </div>
                            <button 
                                onClick={() => setIsEditing(!isEditing)}
                                className={`flex items-center justify-center gap-3 px-6 md:px-8 py-3.5 rounded-2xl font-black transition-all shadow-lg active:scale-95 ${
                                    isEditing 
                                    ? 'bg-bg-tertiary text-primary border border-primary/20' 
                                    : 'bg-primary text-text-inverse'
                                }`}
                            >
                                {isEditing ? (
                                    <><X size={18} /> Cancel</>
                                ) : (
                                    <><Edit3 size={18} /> Edit Profile</>
                                )}
                            </button>
                        </div>

                        {success && (
                            <div className="mb-6 md:mb-8 p-4 bg-green-50 border border-green-200 text-green-600 rounded-2xl font-bold flex items-center gap-3 animate-in fade-in slide-in-from-top-4">
                                <Check size={20} /> {success}
                            </div>
                        )}

                        {error && (
                            <div className="mb-6 md:mb-8 p-4 bg-red-50 border border-red-200 text-red-600 rounded-2xl font-bold flex items-center gap-3 animate-shake">
                                <AlertCircle size={20} /> {error}
                            </div>
                        )}

                        {!isEditing ? (
                            /* View Mode */
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-10">
                                {/* Left Column: Avatar & Basic Info */}
                                <div className="space-y-6 md:space-y-8">
                                    <div className="bg-bg-primary p-6 md:p-8 rounded-[2rem] border border-border-light shadow-xl shadow-primary/5 relative overflow-hidden group">
                                        <div className="absolute top-0 right-0 w-24 md:32 h-24 md:32 bg-primary/5 rounded-bl-[4rem] -mr-8 -mt-8"></div>
                                        <div className="relative z-10 flex flex-col items-center">
                                            <div className="h-24 w-24 md:h-32 md:w-32 rounded-[2rem] md:rounded-[2.5rem] bg-secondary flex items-center justify-center text-primary font-black text-4xl md:text-5xl border-4 border-bg-primary shadow-xl mb-4 md:6">
                                                {profile?.firstName?.[0] || user?.name?.[0] || 'S'}
                                            </div>
                                            <h2 className="text-xl md:text-2xl font-black text-center mb-1">
                                                {profile?.firstName ? `${profile.firstName} ${profile.lastName}` : user?.name}
                                            </h2>
                                            <p className="text-text-tertiary font-bold text-xs md:text-sm mb-6 flex items-center gap-2">
                                                <Mail size={14} className="opacity-60" /> {user?.email}
                                            </p>
                                            
                                            <div className="w-full pt-6 border-t border-border-light space-y-4">
                                                {profile?.resume && (
                                                    <a 
                                                        href={`http://localhost:5000/${profile.resume}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="flex items-center justify-between w-full p-4 bg-primary/5 text-primary rounded-xl md:rounded-2xl font-black text-[10px] md:text-xs hover:bg-primary/10 transition-all border border-primary/10"
                                                    >
                                                        <span className="flex items-center gap-2">
                                                            <FileText size={16} /> My Resume
                                                        </span>
                                                        <ExternalLink size={14} />
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-bg-primary p-6 md:p-8 rounded-[2rem] border border-border-light shadow-sm">
                                        <h3 className="text-[10px] md:text-sm font-black uppercase tracking-widest text-text-tertiary mb-4 md:6 flex items-center gap-2">
                                            <Plus size={16} className="text-primary" /> Expertise
                                        </h3>
                                        <div className="flex flex-wrap gap-2">
                                            {profile?.skills?.length > 0 ? (
                                                profile.skills.map((skill, i) => (
                                                    <span key={i} className="px-3 md:px-4 py-1.5 md:py-2 bg-bg-tertiary text-primary rounded-lg md:rounded-xl font-bold text-[10px] md:text-xs border border-border-light">
                                                        {skill}
                                                    </span>
                                                ))
                                            ) : (
                                                <p className="text-[10px] md:text-xs text-text-tertiary font-medium">No skills listed.</p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Right Column: Bio & Education */}
                                <div className="lg:col-span-2 space-y-6 md:space-y-8">
                                    <div className="bg-bg-primary p-6 md:p-10 rounded-[2rem] md:rounded-[2.5rem] border border-border-light shadow-sm">
                                        <h3 className="text-lg font-black mb-4 md:6 flex items-center gap-3">
                                            <div className="h-6 md:h-8 w-1.5 bg-primary rounded-full"></div>
                                            Bio
                                        </h3>
                                        <div className="text-text-secondary leading-relaxed font-bold italic text-base md:text-lg bg-bg-tertiary/30 p-6 md:p-8 rounded-2xl md:rounded-3xl border border-border-light">
                                            {profile?.bio || "Tell the world about your journey..."}
                                        </div>
                                    </div>

                                    <div className="bg-bg-primary p-6 md:p-10 rounded-[2rem] md:rounded-[2.5rem] border border-border-light shadow-sm">
                                        <h3 className="text-lg font-black mb-6 md:8 flex items-center gap-3">
                                            <div className="h-6 md:h-8 w-1.5 bg-primary rounded-full"></div>
                                            Education
                                        </h3>
                                        <div className="space-y-6 relative">
                                            {profile?.education?.length > 0 && (
                                                <div className="absolute left-[1.15rem] top-3 bottom-3 w-0.5 bg-border-light hidden md:block"></div>
                                            )}
                                            
                                            {profile?.education?.length > 0 ? (
                                                profile.education.map((edu, idx) => (
                                                    <div key={idx} className="relative z-10 flex flex-col md:flex-row gap-4 md:gap-6 md:pl-1">
                                                        <div className="h-10 w-10 shrink-0 rounded-xl bg-bg-secondary flex items-center justify-center text-primary border border-border-light shadow-sm">
                                                            <BookOpen size={20} />
                                                        </div>
                                                        <div className="pt-1">
                                                            <h4 className="font-black text-lg md:text-xl text-primary">{edu.institution}</h4>
                                                            <p className="font-bold text-text-secondary text-sm md:text-base">{edu.degree} in {edu.fieldOfStudy}</p>
                                                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-text-tertiary mt-2">
                                                                {new Date(edu.from).getFullYear()} — {edu.current ? 'Present' : (edu.to ? new Date(edu.to).getFullYear() : 'N/A')}
                                                            </p>
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                <p className="text-sm text-text-tertiary font-bold ml-2 md:ml-4">Experience history is empty.</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            /* Edit Mode */
                            <div className="bg-bg-primary rounded-[2rem] md:rounded-[3rem] border border-border-light shadow-2xl p-6 md:p-14 relative overflow-hidden group">
                                <div className="space-y-10 md:space-y-12">
                                    {/* Section 1: Identity */}
                                    <div className="space-y-6 md:space-y-8">
                                        <div className="flex items-center gap-4">
                                            <div className="h-8 w-8 md:h-10 md:w-10 rounded-lg md:rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                                <UserIcon size={18} md:size={20} />
                                            </div>
                                            <h3 className="text-lg md:text-xl font-black">Identity</h3>
                                        </div>
                                        
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
                                            <div className="space-y-2 md:space-y-3">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-text-tertiary ml-1">First Name</label>
                                                <input 
                                                    className="w-full h-14 md:h-16 bg-bg-secondary border-none rounded-xl md:rounded-2xl px-5 md:px-6 font-bold text-text-primary focus:ring-4 ring-primary/10 transition-all outline-none"
                                                    type="text" 
                                                    value={formData.firstName}
                                                    onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                                                />
                                            </div>
                                            <div className="space-y-2 md:space-y-3">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-text-tertiary ml-1">Last Name</label>
                                                <input 
                                                    className="w-full h-14 md:h-16 bg-bg-secondary border-none rounded-xl md:rounded-2xl px-5 md:px-6 font-bold text-text-primary focus:ring-4 ring-primary/10 transition-all outline-none"
                                                    type="text" 
                                                    value={formData.lastName}
                                                    onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2 md:space-y-3">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-text-tertiary ml-1">Professional Bio</label>
                                            <textarea 
                                                className="w-full bg-bg-secondary border-none rounded-xl md:rounded-2xl p-5 md:p-6 font-bold text-text-primary focus:ring-4 ring-primary/10 transition-all outline-none min-h-[140px] md:min-h-[160px] resize-none"
                                                value={formData.bio}
                                                onChange={(e) => setFormData({...formData, bio: e.target.value})}
                                            />
                                        </div>
                                    </div>

                                    {/* Section 2: Skills */}
                                    <div className="space-y-6 md:space-y-8 pt-8 border-t border-border-light">
                                        <div className="flex items-center gap-4">
                                            <div className="h-8 w-8 md:h-10 md:w-10 rounded-lg md:rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                                <Plus size={18} md:size={20} />
                                            </div>
                                            <h3 className="text-lg md:text-xl font-black">Expertise</h3>
                                        </div>
                                        
                                        <div className="space-y-4 md:space-y-6">
                                            <div className="flex flex-wrap gap-2">
                                                {formData.skills.map((skill, i) => (
                                                    <span key={i} className="px-4 py-2 bg-primary/10 text-primary rounded-xl font-black text-[10px] md:text-xs flex items-center gap-2">
                                                        {skill}
                                                        <button onClick={() => removeSkill(skill)} className="hover:text-red-500 transition-colors">
                                                            <Trash2 size={12} md:size={14} />
                                                        </button>
                                                    </span>
                                                ))}
                                            </div>
                                            <input 
                                                className="w-full h-14 md:h-16 bg-bg-secondary border-none rounded-xl md:rounded-2xl px-5 md:px-6 font-bold text-text-primary focus:ring-4 ring-primary/10 transition-all outline-none"
                                                placeholder="Add skill and press Enter"
                                                value={currentSkill}
                                                onChange={(e) => setCurrentSkill(e.target.value)}
                                                onKeyDown={handleAddSkill}
                                            />
                                        </div>
                                    </div>

                                    {/* Section 3: Education */}
                                    <div className="space-y-6 md:space-y-8 pt-8 border-t border-border-light">
                                        <div className="flex items-center gap-4">
                                            <div className="h-8 w-8 md:h-10 md:w-10 rounded-lg md:rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                                <BookOpen size={18} md:size={20} />
                                            </div>
                                            <h3 className="text-lg md:text-xl font-black">Background</h3>
                                        </div>

                                        <div className="space-y-4 md:space-y-6">
                                            {formData.education.map((edu, idx) => (
                                                <div key={idx} className="p-6 md:p-8 bg-bg-secondary rounded-2xl md:rounded-[2rem] relative border border-transparent hover:border-border-light hover:bg-white transition-all shadow-sm">
                                                    <button onClick={() => removeEdu(idx)} className="absolute top-4 right-4 md:top-6 md:right-6 text-text-tertiary hover:text-red-500">
                                                        <Trash2 size={18} md:size={20} />
                                                    </button>
                                                    <div className="pr-8">
                                                        <h4 className="text-base md:text-lg font-black text-primary">{edu.institution}</h4>
                                                        <p className="font-bold text-text-secondary text-[10px] md:text-xs tracking-widest mt-1 uppercase">{edu.degree} • {edu.fieldOfStudy}</p>
                                                    </div>
                                                </div>
                                            ))}

                                            <div className="p-6 md:p-10 bg-bg-tertiary/20 border-3 border-dashed border-border-light rounded-[2rem] md:rounded-[2.5rem] space-y-6 md:space-y-8">
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                                                    <input 
                                                        className="h-12 md:h-14 w-full bg-white rounded-xl md:rounded-2xl px-5 md:px-6 font-bold text-xs md:text-sm outline-none border border-transparent focus:border-primary" 
                                                        placeholder="University" 
                                                        value={currentEdu.institution}
                                                        onChange={(e) => setCurrentEdu({...currentEdu, institution: e.target.value})}
                                                    />
                                                    <input 
                                                        className="h-12 md:h-14 w-full bg-white rounded-xl md:rounded-2xl px-5 md:px-6 font-bold text-xs md:text-sm outline-none border border-transparent focus:border-primary" 
                                                        placeholder="Degree" 
                                                        value={currentEdu.degree}
                                                        onChange={(e) => setCurrentEdu({...currentEdu, degree: e.target.value})}
                                                    />
                                                    <input 
                                                        className="h-12 md:h-14 w-full bg-white rounded-xl md:rounded-2xl px-5 md:px-6 font-bold text-xs md:text-sm outline-none border border-transparent focus:border-primary" 
                                                        placeholder="Major" 
                                                        value={currentEdu.fieldOfStudy}
                                                        onChange={(e) => setCurrentEdu({...currentEdu, fieldOfStudy: e.target.value})}
                                                    />
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
                                                    <input 
                                                        type="date"
                                                        className="h-12 md:h-14 w-full bg-white rounded-xl md:rounded-2xl px-5 md:px-6 font-bold text-xs md:text-sm outline-none border border-transparent focus:border-primary" 
                                                        value={currentEdu.from}
                                                        onChange={(e) => setCurrentEdu({...currentEdu, from: e.target.value})}
                                                    />
                                                    <input 
                                                        type="date"
                                                        disabled={currentEdu.current}
                                                        className="h-12 md:h-14 w-full bg-white rounded-xl md:rounded-2xl px-5 md:px-6 font-bold text-xs md:text-sm outline-none border border-transparent focus:border-primary disabled:opacity-30" 
                                                        value={currentEdu.to}
                                                        onChange={(e) => setCurrentEdu({...currentEdu, to: e.target.value})}
                                                    />
                                                </div>
                                                <div className="flex items-center gap-3 px-2">
                                                    <input 
                                                        type="checkbox" 
                                                        id="currentEdu"
                                                        className="h-5 w-5 rounded border-border-medium text-primary focus:ring-4 ring-primary/10 transition-all cursor-pointer"
                                                        checked={currentEdu.current}
                                                        onChange={(e) => setCurrentEdu({...currentEdu, current: e.target.checked})}
                                                    />
                                                    <label htmlFor="currentEdu" className="text-xs font-black text-text-secondary cursor-pointer">Currently enrolled</label>
                                                </div>
                                                <button 
                                                    onClick={handleAddEdu}
                                                    className="w-full py-4 md:py-5 bg-primary/5 text-primary rounded-xl md:rounded-2xl font-black text-[10px] md:text-sm border border-primary/20 hover:bg-primary hover:text-text-inverse transition-all flex items-center justify-center gap-2"
                                                >
                                                    <Plus size={18} /> Add Entry
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Section 4: Resume */}
                                    <div className="space-y-6 md:space-y-8 pt-8 border-t border-border-light text-center">
                                        <div className="flex flex-col items-center gap-4">
                                            <div className="h-12 md:h-14 w-12 md:14 rounded-xl md:rounded-2xl bg-secondary/20 flex items-center justify-center text-primary">
                                                <FileText size={24} md:size={28} />
                                            </div>
                                            <div>
                                                <h3 className="text-xl md:text-2xl font-black">Identity File</h3>
                                                <p className="text-[10px] md:text-sm text-text-tertiary font-bold max-w-xs mx-auto">Upload your academic or professional resume.</p>
                                            </div>
                                            
                                            <div className="w-full max-w-sm relative group">
                                                <input 
                                                    type="file" 
                                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                                    accept=".pdf,.doc,.docx"
                                                    onChange={(e) => setResumeFile(e.target.files[0])}
                                                />
                                                <div className={`h-32 md:h-40 rounded-2xl md:rounded-3xl border-3 border-dashed flex flex-col items-center justify-center transition-all ${
                                                    resumeFile ? 'bg-green-50/50 border-green-500/50' : 'bg-bg-secondary border-border-light'
                                                }`}>
                                                    <div className={`h-10 w-10 rounded-full mb-2 flex items-center justify-center shadow-lg ${resumeFile ? 'bg-green-500 text-white' : 'bg-white text-text-tertiary'}`}>
                                                        {resumeFile ? <Check size={18} /> : <Camera size={18} />}
                                                    </div>
                                                    <span className={`text-[10px] md:text-xs font-black px-4 truncate w-full text-center ${resumeFile ? 'text-green-600' : 'text-text-tertiary'}`}>
                                                        {resumeFile ? resumeFile.name : 'Choose File (PDF/DOC)'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Save Button */}
                                    <div className="pt-6 md:pt-10 flex flex-col md:flex-row gap-4 md:gap-6">
                                        <button 
                                            onClick={() => setIsEditing(false)}
                                            className="w-full md:flex-1 h-14 md:h-16 bg-bg-tertiary text-text-tertiary rounded-xl md:rounded-2xl font-black hover:bg-border-light transition-all"
                                        >
                                            Discard
                                        </button>
                                        <button 
                                            onClick={handleSave}
                                            disabled={loading}
                                            className="w-full md:flex-[2] h-14 md:h-16 bg-primary text-text-inverse rounded-xl md:rounded-2xl font-black shadow-xl md:shadow-2xl shadow-primary/30 hover:bg-primary-light active:scale-[0.98] transition-all flex items-center justify-center gap-3"
                                        >
                                            {loading ? <Loader2 className="animate-spin" /> : <><Save size={20} /> Save Identity</>}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default StudentProfile;
