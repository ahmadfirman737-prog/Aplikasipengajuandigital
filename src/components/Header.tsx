import React from 'react';
import { UserAccount, ActiveTab } from '../types';
import { Menu, ShieldCheck, User as UserIcon } from 'lucide-react';

interface HeaderProps {
  currentUser: UserAccount;
  activeTab: ActiveTab;
  onToggleMobileMenu: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  activeTab,
  onToggleMobileMenu,
}) => {
  const titles: Record<ActiveTab, { title: string; subtitle: string }> = {
    dashboard: { title: 'Dashboard Utama', subtitle: 'Monitoring Pengajuan Barang & Status Tersinkron' },
    pengajuan: { title: 'Form Pengajuan Baru', subtitle: 'Isi Detail Barang untuk Diajukan ke Sarpras / Sekolah' },
    status: { title: 'Status & Rencana Tindak Lanjut (RTL)', subtitle: 'Daftar Pengajuan dan Pembaruan Status Real-Time' },
    laporan: { title: 'Laporan & Ekspor Data', subtitle: 'Rekapitulasi Pengajuan Barang dalam Format PDF / Excel' },
    users: { title: 'Manajemen Pengguna', subtitle: 'Pengelolaan Akun Guru, Staf, dan Administrator' },
    peraturan: { title: 'Pengaturan Identitas Sekolah', subtitle: 'Pembaruan Nama, Alamat, dan Logo Sekolah' },
  };

  const currentInfo = titles[activeTab] || titles.dashboard;

  return (
    <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-6 sm:px-8 z-10 flex-shrink-0">
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleMobileMenu}
          className="md:hidden text-gray-600 p-2 hover:bg-gray-50 rounded-xl transition-colors"
        >
          <Menu className="w-6 h-6" />
        </button>
        <div>
          <h1 className="font-bold text-gray-900 text-base sm:text-lg">{currentInfo.title}</h1>
          <p className="text-xs text-gray-400 hidden sm:block">{currentInfo.subtitle}</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="text-right hidden sm:block">
          <p className="text-sm font-bold text-gray-800">{currentUser.nama}</p>
          <span
            className={`text-[11px] px-2.5 py-0.5 rounded-full font-semibold inline-flex items-center gap-1 ${
              currentUser.role === 'Admin'
                ? 'bg-blue-50 text-blue-700 border border-blue-200'
                : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
            }`}
          >
            <ShieldCheck className="w-3 h-3" />
            {currentUser.role === 'Admin' ? 'Administrator' : 'Guru / Staf'}
          </span>
        </div>
        <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center font-bold text-sm shadow-xs">
          <UserIcon className="w-5 h-5" />
        </div>
      </div>
    </header>
  );
};
