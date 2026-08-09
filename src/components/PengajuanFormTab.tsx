import React, { useState } from 'react';
import { PengajuanItem, UserAccount } from '../types';
import { Send, Upload, Package, Info, Image as ImageIcon } from 'lucide-react';
import { formatRupiah } from '../utils/formatters';

interface PengajuanFormTabProps {
  currentUser: UserAccount;
  onSubmitPengajuan: (newObj: PengajuanItem) => void;
}

export const PengajuanFormTab: React.FC<PengajuanFormTabProps> = ({
  currentUser,
  onSubmitPengajuan,
}) => {
  const [barang, setBarang] = useState('');
  const [spesifikasi, setSpesifikasi] = useState('');
  const [qty, setQty] = useState<number>(1);
  const [satuan, setSatuan] = useState('Unit');
  const [harga, setHarga] = useState<number>(0);
  const [ket, setKet] = useState('');
  const [fotoBase64, setFotoBase64] = useState<string | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setFotoBase64(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const randomSuffix = Math.floor(100 + Math.random() * 900);
    const newId = `REQ-00${randomSuffix}`;
    const dateStr = new Date().toISOString().split('T')[0];

    const newItem: PengajuanItem = {
      id: newId,
      tgl: dateStr,
      pengaju: currentUser.nama,
      barang: barang.trim(),
      spesifikasi: spesifikasi.trim(),
      qty: Number(qty) || 1,
      satuan,
      harga: Number(harga) || 0,
      ket: ket.trim(),
      foto: fotoBase64,
      status: 'Sedang Dalam Antrian',
      catatanAdmin: '-'
    };

    onSubmitPengajuan(newItem);

    // Reset Form
    setBarang('');
    setSpesifikasi('');
    setQty(1);
    setSatuan('Unit');
    setHarga(0);
    setKet('');
    setFotoBase64(null);
  };

  const totalEstimasi = (qty || 0) * (harga || 0);

  return (
    <div className="bg-white rounded-2xl shadow-xs border border-gray-100 p-6 sm:p-8 max-w-3xl mx-auto">
      <div className="border-b border-gray-100 pb-4 mb-6">
        <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
          <Package className="w-5 h-5 text-blue-600" />
          Form Pengajuan Barang Baru
        </h2>
        <p className="text-xs text-gray-400 mt-0.5">
          Isi detail barang yang ingin diajukan. Data akan langsung tersinkron ke semua perangkat lain secara instan.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Nama Barang */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-gray-700">Nama Barang yang Diajukan</label>
          <input
            type="text"
            required
            value={barang}
            onChange={(e) => setBarang(e.target.value)}
            placeholder="Contoh: Laptop Asus / Proyektor Epson"
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-600 text-sm"
          />
        </div>

        {/* Foto & Spesifikasi */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-700">Foto Barang (Opsional)</label>
            <div className="flex items-center gap-2">
              <label className="flex-1 cursor-pointer flex items-center gap-2 px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-600 hover:bg-gray-100 transition-colors">
                <Upload className="w-4 h-4 text-blue-600 flex-shrink-0" />
                <span className="truncate">{fotoBase64 ? "Foto Terpilih" : "Upload Gambar..."}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
              {fotoBase64 && (
                <div className="w-10 h-10 rounded-lg border border-blue-200 overflow-hidden flex-shrink-0">
                  <img src={fotoBase64} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-700">Spesifikasi Detail</label>
            <input
              type="text"
              required
              value={spesifikasi}
              onChange={(e) => setSpesifikasi(e.target.value)}
              placeholder="Contoh: Core i5, RAM 8GB / Lumens 3600"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-600 text-sm"
            />
          </div>
        </div>

        {/* Qty, Satuan, Harga */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-700">Jumlah (Qty)</label>
            <input
              type="number"
              min="1"
              required
              value={qty}
              onChange={(e) => setQty(parseInt(e.target.value) || 1)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-600 text-sm"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-700">Satuan</label>
            <select
              value={satuan}
              onChange={(e) => setSatuan(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-600 text-sm"
            >
              <option value="Unit">Unit</option>
              <option value="Pcs">Pcs</option>
              <option value="Box">Box</option>
              <option value="Rim">Rim</option>
              <option value="Buah">Buah</option>
              <option value="Set">Set</option>
              <option value="Pasang">Pasang</option>
              <option value="Pak">Pak</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-700">Estimasi Harga Satuan (Rp)</label>
            <input
              type="number"
              min="0"
              required
              value={harga || ''}
              onChange={(e) => setHarga(parseFloat(e.target.value) || 0)}
              placeholder="Contoh: 500000"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-600 text-sm"
            />
          </div>
        </div>

        {/* Total Price Card */}
        <div className="bg-blue-50/60 p-4 rounded-xl border border-blue-100 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-800">
            <Info className="w-4 h-4 text-blue-600" />
            <span>Total Estimasi Biaya Pengajuan:</span>
          </div>
          <span className="text-base font-bold text-blue-700">
            {formatRupiah(totalEstimasi)}
          </span>
        </div>

        {/* Keterangan */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-gray-700">Keterangan / Alasan Pengajuan</label>
          <textarea
            rows={3}
            required
            value={ket}
            onChange={(e) => setKet(e.target.value)}
            placeholder="Tuliskan alasan atau keperluan pengajuan (misal: untuk pembelajaran Lab Komputer)..."
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-600 text-sm"
          />
        </div>

        <button
          type="submit"
          className="w-full py-3.5 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 shadow-md shadow-blue-200 transition-all text-sm flex items-center justify-center gap-2"
        >
          <Send className="w-4 h-4" />
          <span>Kirim Pengajuan Tersinkronisasi</span>
        </button>
      </form>
    </div>
  );
};
