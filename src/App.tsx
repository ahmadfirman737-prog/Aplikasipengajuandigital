import React, { useState, useEffect } from 'react';
import {
  UserAccount,
  PengajuanItem,
  AppSettings,
  LoginRecord,
  ActiveTab,
  StatusRTL
} from './types';
import {
  loadLocalSettings,
  saveLocalSettings,
  loadLocalUsers,
  saveLocalUsers,
  loadLocalPengajuan,
  saveLocalPengajuan,
  loadLocalLoginHistory,
  saveLocalLoginHistory,
  fetchCloudData,
  pushCloudData
} from './utils/storage';

import { LoginPage } from './components/LoginPage';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { DashboardTab } from './components/DashboardTab';
import { PengajuanFormTab } from './components/PengajuanFormTab';
import { StatusTableTab } from './components/StatusTableTab';
import { LaporanTab } from './components/LaporanTab';
import { UserManagementTab } from './components/UserManagementTab';
import { SettingsTab } from './components/SettingsTab';
import { Toast } from './components/Toast';
import { ImageModal } from './components/ImageModal';

export default function App() {
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);
  const [schoolSettings, setSchoolSettings] = useState<AppSettings>(loadLocalSettings);
  const [users, setUsers] = useState<UserAccount[]>(loadLocalUsers);
  const [pengajuanList, setPengajuanList] = useState<PengajuanItem[]>(loadLocalPengajuan);
  const [loginHistory, setLoginHistory] = useState<LoginRecord[]>(loadLocalLoginHistory);

  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  const [toast, setToast] = useState<{ message: string | null; type?: 'success' | 'error' | 'info' }>({
    message: null,
    type: 'success',
  });

  const [zoomImage, setZoomImage] = useState<{ src: string; title: string } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast({ message: null });
    }, 3500);
  };

  // Initial cloud fetch on mount
  useEffect(() => {
    handleCloudSync(false);
  }, []);

  const handleCloudSync = async (showToastMsg = true) => {
    setIsSyncing(true);
    const cloud = await fetchCloudData();
    if (cloud) {
      if (cloud.pengajuanList && cloud.pengajuanList.length > 0) {
        setPengajuanList(cloud.pengajuanList);
        saveLocalPengajuan(cloud.pengajuanList);
      }
      if (cloud.loginHistory && cloud.loginHistory.length > 0) {
        setLoginHistory(cloud.loginHistory);
        saveLocalLoginHistory(cloud.loginHistory);
      }
      if (showToastMsg) {
        showToast('Data berhasil disinkronkan dari Cloud!', 'success');
      }
    } else {
      if (showToastMsg) {
        showToast('Mode offline aktif (menggunakan data tersimpan lokal)', 'info');
      }
    }
    setIsSyncing(false);
  };

  const handleLoginSuccess = (user: UserAccount) => {
    setCurrentUser(user);

    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 19);
    const newRecord: LoginRecord = {
      id: `lh-${Date.now()}`,
      user: user.username,
      role: user.role,
      waktu: nowStr,
      status: 'Berhasil',
    };

    const updatedHistory = [newRecord, ...loginHistory];
    setLoginHistory(updatedHistory);
    pushCloudData(pengajuanList, updatedHistory);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    showToast('Berhasil keluar aplikasi', 'info');
  };

  const handleSubmitPengajuan = (newItem: PengajuanItem) => {
    const updatedList = [newItem, ...pengajuanList];
    setPengajuanList(updatedList);
    pushCloudData(updatedList, loginHistory);

    showToast('Pengajuan berhasil dikirim & tersinkron ke semua perangkat!', 'success');
    setActiveTab('status');
  };

  const handleUpdateStatusRTL = (id: string, newStatus: StatusRTL) => {
    const updatedList = pengajuanList.map((item) =>
      item.id === id ? { ...item, status: newStatus } : item
    );
    setPengajuanList(updatedList);
    pushCloudData(updatedList, loginHistory);
    showToast(`Status pengajuan ${id} diperbarui: ${newStatus}`, 'success');
  };

  const handleDeletePengajuan = (id: string) => {
    const updatedList = pengajuanList.filter((item) => item.id !== id);
    setPengajuanList(updatedList);
    pushCloudData(updatedList, loginHistory);
    showToast(`Pengajuan ${id} berhasil dihapus`, 'success');
  };

  const handleAddUser = (newUser: UserAccount) => {
    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    saveLocalUsers(updatedUsers);
  };

  const handleUpdateUser = (updatedUser: UserAccount) => {
    const updatedUsers = users.map((u) => (u.id === updatedUser.id ? updatedUser : u));
    setUsers(updatedUsers);
    saveLocalUsers(updatedUsers);
  };

  const handleDeleteUser = (userId: number) => {
    const updatedUsers = users.filter((u) => u.id !== userId);
    setUsers(updatedUsers);
    saveLocalUsers(updatedUsers);
  };

  const handleSaveSettings = (newSettings: AppSettings) => {
    setSchoolSettings(newSettings);
    saveLocalSettings(newSettings);
  };

  if (!currentUser) {
    return (
      <>
        <LoginPage
          schoolSettings={schoolSettings}
          users={users}
          onLoginSuccess={handleLoginSuccess}
          showToast={showToast}
        />
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ message: null })}
        />
      </>
    );
  }

  return (
    <div className="h-screen w-full flex overflow-hidden bg-slate-50 font-sans antialiased">
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        role={currentUser.role}
        schoolSettings={schoolSettings}
        onSyncCloud={() => handleCloudSync(true)}
        onLogout={handleLogout}
        isMobileOpen={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
        isSyncing={isSyncing}
      />

      {/* Main Content Viewport */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <Header
          currentUser={currentUser}
          activeTab={activeTab}
          onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        />

        <main className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6">
          {activeTab === 'dashboard' && (
            <DashboardTab
              pengajuanList={pengajuanList}
              loginHistory={loginHistory}
              currentUser={currentUser}
            />
          )}

          {activeTab === 'pengajuan' && (
            <PengajuanFormTab
              currentUser={currentUser}
              onSubmitPengajuan={handleSubmitPengajuan}
            />
          )}

          {activeTab === 'status' && (
            <StatusTableTab
              pengajuanList={pengajuanList}
              currentUser={currentUser}
              onUpdateStatus={handleUpdateStatusRTL}
              onDeleteRequest={handleDeletePengajuan}
              onOpenImageModal={(src, title) => setZoomImage({ src, title })}
            />
          )}

          {activeTab === 'laporan' && currentUser.role === 'Admin' && (
            <LaporanTab
              pengajuanList={pengajuanList}
              schoolSettings={schoolSettings}
              showToast={showToast}
            />
          )}

          {activeTab === 'users' && currentUser.role === 'Admin' && (
            <UserManagementTab
              users={users}
              onAddUser={handleAddUser}
              onUpdateUser={handleUpdateUser}
              onDeleteUser={handleDeleteUser}
              showToast={showToast}
            />
          )}

          {activeTab === 'peraturan' && currentUser.role === 'Admin' && (
            <SettingsTab
              schoolSettings={schoolSettings}
              onSaveSettings={handleSaveSettings}
              showToast={showToast}
            />
          )}
        </main>
      </div>

      {/* Image Modal for Item Photos */}
      <ImageModal
        src={zoomImage?.src || null}
        title={zoomImage?.title}
        onClose={() => setZoomImage(null)}
      />

      {/* Notification Toast */}
      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: null })}
      />
    </div>
  );
}
