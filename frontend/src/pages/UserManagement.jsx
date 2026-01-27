import {
    AlertTriangle,
    Building,
    Filter,
    Loader2,
    Mail,
    Search,
    Trash2,
    UserCheck
} from 'lucide-react';
import { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import api from '../utils/api';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [deleteId, setDeleteId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/users');
      setUsers(res.data.data);
      setError(null);
    } catch (err) {
      setError('Failed to load users');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      setIsDeleting(true);
      await api.delete(`/admin/users/${id}`);
      setUsers(users.filter(user => user._id !== id));
      setDeleteId(null);
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to delete user');
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterRole === 'all' || user.role === filterRole;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="flex h-screen bg-bg-secondary overflow-hidden font-sans">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-20 bg-bg-primary border-b border-border-light flex items-center justify-between px-8">
          <div>
            <h2 className="text-2xl font-black text-primary tracking-tight">User Management</h2>
            <p className="text-sm text-text-tertiary font-medium">Manage and monitor all platform participants</p>
          </div>
          
          <div className="flex items-center space-x-4">
             <div className="bg-primary text-text-inverse px-4 py-2 rounded-xl text-sm font-bold shadow-lg shadow-primary/20">
                {users.length} Total Users
             </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-8 bg-bg-secondary">
          <div className="max-w-7xl mx-auto">
            
            {/* Filters Bar */}
            <div className="bg-bg-primary p-4 rounded-3xl border border-border-light mb-8 flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4 shadow-sm">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-tertiary" size={18} />
                    <input 
                        type="text" 
                        placeholder="Search by name or email..." 
                        className="w-full pl-12 pr-4 py-3 bg-bg-tertiary rounded-2xl border-none focus:ring-2 focus:ring-primary/20 transition-all font-medium text-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex items-center space-x-2 bg-bg-tertiary px-4 py-1.5 rounded-2xl border border-border-light">
                    <Filter size={16} className="text-text-tertiary" />
                    <select 
                        className="bg-transparent border-none focus:ring-0 text-sm font-bold text-primary py-2 pr-8"
                        value={filterRole}
                        onChange={(e) => setFilterRole(e.target.value)}
                    >
                        <option value="all">All Roles</option>
                        <option value="student">Students</option>
                        <option value="company">Companies</option>
                        <option value="admin">Admins</option>
                    </select>
                </div>
                <button 
                   onClick={fetchUsers}
                   className="p-3 bg-bg-tertiary rounded-2xl border border-border-light hover:bg-border-light transition-colors text-primary"
                   title="Refresh Data"
                >
                    <Loader2 size={20} className={loading ? "animate-spin" : ""} />
                </button>
            </div>

            {/* Users Table */}
            <div className="bg-bg-primary rounded-3xl border border-border-light overflow-hidden shadow-sm">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-bg-tertiary/50 border-b border-border-light">
                            <th className="px-6 py-5 text-xs font-black uppercase tracking-widest text-text-tertiary">User</th>
                            <th className="px-6 py-5 text-xs font-black uppercase tracking-widest text-text-tertiary">Role</th>
                            <th className="px-6 py-5 text-xs font-black uppercase tracking-widest text-text-tertiary">Registered</th>
                            <th className="px-6 py-5 text-xs font-black uppercase tracking-widest text-text-tertiary text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border-light">
                        {loading ? (
                            [...Array(5)].map((_, i) => (
                                <tr key={i} className="animate-pulse">
                                    <td className="px-6 py-6"><div className="h-10 w-48 bg-bg-tertiary rounded-lg"></div></td>
                                    <td className="px-6 py-6"><div className="h-6 w-20 bg-bg-tertiary rounded-full"></div></td>
                                    <td className="px-6 py-6"><div className="h-6 w-24 bg-bg-tertiary rounded-lg"></div></td>
                                    <td className="px-6 py-6"><div className="h-8 w-8 bg-bg-tertiary rounded-lg ml-auto"></div></td>
                                </tr>
                            ))
                        ) : filteredUsers.length > 0 ? (
                            filteredUsers.map((user) => (
                                <tr key={user._id} className="hover:bg-bg-tertiary/20 transition-colors group">
                                    <td className="px-6 py-6 font-medium">
                                        <div className="flex items-center space-x-3">
                                            <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-black text-sm border border-primary/20">
                                                {user.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="text-primary font-bold text-sm tracking-tight">{user.name}</p>
                                                <div className="flex items-center text-xs text-text-tertiary font-medium mt-0.5">
                                                    <Mail size={12} className="mr-1" />
                                                    {user.email}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-6">
                                        <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-black uppercase tracking-tight ${
                                            user.role === 'admin' ? 'bg-purple-50 text-purple-600' :
                                            user.role === 'company' ? 'bg-blue-50 text-blue-600' :
                                            'bg-emerald-50 text-emerald-600'
                                        }`}>
                                            {user.role === 'company' ? <Building size={12} className="mr-1.5" /> : <UserCheck size={12} className="mr-1.5" />}
                                            {user.role}
                                        </div>
                                    </td>
                                    <td className="px-6 py-6 text-sm text-text-tertiary font-medium">
                                        {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                    </td>
                                    <td className="px-6 py-6 text-right">
                                        <button 
                                            onClick={() => setDeleteId(user._id)}
                                            className="p-2.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                                            title="Delete User"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className="px-6 py-20 text-center">
                                    <div className="max-w-xs mx-auto">
                                        <div className="bg-bg-tertiary h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4 text-primary/20">
                                            <Search size={32} />
                                        </div>
                                        <h4 className="text-primary font-bold">No users found</h4>
                                        <p className="text-text-tertiary text-sm mt-1">Try adjusting your filters or search terms.</p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
          </div>
        </main>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 bg-primary/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-bg-primary w-full max-w-md rounded-[2.5rem] p-10 shadow-2xl border border-border-light animate-in zoom-in-95 duration-200">
                <div className="h-20 w-20 bg-red-50 text-red-500 rounded-3xl flex items-center justify-center mx-auto mb-8 animate-bounce-short">
                    <AlertTriangle size={40} strokeWidth={2.5} />
                </div>
                <h3 className="text-2xl font-black text-primary text-center mb-3">Permanent Deletion</h3>
                <p className="text-text-tertiary text-center font-medium leading-relaxed mb-10">
                    Are you absolutely sure? This action will permanently remove the user and all associated data from the platform.
                </p>
                <div className="flex flex-col space-y-3">
                    <button 
                        onClick={() => handleDelete(deleteId)}
                        disabled={isDeleting}
                        className="w-full py-4 bg-red-500 hover:bg-red-600 text-text-inverse font-black rounded-2xl transition-all shadow-lg shadow-red-500/20 active:scale-[0.98] flex items-center justify-center"
                    >
                        {isDeleting ? <Loader2 className="animate-spin mr-2" size={18} /> : null}
                        Delete Securely
                    </button>
                    <button 
                        onClick={() => setDeleteId(null)}
                        disabled={isDeleting}
                        className="w-full py-4 bg-bg-tertiary hover:bg-border-light text-primary font-bold rounded-2xl transition-all"
                    >
                        Keep User
                    </button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
