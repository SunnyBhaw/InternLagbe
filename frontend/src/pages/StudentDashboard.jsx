import {
    ArrowUpRight,
    Briefcase,
    Building2,
    CheckCircle,
    ChevronRight,
    Clock,
    Rocket,
    Search,
    Target,
    Trophy
} from 'lucide-react';
import { useEffect, useState } from 'react';
import ProfileBanner from '../components/ProfileBanner';
import StudentSidebar from '../components/StudentSidebar';
import api from '../utils/api';

const StudentDashboard = () => {
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalApplications: 0,
        accepted: 0,
        pending: 0
    });
    const [recentApps, setRecentApps] = useState([]);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                // Fetch profile, applications, and persona profile in parallel
                const [userRes, appRes, profileRes] = await Promise.all([
                    api.get('/auth/me'),
                    api.get('/applications/my'),
                    api.get('/profile/me').catch(() => ({ data: { data: null } }))
                ]);

                setUser(userRes.data.data);
                setProfile(profileRes.data.data);
                
                const apps = appRes.data.data;
                setRecentApps(apps.slice(0, 3)); // Get last 3 applications
                setStats({
                    totalApplications: apps.length,
                    accepted: apps.filter(a => a.status === 'accepted').length,
                    pending: apps.filter(a => a.status === 'pending').length
                });

                setLoading(false);
            } catch (err) {
                console.error('Error fetching dashboard data:', err);
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-bg-primary">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-bg-primary overflow-hidden font-sans text-text-primary">
            <StudentSidebar user={user} />
            
            <main className="flex-1 overflow-y-auto p-10">
                <ProfileBanner />
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
                    <div>
                        <h1 className="text-4xl font-black tracking-tight mb-2 text-text-primary">
                            Welcome back, <span className="text-primary">{profile?.firstName || user?.name?.split(' ')[0]}!</span> 👋
                        </h1>
                        <p className="text-text-tertiary font-bold tracking-wide uppercase text-xs">
                            Here's what's happening with your career discovery.
                        </p>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    {/* Total Applications Card */}
                    <div className="bg-bg-primary p-6 rounded-3xl border border-border-light shadow-sm hover:shadow-xl hover:shadow-primary/5 hover:border-primary/20 transition-all duration-500">
                        <div className="flex items-center justify-between mb-4">
                            <div className="bg-primary/10 p-3 rounded-xl text-primary">
                                <Briefcase size={22} strokeWidth={2.5} />
                            </div>
                        </div>
                        <div>
                            <h3 className="text-4xl font-black mb-1 lining-nums tracking-tighter">{stats.totalApplications}</h3>
                            <p className="text-text-tertiary font-black text-[10px] uppercase tracking-widest leading-none">Applications Sent</p>
                        </div>
                    </div>

                    {/* Shortlisted Card */}
                    <div className="bg-bg-primary p-6 rounded-3xl border border-border-light shadow-sm hover:shadow-xl hover:shadow-green-500/5 transition-all duration-500">
                        <div className="flex items-center justify-between mb-4">
                            <div className="bg-green-500/10 p-3 rounded-xl text-green-500">
                                <CheckCircle size={22} strokeWidth={2.5} />
                            </div>
                        </div>
                        <div>
                            <h3 className="text-4xl font-black mb-1 lining-nums tracking-tighter text-green-500">{stats.accepted}</h3>
                            <p className="text-text-tertiary font-black text-[10px] uppercase tracking-widest leading-none">accepted</p>
                        </div>
                    </div>

                    {/* Pending Card */}
                    <div className="bg-bg-primary p-6 rounded-3xl border border-border-light shadow-sm hover:shadow-xl hover:shadow-secondary/20 transition-all duration-500">
                        <div className="flex items-center justify-between mb-4">
                            <div className="bg-secondary/20 p-3 rounded-xl text-primary">
                                <Clock size={22} strokeWidth={2.5} />
                            </div>
                        </div>
                        <div>
                            <h3 className="text-4xl font-black mb-1 lining-nums tracking-tighter text-primary">{stats.pending}</h3>
                            <p className="text-text-tertiary font-black text-[10px] uppercase tracking-widest leading-none">Pending Review</p>
                        </div>
                    </div>
                </div>

                {/* Dynamic Content Area */}
                {profile?.isProfileComplete === 0 ? (
                    <div className="bg-bg-primary rounded-3xl border border-border-light p-10 min-h-[400px] flex items-center justify-center border-dashed border-2 relative overflow-hidden group">
                        <div className="text-center relative z-10">
                            <div className="bg-bg-tertiary h-24 w-24 rounded-[2rem] flex items-center justify-center mx-auto mb-8 text-primary/30 border border-border-light rotate-3 group-hover:rotate-0 transition-transform duration-500">
                                <Search size={48} />
                            </div>
                            <h2 className="text-2xl font-black mb-4">Start your journey</h2>
                            <p className="text-text-tertiary font-bold max-w-md mx-auto mb-4">
                                You haven't applied to any internships yet. Browse the marketplace to find opportunities that match your skills.
                            </p>
                            <a href="/student/browse" className="text-primary font-black uppercase text-xs tracking-widest hover:underline">
                                Browse Internships →
                            </a>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
                        {/* Live Application Feed */}
                        <div className="lg:col-span-3 space-y-8">
                            <div className="flex items-center justify-between">
                                <h2 className="text-2xl font-black flex items-center gap-3">
                                    Feed
                                </h2>
                                <a href="/student/applications" className="text-xs font-black uppercase tracking-widest text-primary hover:underline flex items-center gap-1 group">
                                    View All <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                </a>
                            </div>

                            <div className="space-y-4">
                                {recentApps.map((app, idx) => (
                                    <div key={idx} className="bg-white p-6 rounded-[2rem] border border-border-light shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex items-center justify-between group">
                                        <div className="flex items-center gap-5">
                                            <div className="h-14 w-14 rounded-2xl bg-primary/5 flex items-center justify-center text-primary border border-primary/5">
                                                <Building2 size={24} />
                                            </div>
                                            <div>
                                                <h4 className="font-black text-text-primary group-hover:text-primary transition-colors line-clamp-1">{app.internship?.title}</h4>
                                                <p className="text-sm font-bold text-text-tertiary flex items-center gap-2">
                                                    {app.internship?.company?.companyProfile?.companyName || app.internship?.company?.name} • {new Date(app.createdAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-6">
                                            <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                                                app.status === 'shortlisted' 
                                                ? 'bg-green-50 text-green-600 border-green-100' 
                                                : (new Date(app.internship?.deadline) <= new Date() 
                                                   ? 'bg-red-50 text-red-600 border-red-100' 
                                                   : 'bg-primary/5 text-primary border-primary/10')
                                            }`}>
                                                {new Date(app.internship?.deadline) < new Date() ? 'expired' : app.status}
                                            </span>
                                            <a href={`/student/internship/${app.internship?._id}`} className="h-10 w-10 rounded-xl bg-bg-secondary flex items-center justify-center text-text-tertiary hover:bg-primary hover:text-text-inverse transition-all">
                                                <ArrowUpRight size={18} />
                                            </a>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Evolution Roadmap */}
                        <div className="lg:col-span-2 space-y-8">
                            <h2 className="text-2xl font-black">Your Journey</h2>
                            
                            <div className="bg-bg-primary p-8 rounded-[2.5rem] border border-border-light shadow-inner relative overflow-hidden h-full">
                                {/* Vertical Path Line */}
                                <div className="absolute left-[3.25rem] top-12 bottom-12 w-1 bg-gradient-to-b from-primary via-primary/20 to-bg-secondary rounded-full"></div>
                                
                                <div className="space-y-12 relative z-10">
                                    {/* Step 1: Profile */}
                                    <div className="flex items-start gap-6">
                                        <div className={`h-10 w-10 shrink-0 rounded-xl flex items-center justify-center shadow-lg ${profile?.isProfileComplete ? 'bg-primary text-text-inverse' : 'bg-bg-secondary text-text-tertiary  pulse-subtle'}`}>
                                            <Trophy size={20} />
                                        </div>
                                        <div>
                                            <h4 className={`text-sm font-black uppercase tracking-widest ${profile?.isProfileComplete ? 'text-text-primary' : 'text-text-tertiary'}`}>Profile Identity</h4>
                                            <p className="text-xs font-bold text-text-tertiary mt-1">
                                                {profile?.isProfileComplete ? 'Profile Completed' : 'Complete your profile to start'}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Step 2: Discovery */}
                                    <div className="flex items-start gap-6">
                                        <div className={`h-10 w-10 shrink-0 rounded-xl flex items-center justify-center shadow-lg ${stats.totalApplications > 0 ? 'bg-primary text-text-inverse' : 'bg-bg-secondary text-text-tertiary pulse-subtle'}`}>
                                            <Target size={20} />
                                        </div>
                                        <div>
                                            <h4 className={`text-sm font-black uppercase tracking-widest ${stats.totalApplications > 0 ? 'text-text-primary' : 'text-text-tertiary'}`}>Market Discovery</h4>
                                            <p className="text-xs font-bold text-text-tertiary mt-1">
                                                {stats.totalApplications > 0 ? `Sent ${stats.totalApplications} applications` : 'Applying for your first role'}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Step 3: Interview */}
                                    <div className="flex items-start gap-6">
                                        <div className={`h-10 w-10 shrink-0 rounded-xl flex items-center justify-center shadow-lg ${stats.accepted ? 'bg-primary text-text-inverse' : 'bg-bg-secondary text-text-tertiary pulse-subtle'}`}>
                                            <Rocket size={20} />
                                        </div>
                                        <div>
                                            <h4 className={`text-sm font-black uppercase tracking-widest ${stats.accepted ? 'text-text-primary' : 'text-text-tertiary'}`}>Job Status</h4>
                                            <p className="text-xs font-bold text-text-tertiary mt-1">
                                                {stats.accepted ? `Congratulations` : 'Apply more internship'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default StudentDashboard;
