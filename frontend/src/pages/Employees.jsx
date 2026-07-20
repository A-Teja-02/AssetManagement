import React, { useState } from 'react';
import { 
  Users, 
  UserCheck, 
  UserX, 
  FolderKey, 
  Plus, 
  Search, 
  Filter, 
  Eye, 
  Pencil, 
  Trash, 
  ChevronLeft, 
  ChevronRight,
  X,
  PlusCircle,
  Briefcase,
  AlertTriangle
} from 'lucide-react';
import { useAssetManager } from '../hooks/useAssetManager';
import MetricCard from '../components/MetricCard';
import Avatar from '../components/Avatar';

const Employees = () => {
  const { 
    employees, 
    assets, 
    addEmployee, 
    updateEmployee, 
    deleteEmployee,
    showToast
  } = useAssetManager();

  // Search, Pagination, Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteConfirmEmp, setDeleteConfirmEmp] = useState(null);
  const [deptFilter, setDeptFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  // Form states
  const [formName, setFormName] = useState('');
  const [formDept, setFormDept] = useState('IT');
  const [formDesig, setFormDesig] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formStatus, setFormStatus] = useState('Active');

  // Statistics calculation
  const totalEmployeesCount = employees.length;
  const activeCount = employees.filter(e => e.status === 'Active').length;
  const inactiveCount = employees.filter(e => e.status === 'Inactive').length;

  // Find unique departments list
  const departmentsList = ['All', ...new Set(employees.map(e => e.department))];
  const departmentsCount = departmentsList.length - 1; // subtract 'All'

  // Filter employees
  const filteredEmployees = employees.filter(emp => {
    const assigned = assets.filter(a => a.assignedTo === emp.id);
    const searchString = `${emp.id} ${emp.name} ${emp.department} ${emp.designation} ${emp.email} ${emp.phone} ${emp.status} ${assigned.length} assets`.toLowerCase();
    const matchesSearch = searchString.includes(searchTerm.toLowerCase());
    const matchesDept = deptFilter === 'All' ? true : emp.department === deptFilter;
    return matchesSearch && matchesDept;
  });

  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);
  const paginatedEmployees = filteredEmployees.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Form handlers
  const handleOpenAddModal = () => {
    setFormName('');
    setFormDept('IT');
    setFormDesig('');
    setFormEmail('');
    setFormPhone('');
    setFormStatus('Active');
    setIsAddModalOpen(true);
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    addEmployee({
      name: formName,
      department: formDept,
      designation: formDesig,
      email: formEmail,
      phone: formPhone,
      status: formStatus
    });
    setIsAddModalOpen(false);
  };

  const handleOpenEditModal = (emp) => {
    setSelectedEmployee(emp);
    setFormName(emp.name);
    setFormDept(emp.department);
    setFormDesig(emp.designation);
    setFormEmail(emp.email);
    setFormPhone(emp.phone);
    setFormStatus(emp.status);
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    updateEmployee({
      ...selectedEmployee,
      name: formName,
      department: formDept,
      designation: formDesig,
      email: formEmail,
      phone: formPhone,
      status: formStatus
    });
    setIsEditModalOpen(false);
  };

  const handleOpenViewModal = (emp) => {
    setSelectedEmployee(emp);
    setIsViewModalOpen(true);
  };

  const handleDelete = () => {
    deleteEmployee(deleteConfirmEmp.id);
    showToast('Employee deleted successfully', 'success');
    setDeleteConfirmEmp(null);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Breadcrumbs */}
      <div className="flex items-center justify-between">
        <div className="text-xs font-semibold text-slate-400">
          <span className="hover:text-slate-600 cursor-pointer">Dashboard</span>
          <span className="mx-2">&gt;</span>
          <span className="text-slate-600 font-bold">Employees</span>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard icon={Users} title="Total Employees" value={totalEmployeesCount} color="blue" linkTo="/employees" linkLabel="View all employees" />
        <MetricCard icon={UserCheck} title="Active Employees" value={activeCount} color="green" linkTo="/employees" linkLabel="View active employees" />
        <MetricCard icon={UserX} title="Inactive Employees" value={inactiveCount} color="orange" linkTo="/employees" linkLabel="View inactive employees" />
        <MetricCard icon={FolderKey} title="Departments" value={departmentsCount} color="purple" linkTo="/employees" linkLabel="View all departments" />
      </div>

      {/* Employees Main Panel */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h3 className="text-base font-bold text-slate-800">Employee List</h3>
          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            {/* Search */}
            <div className="relative flex-1 sm:w-64 min-w-[200px]">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Search className="h-4 w-4" />
              </span>
              <input
                type="text"
                value={searchTerm}
                onChange={e => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                placeholder="Search employees..."
                className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-xs bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
              />
            </div>
            
            {/* Department Filter Dropdown */}
            <select
              value={deptFilter}
              onChange={e => { setDeptFilter(e.target.value); setCurrentPage(1); }}
              className="px-3 py-2 border border-slate-200 rounded-xl text-xs bg-slate-50 text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-semibold"
            >
              {departmentsList.map(dept => (
                <option key={dept} value={dept}>{dept === 'All' ? 'All Departments' : dept}</option>
              ))}
            </select>

            {/* Add Employee Trigger */}
            <button 
              onClick={handleOpenAddModal}
              className="flex items-center justify-center gap-1.5 py-2 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-all shadow-md shadow-blue-500/10 shrink-0"
            >
              <Plus className="h-4 w-4" />
              <span>Add Employee</span>
            </button>
          </div>
        </div>

        {/* Employee Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="pb-3 pr-4">Employee ID</th>
                <th className="pb-3 px-4">Name</th>
                <th className="pb-3 px-4">Department</th>
                <th className="pb-3 px-4">Designation</th>
                <th className="pb-3 px-4">Email</th>
                <th className="pb-3 px-4">Phone</th>
                <th className="pb-3 px-4">Assets Assigned</th>
                <th className="pb-3 px-4">Status</th>
                <th className="pb-3 pl-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
              {paginatedEmployees.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-slate-400">
                    No matching employees found.
                  </td>
                </tr>
              ) : (
                paginatedEmployees.map((emp) => {
                  const assignedAssets = assets.filter(a => a.assignedTo === emp.id);
                  return (
                    <tr 
                      key={emp.id} 
                      onClick={() => handleOpenViewModal(emp)}
                      className="hover:bg-slate-50/50 transition-all cursor-pointer"
                    >
                      <td className="py-4 pr-4 font-bold text-slate-500">
                        {emp.id}
                      </td>
                      <td className="py-4 px-4 font-bold text-slate-800">
                        <div className="flex items-center gap-3">
                          <Avatar name={emp.name} className="h-8 w-8 rounded-xl ring-2 ring-slate-100" />
                          <span>{emp.name}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 font-semibold text-slate-600">{emp.department}</td>
                      <td className="py-4 px-4 text-slate-600">{emp.designation}</td>
                      <td className="py-4 px-4 text-slate-500">{emp.email}</td>
                      <td className="py-4 px-4 text-slate-500 font-medium">{emp.phone}</td>
                      <td className="py-4 px-4">
                        <span 
                          onClick={(e) => { e.stopPropagation(); handleOpenViewModal(emp); }}
                          className="px-2.5 py-1 rounded-lg text-xs font-bold text-blue-600 bg-blue-50 cursor-pointer hover:bg-blue-100 transition-all"
                        >
                          {assignedAssets.length}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold ${
                          emp.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                        }`}>
                          {emp.status}
                        </span>
                      </td>
                      <td className="py-4 pl-4 text-right">
                        <div className="flex items-center justify-end gap-2.5">
                          <button 
                            onClick={(e) => { e.stopPropagation(); handleOpenViewModal(emp); }}
                            className="p-1.5 hover:bg-slate-100 rounded-lg text-blue-600 transition-all"
                            title="View"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button 
                            onClick={(e) => { e.stopPropagation(); handleOpenEditModal(emp); }}
                            className="p-1.5 hover:bg-slate-100 rounded-lg text-blue-600 transition-all"
                            title="Edit"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              setDeleteConfirmEmp({ id: emp.id, name: emp.name });
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
              Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredEmployees.length)} of {filteredEmployees.length} entries
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

      {/* CRUD Add Employee Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsAddModalOpen(false)} />
          <div className="relative bg-white border border-slate-200 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden p-6 z-10">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
              <h3 className="font-bold text-slate-800">Add New Employee</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="p-1 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Full Name *</label>
                  <input 
                    type="text" 
                    required 
                    value={formName} 
                    onChange={e => setFormName(e.target.value)} 
                    placeholder="e.g. Rahul Sharma"
                    className="w-full p-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Department *</label>
                  <select 
                    value={formDept} 
                    onChange={e => setFormDept(e.target.value)}
                    className="w-full p-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                  >
                    {["IT", "Finance", "HR", "Marketing", "Operations", "Sales", "Legal", "Executive"].map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Designation *</label>
                  <input 
                    type="text" 
                    required 
                    value={formDesig} 
                    onChange={e => setFormDesig(e.target.value)} 
                    placeholder="e.g. Network Engineer"
                    className="w-full p-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Email Address *</label>
                  <input 
                    type="email" 
                    required 
                    value={formEmail} 
                    onChange={e => setFormEmail(e.target.value)} 
                    placeholder="e.g. rahul@company.com"
                    className="w-full p-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Phone Number *</label>
                  <input 
                    type="text" 
                    required 
                    value={formPhone} 
                    onChange={e => setFormPhone(e.target.value)} 
                    placeholder="e.g. +91 91234 56789"
                    className="w-full p-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Status</label>
                  <select 
                    value={formStatus} 
                    onChange={e => setFormStatus(e.target.value)}
                    className="w-full p-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-3 justify-end pt-4 border-t border-slate-100">
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-4 py-2 text-xs font-semibold text-slate-500 hover:bg-slate-50 rounded-xl border border-slate-200">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md shadow-blue-500/10">
                  Save Employee
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CRUD Edit Employee Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsEditModalOpen(false)} />
          <div className="relative bg-white border border-slate-200 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden p-6 z-10">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
              <h3 className="font-bold text-slate-800">Edit Employee {selectedEmployee?.id}</h3>
              <button onClick={() => setIsEditModalOpen(false)} className="p-1 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Full Name *</label>
                  <input 
                    type="text" 
                    required 
                    value={formName} 
                    onChange={e => setFormName(e.target.value)}
                    className="w-full p-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Department *</label>
                  <select 
                    value={formDept} 
                    onChange={e => setFormDept(e.target.value)}
                    className="w-full p-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                  >
                    {["IT", "Finance", "HR", "Marketing", "Operations", "Sales", "Legal", "Executive"].map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Designation *</label>
                  <input 
                    type="text" 
                    required 
                    value={formDesig} 
                    onChange={e => setFormDesig(e.target.value)}
                    className="w-full p-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Email Address *</label>
                  <input 
                    type="email" 
                    required 
                    value={formEmail} 
                    onChange={e => setFormEmail(e.target.value)}
                    className="w-full p-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Phone Number *</label>
                  <input 
                    type="text" 
                    required 
                    value={formPhone} 
                    onChange={e => setFormPhone(e.target.value)}
                    className="w-full p-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Status</label>
                  <select 
                    value={formStatus} 
                    onChange={e => setFormStatus(e.target.value)}
                    className="w-full p-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
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

      {/* CRUD View Employee Details Modal */}
      {isViewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsViewModalOpen(false)} />
          <div className="relative bg-white border border-slate-200 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden p-6 z-10 flex flex-col">
            <button onClick={() => setIsViewModalOpen(false)} className="absolute top-5 right-5 p-1 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700">
              <X className="h-5 w-5" />
            </button>
            <div className="flex items-center gap-4 border-b border-slate-100 pb-5 mb-5">
              <Avatar name={selectedEmployee?.name} className="h-16 w-16 rounded-2xl border border-slate-100" textSize="text-base" />
              <div>
                <h3 className="font-extrabold text-slate-800 text-base leading-tight">{selectedEmployee?.name}</h3>
                <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
                  <Briefcase className="h-3 w-3" />
                  <span>{selectedEmployee?.designation} &bull; {selectedEmployee?.department}</span>
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Assigned Equipment</h4>
              <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                {assets.filter(a => a.assignedTo === selectedEmployee?.id).length === 0 ? (
                  <p className="text-xs text-slate-400 text-center py-4 bg-slate-50 rounded-2xl border border-slate-100">
                    No active assets currently assigned to this employee.
                  </p>
                ) : (
                  assets.filter(a => a.assignedTo === selectedEmployee?.id).map(asset => (
                    <div key={asset.id} className="p-3 border border-slate-100 rounded-2xl flex items-center justify-between hover:bg-slate-50/50 transition-all">
                      <div className="flex items-center gap-3">
                        <img src={asset.image} alt={asset.model} className="h-8 w-8 rounded-lg object-cover shrink-0 border" />
                        <div>
                          <p className="text-xs font-bold text-slate-800">{asset.brand} {asset.model}</p>
                          <p className="text-[10px] text-slate-400 font-mono mt-0.5">{asset.id} &bull; {asset.serialNumber}</p>
                        </div>
                      </div>
                      <span className="text-[10px] bg-slate-100 text-slate-500 font-bold px-2 py-0.5 rounded-md uppercase">
                        {asset.type}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="w-full mt-6 pt-4 border-t border-slate-100 text-xs text-slate-400 space-y-2 leading-relaxed">
              <div className="flex justify-between">
                <span>Employee ID</span>
                <span className="font-bold text-slate-700">{selectedEmployee?.id}</span>
              </div>
              <div className="flex justify-between">
                <span>Email</span>
                <span className="font-bold text-slate-700">{selectedEmployee?.email}</span>
              </div>
              <div className="flex justify-between">
                <span>Phone</span>
                <span className="font-bold text-slate-700">{selectedEmployee?.phone}</span>
              </div>
              <div className="flex justify-between">
                <span>Joining Date</span>
                <span className="font-bold text-slate-700">{selectedEmployee?.joiningDate}</span>
              </div>
            </div>

            <button 
              onClick={() => setIsViewModalOpen(false)}
              className="mt-6 w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/10 text-xs transition-all"
            >
              Close Record
            </button>
          </div>
        </div>
      )}

      {/* Custom Confirmation Modal for Deletion */}
      {deleteConfirmEmp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setDeleteConfirmEmp(null)} />
          <div className="relative bg-white border border-slate-200 w-full max-w-sm rounded-3xl shadow-2xl p-6 z-10 text-center space-y-4 animate-scale-in">
            <div className="p-3 bg-red-50 text-red-600 rounded-full w-fit mx-auto">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-800 text-sm">Delete Employee Record</h3>
              <p className="text-xs text-slate-500 mt-2">Are you sure you want to delete the employee record for {deleteConfirmEmp.name}? This action cannot be undone.</p>
            </div>
            <div className="flex items-center gap-3 pt-2 text-xs">
              <button 
                type="button"
                onClick={() => setDeleteConfirmEmp(null)}
                className="flex-1 py-2 border border-slate-200 rounded-xl hover:bg-slate-50 font-bold text-slate-500 transition-all cursor-pointer"
              >
                Go Back
              </button>
              <button 
                type="button"
                onClick={() => {
                  deleteEmployee(deleteConfirmEmp.id);
                  showToast(`Successfully deleted employee record ${deleteConfirmEmp.name}!`);
                  setDeleteConfirmEmp(null);
                }}
                className="flex-1 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold transition-all shadow-md shadow-red-500/10 cursor-pointer"
              >
                Delete Record
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Employees;
