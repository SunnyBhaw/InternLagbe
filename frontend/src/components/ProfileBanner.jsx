import { AlertCircle, ArrowRight, Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';

const ProfileBanner = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [loading, setLoading] = useState(true);
    const [role, setRole] = useState(null);

    useEffect(() => {
        const checkProfile = async () => {
            try {
                const [userRes, profileRes] = await Promise.all([
                    api.get('/auth/me'),
                    api.get('/profile/me')
                ]);
                
                setRole(userRes.data.data.role);
                
                // If profile exists but is not complete, show banner
                if (!profileRes.data.data.isProfileComplete) {
                    setIsVisible(true);
                }
            } catch (err) {
                // If profile not found (404), it means it's definitely incomplete
                if (err.response && err.response.status === 404) {
                    setIsVisible(true);
                    // Still need role to get the right link
                    try {
                        const userRes = await api.get('/auth/me');
                        setRole(userRes.data.data.role);
                    } catch (e) {}
                }
            } finally {
                setLoading(false);
            }
        };

        checkProfile();
    }, []);

    if (loading || !isVisible) return null;

    return (
        <div className="mb-8 relative group">
            {/* Animated Background Glow */}
            <div className="absolute -inset-1 bg-gradient-to-r from-primary to-secondary rounded-[2rem] blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
            
            <div className="relative bg-bg-primary border border-primary/20 p-6 md:p-8 rounded-[2rem] shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden">
                {/* Decorative Pattern */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -mr-10 -mt-10"></div>
                
                <div className="flex items-center gap-6 relative z-10">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <AlertCircle size={16} className="text-primary" />
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Requirement</span>
                        </div>
                        <h2 className="text-xl font-black tracking-tight text-text-primary">
                            Complete your profile to start applying
                        </h2>
                        <p className="text-text-tertiary text-sm font-bold max-w-md">
                            Tell us more about your skills and education to unlock the marketplace.
                        </p>
                    </div>
                </div>

                <Link 
                    to={role === 'company' ? '/company/onboarding' : '/student/onboarding'} 
                    className="relative z-10 flex items-center gap-3 px-8 py-4 bg-primary text-text-inverse rounded-2xl font-black text-sm hover:bg-primary-light transition-all shadow-lg hover:shadow-primary/30 group/btn"
                >
                    Complete Now
                    <ArrowRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
                </Link>
            </div>
        </div>
    );
};

export default ProfileBanner;
