import React from 'react';
import { 
  Laptop, 
  Monitor, 
  Mouse, 
  Keyboard, 
  Headphones, 
  Printer, 
  Cpu, 
  Box, 
  Sliders,
  Armchair,
  Table
} from 'lucide-react';

export const getAssetIconComponent = (typeStr) => {
  const t = (typeStr || '').toLowerCase();
  if (t.includes('laptop')) return Laptop;
  if (t.includes('monitor') || t.includes('screen') || t.includes('display')) return Monitor;
  if (t.includes('mouse')) return Mouse;
  if (t.includes('keyboard')) return Keyboard;
  if (t.includes('headphone') || t.includes('headset')) return Headphones;
  if (t.includes('printer')) return Printer;
  if (t.includes('cpu') || t.includes('desktop')) return Cpu;
  if (t.includes('chair')) return Armchair;
  if (t.includes('table')) return Table;
  if (t.includes('dock')) return Sliders;
  return Box;
};

export const AssetIconBadge = ({ type, className = "h-7 w-7", iconSize = "h-4 w-4" }) => {
  const IconComp = getAssetIconComponent(type);
  
  const t = (type || '').toLowerCase();
  let theme = "bg-blue-50 text-blue-600 border-blue-200/60";
  if (t.includes('laptop')) theme = "bg-blue-50 text-blue-600 border-blue-200/60";
  else if (t.includes('monitor')) theme = "bg-indigo-50 text-indigo-600 border-indigo-200/60";
  else if (t.includes('mouse') || t.includes('keyboard')) theme = "bg-slate-100 text-slate-700 border-slate-200";
  else if (t.includes('headphone') || t.includes('headset')) theme = "bg-purple-50 text-purple-600 border-purple-200/60";
  else if (t.includes('printer')) theme = "bg-emerald-50 text-emerald-600 border-emerald-200/60";
  else if (t.includes('chair') || t.includes('table')) theme = "bg-amber-50 text-amber-600 border-amber-200/60";

  return (
    <div className={`rounded-xl border flex items-center justify-center shrink-0 shadow-xs ${theme} ${className}`}>
      <IconComp className={iconSize} />
    </div>
  );
};

export default AssetIconBadge;
