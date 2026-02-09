import {
    AlertCircle,
    Briefcase,
    Calendar,
    CheckCircle2,
    ChevronDown,
    Edit3,
    Layers,
    Loader2,
    MapPin
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import CompanySidebar from '../components/CompanySidebar';
import MobileHeader from '../components/MobileHeader';
import api from '../utils/api';

const EditInternship = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fetchingData, setFetchingData] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    duration: '',
    stipend: '',
    skills: '',
    category: 'Software Development',
    deadline: '',
    status: 'active'
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
    const fetchData = async () => {
      try {
        const [userRes, internshipRes] = await Promise.all([
          api.get('/auth/me'),
          api.get(`/internships/${id}`)
        ]);
        
        setUser(userRes.data.data);
        
        const internship = internshipRes.data.data;
        setFormData({
          title: internship.title || '',
          description: internship.description || '',
          location: internship.location || '',
          duration: internship.duration || '',
          stipend: internship.stipend || '',
          skills: internship.skills ? internship.skills.join(', ') : '',
          category: internship.category || 'Software Development',
          deadline: internship.deadline ? internship.deadline.split('T')[0] : '',
          status: internship.status || 'active'
        });
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load internship details');
      } finally {
        setLoading(false);
        setFetchingData(false);
      }
    };
    fetchData();
  }, [id]);

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

      await api.put(`/internships/${id}`, processedData);
      setSuccess(true);
      setTimeout(() => navigate('/company/internships'), 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update internship. Please try again.');
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
    <div className="flex flex-col lg:flex-row min-h-screen lg:h-screen bg-bg-secondary lg:overflow-hidden font-sans">
      <CompanySidebar user={user} isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <MobileHeader isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} role="company" />

        {/* Header - Hidden on mobile */}
        <header className="hidden lg:flex h-20 bg-bg-primary border-b border-border-light items-center justify-between px-8">
          <div>
            <h2 className="text-2xl font-black text-primary tracking-tight">Edit Posting</h2>
            <p className="text-sm text-text-tertiary font-medium">Update internship details</p>
          </div>
        </header>

        {/* Form Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-bg-secondary custom-scrollbar">
          <div className="max-w-4xl mx-auto">
            {/* Mobile Header Title */}
            <div className="lg:hidden mb-6">
                <h2 className="text-2xl font-black text-primary tracking-tight">Modify Internship</h2>
                <p className="text-[10px] text-text-tertiary font-black uppercase tracking-widest">{formData.title}</p>
            </div>

            {success ? (
              <div className="bg-bg-primary p-8 md:p-12 rounded-[2rem] md:rounded-[2.5rem] border border-emerald-100 shadow-2xl shadow-emerald-500/5 text-center flex flex-col items-center animate-in fade-in zoom-in duration-500">
                <div className="h-16 w-16 md:h-24 md:w-24 bg-emerald-500 rounded-2xl md:rounded-3xl flex items-center justify-center text-white mb-6 md:8 shadow-xl shadow-emerald-500/20">
                  <CheckCircle2 size={32} md:size={48} strokeWidth={2.5} />
                </div>
                <h3 className="text-2xl md:text-3xl font-black text-primary mb-2">Success!</h3>
                <p className="text-text-tertiary font-bold text-sm md:text-lg">Redirecting to management...</p>
              </div>
            ) : (
              <div className="bg-bg-primary rounded-[2rem] md:rounded-[2.5rem] border border-border-light shadow-lg overflow-hidden mb-8 md:12">
                <div className="p-6 md:p-10 border-b border-border-light bg-bg-tertiary/30">
                  <div className="flex items-center space-x-4">
                    <div className="h-10 w-10 md:h-12 md:w-12 bg-primary rounded-xl md:rounded-2xl flex items-center justify-center text-white shadow-lg shrink-0">
                      <Edit3 size={20} md:size={24} />
                    </div>
                    <div>
                      <h3 className="text-lg md:text-xl font-black text-primary">Modify Internship</h3>
                      <p className="text-xs md:text-sm text-text-tertiary font-medium">Capture the best talent with precise details.</p>
                    </div>
                  </div>
                </div>

                <form onSubmit={onSubmit} className="p-6 md:p-10">
                  {error && (
                    <div className="mb-6 md:8 p-4 md:5 bg-red-50 border border-red-100 text-red-600 rounded-xl md:rounded-2xl flex items-center space-x-3 animate-shake">
                      <AlertCircle size={18} md:size={20} />
                      <span className="font-bold text-xs md:text-sm tracking-tight">{error}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                    {/* Title */}
                    <div className="md:col-span-2">
                       <label className="block text-[10px] md:text-xs font-black text-text-tertiary uppercase tracking-widest mb-2 md:3 ml-1">Internship Role Title</label>
                       <div className="relative group">
                          <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-text-tertiary group-focus-within:text-primary transition-colors" size={16} md:size={18} />
                          <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={onChange}
                            required
                            placeholder="e.g. Senior Frontend Developer Intern"
                            className="w-full pl-10 md:pl-12 pr-4 py-3.5 md:py-4 bg-bg-tertiary border border-border-medium rounded-xl md:rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-bold text-primary text-sm md:text-base placeholder:text-text-tertiary/60"
                          />
                       </div>
                    </div>

                    {/* Category */}
                    <div>
                      <label className="block text-[10px] md:text-xs font-black text-text-tertiary uppercase tracking-widest mb-2 md:3 ml-1">Category</label>
                      <div className="relative group">
                        <Layers className="absolute left-4 top-1/2 -translate-y-1/2 text-text-tertiary pointer-events-none" size={16} md:size={18} />
                        <select
                          name="category"
                          value={formData.category}
                          onChange={onChange}
                          className="w-full pl-10 md:pl-12 pr-10 py-3.5 md:py-4 bg-bg-tertiary border border-border-medium rounded-xl md:rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-bold text-primary text-sm md:text-base appearance-none cursor-pointer"
                        >
                          {categories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-text-tertiary pointer-events-none" size={14} md:size={16} />
                      </div>
                    </div>

                    {/* Status */}
                    <div>
                      <label className="block text-[10px] md:text-xs font-black text-text-tertiary uppercase tracking-widest mb-2 md:3 ml-1">Posting Status</label>
                      <div className="relative group">
                        <select
                          name="status"
                          value={formData.status}
                          onChange={onChange}
                          className="w-full px-5 py-3.5 md:py-4 bg-bg-tertiary border border-border-medium rounded-xl md:rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-bold text-primary text-sm md:text-base appearance-none cursor-pointer"
                        >
                          <option value="active">Active</option>
                          <option value="closed">Closed</option>
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-text-tertiary pointer-events-none" size={14} md:size={16} />
                      </div>
                    </div>

                    {/* Location */}
                    <div>
                      <label className="block text-[10px] md:text-xs font-black text-text-tertiary uppercase tracking-widest mb-2 md:3 ml-1">Location</label>
                      <div className="relative group">
                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-text-tertiary group-focus-within:text-primary transition-colors" size={16} md:size={18} />
                        <input
                          type="text"
                          name="location"
                          value={formData.location}
                          onChange={onChange}
                          required
                          placeholder="e.g. Dhaka, Remote"
                          className="w-full pl-10 md:pl-12 pr-4 py-3.5 md:py-4 bg-bg-tertiary border border-border-medium rounded-xl md:rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-bold text-primary text-sm md:text-base placeholder:text-text-tertiary/60"
                        />
                      </div>
                    </div>

                    {/* Duration */}
                    <div>
                      <label className="block text-[10px] md:text-xs font-black text-text-tertiary uppercase tracking-widest mb-2 md:3 ml-1">Duration</label>
                      <div className="relative group">
                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-text-tertiary group-focus-within:text-primary transition-colors" size={16} md:size={18} />
                        <input
                          type="text"
                          name="duration"
                          value={formData.duration}
                          onChange={onChange}
                          required
                          placeholder="e.g. 3 Months"
                          className="w-full pl-10 md:pl-12 pr-4 py-3.5 md:py-4 bg-bg-tertiary border border-border-medium rounded-xl md:rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-bold text-primary text-sm md:text-base placeholder:text-text-tertiary/60"
                        />
                      </div>
                    </div>

                    {/* Stipend */}
                    <div>
                      <label className="block text-[10px] md:text-xs font-black text-text-tertiary uppercase tracking-widest mb-2 md:3 ml-1">Stipend</label>
                      <div className="relative group">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-tertiary group-focus-within:text-primary transition-colors font-black text-base md:text-lg">৳</div>
                        <input
                          type="text"
                          name="stipend"
                          value={formData.stipend}
                          onChange={onChange}
                          placeholder="e.g. 15,000 / Unpaid"
                          className="w-full pl-10 md:pl-12 pr-4 py-3.5 md:py-4 bg-bg-tertiary border border-border-medium rounded-xl md:rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-bold text-primary text-sm md:text-base placeholder:text-text-tertiary/60"
                        />
                      </div>
                    </div>

                    {/* Deadline */}
                    <div>
                      <label className="block text-[10px] md:text-xs font-black text-text-tertiary uppercase tracking-widest mb-2 md:3 ml-1">Deadline</label>
                      <div className="relative group">
                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-text-tertiary group-focus-within:text-primary transition-colors" size={16} md:size={18} />
                        <input
                          type="date"
                          name="deadline"
                          value={formData.deadline}
                          onChange={onChange}
                          required
                          className="w-full pl-10 md:pl-12 pr-4 py-3.5 md:py-4 bg-bg-tertiary border border-border-medium rounded-xl md:rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-bold text-primary text-sm md:text-base cursor-pointer"
                        />
                      </div>
                    </div>

                    {/* Skills */}
                    <div className="md:col-span-2">
                       <label className="block text-[10px] md:text-xs font-black text-text-tertiary uppercase tracking-widest mb-2 md:3 ml-1">Skills Required (Comma separated)</label>
                       <textarea
                         name="skills"
                         value={formData.skills}
                         onChange={onChange}
                         required
                         placeholder="e.g. React, Node.js, UI Design"
                         className="w-full px-5 py-4 bg-bg-tertiary border border-border-medium rounded-xl md:rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-bold text-primary text-sm md:text-base placeholder:text-text-tertiary/60 resize-none h-24"
                       />
                    </div>

                    {/* Description */}
                    <div className="md:col-span-2">
                       <label className="block text-[10px] md:text-xs font-black text-text-tertiary uppercase tracking-widest mb-2 md:3 ml-1">Role Description</label>
                       <textarea
                         name="description"
                         value={formData.description}
                         onChange={onChange}
                         required
                         placeholder="Describe the role, responsibilities, and qualifications..."
                         className="w-full px-5 py-4 bg-bg-tertiary border border-border-medium rounded-xl md:rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-bold text-primary text-sm md:text-base placeholder:text-text-tertiary/60 h-40 md:h-48"
                       />
                    </div>
                  </div>

                  <div className="mt-8 md:12">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full py-4 md:py-5 bg-primary text-text-inverse font-black text-lg rounded-xl md:rounded-2xl shadow-xl shadow-primary/20 hover:bg-primary-light active:scale-[0.98] transition-all flex items-center justify-center space-x-3 disabled:opacity-70 disabled:pointer-events-none"
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="animate-spin" size={20} md:size={24} />
                          <span>Saving Changes...</span>
                        </>
                      ) : (
                        <>
                          <Edit3 size={20} md:size={24} />
                          <span>Update Posting</span>
                        </>
                      )}
                    </button>
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

export default EditInternship;
