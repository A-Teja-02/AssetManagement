import React, { useState } from 'react';
import { 
  Laptop, 
  CheckCircle, 
  TrendingUp, 
  Wrench, 
  Trash2, 
  Calendar, 
  Filter, 
  FileText, 
  FileSpreadsheet, 
  ChevronRight,
  Download
} from 'lucide-react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { useAssetManager } from '../hooks/useAssetManager';
import MetricCard from '../components/MetricCard';

const Reports = () => {
  const { assets, employees, activity } = useAssetManager();
  const [activeTab, setActiveTab] = useState('Overview');
  const [dateRange, setDateRange] = useState('01 Jul 2026 - 10 Jul 2026');

  // Dynamic tallies
  const total = assets.length;
  const assigned = assets.filter(a => a.status === 'Assigned').length;
  const available = assets.filter(a => a.status === 'Available').length;
  const repair = assets.filter(a => a.status === 'Under Repair').length;
  const disposed = assets.filter(a => a.status === 'Disposed').length;

  const assignedPct = ((assigned / (total || 1)) * 100).toFixed(2);
  const availablePct = ((available / (total || 1)) * 100).toFixed(2);
  const repairPct = ((repair / (total || 1)) * 100).toFixed(2);

  // 1. Chart Data: Assets by Status Donut
  const statusChartData = [
    { name: 'Assigned', value: assigned, color: '#10b981' }, // Green
    { name: 'Available', value: available, color: '#f59e0b' }, // Orange
    { name: 'Under Repair', value: repair, color: '#ef4444' } // Red
  ];

  // 2. Chart Data: Assets by Type Bar Chart
  const typeChartData = [
    { name: 'Laptop', count: 120, color: '#3b82f6' },
    { name: 'Monitor', count: 50, color: '#10b981' },
    { name: 'Mouse', count: 30, color: '#f59e0b' },
    { name: 'Keyboard', count: 25, color: '#8b5cf6' },
    { name: 'Others', count: 25, color: '#64748b' }
  ];

  // 3. Chart Data: Assets by Department Donut
  const deptChartData = [
    { name: 'IT', value: 45, color: '#2563eb', label: 'IT (45%)' },
    { name: 'HR', value: 20, color: '#10b981', label: 'HR (20%)' },
    { name: 'Finance', value: 15, color: '#f59e0b', label: 'Finance (15%)' },
    { name: 'Operations', value: 10, color: '#8b5cf6', label: 'Operations (10%)' },
    { name: 'Others', value: 10, color: '#06b6d4', label: 'Others (10%)' }
  ];

  // Quick report types list
  const reportsList = [
    { name: 'All Assets Report', desc: 'Detailed list of all assets', icon: Laptop },
    { name: 'Employee-wise Assets', desc: 'Assets assigned to each employee', icon: CheckCircle },
    { name: 'Department-wise Assets', desc: 'Assets grouped by department', icon: TrendingUp },
    { name: 'Warranty Expiry Report', desc: 'Assets with warranty details', icon: FileText },
    { name: 'Assets Under Repair', desc: 'List of assets under repair', icon: Wrench },
    { name: 'Retired Assets Report', desc: 'List of retired/disposed assets', icon: Trash2 }
  ];

  // Recent Assignments log
  const recentAssignments = activity.filter(a => a.activity === 'Assign Asset').slice(0, 5);

  const simulateExport = (format) => {
    alert(`Simulating Report Export as ${format}. Generating template structure for ${dateRange}...`);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Breadcrumbs */}
      <div className="text-xs font-semibold text-slate-400">
        <span className="hover:text-slate-600 cursor-pointer">Dashboard</span>
        <span className="mx-2">&gt;</span>
        <span className="text-slate-600 font-bold">Reports</span>
      </div>

      {/* Tab Navigation header */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Tabs */}
        <div className="flex gap-4 border-b border-slate-100 md:border-transparent text-xs font-semibold overflow-x-auto pb-2 md:pb-0">
          {['Overview', 'Asset Reports', 'Employee Reports', 'Maintenance Reports', 'Financial Reports', 'Export History'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-1.5 md:pb-0 px-1 border-b-2 md:border-b-0 transition-all shrink-0 ${
                activeTab === tab ? 'border-blue-600 text-blue-600 font-bold' : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Date Filters */}
        <div className="flex items-center gap-3 self-end md:self-auto text-xs">
          <div className="flex items-center gap-2 border border-slate-200 px-3 py-2 rounded-xl bg-slate-50 text-slate-600 font-semibold cursor-pointer">
            <Calendar className="h-4 w-4 text-slate-400" />
            <span>{dateRange}</span>
          </div>
          <button className="flex items-center gap-1.5 border border-slate-200 px-3 py-2 rounded-xl bg-slate-50 text-slate-600 font-semibold hover:bg-slate-100 transition-all">
            <Filter className="h-4 w-4 text-slate-400" />
            <span>Filter</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <MetricCard icon={Laptop} title="Total Assets" value={total} color="blue" linkTo="/assets" />
        <MetricCard icon={CheckCircle} title="Assigned Assets" value={assigned} color="green" subtext={`${assignedPct}% of total assets`} linkTo="/assets" />
        <MetricCard icon={TrendingUp} title="Available Assets" value={available} color="orange" subtext={`${availablePct}% of total assets`} linkTo="/assets" />
        <MetricCard icon={Wrench} title="Under Repair" value={repair} color="red" subtext={`${repairPct}% of total assets`} linkTo="/repairs" />
        <MetricCard icon={Trash2} title="Retired Assets" value={disposed} color="purple" linkTo="/assets" />
      </div>

      {/* Visual Analytics Graphs Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Assets by Status Donut */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
          <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-3 mb-4">Assets by Status</h3>
          <div className="relative h-48 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={65}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {statusChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2 mt-4 text-xs font-semibold text-slate-500">
            {statusChartData.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                  <span>{item.name}</span>
                </div>
                <span className="font-extrabold text-slate-800">{item.value} ({Math.round((item.value / total) * 100)}%)</span>
              </div>
            ))}
          </div>
        </div>

        {/* Assets by Type Bar Chart */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
          <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-3 mb-4">Assets by Type</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={typeChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0' }} />
                <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                  {typeChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-5 gap-1 mt-4 text-[10px] text-center font-bold text-slate-500">
            {typeChartData.map((item, idx) => (
              <div key={idx}>
                <p className="text-slate-800 text-xs font-extrabold">{item.count}</p>
                <p className="truncate text-slate-400 mt-0.5">{item.name}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Assets by Department Pie Chart */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
          <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-3 mb-4">Assets by Department</h3>
          <div className="relative h-48 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={deptChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={0}
                  outerRadius={65}
                  dataKey="value"
                >
                  {deptChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-4 text-xs font-semibold text-slate-500">
            {deptChartData.map((item, idx) => (
              <div key={idx} className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                <span className="truncate">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left (Span 2): Recent Asset Assignments */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-800">Recent Asset Assignments</h3>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="pb-3 pr-4">Asset ID</th>
                  <th className="pb-3 px-4">Asset</th>
                  <th className="pb-3 px-4">Assigned To</th>
                  <th className="pb-3 px-4">Department</th>
                  <th className="pb-3 px-4">Assigned Date</th>
                  <th className="pb-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {recentAssignments.map((log, index) => {
                  const empIdMatch = log.details.match(/EMP\d+/);
                  const empId = empIdMatch ? empIdMatch[0] : '';
                  const emp = employees.find(e => e.id === empId);

                  return (
                    <tr key={index} className="hover:bg-slate-50/50">
                      <td className="py-3 pr-4 font-bold text-blue-600">LT0001</td>
                      <td className="py-3 px-4 font-medium">Dell Latitude 5440</td>
                      <td className="py-3 px-4 font-semibold text-slate-700">
                        {emp ? (
                          <div className="flex items-center gap-2">
                            <img src={emp.avatar} className="h-5 w-5 rounded-full object-cover shrink-0 animate-fade-in" alt="" />
                            <span>{emp.name}</span>
                          </div>
                        ) : (
                          <span>Rakesh Reddy (EMP001)</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-slate-500">{emp ? emp.department : 'IT'}</td>
                      <td className="py-3 px-4 text-slate-500">{log.dateTime.split(',')[0]}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded-full text-[9px] font-extrabold uppercase">
                          Assigned
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="text-center pt-3 border-t border-slate-100">
            <button className="text-xs font-semibold text-blue-600 hover:text-blue-800 transition-all">
              View all assignments &rarr;
            </button>
          </div>
        </div>

        {/* Right (Span 1): Quick Reports List */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col justify-between space-y-4">
          <h3 className="text-sm font-bold text-slate-800">Quick Reports</h3>
          
          <div className="divide-y divide-slate-100 flex-1 flex flex-col justify-center">
            {reportsList.map((rep, idx) => (
              <div 
                key={idx} 
                className="py-3 flex items-center justify-between gap-3 hover:bg-slate-50/50 rounded-xl px-2 transition-all cursor-pointer group"
                onClick={() => simulateExport(rep.name)}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="p-2 bg-slate-50 rounded-xl text-slate-500 group-hover:bg-blue-50 group-hover:text-blue-600 shrink-0 transition-all">
                    <rep.icon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-slate-800 group-hover:text-blue-600 transition-all truncate">{rep.name}</h4>
                    <p className="text-[9px] text-slate-400 truncate mt-0.5">{rep.desc}</p>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-blue-500 shrink-0 transition-all" />
              </div>
            ))}
          </div>

          {/* Export PDF/Excel buttons */}
          <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-100">
            <button 
              onClick={() => simulateExport('PDF')}
              className="flex items-center justify-center gap-1 py-2 px-3 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl font-bold text-[10px] transition-all"
            >
              <FileText className="h-4 w-4 text-red-500" />
              <span>Export PDF</span>
            </button>
            <button 
              onClick={() => simulateExport('Excel')}
              className="flex items-center justify-center gap-1 py-2 px-3 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl font-bold text-[10px] transition-all"
            >
              <FileSpreadsheet className="h-4 w-4 text-green-500" />
              <span>Export Excel</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
