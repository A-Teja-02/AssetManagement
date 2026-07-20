import React, { useState } from 'react';
import { 
  Search, 
  RotateCcw, 
  CheckCircle, 
  AlertCircle, 
  ChevronRight,
  Eye,
  Download,
  Info,
  X
} from 'lucide-react';
import { useAssetManager } from '../hooks/useAssetManager';
import Avatar from '../components/Avatar';

const ReturnAsset = () => {
  const { 
    employees, 
    assets, 
    returnAssets, 
    activity 
  } = useAssetManager();

  // Selected Employee & Assets states
  const [selectedEmpId, setSelectedEmpId] = useState(employees[0]?.id || '');
  const [selectedAssetIds, setSelectedAssetIds] = useState([]);
  
  // Form details states
  const [returnDate, setReturnDate] = useState('2026-07-10');
  const [returnedBy, setReturnedBy] = useState('Rakesh Reddy (Admin)');
  const [reason, setReason] = useState('Employee Resignation');
  const [condition, setCondition] = useState('Good');
  const [remarks, setRemarks] = useState('');

  // Confirmation Modal state
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  // 1. Get employee details
  const currentEmp = employees.find(e => e.id === selectedEmpId);

  // 2. Find assets currently assigned to this employee
  const assignedAssets = assets.filter(asset => asset.assignedTo === selectedEmpId);

  // 3. Toggle assets checked for return
  const handleToggleAsset = (id) => {
    setSelectedAssetIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  // 4. Wizard actions
  const handleNextStep = (e) => {
    e.preventDefault();
    if (!selectedEmpId) {
      showToast("Please select an employee.", "error");
      return;
    }
    if (selectedAssetIds.length === 0) {
      showToast("Please select at least one assigned asset to return.", "error");
      return;
    }
    setIsConfirmOpen(true);
  };

  const handleConfirmSubmit = () => {
    returnAssets(selectedEmpId, selectedAssetIds, returnDate, condition, remarks);
    
    setIsConfirmOpen(false);
    showToast(`Successfully processed return of ${selectedAssetIds.length} assets from ${currentEmp.name}!`);
    setSelectedAssetIds([]);
    setRemarks('');
  };

  // Filter recent return log activities
  const returnLogs = activity.filter(act => act.activity === "Return Asset");

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Breadcrumbs */}
      <div className="text-xs font-semibold text-slate-400">
        <span className="hover:text-slate-600 cursor-pointer">Dashboard</span>
        <span className="mx-2">&gt;</span>
        <span className="text-slate-600 font-bold">Return Assets</span>
      </div>

      {/* Progress tracker wizard header */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 max-w-4xl mx-auto text-xs font-bold text-slate-400">
          <div className="flex items-center gap-2 text-blue-600">
            <span className="h-6 w-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px]">1</span>
            <span>Select Employee</span>
          </div>
          <div className="h-0.5 bg-slate-100 flex-1 hidden sm:block mx-4" />
          <div className="flex items-center gap-2">
            <span className="h-6 w-6 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center text-[10px]">2</span>
            <span>Select Assets</span>
          </div>
          <div className="h-0.5 bg-slate-100 flex-1 hidden sm:block mx-4" />
          <div className="flex items-center gap-2">
            <span className="h-6 w-6 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center text-[10px]">3</span>
            <span>Return Details</span>
          </div>
          <div className="h-0.5 bg-slate-100 flex-1 hidden sm:block mx-4" />
          <div className="flex items-center gap-2">
            <span className="h-6 w-6 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center text-[10px]">4</span>
            <span>Review & Confirm</span>
          </div>
        </div>
      </div>

      {/* Main Grid panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column: Select Employee & Assigned Assets */}
        <div className="space-y-8">
          {/* 1. Select Employee card */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <span className="h-5 w-5 bg-slate-100 rounded-full flex items-center justify-center text-xs text-slate-500">1</span>
              <span>Select Employee</span>
            </h3>

            <div className="space-y-3">
              <label className="block text-xs font-bold text-slate-500">Select Employee *</label>
              <select
                value={selectedEmpId}
                onChange={e => { setSelectedEmpId(e.target.value); setSelectedAssetIds([]); }}
                className="w-full p-3 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500/20 focus:outline-none font-semibold text-slate-700 bg-slate-50/50"
              >
                {employees.map(emp => (
                  <option key={emp.id} value={emp.id}>{emp.id} - {emp.name}</option>
                ))}
              </select>
            </div>

            {/* Detailed employee card */}
            {currentEmp && (
              <div className="p-4 bg-slate-50/50 border rounded-2xl flex gap-4 text-xs">
                <Avatar name={currentEmp.name} className="h-16 w-16 rounded-xl border" textSize="text-lg" />
                <div className="grid grid-cols-2 gap-x-6 gap-y-1.5 flex-1 min-w-0 text-slate-600">
                  <div className="min-w-0 col-span-2">
                    <p className="font-extrabold text-slate-800 text-sm leading-tight">{currentEmp.name}</p>
                    <p className="text-[10px] text-slate-400 font-semibold mt-0.5">{currentEmp.designation}</p>
                  </div>
                  <div>
                    <span className="font-semibold text-slate-400 text-[10px] block">Employee ID</span>
                    <span className="font-bold text-slate-700">{currentEmp.id}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-slate-400 text-[10px] block">Email</span>
                    <span className="font-bold text-slate-700 truncate block">{currentEmp.email}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-slate-400 text-[10px] block">Department</span>
                    <span className="font-bold text-slate-700">{currentEmp.department}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-slate-400 text-[10px] block">Date of Joining</span>
                    <span className="font-bold text-slate-700">{currentEmp.joiningDate}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 2. Assigned Assets selection */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <span className="h-5 w-5 bg-slate-100 rounded-full flex items-center justify-center text-xs text-slate-500">2</span>
              <span>Assigned Assets</span>
            </h3>

            {/* Asset checklist table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    <th className="pb-3 pr-4">Asset ID</th>
                    <th className="pb-3 px-4">Asset Type</th>
                    <th className="pb-3 px-4">Model</th>
                    <th className="pb-3 px-4">Assigned Date</th>
                    <th className="pb-3 px-4">Status</th>
                    <th className="pb-3 pl-4 text-center">Select</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {assignedAssets.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-slate-400">
                        No assets currently assigned to this employee.
                      </td>
                    </tr>
                  ) : (
                    assignedAssets.map((asset) => (
                      <tr key={asset.id} className="hover:bg-slate-50/50">
                        <td className="py-3 pr-4 font-bold text-blue-600">{asset.id}</td>
                        <td className="py-3 px-4 font-medium">{asset.type}</td>
                        <td className="py-3 px-4 text-slate-600">{asset.brand} {asset.model}</td>
                        <td className="py-3 px-4 text-slate-500">{asset.purchaseDate}</td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-bold">
                            Assigned
                          </span>
                        </td>
                        <td className="py-3 pl-4 text-center">
                          <input
                            type="checkbox"
                            checked={selectedAssetIds.includes(asset.id)}
                            onChange={() => handleToggleAsset(asset.id)}
                            className="rounded text-blue-600 border-slate-300 focus:ring-blue-500"
                          />
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Count summaries */}
            <div className="flex justify-between border-t border-slate-100 pt-4 text-xs font-bold text-slate-400">
              <span>Total Assigned Assets: {assignedAssets.length}</span>
              <span className="text-blue-600">Selected for Return: {selectedAssetIds.length}</span>
            </div>
          </div>
        </div>

        {/* Right Column: Return Details form & Instructions */}
        <div className="space-y-8">
          {/* 3. Return details card */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <span className="h-5 w-5 bg-slate-100 rounded-full flex items-center justify-center text-xs text-slate-500">3</span>
              <span>Return Details</span>
            </h3>

            <form onSubmit={handleNextStep} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Return Date *</label>
                  <input
                    type="date"
                    required
                    value={returnDate}
                    onChange={e => setReturnDate(e.target.value)}
                    className="w-full p-2.5 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Returned By *</label>
                  <select
                    value={returnedBy}
                    onChange={e => setReturnedBy(e.target.value)}
                    className="w-full p-2.5 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500/20 focus:outline-none font-semibold text-slate-700 bg-slate-50/50"
                  >
                    <option value="Rakesh Reddy (Admin)">Rakesh Reddy (Admin)</option>
                    <option value="Amit Verma (Admin)">Amit Verma (Admin)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Reason for Return *</label>
                  <select
                    value={reason}
                    onChange={e => setReason(e.target.value)}
                    className="w-full p-2.5 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500/20 focus:outline-none font-semibold text-slate-700 bg-slate-50/50"
                  >
                    {["Employee Resignation", "Upgraded Device", "Department Transfer", "Relieving", "Damaged/Defective"].map(r => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Condition of Assets *</label>
                  <select
                    value={condition}
                    onChange={e => setCondition(e.target.value)}
                    className="w-full p-2.5 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500/20 focus:outline-none font-semibold text-slate-700 bg-slate-50/50"
                  >
                    <option value="Good">Good</option>
                    <option value="Fair">Fair</option>
                    <option value="Under Repair">Under Repair / Defective</option>
                    <option value="Damaged">Damaged (Disposed)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Remarks (Optional)</label>
                <textarea
                  rows={1}
                  value={remarks}
                  onChange={e => setRemarks(e.target.value)}
                  placeholder="Enter any remarks..."
                  className="w-full p-2.5 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500/20 focus:outline-none resize-none"
                />
              </div>

              {/* Green Instructions card */}
              <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl flex gap-3 text-xs text-emerald-900">
                <Info className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-extrabold">Instructions</p>
                  <ul className="list-disc pl-4 space-y-1 text-[10px] font-semibold text-emerald-800">
                    <li>Please ensure all selected assets are physically received before confirming return.</li>
                    <li>Asset status will be updated to 'Available' (or 'Under Repair') after confirmation.</li>
                  </ul>
                </div>
              </div>

              {/* Action */}
              <div className="flex justify-end pt-2">
                <button 
                  type="submit" 
                  className="w-full sm:w-auto px-5 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-lg shadow-blue-500/10 transition-all flex items-center justify-center gap-1.5"
                >
                  <span>Next: Review & Confirm</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom Section: Returned Assets History */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-800">Returned Assets History</h3>
          <button className="flex items-center justify-center gap-1.5 py-1.5 px-3 border border-slate-200 hover:bg-slate-50 text-slate-600 font-semibold text-xs rounded-xl">
            <Download className="h-4 w-4" />
            <span>Export</span>
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="pb-3 pr-4">Return ID</th>
                <th className="pb-3 px-4">Employee</th>
                <th className="pb-3 px-4">Assets Returned</th>
                <th className="pb-3 px-4">Return Date</th>
                <th className="pb-3 px-4">Returned By</th>
                <th className="pb-3 px-4">Reason</th>
                <th className="pb-3 px-4">Condition</th>
                <th className="pb-3 pl-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {returnLogs.slice(0, 3).map((log, index) => {
                const empIdMatch = log.details.match(/EMP\d+/);
                const empId = empIdMatch ? empIdMatch[0] : '';
                const emp = employees.find(e => e.id === empId);
                const condMatch = log.details.match(/Condition:\s*(\w+)/);
                const cond = condMatch ? condMatch[1] : 'Good';

                return (
                  <tr key={index} className="hover:bg-slate-50/50">
                    <td className="py-4 pr-4 font-bold text-blue-600">RET000{4 - index}</td>
                    <td className="py-4 px-4 font-bold">
                      {emp ? (
                        <div className="flex items-center gap-2">
                          <Avatar name={emp.name} className="h-6 w-6 rounded-full" textSize="text-[8px]" />
                          <span>{emp.name} ({emp.id})</span>
                        </div>
                      ) : (
                        <span>Rahul Sharma ({empId || 'EMP002'})</span>
                      )}
                    </td>
                    <td className="py-4 px-4 font-bold text-blue-600">1 Asset</td>
                    <td className="py-4 px-4 text-slate-500">{log.dateTime.split(',')[0]}</td>
                    <td className="py-4 px-4 text-slate-600">{log.user} (Admin)</td>
                    <td className="py-4 px-4 text-slate-500">Employee Resignation</td>
                    <td className="py-4 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                        cond === 'Good' ? 'bg-green-50 text-green-600' : 'bg-amber-50 text-amber-600'
                      }`}>
                        {cond}
                      </span>
                    </td>
                    <td className="py-4 pl-4 text-right">
                      <button 
                        onClick={() => showToast(`Details: ${log.details}`, "info")}
                        className="p-1.5 hover:bg-slate-100 rounded-lg text-blue-600"
                        title="View Details"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="text-center pt-2 border-t border-slate-100">
          <button className="text-xs font-semibold text-blue-600 hover:text-blue-800 transition-all">
            View all returned assets
          </button>
        </div>
      </div>

      {/* Review & Confirm overlay modal */}
      {isConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsConfirmOpen(false)} />
          <div className="relative bg-white border border-slate-200 w-full max-w-md rounded-3xl shadow-2xl overflow-hidden p-6 z-10 flex flex-col items-center">
            <button onClick={() => setIsConfirmOpen(false)} className="absolute top-5 right-5 p-1 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700">
              <X className="h-5 w-5" />
            </button>
            <div className="p-3 bg-amber-50 text-amber-600 rounded-full mb-4">
              <AlertCircle className="h-10 w-10 animate-pulse" />
            </div>
            <h3 className="font-extrabold text-slate-800 text-base text-center">Confirm Asset Return</h3>
            <p className="text-xs text-slate-500 text-center mt-2 px-2 leading-relaxed">
              Are you sure you want to process the return of <strong className="text-slate-800">{selectedAssetIds.length} assets</strong> from <strong className="text-slate-800">{currentEmp?.name}</strong>?
            </p>

            <div className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl text-xs space-y-2 mt-4 text-slate-600 font-semibold">
              <div className="flex justify-between">
                <span>Employee Name:</span>
                <span className="font-bold text-slate-800">{currentEmp?.name}</span>
              </div>
              <div className="flex justify-between">
                <span>Return Date:</span>
                <span className="font-bold text-slate-800">{returnDate}</span>
              </div>
              <div className="flex justify-between">
                <span>Reported Condition:</span>
                <span className="font-bold text-slate-800">{condition}</span>
              </div>
              <div className="flex justify-between">
                <span>Return Reason:</span>
                <span className="font-bold text-slate-800">{reason}</span>
              </div>
            </div>

            <div className="mt-6 flex gap-3 w-full">
              <button 
                type="button" 
                onClick={() => setIsConfirmOpen(false)}
                className="flex-1 py-3 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 font-bold text-xs text-slate-700 transition-all"
              >
                Go Back
              </button>
              <button 
                type="button" 
                onClick={handleConfirmSubmit}
                className="flex-1 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-lg shadow-blue-500/20 transition-all"
              >
                Confirm Return
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReturnAsset;
