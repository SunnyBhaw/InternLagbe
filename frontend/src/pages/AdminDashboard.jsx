import {
    Activity,
    AlertCircle,
    Briefcase,
    Building2,
    Calendar,
    ChevronRight,
    LayoutGrid,
    UserRound
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import api from '../utils/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalStudents: 0,
    totalCompanies: 0,
    totalInternships: 0,
    recentActivity: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // User details (Mocked for now)
  const userName = "System Admin";

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const res = await api.get('/admin/stats');
        setStats(res.data.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching stats:', err);
        setError('Failed to load system metrics');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    { 
        title: 'Total Internships', 
        value: stats.totalInternships, 
        icon: Briefcase, 
        color: 'text-primary', 
        bg: 'bg-primary/5'
    },
    { 
        title: 'Students Registered', 
        value: stats.totalStudents, 
        icon: UserRound, 
        color: 'text-emerald-600', 
        bg: 'bg-emerald-50'
    },
    { 
        title: 'Partner Companies', 
        value: stats.totalCompanies, 
        icon: Building2, 
        color: 'text-amber-600', 
        bg: 'bg-amber-50'
    },
  ];

  return (
    <div className="flex h-screen bg-bg-secondary overflow-hidden font-sans">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="h-20 bg-bg-primary border-b border-border-light flex items-center justify-between px-8">
          <div>
            <h2 className="text-2xl font-black text-primary tracking-tight">Overview</h2>
            <p className="text-sm text-text-tertiary font-medium">System performance and metrics</p>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-8 bg-bg-secondary custom-scrollbar">
          <div className="max-w-7xl mx-auto">
             
             {error && (
                <div className="mb-8 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center space-x-3 text-red-600 animate-in fade-in slide-in-from-top-4 duration-500">
                    <AlertCircle size={20} />
                    <p className="text-sm font-bold">{error}</p>
                </div>
             )}

             {/* Stats Cards */}
             <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
                {statCards.map((card, index) => {
                    const Icon = card.icon;
                    return (
                        <div 
                            key={index} 
                            className="bg-bg-primary p-6 rounded-3xl border border-border-light hover:border-primary/20 transition-all duration-300 group cursor-default"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className={`p-3 rounded-2xl ${card.bg} ${card.color} transition-transform duration-300 group-hover:scale-110`}>
                                    <Icon size={24} strokeWidth={2.5} />
                                </div>
                            </div>
                            <div>
                                <p className="text-text-tertiary text-xs font-black uppercase tracking-widest mb-1">{card.title}</p>
                                {loading ? (
                                    <div className="h-9 w-16 bg-bg-tertiary animate-pulse rounded-lg"></div>
                                ) : (
                                    <h3 className="text-3xl font-black text-primary tracking-tighter">{card.value}</h3>
                                )}
                            </div>
                        </div>
                    );
                })}
             </div>
             
             {/* Activity Snapshot Section */}
             <div className="bg-bg-primary rounded-[2.5rem] border border-border-light shadow-sm overflow-hidden">
                <div className="p-8 border-b border-border-light flex items-center justify-between bg-bg-tertiary/20">
                    <div className="flex items-center space-x-3">
                        <div className="h-10 w-10 rounded-xl bg-primary/5 text-primary flex items-center justify-center">
                            <Activity size={20} />
                        </div>
                        <h3 className="text-xl font-black text-primary">System Activity Snapshot</h3>
                    </div>
                    <Link to="/admin/reports" className="text-xs font-black text-primary hover:underline flex items-center group uppercase tracking-widest">
                        View Detailed Reports <ChevronRight size={14} className="ml-1 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
                
                {loading ? (
                    <div className="p-10 text-center">
                        <div className="h-8 w-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-text-tertiary font-bold animate-pulse">Fetching latest activities...</p>
                    </div>
                ) : stats.recentActivity?.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <tbody className="divide-y divide-border-light">
                                {stats.recentActivity.map((act, i) => (
                                    <tr key={i} className="hover:bg-bg-tertiary/5 transition-colors group">
                                        <td className="px-8 py-5">
                                            <div className="flex items-center space-x-3">
                                                <div className="h-9 w-9 rounded-lg bg-bg-tertiary flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                                    <Briefcase size={16} />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-primary">
                                                        <span className="text-text-secondary font-black">
                                                            {act.student?.studentProfile ? `${act.student.studentProfile.firstName} ${act.student.studentProfile.lastName}` : act.student?.name}
                                                        </span> 
                                                        <span className="text-text-tertiary font-medium mx-1">applied for</span>
                                                        <span className="font-black italic text-primary">"{act.internship?.title}"</span>
                                                    </p>
                                                    <p className="text-[10px] font-black uppercase text-text-tertiary mt-0.5 tracking-widest flex items-center gap-1">
                                                        <Building2 size={10} />
                                                        {act.internship?.company?.companyProfile?.companyName || act.internship?.company?.name}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <div className="flex items-center text-xs font-bold text-text-tertiary">
                                                <Calendar size={14} className="mr-2 opacity-50" />
                                                {new Date(act.createdAt).toLocaleString('en-US', { 
                                                    month: 'short', 
                                                    day: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </div>
                                        </td>
                                        <td className="px-8 py-5 text-right">
                                            <span className={`px-2 py-1 rounded-md text-[9px] font-black uppercase tracking-widest ${
                                                act.status === 'accepted' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                                                act.status === 'shortlisted' ? 'bg-amber-50 text-amber-600 border border-amber-100' :
                                                act.status === 'rejected' ? 'bg-red-50 text-red-600 border border-red-100' :
                                                'bg-bg-tertiary text-text-tertiary border border-border-light'
                                            }`}>
                                                {act.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="p-20 text-center">
                        <div className="bg-bg-tertiary h-16 w-16 rounded-2xl flex items-center justify-center mx-auto mb-4 text-text-tertiary opacity-30">
                            <LayoutGrid size={32} />
                        </div>
                        <p className="text-text-tertiary font-bold italic">No recent system activity found</p>
                    </div>
                )}
             </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
