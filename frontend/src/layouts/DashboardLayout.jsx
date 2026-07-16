import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import QRScannerModal from '../components/QRScannerModal';

const DashboardLayout = () => {
  const [isScanOpen, setIsScanOpen] = useState(false);

  const handleScanSuccess = (assetId) => {
    console.log("QR Code read asset ID:", assetId);
    // You can also add state updates here if needed
  };

  return (
    <div className="flex bg-[#f8fafc] min-h-screen font-sans">
      {/* Left Sidebar */}
      <Sidebar onScanClick={() => setIsScanOpen(true)} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Top Header */}
        <Header />

        {/* Inner Scrollable Page Views */}
        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-7xl mx-auto space-y-8">
            <Outlet />
          </div>
          
          {/* Footer matches mockup */}
          <footer className="max-w-7xl mx-auto mt-12 pb-8 text-center text-xs text-slate-400 font-medium">
            &copy; 2026 IT Asset Management System. All rights reserved.
          </footer>
        </main>
      </div>

      {/* Scanning Dialog Overlay */}
      <QRScannerModal 
        isOpen={isScanOpen} 
        onClose={() => setIsScanOpen(false)} 
        onScanSuccess={handleScanSuccess}
      />
    </div>
  );
};

export default DashboardLayout;
