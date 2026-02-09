import {
    ArrowRight,
    BookOpen,
    Check,
    FileText,
    Plus,
    Trash2,
    User
} from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

const StudentOnboarding = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

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

    // Handlers
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

    const handleSubmit = async () => {
        setLoading(true);
        setError('');
        try {
            // 1. Upload Resume if exists
            let resumePath = '';
            if (resumeFile) {
                const resumeFormData = new FormData();
                resumeFormData.append('resume', resumeFile);
                const uploadRes = await api.post('/applications/upload', resumeFormData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                resumePath = uploadRes.data.filePath;
            }

            // 2. Update Profile
            await api.post('/profile', {
                ...formData,
                resume: resumePath
            });

            navigate('/student');
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    const nextStep = () => setStep(s => s + 1);
    const prevStep = () => setStep(s => s - 1);

    const steps = [
        { id: 1, title: 'Bio', icon: <User size={18} /> },
        { id: 2, title: 'Skills', icon: <BookOpen size={18} /> },
        { id: 3, title: 'Resume', icon: <FileText size={18} /> }
    ];

    return (
        <div className="min-h-screen bg-bg-secondary flex flex-col items-center py-8 md:py-12 px-4 sm:px-6 lg:px-8 font-sans">
            {/* Logo/Branding */}
            <div className="flex items-center gap-3 mb-8 md:12">
                <h1 className="text-2xl md:text-3xl font-black text-primary tracking-tighter">InternLagbe</h1>
            </div>

            {/* Stepper */}
            <div className="w-full max-w-xl mb-8 md:12 flex justify-between relative">
                <div className="absolute top-6 left-0 w-full h-0.5 bg-border-light -z-10"></div>
                {steps.map((s) => (
                    <div key={s.id} className="flex flex-col items-center gap-2 bg-bg-secondary px-2 md:px-4">
                        <div className={`h-10 w-10 md:h-12 md:w-12 rounded-xl md:rounded-2xl flex items-center justify-center border-2 transition-all duration-500 ${
                            step >= s.id ? 'bg-primary border-primary text-text-inverse shadow-lg shadow-primary/20' : 'bg-bg-primary border-border-light text-text-tertiary'
                        }`}>
                            {step > s.id ? <Check size={18} /> : s.icon}
                        </div>
                        <span className={`text-[9px] md:text-[10px] font-black uppercase tracking-widest ${
                            step >= s.id ? 'text-primary' : 'text-text-tertiary'
                        }`}>{s.title}</span>
                    </div>
                ))}
            </div>

            {/* Form Card */}
            <div className="w-full max-w-2xl bg-bg-primary border border-border-light rounded-[2rem] md:rounded-[3rem] shadow-xl p-6 md:p-12 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-32 -mt-32 blur-3xl group-hover:bg-primary/10 transition-colors pointer-events-none"></div>
                
                {error && (
                    <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-2xl text-xs md:text-sm font-bold border border-red-100 animate-shake">
                        {error}
                    </div>
                )}

                {/* Step 1: Personal Data */}
                {step === 1 && (
                    <div className="space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div>
                            <h2 className="text-2xl md:text-3xl font-black text-text-primary tracking-tight mb-2">Build your profile</h2>
                            <p className="text-sm md:text-base text-text-tertiary font-bold">Start with the basics. Let's get to know you.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-text-tertiary ml-1">First Name</label>
                                <input 
                                    className="w-full h-12 md:h-14 bg-bg-secondary border-none rounded-2xl px-6 font-bold text-text-primary focus:ring-2 ring-primary/20 transition-all outline-none"
                                    type="text" 
                                    placeholder="John"
                                    value={formData.firstName}
                                    onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-text-tertiary ml-1">Last Name</label>
                                <input 
                                    className="w-full h-12 md:h-14 bg-bg-secondary border-none rounded-2xl px-6 font-bold text-text-primary focus:ring-2 ring-primary/20 transition-all outline-none"
                                    type="text" 
                                    placeholder="Doe"
                                    value={formData.lastName}
                                    onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-text-tertiary ml-1">Short Bio</label>
                            <textarea 
                                className="w-full bg-bg-secondary border-none rounded-2xl p-4 md:p-6 font-bold text-text-primary focus:ring-2 ring-primary/20 transition-all outline-none min-h-[120px] resize-none text-sm"
                                placeholder="I'm a passionate developer looking for..."
                                value={formData.bio}
                                onChange={(e) => setFormData({...formData, bio: e.target.value})}
                            />
                        </div>

                        <button 
                            onClick={nextStep}
                            disabled={!formData.firstName || !formData.lastName}
                            className="w-full h-14 md:h-16 bg-primary text-text-inverse rounded-2xl font-black shadow-lg shadow-primary/20 hover:bg-primary-light active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                        >
                            Next Step
                            <ArrowRight size={20} />
                        </button>
                    </div>
                )}

                {/* Step 2: Skills & Edu */}
                {step === 2 && (
                    <div className="space-y-8 md:space-y-10 animate-in fade-in slide-in-from-right-4 duration-500">
                        <div>
                            <h2 className="text-2xl md:text-3xl font-black text-text-primary tracking-tight mb-2">Expertise</h2>
                            <p className="text-sm md:text-base text-text-tertiary font-bold">Add your skills and academic background.</p>
                        </div>

                        {/* Skills Section */}
                        <div className="space-y-4">
                            <label className="text-[10px] font-black uppercase tracking-widest text-text-tertiary ml-1">Skills (Press Enter)</label>
                            <div className="flex flex-wrap gap-2">
                                {formData.skills.map((skill, i) => (
                                    <span key={i} className="px-3 py-1.5 bg-primary/10 text-primary rounded-xl font-bold text-[11px] flex items-center gap-2 border border-primary/10">
                                        {skill}
                                        <button onClick={() => removeSkill(skill)}>
                                            <Trash2 size={12} className="hover:text-red-500 transition-colors" />
                                        </button>
                                    </span>
                                ))}
                            </div>
                            <input 
                                className="w-full h-12 md:h-14 bg-bg-secondary border-none rounded-2xl px-6 font-bold text-text-primary focus:ring-2 ring-primary/20 transition-all outline-none text-sm"
                                type="text" 
                                placeholder="e.g. React, UI/UX"
                                value={currentSkill}
                                onChange={(e) => setCurrentSkill(e.target.value)}
                                onKeyDown={handleAddSkill}
                            />
                        </div>

                        {/* Education Section */}
                        <div className="space-y-6 pt-6 border-t border-border-light">
                            <label className="text-[10px] font-black uppercase tracking-widest text-text-tertiary ml-1">Education</label>
                            
                            <div className="space-y-3">
                                {formData.education.map((edu, idx) => (
                                    <div key={idx} className="p-4 md:p-6 bg-bg-secondary rounded-2xl relative group/edu">
                                        <button onClick={() => removeEdu(idx)} className="absolute top-4 right-4 text-text-tertiary hover:text-red-500 transition-colors">
                                            <Trash2 size={16} />
                                        </button>
                                        <div className="pr-8">
                                            <h4 className="font-black text-primary text-sm md:text-base">{edu.institution}</h4>
                                            <p className="text-[11px] md:text-sm font-bold text-text-tertiary">{edu.degree} • {edu.fieldOfStudy}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="p-4 md:p-6 bg-bg-secondary/50 border-2 border-dashed border-border-light rounded-2xl space-y-4">
                                <div className="grid grid-cols-1 gap-3">
                                    <input 
                                        className="h-11 bg-white rounded-xl px-4 text-sm font-bold outline-none" 
                                        placeholder="Institution name" 
                                        value={currentEdu.institution}
                                        onChange={(e) => setCurrentEdu({...currentEdu, institution: e.target.value})}
                                    />
                                    <div className="grid grid-cols-2 gap-3">
                                        <input 
                                            className="h-11 bg-white rounded-xl px-4 text-sm font-bold outline-none" 
                                            placeholder="Degree" 
                                            value={currentEdu.degree}
                                            onChange={(e) => setCurrentEdu({...currentEdu, degree: e.target.value})}
                                        />
                                        <input 
                                            className="h-11 bg-white rounded-xl px-4 text-sm font-bold outline-none" 
                                            placeholder="Field" 
                                            value={currentEdu.fieldOfStudy}
                                            onChange={(e) => setCurrentEdu({...currentEdu, fieldOfStudy: e.target.value})}
                                        />
                                    </div>
                                </div>
                                <button 
                                    onClick={handleAddEdu}
                                    className="w-full py-2.5 bg-white text-primary rounded-xl font-black text-[11px] border border-primary/20 hover:bg-primary/5 transition-colors flex items-center justify-center gap-2"
                                >
                                    <Plus size={14} /> Add Education
                                </button>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <button onClick={prevStep} className="flex-1 h-14 md:h-16 bg-bg-secondary text-text-tertiary rounded-2xl font-black hover:bg-border-light transition-all text-sm">
                                Back
                            </button>
                            <button onClick={nextStep} className="flex-[2] h-14 md:h-16 bg-primary text-text-inverse rounded-2xl font-black shadow-lg shadow-primary/20 hover:bg-primary-light transition-all text-sm flex items-center justify-center gap-2">
                                Next <ArrowRight size={18} />
                            </button>
                        </div>
                    </div>
                )}

                {/* Step 3: Resume */}
                {step === 3 && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                        <div className="text-center">
                            <h2 className="text-2xl md:text-3xl font-black text-text-primary tracking-tight mb-2">One Last Thing</h2>
                            <p className="text-sm md:text-base text-text-tertiary font-bold max-w-sm mx-auto">Upload your resume. This is what companies will see first.</p>
                        </div>

                        <div className="relative group/upload">
                            <input 
                                type="file" 
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                                accept=".pdf,.doc,.docx"
                                onChange={(e) => setResumeFile(e.target.files[0])}
                            />
                            <div className={`h-40 md:h-48 rounded-3xl border-2 border-dashed flex flex-col items-center justify-center transition-all ${
                                resumeFile ? 'bg-primary/5 border-primary/50' : 'bg-bg-secondary border-border-light group-hover/upload:border-primary/30 group-hover/upload:bg-primary/5'
                            }`}>
                                <div className={`h-10 w-10 md:h-12 md:w-12 rounded-full mb-3 flex items-center justify-center ${resumeFile ? 'bg-primary text-text-inverse' : 'bg-border-light text-text-tertiary'}`}>
                                    {resumeFile ? <Check size={18} /> : <FileText size={18} />}
                                </div>
                                <span className={`text-[11px] md:text-sm font-black text-center px-4 ${resumeFile ? 'text-primary' : 'text-text-tertiary'}`}>
                                    {resumeFile ? resumeFile.name : 'Click or Drop Resume (PDF/DOC)'}
                                </span>
                            </div>
                        </div>

                        <div className="flex gap-4 mt-8">
                            <button onClick={prevStep} className="flex-1 h-14 md:h-16 bg-bg-secondary text-text-tertiary rounded-2xl font-black hover:bg-border-light transition-all text-sm">
                                Back
                            </button>
                            <button 
                                onClick={handleSubmit}
                                disabled={loading || !resumeFile}
                                className="flex-[2] h-14 md:h-16 bg-primary text-text-inverse rounded-2xl font-black shadow-lg shadow-primary/20 hover:bg-primary-light transition-all flex items-center justify-center gap-3 disabled:opacity-50 text-sm"
                            >
                                {loading ? 'Saving...' : 'Finish Setup'}
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <p className="mt-8 text-text-tertiary text-[10px] font-black uppercase tracking-widest">
                Step {step} of 3
            </p>
        </div>
    );
};

export default StudentOnboarding;
