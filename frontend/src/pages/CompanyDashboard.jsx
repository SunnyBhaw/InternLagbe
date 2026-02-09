import {
    ArrowUpRight,
    ChevronRight,
    Loader2,
    Users
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import CompanySidebar from '../components/CompanySidebar';
import MobileHeader from '../components/MobileHeader';
import ProfileBanner from '../components/ProfileBanner';
import api from '../utils/api';

const CompanyDashboard = () => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState({
    activePostings: 0,
    totalApplications: 0,
    shortlisted: 0
  });
  const [recentApps, setRecentApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [userRes, statsRes, profileRes, appRes] = await Promise.all([
          api.get('/auth/me'),
          api.get('/internships/stats'),
          api.get('/profile/me').catch(() => ({ data: { data: null } })),
          api.get('/applications/company')
        ]);
        setUser(userRes.data.data);
        setStats(statsRes.data.data);
        setProfile(profileRes.data.data);
        setRecentApps(appRes.data.data.slice(0, 5)); // Get last 5 applications
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-bg-secondary">
        <Loader2 className="animate-spin text-primary" size={48} />
      </div>
    );
  }

  const userName = profile?.companyName || (user?.name || "Company");

  const statItems = [
    { label: 'Active Postings', value: stats.activePostings },
    { label: 'Total Applications', value: stats.totalApplications },
    { label: 'Shortlisted', value: stats.shortlisted },
  ];

  return (
    <div className="flex flex-col lg:flex-row min-h-screen lg:h-screen bg-bg-secondary lg:overflow-hidden font-sans text-text-primary">
      <CompanySidebar user={user} isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <MobileHeader isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} role="company" />

        <header className="hidden lg:flex h-20 bg-bg-primary border-b border-border-light items-center justify-between px-8">
          <div>
            <h2 className="text-2xl font-black text-primary tracking-tight">Recruitment Hub</h2>
            <p className="text-sm text-text-tertiary font-medium">Welcome back, {userName}</p>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 md:p-10 bg-bg-secondary custom-scrollbar shadow-inner">
          <div className="max-w-7xl mx-auto">
            <ProfileBanner />

            {/* Mobile Welcome (only visible on small screens) */}
            <div className="lg:hidden mb-8 min-w-0">
               <h1 className="text-3xl font-black text-text-primary mb-1">Welcome,</h1>
               <p className="text-primary font-bold truncate text-xl">{userName}</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:8 mb-10">
              {statItems.map((item, idx) => (
                <div key={idx} className="p-6 md:p-8 bg-white rounded-3xl border border-border-light shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                  <p className="text-[10px] md:text-sm font-bold text-text-tertiary uppercase tracking-wider mb-2">{item.label}</p>
                  <p className="text-4xl md:text-5xl font-black text-primary lining-nums tracking-tighter">{item.value}</p>
                </div>
              ))}
            </div>
            
            {/* Main Content Area */}
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <h2 className="text-xl md:text-2xl font-black flex items-center gap-3">
                  Latest Applications
                </h2>
                <Link to="/company/applications" className="text-[10px] md:text-xs font-black uppercase tracking-widest text-primary hover:underline flex items-center gap-1 group">
                  Manage All <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>

              <div className="space-y-4">
                {recentApps.length > 0 ? (
                  recentApps.map((app, idx) => (
                    <div key={idx} className="bg-white p-5 md:p-6 rounded-[2rem] border border-border-light shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group">
                      <div className="flex items-center gap-4 md:gap-5 min-w-0 flex-1">
                        <div className="h-12 w-12 md:h-14 md:w-14 rounded-2xl bg-primary/5 flex items-center justify-center text-primary border border-primary/5 shrink-0">
                          <div className="h-8 w-8 rounded-lg bg-primary text-text-inverse flex items-center justify-center text-[10px] font-black">
                            {(() => {
                              const profileName = app.student?.studentProfile 
                                ? `${app.student.studentProfile.firstName} ${app.student.studentProfile.lastName}`
                                : app.student?.name;
                              return profileName?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
                            })()}
                          </div>
                        </div>
                        <div className="min-w-0 flex-1">
                          <h4 className="font-black text-text-primary group-hover:text-primary transition-colors line-clamp-1 text-sm md:text-base">
                            {app.student?.studentProfile 
                              ? `${app.student.studentProfile.firstName} ${app.student.studentProfile.lastName}`
                              : app.student?.name}
                          </h4>
                          <div className="text-[10px] md:text-sm font-bold text-text-tertiary flex flex-wrap items-center gap-x-2 gap-y-1 mt-0.5">
                             <span className="leading-tight">{app.internship?.title}</span>
                             <span className="text-text-tertiary/40">•</span>
                             <span className="shrink-0">{new Date(app.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-3 md:gap-6 mt-2 sm:mt-0 pt-3 sm:pt-0 border-t sm:border-t-0 border-border-light/50">
                        <span className={`px-3 md:px-4 py-1.5 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-widest border shrink-0 ${
                          app.status === 'shortlisted' 
                            ? 'bg-green-50 text-green-600 border-green-100' 
                            : (app.status === 'rejected' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-primary/5 text-primary border-primary/10')
                        }`}>
                          {app.status}
                        </span>
                        <button 
                          onClick={() => window.open(`http://localhost:5000/${app.resume}`, '_blank')}
                          className="h-10 w-10 rounded-xl bg-bg-secondary flex items-center justify-center text-text-tertiary hover:bg-primary hover:text-text-inverse transition-all"
                          title="View Resume"
                        >
                          <ArrowUpRight size={18} />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="bg-white border border-dashed border-border-medium p-12 md:p-20 rounded-[2.5rem] flex flex-col items-center text-center">
                    <Users className="text-primary/20 mb-4" size={48} />
                    <p className="text-text-tertiary font-bold text-sm md:text-base">No applications yet. Your feed will grow as students apply.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CompanyDashboard;
