import React, { useState } from 'react';
import { 
  Laptop, 
  CheckCircle, 
  AlertTriangle, 
  Wrench, 
  Trash2, 
  Plus, 
  Search, 
  Eye, 
  Pencil, 
  Trash, 
  ChevronLeft, 
  ChevronRight,
  TrendingUp,
  X
} from 'lucide-react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip 
} from 'recharts';
import { useAssetManager } from '../hooks/useAssetManager';
import MetricCard from '../components/MetricCard';
import Avatar from '../components/Avatar';

const Dashboard = () => {
  const { 
    assets, 
    employees, 
    repairs, 
    addAsset, 
    updateAsset, 
    deleteAsset,
    showToast
  } = useAssetManager();

  // Search, Pagination state
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const itemsPerPage = 5;

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState(null);

  // Form states
  const [formType, setFormType] = useState('Laptop');
  const [formBrand, setFormBrand] = useState('Dell');
  const [formModel, setFormModel] = useState('');
  const [formSerial, setFormSerial] = useState('');
  const [formStatus, setFormStatus] = useState('Available');
  const [formAssigned, setFormAssigned] = useState('');

  // 1. Calculate dynamic statistics
  const totalCount = assets.length;
  const assignedCount = assets.filter(a => a.status === 'Assigned').length;
  const availableCount = assets.filter(a => a.status === 'Available').length;
  const repairCount = assets.filter(a => a.status === 'Under Repair').length;
  const disposedCount = assets.filter(a => a.status === 'Disposed').length;

  // 2. Prepare Recharts Donut data
  const chartData = [
    { name: 'Assigned', value: assignedCount, color: '#2563eb' },
    { name: 'Available', value: availableCount, color: '#10b981' },
    { name: 'Under Repair', value: repairCount, color: '#f59e0b' },
    { name: 'Disposed', value: disposedCount, color: '#ef4444' }
  ];

  // 3. Filtered assets for bottom table
  const filteredAssets = assets.filter(asset => {
    const owner = employees.find(e => e.id === asset.assignedTo);
    const searchString = `${asset.id} ${asset.type} ${asset.brand} ${asset.model} ${asset.serialNumber} ${asset.status} ${owner ? owner.name : ''}`.toLowerCase();
    return searchString.includes(searchTerm.toLowerCase());
  });

  const totalPages = Math.ceil(filteredAssets.length / itemsPerPage);
  const paginatedAssets = filteredAssets.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // 4. Modal Handlers
  const handleOpenAddModal = () => {
    setFormType('Laptop');
    setFormBrand('Dell');
    setFormModel('');
    setFormSerial('');
    setFormStatus('Available');
    setFormAssigned('');
    setIsAddModalOpen(true);
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    addAsset({
      type: formType,
      brand: formBrand,
      model: formModel,
      serialNumber: formSerial,
      status: formStatus,
      assignedTo: formStatus === 'Assigned' && formAssigned ? formAssigned : null,
      purchaseDate: new Date().toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' }),
      warrantyEndDate: new Date(new Date().setFullYear(new Date().getFullYear() + 3)).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })
    });
    setIsAddModalOpen(false);
  };

  const handleOpenEditModal = (asset) => {
    setSelectedAsset(asset);
    setFormType(asset.type);
    setFormBrand(asset.brand);
    setFormModel(asset.model);
    setFormSerial(asset.serialNumber);
    setFormStatus(asset.status);
    setFormAssigned(asset.assignedTo || '');
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    updateAsset({
      ...selectedAsset,
      type: formType,
      brand: formBrand,
      model: formModel,
      serialNumber: formSerial,
      status: formStatus,
      assignedTo: formStatus === 'Assigned' && formAssigned ? formAssigned : null
    });
    setIsEditModalOpen(false);
  };

  const handleOpenViewModal = (asset) => {
    setSelectedAsset(asset);
    setIsViewModalOpen(true);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* 5 KPI Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <MetricCard icon={Laptop} title="Total Assets" value={totalCount} color="blue" linkTo="/assets" />
        <MetricCard icon={CheckCircle} title="Assigned Assets" value={assignedCount} color="green" linkTo="/assets" />
        <MetricCard icon={TrendingUp} title="Available Assets" value={availableCount} color="orange" linkTo="/assets" />
        <MetricCard icon={Wrench} title="Under Repair" value={repairCount} color="red" linkTo="/repairs" />
        <MetricCard icon={Trash2} title="Disposed Assets" value={disposedCount} color="purple" linkTo="/assets" />
      </div>

      {/* Charts & Status Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Recharts Donut Chart */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
          <h3 className="text-base font-bold text-slate-800">Assets Overview</h3>
          <div className="relative h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Tooltip 
                  contentStyle={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px' }}
                />
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            {/* Center Text */}
            <div className="absolute text-center">
              <span className="text-3xl font-extrabold text-slate-800">{totalCount}</span>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {chartData.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                <span className="text-xs font-semibold text-slate-500">{item.name}</span>
                <span className="text-xs font-bold text-slate-800 ml-auto">
                  {Math.round((item.value / (totalCount || 1)) * 100)}%
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Center: Recent Assignments List */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <h3 className="text-base font-bold text-slate-800">Recent Assignments</h3>
            <button className="text-xs font-bold text-blue-600 hover:text-blue-800">View all</button>
          </div>
          <div className="divide-y divide-slate-100 flex-1 flex flex-col justify-center">
            {employees.slice(0, 4).map((emp, i) => {
              const assigned = assets.filter(a => a.assignedTo === emp.id);
              const deviceName = assigned.length > 0 ? `${assigned[0].brand} ${assigned[0].model}` : 'Generic Item';
              return (
                <div key={emp.id} className="py-3.5 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <Avatar name={emp.name} className="h-10 w-10 rounded-xl" />
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-800 truncate">{emp.name}</p>
                      <p className="text-[10px] text-slate-400 truncate mt-0.5">{deviceName}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 shrink-0">10 Jul 2026</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Asset Status summary list */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <h3 className="text-base font-bold text-slate-800">Asset Status</h3>
            <button className="text-xs font-bold text-blue-600 hover:text-blue-800">View all</button>
          </div>
          <div className="space-y-4 flex-1 flex flex-col justify-center mt-4">
            {[
              { label: 'All Assets', value: totalCount, icon: Laptop, color: 'text-blue-500 bg-blue-50' },
              { label: 'Assigned', value: assignedCount, icon: CheckCircle, color: 'text-emerald-500 bg-emerald-50' },
              { label: 'Available', value: availableCount, icon: TrendingUp, color: 'text-amber-500 bg-amber-50' },
              { label: 'Under Repair', value: repairCount, icon: Wrench, color: 'text-rose-500 bg-rose-50' },
              { label: 'Disposed', value: disposedCount, icon: Trash2, color: 'text-purple-500 bg-purple-50' }
            ].map((stat, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-xl ${stat.color}`}>
                    <stat.icon className="h-4 w-4" />
                  </div>
                  <span className="text-xs font-bold text-slate-700">{stat.label}</span>
                </div>
                <span className="text-sm font-extrabold text-slate-800">{stat.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Table: Latest Assets */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h3 className="text-base font-bold text-slate-800">Latest Assets</h3>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            {/* Search */}
            <div className="relative flex-1 sm:w-64">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Search className="h-4 w-4" />
              </span>
              <input
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Search assets..."
                className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-xs bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
              />
            </div>
            {/* Add Asset Trigger */}
            <button 
              onClick={handleOpenAddModal}
              className="flex items-center justify-center gap-1.5 py-2 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-all shadow-md shadow-blue-500/10 shrink-0"
            >
              <Plus className="h-4 w-4" />
              <span>Add Asset</span>
            </button>
          </div>
        </div>

        {/* Table container */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="pb-3 pr-4">Asset ID</th>
                <th className="pb-3 px-4">Asset Type</th>
                <th className="pb-3 px-4">Brand</th>
                <th className="pb-3 px-4">Model</th>
                <th className="pb-3 px-4">Serial Number</th>
                <th className="pb-3 px-4">Status</th>
                <th className="pb-3 px-4">Assigned To</th>
                <th className="pb-3 px-4">Purchase Date</th>
                <th className="pb-3 pl-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
              {paginatedAssets.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-slate-400">
                    No matching assets found.
                  </td>
                </tr>
              ) : (
                paginatedAssets.map((asset) => {
                  const owner = employees.find(e => e.id === asset.assignedTo);
                  return (
                    <tr key={asset.id} className="hover:bg-slate-50/50 transition-all">
                      <td className="py-4 pr-4 font-bold text-blue-600 cursor-pointer" onClick={() => handleOpenViewModal(asset)}>
                        {asset.id}
                      </td>
                      <td className="py-4 px-4 font-medium">{asset.type}</td>
                      <td className="py-4 px-4">{asset.brand}</td>
                      <td className="py-4 px-4">{asset.model}</td>
                      <td className="py-4 px-4 font-mono">{asset.serialNumber}</td>
                      <td className="py-4 px-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold whitespace-nowrap inline-block text-center min-w-[90px] ${
                          asset.status === 'Assigned' ? 'bg-emerald-50 text-emerald-600' :
                          asset.status === 'Available' ? 'bg-blue-50 text-blue-600' :
                          asset.status === 'Under Repair' ? 'bg-amber-50 text-amber-600' :
                          'bg-slate-100 text-slate-600'
                        }`}>
                          {asset.status}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        {owner ? (
                          <div className="flex items-center gap-2">
                            <Avatar name={owner.name} className="h-5 w-5 rounded-full" textSize="text-[7px]" />
                            <span>{owner.name}</span>
                          </div>
                        ) : (
                          <span className="text-slate-400">-</span>
                        )}
                      </td>
                      <td className="py-4 px-4 text-slate-500">{asset.purchaseDate}</td>
                      <td className="py-4 pl-4 text-right">
                        <div className="flex items-center justify-end gap-2.5">
                          <button 
                            onClick={() => handleOpenViewModal(asset)}
                            className="p-1.5 hover:bg-slate-100 rounded-lg text-blue-600 transition-all"
                            title="View"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button 
                            onClick={() => handleOpenEditModal(asset)}
                            className="p-1.5 hover:bg-slate-100 rounded-lg text-blue-600 transition-all"
                            title="Edit"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button 
                            onClick={() => setDeleteConfirmId(asset.id)}
                            className="p-1.5 hover:bg-red-50 rounded-lg text-red-500 transition-all"
                            title="Delete"
                          >
                            <Trash className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-slate-100 pt-4 text-xs font-semibold text-slate-500">
            <span>
              Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredAssets.length)} of {filteredAssets.length} entries
            </span>
            <div className="flex items-center gap-1">
              <button 
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-2 border border-slate-200 hover:bg-slate-50 rounded-xl disabled:opacity-40 transition-all"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              {(() => {
                const pages = [];
                const maxVisible = 5;
                if (totalPages <= maxVisible) {
                  for (let i = 1; i <= totalPages; i++) pages.push(i);
                } else {
                  pages.push(1);
                  let start = Math.max(2, currentPage - 1);
                  let end = Math.min(totalPages - 1, currentPage + 1);
                  if (currentPage <= 2) {
                    end = 4;
                  } else if (currentPage >= totalPages - 1) {
                    start = totalPages - 3;
                  }
                  if (start > 2) pages.push('...');
                  for (let i = start; i <= end; i++) pages.push(i);
                  if (end < totalPages - 1) pages.push('...');
                  pages.push(totalPages);
                }
                return pages.map((p, idx) => (
                  p === '...' ? (
                    <span key={`dots-${idx}`} className="px-2 text-slate-400 font-bold">...</span>
                  ) : (
                    <button
                      key={p}
                      onClick={() => setCurrentPage(p)}
                      className={`h-8 w-8 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                        currentPage === p 
                          ? 'bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-500/20' 
                          : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      {p}
                    </button>
                  )
                ));
              })()}
              <button 
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="p-2 border border-slate-200 hover:bg-slate-50 rounded-xl disabled:opacity-40 transition-all"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* CRUD Add Asset Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsAddModalOpen(false)} />
          <div className="relative bg-white border border-slate-200 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden p-6 z-10">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
              <h3 className="font-bold text-slate-800">Add New Asset</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="p-1 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Asset Type *</label>
                  <select 
                    value={formType} 
                    onChange={e => setFormType(e.target.value)}
                    className="w-full p-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                  >
                    {["Laptop", "Monitor", "Mouse", "Keyboard", "Headset", "Printer", "Desktop", "Docking Station"].map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Brand *</label>
                  <select 
                    value={formBrand} 
                    onChange={e => setFormBrand(e.target.value)}
                    className="w-full p-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                  >
                    {["Dell", "Logitech", "HP", "Apple", "Samsung", "Lenovo", "Sony", "Epson"].map(b => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Model Name *</label>
                  <input 
                    type="text" 
                    required 
                    value={formModel} 
                    onChange={e => setFormModel(e.target.value)} 
                    placeholder="e.g. Latitude 5440"
                    className="w-full p-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Serial Number / Barcode *</label>
                  <input 
                    type="text" 
                    required 
                    value={formSerial} 
                    onChange={e => setFormSerial(e.target.value)} 
                    placeholder="e.g. ABC12345"
                    className="w-full p-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Initial Status</label>
                  <select 
                    value={formStatus} 
                    onChange={e => setFormStatus(e.target.value)}
                    className="w-full p-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                  >
                    <option value="Available">Available</option>
                    <option value="Assigned">Assigned</option>
                    <option value="Under Repair">Under Repair</option>
                    <option value="Disposed">Disposed</option>
                  </select>
                </div>
                {formStatus === 'Assigned' && (
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">Assign To Employee *</label>
                    <select 
                      required 
                      value={formAssigned} 
                      onChange={e => setFormAssigned(e.target.value)}
                      className="w-full p-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                    >
                      <option value="">Select Employee</option>
                      {employees.map(emp => (
                        <option key={emp.id} value={emp.id}>{emp.name} ({emp.id})</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
              <div className="flex gap-3 justify-end pt-4 border-t border-slate-100">
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-4 py-2 text-xs font-semibold text-slate-500 hover:bg-slate-50 rounded-xl border border-slate-200">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md shadow-blue-500/10">
                  Save Asset
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CRUD Edit Asset Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsEditModalOpen(false)} />
          <div className="relative bg-white border border-slate-200 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden p-6 z-10">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
              <h3 className="font-bold text-slate-800">Edit Asset {selectedAsset?.id}</h3>
              <button onClick={() => setIsEditModalOpen(false)} className="p-1 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Asset Type *</label>
                  <select 
                    value={formType} 
                    onChange={e => setFormType(e.target.value)}
                    className="w-full p-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                  >
                    {["Laptop", "Monitor", "Mouse", "Keyboard", "Headset", "Printer", "Desktop", "Docking Station"].map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Brand *</label>
                  <select 
                    value={formBrand} 
                    onChange={e => setFormBrand(e.target.value)}
                    className="w-full p-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                  >
                    {["Dell", "Logitech", "HP", "Apple", "Samsung", "Lenovo", "Sony", "Epson"].map(b => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Model Name *</label>
                  <input 
                    type="text" 
                    required 
                    value={formModel} 
                    onChange={e => setFormModel(e.target.value)}
                    className="w-full p-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Serial Number / Barcode *</label>
                  <input 
                    type="text" 
                    required 
                    value={formSerial} 
                    onChange={e => setFormSerial(e.target.value)}
                    className="w-full p-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Status</label>
                  <select 
                    value={formStatus} 
                    onChange={e => setFormStatus(e.target.value)}
                    className="w-full p-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                  >
                    <option value="Available">Available</option>
                    <option value="Assigned">Assigned</option>
                    <option value="Under Repair">Under Repair</option>
                    <option value="Disposed">Disposed</option>
                  </select>
                </div>
                {formStatus === 'Assigned' && (
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">Assign To Employee *</label>
                    <select 
                      required 
                      value={formAssigned} 
                      onChange={e => setFormAssigned(e.target.value)}
                      className="w-full p-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                    >
                      <option value="">Select Employee</option>
                      {employees.map(emp => (
                        <option key={emp.id} value={emp.id}>{emp.name} ({emp.id})</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
              <div className="flex gap-3 justify-end pt-4 border-t border-slate-100">
                <button type="button" onClick={() => setIsEditModalOpen(false)} className="px-4 py-2 text-xs font-semibold text-slate-500 hover:bg-slate-50 rounded-xl border border-slate-200">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md shadow-blue-500/10">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CRUD View Asset Modal */}
      {isViewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsViewModalOpen(false)} />
          <div className="relative bg-white border border-slate-200 w-full max-w-md rounded-3xl shadow-2xl overflow-hidden p-6 z-10 flex flex-col items-center">
            <button onClick={() => setIsViewModalOpen(false)} className="absolute top-5 right-5 p-1 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700">
              <X className="h-5 w-5" />
            </button>
            <img src={selectedAsset?.image} alt={selectedAsset?.model} className="h-28 w-28 object-cover rounded-3xl border border-slate-100 shadow-sm mt-4" />
            <h3 className="font-extrabold text-slate-800 text-lg mt-4">{selectedAsset?.brand} {selectedAsset?.model}</h3>
            <span className="text-xs bg-slate-100 text-slate-500 px-3 py-1 rounded-full font-bold mt-1 tracking-wide uppercase">{selectedAsset?.type}</span>

            <div className="w-full mt-6 space-y-3 text-xs">
              <div className="flex justify-between border-b border-slate-50 pb-2">
                <span className="font-semibold text-slate-400">Asset ID</span>
                <span className="font-extrabold text-slate-800">{selectedAsset?.id}</span>
              </div>
              <div className="flex justify-between border-b border-slate-50 pb-2">
                <span className="font-semibold text-slate-400">Serial Number</span>
                <span className="font-mono font-bold text-slate-800">{selectedAsset?.serialNumber}</span>
              </div>
              <div className="flex justify-between border-b border-slate-50 pb-2">
                <span className="font-semibold text-slate-400">Status</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                  selectedAsset?.status === 'Assigned' ? 'bg-emerald-50 text-emerald-600' :
                  selectedAsset?.status === 'Available' ? 'bg-blue-50 text-blue-600' :
                  selectedAsset?.status === 'Under Repair' ? 'bg-amber-50 text-amber-600' :
                  'bg-slate-100 text-slate-600'
                }`}>{selectedAsset?.status}</span>
              </div>
              <div className="flex justify-between border-b border-slate-50 pb-2">
                <span className="font-semibold text-slate-400">Assigned To</span>
                <span className="font-bold text-slate-800">
                  {selectedAsset?.assignedTo 
                    ? `${employees.find(e => e.id === selectedAsset.assignedTo)?.name} (${selectedAsset.assignedTo})`
                    : 'None'
                  }
                </span>
              </div>
              <div className="flex justify-between border-b border-slate-50 pb-2">
                <span className="font-semibold text-slate-400">Purchase Date</span>
                <span className="font-bold text-slate-800">{selectedAsset?.purchaseDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-slate-400">Warranty Expiration</span>
                <span className="font-bold text-slate-800 text-red-500">{selectedAsset?.warrantyEndDate}</span>
              </div>
            </div>

            <button 
              onClick={() => setIsViewModalOpen(false)}
              className="mt-8 w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/10 text-xs transition-all"
            >
              Close Details
            </button>
          </div>
        </div>
      )}

      {/* Custom Confirmation Modal for Deletion */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setDeleteConfirmId(null)} />
          <div className="relative bg-white border border-slate-200 w-full max-w-sm rounded-3xl shadow-2xl p-6 z-10 text-center space-y-4 animate-scale-in">
            <div className="p-3 bg-red-50 text-red-600 rounded-full w-fit mx-auto">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-800 text-sm">Delete Asset</h3>
              <p className="text-xs text-slate-500 mt-2">Are you sure you want to delete asset {deleteConfirmId}? This action cannot be undone.</p>
            </div>
            <div className="flex items-center gap-3 pt-2 text-xs">
              <button 
                type="button"
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 py-2 border border-slate-200 rounded-xl hover:bg-slate-50 font-bold text-slate-500 transition-all cursor-pointer"
              >
                Go Back
              </button>
              <button 
                type="button"
                onClick={() => {
                  deleteAsset(deleteConfirmId);
                  showToast(`Successfully deleted asset ${deleteConfirmId}!`);
                  setDeleteConfirmId(null);
                }}
                className="flex-1 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold transition-all shadow-md shadow-red-500/10 cursor-pointer"
              >
                Delete Asset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
