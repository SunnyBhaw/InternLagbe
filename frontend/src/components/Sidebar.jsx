import {
    Briefcase,
    FileText,
    LayoutDashboard,
    LogOut,
    Users
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import banner from '../assets/Banner1.png';

const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    { title: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { title: 'User Management', path: '/admin/users', icon: Users },
    { title: 'Internships', path: '/admin/internships', icon: Briefcase },
    { title: 'Report', path: '/admin/reports', icon: FileText },
  ];

  // User details (Mocked - will be dynamic once Auth State is integrated)
  const userName = "System Admin";
  const userEmail = "admin@internlagbe.com";

  // Logic to get initials from every word of the name
  const initials = userName
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase();

  return (
    <div className="flex flex-col h-screen w-64 bg-primary text-text-inverse transition-all duration-300 overflow-y-auto border-r border-primary-light/20">
      {/* Sidebar Header */}
      <div className="flex items-center justify-center h-20 border-b border-primary-light/30 px-6">
        <Link to="/admin" className="flex items-center">
          <img src={banner} alt="InternLagbe" className="h-10 w-auto object-contain" />
        </Link>
      </div>

      {/* Profile Summary - Vertical Stack */}
      <div className="px-6 py-10 border-b border-primary-light/20 flex flex-col items-center text-center">
        <div className="h-20 w-20 rounded-3xl bg-secondary flex items-center justify-center text-primary font-bold text-3xl border-2 border-primary-light/50 mb-4 shadow-inner">
          {initials}
        </div>
        <div className="space-y-1">
          <p className="font-bold text-lg tracking-tight">{userName}</p>
          <p className="text-xs text-text-inverse/50 font-medium">{userEmail}</p>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          return (
            <Link
              key={item.title}
              to={item.path}
              className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                isActive
                  ? 'bg-secondary text-primary font-bold shadow-md shadow-secondary/10'
                  : 'hover:bg-primary-light/30 text-text-inverse/80 hover:text-text-inverse'
              }`}
            >
              <Icon 
                size={20} 
                strokeWidth={isActive ? 2.5 : 2}
                className={`transition-transform duration-300 ${isActive ? '' : 'group-hover:scale-110'}`}
              />
              <span className="text-sm">{item.title}</span>
            </Link>
          );
        })}
      </nav>

      {/* Logout Button */}
      <div className="p-4 mt-auto">
        <button 
          onClick={() => {
            localStorage.removeItem('token');
            window.location.href = '/';
          }}
          className="flex items-center justify-center w-full space-x-2 px-4 py-3 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-text-inverse rounded-xl border border-red-500/50 transition-all duration-200 font-bold text-sm"
        >
          <LogOut size={18} strokeWidth={2.5} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
