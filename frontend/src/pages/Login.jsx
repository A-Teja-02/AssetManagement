import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Lock, Eye, EyeOff, LogIn, ShieldAlert, Laptop } from 'lucide-react';
import { useAssetManager } from '../hooks/useAssetManager';
import QuadrantLogo from '../components/QuadrantLogo';

import slide1 from '../assets/slide1.jpg';
import slide2 from '../assets/slide2.jpg';
import slide3 from '../assets/slide3.jpg';

const Login = () => {
  const { loginUser } = useAssetManager();
  const navigate = useNavigate();

  // Background slideshow state
  const bgImages = [slide1, slide2, slide3];
  const [activeBgIndex, setActiveBgIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveBgIndex((prev) => (prev + 1) % bgImages.length);
    }, 5500);
    return () => clearInterval(timer);
  }, []);

  // Form states
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Admin'); // Admin | Employee
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!username.trim()) {
      setErrorMsg('Username is required.');
      return;
    }

    const result = loginUser(username.trim(), password, role);
    if (result.success) {
      if (result.user.role === 'Admin') {
        navigate('/');
      } else {
        navigate('/employee');
      }
    } else {
      setErrorMsg(result.message);
    }
  };

  const handleSandboxLogin = (sandboxUsername, sandboxPassword, sandboxRole) => {
    setErrorMsg('');
    const result = loginUser(sandboxUsername, sandboxPassword, sandboxRole);
    if (result.success) {
      if (result.user.role === 'Admin') {
        navigate('/');
      } else {
        navigate('/employee');
      }
    } else {
      setErrorMsg(result.message);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4 relative overflow-hidden font-sans">
      {/* Background Slideshow Images */}
      {bgImages.map((src, index) => (
        <div
          key={index}
          className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out pointer-events-none"
          style={{
            backgroundImage: `url(${src})`,
            opacity: activeBgIndex === index ? 0.65 : 0
          }}
        />
      ))}
      <div className="absolute inset-0 bg-slate-950/40 z-0 pointer-events-none" />

      {/* Main card */}
      <div className="w-full max-w-md backdrop-blur-xl bg-slate-950/20 border border-white/10 rounded-[2.5rem] p-8 shadow-2xl space-y-6 relative z-10 animate-fade-in">
        {/* Logo and title */}
        <div className="flex flex-col items-center space-y-3">
          <div className="shrink-0 overflow-hidden rounded-2xl bg-white border border-slate-700/50 shadow-lg shadow-black/20">
            <QuadrantLogo className="h-16 w-16 object-cover" />
          </div>
          <div className="text-center">
            <h2 className="text-xl font-bold text-white tracking-tight">Quadrant IT Services</h2>
            <p className="text-xs text-slate-400 font-semibold mt-1">Management & Employee Portal</p>
          </div>
        </div>

        {/* Role selector tabs */}
        <div className="flex bg-black/35 p-1.5 rounded-2xl border border-white/5 text-xs">
          <button
            type="button"
            onClick={() => { setRole('Admin'); setErrorMsg(''); }}
            className={`flex-1 py-2.5 rounded-xl font-bold transition-all ${
              role === 'Admin' 
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/15' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Administrator
          </button>
          <button
            type="button"
            onClick={() => { setRole('Employee'); setErrorMsg(''); }}
            className={`flex-1 py-2.5 rounded-xl font-bold transition-all ${
              role === 'Employee' 
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/15' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Employee Portal
          </button>
        </div>

        {/* Error notification */}
        {errorMsg && (
          <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-start gap-2.5 text-xs text-rose-400 animate-shake">
            <ShieldAlert className="h-4 w-4 shrink-0 mt-0.5" />
            <span className="font-semibold leading-relaxed">{errorMsg}</span>
          </div>
        )}

        {/* Credentials Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider pl-1">Username</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <User className="h-4.5 w-4.5" />
              </span>
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder={role === 'Admin' ? 'e.g. rakesh.reddy' : 'e.g. rakesh.reddy'}
                className="w-full pl-10 pr-4 py-3 border border-slate-700 bg-slate-900/50 rounded-2xl text-xs text-white placeholder-slate-500 focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all font-medium"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider pl-1">Password</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <Lock className="h-4.5 w-4.5" />
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-10 py-3 border border-slate-700 bg-slate-900/50 rounded-2xl text-xs text-white placeholder-slate-500 focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all font-medium"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-slate-300"
              >
                {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs rounded-2xl shadow-lg shadow-blue-600/10 flex items-center justify-center gap-1.5 transition-all mt-6"
          >
            <LogIn className="h-4 w-4" />
            <span>Sign In</span>
          </button>
        </form>

        {/* Sandbox test login cards */}
        <div className="pt-4 border-t border-slate-700/40 space-y-3">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest text-center">Quick Sandbox Test</p>
          <div className="grid grid-cols-3 gap-2 text-[10px]">
            <button
              type="button"
              onClick={() => handleSandboxLogin('teja.adusumilli', 'admin123', 'Admin')}
              className="p-2.5 border border-slate-700 hover:border-blue-500/50 bg-slate-900/30 rounded-2xl text-left hover:bg-slate-900/80 transition-all group"
            >
              <p className="font-bold text-white group-hover:text-blue-400 transition-all truncate">Teja (Admin)</p>
              <p className="text-[8px] text-slate-500 font-semibold mt-0.5 truncate">teja.adusumilli</p>
            </button>
            <button
              type="button"
              onClick={() => handleSandboxLogin('rakesh.reddy', 'admin123', 'Admin')}
              className="p-2.5 border border-slate-700 hover:border-blue-500/50 bg-slate-900/30 rounded-2xl text-left hover:bg-slate-900/80 transition-all group"
            >
              <p className="font-bold text-white group-hover:text-blue-400 transition-all truncate">Rakesh (Admin)</p>
              <p className="text-[8px] text-slate-500 font-semibold mt-0.5 truncate">rakesh.reddy</p>
            </button>
            <button
              type="button"
              onClick={() => handleSandboxLogin('rakesh.reddy', '', 'Employee')}
              className="p-2.5 border border-slate-700 hover:border-blue-500/50 bg-slate-900/30 rounded-2xl text-left hover:bg-slate-900/80 transition-all group"
            >
              <p className="font-bold text-white group-hover:text-blue-400 transition-all truncate">Employee</p>
              <p className="text-[8px] text-slate-500 font-semibold mt-0.5 truncate">Employee Portal</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
