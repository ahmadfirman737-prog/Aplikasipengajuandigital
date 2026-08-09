import React, { useState } from 'react';
import { UserAccount, AppSettings } from '../types';
import { GraduationCap, User, Lock, ArrowRight, ShieldCheck } from 'lucide-react';

interface LoginPageProps {
  schoolSettings: AppSettings;
  users: UserAccount[];
  onLoginSuccess: (user: UserAccount) => void;
  showToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  schoolSettings,
  users,
  onLoginSuccess,
  showToast
}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanU = username.trim();
    const cleanP = password.trim();

    const found = users.find(x => x.username.toLowerCase() === cleanU.toLowerCase() && x.password === cleanP);
    if (found) {
      onLoginSuccess(found);
      showToast(`Selamat datang kembali, ${found.nama}!`, 'success');
    } else {
      showToast('Username atau Password salah!', 'error');
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 p-4 sm:p-8 relative z-10">
      <div className="max-w-5xl w-full bg-white rounded-3xl shadow-2xl flex flex-col md:flex-row overflow-hidden border border-gray-100">
        
        {/* Left Branding Panel */}
        <div className="md:w-1/2 bg-gradient-to-br from-blue-900 via-blue-700 to-sky-600 text-white flex flex-col justify-between p-8 sm:p-12 relative overflow-hidden hidden md:flex">
          <div className="absolute top-[-50px] left-[-50px] w-48 h-48 bg-white opacity-10 rounded-full blur-2xl pointer-events-none"></div>
          <div className="absolute bottom-[-50px] right-[-50px] w-64 h-64 bg-blue-300 opacity-20 rounded-full blur-3xl pointer-events-none"></div>

          <div className="z-10 flex flex-col items-start space-y-6 w-full my-auto">
            <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-md border border-white/30 flex items-center justify-center h-20 w-20 overflow-hidden relative shadow-inner">
              {schoolSettings.isCustomLogo && schoolSettings.logo ? (
                <img src={schoolSettings.logo} alt="Logo Sekolah" className="w-full h-full object-contain p-1" />
              ) : (
                <GraduationCap className="w-12 h-12 text-white drop-shadow-md" />
              )}
            </div>

            <div className="space-y-2 w-full text-left">
              <h1 className="text-2xl sm:text-3xl font-extrabold leading-tight text-white uppercase tracking-tight">
                Aplikasi Pengajuan Barang Digital
              </h1>
              <h2 className="text-lg font-bold text-blue-100 uppercase tracking-wide">
                {schoolSettings.nama}
              </h2>
              <p className="text-xs text-blue-100/80 leading-relaxed pt-2 border-t border-white/10 mt-3">
                {schoolSettings.alamat}
              </p>
            </div>
          </div>

          <div className="z-10 pt-6 text-xs text-blue-200/80 font-medium">
            &copy; 2026 Copyright Ahmad Firmansyah &bull; SMP Kusuma Bangsa
          </div>
        </div>

        {/* Right Form Panel */}
        <div className="md:w-1/2 w-full flex flex-col justify-between p-8 sm:p-12 bg-white">
          <div className="flex justify-between items-center mb-6">
            <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" /> Akses Sistem
            </span>
            <span className="text-xs text-gray-400 md:hidden font-semibold truncate max-w-[140px]">
              {schoolSettings.nama}
            </span>
          </div>

          <div className="space-y-6 my-auto">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Selamat Datang</h2>
              <p className="text-xs text-gray-500 mt-1">Silakan masuk menggunakan akun terdaftar sekolah Anda.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-700">Username</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400">
                    <User className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Masukkan username"
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-600 text-sm transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-700">Password</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400">
                    <Lock className="w-4 h-4" />
                  </span>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Masukkan password"
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-600 text-sm transition-colors"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all text-sm flex items-center justify-center gap-2"
              >
                <span>Masuk Aplikasi</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>

          <div className="text-center pt-6 text-xs text-gray-400 font-medium md:hidden">
            &copy; 2026 Copyright Ahmad Firmansyah
          </div>
        </div>

      </div>
    </div>
  );
};
