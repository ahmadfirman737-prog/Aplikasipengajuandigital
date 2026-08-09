import React, { useState } from 'react';
import { PengajuanItem, StatusRTL, UserAccount } from '../types';
import { Search, Image as ImageIcon, Trash2, AlertTriangle, X } from 'lucide-react';
import { formatRupiah, formatDateID, getStatusBadgeStyle } from '../utils/formatters';

interface StatusTableTabProps {
  pengajuanList: PengajuanItem[];
  currentUser: UserAccount;
  onUpdateStatus: (id: string, newStatus: StatusRTL) => void;
  onDeleteRequest: (id: string) => void;
  onOpenImageModal: (src: string, title: string) => void;
}

export const StatusTableTab: React.FC<StatusTableTabProps> = ({
  pengajuanList,
  currentUser,
  onUpdateStatus,
  onDeleteRequest,
  onOpenImageModal,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('SEMUA');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const filteredList = pengajuanList.filter((item) => {
    const matchesSearch =
      item.barang.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.pengaju.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.spesifikasi.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === 'SEMUA' || item.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const confirmDelete = () => {
    if (deletingId) {
      onDeleteRequest(deletingId);
      setDeletingId(null);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xs border border-gray-100 p-6 space-y-6">
      {/* Header & Filter Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-100 pb-4">
        <div>
          <h2 className="font-bold text-gray-800 text-base">Status Pengajuan Barang & Rencana Tindak Lanjut (RTL)</h2>
          <p className="text-xs text-gray-400 mt-0.5">
            Daftar seluruh barang yang diajukan beserta status alur persetujuan
          </p>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari barang / pengaju..."
              className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-blue-600"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full sm:w-auto px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-blue-600"
          >
            <option value="SEMUA">Semua Status</option>
            <option value="Sedang Dalam Antrian">Sedang Dalam Antrian</option>
            <option value="Sedang Dalam Proses">Sedang Dalam Proses</option>
            <option value="Selesai">Selesai</option>
            <option value="Pengajuan Ditolak">Pengajuan Ditolak</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-100 text-xs text-gray-400 uppercase font-semibold">
              <th className="py-3 px-4">ID</th>
              <th className="py-3 px-4">Foto</th>
              <th className="py-3 px-4">Tanggal</th>
              <th className="py-3 px-4">Pengaju</th>
              <th className="py-3 px-4">Nama Barang</th>
              <th className="py-3 px-4">Spesifikasi</th>
              <th className="py-3 px-4">Jumlah</th>
              <th className="py-3 px-4">Harga Satuan</th>
              <th className="py-3 px-4">Total Biaya</th>
              <th className="py-3 px-4">Status RTL</th>
              <th className="py-3 px-4 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {filteredList.length === 0 ? (
              <tr>
                <td colSpan={11} className="py-8 text-center text-gray-400 text-xs">
                  Tidak ada data pengajuan barang yang cocok.
                </td>
              </tr>
            ) : (
              filteredList.map((item) => {
                const canDelete =
                  currentUser.role === 'Admin' || currentUser.nama === item.pengaju;
                const isAdmin = currentUser.role === 'Admin';
                const totalBiaya = (item.qty || 0) * (item.harga || 0);

                return (
                  <tr
                    key={item.id}
                    className="border-b border-gray-50 hover:bg-blue-50/20 transition-colors"
                  >
                    <td className="py-3 px-4 font-semibold text-blue-600 text-xs">
                      {item.id}
                    </td>
                    <td className="py-3 px-4 text-xs">
                      {item.foto ? (
                        <img
                          src={item.foto}
                          alt={item.barang}
                          onClick={() => onOpenImageModal(item.foto!, item.barang)}
                          className="w-10 h-10 object-cover rounded-lg border border-gray-200 cursor-pointer hover:opacity-80 hover:scale-105 transition-all shadow-xs"
                          title="Klik untuk melihat foto"
                        />
                      ) : (
                        <div
                          className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 text-xs"
                          title="Tidak ada foto"
                        >
                          <ImageIcon className="w-4 h-4" />
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-4 text-gray-500 text-xs whitespace-nowrap">
                      {formatDateID(item.tgl)}
                    </td>
                    <td className="py-3 px-4 font-medium text-gray-800 text-xs">
                      {item.pengaju}
                    </td>
                    <td className="py-3 px-4 font-semibold text-gray-900 text-xs">
                      {item.barang}
                    </td>
                    <td className="py-3 px-4 text-gray-500 text-xs max-w-xs truncate">
                      {item.spesifikasi}
                    </td>
                    <td className="py-3 px-4 text-gray-800 text-xs whitespace-nowrap">
                      {item.qty} {item.satuan}
                    </td>
                    <td className="py-3 px-4 text-gray-800 text-xs whitespace-nowrap">
                      {formatRupiah(item.harga)}
                    </td>
                    <td className="py-3 px-4 font-bold text-gray-900 text-xs whitespace-nowrap">
                      {formatRupiah(totalBiaya)}
                    </td>
                    <td className="py-3 px-4">
                      {isAdmin ? (
                        <select
                          value={item.status}
                          onChange={(e) =>
                            onUpdateStatus(item.id, e.target.value as StatusRTL)
                          }
                          className="px-2.5 py-1.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-blue-600"
                        >
                          <option value="Sedang Dalam Antrian">
                            Sedang Dalam Antrian
                          </option>
                          <option value="Sedang Dalam Proses">
                            Sedang Dalam Proses
                          </option>
                          <option value="Selesai">Selesai</option>
                          <option value="Pengajuan Ditolak">
                            Pengajuan Ditolak
                          </option>
                        </select>
                      ) : (
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusBadgeStyle(
                            item.status
                          )}`}
                        >
                          {item.status}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {canDelete ? (
                        <button
                          onClick={() => setDeletingId(item.id)}
                          className="p-1.5 bg-rose-50 text-rose-600 rounded-lg hover:bg-rose-100 transition-all text-xs"
                          title="Hapus Pengajuan"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      ) : (
                        <span className="text-xs text-gray-300">-</span>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Modal */}
      {deletingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 text-center space-y-4 shadow-xl">
            <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto text-xl">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-gray-900 text-base">Hapus Pengajuan Barang?</h3>
            <p className="text-xs text-gray-500">
              Data pengajuan <span className="font-bold text-gray-800">{deletingId}</span> akan dihapus secara permanen dari sistem.
            </p>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setDeletingId(null)}
                className="flex-1 py-2.5 bg-gray-100 text-gray-700 rounded-xl text-xs font-semibold hover:bg-gray-200"
              >
                Batal
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 py-2.5 bg-rose-600 text-white rounded-xl text-xs font-semibold hover:bg-rose-700 shadow-sm"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
