import {
    Activity,
    ArrowUpRight,
    BarChart3,
    Briefcase,
    Calendar,
    Loader2,
    PieChart,
    TrendingUp,
    Users
} from 'lucide-react';
import { useEffect, useState } from 'react';
import MobileHeader from '../components/MobileHeader';
import Sidebar from '../components/Sidebar';
import api from '../utils/api';

const AdminReports = () => {
    const [reportData, setReportData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    useEffect(() => {
        fetchReport();
    }, []);

    const fetchReport = async () => {
        try {
            setLoading(true);
            const res = await api.get('/admin/reports');
            setReportData(res.data.data);
            setError(null);
        } catch (err) {
            console.error('Error fetching report:', err);
            setError('Failed to load platform analytics');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col lg:flex-row h-screen bg-bg-secondary overflow-hidden font-sans">
                <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
                <div className="flex-1 flex flex-col">
                    <MobileHeader isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} role="admin" />
                    <div className="flex-1 flex items-center justify-center">
                        <div className="text-center">
                            <Loader2 size={48} className="text-primary animate-spin mx-auto mb-4" />
                            <p className="text-text-tertiary font-bold animate-pulse">Generating Report...</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const { userGrowth, applicationSummary, categoryStats, recentActivity } = reportData;

    return (
        <div className="flex flex-col lg:flex-row h-screen bg-bg-secondary overflow-hidden font-sans">
            <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

            <div className="flex-1 flex flex-col overflow-hidden">
                <MobileHeader isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} role="admin" />

                <header className="hidden lg:flex h-20 bg-bg-primary border-b border-border-light items-center justify-between px-8">
                    <div>
                        <h2 className="text-2xl font-black text-primary tracking-tight">Platform Reports</h2>
                        <p className="text-sm text-text-tertiary font-medium">Real-time analytics and growth metrics</p>
                    </div>
                    <button 
                        onClick={fetchReport}
                        className="flex items-center space-x-2 px-4 py-2 bg-bg-tertiary hover:bg-border-light text-primary rounded-xl border border-border-light transition-all font-bold text-sm"
                    >
                        <Activity size={16} />
                        <span>Refresh Data</span>
                    </button>
                </header>

                <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-bg-secondary custom-scrollbar">
                    <div className="max-w-7xl mx-auto space-y-8">
                        
                        {/* Summary Metrics */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                            {[
                                { label: 'Total Applications', value: applicationSummary.total, icon: BarChart3, color: 'blue' },
                                { label: 'Shortlisted', value: applicationSummary.shortlisted, icon: TrendingUp, color: 'amber' },
                                { label: 'Accepted', value: applicationSummary.accepted, icon: ArrowUpRight, color: 'emerald' },
                                { label: 'Total Internships', value: reportData.totalInternships, icon: Briefcase, color: 'primary' },
                            ].map((stat, i) => {
                                const Icon = stat.icon;
                                return (
                                    <div key={i} className="bg-bg-primary p-6 rounded-[2rem] border border-border-light shadow-sm hover:shadow-md transition-shadow">
                                        <div className={`h-12 w-12 rounded-2xl bg-${stat.color === 'primary' ? 'primary/5' : stat.color + '-50'} text-${stat.color === 'primary' ? 'primary' : stat.color + '-600'} flex items-center justify-center mb-4`}>
                                            <Icon size={24} />
                                        </div>
                                        <p className="text-text-tertiary text-[10px] font-black uppercase tracking-widest mb-1">{stat.label}</p>
                                        <h3 className="text-2xl md:text-3xl font-black text-primary lining-nums tracking-tighter">{stat.value}</h3>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Category Distribution */}
                            <div className="bg-bg-primary rounded-[2.5rem] border border-border-light p-6 md:p-8 shadow-sm">
                                <div className="flex items-center justify-between mb-8">
                                    <div className="flex items-center space-x-3">
                                        <div className="h-10 w-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                                            <PieChart size={20} />
                                        </div>
                                        <h3 className="text-lg md:text-xl font-black text-primary">Top Categories</h3>
                                    </div>
                                </div>
                                <div className="space-y-6">
                                    {categoryStats.map((cat, i) => {
                                        const sumCount = categoryStats.reduce((acc, curr) => acc + curr.count, 0);
                                        const percentage = sumCount > 0 ? Math.round((cat.count / sumCount) * 100) : 0;
                                        return (
                                            <div key={i}>
                                                <div className="flex justify-between items-center mb-2">
                                                    <span className="text-xs md:text-sm font-bold text-text-secondary">{cat._id}</span>
                                                    <span className="text-[10px] md:text-xs font-black text-primary">{cat.count} Posts</span>
                                                </div>
                                                <div className="h-2.5 w-full bg-bg-tertiary rounded-full overflow-hidden">
                                                    <div 
                                                        className="h-full bg-primary rounded-full transition-all duration-1000"
                                                        style={{ width: `${percentage}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* User Base Split */}
                            <div className="bg-bg-primary rounded-[2.5rem] border border-border-light p-6 md:p-8 shadow-sm">
                                <div className="flex items-center justify-between mb-10">
                                    <div className="flex items-center space-x-3">
                                        <div className="h-10 w-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                                            <Users size={20} />
                                        </div>
                                        <h3 className="text-lg md:text-xl font-black text-primary">User Base Distribution</h3>
                                    </div>
                                </div>
                                <div className="flex items-center justify-center py-6 md:py-10 relative">
                                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                        <div className="text-center">
                                            <p className="text-3xl md:text-[40px] font-black text-primary leading-none">
                                                {userGrowth.students + userGrowth.companies}
                                            </p>
                                            <p className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest mt-1">Total Users</p>
                                        </div>
                                    </div>
                                    <div className="w-44 h-44 md:w-56 md:h-56 rounded-full border-[12px] md:border-[16px] border-bg-tertiary flex items-center justify-center">
                                        <div 
                                            className="w-full h-full rounded-full border-[12px] md:border-[16px] border-primary border-t-transparent border-r-transparent rotate-45"
                                        ></div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4 mt-8">
                                    <div className="p-4 bg-bg-tertiary rounded-2xl border border-border-light">
                                        <p className="text-[10px] font-black text-text-tertiary uppercase tracking-widest">Students</p>
                                        <p className="text-xl md:text-2xl font-black text-emerald-500 mt-1">{userGrowth.students}</p>
                                    </div>
                                    <div className="p-4 bg-bg-tertiary rounded-2xl border border-border-light">
                                        <p className="text-[10px] font-black text-text-tertiary uppercase tracking-widest">Companies</p>
                                        <p className="text-xl md:text-2xl font-black text-blue-500 mt-1">{userGrowth.companies}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Recent Activity Table */}
                        <div className="bg-bg-primary rounded-[2.5rem] border border-border-light shadow-sm overflow-hidden mb-10">
                            <div className="p-6 md:p-8 border-b border-border-light flex items-center justify-between bg-bg-tertiary/20">
                                <div className="flex items-center space-x-3">
                                    <div className="h-10 w-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                                        <Activity size={20} />
                                    </div>
                                    <h3 className="text-lg md:text-xl font-black text-primary">System Activity Feed</h3>
                                </div>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left min-w-[600px]">
                                    <thead>
                                        <tr className="bg-bg-tertiary/10 border-b border-border-light">
                                            <th className="px-6 md:px-8 py-4 text-[10px] font-black text-text-tertiary uppercase tracking-widest">Activity</th>
                                            <th className="px-6 md:px-8 py-4 text-[10px] font-black text-text-tertiary uppercase tracking-widest">Timestamp</th>
                                            <th className="px-6 md:px-8 py-4 text-[10px] font-black text-text-tertiary uppercase tracking-widest text-right">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border-light">
                                        {recentActivity.map((act, i) => (
                                            <tr key={i} className="hover:bg-bg-tertiary/5 transition-colors group">
                                                <td className="px-6 md:px-8 py-5">
                                                    <div className="flex items-center space-x-3">
                                                        <div className="h-9 w-9 rounded-xl bg-bg-tertiary flex items-center justify-center text-primary group-hover:scale-110 transition-transform hidden sm:flex">
                                                            <Briefcase size={16} />
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-bold text-primary">
                                                                <span className="text-primary-light font-black">
                                                                    {act.student?.studentProfile ? `${act.student.studentProfile.firstName} ${act.student.studentProfile.lastName}` : act.student?.name}
                                                                </span> applied for <span className="font-black italic text-text-secondary">"{act.internship?.title}"</span>
                                                            </p>
                                                            <p className="text-[10px] font-black uppercase text-text-tertiary mt-1 tracking-widest">
                                                                Posted by {act.internship?.company?.companyProfile?.companyName || act.internship?.company?.name}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 md:px-8 py-5">
                                                    <div className="flex items-center text-xs font-bold text-text-tertiary whitespace-nowrap">
                                                        <Calendar size={14} className="mr-2" />
                                                        {new Date(act.createdAt).toLocaleString('en-US', { 
                                                            month: 'short', 
                                                            day: 'numeric',
                                                            hour: '2-digit',
                                                            minute: '2-digit'
                                                        })}
                                                    </div>
                                                </td>
                                                <td className="px-6 md:px-8 py-5 text-right">
                                                    <span className={`px-2.5 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest ${
                                                        act.status === 'accepted' ? 'bg-emerald-50 text-emerald-600' :
                                                        act.status === 'shortlisted' ? 'bg-amber-50 text-amber-600' :
                                                        act.status === 'rejected' ? 'bg-red-50 text-red-600' :
                                                        'bg-bg-tertiary text-text-tertiary'
                                                    }`}>
                                                        {act.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                    </div>
                </main>
            </div>
        </div>
    );
};

export default AdminReports;
