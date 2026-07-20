import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Trash2, 
  Calendar, 
  UserCheck, 
  Plus, 
  Minus, 
  Eye, 
  RefreshCw, 
  CheckCircle,
  HelpCircle,
  FileText,
  Laptop,
  Monitor,
  Mouse,
  Keyboard,
  Headphones,
  Printer,
  Cpu,
  Link2,
  ArrowLeft
} from 'lucide-react';
import { useAssetManager } from '../hooks/useAssetManager';
import Avatar from '../components/Avatar';

const AssignAsset = () => {
  const { 
    employees, 
    assets, 
    assignAssets, 
    activity,
    showToast 
  } = useAssetManager();

  // Selected state
  const [selectedEmpId, setSelectedEmpId] = useState(employees[0]?.id || '');
  const [selectedAssetIds, setSelectedAssetIds] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  
  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('search'); // search | qr
  
  // Form details state
  const [assignDate, setAssignDate] = useState('2026-07-10');
  const [expectedReturnDate, setExpectedReturnDate] = useState('2028-07-10');
  const [remarks, setRemarks] = useState('');

  // 1. Get selected employee details
  const currentEmp = employees.find(e => e.id === selectedEmpId);

  // 2. Filter available assets for selection list
  const availableAssets = assets.filter(asset => {
    const isAvailable = asset.status === 'Available';
    const isNotBasket = !selectedAssetIds.includes(asset.id);
    const searchString = `${asset.id} ${asset.type} ${asset.brand} ${asset.model} ${asset.serialNumber}`.toLowerCase();
    const matchesSearch = searchString.includes(searchTerm.toLowerCase());
    return isAvailable && isNotBasket && matchesSearch;
  });

  // 3. Get basket assets
  const basketAssets = assets.filter(asset => selectedAssetIds.includes(asset.id));

  // 4. Toggle asset selection
  const handleAddAsset = (id) => {
    setSelectedAssetIds(prev => [...prev, id]);
  };

  const handleRemoveAsset = (id) => {
    setSelectedAssetIds(prev => prev.filter(item => item !== id));
  };

  // 5. Submit assignment
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedEmpId) {
      showToast("Please select an employee.", "error");
      return;
    }
    if (selectedAssetIds.length === 0) {
      showToast("Please select at least one asset to assign.", "error");
      return;
    }

    assignAssets(selectedEmpId, selectedAssetIds, assignDate, expectedReturnDate, remarks);
    
    // Success feedback and Reset
    showToast(`Successfully assigned ${selectedAssetIds.length} assets to ${currentEmp.name}!`);
    setSelectedAssetIds([]);
    setRemarks('');
    setSelectedCategory(null);
  };

  const handleReset = () => {
    setSelectedAssetIds([]);
    setRemarks('');
    setAssignDate('2026-07-10');
    setExpectedReturnDate('2028-07-10');
    setSelectedCategory(null);
  };

  // Filter recent assignments list for the history log table
  const recentAssignmentsLogs = activity.filter(act => act.activity === "Assign Asset");

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Breadcrumbs */}
      <div className="text-xs font-semibold text-slate-400">
        <span className="hover:text-slate-600 cursor-pointer">Dashboard</span>
        <span className="mx-2">&gt;</span>
        <span className="text-slate-600 font-bold">Assign Assets</span>
      </div>

      {/* Main Form Split Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column: Select Employee & Select Assets */}
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
                onChange={e => setSelectedEmpId(e.target.value)}
                className="w-full p-3 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500/20 focus:outline-none font-semibold text-slate-700 bg-slate-50/50"
              >
                {employees.filter(e => e.status === 'Active').map(emp => (
                  <option key={emp.id} value={emp.id}>{emp.id} - {emp.name}</option>
                ))}
              </select>
            </div>

            {/* Employee Info Box (Blue) */}
            {currentEmp && (
              <div className="p-4 bg-blue-50/50 border border-blue-100 rounded-2xl flex gap-3 text-xs">
                <Avatar name={currentEmp.name} className="h-14 w-14 rounded-xl border border-blue-200" textSize="text-lg" />
                <div className="space-y-1 text-blue-900 min-w-0">
                  <p className="font-extrabold">{currentEmp.name}</p>
                  <p className="text-[10px] font-semibold text-blue-700">{currentEmp.designation} &bull; {currentEmp.department}</p>
                  <p className="text-[10px] text-blue-800 truncate">Email: {currentEmp.email}</p>
                  <p className="text-[10px] text-blue-800">Phone: {currentEmp.phone}</p>
                </div>
              </div>
            )}
          </div>

          {/* 2. Select Assets card */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <span className="h-5 w-5 bg-slate-100 rounded-full flex items-center justify-center text-xs text-slate-500">2</span>
              <span>Select Assets</span>
            </h3>

            {/* Selection tabs */}
            <div className="flex border-b border-slate-100 text-xs">
              <button 
                onClick={() => { setActiveTab('search'); setSelectedCategory(null); }}
                className={`pb-2.5 px-1 font-bold border-b-2 transition-all ${
                  activeTab === 'search' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-400'
                }`}
              >
                Search Assets
              </button>
              <button 
                onClick={() => setActiveTab('qr')}
                className={`pb-2.5 px-4 font-bold border-b-2 transition-all ${
                  activeTab === 'qr' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-400'
                }`}
              >
                Scan QR / Barcode
              </button>
            </div>

            {/* Search Input bar */}
            {activeTab === 'search' ? (
              selectedCategory === null ? (
                /* Category Picker Grid */
                <div className="grid grid-cols-2 gap-4 max-h-72 overflow-y-auto pr-1">
                  {[
                    { name: 'Laptop', icon: Laptop },
                    { name: 'Monitor', icon: Monitor },
                    { name: 'Mouse', icon: Mouse },
                    { name: 'Keyboard', icon: Keyboard },
                    { name: 'Headset', icon: Headphones },
                    { name: 'Printer', icon: Printer },
                    { name: 'Desktop', icon: Cpu },
                    { name: 'Docking Station', icon: Link2 }
                  ].map((cat) => {
                    const availableCount = assets.filter(
                      a => a.status === 'Available' && a.type === cat.name && !selectedAssetIds.includes(a.id)
                    ).length;

                    return (
                      <div 
                        key={cat.name}
                        onClick={() => setSelectedCategory(cat.name)}
                        className="p-4 border border-slate-100 hover:border-blue-500 rounded-2xl flex items-center gap-3 cursor-pointer hover:shadow-md hover:shadow-blue-500/5 transition-all group bg-slate-50/50 hover:bg-white"
                      >
                        <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-all shrink-0">
                          <cat.icon className="h-5 w-5" />
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-xs font-bold text-slate-800 group-hover:text-blue-600 transition-all truncate">{cat.name}</h4>
                          <p className="text-[10px] text-slate-400 font-semibold mt-0.5">{availableCount} Available</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                /* Category View List */
                <div className="space-y-4">
                  <button 
                    type="button"
                    onClick={() => setSelectedCategory(null)}
                    className="flex items-center gap-1 text-[10px] font-extrabold text-blue-600 hover:text-blue-800 transition-all uppercase tracking-wider bg-blue-50/50 py-1.5 px-3 rounded-lg border border-blue-100"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    <span>Back to Categories</span>
                  </button>

                  <div className="text-xs font-bold text-slate-800 flex items-center justify-between pb-2 border-b border-slate-50">
                    <span>Available {selectedCategory}s</span>
                    <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full font-extrabold">
                      {assets.filter(a => a.status === 'Available' && a.type === selectedCategory && !selectedAssetIds.includes(a.id)).length} items
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <Search className="h-4 w-4" />
                      </span>
                      <input
                        type="text"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        placeholder={`Search ${selectedCategory}s...`}
                        className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-xs bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                      />
                    </div>
                    <button className="p-2 border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-500">
                      <Filter className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Available Assets grid table for selected category */}
                  <div className="max-h-60 overflow-y-auto divide-y divide-slate-100 pr-1">
                    {assets.filter(asset => {
                      const isAvailable = asset.status === 'Available';
                      const isNotBasket = !selectedAssetIds.includes(asset.id);
                      const isSelectedCat = asset.type === selectedCategory;
                      const searchString = `${asset.id} ${asset.brand} ${asset.model} ${asset.serialNumber}`.toLowerCase();
                      const matchesSearch = searchString.includes(searchTerm.toLowerCase());
                      return isAvailable && isNotBasket && isSelectedCat && matchesSearch;
                    }).length === 0 ? (
                      <p className="text-xs text-slate-400 text-center py-8">
                        No available {selectedCategory}s matching query.
                      </p>
                    ) : (
                      assets.filter(asset => {
                        const isAvailable = asset.status === 'Available';
                        const isNotBasket = !selectedAssetIds.includes(asset.id);
                        const isSelectedCat = asset.type === selectedCategory;
                        const searchString = `${asset.id} ${asset.brand} ${asset.model} ${asset.serialNumber}`.toLowerCase();
                        const matchesSearch = searchString.includes(searchTerm.toLowerCase());
                        return isAvailable && isNotBasket && isSelectedCat && matchesSearch;
                      }).map((asset) => (
                        <div key={asset.id} className="py-2.5 flex items-center justify-between gap-3 hover:bg-slate-50/40 rounded-xl px-2">
                          <div className="flex items-center gap-2 min-w-0">
                            <input 
                              type="checkbox" 
                              onChange={() => handleAddAsset(asset.id)}
                              checked={false}
                              className="rounded text-blue-600 border-slate-300 focus:ring-blue-500 shrink-0" 
                            />
                            <img src={asset.image} alt={asset.model} className="h-7 w-7 rounded-lg object-cover border shrink-0" />
                            <div className="min-w-0">
                              <p className="text-xs font-bold text-slate-800">{asset.id} &bull; {asset.brand} {asset.model}</p>
                              <p className="text-[10px] text-slate-400 truncate">{asset.type} &bull; SN: {asset.serialNumber}</p>
                            </div>
                          </div>
                          <button 
                            type="button"
                            onClick={() => handleAddAsset(asset.id)}
                            className="p-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-100"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )
            ) : (
              <div className="py-8 flex flex-col items-center justify-center text-center space-y-3 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
                  <RefreshCw className="h-6 w-6 animate-spin" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800">Scan Simulation Ready</h4>
                  <p className="text-[10px] text-slate-400 mt-1">Use the "Scan QR / Barcode" button in the sidebar to scan mock codes.</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Selected Assets Basket & Assignment details */}
        <div className="space-y-8">
          {/* 3. Selected Assets Basket */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2 justify-between">
              <span className="flex items-center gap-2">
                <span className="h-5 w-5 bg-slate-100 rounded-full flex items-center justify-center text-xs text-slate-500">3</span>
                <span>Selected Assets ({selectedAssetIds.length})</span>
              </span>
              {selectedAssetIds.length > 0 && (
                <span className="text-[10px] bg-green-50 text-green-700 px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                  <CheckCircle className="h-3 w-3" />
                  <span>{selectedAssetIds.length} assets selected</span>
                </span>
              )}
            </h3>

            {/* Selected Assets List table */}
            <div className="max-h-48 overflow-y-auto border border-slate-100 rounded-2xl divide-y divide-slate-100">
              {basketAssets.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-8">
                  No assets selected yet. Pick items from the selection panel.
                </p>
              ) : (
                basketAssets.map((asset) => (
                  <div key={asset.id} className="p-3 flex items-center justify-between gap-3 hover:bg-slate-50/50">
                    <div className="flex items-center gap-2 min-w-0">
                      <img src={asset.image} alt={asset.model} className="h-8 w-8 rounded-lg object-cover border shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-800">{asset.id} &bull; {asset.brand} {asset.model}</p>
                        <p className="text-[10px] text-slate-400 truncate">{asset.type} &bull; SN: {asset.serialNumber}</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleRemoveAsset(asset.id)}
                      className="p-1.5 hover:bg-red-50 text-red-500 rounded-lg"
                      title="Remove"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* 4. Assignment details form card */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <span className="h-5 w-5 bg-slate-100 rounded-full flex items-center justify-center text-xs text-slate-500">4</span>
              <span>Assignment Details</span>
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Assignment Date *</label>
                  <input
                    type="date"
                    required
                    value={assignDate}
                    onChange={e => setAssignDate(e.target.value)}
                    className="w-full p-2.5 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Expected Return Date</label>
                  <input
                    type="date"
                    value={expectedReturnDate}
                    onChange={e => setExpectedReturnDate(e.target.value)}
                    className="w-full p-2.5 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Assigned By</label>
                  <input
                    type="text"
                    disabled
                    value="Rakesh Reddy (Admin)"
                    className="w-full p-2.5 border border-slate-200 rounded-xl text-xs bg-slate-50 text-slate-500 font-semibold cursor-not-allowed"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Remarks (Optional)</label>
                  <textarea
                    rows={1}
                    value={remarks}
                    onChange={e => setRemarks(e.target.value)}
                    placeholder="Enter remarks..."
                    className="w-full p-2.5 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500/20 focus:outline-none resize-none"
                  />
                </div>
              </div>

              <div className="flex gap-3 justify-end pt-4 border-t border-slate-100">
                <button 
                  type="button" 
                  onClick={handleReset}
                  className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50 rounded-xl border border-slate-200"
                >
                  Reset
                </button>
                <button 
                  type="submit" 
                  className="px-5 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-lg shadow-blue-500/10 transition-all flex items-center gap-1.5"
                >
                  <UserCheck className="h-4 w-4" />
                  <span>Assign Assets</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom Section: Recent Assignments logs list */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-slate-800">Recent Assignments</h3>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="pb-3 pr-4">Employee</th>
                <th className="pb-3 px-4">Asset(s)</th>
                <th className="pb-3 px-4">Assigned By</th>
                <th className="pb-3 px-4">Assignment Date</th>
                <th className="pb-3 px-4">Expected Return Date</th>
                <th className="pb-3 pl-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
              {recentAssignmentsLogs.slice(0, 3).map((log, index) => {
                // Extract detail information
                const empIdMatch = log.details.match(/EMP\d+/);
                const empId = empIdMatch ? empIdMatch[0] : '';
                const emp = employees.find(e => e.id === empId);

                return (
                  <tr key={index} className="hover:bg-slate-50/50">
                    <td className="py-4 pr-4 font-bold">
                      {emp ? (
                        <div className="flex items-center gap-2">
                          <Avatar name={emp.name} className="h-6 w-6 rounded-full" textSize="text-[8px]" />
                          <span>{emp.name} ({emp.id})</span>
                        </div>
                      ) : (
                        <span>Rahul Sharma ({empId || 'EMP002'})</span>
                      )}
                    </td>
                    <td className="py-4 px-4 font-bold text-blue-600">
                      1 Asset
                    </td>
                    <td className="py-4 px-4 font-semibold text-slate-600">{log.user} (Admin)</td>
                    <td className="py-4 px-4 text-slate-500">{log.dateTime.split(',')[0]}</td>
                    <td className="py-4 px-4 text-slate-500">09 Jul 2028</td>
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
            View all assignments
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssignAsset;
