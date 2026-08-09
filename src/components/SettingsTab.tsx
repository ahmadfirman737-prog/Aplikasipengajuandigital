import React, { useState } from 'react';
import { AppSettings } from '../types';
import { Settings as SettingsIcon, Upload, GraduationCap, Save } from 'lucide-react';

interface SettingsTabProps {
  schoolSettings: AppSettings;
  onSaveSettings: (newSettings: AppSettings) => void;
  showToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const SettingsTab: React.FC<SettingsTabProps> = ({
  schoolSettings,
  onSaveSettings,
  showToast,
}) => {
  const [nama, setNama] = useState(schoolSettings.nama);
  const [alamat, setAlamat] = useState(schoolSettings.alamat);
  const [logoBase64, setLogoBase64] = useState(schoolSettings.logo);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setLogoBase64(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: AppSettings = {
      nama: nama.trim(),
      alamat: alamat.trim(),
      logo: logoBase64,
      isCustomLogo: !!logoBase64,
    };

    onSaveSettings(updated);
    showToast('Pengaturan sekolah berhasil diperbarui!', 'success');
  };

  return (
    <div className="bg-white rounded-2xl shadow-xs border border-gray-100 p-6 sm:p-8 max-w-2xl mx-auto space-y-6">
      <div className="border-b border-gray-100 pb-4">
        <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
          <SettingsIcon className="w-5 h-5 text-blue-600" />
          Pengaturan Identitas Sekolah
        </h2>
        <p className="text-xs text-gray-400 mt-0.5">
          Kelola nama lembaga, logo resmi, dan alamat lengkap untuk kop surat & cetakan laporan.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Logo File */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-gray-700">Logo Resmi Sekolah</label>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-blue-50 rounded-2xl border border-blue-100 flex items-center justify-center overflow-hidden flex-shrink-0 relative">
              {logoBase64 ? (
                <img src={logoBase64} alt="Preview Logo" className="w-full h-full object-contain p-1" />
              ) : (
                <GraduationCap className="w-8 h-8 text-blue-600" />
              )}
            </div>

            <label className="cursor-pointer px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 hover:bg-gray-100 transition-colors flex items-center gap-2">
              <Upload className="w-4 h-4 text-blue-600" />
              <span>Ganti Logo Sekolah...</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Nama Sekolah */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-gray-700">Nama Sekolah / Lembaga</label>
          <input
            type="text"
            required
            value={nama}
            onChange={(e) => setNama(e.target.value)}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-600"
          />
        </div>

        {/* Alamat Sekolah */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-gray-700">Alamat Lengkap</label>
          <textarea
            rows={3}
            required
            value={alamat}
            onChange={(e) => setAlamat(e.target.value)}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-600"
          />
        </div>

        <button
          type="submit"
          className="w-full py-3.5 bg-blue-600 text-white font-semibold rounded-xl text-xs hover:bg-blue-700 shadow-md shadow-blue-200 transition-all flex items-center justify-center gap-2"
        >
          <Save className="w-4 h-4" />
          <span>Simpan Perubahan Pengaturan</span>
        </button>
      </form>
    </div>
  );
};
