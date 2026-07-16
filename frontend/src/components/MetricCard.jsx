import React from 'react';
import { ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MetricCard = ({ 
  icon: Icon, 
  title, 
  value, 
  color = 'blue', 
  subtext,
  linkTo,
  linkLabel = 'View details'
}) => {
  const navigate = useNavigate();

  // Define visual colors based on mockup cards
  const colorMaps = {
    blue: {
      bg: 'bg-blue-50/50 hover:bg-blue-50 border-blue-100',
      iconBg: 'bg-blue-500 text-white',
      link: 'text-blue-600 hover:text-blue-800'
    },
    green: {
      bg: 'bg-emerald-50/50 hover:bg-emerald-50 border-emerald-100',
      iconBg: 'bg-emerald-500 text-white',
      link: 'text-emerald-600 hover:text-emerald-800'
    },
    orange: {
      bg: 'bg-amber-50/50 hover:bg-amber-50 border-amber-100',
      iconBg: 'bg-amber-500 text-white',
      link: 'text-amber-600 hover:text-amber-800'
    },
    red: {
      bg: 'bg-rose-50/50 hover:bg-rose-50 border-rose-100',
      iconBg: 'bg-rose-500 text-white',
      link: 'text-rose-600 hover:text-rose-800'
    },
    purple: {
      bg: 'bg-purple-50/50 hover:bg-purple-50 border-purple-100',
      iconBg: 'bg-purple-500 text-white',
      link: 'text-purple-600 hover:text-purple-800'
    }
  };

  const currentTheme = colorMaps[color] || colorMaps.blue;

  return (
    <div className={`p-6 rounded-3xl border bg-white flex flex-col justify-between h-40 transition-all duration-300 shadow-sm hover:shadow-md ${currentTheme.bg}`}>
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{title}</p>
          <h3 className="text-3xl font-extrabold text-slate-800 tracking-tight">{value}</h3>
          {subtext && <p className="text-[10px] font-bold text-slate-400 mt-1">{subtext}</p>}
        </div>
        <div className={`p-3.5 rounded-2xl ${currentTheme.iconBg}`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
      
      {/* View Details Link */}
      <div className="border-t border-slate-100/50 pt-4 flex items-center justify-between">
        <button 
          onClick={() => linkTo && navigate(linkTo)}
          className={`text-xs font-bold flex items-center gap-1 transition-all ${currentTheme.link}`}
        >
          <span>{linkLabel}</span>
        </button>
        <ChevronRight className="h-4 w-4 text-slate-400" />
      </div>
    </div>
  );
};

export default MetricCard;
