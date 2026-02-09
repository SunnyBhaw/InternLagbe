import {
    AlertCircle,
    AlignLeft,
    Building2,
    Check,
    Edit3,
    Loader2,
    MapPin,
    Save,
    X
} from 'lucide-react';
import { useEffect, useState } from 'react';
import CompanySidebar from '../components/CompanySidebar';
import MobileHeader from '../components/MobileHeader';
import api from '../utils/api';

const CompanyProfile = () => {
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        companyName: '',
        location: '',
        description: ''
    });

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
                    companyName: profileData.companyName || '',
                    location: profileData.location || '',
                    description: profileData.description || ''
                });
            }
            setLoading(false);
        } catch (err) {
            console.error('Error fetching profile:', err);
            setLoading(false);
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        try {
            const res = await api.post('/profile', formData);
            setProfile(res.data.data);
            setSuccess('Profile updated successfully!');
            setIsEditing(false);
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to update profile');
        }
    };

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-bg-secondary">
                <Loader2 className="animate-spin text-primary" size={48} />
            </div>
        );
    }

    const initials = (profile?.companyName || user?.name || "C")
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);

    return (
        <div className="flex flex-col lg:flex-row min-h-screen lg:h-screen bg-bg-secondary lg:overflow-hidden text-text-primary">
            <CompanySidebar user={user} isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

            <div className="flex-1 flex flex-col overflow-hidden">
                <MobileHeader isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} role="company" />
                
                {/* Desktop Header */}
                <header className="hidden lg:flex h-20 bg-bg-primary border-b border-border-light items-center justify-between px-8">
                    <div>
                        <h2 className="text-2xl font-black text-primary tracking-tight">Business Profile</h2>
                        <p className="text-sm text-text-tertiary font-medium">Manage your company identity</p>
                    </div>
                    
                    {!isEditing ? (
                        <button 
                            onClick={() => setIsEditing(true)}
                            className="flex items-center gap-2 px-6 py-2.5 bg-primary text-text-inverse rounded-xl font-black text-xs uppercase tracking-widest hover:bg-primary-light transition-all shadow-lg active:scale-95"
                        >
                            <Edit3 size={14} />
                            <span>Edit Profile</span>
                        </button>
                    ) : (
                        <div className="flex items-center gap-3">
                            <button 
                                onClick={() => setIsEditing(false)}
                                className="flex items-center gap-2 px-6 py-2.5 bg-bg-tertiary text-text-tertiary rounded-xl font-black text-xs uppercase tracking-widest hover:bg-border-light transition-all border border-border-light active:scale-95"
                            >
                                <X size={14} />
                                <span>Cancel</span>
                            </button>
                            <button 
                                onClick={handleSave}
                                className="flex items-center gap-2 px-6 py-2.5 bg-primary text-text-inverse rounded-xl font-black text-xs uppercase tracking-widest hover:bg-primary-light transition-all shadow-lg active:scale-95"
                            >
                                <Save size={14} />
                                <span>Save Changes</span>
                            </button>
                        </div>
                    )}
                </header>

                <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-bg-secondary custom-scrollbar">
                    <div className="max-w-4xl mx-auto">
                        
                        {/* Mobile Title */}
                        <div className="lg:hidden mb-6 flex items-center justify-between">
                            <div>
                                <h1 className="text-2xl font-black text-primary tracking-tight">Profile</h1>
                                <p className="text-[10px] text-text-tertiary font-black uppercase tracking-widest">Business Card</p>
                            </div>
                            {!isEditing && (
                                <button 
                                    onClick={() => setIsEditing(true)}
                                    className="p-3 bg-primary text-text-inverse rounded-xl shadow-lg active:scale-95"
                                >
                                    <Edit3 size={18} />
                                </button>
                            )}
                        </div>

                        {success && (
                            <div className="mb-6 md:mb-8 p-4 bg-green-50 text-green-600 rounded-2xl text-sm font-bold border border-green-100 flex items-center gap-3 animate-in fade-in slide-in-from-top-4">
                                <Check size={18} />
                                {success}
                            </div>
                        )}

                        {error && (
                            <div className="mb-6 md:mb-8 p-4 bg-red-50 text-red-600 rounded-2xl text-sm font-bold border border-red-100 flex items-center gap-3 animate-in fade-in slide-in-from-top-4">
                                <AlertCircle size={18} />
                                {error}
                            </div>
                        )}

                        <div className="bg-white rounded-3xl md:rounded-[2.5rem] border border-border-light shadow-sm overflow-hidden mb-8 md:mb-12">
                            {/* Profile Header Block */}
                            <div className="p-6 md:p-12 border-b border-border-light bg-bg-tertiary/20">
                                <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8">
                                    <div className="h-24 w-24 md:h-32 md:w-32 rounded-3xl md:rounded-[2.5rem] bg-primary flex items-center justify-center text-text-inverse text-2xl md:text-4xl font-black shadow-xl border-4 border-white shrink-0">
                                        {initials}
                                    </div>
                                    <div className="text-center md:text-left space-y-2">
                                        <h1 className="text-2xl md:text-4xl font-black text-primary tracking-tight">
                                            {isEditing ? 'Company Details' : (profile?.companyName || 'Establish Identity')}
                                        </h1>
                                        <div className="flex items-center justify-center md:justify-start gap-4 text-text-tertiary font-bold text-xs">
                                            <span>Member since {new Date(user?.createdAt).getFullYear()}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 md:p-12 space-y-8 md:space-y-12">
                                {/* Basic Info Section */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-text-tertiary flex items-center gap-2 ml-1">
                                            <Building2 size={12} className="text-primary" /> Name
                                        </label>
                                        {isEditing ? (
                                            <input 
                                                type="text"
                                                className="w-full h-12 md:h-14 bg-bg-secondary border-none rounded-xl px-4 font-bold text-primary focus:ring-4 ring-primary/5 transition-all outline-none"
                                                value={formData.companyName}
                                                onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                                            />
                                        ) : (
                                            <p className="text-sm md:text-lg font-bold text-text-primary bg-bg-secondary p-4 rounded-xl border border-border-light/50">
                                                {profile?.companyName || 'Missing name'}
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-text-tertiary flex items-center gap-2 ml-1">
                                            <MapPin size={12} className="text-primary" /> Location
                                        </label>
                                        {isEditing ? (
                                            <input 
                                                type="text"
                                                className="w-full h-12 md:h-14 bg-bg-secondary border-none rounded-xl px-4 font-bold text-primary focus:ring-4 ring-primary/5 transition-all outline-none"
                                                value={formData.location}
                                                onChange={(e) => setFormData({...formData, location: e.target.value})}
                                            />
                                        ) : (
                                            <p className="text-sm md:text-lg font-bold text-text-primary bg-bg-secondary p-4 rounded-xl border border-border-light/50">
                                                {profile?.location || 'Global'}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* About Section */}
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-text-tertiary flex items-center gap-2 ml-1">
                                        <AlignLeft size={12} className="text-primary" /> Description
                                    </label>
                                    {isEditing ? (
                                        <textarea 
                                            className="w-full bg-bg-secondary border-none rounded-xl p-5 md:p-6 font-bold text-primary focus:ring-4 ring-primary/5 transition-all outline-none min-h-[160px] md:min-h-[200px] resize-none"
                                            value={formData.description}
                                            onChange={(e) => setFormData({...formData, description: e.target.value})}
                                        />
                                    ) : (
                                        <div className="bg-bg-secondary p-6 md:p-8 rounded-2xl border border-border-light/50">
                                            <p className="text-sm md:text-text-primary font-bold leading-relaxed whitespace-pre-wrap">
                                                {profile?.description || 'Your mission starts here...'}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Mobile Actions */}
                        {isEditing && (
                            <div className="lg:hidden flex gap-4 mt-6">
                                <button 
                                    onClick={() => setIsEditing(false)}
                                    className="flex-1 h-14 bg-bg-tertiary text-text-tertiary rounded-2xl font-black shadow-sm"
                                >
                                    Cancel
                                </button>
                                <button 
                                    onClick={handleSave}
                                    className="flex-[2] h-14 bg-primary text-text-inverse rounded-2xl font-black shadow-lg shadow-primary/20"
                                >
                                    Confirm Changes
                                </button>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default CompanyProfile;
