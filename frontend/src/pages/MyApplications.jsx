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
import MobileHeader from '../components/MobileHeader';
import StudentSidebar from '../components/StudentSidebar';
import api from '../utils/api';

const MyApplications = () => {
    const [user, setUser] = useState(null);
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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

    if (loading && !user) {
        return (
            <div className="flex h-screen items-center justify-center bg-bg-primary">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="flex flex-col lg:flex-row h-screen bg-bg-primary overflow-hidden font-sans text-text-primary">
            <StudentSidebar user={user} isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
            
            <div className="flex-1 flex flex-col overflow-hidden">
                <MobileHeader isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} role="student" />

                <main className="flex-1 overflow-y-auto p-4 md:p-10 custom-scrollbar">
                    <div className="max-w-6xl mx-auto">
                        {/* Header */}
                        <div className="mb-8 md:mb-10">
                            <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-2">My Applications</h1>
                            <p className="text-text-tertiary font-bold tracking-wide uppercase text-[10px] md:text-xs">
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
                                            className="bg-bg-primary border border-border-light p-5 md:p-6 rounded-[2rem] shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 group flex flex-col md:flex-row md:items-center justify-between gap-6"
                                        >
                                            <div className="flex items-center gap-4 md:6">
                                                <div className="h-14 w-14 md:h-16 md:w-16 bg-bg-tertiary rounded-2xl flex items-center justify-center text-primary border border-border-light group-hover:scale-105 transition-transform duration-500 shrink-0">
                                                    <Building2 size={24} className="md:w-[30px] md:h-[30px]" />
                                                </div>
                                                <div className="min-w-0">
                                                    <h3 className="text-lg md:text-xl font-black group-hover:text-primary transition-colors truncate">
                                                        {app.internship?.title}
                                                    </h3>
                                                    <p className="text-text-secondary font-bold text-xs md:text-sm flex items-center mt-1 truncate">
                                                        <Briefcase size={14} className="mr-1.5 opacity-60 shrink-0" />
                                                        {app.internship?.company?.companyProfile?.companyName || app.internship?.company?.name}
                                                    </p>
                                                    <p className="text-text-tertiary text-[9px] md:text-[10px] font-black uppercase tracking-widest mt-2 flex items-center">
                                                        <Calendar size={12} className="mr-1.5 shrink-0" />
                                                        Applied on {new Date(app.createdAt).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex flex-wrap items-center gap-3 md:gap-4">
                                                {/* Resume Link */}
                                                <a 
                                                    href={`http://localhost:5000/${app.resume}`} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-2 px-4 md:px-5 py-2 md:py-2.5 bg-bg-tertiary hover:bg-primary/5 text-text-secondary hover:text-primary border border-border-light rounded-xl font-bold text-[10px] md:text-xs transition-all"
                                                >
                                                    <FileText size={14} />
                                                    Resume
                                                    <ExternalLink size={12} className="opacity-50" />
                                                </a>

                                                {/* Status Badge */}
                                                <div className={`${status.bg} ${status.text} ${status.border} border px-4 md:px-6 py-2 md:py-2.5 rounded-xl flex items-center gap-2.5 font-black text-[10px] md:text-xs uppercase tracking-widest`}>
                                                    <StatusIcon size={14} md:size={16} strokeWidth={3} />
                                                    {app.status}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="flex flex-col items-center justify-center py-12 md:py-20 text-center bg-bg-tertiary/30 rounded-[2.5rem] md:rounded-[3rem] border-2 border-dashed border-border-medium px-6">
                                    <div className="h-16 w-16 md:h-20 md:w-20 bg-bg-tertiary rounded-full flex items-center justify-center mb-6 text-text-tertiary">
                                        <FileText size={28} className="md:w-8 md:h-8" />
                                    </div>
                                    <h3 className="text-xl md:text-2xl font-black mb-2">No applications yet</h3>
                                    <p className="text-text-tertiary font-bold max-w-xs mx-auto text-sm md:text-base">
                                        Browse internships and start applying to see your trackers here!
                                    </p>
                                    <Link 
                                        to="/student/browse" 
                                        className="mt-8 bg-primary text-text-inverse px-6 md:px-8 py-3 rounded-xl font-black hover:bg-primary-light transition-all shadow-lg hover:shadow-primary/20"
                                    >
                                        Browse Internships
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default MyApplications;
