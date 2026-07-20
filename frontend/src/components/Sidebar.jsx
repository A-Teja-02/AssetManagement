import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Monitor, 
  ClipboardCopy, 
  RotateCcw, 
  Wrench, 
  BarChart3, 
  Settings, 
  History, 
  Headphones, 
  LogOut,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useAssetManager } from '../hooks/useAssetManager';
import QuadrantLogo from './QuadrantLogo';

const Sidebar = ({ isCollapsed, onToggleCollapse }) => {
  const { currentUser, logoutUser } = useAssetManager();
  const navigate = useNavigate();

  const adminMenuItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Employees', path: '/employees', icon: Users },
    { name: 'Assets', path: '/assets', icon: Monitor },
    { name: 'Assign Assets', path: '/assign-assets', icon: ClipboardCopy },
    { name: 'Return Assets', path: '/return-assets', icon: RotateCcw },
    { name: 'Repairs', path: '/repairs', icon: Wrench },
    { name: 'Reports', path: '/reports', icon: BarChart3 },
    { name: 'Settings', path: '/settings', icon: Settings },
    { name: 'Activity Log', path: '/activity-log', icon: History }
  ];

  const employeeMenuItems = [
    { name: 'Dashboard', path: '/employee', icon: LayoutDashboard },
    { name: 'Settings', path: '/employee/settings', icon: Settings }
  ];

  // Pick menu based on active role
  const isEmployee = currentUser?.role === 'Employee';
  const menuItems = isEmployee ? employeeMenuItems : adminMenuItems;

  const handleLogoutClick = () => {
    logoutUser();
    navigate('/login');
  };

  return (
    <aside 
      className={`${
        isCollapsed ? 'w-20' : 'w-64'
      } bg-[#0c1e35] text-slate-300 flex flex-col h-screen sticky top-0 shrink-0 transition-all duration-300 ease-in-out`}
    >
      {/* Brand Header */}
      <div 
        className={`p-5 flex items-center justify-between border-b border-[#1b3252] ${
          isCollapsed ? 'flex-col gap-3 justify-center px-2 py-4' : ''
        }`}
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="shrink-0 overflow-hidden rounded-xl bg-white">
            <QuadrantLogo className="h-10 w-10 object-cover" />
          </div>
          {!isCollapsed && (
            <div className="text-left animate-fade-in min-w-0">
              <h1 className="font-extrabold text-white text-base leading-tight tracking-wide truncate">Quadrant</h1>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider truncate">
                IT Services
              </p>
            </div>
          )}
        </div>

        {/* Toggle Button */}
        <button 
          onClick={onToggleCollapse}
          className="p-1.5 rounded-lg bg-[#152e4e] hover:bg-[#2563eb] text-slate-400 hover:text-white transition-all cursor-pointer shrink-0"
          title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-6 overflow-y-auto space-y-1.5">
        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            end={item.path === '/' || item.path === '/employee'}
            title={isCollapsed ? item.name : ''}
            className={({ isActive }) =>
              `flex items-center rounded-xl text-sm font-medium transition-all ${
                isCollapsed ? 'justify-center p-3' : 'gap-3 px-4 py-3'
              } ${
                isActive 
                  ? 'bg-[#2563eb] text-white shadow-lg shadow-blue-900/30' 
                  : 'text-slate-450 hover:bg-[#152e4e] hover:text-white'
              }`
            }
          >
            <item.icon className="h-5 w-5 shrink-0" />
            {!isCollapsed && <span className="animate-fade-in whitespace-nowrap truncate">{item.name}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Sidebar Footer Operations */}
      <div className="p-4 space-y-4 border-t border-[#1b3252]">
        {/* Support Help Center Card */}
        {!isCollapsed && (
          <div className="p-4 bg-[#152e4e] rounded-2xl flex gap-3 border border-blue-900/30 animate-fade-in">
            <Headphones className="h-5 w-5 text-blue-400 shrink-0 mt-0.5" />
            <div className="text-left min-w-0">
              <h4 className="text-xs font-bold text-white truncate">Need Help?</h4>
              <p className="text-[10px] text-slate-400 truncate">Contact Support</p>
              <a 
                href="mailto:support@itasset.com" 
                className="text-[10px] text-blue-400 hover:underline block mt-1 truncate"
              >
                support@itasset.com
              </a>
            </div>
          </div>
        )}

        {/* Logout */}
        <button 
          onClick={handleLogoutClick}
          title={isCollapsed ? "Logout" : ""}
          className={`w-full flex items-center text-slate-450 hover:text-red-400 hover:bg-red-500/5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
            isCollapsed ? 'justify-center p-3' : 'gap-3 px-4 py-3'
          }`}
        >
          <LogOut className="h-5 w-5" />
          {!isCollapsed && <span className="animate-fade-in">Logout</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
