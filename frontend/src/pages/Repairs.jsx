import React, { useState } from 'react';
import { 
  Wrench, 
  Clock, 
  AlertCircle, 
  CheckCircle, 
  XCircle, 
  Plus, 
  Search, 
  Filter, 
  Eye, 
  ChevronLeft, 
  ChevronRight,
  X,
  Send,
  AlertTriangle
} from 'lucide-react';
import { useAssetManager } from '../hooks/useAssetManager';
import MetricCard from '../components/MetricCard';

const Repairs = () => {
  const { 
    repairs, 
    assets, 
    employees, 
    addRepair,
    addRepairUpdate,
    showToast
  } = useAssetManager();

  // Selected Repair request state
  const [selectedRepairId, setSelectedRepairId] = useState(repairs[0]?.id || 'REP00028');
  
  // Search, Pagination, Tab filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('All'); // All | In Progress | Awaiting Parts | Completed | Cancelled
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isCancelConfirmOpen, setIsCancelConfirmOpen] = useState(false);

  // Form states
  const [formAssetId, setFormAssetId] = useState('');
  const [formReporterId, setFormReporterId] = useState('');
  const [formIssue, setFormIssue] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formPriority, setFormPriority] = useState('Medium');
  const [formAssignedTo, setFormAssignedTo] = useState('IT Support Team');
  const [formEstDate, setFormEstDate] = useState('2026-07-13');

  // Add Update Form states
  const [updateStatus, setUpdateStatus] = useState('In Progress');
  const [updateMessage, setUpdateMessage] = useState('');

  // 1. Calculate dynamic statistics
  const totalRepairsCount = repairs.length;
  const inProgressCount = repairs.filter(r => r.status === 'In Progress').length;
  const awaitingCount = repairs.filter(r => r.status === 'Awaiting Parts').length;
  const completedCount = repairs.filter(r => r.status === 'Completed').length;
  const cancelledCount = repairs.filter(r => r.status === 'Cancelled').length;

  // 2. Filter repairs list based on search and tabs
  const filteredRepairs = repairs.filter(rep => {
    const asset = assets.find(a => a.id === rep.assetId);
    const reporter = employees.find(e => e.id === rep.reportedBy);
    const searchString = `${rep.id} ${rep.assetId} ${asset ? asset.brand : ''} ${asset ? asset.model : ''} ${rep.issue} ${reporter ? reporter.name : ''} ${rep.status}`.toLowerCase();
    
    const matchesSearch = searchString.includes(searchTerm.toLowerCase());
    const matchesTab = activeTab === 'All' ? true : rep.status === activeTab;
    
    return matchesSearch && matchesTab;
  });

  const totalPages = Math.ceil(filteredRepairs.length / itemsPerPage);
  const paginatedRepairs = filteredRepairs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // 3. Find selected repair details
  const selectedRepair = repairs.find(r => r.id === selectedRepairId) || repairs[0];
  const selectedAsset = selectedRepair ? assets.find(a => a.id === selectedRepair.assetId) : null;
  const selectedReporter = selectedRepair ? employees.find(e => e.id === selectedRepair.reportedBy) : null;

  // 4. Submit Handlers
  const handleOpenAddModal = () => {
    // Select first asset in under repair list or any asset
    const repairableAssets = assets.filter(a => a.status === 'Available' || a.status === 'Under Repair');
    setFormAssetId(repairableAssets[0]?.id || '');
    setFormReporterId(employees[0]?.id || '');
    setFormIssue('');
    setFormDescription('');
    setFormPriority('Medium');
    setFormAssignedTo('IT Support Team');
    setFormEstDate('2026-07-13');
    setIsAddModalOpen(true);
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!formAssetId) {
      showToast("Please select a device.", "error");
      return;
    }
    addRepair({
      assetId: formAssetId,
      reportedBy: formReporterId,
      issue: formIssue,
      description: formDescription,
      priority: formPriority,
      assignedTo: formAssignedTo,
      estimatedCompletion: formEstDate
    });
    setIsAddModalOpen(false);
    showToast("New repair request created successfully!");
  };

  const handleOpenUpdateModal = () => {
    if (!selectedRepair) return;
    setUpdateStatus(selectedRepair.status);
    setUpdateMessage('');
    setIsUpdateModalOpen(true);
  };

  const handleUpdateSubmit = (e) => {
    e.preventDefault();
    addRepairUpdate(selectedRepair.id, updateStatus, updateMessage);
    setIsUpdateModalOpen(false);
    showToast(`Successfully added status update to ${selectedRepair.id}!`);
  };

  const handleCancelRequest = () => {
    if (!selectedRepair) return;
    setIsCancelConfirmOpen(true);
  };

  const handleConfirmCancel = () => {
    addRepairUpdate(selectedRepair.id, 'Cancelled', 'Repair request cancelled by administrator.');
    showToast(`Cancelled repair request ${selectedRepair.id}`);
    setIsCancelConfirmOpen(false);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Breadcrumbs */}
      <div className="text-xs font-semibold text-slate-400">
        <span className="hover:text-slate-600 cursor-pointer">Dashboard</span>
        <span className="mx-2">&gt;</span>
        <span className="text-slate-600 font-bold">Repairs</span>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
        <MetricCard icon={Wrench} title="Total Repair Requests" value={totalRepairsCount} color="blue" linkTo="/repairs" />
        <MetricCard icon={Clock} title="In Progress" value={inProgressCount} color="green" linkTo="/repairs" />
        <MetricCard icon={AlertCircle} title="Awaiting Parts" value={awaitingCount} color="orange" linkTo="/repairs" />
        <MetricCard icon={CheckCircle} title="Completed" value={completedCount} color="purple" linkTo="/repairs" />
        <MetricCard icon={XCircle} title="Cancelled" value={cancelledCount} color="red" linkTo="/repairs" />
      </div>

      {/* Main Master-Detail panels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Columns (Span 2): Repair Requests list */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h3 className="text-base font-bold text-slate-800">Repair Requests</h3>
            
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-48">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Search className="h-4 w-4" />
                </span>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={e => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                  placeholder="Search repairs..."
                  className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-xs bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                />
              </div>
              <button 
                onClick={handleOpenAddModal}
                className="flex items-center justify-center gap-1.5 py-2 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-all shadow-md shadow-blue-500/10 shrink-0"
              >
                <Plus className="h-4 w-4" />
                <span>New Request</span>
              </button>
            </div>
          </div>

          {/* Filter tabs */}
          <div className="flex gap-4 border-b border-slate-100 text-xs font-semibold overflow-x-auto pb-1">
            {['All', 'In Progress', 'Awaiting Parts', 'Completed', 'Cancelled'].map(tab => (
              <button
                key={tab}
                onClick={() => { setActiveTab(tab); setCurrentPage(1); }}
                className={`pb-2.5 px-1 border-b-2 transition-all shrink-0 ${
                  activeTab === tab ? 'border-blue-600 text-blue-600 font-bold' : 'border-transparent text-slate-400'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Requests Master Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="pb-3 pr-4">Request ID</th>
                  <th className="pb-3 px-4">Asset</th>
                  <th className="pb-3 px-4">Asset Type</th>
                  <th className="pb-3 px-4">Reported By</th>
                  <th className="pb-3 px-4">Issue</th>
                  <th className="pb-3 px-4">Status</th>
                  <th className="pb-3 px-4">Request Date</th>
                  <th className="pb-3 pl-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {paginatedRepairs.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-slate-400">
                      No matching repair requests found.
                    </td>
                  </tr>
                ) : (
                  paginatedRepairs.map((rep) => {
                    const asset = assets.find(a => a.id === rep.assetId);
                    const reporter = employees.find(e => e.id === rep.reportedBy);
                    const isSelected = selectedRepairId === rep.id;

                    return (
                      <tr 
                        key={rep.id} 
                        onClick={() => setSelectedRepairId(rep.id)}
                        className={`cursor-pointer transition-all ${
                          isSelected ? 'bg-blue-50/30' : 'hover:bg-slate-50/50'
                        }`}
                      >
                        <td className="py-3.5 pr-4 font-bold text-blue-600">{rep.id}</td>
                        <td className="py-3.5 px-4 font-semibold text-slate-800">
                          {asset ? (
                            <div className="flex items-center gap-2">
                              <img src={asset.image} className="h-6 w-6 rounded-lg object-cover shrink-0 border" alt="" />
                              <span>{asset.id} &bull; {asset.model}</span>
                            </div>
                          ) : (
                            <span>{rep.assetId}</span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-slate-500">{asset ? asset.type : '-'}</td>
                        <td className="py-3.5 px-4">
                          {reporter ? (
                            <span>{reporter.name} ({reporter.id})</span>
                          ) : (
                            <span className="text-slate-400">-</span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-slate-600 truncate max-w-[120px]">{rep.issue}</td>
                        <td className="py-3.5 px-4">
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase whitespace-nowrap inline-block text-center min-w-[90px] ${
                            rep.status === 'In Progress' ? 'bg-emerald-50 text-emerald-600' :
                            rep.status === 'Awaiting Parts' ? 'bg-amber-50 text-amber-600' :
                            rep.status === 'Completed' ? 'bg-blue-50 text-blue-600' :
                            'bg-slate-100 text-slate-600'
                          }`}>
                            {rep.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-slate-500">{rep.requestDate.split(' ')[0]}</td>
                        <td className="py-3.5 pl-4 text-right">
                          <button 
                            className={`p-1.5 rounded-lg ${isSelected ? 'bg-blue-100 text-blue-700' : 'hover:bg-slate-100 text-blue-600'}`}
                            title="Select"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
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
                Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredRepairs.length)} of {filteredRepairs.length} entries
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

        {/* Right Column: Selected Repair Details pane */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6 self-start">
          {selectedRepair ? (
            <div className="space-y-6">
              {/* Asset header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <img src={selectedAsset?.image} className="h-10 w-10 rounded-xl object-cover border" alt="" />
                  <div>
                    <h4 className="font-extrabold text-slate-800 text-sm leading-tight">{selectedAsset?.brand} {selectedAsset?.model}</h4>
                    <p className="text-[10px] text-slate-400 font-mono mt-0.5">{selectedRepair.assetId}</p>
                  </div>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase ${
                  selectedRepair.status === 'In Progress' ? 'bg-emerald-50 text-emerald-600' :
                  selectedRepair.status === 'Awaiting Parts' ? 'bg-amber-50 text-amber-600' :
                  selectedRepair.status === 'Completed' ? 'bg-blue-50 text-blue-600' :
                  'bg-slate-100 text-slate-600'
                }`}>
                  {selectedRepair.status}
                </span>
              </div>

              {/* Details grid */}
              <div className="text-xs space-y-3.5">
                <div className="flex justify-between">
                  <span className="font-semibold text-slate-400">Request ID</span>
                  <span className="font-bold text-slate-700">{selectedRepair.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-slate-400">Reported By</span>
                  <span className="font-bold text-slate-700">{selectedReporter ? selectedReporter.name : 'Unknown'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-slate-400">Request Date</span>
                  <span className="font-bold text-slate-700 text-slate-500">{selectedRepair.requestDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-slate-400">Issue</span>
                  <span className="font-bold text-slate-700">{selectedRepair.issue}</span>
                </div>
                <div className="flex flex-col space-y-1">
                  <span className="font-semibold text-slate-400">Description</span>
                  <p className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-slate-600 leading-relaxed">
                    {selectedRepair.description}
                  </p>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-slate-400">Priority</span>
                  <span className={`px-2 py-0.5 rounded-md text-[9px] font-extrabold uppercase ${
                    selectedRepair.priority === 'High' ? 'bg-red-50 text-red-600' :
                    selectedRepair.priority === 'Medium' ? 'bg-amber-50 text-amber-600' :
                    'bg-slate-100 text-slate-600'
                  }`}>
                    {selectedRepair.priority}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-slate-400">Assigned To</span>
                  <span className="font-bold text-slate-700">{selectedRepair.assignedTo}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-slate-400">Est. Completion</span>
                  <span className="font-bold text-slate-700">{selectedRepair.estimatedCompletion}</span>
                </div>
              </div>

              {/* Updates timeline */}
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Update History</h4>
                
                <div className="relative border-l border-slate-200 pl-4 space-y-5 ml-1.5 text-xs text-slate-600">
                  {selectedRepair.updates.map((upd, uIdx) => (
                    <div key={uIdx} className="relative">
                      {/* Timeline node */}
                      <span className="absolute -left-[21px] top-0.5 h-3.5 w-3.5 bg-blue-600 border-2 border-white rounded-full flex items-center justify-center shadow-sm" />
                      <p className="text-[10px] font-bold text-slate-400">{upd.date}</p>
                      <p className="mt-0.5 font-semibold text-slate-700">{upd.message}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              {selectedRepair.status !== 'Completed' && selectedRepair.status !== 'Cancelled' && (
                <div className="flex gap-3 pt-4 border-t border-slate-100">
                  <button 
                    onClick={handleCancelRequest}
                    className="flex-1 py-2.5 px-4 rounded-xl border border-red-200 hover:bg-red-500/5 text-red-500 font-bold text-xs transition-all"
                  >
                    Cancel Request
                  </button>
                  <button 
                    onClick={handleOpenUpdateModal}
                    className="flex-1 py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-lg shadow-blue-500/10 transition-all flex items-center justify-center gap-1"
                  >
                    <Send className="h-3 w-3" />
                    <span>Add Update</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <p className="text-xs text-slate-400 text-center py-12">
              Select a repair request to view logs.
            </p>
          )}
        </div>
      </div>

      {/* CRUD: New Repair Request Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsAddModalOpen(false)} />
          <div className="relative bg-white border border-slate-200 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden p-6 z-10">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
              <h3 className="font-bold text-slate-800">New Repair Request</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="p-1 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Select Asset *</label>
                  <select 
                    value={formAssetId} 
                    onChange={e => setFormAssetId(e.target.value)}
                    className="w-full p-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                  >
                    {assets.map(a => (
                      <option key={a.id} value={a.id}>{a.id} - {a.brand} {a.model} ({a.status})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Reported By *</label>
                  <select 
                    value={formReporterId} 
                    onChange={e => setFormReporterId(e.target.value)}
                    className="w-full p-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                  >
                    {employees.map(emp => (
                      <option key={emp.id} value={emp.id}>{emp.name} ({emp.id})</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-500">Issue Title *</label>
                <input 
                  type="text" 
                  required 
                  value={formIssue} 
                  onChange={e => setFormIssue(e.target.value)}
                  placeholder="e.g. Screen flickering or RAM failure"
                  className="w-full p-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-500">Detailed Description *</label>
                <textarea 
                  rows={2}
                  required 
                  value={formDescription} 
                  onChange={e => setFormDescription(e.target.value)}
                  placeholder="Describe the failure symptoms..."
                  className="w-full p-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500/20 focus:outline-none resize-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Priority</label>
                  <select 
                    value={formPriority} 
                    onChange={e => setFormPriority(e.target.value)}
                    className="w-full p-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Assigned Support</label>
                  <select 
                    value={formAssignedTo} 
                    onChange={e => setFormAssignedTo(e.target.value)}
                    className="w-full p-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                  >
                    <option value="IT Support Team">IT Support Team</option>
                    <option value="Hardware Support Team">Hardware Support Team</option>
                    <option value="External Vendor">External Vendor</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Estimated Date</label>
                  <input 
                    type="date"
                    value={formEstDate}
                    onChange={e => setFormEstDate(e.target.value)}
                    className="w-full p-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex gap-3 justify-end pt-4 border-t border-slate-100">
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-4 py-2 text-xs font-semibold text-slate-500 hover:bg-slate-50 rounded-xl border border-slate-200">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md shadow-blue-500/10">
                  Create Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Dialog: Add Update / Progress logs */}
      {isUpdateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsUpdateModalOpen(false)} />
          <div className="relative bg-white border border-slate-200 w-full max-w-md rounded-3xl shadow-2xl overflow-hidden p-6 z-10">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
              <h3 className="font-bold text-slate-800">Add Repair Update</h3>
              <button onClick={() => setIsUpdateModalOpen(false)} className="p-1 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleUpdateSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-500">Update Status</label>
                <select
                  value={updateStatus}
                  onChange={e => setUpdateStatus(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                >
                  <option value="In Progress">In Progress</option>
                  <option value="Awaiting Parts">Awaiting Parts</option>
                  <option value="Completed">Completed (Marks Asset Available)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-500">Progress Details / Notes *</label>
                <textarea
                  rows={3}
                  required
                  value={updateMessage}
                  onChange={e => setUpdateMessage(e.target.value)}
                  placeholder="Describe update details (e.g. replaced battery contacts, scroll wheel parts ordered)..."
                  className="w-full p-2.5 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500/20 focus:outline-none resize-none"
                />
              </div>

              <div className="flex gap-3 justify-end pt-4 border-t border-slate-100">
                <button type="button" onClick={() => setIsUpdateModalOpen(false)} className="px-4 py-2 text-xs font-semibold text-slate-500 hover:bg-slate-50 rounded-xl border border-slate-200">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md shadow-blue-500/10">
                  Submit Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Repairs;
