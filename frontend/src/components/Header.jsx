import React, { useState } from 'react';
import { useLocation, NavLink, useNavigate } from 'react-router-dom';
import { Search, Bell, Menu, Check, Monitor, LogOut } from 'lucide-react';
import { useAssetManager } from '../hooks/useAssetManager';
import Avatar from './Avatar';
import QuadrantLogo from './QuadrantLogo';

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { notifications, currentUser, logoutUser } = useAssetManager();
  const [showNotifications, setShowNotifications] = useState(false);

  // Map route paths to human-friendly titles matching the mockup headers
  const getPageTitle = () => {
    if (currentUser && currentUser.role === 'Employee' && location.pathname === '/employee') {
      return (
        <span className="flex items-center gap-1.5">
          <span className="text-slate-500 font-medium">Welcome back,</span>
          <span className="text-slate-800 font-extrabold">{currentUser.name}</span>
          <span className="inline-block animate-bounce text-slate-800">👋</span>
        </span>
      );
    }
    switch (location.pathname) {
      case '/': return 'Dashboard';
      case '/employees': return 'Employees';
      case '/assets': return 'Assets';
      case '/assign-assets': return 'Assign Assets';
      case '/return-assets': return 'Return Assets';
      case '/repairs': return 'Repairs';
      case '/reports': return 'Reports';
      case '/settings': return 'Settings';
      case '/activity-log': return 'Activity Log';
      case '/employee': return 'Dashboard';
      case '/employee/settings': return 'Settings';
      default: return 'Quadrant IT Services';
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;
  const isEmployee = currentUser?.role === 'Employee';

  return (
    <header className="bg-white border-b border-slate-200 h-20 px-8 flex items-center justify-between sticky top-0 z-30 shadow-sm relative">
      {/* Brand & Left Title */}
      <div className="flex items-center">
        {isEmployee ? (
          /* Branding Block */
          <div className="flex items-center gap-2.5 shrink-0 cursor-pointer" onClick={() => navigate('/employee')}>
            <div className="shrink-0 overflow-hidden rounded-xl bg-white border border-slate-200">
              <QuadrantLogo className="h-8 w-8 object-cover" />
            </div>
            <div className="text-left">
              <h1 className="font-extrabold text-sm text-slate-800 leading-tight">Quadrant</h1>
              <p className="text-[9px] text-slate-400 font-semibold uppercase tracking-wider">IT Services</p>
            </div>
          </div>
        ) : (
          <>
            {/* Page Title & Hamburger */}
            <button className="text-slate-500 hover:text-slate-800 lg:hidden mr-2">
              <Menu className="h-6 w-6" />
            </button>
            <h2 className="text-xl font-bold text-slate-800">{getPageTitle()}</h2>
          </>
        )}
      </div>

      {/* Center Capsule Navigation Links (Only for Employee Portal) */}
      {isEmployee && (
        <nav className="flex items-center gap-1 bg-slate-50 border border-slate-200/60 p-1 rounded-2xl absolute left-1/2 -translate-x-1/2 shadow-inner">
          <NavLink 
            to="/employee" 
            end
            className={({ isActive }) => 
              `py-2 px-5 transition-all duration-300 ease-out rounded-xl text-xs font-bold flex items-center gap-1.5 active:scale-95 ${
                isActive 
                  ? 'bg-white text-blue-600 shadow-sm border border-slate-100' 
                  : 'text-slate-450 hover:text-blue-500 hover:bg-slate-100/50'
              }`
            }
          >
            Dashboard
          </NavLink>
          <NavLink 
            to="/employee/settings"
            className={({ isActive }) => 
              `py-2 px-5 transition-all duration-300 ease-out rounded-xl text-xs font-bold flex items-center gap-1.5 active:scale-95 ${
                isActive 
                  ? 'bg-white text-blue-600 shadow-sm border border-slate-100' 
                  : 'text-slate-450 hover:text-blue-500 hover:bg-slate-100/50'
              }`
            }
          >
            Settings
          </NavLink>
        </nav>
      )}

      {/* Operations Panel */}
      <div className="flex items-center gap-6">
        {/* Search Input (Only for Admins) */}
        {!isEmployee && (
          <div className="relative w-80 hidden md:block">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Search className="h-5 w-5" />
            </span>
            <input
              type="text"
              placeholder="Search assets, employees..."
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl text-sm bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder-slate-400"
            />
          </div>
        )}

        {/* Notifications Bell */}
        <div className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2.5 rounded-xl hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-all relative border border-slate-100"
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] font-bold h-5 w-5 flex items-center justify-center rounded-full border-2 border-white animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown Panel */}
          {showNotifications && (
            <div className="absolute right-0 mt-3 w-96 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 overflow-hidden">
              <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                <h3 className="font-bold text-slate-800 text-sm">Notifications</h3>
                <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-semibold">
                  {unreadCount} New
                </span>
              </div>
              <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-sm text-slate-400">
                    No notifications
                  </div>
                ) : (
                  notifications.map((notif) => (
                    <div 
                      key={notif.id} 
                      className={`p-4 transition-all hover:bg-slate-50 flex items-start gap-3 ${!notif.read ? 'bg-blue-50/20' : ''}`}
                    >
                      <span className={`h-2.5 w-2.5 rounded-full shrink-0 mt-1.5 ${
                        notif.type === 'success' ? 'bg-green-500' :
                        notif.type === 'warning' ? 'bg-amber-500' :
                        notif.type === 'alert' ? 'bg-red-500' : 'bg-blue-500'
                      }`} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-bold text-slate-800 truncate">{notif.title}</p>
                          <span className="text-[10px] text-slate-400 shrink-0">{notif.time}</span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{notif.message}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
              <div className="p-3 bg-slate-50 border-t border-slate-100 text-center">
                <button 
                  onClick={() => setShowNotifications(false)}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-800 transition-all"
                >
                  Close panel
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Profile Card & Logout */}
        {currentUser && (
          <div className="flex items-center gap-4 border-l border-slate-200 pl-6 animate-fade-in">
            {/* Profile Info Details */}
            <div className="flex items-center gap-3">
              <Avatar name={currentUser.name} className="h-10 w-10 rounded-xl ring-2 ring-slate-100" />
              <div className="hidden sm:block text-left">
                <h4 className="text-sm font-bold text-slate-800 leading-tight">{currentUser.name}</h4>
                <p className="text-[10px] text-slate-450 font-bold uppercase tracking-wider">
                  {currentUser.role === 'Admin' ? 'Admin' : currentUser.designation}
                </p>
              </div>
            </div>

            {/* Employee Logout Button */}
            {isEmployee && (
              <button
                onClick={() => {
                  logoutUser();
                  navigate('/login');
                }}
                className="flex items-center gap-1.5 px-3.5 py-2 border border-slate-200 hover:border-red-500 rounded-xl text-xs font-bold text-slate-500 hover:text-red-500 transition-all cursor-pointer bg-slate-50/55 hover:bg-white shrink-0 ml-1"
                title="Logout"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden md:inline">Logout</span>
              </button>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
