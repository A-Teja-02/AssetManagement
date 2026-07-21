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
    <div 
      onClick={() => linkTo && navigate(linkTo)}
      className={`p-3.5 rounded-2xl border bg-white flex flex-col justify-between min-h-[8.5rem] transition-all duration-200 shadow-xs hover:shadow-md hover:-translate-y-0.5 cursor-pointer group select-none relative overflow-hidden ${currentTheme.bg}`}
      title={`Click to view ${title}`}
    >
      <div className="flex items-start justify-between gap-1.5 min-w-0">
        <div className="space-y-0.5 min-w-0 flex-1">
          <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider group-hover:text-slate-600 transition-colors truncate">{title}</p>
          <h3 className="text-xl font-extrabold text-slate-800 tracking-tight leading-none mt-1">{value}</h3>
          {subtext && <p className="text-[9px] font-semibold text-slate-400 truncate mt-1">{subtext}</p>}
        </div>
        <div className={`p-2 rounded-xl transition-transform group-hover:scale-105 shrink-0 ${currentTheme.iconBg}`}>
          <Icon className="h-4 w-4" />
        </div>
      </div>
      
      {/* View Details Link */}
      <div className="border-t border-slate-100/60 pt-2 flex items-center justify-between mt-2">
        <span className={`text-[10px] font-extrabold flex items-center gap-1 transition-all ${currentTheme.link}`}>
          {linkLabel}
        </span>
        <ChevronRight className="h-3 w-3 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
      </div>
    </div>
  );
};

export default MetricCard;
