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
  Download,
  X,
  TrendingUp
} from 'lucide-react';
import { useAssetManager } from '../hooks/useAssetManager';
import MetricCard from '../components/MetricCard';

const Assets = () => {
  const { 
    assets, 
    employees, 
    addAsset, 
    updateAsset, 
    deleteAsset 
  } = useAssetManager();

  // Search, Pagination, Filtering states
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

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

  // Statistics calculation
  const totalCount = assets.length;
  const assignedCount = assets.filter(a => a.status === 'Assigned').length;
  const availableCount = assets.filter(a => a.status === 'Available').length;
  const repairCount = assets.filter(a => a.status === 'Under Repair').length;
  const disposedCount = assets.filter(a => a.status === 'Disposed').length;

  // Filters setup
  const assetTypes = ['All', ...new Set(assets.map(a => a.type))];
  const assetStatuses = ['All', 'Assigned', 'Available', 'Under Repair', 'Disposed'];

  // Filter assets list
  const filteredAssets = assets.filter(asset => {
    const owner = employees.find(e => e.id === asset.assignedTo);
    const searchString = `${asset.id} ${asset.type} ${asset.brand} ${asset.model} ${asset.serialNumber} ${asset.status} ${owner ? owner.name : ''}`.toLowerCase();
    
    const matchesSearch = searchString.includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'All' ? true : asset.type === typeFilter;
    const matchesStatus = statusFilter === 'All' ? true : asset.status === statusFilter;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const totalPages = Math.ceil(filteredAssets.length / itemsPerPage);
  const paginatedAssets = filteredAssets.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // CSV Exporter Simulation
  const handleExport = () => {
    const headers = "Asset ID,Asset Type,Brand,Model,Serial Number,Status,Assigned To,Purchase Date,Warranty End Date\n";
    const rows = filteredAssets.map(a => {
      const owner = employees.find(e => e.id === a.assignedTo);
      return `"${a.id}","${a.type}","${a.brand}","${a.model}","${a.serialNumber}","${a.status}","${owner ? owner.name : '-'}","${a.purchaseDate}","${a.warrantyEndDate}"`;
    }).join("\n");
    
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `IT_Assets_Export_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Form submit handlers
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
      {/* Breadcrumbs */}
      <div className="flex items-center justify-between">
        <div className="text-xs font-semibold text-slate-400">
          <span className="hover:text-slate-600 cursor-pointer">Dashboard</span>
          <span className="mx-2">&gt;</span>
          <span className="text-slate-600 font-bold">Assets</span>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <MetricCard icon={Laptop} title="Total Assets" value={totalCount} color="blue" linkTo="/assets" />
        <MetricCard icon={CheckCircle} title="Assigned Assets" value={assignedCount} color="green" linkTo="/assets" />
        <MetricCard icon={TrendingUp} title="Available Assets" value={availableCount} color="orange" linkTo="/assets" />
        <MetricCard icon={Wrench} title="Under Repair" value={repairCount} color="red" linkTo="/repairs" />
        <MetricCard icon={Trash2} title="Disposed Assets" value={disposedCount} color="purple" linkTo="/assets" />
      </div>

      {/* Assets inventory panel */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h3 className="text-base font-bold text-slate-800">Assets List</h3>
          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            {/* Search */}
            <div className="relative flex-1 sm:w-64 min-w-[150px]">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Search className="h-4 w-4" />
              </span>
              <input
                type="text"
                value={searchTerm}
                onChange={e => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                placeholder="Search assets..."
                className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-xs bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
              />
            </div>
            
            {/* Type filter */}
            <select
              value={typeFilter}
              onChange={e => { setTypeFilter(e.target.value); setCurrentPage(1); }}
              className="px-3 py-2 border border-slate-200 rounded-xl text-xs bg-slate-50 text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-semibold"
            >
              {assetTypes.map(t => (
                <option key={t} value={t}>{t === 'All' ? 'All Types' : t}</option>
              ))}
            </select>

            {/* Status filter */}
            <select
              value={statusFilter}
              onChange={e => { setStatusFilter(e.target.value); setCurrentPage(1); }}
              className="px-3 py-2 border border-slate-200 rounded-xl text-xs bg-slate-50 text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-semibold"
            >
              {assetStatuses.map(s => (
                <option key={s} value={s}>{s === 'All' ? 'All Status' : s}</option>
              ))}
            </select>

            {/* Export Trigger */}
            <button 
              onClick={handleExport}
              className="flex items-center justify-center gap-1.5 py-2 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 font-semibold text-xs transition-all shrink-0"
            >
              <Download className="h-4 w-4" />
              <span>Export</span>
            </button>

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

        {/* Inventory Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="pb-3 pr-4">Asset ID</th>
                <th className="pb-3 px-4">Asset Type</th>
                <th className="pb-3 px-4">Brand</th>
                <th className="pb-3 px-4">Model</th>
                <th className="pb-3 px-4">Serial Number / Barcode</th>
                <th className="pb-3 px-4">Status</th>
                <th className="pb-3 px-4">Assigned To</th>
                <th className="pb-3 px-4">Purchase Date</th>
                <th className="pb-3 px-4">Warranty End Date</th>
                <th className="pb-3 pl-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
              {paginatedAssets.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-8 text-center text-slate-400">
                    No matching assets found.
                  </td>
                </tr>
              ) : (
                paginatedAssets.map((asset) => {
                  const owner = employees.find(e => e.id === asset.assignedTo);
                  return (
                    <tr key={asset.id} className="hover:bg-slate-50/50 transition-all">
                      <td className="py-4 pr-4 font-bold text-blue-600 cursor-pointer" onClick={() => handleOpenViewModal(asset)}>
                        <div className="flex items-center gap-3">
                          <img src={asset.image} className="h-8 w-8 rounded-lg object-cover shrink-0 border" alt="" />
                          <span>{asset.id}</span>
                        </div>
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
                            <img src={owner.avatar} className="h-5 w-5 rounded-full object-cover shrink-0" alt="" />
                            <span className="font-semibold text-slate-700">{owner.name} ({owner.id})</span>
                          </div>
                        ) : (
                          <span className="text-slate-400">-</span>
                        )}
                      </td>
                      <td className="py-4 px-4 text-slate-500">{asset.purchaseDate}</td>
                      <td className="py-4 px-4 text-slate-500 font-medium">{asset.warrantyEndDate}</td>
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
                            onClick={() => {
                              if (confirm(`Delete asset ${asset.id}?`)) {
                                deleteAsset(asset.id);
                              }
                            }}
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
    </div>
  );
};

export default Assets;
