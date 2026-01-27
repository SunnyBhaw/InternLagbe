import {
    AlertCircle,
    Briefcase,
    Calendar,
    CheckCircle2,
    ChevronDown,
    Layers,
    Loader2,
    MapPin,
    PlusCircle
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CompanySidebar from '../components/CompanySidebar';
import api from '../utils/api';

const PostInternship = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    duration: '',
    stipend: '',
    skills: '',
    category: 'Software Development',
    deadline: ''
  });

  const categories = [
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
  ];

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const [userRes, profileRes] = await Promise.all([
          api.get('/auth/me'),
          api.get('/profile/me').catch(() => ({ data: { data: null } }))
        ]);
        setUser(userRes.data.data);
        setProfile(profileRes.data.data);
      } catch (err) {
        console.error('Error fetching user profile:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    
    try {
      // Split skills by comma and trim
      const { skills, ...rest } = formData;
      const processedData = {
        ...rest,
        skills: skills.split(',').map(s => s.trim()).filter(s => s !== '')
      };

      await api.post('/internships', processedData);
      setSuccess(true);
      setTimeout(() => navigate('/company'), 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to post internship. Please try again.');
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-bg-secondary">
        <Loader2 className="animate-spin text-primary" size={48} />
      </div>
    );
  }



  return (
    <div className="flex h-screen bg-bg-secondary overflow-hidden">
      <CompanySidebar user={user} />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-20 bg-bg-primary border-b border-border-light flex items-center justify-between px-8">
          <div>
            <h2 className="text-2xl font-black text-primary tracking-tight">Create Opportunity</h2>
            <p className="text-sm text-text-tertiary font-medium">Publish a new internship posting</p>
          </div>
          

        </header>

        {/* Form Area */}
        <main className="flex-1 overflow-y-auto p-8 bg-bg-secondary custom-scrollbar">
          <div className="max-w-4xl mx-auto">
            {success ? (
              <div className="bg-white p-12 rounded-[2.5rem] border border-emerald-100 shadow-2xl shadow-emerald-500/5 text-center flex flex-col items-center animate-in fade-in zoom-in duration-500">
                <div className="h-24 w-24 bg-emerald-500 rounded-3xl flex items-center justify-center text-white mb-8 shadow-xl shadow-emerald-500/20">
                  <CheckCircle2 size={48} strokeWidth={2.5} />
                </div>
                <h3 className="text-3xl font-black text-primary mb-2">Internship Published!</h3>
                <p className="text-text-tertiary font-medium text-lg">Your posting is now live and students can apply. Redirecting to dashboard...</p>
              </div>
            ) : (
              <div className="bg-white rounded-[2.5rem] border border-border-light shadow-xl overflow-hidden mb-12">
                <div className="p-10 border-b border-border-light bg-bg-tertiary/30">
                  <div className="flex items-center space-x-4">
                    <div className="h-12 w-12 bg-primary rounded-2xl flex items-center justify-center text-white shadow-lg">
                      <PlusCircle size={24} />
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-primary">Internship Details</h3>
                      <p className="text-sm text-text-tertiary font-medium">Fill in the information to attract top talent.</p>
                    </div>
                  </div>
                </div>

                <form onSubmit={onSubmit} className="p-10">
                  {error && (
                    <div className="mb-8 p-5 bg-red-50 border border-red-100 text-red-600 rounded-2xl flex items-center space-x-3 animate-shake">
                      <AlertCircle size={20} />
                      <span className="font-bold text-sm tracking-tight">{error}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Title */}
                    <div className="md:col-span-2">
                       <label className="block text-xs font-black text-text-tertiary uppercase tracking-widest mb-3 ml-1">Internship Role Title</label>
                       <div className="relative group">
                          <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-text-tertiary group-focus-within:text-primary transition-colors" size={18} />
                          <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={onChange}
                            required
                            placeholder="e.g. Senior Frontend Developer Intern"
                            className="w-full pl-12 pr-4 py-4 bg-bg-tertiary border border-border-medium rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-bold text-primary placeholder:text-text-tertiary/60"
                          />
                       </div>
                    </div>

                    {/* Category */}
                    <div>
                      <label className="block text-xs font-black text-text-tertiary uppercase tracking-widest mb-3 ml-1">Category</label>
                      <div className="relative group">
                        <Layers className="absolute left-4 top-1/2 -translate-y-1/2 text-text-tertiary pointer-events-none" size={18} />
                        <select
                          name="category"
                          value={formData.category}
                          onChange={onChange}
                          className="w-full pl-12 pr-10 py-4 bg-bg-tertiary border border-border-medium rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-bold text-primary appearance-none cursor-pointer"
                        >
                          {categories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-text-tertiary pointer-events-none" size={16} />
                      </div>
                    </div>

                    {/* Location */}
                    <div>
                      <label className="block text-xs font-black text-text-tertiary uppercase tracking-widest mb-3 ml-1">Location</label>
                      <div className="relative group">
                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-text-tertiary group-focus-within:text-primary transition-colors" size={18} />
                        <input
                          type="text"
                          name="location"
                          value={formData.location}
                          onChange={onChange}
                          required
                          placeholder="e.g. Dhaka, Remote, etc."
                          className="w-full pl-12 pr-4 py-4 bg-bg-tertiary border border-border-medium rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-bold text-primary placeholder:text-text-tertiary/60"
                        />
                      </div>
                    </div>

                    {/* Duration */}
                    <div>
                      <label className="block text-xs font-black text-text-tertiary uppercase tracking-widest mb-3 ml-1">Duration</label>
                      <div className="relative group">
                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-text-tertiary group-focus-within:text-primary transition-colors" size={18} />
                        <input
                          type="text"
                          name="duration"
                          value={formData.duration}
                          onChange={onChange}
                          required
                          placeholder="e.g. 3 Months, 6 Months"
                          className="w-full pl-12 pr-4 py-4 bg-bg-tertiary border border-border-medium rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-bold text-primary placeholder:text-text-tertiary/60"
                        />
                      </div>
                    </div>

                    {/* Stipend */}
                    <div>
                      <label className="block text-xs font-black text-text-tertiary uppercase tracking-widest mb-3 ml-1">Monthly Stipend</label>
                      <div className="relative group">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-tertiary group-focus-within:text-primary transition-colors font-black text-lg">৳</div>
                        <input
                          type="text"
                          name="stipend"
                          value={formData.stipend}
                          onChange={onChange}
                          placeholder="e.g. 15,000 BDT, Unpaid"
                          className="w-full pl-12 pr-4 py-4 bg-bg-tertiary border border-border-medium rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-bold text-primary placeholder:text-text-tertiary/60"
                        />
                      </div>
                    </div>

                    {/* Deadline */}
                    <div className="md:col-span-2">
                      <label className="block text-xs font-black text-text-tertiary uppercase tracking-widest mb-3 ml-1">Application Deadline</label>
                      <div className="relative group">
                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-text-tertiary group-focus-within:text-primary transition-colors" size={18} />
                        <input
                          type="date"
                          name="deadline"
                          value={formData.deadline}
                          onChange={onChange}
                          required
                          className="w-full pl-12 pr-4 py-4 bg-bg-tertiary border border-border-medium rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-bold text-primary cursor-pointer"
                        />
                      </div>
                    </div>

                    {/* Skills */}
                    <div className="md:col-span-2">
                       <label className="block text-xs font-black text-text-tertiary uppercase tracking-widest mb-3 ml-1">Skills Required (Comma separated)</label>
                       <textarea
                         name="skills"
                         value={formData.skills}
                         onChange={onChange}
                         required
                         placeholder="e.g. React, Node.js, TypeScript, UI Design"
                         className="w-full px-5 py-4 bg-bg-tertiary border border-border-medium rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-bold text-primary placeholder:text-text-tertiary/60 resize-none h-24"
                       />
                    </div>

                    {/* Description */}
                    <div className="md:col-span-2">
                       <label className="block text-xs font-black text-text-tertiary uppercase tracking-widest mb-3 ml-1">Role Description & Responsibilities</label>
                       <textarea
                         name="description"
                         value={formData.description}
                         onChange={onChange}
                         required
                         placeholder="Describe the internship role, responsibilities, and qualifications..."
                         className="w-full px-5 py-4 bg-bg-tertiary border border-border-medium rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-bold text-primary placeholder:text-text-tertiary/60 h-48"
                       />
                    </div>
                  </div>

                  <div className="mt-12">
                    <button
                      type="submit"
                      disabled={submitting || !profile?.isProfileComplete}
                      className={`w-full py-5 font-black text-lg rounded-2xl shadow-xl transition-all flex items-center justify-center space-x-3 disabled:opacity-70 disabled:pointer-events-none ${
                        profile?.isProfileComplete
                        ? 'bg-primary text-text-inverse shadow-primary/20 hover:bg-primary-light active:scale-[0.98]'
                        : 'bg-bg-tertiary text-text-tertiary shadow-none'
                      }`}
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="animate-spin" size={24} />
                          <span>Publishing Posting...</span>
                        </>
                      ) : (
                        <>
                          <PlusCircle size={24} />
                          <span>{profile?.isProfileComplete ? 'Publish Internship Now' : 'Complete Profile to Post'}</span>
                        </>
                      )}
                    </button>
                    {!profile?.isProfileComplete && (
                      <p className="mt-4 text-center text-xs font-black text-primary uppercase tracking-widest animate-pulse">
                        Setup business identity to unlock job postings
                      </p>
                    )}
                  </div>
                </form>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default PostInternship;
