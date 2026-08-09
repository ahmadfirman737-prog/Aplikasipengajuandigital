import React, { useState } from 'react';
import { UserAccount, UserRole } from '../types';
import { UserPlus, Edit3, Trash2, Shield, User as UserIcon, X, AlertTriangle } from 'lucide-react';

interface UserManagementTabProps {
  users: UserAccount[];
  onAddUser: (newUser: UserAccount) => void;
  onUpdateUser: (updatedUser: UserAccount) => void;
  onDeleteUser: (userId: number) => void;
  showToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const UserManagementTab: React.FC<UserManagementTabProps> = ({
  users,
  onAddUser,
  onUpdateUser,
  onDeleteUser,
  showToast,
}) => {
  // New User Form State
  const [newNama, setNewNama] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newRole, setNewRole] = useState<UserRole>('User');

  // Edit User Modal State
  const [editingUser, setEditingUser] = useState<UserAccount | null>(null);

  // Delete Confirmation State
  const [deletingUserId, setDeletingUserId] = useState<number | null>(null);

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanU = newUsername.trim().toLowerCase();

    if (users.some((x) => x.username.toLowerCase() === cleanU)) {
      showToast('Username sudah digunakan! Gunakan username lain.', 'error');
      return;
    }

    const newId = users.length > 0 ? Math.max(...users.map((x) => x.id)) + 1 : 1;
    const created: UserAccount = {
      id: newId,
      nama: newNama.trim(),
      username: cleanU,
      password: newPassword.trim(),
      role: newRole,
    };

    onAddUser(created);
    setNewNama('');
    setNewUsername('');
    setNewPassword('');
    setNewRole('User');
    showToast('User baru berhasil ditambahkan!', 'success');
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    onUpdateUser(editingUser);
    setEditingUser(null);
    showToast('Data user berhasil diperbarui', 'success');
  };

  const confirmDelete = () => {
    if (deletingUserId !== null) {
      if (users.length <= 1) {
        showToast('Minimal harus ada 1 user di dalam sistem!', 'error');
        setDeletingUserId(null);
        return;
      }
      onDeleteUser(deletingUserId);
      setDeletingUserId(null);
      showToast('User berhasil dihapus', 'success');
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Form Tambah User Baru */}
      <div className="bg-white rounded-2xl shadow-xs border border-gray-100 p-6 h-fit space-y-4">
        <div className="border-b border-gray-100 pb-3">
          <h3 className="font-bold text-gray-800 text-sm flex items-center gap-2">
            <UserPlus className="w-4 h-4 text-blue-600" />
            Tambah User Baru
          </h3>
          <p className="text-xs text-gray-400 mt-0.5">Daftarkan akun guru atau staf baru</p>
        </div>

        <form onSubmit={handleAddSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-700">Nama Lengkap & Gelar</label>
            <input
              type="text"
              required
              value={newNama}
              onChange={(e) => setNewNama(e.target.value)}
              placeholder="Contoh: Sitti Rahma, S.Pd."
              className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-blue-600"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-700">Username Login</label>
            <input
              type="text"
              required
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              placeholder="sittirahma"
              className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-blue-600"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-700">Password</label>
            <input
              type="password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-blue-600"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-700">Role Akses</label>
            <select
              value={newRole}
              onChange={(e) => setNewRole(e.target.value as UserRole)}
              className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-blue-600"
            >
              <option value="User">User (Guru / Staf)</option>
              <option value="Admin">Administrator</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-blue-600 text-white font-semibold rounded-xl text-xs hover:bg-blue-700 transition-all shadow-xs flex items-center justify-center gap-2"
          >
            <UserPlus className="w-4 h-4" />
            <span>Simpan User Baru</span>
          </button>
        </form>
      </div>

      {/* Tabel Daftar Pengguna */}
      <div className="lg:col-span-2 bg-white rounded-2xl shadow-xs border border-gray-100 p-6 space-y-4">
        <div className="flex justify-between items-center border-b border-gray-100 pb-3">
          <div>
            <h3 className="font-bold text-gray-800 text-sm">Daftar Pengguna Sistem</h3>
            <p className="text-xs text-gray-400 mt-0.5">Total {users.length} Akun Terdaftar</p>
          </div>
        </div>

        <div className="overflow-x-auto max-h-[500px]">
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 bg-white shadow-xs">
              <tr className="border-b border-gray-100 text-xs text-gray-400 uppercase font-semibold">
                <th className="py-3 px-4">No</th>
                <th className="py-3 px-4">Nama Lengkap</th>
                <th className="py-3 px-4">Username</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {users.map((u, index) => (
                <tr key={u.id} className="border-b border-gray-50 hover:bg-blue-50/20">
                  <td className="py-3 px-4 text-gray-500 text-xs">{index + 1}</td>
                  <td className="py-3 px-4 font-medium text-gray-800 text-xs">{u.nama}</td>
                  <td className="py-3 px-4 text-gray-600 text-xs font-mono">{u.username}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2.5 py-1 rounded-md text-xs font-semibold ${
                        u.role === 'Admin'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center space-x-2">
                    <button
                      onClick={() => setEditingUser({ ...u })}
                      className="p-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 text-xs transition-colors"
                      title="Edit User"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setDeletingUserId(u.id)}
                      className="p-1.5 bg-rose-50 text-rose-600 rounded-lg hover:bg-rose-100 text-xs transition-colors"
                      title="Hapus User"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit User Modal */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl">
            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
              <h3 className="font-bold text-gray-900 text-base">Edit Data User</h3>
              <button
                onClick={() => setEditingUser(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleEditSubmit} className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-700">Nama Lengkap</label>
                <input
                  type="text"
                  required
                  value={editingUser.nama}
                  onChange={(e) => setEditingUser({ ...editingUser, nama: e.target.value })}
                  className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-blue-600"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-700">Username</label>
                <input
                  type="text"
                  required
                  value={editingUser.username}
                  onChange={(e) => setEditingUser({ ...editingUser, username: e.target.value })}
                  className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-blue-600"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-700">Password</label>
                <input
                  type="password"
                  required
                  value={editingUser.password || ''}
                  onChange={(e) => setEditingUser({ ...editingUser, password: e.target.value })}
                  className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-blue-600"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-700">Role Akses</label>
                <select
                  value={editingUser.role}
                  onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value as UserRole })}
                  className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-blue-600"
                >
                  <option value="User">User (Guru / Staf)</option>
                  <option value="Admin">Administrator</option>
                </select>
              </div>
              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="flex-1 py-2.5 bg-gray-100 text-gray-700 rounded-xl text-xs font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-semibold hover:bg-blue-700"
                >
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete User Modal */}
      {deletingUserId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 text-center space-y-4 shadow-xl">
            <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto text-xl">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-gray-900 text-base">Hapus User Ini?</h3>
            <p className="text-xs text-gray-500">
              Akun pengguna ini akan dihapus dan tidak dapat masuk ke sistem.
            </p>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setDeletingUserId(null)}
                className="flex-1 py-2.5 bg-gray-100 text-gray-700 rounded-xl text-xs font-semibold"
              >
                Batal
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 py-2.5 bg-rose-600 text-white rounded-xl text-xs font-semibold hover:bg-rose-700"
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
