import {
    AlertCircle,
    Building2,
    Calendar,
    Filter,
    Loader2,
    Search,
    Trash2
} from 'lucide-react';
import { useEffect, useState } from 'react';
import MobileHeader from '../components/MobileHeader';
import Sidebar from '../components/Sidebar';
import api from '../utils/api';

const AdminInternships = () => {
    const [internships, setInternships] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [deleteId, setDeleteId] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    useEffect(() => {
        fetchInternships();
    }, []);

    const fetchInternships = async () => {
        try {
            setLoading(true);
            const res = await api.get('/admin/internships');
            setInternships(res.data.data);
            setError(null);
        } catch (err) {
            setError('Failed to load internships');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        try {
            setIsDeleting(true);
            await api.delete(`/internships/${id}`);
            setInternships(internships.filter(ins => ins._id !== id));
            setDeleteId(null);
        } catch (err) {
            alert(err.response?.data?.error || 'Failed to delete internship');
        } finally {
            setIsDeleting(false);
        }
    };

    const filteredInternships = internships.filter(ins => {
        const isExpired = new Date(ins.deadline) < new Date();
        const effectiveStatus = (ins.status === 'closed' || isExpired) ? 'closed' : 'active';
        
        const companyName = ins.company?.companyProfile?.companyName || ins.company?.name || '';
        const matchesSearch = 
            ins.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
            companyName.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || effectiveStatus === statusFilter;
        return matchesSearch && matchesStatus;
    });

    return (
        <div className="flex flex-col lg:flex-row h-screen bg-bg-secondary overflow-hidden font-sans">
            <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

            <div className="flex-1 flex flex-col overflow-hidden">
                <MobileHeader isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} role="admin" />

                <header className="hidden lg:flex h-20 bg-bg-primary border-b border-border-light items-center justify-between px-8">
                    <div>
                        <h2 className="text-2xl font-black text-primary tracking-tight">Manage Internships</h2>
                        <p className="text-sm text-text-tertiary font-medium">Global oversight of all internship postings</p>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-bg-secondary custom-scrollbar">
                    <div className="max-w-7xl mx-auto">
                        
                        {/* Mobile Title */}
                        <div className="lg:hidden mb-6">
                            <h1 className="text-2xl font-black text-primary tracking-tight">Manage Internships</h1>
                            <p className="text-[10px] font-black uppercase text-text-tertiary tracking-widest mt-1">Platform-wide overview</p>
                        </div>

                        {/* Filters Bar */}
                        <div className="bg-white p-4 rounded-3xl border border-border-light mb-8 flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4 shadow-sm">
                            <div className="relative flex-1">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-tertiary" size={18} />
                                <input 
                                    type="text" 
                                    placeholder="Search by role or company..." 
                                    className="w-full pl-12 pr-4 py-3 bg-bg-tertiary rounded-2xl border-none focus:ring-4 focus:ring-primary/5 transition-all font-medium text-sm text-primary"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            
                            <div className="flex items-center gap-3">
                                <div className="flex-1 flex items-center space-x-2 bg-bg-tertiary px-4 py-1.5 rounded-2xl border border-border-light">
                                    <Filter size={16} className="text-text-tertiary" />
                                    <select 
                                        className="bg-transparent border-none focus:ring-0 text-xs md:text-sm font-bold text-primary py-2 pr-8 cursor-pointer"
                                        value={statusFilter}
                                        onChange={(e) => setStatusFilter(e.target.value)}
                                    >
                                        <option value="all">All Status</option>
                                        <option value="active">Active</option>
                                        <option value="closed">Closed</option>
                                    </select>
                                </div>
                                
                                <button 
                                    onClick={fetchInternships}
                                    className="p-3 bg-bg-tertiary rounded-2xl border border-border-light hover:bg-border-light transition-all text-primary"
                                    title="Refresh Data"
                                >
                                    <Loader2 size={20} className={loading ? "animate-spin" : ""} />
                                </button>
                            </div>
                        </div>

                        {error ? (
                            <div className="bg-red-50 border border-red-100 p-8 md:p-12 rounded-[2rem] md:rounded-[2.5rem] flex flex-col items-center text-center">
                                <AlertCircle size={40} className="text-red-500 mb-4" />
                                <h3 className="text-lg md:text-xl font-black text-red-600 mb-2">Error Loading Internships</h3>
                                <p className="text-red-500/80 font-medium text-sm">{error}</p>
                            </div>
                        ) : filteredInternships.length === 0 && !loading ? (
                            <div className="bg-white border border-border-light p-12 md:p-20 rounded-[2rem] md:rounded-[2.5rem] flex flex-col items-center text-center shadow-sm">
                                <div className="h-20 w-20 md:h-24 md:w-24 bg-bg-tertiary rounded-[1.5rem] md:rounded-[2rem] flex items-center justify-center text-primary/30 mb-6 md:8 border border-border-light">
                                    <Building2 size={32} md:size={40} />
                                </div>
                                <h3 className="text-xl md:text-2xl font-black text-primary mb-2">No internships found</h3>
                                <p className="text-text-tertiary font-medium text-sm md:text-lg">
                                    Try adjusting your search or filters.
                                </p>
                            </div>
                        ) : (
                            <div className="bg-white border border-border-light rounded-[2rem] md:rounded-[2.5rem] overflow-hidden shadow-sm">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left min-w-[700px]">
                                        <thead>
                                            <tr className="bg-bg-tertiary/30 border-b border-border-light">
                                                <th className="px-6 md:px-8 py-6 text-[10px] font-black text-text-tertiary uppercase tracking-widest">Internship Role</th>
                                                <th className="px-6 md:px-8 py-6 text-[10px] font-black text-text-tertiary uppercase tracking-widest">Company</th>
                                                <th className="px-6 md:px-8 py-6 text-[10px] font-black text-text-tertiary uppercase tracking-widest">Category</th>
                                                <th className="px-6 md:px-8 py-6 text-[10px] font-black text-text-tertiary uppercase tracking-widest">Deadline</th>
                                                <th className="px-6 md:px-8 py-6 text-[10px] font-black text-text-tertiary uppercase tracking-widest text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-border-light">
                                            {loading ? (
                                                [...Array(6)].map((_, i) => (
                                                    <tr key={i} className="animate-pulse">
                                                        <td className="px-8 py-6"><div className="h-6 w-48 bg-bg-tertiary rounded-lg"></div></td>
                                                        <td className="px-8 py-6"><div className="h-6 w-32 bg-bg-tertiary rounded-lg"></div></td>
                                                        <td className="px-8 py-6"><div className="h-4 w-24 bg-bg-tertiary rounded-lg"></div></td>
                                                        <td className="px-8 py-6"><div className="h-4 w-24 bg-bg-tertiary rounded-lg"></div></td>
                                                        <td className="px-8 py-6"><div className="h-8 w-8 bg-bg-tertiary rounded-lg ml-auto"></div></td>
                                                    </tr>
                                                ))
                                            ) : (
                                                filteredInternships.map((ins) => (
                                                    <tr key={ins._id} className="hover:bg-bg-tertiary/10 transition-colors group">
                                                        <td className="px-6 md:px-8 py-6">
                                                            <div className="flex flex-col">
                                                                <span className="font-bold text-sm md:text-base text-primary group-hover:text-primary-light transition-colors">{ins.title}</span>
                                                                {(() => {
                                                                    const isExpired = new Date(ins.deadline) < new Date();
                                                                    const isClosed = ins.status === 'closed' || isExpired;
                                                                    
                                                                    return (
                                                                        <span className={`text-[9px] font-black uppercase tracking-widest mt-1 ${isClosed ? 'text-red-500' : 'text-emerald-500'}`}>
                                                                            {isClosed ? 'Closed' : 'Active'}
                                                                        </span>
                                                                    );
                                                                })()}
                                                            </div>
                                                        </td>
                                                        <td className="px-6 md:px-8 py-6">
                                                            <span className="font-bold text-xs md:text-sm text-text-secondary truncate block max-w-[150px]">
                                                                {ins.company?.companyProfile?.companyName || ins.company?.name || 'N/A'}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 md:px-8 py-6">
                                                            <span className="px-3 py-1 bg-primary/5 text-primary border border-primary/10 rounded-lg text-[9px] font-black uppercase tracking-widest">
                                                                {ins.category}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 md:px-8 py-6">
                                                            <div className="flex items-center gap-2 text-[11px] font-bold text-text-tertiary">
                                                                <Calendar size={14} />
                                                                {new Date(ins.deadline).toLocaleDateString()}
                                                            </div>
                                                        </td>
                                                        <td className="px-6 md:px-8 py-6 text-right">
                                                            <button 
                                                                onClick={() => setDeleteId(ins._id)}
                                                                className="p-2.5 text-red-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                                                title="Delete Listing"
                                                            >
                                                                <Trash2 size={18} />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </div>
                </main>
            </div>

            {/* Delete Modal */}
            {deleteId && (
                <div className="fixed inset-0 bg-primary/40 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
                    <div className="bg-white w-full max-w-md rounded-[2.5rem] p-8 md:p-10 shadow-2xl border border-border-light animate-in zoom-in-95 duration-200">
                        <div className="h-16 w-16 md:h-20 md:w-20 bg-red-50 text-red-500 rounded-3xl flex items-center justify-center mx-auto mb-6 md:8">
                            <Trash2 size={36} md:size={40} />
                        </div>
                        <h3 className="text-xl md:text-2xl font-black text-primary text-center mb-3 tracking-tight">Remove Internship?</h3>
                        <p className="text-text-tertiary text-center font-medium leading-relaxed mb-8 md:10 text-sm md:text-base">
                            This listing will be permanently removed for all students. This action cannot be undone.
                        </p>
                        <div className="flex flex-col space-y-3">
                            <button 
                                onClick={() => handleDelete(deleteId)}
                                disabled={isDeleting}
                                className="w-full py-4 bg-red-500 hover:bg-red-600 text-text-inverse font-black rounded-2xl transition-all shadow-lg shadow-red-500/20 active:scale-95 flex items-center justify-center"
                            >
                                {isDeleting ? <Loader2 className="animate-spin mr-2" size={18} /> : null}
                                Delete Permanently
                            </button>
                            <button 
                                onClick={() => setDeleteId(null)}
                                disabled={isDeleting}
                                className="w-full py-4 bg-bg-tertiary hover:bg-border-light text-primary font-bold rounded-2xl transition-all"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminInternships;
