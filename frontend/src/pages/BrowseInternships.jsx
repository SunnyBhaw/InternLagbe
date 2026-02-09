import {
    Briefcase,
    Building2,
    Calendar,
    ChevronRight,
    Clock,
    MapPin,
    Search
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import MobileHeader from '../components/MobileHeader';
import StudentSidebar from '../components/StudentSidebar';
import api from '../utils/api';

const BrowseInternships = () => {
    const [user, setUser] = useState(null);
    const [internships, setInternships] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [userRes, internshipRes] = await Promise.all([
                    api.get('/auth/me'),
                    api.get('/internships')
                ]);
                setUser(userRes.data.data);
                // Defensive filtering: ensure only active and non-expired internships are shown
                const activeInternships = internshipRes.data.data.filter(ins => new Date(ins.deadline) > new Date());
                setInternships(activeInternships);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching data:', err);
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const filteredInternships = internships.filter(internship => 
        internship.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (internship.company?.companyProfile?.companyName || internship.company?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        internship.location.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
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

                <main className="flex-1 overflow-y-auto px-6 md:px-10 py-6 md:py-8">
                    {/* Header Section */}
                    <div className="mb-8 md:10">
                        <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-2">Marketplace</h1>
                        <p className="text-text-tertiary font-bold tracking-wide uppercase text-[10px] md:text-xs">
                            Discover your next career move among {internships.length} active opportunities.
                        </p>
                    </div>

                    {/* Search and Filter Bar */}
                    <div className="flex flex-col md:flex-row gap-4 mb-8 md:10">
                        <div className="flex-1 relative group">
                            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-text-tertiary group-focus-within:text-primary transition-colors">
                                <Search size={20} strokeWidth={2.5} />
                            </div>
                            <input 
                                type="text" 
                                placeholder="Search by title, company, or location..."
                                className="w-full pl-12 pr-4 py-3 md:py-4 bg-bg-primary border border-border-light rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium placeholder:text-text-tertiary/60 shadow-sm text-sm"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Internship Cards Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pb-20">
                        {filteredInternships.map((internship) => (
                            <div 
                                key={internship._id}
                                className="bg-bg-primary p-6 rounded-3xl border border-border-light shadow-sm hover:shadow-xl hover:shadow-primary/5 hover:border-primary/20 transition-all duration-300 group flex flex-col h-full"
                            >
                                {/* Card Header: Company Logo Placeholder & Title */}
                                <div className="flex items-start justify-between mb-6">
                                    <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-105 transition-transform duration-500 border border-primary/5">
                                        <Building2 size={28} />
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <span className="bg-green-500/10 text-green-600 text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border border-green-500/10 mb-2">
                                            {internship.status}
                                        </span>
                                        <span className="text-text-tertiary text-[10px] font-bold uppercase tracking-widest">
                                            Posted {new Date(internship.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex-1">
                                    <h3 className="text-xl font-black mb-1 group-hover:text-primary transition-colors line-clamp-1">
                                        {internship.title}
                                    </h3>
                                    <p className="text-text-secondary font-bold text-sm mb-4 flex items-center">
                                        <Briefcase size={14} className="mr-1.5 text-primary/60" />
                                        {internship.company?.companyProfile?.companyName || internship.company?.name}
                                    </p>

                                    {/* Meta Info */}
                                    <div className="space-y-2 mb-6">
                                        <div className="flex items-center text-text-tertiary text-xs font-bold">
                                            <MapPin size={14} className="mr-2" />
                                            {internship.location}
                                        </div>
                                        <div className="flex items-center text-text-tertiary text-xs font-bold">
                                            <Clock size={14} className="mr-2" />
                                            {internship.duration}
                                        </div>
                                        <div className="flex items-center text-text-tertiary text-xs font-bold">
                                            <Calendar size={14} className="mr-2" />
                                            Apply by: {new Date(internship.deadline).toLocaleDateString()}
                                        </div>
                                    </div>
                                </div>

                                {/* Card Footer: Action */}
                                <div className="pt-4 border-t border-border-light flex items-center justify-between">
                                    <p className="font-black text-primary text-lg lining-nums tracking-tighter">
                                        tk {internship.stipend} <span className="text-[10px] text-text-tertiary uppercase tracking-tighter">/ month</span>
                                    </p>
                                    <Link 
                                        to={`/student/internship/${internship._id}`}
                                        className="bg-bg-tertiary p-3 rounded-xl text-primary transition-all duration-300 hover:bg-primary hover:text-text-inverse group-hover:shadow-lg group-hover:shadow-primary/20"
                                    >
                                        <ChevronRight size={20} strokeWidth={3} />
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>

                    {filteredInternships.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-20 text-center">
                            <div className="bg-bg-tertiary h-20 w-20 rounded-full flex items-center justify-center mb-6 text-text-tertiary">
                                <Search size={32} />
                            </div>
                            <h3 className="text-xl font-black mb-2">No internships found</h3>
                            <p className="text-text-tertiary font-medium">Try adjusting your search terms.</p>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default BrowseInternships;
