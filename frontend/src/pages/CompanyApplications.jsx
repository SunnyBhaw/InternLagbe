import {
    AlertCircle,
    ArrowUpRight,
    CheckCircle2,
    Clock,
    Filter,
    Loader2,
    Search,
    Users,
    XCircle
} from 'lucide-react';
import { useEffect, useState } from 'react';
import CompanySidebar from '../components/CompanySidebar';
import api from '../utils/api';

const CompanyApplications = () => {
    const [user, setUser] = useState(null);
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [updatingId, setUpdatingId] = useState(null);

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const [userRes, appRes] = await Promise.all([
                    api.get('/auth/me'),
                    api.get('/applications/company')
                ]);
                setUser(userRes.data.data);
                setApplications(appRes.data.data);
            } catch (err) {
                console.error('Error fetching applications:', err);
                setError('Failed to load applications');
            } finally {
                setLoading(false);
            }
        };
        fetchApplications();
    }, []);

    const updateStatus = async (id, status) => {
        setUpdatingId(id);
        try {
            await api.put(`/applications/${id}/status`, { status });
            setApplications(applications.map(app => 
                app._id === id ? { ...app, status } : app
            ));
        } catch (err) {
            alert(err.response?.data?.error || 'Failed to update status');
        } finally {
            setUpdatingId(null);
        }
    };

    const filteredApps = applications.filter(app => {
        const studentName = app.student?.studentProfile 
            ? `${app.student.studentProfile.firstName} ${app.student.studentProfile.lastName}`
            : app.student?.name || '';
            
        const matchesSearch = 
            studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            app.internship?.title?.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
        
        return matchesSearch && matchesStatus;
    });

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-bg-secondary">
                <Loader2 className="animate-spin text-primary" size={48} />
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-bg-secondary overflow-hidden text-text-primary">
            <CompanySidebar user={user} />

            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="h-20 bg-bg-primary border-b border-border-light flex items-center justify-between px-8">
                    <div>
                        <h2 className="text-2xl font-black text-primary tracking-tight">Manage Applications</h2>
                        <p className="text-sm text-text-tertiary font-medium">Review and respond to student interests</p>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-8 bg-bg-secondary custom-scrollbar">
                    <div className="max-w-7xl mx-auto">
                        
                        {/* Action Bar */}
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                            <div className="relative flex-1 max-w-md">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-tertiary" size={18} />
                                <input
                                    type="text"
                                    placeholder="Search by student or role..."
                                    className="w-full pl-12 pr-4 py-3 bg-white border border-border-light rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all font-medium text-primary shadow-sm"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            
                            <div className="flex items-center bg-white border border-border-light rounded-2xl px-3 py-1.5 shadow-sm">
                                <Filter size={16} className="text-text-tertiary mr-2" />
                                <select
                                    className="bg-transparent border-none focus:ring-0 font-bold text-sm text-primary appearance-none pr-6 cursor-pointer"
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                >
                                    <option value="all">All Status</option>
                                    <option value="pending">Pending</option>
                                    <option value="shortlisted">Shortlisted</option>
                                    <option value="rejected">Rejected</option>
                                    <option value="accepted">Accepted</option>
                                </select>
                            </div>
                        </div>

                        {/* Applications Table */}
                        {error ? (
                            <div className="bg-red-50 border border-red-100 p-8 rounded-[2.5rem] flex flex-col items-center text-center">
                                <AlertCircle size={48} className="text-red-500 mb-4" />
                                <h3 className="text-xl font-black text-red-600 mb-2">Error Loading Data</h3>
                                <p className="text-red-500/80 font-medium">{error}</p>
                            </div>
                        ) : filteredApps.length === 0 ? (
                            <div className="bg-white border border-border-light p-20 rounded-[2.5rem] flex flex-col items-center text-center shadow-sm">
                                <div className="h-24 w-24 bg-bg-tertiary rounded-[2rem] flex items-center justify-center text-primary/30 mb-8 border border-border-light">
                                    <Users size={40} />
                                </div>
                                <h3 className="text-2xl font-black text-primary mb-2">No applications found</h3>
                                <p className="text-text-tertiary font-medium text-lg max-w-sm">
                                    {searchTerm || statusFilter !== 'all' 
                                        ? "No students match your current filters." 
                                        : "You haven't received any applications yet. Make sure your internships are active!"}
                                </p>
                            </div>
                        ) : (
                            <div className="bg-white border border-border-light rounded-[2.5rem] overflow-hidden shadow-sm">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left">
                                        <thead>
                                            <tr className="bg-bg-tertiary/30 border-b border-border-light">
                                                <th className="px-8 py-6 text-xs font-black text-text-tertiary uppercase tracking-widest">Student info</th>
                                                <th className="px-8 py-6 text-xs font-black text-text-tertiary uppercase tracking-widest">Internship Role</th>
                                                <th className="px-8 py-6 text-xs font-black text-text-tertiary uppercase tracking-widest">Status</th>
                                                <th className="px-8 py-6 text-xs font-black text-text-tertiary uppercase tracking-widest">Applied on</th>
                                                <th className="px-8 py-6 text-xs font-black text-text-tertiary uppercase tracking-widest text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-border-light">
                                            {filteredApps.map((app) => {
                                                const studentName = app.student?.studentProfile 
                                                    ? `${app.student.studentProfile.firstName} ${app.student.studentProfile.lastName}`
                                                    : app.student?.name;
                                                
                                                const initials = studentName
                                                    ?.split(' ')
                                                    .map(n => n[0])
                                                    .join('')
                                                    .toUpperCase()
                                                    .slice(0, 2);

                                                return (
                                                    <tr key={app._id} className="hover:bg-bg-tertiary/10 transition-colors group">
                                                        <td className="px-8 py-6">
                                                            <div className="flex items-center gap-4">
                                                                <div className="h-10 w-10 rounded-xl bg-primary text-text-inverse flex items-center justify-center font-black text-[10px]">
                                                                    {initials}
                                                                </div>
                                                                <div className="flex flex-col">
                                                                    <span className="font-bold text-primary group-hover:text-primary-light transition-colors">{studentName}</span>
                                                                    <span className="text-xs text-text-tertiary font-medium">{app.student?.email}</span>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-8 py-6 text-sm font-bold text-primary">
                                                            {app.internship?.title}
                                                        </td>
                                                        <td className="px-8 py-6">
                                                            <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                                                                app.status === 'shortlisted' ? 'bg-green-50 text-green-600 border-green-100' :
                                                                app.status === 'rejected' ? 'bg-red-50 text-red-600 border-red-100' :
                                                                app.status === 'accepted' ? 'bg-primary/5 text-primary border-primary/20 font-black' :
                                                                'bg-bg-tertiary text-text-tertiary border-border-light'
                                                            }`}>
                                                                {app.status}
                                                            </span>
                                                        </td>
                                                        <td className="px-8 py-6">
                                                            <div className="flex items-center gap-2 text-xs font-bold text-text-tertiary">
                                                                <Clock size={14} />
                                                                {new Date(app.createdAt).toLocaleDateString()}
                                                            </div>
                                                        </td>
                                                        <td className="px-8 py-6">
                                                            <div className="flex items-center justify-end space-x-2">
                                                                <button 
                                                                    onClick={() => window.open(`http://localhost:5000/${app.resume}`, '_blank')}
                                                                    className="p-2.5 text-text-tertiary hover:text-primary hover:bg-white rounded-xl border border-transparent hover:border-border-light transition-all shadow-none hover:shadow-sm"
                                                                    title="View Resume"
                                                                >
                                                                    <ArrowUpRight size={18} />
                                                                </button>
                                                                
                                                                {app.status === 'pending' && (
                                                                    <>
                                                                        <button 
                                                                            onClick={() => updateStatus(app._id, 'shortlisted')}
                                                                            disabled={updatingId === app._id}
                                                                            className="p-2.5 text-text-tertiary hover:text-emerald-500 hover:bg-white rounded-xl border border-transparent hover:border-border-light transition-all shadow-none hover:shadow-sm"
                                                                            title="Shortlist"
                                                                        >
                                                                            {updatingId === app._id ? <Loader2 size={18} className="animate-spin" /> : <CheckCircle2 size={18} />}
                                                                        </button>
                                                                        <button 
                                                                            onClick={() => updateStatus(app._id, 'rejected')}
                                                                            disabled={updatingId === app._id}
                                                                            className="p-2.5 text-text-tertiary hover:text-red-500 hover:bg-white rounded-xl border border-transparent hover:border-border-light transition-all shadow-none hover:shadow-sm"
                                                                            title="Reject"
                                                                        >
                                                                            {updatingId === app._id ? <Loader2 size={18} className="animate-spin" /> : <XCircle size={18} />}
                                                                        </button>
                                                                    </>
                                                                )}

                                                                {app.status === 'shortlisted' && (
                                                                    <div className="flex items-center gap-2">
                                                                        <button 
                                                                            onClick={() => updateStatus(app._id, 'accepted')}
                                                                            disabled={updatingId === app._id}
                                                                            className="flex items-center gap-2 px-4 py-2 bg-primary text-text-inverse rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-primary-light transition-all shadow-lg shadow-primary/20 active:scale-95"
                                                                            title="Hire Student"
                                                                        >
                                                                            {updatingId === app._id ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle2 size={14} />}
                                                                            <span>Hire Student</span>
                                                                        </button>
                                                                        <button 
                                                                            onClick={() => updateStatus(app._id, 'rejected')}
                                                                            disabled={updatingId === app._id}
                                                                            className="p-2.5 text-text-tertiary hover:text-red-500 hover:bg-white rounded-xl border border-transparent hover:border-border-light transition-all shadow-none hover:shadow-sm"
                                                                            title="Reject"
                                                                        >
                                                                            {updatingId === app._id ? <Loader2 size={18} className="animate-spin" /> : <XCircle size={18} />}
                                                                        </button>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default CompanyApplications;
