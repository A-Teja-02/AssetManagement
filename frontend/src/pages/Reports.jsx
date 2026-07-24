import React, { useState, useRef, useEffect } from 'react';
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
  ChevronDown,
  Check,
  Download,
  UploadCloud,
  FileUp,
  X,
  ShieldCheck,
  Search,
  Building2,
  User,
  Layers,
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
  const { assets, employees, repairs, activity, categories, guidelines, updateGuidelines, showToast } = useAssetManager();
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
    { name: 'IT', value: 45, color: '#1E3A8A', label: 'IT (45%)' },
    { name: 'HR', value: 20, color: '#10b981', label: 'HR (20%)' },
    { name: 'Finance', value: 15, color: '#f59e0b', label: 'Finance (15%)' },
    { name: 'Marketing', value: 12, color: '#ec4899', label: 'Marketing (12%)' },
    { name: 'Sales', value: 8, color: '#8b5cf6', label: 'Sales (8%)' }
  ];

  // Custom Report Generator state
  const [reportType, setReportType] = useState('category');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('All');
  const [selectedDeptFilter, setSelectedDeptFilter] = useState('All');
  const [selectedEmpFilter, setSelectedEmpFilter] = useState('All');
  const [selectedOwnershipFilter, setSelectedOwnershipFilter] = useState('All');
  const [reportSearchTerm, setReportSearchTerm] = useState('');

  // Category Combobox state
  const [isCatDropdownOpen, setIsCatDropdownOpen] = useState(false);
  const [catSearchQuery, setCatSearchQuery] = useState('All Categories');
  const [isCatTyping, setIsCatTyping] = useState(false);
  const catDropdownRef = useRef(null);

  useEffect(() => {
    if (!isCatTyping) {
      setCatSearchQuery(selectedCategoryFilter === 'All' ? 'All Categories' : selectedCategoryFilter);
    }
  }, [selectedCategoryFilter, isCatTyping]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (catDropdownRef.current && !catDropdownRef.current.contains(event.target)) {
        setIsCatDropdownOpen(false);
        setIsCatTyping(false);
        setCatSearchQuery(selectedCategoryFilter === 'All' ? 'All Categories' : selectedCategoryFilter);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [selectedCategoryFilter]);

  // Employee Combobox state
  const [isEmpDropdownOpen, setIsEmpDropdownOpen] = useState(false);
  const [empSearchQuery, setEmpSearchQuery] = useState('All Assigned Employees');
  const [isEmpTyping, setIsEmpTyping] = useState(false);
  const empDropdownRef = useRef(null);

  useEffect(() => {
    if (!isEmpTyping) {
      if (selectedEmpFilter === 'All') {
        setEmpSearchQuery('All Assigned Employees');
      } else {
        const emp = (employees || []).find(e => e.id === selectedEmpFilter);
        setEmpSearchQuery(emp ? `${emp.id} - ${emp.name}` : selectedEmpFilter);
      }
    }
  }, [selectedEmpFilter, isEmpTyping, employees]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (empDropdownRef.current && !empDropdownRef.current.contains(event.target)) {
        setIsEmpDropdownOpen(false);
        setIsEmpTyping(false);
        if (selectedEmpFilter === 'All') {
          setEmpSearchQuery('All Assigned Employees');
        } else {
          const emp = (employees || []).find(e => e.id === selectedEmpFilter);
          setEmpSearchQuery(emp ? `${emp.id} - ${emp.name}` : selectedEmpFilter);
        }
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [selectedEmpFilter, employees]);

  // Department Combobox state
  const [isDeptDropdownOpen, setIsDeptDropdownOpen] = useState(false);
  const [deptSearchQuery, setDeptSearchQuery] = useState('All Departments');
  const [isDeptTyping, setIsDeptTyping] = useState(false);
  const deptDropdownRef = useRef(null);

  useEffect(() => {
    if (!isDeptTyping) {
      setDeptSearchQuery(selectedDeptFilter === 'All' ? 'All Departments' : selectedDeptFilter);
    }
  }, [selectedDeptFilter, isDeptTyping]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (deptDropdownRef.current && !deptDropdownRef.current.contains(event.target)) {
        setIsDeptDropdownOpen(false);
        setIsDeptTyping(false);
        setDeptSearchQuery(selectedDeptFilter === 'All' ? 'All Departments' : selectedDeptFilter);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [selectedDeptFilter]);

  // Ownership Combobox state
  const [isOwnershipDropdownOpen, setIsOwnershipDropdownOpen] = useState(false);
  const [ownershipSearchQuery, setOwnershipSearchQuery] = useState('All Ownership Entities');
  const [isOwnershipTyping, setIsOwnershipTyping] = useState(false);
  const ownershipDropdownRef = useRef(null);

  useEffect(() => {
    if (!isOwnershipTyping) {
      setOwnershipSearchQuery(selectedOwnershipFilter === 'All' ? 'All Ownership Entities' : selectedOwnershipFilter);
    }
  }, [selectedOwnershipFilter, isOwnershipTyping]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ownershipDropdownRef.current && !ownershipDropdownRef.current.contains(event.target)) {
        setIsOwnershipDropdownOpen(false);
        setIsOwnershipTyping(false);
        setOwnershipSearchQuery(selectedOwnershipFilter === 'All' ? 'All Ownership Entities' : selectedOwnershipFilter);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [selectedOwnershipFilter]);

  const categoryNamesFromState = (categories || []).map(c => c.name);
  const categoryNamesFromAssets = (assets || []).map(a => a.type);
  const availableCategories = ['All', ...new Set([...categoryNamesFromState, ...categoryNamesFromAssets])].filter(Boolean);
  const availableDepartments = ['All', ...new Set((employees || []).map(e => e.department))].filter(Boolean);

  const filteredCategoriesList = availableCategories.filter(cat => {
    if (!isCatTyping || !catSearchQuery.trim()) return true;
    const q = catSearchQuery.toLowerCase().trim();
    return (cat === 'All' ? 'All Categories' : cat).toLowerCase().includes(q);
  });

  const filteredDeptList = availableDepartments.filter(dept => {
    if (!isDeptTyping || !deptSearchQuery.trim()) return true;
    const q = deptSearchQuery.toLowerCase().trim();
    return (dept === 'All' ? 'All Departments' : dept).toLowerCase().includes(q);
  });

  const ownershipOptions = ['All', 'Quadrant IT Services Asset', 'DSV Asset'];
  const filteredOwnershipList = ownershipOptions.filter(ent => {
    if (!isOwnershipTyping || !ownershipSearchQuery.trim()) return true;
    const q = ownershipSearchQuery.toLowerCase().trim();
    return (ent === 'All' ? 'All Ownership Entities' : ent).toLowerCase().includes(q);
  });

  const filteredEmpList = (employees || []).filter(emp => {
    if (!isEmpTyping || !empSearchQuery.trim()) return true;
    const q = empSearchQuery.toLowerCase().trim();
    return `${emp.id} ${emp.name} ${emp.department} ${emp.email}`.toLowerCase().includes(q);
  });

  const getGeneratedReportData = () => {
    let list = [...(assets || [])];

    if (reportType === 'category') {
      if (selectedCategoryFilter !== 'All') {
        const catQuery = selectedCategoryFilter.toLowerCase().trim();
        list = list.filter(a => {
          const assetType = (a.type || '').toLowerCase().trim();
          return assetType === catQuery || catQuery.includes(assetType) || assetType.includes(catQuery);
        });
      }
    } else if (reportType === 'department') {
      if (selectedDeptFilter !== 'All') {
        const deptEmpIds = (employees || []).filter(e => e.department === selectedDeptFilter).map(e => e.id);
        list = list.filter(a => deptEmpIds.includes(a.assignedTo));
      }
    } else if (reportType === 'employee') {
      if (selectedEmpFilter !== 'All') {
        list = list.filter(a => a.assignedTo === selectedEmpFilter);
      } else {
        list = list.filter(a => a.assignedTo !== null);
      }
    } else if (reportType === 'ownership') {
      if (selectedOwnershipFilter !== 'All') {
        list = list.filter(a => (a.ownerEntity || 'Quadrant IT Services Asset') === selectedOwnershipFilter);
      }
    } else if (reportType === 'repair') {
      list = list.filter(a => a.status === 'Under Repair');
    } else if (reportType === 'disposed') {
      list = list.filter(a => a.status === 'Disposed' || a.status === 'Retired');
    }

    if (reportSearchTerm.trim()) {
      const q = reportSearchTerm.toLowerCase().trim();
      list = list.filter(a => {
        const owner = (employees || []).find(e => e.id === a.assignedTo);
        const searchStr = `${a.id} ${a.type} ${a.brand} ${a.model} ${a.serialNumber} ${a.status} ${owner ? owner.name : ''}`.toLowerCase();
        return searchStr.includes(q);
      });
    }

    return list;
  };

  const reportData = getGeneratedReportData();

  const handleExportActiveReport = (format = 'CSV') => {
    const data = reportData;
    if (data.length === 0) {
      showToast('No data available to export for this report view.', 'error');
      return;
    }

    const headers = "Asset ID,Type,Brand,Model,Serial Number,Status,Assigned To,Department,Ownership Entity,Category Classification,Purchase Date,Warranty Expiration\n";
    const rows = data.map(a => {
      const owner = (employees || []).find(e => e.id === a.assignedTo);
      return `"${a.id}","${a.type}","${a.brand}","${a.model}","${a.serialNumber}","${a.status}","${owner ? owner.name : '-'}","${owner ? owner.department : '-'}","${a.ownerEntity || 'Quadrant IT Services Asset'}","${a.categoryGroup || 'IT Asset'}","${a.purchaseDate || '-'}","${a.warrantyEndDate || '-'}"`;
    }).join("\n");

    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `IT_Report_${reportType.toUpperCase()}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`Successfully exported ${data.length} records (${reportType.toUpperCase()} Report) as ${format}!`);
  };

  // Quick report types list
  const reportsList = [
    { typeId: 'master', name: 'All Assets Master Report', desc: 'Detailed list of all hardware assets', icon: Laptop },
    { typeId: 'category', name: 'Category-wise Report', desc: 'Breakdown by individual asset categories', icon: Layers },
    { typeId: 'department', name: 'Department-wise Report', desc: 'Assets grouped by department', icon: Building2 },
    { typeId: 'employee', name: 'Employee-wise Assets', desc: 'Assets assigned to each employee', icon: User },
    { typeId: 'ownership', name: 'Ownership Entity Report', desc: 'DSV Assets vs Quadrant IT Assets', icon: ShieldCheck },
    { typeId: 'repair', name: 'Assets Under Repair', desc: 'List of assets under repair tickets', icon: Wrench },
    { typeId: 'disposed', name: 'Retired / Disposed Assets', desc: 'List of retired hardware assets', icon: Trash2 }
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
        <MetricCard icon={Ticket} title="Number of Tickets" value={totalTickets} color="blue" linkTo="/repairs" showLink />
        <MetricCard icon={CheckCircle2} title="Resolved Tickets" value={resolvedTickets} color="green" linkTo="/repairs" showLink />
        <MetricCard icon={Clock} title="Pending Tickets" value={pendingTickets} color="orange" linkTo="/repairs" showLink />
        <MetricCard icon={Laptop} title="Total Assets" value={total} color="purple" linkTo="/assets" showLink />
        <MetricCard icon={TrendingUp} title="Assigned Assets" value={assigned} color="teal" linkTo="/assets" showLink />
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

      {/* Bottom Section: Quick Reports (Left) & Custom Reports Hub (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left (Span 1): Quick Reports Navigation Card */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col justify-between space-y-4">
          <div>
            <h3 className="text-base font-extrabold text-slate-800 flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-600" />
              <span>Quick Reports</span>
            </h3>
            <p className="text-xs text-slate-400 font-semibold mt-0.5">Click any report to view & generate details on the right</p>
          </div>

          <div className="divide-y divide-slate-100 flex-1 flex flex-col justify-center my-2">
            {reportsList.map((rep, idx) => (
              <div
                key={idx}
                className={`py-3 flex items-center justify-between gap-3 hover:bg-slate-50/80 rounded-xl px-2.5 transition-all cursor-pointer group ${reportType === rep.typeId ? 'bg-blue-50/80 font-bold border border-blue-100/80' : ''
                  }`}
                onClick={() => setReportType(rep.typeId)}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`p-2 rounded-xl shrink-0 transition-all ${reportType === rep.typeId ? 'bg-blue-600 text-white shadow-xs' : 'bg-slate-50 text-slate-500 group-hover:bg-blue-50 group-hover:text-blue-600'
                    }`}>
                    <rep.icon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-slate-800 group-hover:text-blue-600 transition-all truncate">{rep.name}</h4>
                    <p className="text-[9px] text-slate-400 truncate mt-0.5">{rep.desc}</p>
                  </div>
                </div>
                <ChevronRight className={`h-4 w-4 shrink-0 transition-all ${reportType === rep.typeId ? 'text-blue-600 translate-x-0.5' : 'text-slate-300 group-hover:text-blue-500'
                  }`} />
              </div>
            ))}
          </div>
        </div>

        {/* Right (Span 2): Active Report Detailed View & Table */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-base font-extrabold text-slate-800 flex items-center gap-2">
                <FileSpreadsheet className="h-5 w-5 text-blue-600" />
                <span>
                  {reportsList.find(r => r.typeId === reportType)?.name || 'Custom Report View'}
                </span>
              </h3>
              <p className="text-xs text-slate-400 font-semibold mt-0.5">Filter and view detailed asset data for the selected report</p>
            </div>

            <button
              onClick={() => handleExportActiveReport('CSV')}
              className="flex items-center justify-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-500/20 transition-all cursor-pointer shrink-0"
            >
              <Download className="h-4 w-4" />
              <span>Export Report ({reportData.length})</span>
            </button>
          </div>



          {/* Sub-Filters Bar */}
          <div className="flex flex-col sm:flex-row items-center gap-3 bg-slate-50/50 p-3 rounded-2xl border border-slate-100 text-xs">
            {/* Category Filter Combobox (Dropdown + Type Filter) */}
            {reportType === 'category' && (
              <div className="relative w-full sm:w-auto" ref={catDropdownRef}>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-500 whitespace-nowrap">Category:</span>
                  <div
                    onClick={() => setIsCatDropdownOpen(prev => !prev)}
                    className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-xl font-bold text-slate-700 focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all cursor-pointer min-w-[170px]"
                  >
                    <input
                      type="text"
                      value={catSearchQuery}
                      onFocus={() => setIsCatDropdownOpen(true)}
                      onChange={(e) => {
                        setCatSearchQuery(e.target.value);
                        setIsCatTyping(true);
                        setIsCatDropdownOpen(true);
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsCatDropdownOpen(true);
                      }}
                      placeholder="Type category..."
                      className="w-full bg-transparent focus:outline-none font-bold text-slate-700 text-xs placeholder:text-slate-400 cursor-pointer focus:cursor-text"
                    />
                    <ChevronDown className={`h-4 w-4 text-slate-400 shrink-0 transition-transform duration-200 ${isCatDropdownOpen ? 'rotate-180' : ''}`} />
                  </div>
                </div>

                {isCatDropdownOpen && (
                  <div className="absolute top-full left-[70px] mt-1 bg-white border border-slate-200 rounded-2xl shadow-xl py-1.5 z-50 min-w-[180px] max-h-60 overflow-y-auto animate-in fade-in slide-in-from-top-2">
                    {filteredCategoriesList.length === 0 ? (
                      <div className="p-2.5 text-center text-xs text-slate-400 font-medium">
                        No matching category
                      </div>
                    ) : (
                      filteredCategoriesList.map(cat => (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => {
                            setSelectedCategoryFilter(cat);
                            setCatSearchQuery(cat === 'All' ? 'All Categories' : cat);
                            setIsCatTyping(false);
                            setIsCatDropdownOpen(false);
                          }}
                          className={`w-full text-left px-3 py-2 text-xs font-semibold flex items-center justify-between transition-all cursor-pointer ${selectedCategoryFilter === cat
                              ? 'bg-blue-50 text-blue-600 font-bold'
                              : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                            }`}
                        >
                          <span>{cat === 'All' ? 'All Categories' : cat}</span>
                          {selectedCategoryFilter === cat && <Check className="h-3.5 w-3.5 text-blue-600 shrink-0" />}
                        </button>
                      ))
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Department Filter Combobox (Dropdown + Type Filter) */}
            {reportType === 'department' && (
              <div className="relative w-full sm:w-auto" ref={deptDropdownRef}>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-500 whitespace-nowrap">Department:</span>
                  <div
                    onClick={() => setIsDeptDropdownOpen(prev => !prev)}
                    className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-xl font-bold text-slate-700 focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all cursor-pointer min-w-[180px]"
                  >
                    <input
                      type="text"
                      value={deptSearchQuery}
                      onFocus={(e) => {
                        e.target.select();
                        setIsDeptDropdownOpen(true);
                      }}
                      onChange={(e) => {
                        setDeptSearchQuery(e.target.value);
                        setIsDeptTyping(true);
                        setIsDeptDropdownOpen(true);
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsDeptDropdownOpen(true);
                      }}
                      placeholder="Type department..."
                      className="w-full bg-transparent focus:outline-none font-bold text-slate-700 text-xs placeholder:text-slate-400 cursor-pointer focus:cursor-text"
                    />
                    <ChevronDown className={`h-4 w-4 text-slate-400 shrink-0 transition-transform duration-200 ${isDeptDropdownOpen ? 'rotate-180' : ''}`} />
                  </div>
                </div>

                {isDeptDropdownOpen && (
                  <div className="absolute top-full left-[85px] mt-1 bg-white border border-slate-200 rounded-2xl shadow-xl py-1.5 z-50 min-w-[190px] max-h-60 overflow-y-auto animate-in fade-in slide-in-from-top-2">
                    {filteredDeptList.length === 0 ? (
                      <div className="p-2.5 text-center text-xs text-slate-400 font-medium">
                        No matching department
                      </div>
                    ) : (
                      filteredDeptList.map(dept => (
                        <button
                          key={dept}
                          type="button"
                          onClick={() => {
                            setSelectedDeptFilter(dept);
                            setDeptSearchQuery(dept === 'All' ? 'All Departments' : dept);
                            setIsDeptTyping(false);
                            setIsDeptDropdownOpen(false);
                          }}
                          className={`w-full text-left px-3 py-2 text-xs font-semibold flex items-center justify-between transition-all cursor-pointer ${selectedDeptFilter === dept
                              ? 'bg-blue-50 text-blue-600 font-bold'
                              : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                            }`}
                        >
                          <span>{dept === 'All' ? 'All Departments' : dept}</span>
                          {selectedDeptFilter === dept && <Check className="h-3.5 w-3.5 text-blue-600 shrink-0" />}
                        </button>
                      ))
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Employee Filter Combobox (Dropdown + Type Filter) */}
            {reportType === 'employee' && (
              <div className="relative w-full sm:w-auto" ref={empDropdownRef}>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-500 whitespace-nowrap">Employee:</span>
                  <div
                    onClick={() => setIsEmpDropdownOpen(prev => !prev)}
                    className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-xl font-bold text-slate-700 focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all cursor-pointer min-w-[210px]"
                  >
                    <input
                      type="text"
                      value={empSearchQuery}
                      onFocus={(e) => {
                        e.target.select();
                        setIsEmpDropdownOpen(true);
                      }}
                      onChange={(e) => {
                        setEmpSearchQuery(e.target.value);
                        setIsEmpTyping(true);
                        setIsEmpDropdownOpen(true);
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsEmpDropdownOpen(true);
                      }}
                      placeholder="Type name or ID..."
                      className="w-full bg-transparent focus:outline-none font-bold text-slate-700 text-xs placeholder:text-slate-400 cursor-pointer focus:cursor-text"
                    />
                    <ChevronDown className={`h-4 w-4 text-slate-400 shrink-0 transition-transform duration-200 ${isEmpDropdownOpen ? 'rotate-180' : ''}`} />
                  </div>
                </div>

                {isEmpDropdownOpen && (
                  <div className="absolute top-full left-[75px] mt-1 bg-white border border-slate-200 rounded-2xl shadow-xl py-1.5 z-50 min-w-[240px] max-h-60 overflow-y-auto animate-in fade-in slide-in-from-top-2">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedEmpFilter('All');
                        setEmpSearchQuery('All Assigned Employees');
                        setIsEmpTyping(false);
                        setIsEmpDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs font-semibold flex items-center justify-between transition-all cursor-pointer border-b border-slate-100 ${selectedEmpFilter === 'All' ? 'bg-blue-50 text-blue-600 font-bold' : 'text-slate-700 hover:bg-slate-50'
                        }`}
                    >
                      <span>All Assigned Employees</span>
                      {selectedEmpFilter === 'All' && <Check className="h-3.5 w-3.5 text-blue-600 shrink-0" />}
                    </button>

                    {filteredEmpList.length === 0 ? (
                      <div className="p-2.5 text-center text-xs text-slate-400 font-medium">
                        No matching employee
                      </div>
                    ) : (
                      filteredEmpList.map(emp => (
                        <button
                          key={emp.id}
                          type="button"
                          onClick={() => {
                            setSelectedEmpFilter(emp.id);
                            setEmpSearchQuery(`${emp.id} - ${emp.name}`);
                            setIsEmpTyping(false);
                            setIsEmpDropdownOpen(false);
                          }}
                          className={`w-full text-left px-3 py-2 text-xs font-semibold flex items-center justify-between transition-all cursor-pointer ${selectedEmpFilter === emp.id
                              ? 'bg-blue-50 text-blue-600 font-bold'
                              : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                            }`}
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <Avatar name={emp.name} className="h-5 w-5 rounded-full" textSize="text-[7px]" />
                            <div className="truncate">
                              <span className="font-extrabold text-blue-600 mr-1">{emp.id}</span>
                              <span>{emp.name}</span>
                              <span className="text-[9px] text-slate-400 ml-1">({emp.department})</span>
                            </div>
                          </div>
                          {selectedEmpFilter === emp.id && <Check className="h-3.5 w-3.5 text-blue-600 shrink-0" />}
                        </button>
                      ))
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Ownership Filter Combobox (Dropdown + Type Filter) */}
            {reportType === 'ownership' && (
              <div className="relative w-full sm:w-auto" ref={ownershipDropdownRef}>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-500 whitespace-nowrap">Entity:</span>
                  <div
                    onClick={() => setIsOwnershipDropdownOpen(prev => !prev)}
                    className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-xl font-bold text-slate-700 focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all cursor-pointer min-w-[210px]"
                  >
                    <input
                      type="text"
                      value={ownershipSearchQuery}
                      onFocus={(e) => {
                        e.target.select();
                        setIsOwnershipDropdownOpen(true);
                      }}
                      onChange={(e) => {
                        setOwnershipSearchQuery(e.target.value);
                        setIsOwnershipTyping(true);
                        setIsOwnershipDropdownOpen(true);
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsOwnershipDropdownOpen(true);
                      }}
                      placeholder="Type ownership..."
                      className="w-full bg-transparent focus:outline-none font-bold text-slate-700 text-xs placeholder:text-slate-400 cursor-pointer focus:cursor-text"
                    />
                    <ChevronDown className={`h-4 w-4 text-slate-400 shrink-0 transition-transform duration-200 ${isOwnershipDropdownOpen ? 'rotate-180' : ''}`} />
                  </div>
                </div>

                {isOwnershipDropdownOpen && (
                  <div className="absolute top-full left-[55px] mt-1 bg-white border border-slate-200 rounded-2xl shadow-xl py-1.5 z-50 min-w-[220px] max-h-60 overflow-y-auto animate-in fade-in slide-in-from-top-2">
                    {filteredOwnershipList.length === 0 ? (
                      <div className="p-2.5 text-center text-xs text-slate-400 font-medium">
                        No matching entity
                      </div>
                    ) : (
                      filteredOwnershipList.map(ent => (
                        <button
                          key={ent}
                          type="button"
                          onClick={() => {
                            setSelectedOwnershipFilter(ent);
                            setOwnershipSearchQuery(ent === 'All' ? 'All Ownership Entities' : ent);
                            setIsOwnershipTyping(false);
                            setIsOwnershipDropdownOpen(false);
                          }}
                          className={`w-full text-left px-3 py-2 text-xs font-semibold flex items-center justify-between transition-all cursor-pointer ${selectedOwnershipFilter === ent
                              ? 'bg-blue-50 text-blue-600 font-bold'
                              : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                            }`}
                        >
                          <span>{ent === 'All' ? 'All Ownership Entities' : ent}</span>
                          {selectedOwnershipFilter === ent && <Check className="h-3.5 w-3.5 text-blue-600 shrink-0" />}
                        </button>
                      ))
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Search Input for Report Table */}
            <div className="relative flex-1 w-full">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Search className="h-3.5 w-3.5" />
              </span>
              <input
                type="text"
                value={reportSearchTerm}
                onChange={e => setReportSearchTerm(e.target.value)}
                placeholder="Search within report..."
                className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
          </div>

          {/* Report Summary Badges Bar */}
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 bg-blue-50/50 p-3 rounded-2xl border border-blue-100/80">
            <span>Showing <strong className="text-blue-600">{reportData.length}</strong> matching assets</span>
            <div className="flex items-center gap-3 text-[11px]">
              <span className="text-emerald-600 font-extrabold">{reportData.filter(a => a.status === 'Assigned').length} Assigned</span>
              <span className="text-blue-600 font-extrabold">{reportData.filter(a => a.status === 'Available').length} Available</span>
              <span className="text-amber-600 font-extrabold">{reportData.filter(a => a.status === 'Under Repair').length} Repair</span>
            </div>
          </div>

          {/* Filtered Report Table */}
          <div className="max-h-[350px] overflow-y-auto rounded-xl border border-slate-200/80 shadow-xs">
            <table className="w-full text-left border-collapse text-xs">
              <thead className="sticky top-0 bg-slate-50 z-20 border-b border-slate-200 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                <tr>
                  <th className="py-2.5 px-3">Asset ID</th>
                  <th className="py-2.5 px-3">Asset Type & Model</th>
                  <th className="py-2.5 px-3">Serial Number</th>
                  <th className="py-2.5 px-3">Assigned To</th>
                  <th className="py-2.5 px-3">Ownership</th>
                  <th className="py-2.5 px-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 bg-white">
                {reportData.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-10 text-center text-slate-400 font-semibold">
                      No matching records found for this report configuration.
                    </td>
                  </tr>
                ) : (
                  reportData.map((asset) => {
                    const owner = (employees || []).find(e => e.id === asset.assignedTo);

                    return (
                      <tr key={asset.id} className="hover:bg-slate-50/80 font-medium">
                        <td className="py-2.5 px-3 font-extrabold text-blue-600">{asset.id}</td>
                        <td className="py-2.5 px-3 font-bold text-slate-800">
                          <div>
                            <p className="text-xs font-bold text-slate-800">{asset.brand} {asset.model}</p>
                            <p className="text-[10px] text-slate-400 font-medium">{asset.type}</p>
                          </div>
                        </td>
                        <td className="py-2.5 px-3 font-mono text-slate-600 text-[11px]">{asset.serialNumber}</td>
                        <td className="py-2.5 px-3">
                          {owner ? (
                            <div className="flex items-center gap-1.5">
                              <Avatar name={owner.name} className="h-5 w-5 rounded-full" textSize="text-[7px]" />
                              <div>
                                <p className="font-bold text-slate-800 leading-tight">{owner.name}</p>
                                <p className="text-[9px] text-slate-400">{owner.department}</p>
                              </div>
                            </div>
                          ) : (
                            <span className="text-slate-400 font-semibold">-</span>
                          )}
                        </td>
                        <td className="py-2.5 px-3 font-semibold text-slate-600 text-[10px]">
                          {asset.ownerEntity || 'Quadrant IT Services Asset'}
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold whitespace-nowrap border ${asset.status === 'Assigned' ? 'bg-blue-50 text-[#1E3A8A] border-blue-200/60' :
                              asset.status === 'Available' ? 'bg-emerald-50 text-emerald-600 border-emerald-100/60' :
                                asset.status === 'Under Repair' ? 'bg-rose-50 text-rose-600 border-rose-100/60' :
                                  'bg-slate-900 text-slate-50 border-slate-900'
                            }`}>
                            {asset.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
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
