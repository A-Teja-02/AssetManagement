import React, { useState, useRef, useEffect } from 'react';
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
  ChevronDown,
  Check,
  Download,
  FileSpreadsheet,
  X,
  TrendingUp
} from 'lucide-react';
import { useAssetManager } from '../hooks/useAssetManager';
import MetricCard from '../components/MetricCard';
import Avatar from '../components/Avatar';
import ExcelImportModal from '../components/ExcelImportModal';
import AssetIconBadge from '../components/AssetIcon';
import AdminPasswordModal from '../components/AdminPasswordModal';

const Assets = () => {
  const { 
    assets, 
    employees, 
    categories,
    addAsset, 
    updateAsset, 
    deleteAsset,
    showToast
  } = useAssetManager();

  const [passAuthModal, setPassAuthModal] = useState({ isOpen: false, title: '', actionLabel: '', onSuccess: null });

  // Search & Filtering states
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [scopeFilter, setScopeFilter] = useState('All');
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [showScopeGlass, setShowScopeGlass] = useState(false);
  const scopeRef = useRef(null);

  // Outside click for scope glass pill dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (scopeRef.current && !scopeRef.current.contains(e.target)) {
        setShowScopeGlass(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Multi-select state
  const [selectedIds, setSelectedIds] = useState([]);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [isBulkDeleteOpen, setIsBulkDeleteOpen] = useState(false);

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const categoryTypes = categories && categories.length > 0
    ? categories
    : [
        { name: 'Laptop', group: 'IT' },
        { name: 'Monitor', group: 'IT' },
        { name: 'Mouse', group: 'IT' },
        { name: 'Keyboard', group: 'IT' },
        { name: 'Headphones', group: 'IT' },
        { name: 'Printer', group: 'IT' },
        { name: 'Chairs', group: 'Non-IT' },
        { name: 'Tables', group: 'Non-IT' },
        { name: 'Whiteboards', group: 'Non-IT' },
        { name: 'Storage Cabinets', group: 'Non-IT' }
      ];

  const itCategoryList = categoryTypes.filter(c => (c.group || 'IT') === 'IT');
  const nonItCategoryList = categoryTypes.filter(c => c.group === 'Non-IT');
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

  // Filters setup (No Desktop)
  const assetTypes = ['All', ...new Set(assets.map(a => a.type))].filter(t => t !== 'Desktop');

  const getAssetScope = (asset) => {
    const matchedCat = (categories || []).find(c => c.name.toLowerCase().trim() === asset.type.toLowerCase().trim());
    if (matchedCat && matchedCat.scope) return matchedCat.scope;
    const employeeCategories = ['laptop', 'mouse', 'keyboard', 'headphones', 'mobile', 'headset'];
    return employeeCategories.some(k => asset.type.toLowerCase().includes(k)) ? 'Employee' : 'Organization';
  };

  // Filter assets list
  const filteredAssets = assets.filter(asset => {
    if (asset.type === 'Desktop') return false; // Desktop removed completely
    const owner = employees.find(e => e.id === asset.assignedTo);
    const searchString = `${asset.id} ${asset.type} ${asset.brand} ${asset.model} ${asset.serialNumber} ${asset.status} ${owner ? owner.name : ''}`.toLowerCase();
    
    const matchesSearch = searchString.includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'All' ? true : asset.type === typeFilter;
    const matchesScope = scopeFilter === 'All' 
      ? true 
      : scopeFilter === 'Assigned' 
        ? asset.status === 'Assigned' 
        : asset.status !== 'Assigned';
    
    return matchesSearch && matchesType && matchesScope;
  });

  // Multi-select helpers
  const isAllSelected = filteredAssets.length > 0 && filteredAssets.every(a => selectedIds.includes(a.id));
  
  const handleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredAssets.map(a => a.id));
    }
  };

  const handleToggleSelect = (id, e) => {
    e.stopPropagation();
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleBulkDelete = () => {
    selectedIds.forEach(id => deleteAsset(id));
    showToast(`Successfully deleted ${selectedIds.length} assets!`);
    setSelectedIds([]);
    setIsBulkDeleteOpen(false);
  };

  // Excel Bulk Import Handler
  const handleImportAssets = (rawRows) => {
    let successCount = 0;
    const failedRows = [];

    rawRows.forEach((row, idx) => {
      const type = row.Type || row.type || row['Asset Type'] || 'Laptop';
      const brand = row.Brand || row.brand || 'Generic';
      const model = row.Model || row.model || 'Standard';
      const serialNumber = row.SerialNumber || row.serialNumber || row['Serial Number'] || row.Serial || '';
      const status = row.Status || row.status || 'Available';

      if (type === 'Desktop') return; // Skip desktops

      if (!serialNumber) {
        failedRows.push({ row: idx + 2, reason: `Missing Serial Number for item "${brand} ${model}"` });
        return;
      }

      const exists = assets.some(a => a.serialNumber.toLowerCase() === String(serialNumber).toLowerCase());
      if (exists) {
        failedRows.push({ row: idx + 2, reason: `Duplicate serial number "${serialNumber}" already exists.` });
        return;
      }

      addAsset({
        type: type,
        brand: brand,
        model: model,
        serialNumber: String(serialNumber),
        status: status,
        assignedTo: null,
        purchaseDate: new Date().toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' }),
        warrantyEndDate: new Date(new Date().setFullYear(new Date().getFullYear() + 3)).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })
      });
      successCount++;
    });

    if (successCount > 0) {
      showToast(`Successfully imported ${successCount} assets from Excel!`);
    }

    return {
      totalRows: rawRows.length,
      successCount,
      failedRows
    };
  };

  // CSV Exporter
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
    showToast('Asset added successfully');
  };

  const handleOpenEditModal = (asset, e) => {
    if (e) e.stopPropagation();
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
    showToast('Asset updated successfully');
  };

  const handleOpenViewModal = (asset) => {
    setSelectedAsset(asset);
    setIsViewModalOpen(true);
  };

  const handleDelete = () => {
    if (!deleteConfirmId) return;
    const targetAssetId = deleteConfirmId;
    setDeleteConfirmId(null);

    setPassAuthModal({
      isOpen: true,
      title: "Confirm Delete Asset",
      actionLabel: `Delete Asset (${targetAssetId})`,
      onSuccess: () => {
        deleteAsset(targetAssetId);
        showToast('Asset deleted successfully');
        setPassAuthModal({ isOpen: false, title: '', actionLabel: '', onSuccess: null });
      }
    });
  };

  return (
    <div className="space-y-6 animate-fade-in text-[11px]">
      {/* Breadcrumbs */}
      <div className="flex items-center justify-between">
        <div className="text-[11px] font-semibold text-slate-400">
          <span className="hover:text-slate-600 cursor-pointer">Dashboard</span>
          <span className="mx-2">&gt;</span>
          <span className="text-slate-600 font-bold">Assets Management</span>
        </div>
      </div>

      {/* 5 Compact Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <MetricCard icon={Laptop} title="Total Assets" value={totalCount} color="blue" linkTo="/assets" />
        <MetricCard icon={CheckCircle} title="Assigned Assets" value={assignedCount} color="green" linkTo="/assets" />
        <MetricCard icon={TrendingUp} title="Available Assets" value={availableCount} color="orange" linkTo="/assets" />
        <MetricCard icon={Wrench} title="Under Repair" value={repairCount} color="red" linkTo="/repairs" />
        <MetricCard icon={Trash2} title="Disposed Assets" value={disposedCount} color="purple" linkTo="/assets" />
      </div>

      {/* Assets inventory panel */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
        {/* Controls Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-3">
            <h3 className="text-sm font-bold text-slate-800">
              {scopeFilter === 'Assigned' ? 'Assigned Assets' : scopeFilter === 'Not Assigned' ? 'Not Assigned Assets' : 'All Assets Inventory'}
            </h3>
            <span className="text-[10px] font-extrabold bg-blue-50 text-blue-700 px-2.5 py-0.5 rounded-full border border-blue-100 whitespace-nowrap shrink-0 inline-flex items-center">
              {filteredAssets.length} Total
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
            {/* Search */}
            <div className="relative flex-1 sm:w-56 min-w-[140px]">
              <span className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-slate-400">
                <Search className="h-3.5 w-3.5" />
              </span>
              <input
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Search assets..."
                className="w-full pl-8 pr-3 py-1.5 border border-slate-200 rounded-xl text-xs bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
              />
            </div>
            
            {/* Type filter */}
            <select
              value={typeFilter}
              onChange={e => setTypeFilter(e.target.value)}
              className="px-2.5 py-1.5 border border-slate-200 rounded-xl text-xs bg-slate-50 text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-semibold cursor-pointer"
            >
              {assetTypes.map(t => (
                <option key={t} value={t}>{t === 'All' ? 'All Types' : t}</option>
              ))}
            </select>

            {/* Apple Liquid Glass Scope Selector */}
            <div className="relative" ref={scopeRef}>
              <button
                type="button"
                onClick={() => setShowScopeGlass(prev => !prev)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/80 backdrop-blur-md border border-slate-200/90 shadow-xs hover:bg-white text-slate-700 font-bold text-xs transition-all cursor-pointer hover:shadow-sm"
              >
                <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Scope:</span>
                <span>{scopeFilter === 'All' ? 'All' : scopeFilter === 'Assigned' ? 'Assigned' : 'Not Assigned'}</span>
                <ChevronDown className={`h-3.5 w-3.5 text-slate-400 transition-transform ${showScopeGlass ? 'rotate-180' : ''}`} />
              </button>

              {showScopeGlass && (
                <div className="absolute right-0 mt-2 w-48 bg-white/90 backdrop-blur-xl border border-slate-200/80 rounded-2xl shadow-xl shadow-slate-900/10 p-1.5 z-40 space-y-1 animate-scale-in">
                  {[
                    { label: 'All Scopes', value: 'All', desc: 'Show all assets' },
                    { label: 'Assigned', value: 'Assigned', desc: 'Only assigned assets' },
                    { label: 'Not Assigned', value: 'Not Assigned', desc: 'Available & unassigned assets' }
                  ].map(item => (
                    <button
                      key={item.value}
                      type="button"
                      onClick={() => { setScopeFilter(item.value); setShowScopeGlass(false); }}
                      className={`w-full text-left p-2 rounded-xl transition-all flex items-center justify-between text-xs cursor-pointer ${
                        scopeFilter === item.value 
                          ? 'bg-blue-600 text-white font-bold shadow-xs' 
                          : 'hover:bg-slate-100/80 text-slate-700 font-semibold'
                      }`}
                    >
                      <div>
                        <p className="leading-tight">{item.label}</p>
                        <p className={`text-[9px] ${scopeFilter === item.value ? 'text-blue-100' : 'text-slate-400'}`}>{item.desc}</p>
                      </div>
                      {scopeFilter === item.value && <Check className="h-3.5 w-3.5 shrink-0" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Import Excel Trigger */}
            <div className="relative group">
              <button 
                type="button"
                onClick={() => setIsImportModalOpen(true)}
                className="h-8 w-8 rounded-full border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 flex items-center justify-center transition-all cursor-pointer shadow-xs shrink-0"
              >
                <FileSpreadsheet className="h-4 w-4 text-emerald-600" />
              </button>
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-0.5 bg-slate-800 text-white text-[10px] rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap font-bold z-30 shadow-md">
                Import Assets
              </div>
            </div>

            {/* Export Trigger */}
            <div className="relative group">
              <button 
                type="button"
                onClick={handleExport}
                className="h-8 w-8 rounded-full border border-slate-200 hover:bg-slate-50 text-slate-600 flex items-center justify-center transition-all cursor-pointer shadow-xs shrink-0"
              >
                <Download className="h-4 w-4" />
              </button>
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-0.5 bg-slate-800 text-white text-[10px] rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap font-bold z-30 shadow-md">
                Export Assets
              </div>
            </div>

            {/* Add Asset Trigger (Circular + Button) */}
            <div className="relative group">
              <button 
                type="button"
                onClick={handleOpenAddModal}
                className="h-8 w-8 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center shadow-md shadow-blue-500/20 hover:scale-105 active:scale-95 transition-all cursor-pointer shrink-0"
              >
                <Plus className="h-4 w-4" />
              </button>
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-0.5 bg-slate-800 text-white text-[10px] rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap font-bold z-30 shadow-md">
                Add Asset
              </div>
            </div>
          </div>
        </div>

        {/* Bulk Actions Bar (Appears when items selected) */}
        {selectedIds.length > 0 && (
          <div className="p-3 bg-red-50/80 border border-red-200 rounded-xl flex items-center justify-between animate-fade-in">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
              <span className="font-bold text-red-800 text-xs">{selectedIds.length} asset(s) selected</span>
            </div>
            <button
              type="button"
              onClick={() => setIsBulkDeleteOpen(true)}
              className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-lg shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>Delete Selected ({selectedIds.length})</span>
            </button>
          </div>
        )}

        {/* Endless 60vh Scrollable Inventory Table Container with Fixed Sticky Header */}
        <div className="max-h-[60vh] overflow-y-auto rounded-xl border border-slate-200/80 shadow-xs relative">
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 bg-slate-50 z-20 shadow-xs border-b border-slate-200 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
              <tr>
                <th className="py-2.5 px-3">Asset ID</th>
                <th className="py-2.5 px-3">Asset Type / Model</th>
                <th className="py-2.5 px-3">Serial Number / Barcode</th>
                
                {/* Conditional Columns based on View */}
                {scopeFilter === 'Assigned' ? (
                  <>
                    <th className="py-2.5 px-3">Assigned To</th>
                    <th className="py-2.5 px-3">Assigned Date</th>
                  </>
                ) : scopeFilter === 'Not Assigned' ? (
                  <>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3">Purchase Date</th>
                  </>
                ) : (
                  <>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3">Assigned To</th>
                  </>
                )}
                <th className="py-2.5 px-3 text-right pr-4">Quick Actions</th>
                {/* Select All Checkbox */}
                <th className="py-2.5 px-3 w-10 text-center">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={handleSelectAll}
                    className="rounded text-blue-600 border-slate-300 focus:ring-blue-500 cursor-pointer"
                  />
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700 bg-white">
              {filteredAssets.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400 font-semibold">
                    No matching assets found.
                  </td>
                </tr>
              ) : (
                filteredAssets.map((asset) => {
                  const owner = employees.find(e => e.id === asset.assignedTo);
                  const isSelected = selectedIds.includes(asset.id);

                  return (
                    <tr 
                      key={asset.id} 
                      onClick={() => handleOpenViewModal(asset)}
                      className={`group hover:bg-slate-50/80 transition-all font-medium cursor-pointer ${
                        isSelected ? 'bg-blue-50/30' : ''
                      }`}
                    >
                      {/* Asset ID */}
                      <td className="py-2.5 px-3 font-extrabold text-blue-600">
                        <div className="flex items-center gap-2">
                          <AssetIconBadge type={asset.type} className="h-6 w-6 rounded-md" iconSize="h-3.5 w-3.5" />
                          <span>{asset.id}</span>
                        </div>
                      </td>

                      {/* Asset Type / Model */}
                      <td className="py-2.5 px-3 font-bold text-slate-800">
                        <div>
                          <p className="text-xs font-bold text-slate-800">{asset.brand} {asset.model}</p>
                          <p className="text-[10px] text-slate-400 font-medium">{asset.type}</p>
                        </div>
                      </td>

                      {/* Serial Number */}
                      <td className="py-2.5 px-3 font-mono text-slate-600 text-[11px]">{asset.serialNumber}</td>

                      {/* View Specific Columns */}
                      {scopeFilter === 'Assigned' ? (
                        <>
                          <td className="py-2.5 px-3">
                            {owner ? (
                              <div className="flex items-center gap-1.5">
                                <Avatar name={owner.name} className="h-5 w-5 rounded-full" textSize="text-[7px]" />
                                <span className="font-semibold text-slate-700 truncate">{owner.name}</span>
                              </div>
                            ) : (
                              <span className="text-slate-400">-</span>
                            )}
                          </td>
                          <td className="py-2.5 px-3 text-slate-500 text-[10px] font-semibold">{asset.purchaseDate || '10 May 2024'}</td>
                        </>
                      ) : scopeFilter === 'Not Assigned' ? (
                        <>
                          <td className="py-2.5 px-3">
                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold whitespace-nowrap inline-block text-center ${
                              asset.status === 'Available' ? 'bg-blue-50 text-blue-600 border border-blue-100' :
                              asset.status === 'Under Repair' ? 'bg-amber-50 text-amber-600 border border-amber-100' :
                              'bg-slate-100 text-slate-600'
                            }`}>
                              {asset.status}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-slate-500 text-[10px]">{asset.purchaseDate}</td>
                        </>
                      ) : (
                        <>
                          <td className="py-2.5 px-3">
                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold whitespace-nowrap inline-block text-center ${
                              asset.status === 'Assigned' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                              asset.status === 'Available' ? 'bg-blue-50 text-blue-600 border border-blue-100' :
                              asset.status === 'Under Repair' ? 'bg-amber-50 text-amber-600 border border-amber-100' :
                              'bg-slate-100 text-slate-600'
                            }`}>
                              {asset.status}
                            </span>
                          </td>
                          <td className="py-2.5 px-3">
                            {owner ? (
                              <div className="flex items-center gap-1.5">
                                <Avatar name={owner.name} className="h-5 w-5 rounded-full" textSize="text-[7px]" />
                                <span className="font-semibold text-slate-700 truncate">{owner.name}</span>
                              </div>
                            ) : (
                              <span className="text-slate-400">-</span>
                            )}
                          </td>
                        </>
                      )}

                      {/* Hover Actions (No heavy actions column) */}
                      <td className="py-2.5 px-3 text-right pr-4" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                          <button
                            type="button"
                            onClick={() => handleOpenViewModal(asset)}
                            className="p-1 hover:bg-blue-50 rounded-lg text-blue-600 transition-colors"
                            title="View Asset Details"
                          >
                            <Eye className="h-3.5 w-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={(e) => handleOpenEditModal(asset, e)}
                            className="p-1 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors"
                            title="Edit Asset"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); setDeleteConfirmId(asset.id); }}
                            className="p-1 hover:bg-red-50 rounded-lg text-red-500 transition-colors"
                            title="Delete Asset"
                          >
                            <Trash className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>

                      {/* Checkbox */}
                      <td className="py-2.5 px-3 text-center" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={(e) => handleToggleSelect(asset.id, e)}
                          className="rounded text-blue-600 border-slate-300 focus:ring-blue-500 cursor-pointer"
                        />
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
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
                    <optgroup label="IT Assets">
                      {itCategoryList.map(cat => (
                        <option key={cat.id || cat.name} value={cat.name}>{cat.name}</option>
                      ))}
                    </optgroup>
                    {nonItCategoryList.length > 0 && (
                      <optgroup label="Non-IT Assets">
                        {nonItCategoryList.map(cat => (
                          <option key={cat.id || cat.name} value={cat.name}>{cat.name}</option>
                        ))}
                      </optgroup>
                    )}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Brand *</label>
                  <select 
                    value={formBrand} 
                    onChange={e => setFormBrand(e.target.value)}
                    className="w-full p-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                  >
                    {["Dell", "Logitech", "HP", "Apple", "Samsung", "Lenovo", "Sony", "Epson", "Herman Miller", "Steelcase", "Ikea", "Godrej", "Featherlite", "Generic"].map(b => (
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
                    <optgroup label="IT Assets">
                      {itCategoryList.map(cat => (
                        <option key={cat.id || cat.name} value={cat.name}>{cat.name}</option>
                      ))}
                    </optgroup>
                    {nonItCategoryList.length > 0 && (
                      <optgroup label="Non-IT Assets">
                        {nonItCategoryList.map(cat => (
                          <option key={cat.id || cat.name} value={cat.name}>{cat.name}</option>
                        ))}
                      </optgroup>
                    )}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Brand *</label>
                  <select 
                    value={formBrand} 
                    onChange={e => setFormBrand(e.target.value)}
                    className="w-full p-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                  >
                    {["Dell", "Logitech", "HP", "Apple", "Samsung", "Lenovo", "Sony", "Epson", "Herman Miller", "Steelcase", "Ikea", "Godrej", "Featherlite", "Generic"].map(b => (
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
            <AssetIconBadge type={selectedAsset?.type} className="h-24 w-24 rounded-3xl mt-4" iconSize="h-12 w-12" />
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
                onClick={handleDelete}
                className="flex-1 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold transition-all shadow-md shadow-red-500/10 cursor-pointer"
              >
                Delete Asset
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Delete Confirmation Modal */}
      {isBulkDeleteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsBulkDeleteOpen(false)} />
          <div className="relative bg-white border border-slate-200 w-full max-w-sm rounded-3xl shadow-2xl p-6 z-10 text-center space-y-4 animate-scale-in">
            <div className="p-3 bg-red-50 text-red-600 rounded-full w-fit mx-auto">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-800 text-sm">Bulk Delete Assets</h3>
              <p className="text-xs text-slate-500 mt-2">Are you sure you want to delete <strong>{selectedIds.length}</strong> selected assets? This action cannot be undone.</p>
            </div>
            <div className="flex items-center gap-3 pt-2 text-xs">
              <button 
                type="button"
                onClick={() => setIsBulkDeleteOpen(false)}
                className="flex-1 py-2 border border-slate-200 rounded-xl hover:bg-slate-50 font-bold text-slate-500 transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button 
                type="button"
                onClick={handleBulkDelete}
                className="flex-1 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold transition-all shadow-md shadow-red-500/10 cursor-pointer"
              >
                Confirm Delete ({selectedIds.length})
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Excel Import Modal */}
      <ExcelImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        title="Import Assets from Excel"
        onImportData={handleImportAssets}
        sampleColumns={["Type", "Brand", "Model", "SerialNumber", "Status", "Scope"]}
        sampleData={[
          { Type: "Laptop", Brand: "Dell", Model: "Latitude 5440", SerialNumber: "QITS-SN-9901", Status: "Available", Scope: "Employee" },
          { Type: "Monitor", Brand: "LG", Model: "27 Inch 4K", SerialNumber: "QITS-SN-8802", Status: "Available", Scope: "Organization" },
          { Type: "Mouse", Brand: "Logitech", Model: "MX Master 3S", SerialNumber: "QITS-SN-7703", Status: "Available", Scope: "Employee" }
        ]}
        templateFileName="Assets_Import_Template.xlsx"
      />

      {/* Admin Security Password Verification Modal */}
      <AdminPasswordModal
        isOpen={passAuthModal.isOpen}
        title={passAuthModal.title}
        actionLabel={passAuthModal.actionLabel}
        onClose={() => setPassAuthModal({ isOpen: false, title: '', actionLabel: '', onSuccess: null })}
        onSuccess={passAuthModal.onSuccess || (() => {})}
      />
    </div>
  );
};

export default Assets;
