import React, { useState, useEffect } from 'react';
import { Bell, Search, User, Check, Menu } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { fetchNotifications, markAsRead } from '../services/notificationService';

const Navbar = ({ onMenuClick, searchTerm, onSearchChange }) => {
  const { user } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  
  useEffect(() => {
    if (user) {
      loadNotifications();
    }
  }, [user]);

  const loadNotifications = async () => {
    try {
      const data = await fetchNotifications();
      setNotifications(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await markAsRead(id);
      setNotifications(notifications.map(n => 
        n.id === id ? { ...n, is_read: true } : n
      ));
    } catch (err) {
      console.error(err);
    }
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;

  return (
    <header className="h-16 bg-white border-b border-slate-200 fixed top-0 right-0 left-0 md:left-64 z-30 flex items-center justify-between px-4 md:px-8 transition-all duration-300">
      <div className="flex items-center gap-4 flex-1">
        <button 
          onClick={onMenuClick}
          className="p-2 -ml-2 text-slate-500 hover:bg-slate-50 rounded-lg md:hidden"
        >
          <Menu size={24} />
        </button>
        {onSearchChange && (
          <div className="relative max-w-md w-full hidden sm:block">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
              <Search size={18} />
            </span>
            <input 
              type="text" 
              placeholder="Search..." 
              value={searchTerm || ''}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full bg-slate-50 border-transparent focus:bg-white focus:ring-2 focus:ring-primary-500 rounded-lg py-2 pl-10 pr-4 text-sm"
            />
          </div>
        )}
      </div>

      <div className="flex items-center gap-4">
        <button 
          className="relative p-2 rounded-lg hover:bg-slate-50 text-slate-500 transition-colors"
          onClick={() => setShowNotifications(!showNotifications)}
        >
          <Bell size={20} />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full border-2 border-white flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </button>

        <div className="h-8 w-px bg-slate-200 mx-2"></div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-sm font-semibold text-slate-900 leading-none">{user?.displayName || 'Student Name'}</p>
            <p className="text-xs text-slate-500 mt-1">{user?.email}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500">
            <User size={20} />
          </div>
        </div>
      </div>

      {/* Notification Dropdown */}
      {showNotifications && (
        <div className="absolute top-16 right-8 w-80 bg-white rounded-2xl shadow-2xl border border-slate-100 mt-2 p-4 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-slate-900">Notifications</h3>
            {unreadCount > 0 && (
              <span className="text-xs text-primary-600 bg-primary-50 px-2 py-1 rounded-full font-semibold">
                {unreadCount} new
              </span>
            )}
          </div>
          
          <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
            {notifications.length > 0 ? (
              notifications.map((notif) => (
                <div 
                  key={notif.id} 
                  className={`p-3 rounded-xl relative group ${notif.is_read ? 'bg-slate-50 border border-slate-100' : 'bg-blue-50 border border-blue-100'}`}
                >
                  <p className={`text-xs mt-1 ${notif.is_read ? 'text-slate-600' : 'text-blue-800 font-medium'}`}>
                    {notif.message}
                  </p>
                  <p className="text-[10px] text-slate-400 mt-2">
                    {new Date(notif.created_at).toLocaleString()}
                  </p>
                  
                  {!notif.is_read && (
                    <button 
                      onClick={() => handleMarkAsRead(notif.id)}
                      className="absolute top-2 right-2 text-blue-500 hover:text-blue-700 opacity-0 group-hover:opacity-100 transition-opacity bg-blue-100 p-1 rounded-full"
                      title="Mark as read"
                    >
                      <Check size={14} />
                    </button>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-6 text-slate-500 text-sm">
                No notifications right now.
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
