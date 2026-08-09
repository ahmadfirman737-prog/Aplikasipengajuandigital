import React from 'react';
import { ActiveTab, AppSettings, UserRole } from '../types';
import {
  PieChart,
  FilePlus,
  ListTodo,
  FileSpreadsheet,
  Users,
  Settings,
  RefreshCw,
  LogOut,
  GraduationCap,
  X
} from 'lucide-react';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  role: UserRole;
  schoolSettings: AppSettings;
  onSyncCloud: () => void;
  onLogout: () => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
  isSyncing?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  role,
  schoolSettings,
  onSyncCloud,
  onLogout,
  isMobileOpen,
  onCloseMobile,
  isSyncing = false
}) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: PieChart, roles: ['Admin', 'User'] },
    { id: 'pengajuan', label: 'Pengajuan Baru', icon: FilePlus, roles: ['Admin', 'User'] },
    { id: 'status', label: 'Status & RTL', icon: ListTodo, roles: ['Admin', 'User'] },
    { id: 'laporan', label: 'Laporan', icon: FileSpreadsheet, roles: ['Admin'] },
    { id: 'users', label: 'Manajemen User', icon: Users, roles: ['Admin'] },
    { id: 'peraturan', label: 'Pengaturan Sekolah', icon: Settings, roles: ['Admin'] },
  ];

  const filteredItems = menuItems.filter(item => item.roles.includes(role));

  const renderNavContent = () => (
    <div className="space-y-1.5 flex-1 px-4 py-6">
      {filteredItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => {
              setActiveTab(item.id as ActiveTab);
              onCloseMobile();
            }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
              isActive
                ? 'bg-blue-600 text-white shadow-md shadow-blue-200'
                : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600'
            }`}
          >
            <Icon className="w-5 h-5 flex-shrink-0" />
            <span className="truncate">{item.label}</span>
          </button>
        );
      })}
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="w-72 bg-white border-r border-gray-100 flex flex-col shadow-sm hidden md:flex z-20 h-screen flex-shrink-0">
        <div className="p-6 flex items-center gap-4 border-b border-gray-50">
          <div className="bg-blue-50 p-1.5 rounded-xl text-blue-600 flex items-center justify-center w-12 h-12 overflow-hidden flex-shrink-0 relative border border-blue-100">
            {schoolSettings.isCustomLogo && schoolSettings.logo ? (
              <img src={schoolSettings.logo} alt="Logo" className="w-full h-full object-contain" />
            ) : (
              <GraduationCap className="w-7 h-7 text-blue-600" />
            )}
          </div>
          <div className="overflow-hidden">
            <h2 className="font-bold text-gray-800 text-sm leading-tight truncate" title={schoolSettings.nama}>
              {schoolSettings.nama}
            </h2>
            <p className="text-xs text-blue-600 font-semibold mt-0.5">Sistem Pengajuan</p>
          </div>
        </div>

        {renderNavContent()}

        <div className="p-4 border-t border-gray-50 space-y-2">
          <button
            onClick={onSyncCloud}
            disabled={isSyncing}
            className="w-full py-2.5 px-3 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors disabled:opacity-60"
            title="Sinkronisasi Data Cloud"
          >
            <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'Menyinkronkan...' : 'Sinkron Data Cloud'}</span>
          </button>
          <button
            onClick={onLogout}
            className="w-full py-2.5 px-3 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors flex items-center justify-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            <span>Keluar Aplikasi</span>
          </button>
        </div>
      </aside>

      {/* Mobile Drawer */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden bg-black/40 backdrop-blur-xs" onClick={onCloseMobile}>
          <aside
            className="w-72 bg-white h-full shadow-2xl flex flex-col transform transition-transform duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 flex justify-between items-center border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="bg-blue-50 p-1 rounded-xl text-blue-600 flex items-center justify-center w-10 h-10 overflow-hidden flex-shrink-0">
                  {schoolSettings.isCustomLogo && schoolSettings.logo ? (
                    <img src={schoolSettings.logo} alt="Logo" className="w-full h-full object-contain" />
                  ) : (
                    <GraduationCap className="w-6 h-6 text-blue-600" />
                  )}
                </div>
                <h2 className="font-bold text-gray-800 text-xs truncate max-w-[150px]">
                  {schoolSettings.nama}
                </h2>
              </div>
              <button onClick={onCloseMobile} className="text-gray-400 p-2 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {renderNavContent()}

            <div className="p-4 border-t border-gray-100 space-y-2">
              <button
                onClick={onSyncCloud}
                disabled={isSyncing}
                className="w-full py-2.5 bg-blue-50 text-blue-600 rounded-xl text-xs font-semibold flex items-center justify-center gap-2"
              >
                <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
                <span>Sinkron Data Cloud</span>
              </button>
              <button
                onClick={onLogout}
                className="w-full py-2.5 bg-rose-50 text-rose-600 rounded-xl text-xs font-semibold flex items-center justify-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Keluar Aplikasi</span>
              </button>
            </div>
          </aside>
        </div>
      )}
    </>
  );
};
