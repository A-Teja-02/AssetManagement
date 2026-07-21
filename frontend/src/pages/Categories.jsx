import React, { useState } from 'react';
import { 
  FolderKey, 
  Laptop, 
  Monitor, 
  Mouse, 
  Keyboard, 
  Headphones, 
  Printer, 
  Cpu, 
  Plus, 
  Search, 
  Pencil, 
  Trash, 
  AlertTriangle, 
  X, 
  Box, 
  HardDrive, 
  Shield, 
  Grid, 
  Package, 
  Server,
  Layers,
  CheckCircle2,
  Briefcase,
  User,
  Building
} from 'lucide-react';
import { useAssetManager } from '../hooks/useAssetManager';
import MetricCard from '../components/MetricCard';
import AssetIconBadge from '../components/AssetIcon';
import Avatar from '../components/Avatar';

// Icon Map Helper with guaranteed valid Lucide components
const iconMap = {
  Laptop: Laptop,
  Monitor: Monitor,
  Mouse: Mouse,
  Keyboard: Keyboard,
  Headphones: Headphones,
  Printer: Printer,
  Cpu: Cpu,
  Briefcase: Briefcase,
  Grid: Grid,
  Box: Box,
  FolderKey: FolderKey,
  HardDrive: HardDrive,
  Shield: Shield,
  Package: Package,
  Server: Server
};

const iconOptions = [
  'Laptop', 'Monitor', 'Mouse', 'Keyboard', 'Headphones', 
  'Printer', 'Cpu', 'Briefcase', 'Grid', 'Box', 'FolderKey', 
  'HardDrive', 'Shield', 'Package', 'Server'
];

