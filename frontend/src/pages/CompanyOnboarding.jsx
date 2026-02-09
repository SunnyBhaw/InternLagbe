import {
    AlignLeft,
    ArrowRight,
    Building2,
    MapPin
} from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

const CompanyOnboarding = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Form State
    const [formData, setFormData] = useState({
        companyName: '',
        location: '',
        description: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await api.post('/profile', {
                ...formData
            });
            navigate('/company');
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to update company profile');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-bg-secondary flex flex-col items-center py-8 md:py-12 px-4 sm:px-6 lg:px-8 font-sans">
            {/* Logo/Branding */}
            <div className="flex items-center gap-3 mb-8 md:10">
                <h1 className="text-2xl md:text-3xl font-black text-primary tracking-tighter">InternLagbe</h1>
            </div>

            {/* Header */}
            <div className="text-center mb-10 md:12">
                <div className="h-16 w-16 md:h-20 md:w-20 bg-primary/10 rounded-2xl md:rounded-[2rem] flex items-center justify-center text-primary mx-auto mb-6">
                    <Building2 size={32} />
                </div>
                <h2 className="text-2xl md:text-4xl font-black text-text-primary tracking-tight mb-2 md:3">Set up your workspace</h2>
                <p className="text-text-tertiary font-bold text-sm md:text-lg">Complete your business profile to start posting internships.</p>
            </div>

            {/* Form Card */}
            <div className="w-full max-w-xl bg-bg-primary border border-border-light rounded-[2rem] md:rounded-[3rem] shadow-xl p-6 md:p-14 relative overflow-hidden group">
                
                {error && (
                    <div className="mb-6 md:8 p-4 bg-red-50 text-red-600 rounded-2xl text-xs md:text-sm font-bold border border-red-100 flex items-center gap-3">
                        <div className="h-5 w-5 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 text-[10px]">
                            !
                        </div>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8">
                    {/* Company Name */}
                    <div className="space-y-2 md:space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-text-tertiary ml-1 flex items-center gap-2">
                             <Building2 size={12} className="text-primary" /> Company Name
                        </label>
                        <input 
                            required
                            type="text"
                            placeholder="e.g. Acme Innovations Ltd."
                            className="w-full h-14 md:h-16 bg-bg-secondary border-none rounded-2xl px-6 font-bold text-text-primary focus:ring-4 ring-primary/10 transition-all outline-none md:text-base text-sm"
                            value={formData.companyName}
                            onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                        />
                    </div>

                    {/* Location */}
                    <div className="space-y-2 md:space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-text-tertiary ml-1 flex items-center gap-2">
                             <MapPin size={12} className="text-primary" /> HQ Location
                        </label>
                        <input 
                            required
                            type="text"
                            placeholder="e.g. Gulshan, Dhaka"
                            className="w-full h-14 md:h-16 bg-bg-secondary border-none rounded-2xl px-6 font-bold text-text-primary focus:ring-4 ring-primary/10 transition-all outline-none md:text-base text-sm"
                            value={formData.location}
                            onChange={(e) => setFormData({...formData, location: e.target.value})}
                        />
                    </div>

                    {/* Description */}
                    <div className="space-y-2 md:space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-text-tertiary ml-1 flex items-center gap-2">
                             <AlignLeft size={12} className="text-primary" /> About the Company
                        </label>
                        <textarea 
                            required
                            placeholder="Describe your company culture, mission, and what you're looking for..."
                            className="w-full bg-bg-secondary border-none rounded-2xl p-6 font-bold text-text-primary focus:ring-4 ring-primary/10 transition-all outline-none min-h-[140px] md:min-h-[160px] resize-none text-sm md:text-base"
                            value={formData.description}
                            onChange={(e) => setFormData({...formData, description: e.target.value})}
                        />
                    </div>

                    <button 
                        type="submit"
                        disabled={loading}
                        className="w-full h-14 md:h-16 bg-primary text-text-inverse rounded-2xl font-black shadow-lg shadow-primary/20 hover:bg-primary-light transition-all flex items-center justify-center gap-3 group/btn disabled:opacity-50 text-sm md:text-base"
                    >
                        {loading ? 'Finalizing...' : 'Go to Dashboard'}
                        {!loading && <ArrowRight size={20} className="group-hover/btn:translate-x-1 transition-transform" />}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CompanyOnboarding;
