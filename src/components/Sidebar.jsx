import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  GraduationCap, 
  MessageSquare, 
  Search, 
  LogOut, 
  Users,
  Settings,
  Bell
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { logout } from '../services/authService';

const Sidebar = ({ isOpen, onClose }) => {
  const { role, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const menuItems = {
    student: [
      { name: 'Dashboard', path: '/student/dashboard', icon: LayoutDashboard },
      { name: 'My Results', path: '/student/results', icon: GraduationCap },
      { name: 'Submit Complaint', path: '/student/complaints', icon: MessageSquare },
      { name: 'Track Status', path: '/student/track-complaint', icon: Search },
    ],
    staff: [
      { name: 'Dashboard', path: '/staff/dashboard', icon: LayoutDashboard },
      { name: 'Manage Results', path: '/staff/manage-results', icon: GraduationCap },
      { name: 'Handle Complaints', path: '/staff/handle-complaints', icon: MessageSquare },
    ],
    admin: [
      { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
      { name: 'Manage Users', path: '/admin/users', icon: Users },
      { name: 'System Reports', path: '/admin/reports', icon: Bell },
    ]
  };

  const currentMenu = menuItems[role] || [];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 md:hidden transition-all duration-300"
          onClick={onClose}
        />
      )}

      <aside className={`
        w-64 bg-white border-r border-slate-200 flex flex-col h-screen fixed left-0 top-0 z-50 transition-transform duration-300
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center text-white font-bold text-xl">
              U
            </div>
            <span className="font-bold text-xl text-slate-900">UPSA</span>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1 mt-4 overflow-y-auto">
          {currentMenu.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => { if(window.innerWidth < 768) onClose(); }}
              className={({ isActive }) => `
                flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200
                ${isActive 
                  ? 'bg-primary-50 text-primary-600' 
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}
              `}
            >
              <item.icon size={20} />
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-100">
          <div className="flex items-center gap-3 p-3 mb-4 bg-slate-50 rounded-xl">
            <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-semibold shrink-0">
              {user?.email?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-900 truncate">{user?.displayName || 'User'}</p>
              <p className="text-xs text-slate-500 capitalize">{role}</p>
            </div>
          </div>
          
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-red-600 hover:bg-red-50 transition-all duration-200"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
