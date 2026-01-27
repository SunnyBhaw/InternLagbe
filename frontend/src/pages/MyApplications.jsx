import {
    AlertCircle,
    Briefcase,
    Building2,
    Calendar,
    CheckCircle2,
    Clock,
    ExternalLink,
    FileText,
    XCircle
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import StudentSidebar from '../components/StudentSidebar';
import api from '../utils/api';

const MyApplications = () => {
    const [user, setUser] = useState(null);
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [userRes, appRes] = await Promise.all([
                    api.get('/auth/me'),
                    api.get('/applications/my')
                ]);
                setUser(userRes.data.data);
                setApplications(appRes.data.data);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching data:', err);
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const getStatusStyle = (status) => {
        switch (status) {
            case 'pending': 
                return { 
                    bg: 'bg-yellow-500/10', 
                    text: 'text-yellow-600', 
                    border: 'border-yellow-500/10',
                    icon: Clock
                };
            case 'shortlisted': 
                return { 
                    bg: 'bg-blue-500/10', 
                    text: 'text-blue-600', 
                    border: 'border-blue-500/10',
                    icon: AlertCircle
                };
            case 'accepted': 
                return { 
                    bg: 'bg-green-500/10', 
                    text: 'text-green-600', 
                    border: 'border-green-500/10',
                    icon: CheckCircle2
                };
            case 'rejected': 
                return { 
                    bg: 'bg-red-500/10', 
                    text: 'text-red-600', 
                    border: 'border-red-500/10',
                    icon: XCircle
                };
            default: 
                return { 
                    bg: 'bg-gray-500/10', 
                    text: 'text-gray-600', 
                    border: 'border-gray-500/10',
                    icon: Clock
                };
        }
    };

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
            
            <main className="flex-1 overflow-y-auto px-10 py-8">
                <div className="max-w-6xl mx-auto">
                    {/* Header */}
                    <div className="mb-10">
                        <h1 className="text-4xl font-black tracking-tight mb-2">My Applications</h1>
                        <p className="text-text-tertiary font-bold tracking-wide uppercase text-xs">
                            Track the status of your {applications.length} submitted applications.
                        </p>
                    </div>

                    {/* Applications List */}
                    <div className="space-y-4 pb-20">
                        {applications.length > 0 ? (
                            applications.map((app) => {
                                const status = getStatusStyle(app.status);
                                const StatusIcon = status.icon;
                                
                                return (
                                    <div 
                                        key={app._id}
                                        className="bg-bg-primary border border-border-light p-6 rounded-[2rem] shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 group flex flex-col md:flex-row md:items-center justify-between gap-6"
                                    >
                                        <div className="flex items-center gap-6">
                                            <div className="h-16 w-16 bg-bg-tertiary rounded-2xl flex items-center justify-center text-primary border border-border-light group-hover:scale-105 transition-transform duration-500">
                                                <Building2 size={30} />
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-black group-hover:text-primary transition-colors">
                                                    {app.internship?.title}
                                                </h3>
                                                <p className="text-text-secondary font-bold text-sm flex items-center mt-1">
                                                    <Briefcase size={14} className="mr-1.5 opacity-60" />
                                                    {app.internship?.company?.companyProfile?.companyName || app.internship?.company?.name}
                                                </p>
                                                <p className="text-text-tertiary text-[10px] font-black uppercase tracking-widest mt-2 flex items-center">
                                                    <Calendar size={12} className="mr-1.5" />
                                                    Applied on {new Date(app.createdAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap items-center gap-4">
                                            {/* Resume Link */}
                                            <a 
                                                href={`http://localhost:5000/${app.resume}`} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-2 px-5 py-2.5 bg-bg-tertiary hover:bg-primary/5 text-text-secondary hover:text-primary border border-border-light rounded-xl font-bold text-xs transition-all"
                                            >
                                                <FileText size={14} />
                                                View My Resume
                                                <ExternalLink size={12} className="opacity-50" />
                                            </a>

                                            {/* Status Badge */}
                                            <div className={`${status.bg} ${status.text} ${status.border} border px-6 py-2.5 rounded-xl flex items-center gap-2.5 font-black text-xs uppercase tracking-widest`}>
                                                <StatusIcon size={16} strokeWidth={3} />
                                                {app.status}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="flex flex-col items-center justify-center py-20 text-center bg-bg-tertiary/30 rounded-[3rem] border-2 border-dashed border-border-medium">
                                <div className="h-20 w-20 bg-bg-tertiary rounded-full flex items-center justify-center mb-6 text-text-tertiary">
                                    <FileText size={32} />
                                </div>
                                <h3 className="text-2xl font-black mb-2">No applications yet</h3>
                                <p className="text-text-tertiary font-bold max-w-xs mx-auto">
                                    Browse internships and start applying to see your trackers here!
                                </p>
                                <Link 
                                    to="/student/browse" 
                                    className="mt-8 bg-primary text-text-inverse px-8 py-3 rounded-xl font-black hover:bg-primary-light transition-all shadow-lg hover:shadow-primary/20"
                                >
                                    Browse Internships
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default MyApplications;
