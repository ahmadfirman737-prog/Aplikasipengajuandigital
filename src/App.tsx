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
  pushCloudData,
  mergePengajuanLists
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

  const handleCloudSync = async (showToastMsg = true, isBackground = false) => {
    if (!isBackground) setIsSyncing(true);
    const cloud = await fetchCloudData();
    if (cloud) {
      if (cloud.pengajuanList) {
        setPengajuanList((prev) => {
          const merged = mergePengajuanLists(prev, cloud.pengajuanList!);
          saveLocalPengajuan(merged);
          return merged;
        });
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
    if (!isBackground) setIsSyncing(false);
  };

  // Initial cloud fetch on mount & set up real-time sync loop
  useEffect(() => {
    handleCloudSync(false, true);

    // Poll cloud every 2 seconds for automatic real-time sync across devices
    const intervalId = setInterval(() => {
      handleCloudSync(false, true);
    }, 2000);

    // Listen to BroadcastChannel for instant same-browser cross-tab sync
    let bc: BroadcastChannel | null = null;
    if (typeof BroadcastChannel !== 'undefined') {
      try {
        bc = new BroadcastChannel('kusuma_realtime_channel');
        bc.onmessage = (event) => {
          if (event.data?.type === 'SYNC_DATA') {
            if (event.data.pengajuanList) {
              setPengajuanList((prev) => {
                const merged = mergePengajuanLists(prev, event.data.pengajuanList);
                saveLocalPengajuan(merged);
                return merged;
              });
            }
            if (event.data.loginHistory) {
              setLoginHistory(event.data.loginHistory);
              saveLocalLoginHistory(event.data.loginHistory);
            }
          }
        };
      } catch (e) {
        console.warn('BroadcastChannel error in App', e);
      }
    }

    // Sync when tab regains focus
    const handleFocus = () => {
      handleCloudSync(false, true);
    };
    window.addEventListener('focus', handleFocus);

    return () => {
      clearInterval(intervalId);
      if (bc) bc.close();
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

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

  const handleSubmitPengajuan = async (newItem: PengajuanItem) => {
    const cloud = await fetchCloudData();
    const cloudList = (cloud && cloud.pengajuanList) ? cloud.pengajuanList : [];

    const updatedList = mergePengajuanLists([newItem, ...pengajuanList], cloudList);
    setPengajuanList(updatedList);
    await pushCloudData(updatedList, loginHistory);

    showToast('Pengajuan berhasil dikirim & tersinkron ke semua perangkat!', 'success');
    setActiveTab('status');
  };

  const handleUpdateStatusRTL = async (id: string, newStatus: StatusRTL) => {
    const cloud = await fetchCloudData();
    const cloudList = (cloud && cloud.pengajuanList) ? cloud.pengajuanList : [];

    const baseList = mergePengajuanLists(pengajuanList, cloudList);
    const updatedList = baseList.map((item) =>
      item.id === id ? { ...item, status: newStatus } : item
    );

    setPengajuanList(updatedList);
    await pushCloudData(updatedList, loginHistory);
    showToast(`Status pengajuan ${id} diperbarui: ${newStatus}`, 'success');
  };

  const handleDeletePengajuan = async (id: string) => {
    const cloud = await fetchCloudData();
    const cloudList = (cloud && cloud.pengajuanList) ? cloud.pengajuanList : [];

    const baseList = mergePengajuanLists(pengajuanList, cloudList);
    const updatedList = baseList.filter((item) => item.id !== id);

    setPengajuanList(updatedList);
    await pushCloudData(updatedList, loginHistory);
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
