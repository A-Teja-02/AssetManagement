import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AssetProvider } from './hooks/useAssetManager';
import DashboardLayout from './layouts/DashboardLayout';
import Dashboard from './pages/Dashboard';
import Employees from './pages/Employees';
import Assets from './pages/Assets';
import AssignAsset from './pages/AssignAsset';
import ReturnAsset from './pages/ReturnAsset';
import Repairs from './pages/Repairs';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import ActivityLog from './pages/ActivityLog';

function App() {
  return (
    <AssetProvider>
      <Router>
        <Routes>
          <Route path="/" element={<DashboardLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="employees" element={<Employees />} />
            <Route path="assets" element={<Assets />} />
            <Route path="assign-assets" element={<AssignAsset />} />
            <Route path="return-assets" element={<ReturnAsset />} />
            <Route path="repairs" element={<Repairs />} />
            <Route path="reports" element={<Reports />} />
            <Route path="settings" element={<Settings />} />
            <Route path="activity-log" element={<ActivityLog />} />
          </Route>
        </Routes>
      </Router>
    </AssetProvider>
  );
}

export default App;