const Categories = () => {
  const { 
    categories, 
    assets,
    employees, 
    addCategory, 
    updateCategory, 
    deleteCategory, 
    showToast 
  } = useAssetManager();

  // Tab filter: 'All' | 'IT' | 'Employee' | 'Organization' | 'Non-IT'
  const [selectedTab, setSelectedTab] = useState('All');

  // Search filter
  const [searchTerm, setSearchTerm] = useState('');

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [deletingCategoryId, setDeletingCategoryId] = useState(null);
  const [selectedCategoryModal, setSelectedCategoryModal] = useState(null);
  const [modalSearchTerm, setModalSearchTerm] = useState('');
  const [modalStatusFilter, setModalStatusFilter] = useState('All');

  // Form states
  const [formName, setFormName] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formIcon, setFormIcon] = useState('Laptop');
  const [formGroup, setFormGroup] = useState('IT');
  const [formScope, setFormScope] = useState('Employee');

  // Safe categories list
  const safeCategories = categories || [];

  // Filtered categories by search, group tab, and scope
  const filteredCategories = safeCategories.filter(cat => {
    let matchesTab = true;
    if (selectedTab === 'IT') matchesTab = (cat.group || 'IT') === 'IT';
    else if (selectedTab === 'Employee') matchesTab = (cat.group || 'IT') === 'IT' && (cat.scope || 'Employee') === 'Employee';
    else if (selectedTab === 'Organization') matchesTab = (cat.group || 'IT') === 'IT' && cat.scope === 'Organization';
    else if (selectedTab === 'Non-IT') matchesTab = cat.group === 'Non-IT';

    const matchesSearch = cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (cat.description && cat.description.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesTab && matchesSearch;
  });

  // Helper to count assets per category name
  const getCategoryAssetCounts = (categoryName) => {
    const safeAssets = assets || [];
    const matched = safeAssets.filter(a => 
      a.type.toLowerCase().trim() === categoryName.toLowerCase().trim() ||
      categoryName.toLowerCase().trim().includes(a.type.toLowerCase().trim()) ||
      a.type.toLowerCase().trim().includes(categoryName.toLowerCase().trim())
    );
    const assigned = matched.filter(a => a.status === 'Assigned').length;
    const available = matched.filter(a => a.status === 'Available').length;
    const repair = matched.filter(a => a.status === 'Under Repair').length;
    return {
      total: matched.length,
      assigned,
      available,
      repair
    };
  };

  // KPI calculations
  const totalCategories = safeCategories.length;
  const itCategoriesCount = safeCategories.filter(c => (c.group || 'IT') === 'IT').length;
  const employeeItCount = safeCategories.filter(c => (c.group || 'IT') === 'IT' && (c.scope || 'Employee') === 'Employee').length;
  const orgItCount = safeCategories.filter(c => (c.group || 'IT') === 'IT' && c.scope === 'Organization').length;
  const nonItCategoriesCount = safeCategories.filter(c => c.group === 'Non-IT').length;
  const totalCategorizedAssets = (assets || []).length;

  // Handlers
  const handleOpenAddModal = () => {
    setFormName('');
    setFormDescription('');
    setFormIcon(selectedTab === 'Non-IT' ? 'Briefcase' : 'Laptop');
    setFormGroup(selectedTab === 'Non-IT' ? 'Non-IT' : 'IT');
    setFormScope(selectedTab === 'Organization' ? 'Organization' : 'Employee');
    setIsAddModalOpen(true);
  };

  const handleSaveAdd = (e) => {
    e.preventDefault();
    if (!formName.trim()) {
      showToast('Category name is required.', 'error');
      return;
    }
    addCategory({
      name: formName.trim(),
      description: formDescription.trim() || `${formGroup} asset category`,
      iconName: formIcon,
      group: formGroup,
      scope: formGroup === 'IT' ? formScope : 'Organization'
    });
    setIsAddModalOpen(false);
    showToast(`Successfully added category "${formName.trim()}" to ${formGroup} Assets!`);
  };

  const handleOpenEditModal = (cat) => {
    setEditingCategory(cat);
    setFormName(cat.name);
    setFormDescription(cat.description || '');
    setFormIcon(cat.iconName || 'Laptop');
    setFormGroup(cat.group || 'IT');
    setFormScope(cat.scope || 'Employee');
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!formName.trim()) {
      showToast('Category name is required.', 'error');
      return;
    }
    updateCategory(editingCategory.id, {
      name: formName.trim(),
      description: formDescription.trim(),
      iconName: formIcon,
      group: formGroup,
      scope: formGroup === 'IT' ? formScope : 'Organization'
    });
    setEditingCategory(null);
    showToast(`Successfully updated category "${formName.trim()}"!`);
  };

  const handleConfirmDelete = () => {
    if (!deletingCategoryId) return;
    const target = safeCategories.find(c => c.id === deletingCategoryId);
    deleteCategory(deletingCategoryId);
    setDeletingCategoryId(null);
    showToast(`Successfully deleted category "${target?.name || ''}"!`);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Breadcrumbs */}
      <div className="text-xs font-semibold text-slate-400">
        <span className="hover:text-slate-600 cursor-pointer">Dashboard</span>
        <span className="mx-2">&gt;</span>
        <span className="text-slate-600 font-bold">Categories</span>
      </div>

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <MetricCard
          title="Total Categories"
          value={totalCategories}
          subtext={`${itCategoriesCount} IT / ${nonItCategoriesCount} Non-IT`}
          color="blue"
          icon={Layers}
        />
        <MetricCard
          title="IT Category Types"
          value={itCategoriesCount}
          subtext="Hardware & Devices"
          color="green"
          icon={Laptop}
        />
        <MetricCard
          title="Non-IT Category Types"
          value={nonItCategoriesCount}
          subtext="Furniture & Fixtures"
          color="orange"
          icon={Briefcase}
        />
        <MetricCard
          title="Total Hardware Items"
          value={totalCategorizedAssets}
          subtext="Tracked Inventory"
          color="purple"
          icon={Package}
        />
      </div>

      {/* Control Bar: IT / Non-IT Tabs, Search & Add Button */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* IT vs Non-IT Toggle Tabs & Sub-Category Filters */}
        <div className="flex items-center gap-1.5 bg-slate-100/80 p-1.5 rounded-2xl border border-slate-200/80 w-fit shrink-0 flex-wrap">
          <button
            type="button"
            onClick={() => setSelectedTab('All')}
            className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
              selectedTab === 'All'
                ? 'bg-white text-slate-800 shadow-sm border border-slate-200/60'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            All ({totalCategories})
          </button>

          <button
            type="button"
            onClick={() => setSelectedTab('IT')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
              selectedTab === 'IT'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Laptop className="h-3.5 w-3.5" />
            <span>All IT</span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${selectedTab === 'IT' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-600'}`}>
              {itCategoriesCount}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedTab('Employee')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
              selectedTab === 'Employee'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <User className="h-3.5 w-3.5" />
            <span>Employee IT Assets</span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${selectedTab === 'Employee' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-600'}`}>
              {employeeItCount}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedTab('Organization')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
              selectedTab === 'Organization'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-500/20'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Building className="h-3.5 w-3.5" />
            <span>Org IT Assets</span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${selectedTab === 'Organization' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-600'}`}>
              {orgItCount}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedTab('Non-IT')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
              selectedTab === 'Non-IT'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/20'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Briefcase className="h-3.5 w-3.5" />
            <span>Non-IT Assets</span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${selectedTab === 'Non-IT' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-600'}`}>
              {nonItCategoriesCount}
            </span>
          </button>
        </div>

        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search category name or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-medium transition-all"
          />
        </div>

        {/* Action Button */}
        <button
          onClick={handleOpenAddModal}
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-500/20 transition-all cursor-pointer shrink-0"
        >
          <Plus className="h-4 w-4" />
          <span>Add New Category</span>
        </button>
      </div>

      {/* Category Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCategories.length === 0 ? (
          <div className="col-span-full py-12 bg-white rounded-3xl border border-slate-200 text-center">
            <FolderKey className="h-10 w-10 text-slate-300 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-slate-700">No Categories Found</h3>
            <p className="text-xs text-slate-400 mt-1">Try adjusting your search query or tab selection.</p>
          </div>
        ) : (
          filteredCategories.map((cat) => {
            const IconComponent = (cat.iconName && iconMap[cat.iconName]) ? iconMap[cat.iconName] : FolderKey;
            const counts = getCategoryAssetCounts(cat.name);
            const isNonIT = cat.group === 'Non-IT';

            return (
              <div 
                key={cat.id}
                onClick={() => {
                  setSelectedCategoryModal(cat);
                  setModalSearchTerm('');
                  setModalStatusFilter('All');
                }}
                className="bg-white border border-slate-200 hover:border-blue-300 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all relative flex flex-col justify-between group cursor-pointer"
              >
                <div>
                  {/* Top Bar with Icon & Actions */}
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className={`p-3.5 border rounded-2xl shrink-0 group-hover:scale-105 transition-all ${
                      isNonIT 
                        ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                        : 'bg-blue-50 text-blue-600 border-blue-100'
                    }`}>
                      <IconComponent className="h-6 w-6" />
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full border ${
                        isNonIT 
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200/60' 
                          : cat.scope === 'Organization'
                          ? 'bg-purple-50 text-purple-700 border-purple-200/60'
                          : 'bg-blue-50 text-blue-700 border-blue-200/60'
                      }`}>
                        {isNonIT ? 'Non-IT Asset' : cat.scope === 'Organization' ? 'Organization IT Asset' : 'Employee IT Asset'}
                      </span>

                      <div className="flex items-center gap-1 opacity-90 group-hover:opacity-100 transition-all">
                        <button
                          onClick={(e) => { e.stopPropagation(); handleOpenEditModal(cat); }}
                          className="p-1.5 hover:bg-slate-100 text-slate-400 hover:text-blue-600 rounded-xl transition-all cursor-pointer"
                          title="Edit Category Name & Icon"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); setDeletingCategoryId(cat.id); }}
                          className="p-1.5 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-xl transition-all cursor-pointer"
                          title="Delete Category"
                        >
                          <Trash className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Title, Quantity & Description */}
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <h3 className="font-extrabold text-slate-800 text-base truncate">{cat.name}</h3>
                    <span className="px-2.5 py-1 bg-slate-100 text-slate-700 font-extrabold text-[11px] rounded-full border border-slate-200 shrink-0">
                      Qty: {counts.total} items
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed font-medium line-clamp-2 min-h-[2.5rem]">
                    {cat.description || `${cat.group || 'IT'} hardware asset category.`}
                  </p>
                </div>

                {/* Counts Footer */}
                <div className="mt-6 pt-4 border-t border-slate-100">
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="bg-slate-50 p-2.5 rounded-2xl border border-slate-100">
                      <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total</span>
                      <span className="font-extrabold text-slate-800 text-sm">{counts.total}</span>
                    </div>
                    <div className="bg-blue-50/60 p-2.5 rounded-2xl border border-blue-100/50">
                      <span className="block text-[10px] font-bold text-blue-500 uppercase tracking-wider">Assigned</span>
                      <span className="font-extrabold text-blue-700 text-sm">{counts.assigned}</span>
                    </div>
                    <div className="bg-emerald-50/60 p-2.5 rounded-2xl border border-emerald-100/50">
                      <span className="block text-[10px] font-bold text-emerald-500 uppercase tracking-wider">Available</span>
                      <span className="font-extrabold text-emerald-700 text-sm">{counts.available}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modal: Add Category */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsAddModalOpen(false)} />
          <div className="relative bg-white border border-slate-200 w-full max-w-md rounded-3xl shadow-2xl p-6 z-10 space-y-5 animate-scale-in">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-slate-800 text-base">Add New Category</h3>
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveAdd} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1.5">Asset Group Type *</label>
                <div className="flex items-center gap-3 bg-slate-50 p-1.5 rounded-xl border border-slate-200">
                  <button
                    type="button"
                    onClick={() => setFormGroup('IT')}
                    className={`flex-1 py-2 rounded-lg font-bold transition-all ${
                      formGroup === 'IT'
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    IT Asset (Laptop, Mouse, etc.)
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormGroup('Non-IT')}
                    className={`flex-1 py-2 rounded-lg font-bold transition-all ${
                      formGroup === 'Non-IT'
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    Non-IT (Chairs, Tables, etc.)
                  </button>
                </div>
              </div>

              {formGroup === 'IT' && (
                <div>
                  <label className="block font-bold text-slate-700 mb-1.5">IT Asset Scope *</label>
                  <select
                    value={formScope}
                    onChange={(e) => setFormScope(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-medium"
                  >
                    <option value="Employee">Employee IT Asset (Assigned to workers e.g. Laptop, Mouse)</option>
                    <option value="Organization">Organization IT Asset (Office infrastructure e.g. Printer, Server, CPU)</option>
                  </select>
                </div>
              )}

              <div>
                <label className="block font-bold text-slate-700 mb-1.5">Category Name *</label>
                <input
                  type="text"
                  required
                  placeholder={formGroup === 'IT' ? "e.g. Tablets, Docking Stations..." : "e.g. Ergonomic Chairs, Conference Tables..."}
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1.5">Description</label>
                <textarea
                  rows={3}
                  placeholder="Brief summary of items in this category..."
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-2">Select Icon</label>
                <div className="grid grid-cols-6 gap-2 max-h-36 overflow-y-auto p-1 border border-slate-200 rounded-xl bg-slate-50">
                  {iconOptions.map((iconKey) => {
                    const IconComp = iconMap[iconKey] || FolderKey;
                    const isSelected = formIcon === iconKey;
                    return (
                      <button
                        key={iconKey}
                        type="button"
                        onClick={() => setFormIcon(iconKey)}
                        className={`p-2.5 rounded-xl flex items-center justify-center transition-all ${
                          isSelected 
                            ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20' 
                            : 'bg-white text-slate-600 hover:bg-slate-200'
                        }`}
                        title={iconKey}
                      >
                        <IconComp className="h-4 w-4" />
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 py-3 border border-slate-200 rounded-xl hover:bg-slate-50 font-bold text-slate-600 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/20 transition-all"
                >
                  Create Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Edit Category */}
      {editingCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setEditingCategory(null)} />
          <div className="relative bg-white border border-slate-200 w-full max-w-md rounded-3xl shadow-2xl p-6 z-10 space-y-5 animate-scale-in">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-slate-800 text-base">Edit Category ({editingCategory.id})</h3>
              <button 
                onClick={() => setEditingCategory(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1.5">Asset Group Type *</label>
                <div className="flex items-center gap-3 bg-slate-50 p-1.5 rounded-xl border border-slate-200">
                  <button
                    type="button"
                    onClick={() => setFormGroup('IT')}
                    className={`flex-1 py-2 rounded-lg font-bold transition-all ${
                      formGroup === 'IT'
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    IT Asset
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormGroup('Non-IT')}
                    className={`flex-1 py-2 rounded-lg font-bold transition-all ${
                      formGroup === 'Non-IT'
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    Non-IT Asset
                  </button>
                </div>
              </div>

              {formGroup === 'IT' && (
                <div>
                  <label className="block font-bold text-slate-700 mb-1.5">IT Asset Scope *</label>
                  <select
                    value={formScope}
                    onChange={(e) => setFormScope(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-medium"
                  >
                    <option value="Employee">Employee IT Asset (Assigned to workers e.g. Laptop, Mouse)</option>
                    <option value="Organization">Organization IT Asset (Office infrastructure e.g. Printer, Server, CPU)</option>
                  </select>
                </div>
              )}

              <div>
                <label className="block font-bold text-slate-700 mb-1.5">Category Name *</label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1.5">Description</label>
                <textarea
                  rows={3}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-2">Select Icon</label>
                <div className="grid grid-cols-6 gap-2 max-h-36 overflow-y-auto p-1 border border-slate-200 rounded-xl bg-slate-50">
                  {iconOptions.map((iconKey) => {
                    const IconComp = iconMap[iconKey] || FolderKey;
                    const isSelected = formIcon === iconKey;
                    return (
                      <button
                        key={iconKey}
                        type="button"
                        onClick={() => setFormIcon(iconKey)}
                        className={`p-2.5 rounded-xl flex items-center justify-center transition-all ${
                          isSelected 
                            ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20' 
                            : 'bg-white text-slate-600 hover:bg-slate-200'
                        }`}
                        title={iconKey}
                      >
                        <IconComp className="h-4 w-4" />
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setEditingCategory(null)}
                  className="flex-1 py-3 border border-slate-200 rounded-xl hover:bg-slate-50 font-bold text-slate-600 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/20 transition-all"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Custom Confirmation for Deletion */}
      {deletingCategoryId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setDeletingCategoryId(null)} />
          <div className="relative bg-white border border-slate-200 w-full max-w-sm rounded-3xl shadow-2xl p-6 z-10 text-center space-y-4 animate-scale-in">
            <div className="p-3 bg-red-50 text-red-600 rounded-full w-fit mx-auto">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-800 text-sm">Delete Category</h3>
              <p className="text-xs text-slate-500 mt-2">
                Are you sure you want to delete this category card? This action will remove the category tile from your management portal.
              </p>
            </div>
            <div className="flex items-center gap-3 pt-2 text-xs">
              <button 
                type="button"
                onClick={() => setDeletingCategoryId(null)}
                className="flex-1 py-2 border border-slate-200 rounded-xl hover:bg-slate-50 font-bold text-slate-500 transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button 
                type="button"
                onClick={handleConfirmDelete}
                className="flex-1 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold transition-all shadow-md shadow-red-500/10 cursor-pointer"
              >
                Delete Category
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Category Assets Drill-down Modal (Assigned in RED, Available in GREEN) */}
      {selectedCategoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setSelectedCategoryModal(null)} />
          <div className="relative bg-white border border-slate-200 w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden p-6 z-10 space-y-5 animate-scale-in max-h-[90vh] flex flex-col">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 shrink-0">
              <div className="flex items-center gap-3">
                <AssetIconBadge type={selectedCategoryModal.name} className="h-10 w-10 rounded-2xl" iconSize="h-5 w-5" />
                <div>
                  <h3 className="font-extrabold text-slate-800 text-lg leading-tight">
                    {selectedCategoryModal.name} Inventory
                  </h3>
                  <p className="text-xs text-slate-400 font-medium">
                    Detailed view of all {selectedCategoryModal.name.toLowerCase()} assets
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedCategoryModal(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-all cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Filter Tabs & Search Bar */}
            {(() => {
              const catAssets = (assets || []).filter(a => 
                a.type.toLowerCase().trim() === selectedCategoryModal.name.toLowerCase().trim() ||
                selectedCategoryModal.name.toLowerCase().trim().includes(a.type.toLowerCase().trim()) ||
                a.type.toLowerCase().trim().includes(selectedCategoryModal.name.toLowerCase().trim())
              );
              const assignedCount = catAssets.filter(a => a.status === 'Assigned').length;
              const availableCount = catAssets.filter(a => a.status === 'Available').length;
              const repairCount = catAssets.filter(a => a.status === 'Under Repair').length;

              const modalFiltered = catAssets.filter(a => {
                const owner = employees.find(e => e.id === a.assignedTo);
                const searchStr = `${a.id} ${a.brand} ${a.model} ${a.serialNumber} ${a.status} ${owner ? owner.name : ''}`.toLowerCase();
                const matchesSearch = searchStr.includes(modalSearchTerm.toLowerCase());
                const matchesStatus = modalStatusFilter === 'All' ? true : a.status === modalStatusFilter;
                return matchesSearch && matchesStatus;
              });

              return (
                <>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 shrink-0">
                    {/* Status Filter Buttons */}
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        onClick={() => setModalStatusFilter('All')}
                        className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                          modalStatusFilter === 'All'
                            ? 'bg-slate-800 text-white shadow-xs'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        All ({catAssets.length})
                      </button>

                      {/* ASSIGNED in RED */}
                      <button
                        onClick={() => setModalStatusFilter('Assigned')}
                        className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all cursor-pointer ${
                          modalStatusFilter === 'Assigned'
                            ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                            : 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
                        }`}
                      >
                        Assigned ({assignedCount})
                      </button>

                      {/* AVAILABLE in GREEN */}
                      <button
                        onClick={() => setModalStatusFilter('Available')}
                        className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all cursor-pointer ${
                          modalStatusFilter === 'Available'
                            ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                            : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                        }`}
                      >
                        Available ({availableCount})
                      </button>

                      {repairCount > 0 && (
                        <button
                          onClick={() => setModalStatusFilter('Under Repair')}
                          className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all cursor-pointer ${
                            modalStatusFilter === 'Under Repair'
                              ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                              : 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
                          }`}
                        >
                          Under Repair ({repairCount})
                        </button>
                      )}
                    </div>

                    {/* Search inside Modal */}
                    <div className="relative w-full sm:w-60">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <Search className="h-3.5 w-3.5" />
                      </span>
                      <input
                        type="text"
                        value={modalSearchTerm}
                        onChange={e => setModalSearchTerm(e.target.value)}
                        placeholder={`Search ${selectedCategoryModal.name.toLowerCase()}s...`}
                        className="w-full pl-8 pr-3 py-1.5 border border-slate-200 rounded-xl text-xs bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                      />
                    </div>
                  </div>

                  {/* Modal Table Container */}
                  <div className="overflow-y-auto flex-1 border border-slate-200/80 rounded-2xl">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead className="sticky top-0 bg-slate-50 z-10 border-b border-slate-200 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                        <tr>
                          <th className="py-3 px-4">Asset ID</th>
                          <th className="py-3 px-4">Brand & Model</th>
                          <th className="py-3 px-4">Serial Number</th>
                          <th className="py-3 px-4">Status</th>
                          <th className="py-3 px-4">Assigned To</th>
                          <th className="py-3 px-4">Purchase Date</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-slate-700 bg-white">
                        {modalFiltered.length === 0 ? (
                          <tr>
                            <td colSpan={6} className="py-10 text-center text-slate-400 font-semibold">
                              No matching {selectedCategoryModal.name.toLowerCase()} assets found.
                            </td>
                          </tr>
                        ) : (
                          modalFiltered.map(asset => {
                            const owner = employees.find(e => e.id === asset.assignedTo);
                            const isAssigned = asset.status === 'Assigned';
                            const isAvailable = asset.status === 'Available';

                            return (
                              <tr 
                                key={asset.id} 
                                className={`transition-all ${
                                  isAssigned 
                                    ? 'bg-rose-50/20 hover:bg-rose-50/40' 
                                    : isAvailable 
                                    ? 'bg-emerald-50/20 hover:bg-emerald-50/40' 
                                    : 'hover:bg-slate-50'
                                }`}
                              >
                                <td className="py-3 px-4 font-extrabold text-blue-600">
                                  <div className="flex items-center gap-2">
                                    <AssetIconBadge type={asset.type} className="h-6 w-6 rounded-md" iconSize="h-3.5 w-3.5" />
                                    <span>{asset.id}</span>
                                  </div>
                                </td>
                                <td className="py-3 px-4 font-bold text-slate-800">{asset.brand} {asset.model}</td>
                                <td className="py-3 px-4 font-mono text-slate-600 text-[11px]">{asset.serialNumber}</td>
                                
                                {/* Status badge: ASSIGNED in RED, AVAILABLE in GREEN */}
                                <td className="py-3 px-4">
                                  {isAssigned ? (
                                    <span className="px-2.5 py-1 rounded-full text-[9px] font-extrabold uppercase bg-rose-50 text-rose-600 border border-rose-200/80 shadow-2xs inline-block">
                                      Assigned
                                    </span>
                                  ) : isAvailable ? (
                                    <span className="px-2.5 py-1 rounded-full text-[9px] font-extrabold uppercase bg-emerald-50 text-emerald-600 border border-emerald-200/80 shadow-2xs inline-block">
                                      Available
                                    </span>
                                  ) : asset.status === 'Under Repair' ? (
                                    <span className="px-2.5 py-1 rounded-full text-[9px] font-extrabold uppercase bg-amber-50 text-amber-600 border border-amber-200/80 shadow-2xs inline-block">
                                      Under Repair
                                    </span>
                                  ) : (
                                    <span className="px-2.5 py-1 rounded-full text-[9px] font-extrabold uppercase bg-slate-100 text-slate-600 border border-slate-200 inline-block">
                                      {asset.status}
                                    </span>
                                  )}
                                </td>

                                <td className="py-3 px-4">
                                  {owner ? (
                                    <div className="flex items-center gap-1.5">
                                      <Avatar name={owner.name} className="h-5 w-5 rounded-full" textSize="text-[7px]" />
                                      <span className="font-semibold text-slate-800">{owner.name}</span>
                                    </div>
                                  ) : (
                                    <span className="text-slate-400 font-medium italic">Unassigned</span>
                                  )}
                                </td>
                                <td className="py-3 px-4 text-slate-500 font-semibold text-[11px]">{asset.purchaseDate || '10 May 2024'}</td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
};

export default Categories;
