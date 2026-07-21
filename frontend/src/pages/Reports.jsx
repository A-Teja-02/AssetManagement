import React, { useState } from 'react';
import { 
  Laptop, 
  CheckCircle, 
  CheckCircle2,
  Clock,
  Ticket,
  TrendingUp, 
  Wrench, 
  Trash2, 
  Calendar, 
  Filter, 
  FileText, 
  FileSpreadsheet, 
  ChevronRight,
  Download,
  UploadCloud,
  FileUp,
  X,
  ShieldCheck,
  CheckCircle2 as VerifiedBadge
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
import Avatar from '../components/Avatar';
import { downloadOrOpenGuidelinesPdf } from '../utils/downloadDocument';

const Reports = () => {
  const { assets, employees, repairs, activity, guidelines, updateGuidelines, showToast } = useAssetManager();
  const [activeTab, setActiveTab] = useState('Overview');
  const [dateRange, setDateRange] = useState('01 Jul 2026 - 10 Jul 2026');

  const formatDateWithYear = (dateStr) => {
    if (!dateStr) return '-';
    const parts = dateStr.split(',').map(s => s.trim());
    if (/\b\d{4}\b/.test(parts[0])) {
      return parts[0];
    }
    if (parts.length >= 2 && /\b\d{4}\b/.test(parts[1])) {
      return `${parts[0]}, ${parts[1]}`;
    }
    return parts[0];
  };

  // PDF Guidelines Modal state
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const [pdfTitle, setPdfTitle] = useState(guidelines?.title || 'Quadrant IT Services - Asset Policy & Usage Guidelines 2026');
  const [pdfVersion, setPdfVersion] = useState(guidelines?.version || 'v2.4');
  const [pdfSummary, setPdfSummary] = useState(guidelines?.summary || 'Official company policy guidelines governing hardware usage, security protocols, and maintenance procedures.');
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileDataUrl, setFileDataUrl] = useState(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        setFileDataUrl(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePostGuidelines = (e) => {
    e.preventDefault();
    if (!pdfTitle.trim()) {
      showToast('Policy title is required.', 'error');
      return;
    }
    const fileName = selectedFile ? selectedFile.name : (guidelines?.fileName || 'Quadrant_IT_Asset_Guidelines_2026.pdf');
    const fileSize = selectedFile ? `${(selectedFile.size / (1024 * 1024)).toFixed(1)} MB` : (guidelines?.size || '2.4 MB');

    updateGuidelines({
      title: pdfTitle.trim(),
      version: pdfVersion.trim() || 'v2.4',
      summary: pdfSummary.trim() || 'Official company asset policy and security guidelines.',
      fileName: fileName,
      size: fileSize,
      fileData: fileDataUrl || guidelines?.fileData || null
    });

    setIsPdfModalOpen(false);
    showToast(`Successfully posted updated Asset Policy PDF "${fileName}" to all employee portals!`);
  };

  // Dynamic tallies
  const safeAssets = assets || [];
  const safeRepairs = repairs || [];

  const total = safeAssets.length;
  const assigned = safeAssets.filter(a => a.status === 'Assigned').length;
  const available = safeAssets.filter(a => a.status === 'Available').length;
  const repair = safeAssets.filter(a => a.status === 'Under Repair').length;
  const disposed = safeAssets.filter(a => a.status === 'Disposed').length;

  const totalTickets = safeRepairs.length;
  const resolvedTickets = safeRepairs.filter(r => r.status === 'Completed' || r.status === 'Resolved').length;
  const pendingTickets = safeRepairs.filter(r => r.status === 'In Progress' || r.status === 'Pending' || r.status === 'Awaiting Parts').length;

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
    showToast(`Simulating Report Export as ${format}. Generating template structure for ${dateRange}...`, "info");
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Breadcrumbs */}
      <div className="text-xs font-semibold text-slate-400">
        <span className="hover:text-slate-600 cursor-pointer">Dashboard</span>
        <span className="mx-2">&gt;</span>
        <span className="text-slate-600 font-bold">Reports</span>
      </div>



      {/* KPI Cards: Tickets & Assets Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
        <MetricCard icon={Ticket} title="Number of Tickets" value={totalTickets} color="blue" linkTo="/repairs" subtext="Total raised requests" />
        <MetricCard icon={CheckCircle2} title="Resolved Tickets" value={resolvedTickets} color="green" linkTo="/repairs" subtext={`${Math.round((resolvedTickets / (totalTickets || 1)) * 100)}% completed`} />
        <MetricCard icon={Clock} title="Pending Tickets" value={pendingTickets} color="orange" linkTo="/repairs" subtext="In progress / open" />
        <MetricCard icon={Laptop} title="Total Assets" value={total} color="purple" linkTo="/assets" subtext="Tracked inventory" />
        <MetricCard icon={TrendingUp} title="Assigned Assets" value={assigned} color="teal" linkTo="/assets" subtext={`${assignedPct}% assigned`} />
      </div>

      {/* Official Asset Guidelines PDF Management Card */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3.5">
            <div className="p-3 bg-red-50 text-red-600 rounded-2xl border border-red-100 shrink-0">
              <FileText className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-base font-extrabold text-slate-800">Company Asset Policy & Guidelines PDF</h3>
                <span className="px-2.5 py-0.5 text-[10px] font-extrabold text-emerald-700 bg-emerald-50 rounded-full border border-emerald-200 flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  Live for All Employees
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1 font-medium">
                Post or update official company asset usage rules, security compliance, and PDF documentation reflected on all employee dashboards.
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsPdfModalOpen(true)}
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-500/20 transition-all cursor-pointer shrink-0"
          >
            <UploadCloud className="h-4 w-4" />
            <span>Upload / Post Guidelines PDF</span>
          </button>
        </div>

        {/* Current Active PDF Details */}
        <div className="bg-slate-50 border border-slate-200/70 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5 min-w-0">
            <div className="p-3 bg-white border border-slate-200 rounded-xl text-red-600 shrink-0 shadow-sm">
              <FileText className="h-6 w-6" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h4 className="text-xs font-extrabold text-slate-800 truncate">{guidelines?.title || 'Quadrant IT Asset Usage Guidelines 2026'}</h4>
                <span className="px-2 py-0.5 text-[9px] font-extrabold bg-blue-50 text-blue-700 rounded-md border border-blue-100">
                  {guidelines?.version || 'v2.4'}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">{guidelines?.summary}</p>
              <div className="flex items-center gap-4 text-[10px] text-slate-400 font-semibold mt-2 flex-wrap">
                <span>File: <strong className="text-slate-700">{guidelines?.fileName || 'Quadrant_IT_Asset_Policy_2026.pdf'}</strong></span>
                <span>Size: {guidelines?.size || '2.4 MB'}</span>
                <span>Posted Date: {guidelines?.uploadedDate}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => {
                showToast(`Opening ${guidelines?.fileName || 'Asset_Guidelines.pdf'}...`, 'info');
                downloadOrOpenGuidelinesPdf(guidelines);
              }}
              className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-xl shadow-sm transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Download className="h-3.5 w-3.5 text-blue-600" />
              <span>Preview / Download Document</span>
            </button>
          </div>
        </div>
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
                            <Avatar name={emp.name} className="h-5 w-5 rounded-full animate-fade-in" textSize="text-[7px]" />
                            <span>{emp.name}</span>
                          </div>
                        ) : (
                          <span>Rakesh Reddy (EMP001)</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-slate-500">{emp ? emp.department : 'IT'}</td>
                      <td className="py-3 px-4 text-slate-500">{formatDateWithYear(log.dateTime)}</td>
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

      {/* Modal: Post / Upload Asset Guidelines PDF */}
      {isPdfModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsPdfModalOpen(false)} />
          <div className="relative bg-white border border-slate-200 w-full max-w-lg rounded-3xl shadow-2xl p-6 z-10 space-y-5 animate-scale-in">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-red-600" />
                <h3 className="font-extrabold text-slate-800 text-base">Post Asset Policy Guidelines PDF</h3>
              </div>
              <button 
                onClick={() => setIsPdfModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handlePostGuidelines} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1.5">Policy Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Quadrant IT Services - Asset Usage Policy 2026"
                  value={pdfTitle}
                  onChange={(e) => setPdfTitle(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1.5">Version Tag</label>
                  <input
                    type="text"
                    placeholder="e.g. v2.4"
                    value={pdfVersion}
                    onChange={(e) => setPdfVersion(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-medium"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1.5">Attachment File</label>
                  <input
                    type="text"
                    readOnly
                    value={selectedFile ? selectedFile.name : (guidelines?.fileName || 'Quadrant_IT_Asset_Policy_2026.pdf')}
                    className="w-full p-3 bg-slate-100 border border-slate-200 rounded-xl text-slate-600 font-semibold cursor-not-allowed"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1.5">Upload PDF Document *</label>
                <div className="border-2 border-dashed border-slate-200 hover:border-blue-400 rounded-2xl p-4 text-center bg-slate-50/50 hover:bg-white transition-all cursor-pointer relative">
                  <input 
                    type="file" 
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <FileUp className="h-7 w-7 text-blue-500 mx-auto mb-1" />
                  <p className="font-bold text-slate-700 text-xs">
                    {selectedFile ? selectedFile.name : 'Click or drop PDF document here'}
                  </p>
                  <p className="text-[10px] text-slate-400 mt-0.5 font-medium">Supports .pdf documents up to 25MB</p>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1.5">Summary / Scope for Employees</label>
                <textarea
                  rows={3}
                  placeholder="Summary of hardware security, care instructions, and return compliance..."
                  value={pdfSummary}
                  onChange={(e) => setPdfSummary(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-medium"
                />
              </div>

              <div className="flex items-center gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsPdfModalOpen(false)}
                  className="flex-1 py-3 border border-slate-200 rounded-xl hover:bg-slate-50 font-bold text-slate-600 transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/20 transition-all cursor-pointer"
                >
                  Post PDF to Employees
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;
