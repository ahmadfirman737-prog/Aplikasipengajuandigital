import React, { useState } from 'react';
import { PengajuanItem, AppSettings } from '../types';
import { FileSpreadsheet, FileText, CheckSquare, Square } from 'lucide-react';
import { exportToExcel, exportToPDF } from '../utils/exportUtils';
import { formatRupiah, formatDateID, getStatusBadgeStyle } from '../utils/formatters';

interface LaporanTabProps {
  pengajuanList: PengajuanItem[];
  schoolSettings: AppSettings;
  showToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const LaporanTab: React.FC<LaporanTabProps> = ({
  pengajuanList,
  schoolSettings,
  showToast,
}) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(pengajuanList.map((x) => x.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleToggleRow = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((x) => x !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const getSelectedItems = (): PengajuanItem[] | null => {
    if (selectedIds.length === 0) {
      showToast('Pilih minimal 1 data yang ingin diexport (Ceklis pada tabel)!', 'error');
      return null;
    }
    return pengajuanList.filter((x) => selectedIds.includes(x.id));
  };

  const handleExportPDF = () => {
    const items = getSelectedItems();
    if (items) {
      exportToPDF(items, schoolSettings);
      showToast('File PDF berhasil diunduh!', 'success');
    }
  };

  const handleExportExcel = () => {
    const items = getSelectedItems();
    if (items) {
      exportToExcel(items, schoolSettings);
      showToast('File Excel berhasil diunduh!', 'success');
    }
  };

  const isAllSelected =
    pengajuanList.length > 0 && selectedIds.length === pengajuanList.length;

  return (
    <div className="bg-white rounded-2xl shadow-xs border border-gray-100 p-6 space-y-6">
      {/* Top Header & Export Action Buttons */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-100 pb-4">
        <div>
          <h2 className="font-bold text-gray-800 text-base">Laporan Hasil Pengajuan Barang</h2>
          <p className="text-xs text-gray-400 mt-0.5">
            Pilih baris yang ingin dicetak dan diekspor ke format dokumen resmi
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleExportPDF}
            className="px-4 py-2 bg-rose-600 text-white rounded-xl text-xs font-semibold hover:bg-rose-700 shadow-xs flex items-center gap-2 transition-all"
          >
            <FileText className="w-4 h-4" />
            <span>Export PDF</span>
          </button>
          <button
            onClick={handleExportExcel}
            className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-semibold hover:bg-emerald-700 shadow-xs flex items-center gap-2 transition-all"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Export Excel</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-100 text-xs text-gray-400 uppercase font-semibold">
              <th className="py-3 px-4 w-10">
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded cursor-pointer"
                />
              </th>
              <th className="py-3 px-4">No</th>
              <th className="py-3 px-4">Tanggal</th>
              <th className="py-3 px-4">Pengaju</th>
              <th className="py-3 px-4">Nama Barang</th>
              <th className="py-3 px-4">Jumlah</th>
              <th className="py-3 px-4">Harga Satuan</th>
              <th className="py-3 px-4">Total Harga</th>
              <th className="py-3 px-4">Keterangan</th>
              <th className="py-3 px-4">Status RTL</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {pengajuanList.length === 0 ? (
              <tr>
                <td colSpan={10} className="py-8 text-center text-gray-400 text-xs">
                  Belum ada data pengajuan untuk laporan.
                </td>
              </tr>
            ) : (
              pengajuanList.map((item, index) => {
                const isSelected = selectedIds.includes(item.id);
                const totalHarga = (item.qty || 0) * (item.harga || 0);

                return (
                  <tr
                    key={item.id}
                    className={`border-b border-gray-50 transition-colors ${
                      isSelected ? 'bg-blue-50/50' : 'hover:bg-gray-50/80'
                    }`}
                  >
                    <td className="py-3 px-4">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleToggleRow(item.id)}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded cursor-pointer"
                      />
                    </td>
                    <td className="py-3 px-4 text-gray-500 text-xs">{index + 1}</td>
                    <td className="py-3 px-4 text-gray-500 text-xs whitespace-nowrap">
                      {formatDateID(item.tgl)}
                    </td>
                    <td className="py-3 px-4 font-medium text-gray-800 text-xs">
                      {item.pengaju}
                    </td>
                    <td className="py-3 px-4 font-semibold text-gray-900 text-xs">
                      {item.barang}
                    </td>
                    <td className="py-3 px-4 text-gray-800 text-xs whitespace-nowrap">
                      {item.qty} {item.satuan}
                    </td>
                    <td className="py-3 px-4 text-gray-800 text-xs whitespace-nowrap">
                      {formatRupiah(item.harga)}
                    </td>
                    <td className="py-3 px-4 font-bold text-gray-900 text-xs whitespace-nowrap">
                      {formatRupiah(totalHarga)}
                    </td>
                    <td className="py-3 px-4 text-gray-600 text-xs max-w-xs truncate">
                      {item.ket}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusBadgeStyle(
                          item.status
                        )}`}
                      >
                        {item.status}
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
