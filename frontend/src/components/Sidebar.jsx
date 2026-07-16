import React from 'react';
import { NavLink } from 'react-router-dom';
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
  LogOut 
} from 'lucide-react';

const Sidebar = ({ onScanClick }) => {
  const menuItems = [
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

  return (
    <aside className="w-64 bg-[#0c1e35] text-slate-300 flex flex-col h-screen sticky top-0 shrink-0">
      {/* Brand Header */}
      <div className="p-5 flex items-center gap-3 border-b border-[#1b3252]">
        <div className="p-2 bg-[#2563eb] rounded-lg text-white">
          <Monitor className="h-6 w-6" />
        </div>
        <div>
          <h1 className="font-bold text-white leading-tight">IT Asset</h1>
          <p className="text-xs text-slate-400">Management System</p>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 py-6 overflow-y-auto space-y-1">
        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                isActive 
                  ? 'bg-[#2563eb] text-white shadow-lg shadow-blue-900/30' 
                  : 'text-slate-400 hover:bg-[#152e4e] hover:text-white'
              }`
            }
          >
            <item.icon className="h-5 w-5 shrink-0" />
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>

      {/* Sidebar Footer Operations */}
      <div className="p-4 space-y-4 border-t border-[#1b3252]">

        {/* Support Help Center Card */}
        <div className="p-4 bg-[#152e4e] rounded-2xl flex gap-3 border border-blue-900/30">
          <Headphones className="h-5 w-5 text-blue-400 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-xs font-bold text-white">Need Help?</h4>
            <p className="text-[10px] text-slate-400">Contact Support</p>
            <a 
              href="mailto:support@itasset.com" 
              className="text-[10px] text-blue-400 hover:underline block mt-1"
            >
              support@itasset.com
            </a>
          </div>
        </div>

        {/* Logout */}
        <button 
          onClick={() => {
            alert("Logout operation simulated.");
          }}
          className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-red-400 hover:bg-red-500/5 rounded-xl text-sm font-medium transition-all"
        >
          <LogOut className="h-5 w-5" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
