import React from 'react';

const getInitials = (name) => {
  if (!name) return '??';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

const getAvatarStyle = (name) => {
  if (!name) return 'bg-slate-100 text-slate-500 border-slate-200';
  const colors = [
    'bg-blue-600 text-white border-blue-400/20 shadow-blue-500/5',
    'bg-emerald-600 text-white border-emerald-400/20 shadow-emerald-500/5',
    'bg-indigo-600 text-white border-indigo-400/20 shadow-indigo-500/5',
    'bg-amber-600 text-white border-amber-400/20 shadow-amber-500/5',
    'bg-purple-600 text-white border-purple-400/20 shadow-purple-500/5',
    'bg-rose-600 text-white border-rose-400/20 shadow-rose-500/5',
    'bg-cyan-600 text-white border-cyan-400/20 shadow-cyan-500/5',
    'bg-violet-600 text-white border-violet-400/20 shadow-violet-500/5'
  ];
  
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % colors.length;
  return colors[index];
};

const Avatar = ({ name, className = 'h-10 w-10 rounded-xl', textSize = 'text-xs' }) => {
  const initials = getInitials(name);
  const colorClass = getAvatarStyle(name);

  return (
    <div 
      className={`${className} ${colorClass} border flex items-center justify-center font-bold tracking-wider select-none shrink-0 uppercase shadow-sm ${textSize}`}
      title={name}
    >
      {initials}
    </div>
  );
};

export default Avatar;
