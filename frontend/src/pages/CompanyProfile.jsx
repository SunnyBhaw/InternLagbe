import {
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
import api from '../utils/api';

const CompanyProfile = () => {
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

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
        <div className="flex h-screen bg-bg-secondary overflow-hidden text-text-primary">
            <CompanySidebar user={user} />

            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="h-20 bg-bg-primary border-b border-border-light flex items-center justify-between px-8">
                    <div>
                        <h2 className="text-2xl font-black text-primary tracking-tight">Business Profile</h2>
                        <p className="text-sm text-text-tertiary font-medium">Manage your company identity</p>
                    </div>
                    
                    {!isEditing ? (
                        <button 
                            onClick={() => setIsEditing(true)}
                            className="flex items-center gap-2 px-6 py-2.5 bg-primary text-text-inverse rounded-xl font-black text-xs uppercase tracking-widest hover:bg-primary-light transition-all shadow-lg shadow-primary/20 active:scale-95"
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
                                className="flex items-center gap-2 px-6 py-2.5 bg-primary text-text-inverse rounded-xl font-black text-xs uppercase tracking-widest hover:bg-primary-light transition-all shadow-lg shadow-primary/20 active:scale-95"
                            >
                                <Save size={14} />
                                <span>Save Changes</span>
                            </button>
                        </div>
                    )}
                </header>

                <main className="flex-1 overflow-y-auto p-8 bg-bg-secondary custom-scrollbar">
                    <div className="max-w-4xl mx-auto">
                        
                        {success && (
                            <div className="mb-8 p-4 bg-green-50 text-green-600 rounded-2xl text-sm font-bold border border-green-100 flex items-center gap-3 animate-in fade-in slide-in-from-top-4">
                                <Check size={18} />
                                {success}
                            </div>
                        )}

                        {error && (
                            <div className="mb-8 p-4 bg-red-50 text-red-600 rounded-2xl text-sm font-bold border border-red-100 flex items-center gap-3 animate-in fade-in slide-in-from-top-4">
                                <AlertCircle size={18} />
                                {error}
                            </div>
                        )}

                        <div className="bg-white rounded-[2.5rem] border border-border-light shadow-sm overflow-hidden mb-12">
                            {/* Profile Header Block */}
                            <div className="p-12 border-b border-border-light bg-bg-tertiary/20">
                                <div className="flex flex-col md:flex-row items-center gap-8">
                                    <div className="h-32 w-32 rounded-[2.5rem] bg-primary flex items-center justify-center text-text-inverse text-4xl font-black shadow-xl border-4 border-white">
                                        {initials}
                                    </div>
                                    <div className="text-center md:text-left space-y-2">
                                        <h1 className="text-4xl font-black text-primary tracking-tight">
                                            {isEditing ? 'Editing Profile' : (profile?.companyName || 'Set up your company')}
                                        </h1>
                                        <div className="flex items-center justify-center md:justify-start gap-4 text-text-tertiary font-bold">
                                            <span>Member since {new Date(user?.createdAt).getFullYear()}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="p-12 space-y-12">
                                {/* Basic Info Section */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-text-tertiary flex items-center gap-2 ml-1">
                                            <Building2 size={12} className="text-primary" /> Company Name
                                        </label>
                                        {isEditing ? (
                                            <input 
                                                type="text"
                                                className="w-full h-14 bg-bg-secondary border-none rounded-xl px-4 font-bold text-primary focus:ring-4 ring-primary/5 transition-all outline-none"
                                                value={formData.companyName}
                                                onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                                            />
                                        ) : (
                                            <p className="text-lg font-bold text-text-primary bg-bg-secondary p-4 rounded-xl border border-border-light/50">
                                                {profile?.companyName || 'Not set'}
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-text-tertiary flex items-center gap-2 ml-1">
                                            <MapPin size={12} className="text-primary" /> Location
                                        </label>
                                        {isEditing ? (
                                            <input 
                                                type="text"
                                                className="w-full h-14 bg-bg-secondary border-none rounded-xl px-4 font-bold text-primary focus:ring-4 ring-primary/5 transition-all outline-none"
                                                value={formData.location}
                                                onChange={(e) => setFormData({...formData, location: e.target.value})}
                                            />
                                        ) : (
                                            <p className="text-lg font-bold text-text-primary bg-bg-secondary p-4 rounded-xl border border-border-light/50">
                                                {profile?.location || 'Not set'}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* About Section */}
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-text-tertiary flex items-center gap-2 ml-1">
                                        <AlignLeft size={12} className="text-primary" /> Company Description
                                    </label>
                                    {isEditing ? (
                                        <textarea 
                                            className="w-full bg-bg-secondary border-none rounded-xl p-6 font-bold text-primary focus:ring-4 ring-primary/5 transition-all outline-none min-h-[200px] resize-none"
                                            value={formData.description}
                                            onChange={(e) => setFormData({...formData, description: e.target.value})}
                                        />
                                    ) : (
                                        <div className="bg-bg-secondary p-8 rounded-2xl border border-border-light/50">
                                            <p className="text-text-primary font-bold leading-relaxed whitespace-pre-wrap">
                                                {profile?.description || 'Introduce your company to potential interns...'}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default CompanyProfile;
