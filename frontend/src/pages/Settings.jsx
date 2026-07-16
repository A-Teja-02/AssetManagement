import React, { useState } from 'react';
import { 
  Save, 
  Key, 
  Eye, 
  EyeOff, 
  Check, 
  LogIn, 
  Wrench, 
  Lock,
  ChevronRight,
  Globe,
  Bell,
  Clock,
  QrCode,
  CheckCircle,
  HelpCircle,
  FileText,
  Calendar,
  AlertTriangle
} from 'lucide-react';
import { useAssetManager } from '../hooks/useAssetManager';

const Settings = () => {
  const { activity, logActivity } = useAssetManager();

  // Profile Form state
  const [fullName, setFullName] = useState('Rakesh Reddy');
  const [email, setEmail] = useState('rakesh.reddy@company.com');
  const [phone, setPhone] = useState('+91 98765 43210');
  const [username, setUsername] = useState('rakesh.reddy');
  const [role, setRole] = useState('Administrator');
  const [dept, setDept] = useState('IT');

  // Password visibility state
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Preference states
  const [language, setLanguage] = useState('English');
  const [dateFormat, setDateFormat] = useState('DD MMM YYYY (10 Jul 2026)');
  const [timeZone, setTimeZone] = useState('(UTC+05:30) Asia/Kolkata');
  const [itemsPerPage, setItemsPerPage] = useState('10');

  // Toggle states
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [lowStockAlerts, setLowStockAlerts] = useState(true);
  const [maintenanceReminders, setMaintenanceReminders] = useState(true);
  const [autoQrCode, setAutoQrCode] = useState(true);

  // Form Submits simulation
  const handleSaveProfile = (e) => {
    e.preventDefault();
    alert("Simulated: Profile information updated successfully!");
    logActivity("Update Profile", "Profile information updated");
  };

  const handleUpdatePassword = (e) => {
    e.preventDefault();
    alert("Simulated: Password changed successfully!");
    logActivity("Change Password", "Password changed successfully");
  };

  const handleSavePreferences = () => {
    alert("Simulated: User preferences saved!");
  };

  const handleSaveSystemPreferences = () => {
    alert("Simulated: System preferences saved!");
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Sub-header text matches mockup */}
      <div>
        <h2 className="text-xl font-bold text-slate-800">Settings</h2>
        <p className="text-xs text-slate-400 mt-1">Manage your profile, preferences and system configuration.</p>
      </div>

      {/* Top forms: Profile Info & Change Password */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Information (2/3 width) */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
          <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-3 mb-4">Profile Information</h3>
          
          <form onSubmit={handleSaveProfile} className="space-y-6">
            <div className="flex flex-col sm:flex-row items-center gap-6 pb-2">
              <img 
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces" 
                alt="Profile Avatar" 
                className="h-20 w-20 rounded-2xl object-cover border shadow-sm shrink-0" 
              />
              <button 
                type="button"
                className="py-2 px-4 border border-slate-200 hover:bg-slate-50 text-slate-600 font-semibold text-xs rounded-xl transition-all"
              >
                Change Photo
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <label className="block font-bold text-slate-400 uppercase tracking-wider">Full Name</label>
                <input 
                  type="text" 
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:outline-none" 
                />
              </div>
              <div className="space-y-1">
                <label className="block font-bold text-slate-400 uppercase tracking-wider">Email Address</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:outline-none" 
                />
              </div>
              <div className="space-y-1">
                <label className="block font-bold text-slate-400 uppercase tracking-wider">Phone Number</label>
                <input 
                  type="text" 
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:outline-none" 
                />
              </div>
              <div className="space-y-1">
                <label className="block font-bold text-slate-400 uppercase tracking-wider">Username</label>
                <input 
                  type="text" 
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:outline-none" 
                />
              </div>
              <div className="space-y-1">
                <label className="block font-bold text-slate-400 uppercase tracking-wider">Role</label>
                <select 
                  value={role} 
                  onChange={e => setRole(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:outline-none bg-slate-50"
                >
                  <option value="Administrator">Administrator</option>
                  <option value="Staff">Staff</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="block font-bold text-slate-400 uppercase tracking-wider">Department</label>
                <select 
                  value={dept} 
                  onChange={e => setDept(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:outline-none bg-slate-50"
                >
                  <option value="IT">IT</option>
                  <option value="Finance">Finance</option>
                  <option value="HR">HR</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-100">
              <button 
                type="submit" 
                className="py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-lg shadow-blue-500/10 transition-all flex items-center gap-1.5"
              >
                <Save className="h-4 w-4" />
                <span>Save Changes</span>
              </button>
            </div>
          </form>
        </div>

        {/* Change Password (1/3 width) */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
          <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-3 mb-4">Change Password</h3>
          
          <form onSubmit={handleUpdatePassword} className="space-y-4 flex-1 flex flex-col justify-between">
            <div className="space-y-4 text-xs">
              <div className="space-y-1 relative">
                <label className="block font-bold text-slate-400 uppercase tracking-wider">Current Password</label>
                <input 
                  type={showCurrent ? 'text' : 'password'}
                  placeholder="Enter current password"
                  className="w-full p-2.5 pr-10 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:outline-none" 
                />
                <button 
                  type="button"
                  onClick={() => setShowCurrent(!showCurrent)}
                  className="absolute right-3.5 bottom-2.5 text-slate-400 hover:text-slate-600"
                >
                  {showCurrent ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <div className="space-y-1 relative">
                <label className="block font-bold text-slate-400 uppercase tracking-wider">New Password</label>
                <input 
                  type={showNew ? 'text' : 'password'}
                  placeholder="Enter new password"
                  className="w-full p-2.5 pr-10 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:outline-none" 
                />
                <button 
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute right-3.5 bottom-2.5 text-slate-400 hover:text-slate-600"
                >
                  {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <div className="space-y-1 relative">
                <label className="block font-bold text-slate-400 uppercase tracking-wider">Confirm New Password</label>
                <input 
                  type={showConfirm ? 'text' : 'password'}
                  placeholder="Confirm new password"
                  className="w-full p-2.5 pr-10 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:outline-none" 
                />
                <button 
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3.5 bottom-2.5 text-slate-400 hover:text-slate-600"
                >
                  {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button 
                type="submit" 
                className="w-full sm:w-auto py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-lg shadow-blue-500/10 transition-all flex items-center justify-center gap-1.5"
              >
                <Key className="h-4 w-4" />
                <span>Update Password</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Middle Grid: User Preferences & System Preferences */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* User Preferences */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col justify-between space-y-6">
          <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-3 mb-2">Preferences</h3>
          
          <div className="space-y-4 text-xs">
            {/* Language */}
            <div className="flex items-center justify-between border-b border-slate-50 pb-3">
              <div className="flex items-start gap-2.5">
                <div className="p-2 bg-slate-50 rounded-xl text-slate-400 mt-0.5">
                  <Globe className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-700">Language</h4>
                  <p className="text-[10px] text-slate-400">Select your preferred language</p>
                </div>
              </div>
              <select 
                value={language} 
                onChange={e => setLanguage(e.target.value)}
                className="p-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:outline-none font-semibold text-slate-700"
              >
                <option value="English">English</option>
                <option value="Spanish">Spanish</option>
                <option value="Hindi">Hindi</option>
              </select>
            </div>

            {/* Date format */}
            <div className="flex items-center justify-between border-b border-slate-50 pb-3">
              <div className="flex items-start gap-2.5">
                <div className="p-2 bg-slate-50 rounded-xl text-slate-400 mt-0.5">
                  <Calendar className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-700">Date Format</h4>
                  <p className="text-[10px] text-slate-400">Choose the date format</p>
                </div>
              </div>
              <select 
                value={dateFormat} 
                onChange={e => setDateFormat(e.target.value)}
                className="p-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:outline-none font-semibold text-slate-700"
              >
                <option value="DD MMM YYYY (10 Jul 2026)">DD MMM YYYY (10 Jul 2026)</option>
                <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                <option value="YYYY-MM-DD">YYYY-MM-DD</option>
              </select>
            </div>

            {/* Timezone */}
            <div className="flex items-center justify-between border-b border-slate-50 pb-3">
              <div className="flex items-start gap-2.5">
                <div className="p-2 bg-slate-50 rounded-xl text-slate-400 mt-0.5">
                  <Clock className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-700">Time Zone</h4>
                  <p className="text-[10px] text-slate-400">Select your time zone</p>
                </div>
              </div>
              <select 
                value={timeZone} 
                onChange={e => setTimeZone(e.target.value)}
                className="p-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:outline-none font-semibold text-slate-700 max-w-[180px]"
              >
                <option value="(UTC+05:30) Asia/Kolkata">(UTC+05:30) Asia/Kolkata</option>
                <option value="(UTC-05:00) EST">(UTC-05:00) Eastern Time</option>
                <option value="(UTC+00:00) GMT">(UTC+00:00) GMT</option>
              </select>
            </div>

            {/* Items per page */}
            <div className="flex items-center justify-between">
              <div className="flex items-start gap-2.5">
                <div className="p-2 bg-slate-50 rounded-xl text-slate-400 mt-0.5">
                  <FileText className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-700">Items Per Page</h4>
                  <p className="text-[10px] text-slate-400">Select default number of items per page</p>
                </div>
              </div>
              <select 
                value={itemsPerPage} 
                onChange={e => setItemsPerPage(e.target.value)}
                className="p-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:outline-none font-semibold text-slate-700"
              >
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-100">
            <button 
              onClick={handleSavePreferences}
              className="py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-lg shadow-blue-500/10 transition-all flex items-center gap-1.5"
            >
              <Save className="h-4 w-4" />
              <span>Save Preferences</span>
            </button>
          </div>
        </div>

        {/* System Configuration preferences */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col justify-between space-y-6">
          <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-3 mb-2">System Preferences</h3>
          
          <div className="space-y-4 text-xs">
            {/* Notifications toggle */}
            {[
              { 
                label: 'Email Notifications', 
                desc: 'Receive email alerts for important activities', 
                state: emailNotifications, 
                set: setEmailNotifications, 
                icon: Bell 
              },
              { 
                label: 'Low Stock Alerts', 
                desc: 'Get notified for low stock or expiring warranty', 
                state: lowStockAlerts, 
                set: setLowStockAlerts, 
                icon: AlertTriangle 
              },
              { 
                label: 'Maintenance Reminders', 
                desc: 'Receive reminders for asset maintenance', 
                state: maintenanceReminders, 
                set: setMaintenanceReminders, 
                icon: Wrench 
              },
              { 
                label: 'Auto Generate QR Code', 
                desc: 'Generate QR code automatically for new assets', 
                state: autoQrCode, 
                set: setAutoQrCode, 
                icon: QrCode 
              }
            ].map((toggle, tIdx) => (
              <div key={tIdx} className={`flex items-center justify-between pb-3 ${tIdx !== 3 ? 'border-b border-slate-50' : ''}`}>
                <div className="flex items-start gap-2.5">
                  <div className="p-2 bg-slate-50 rounded-xl text-slate-400 mt-0.5">
                    <toggle.icon className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-700">{toggle.label}</h4>
                    <p className="text-[10px] text-slate-400">{toggle.desc}</p>
                  </div>
                </div>
                {/* Switch checkbox */}
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={toggle.state}
                    onChange={e => toggle.set(e.target.checked)}
                    className="sr-only peer" 
                  />
                  <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            ))}
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-100">
            <button 
              onClick={handleSaveSystemPreferences}
              className="py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-lg shadow-blue-500/10 transition-all flex items-center gap-1.5"
            >
              <Save className="h-4 w-4" />
              <span>Save Preferences</span>
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Row: Recent Activity Log log */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-800">Recent Activity</h3>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="pb-3 pr-4">Activity</th>
                <th className="pb-3 px-4">Details</th>
                <th className="pb-3 px-4">IP Address</th>
                <th className="pb-3 px-4">Date & Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {activity.slice(0, 3).map((act, index) => {
                return (
                  <tr key={index} className="hover:bg-slate-50/50">
                    <td className="py-3.5 pr-4 font-bold flex items-center gap-2">
                      <div className={`p-1.5 rounded-lg ${
                        act.activity === 'Login' ? 'bg-green-50 text-green-600' :
                        act.activity === 'Update Profile' ? 'bg-blue-50 text-blue-600' :
                        'bg-purple-50 text-purple-600'
                      }`}>
                        {act.activity === 'Login' ? <LogIn className="h-3.5 w-3.5" /> :
                         act.activity === 'Update Profile' ? <Wrench className="h-3.5 w-3.5" /> :
                         <Lock className="h-3.5 w-3.5" />
                        }
                      </div>
                      <span>{act.activity}</span>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-600">{act.details}</td>
                    <td className="py-3.5 px-4 font-mono text-slate-500">{act.ipAddress}</td>
                    <td className="py-3.5 px-4 text-slate-500 font-medium">{act.dateTime}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="text-center pt-3 border-t border-slate-100">
          <button className="text-xs font-semibold text-blue-600 hover:text-blue-800 transition-all">
            View all activity &rarr;
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
