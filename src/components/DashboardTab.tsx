import React from 'react';
import { PengajuanItem, LoginRecord, UserAccount } from '../types';
import { FileText, Hourglass, CheckCircle2, Ban, Shield, Clock } from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  PieChart as RePieChart,
  Pie
} from 'recharts';

interface DashboardTabProps {
  pengajuanList: PengajuanItem[];
  loginHistory: LoginRecord[];
  currentUser: UserAccount;
}

export const DashboardTab: React.FC<DashboardTabProps> = ({
  pengajuanList,
  loginHistory,
  currentUser
}) => {
  const total = pengajuanList.length;
  const proses = pengajuanList.filter(x => x.status === 'Sedang Dalam Proses').length;
  const selesai = pengajuanList.filter(x => x.status === 'Selesai').length;
  const ditolak = pengajuanList.filter(x => x.status === 'Pengajuan Ditolak').length;

  const antrian = pengajuanList.filter(x => x.status === 'Sedang Dalam Antrian').length;

  const barData = [
    { name: 'Antrian', count: antrian, color: '#3b82f6' },
    { name: 'Proses', count: proses, color: '#f59e0b' },
    { name: 'Selesai', count: selesai, color: '#10b981' },
    { name: 'Ditolak', count: ditolak, color: '#f43f5e' },
  ];

  // User breakdown data
  const userCounts: Record<string, number> = {};
  pengajuanList.forEach(item => {
    const key = item.pengaju.split(',')[0]; // shorten title
    userCounts[key] = (userCounts[key] || 0) + 1;
  });

  const pieColors = ['#2563eb', '#0284c7', '#0d9488', '#16a34a', '#ca8a04', '#9333ea', '#e11d48'];
  const pieData = Object.keys(userCounts).map((name, idx) => ({
    name,
    value: userCounts[name],
    color: pieColors[idx % pieColors.length]
  }));

  return (
    <div className="space-y-6">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-2xl shadow-xs border border-gray-100 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-xl font-bold border border-blue-100">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-gray-400 font-medium">Total Pengajuan</p>
            <h3 className="text-2xl font-bold text-gray-900 mt-1">{total}</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-xs border border-gray-100 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center text-xl font-bold border border-amber-100">
            <Hourglass className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-gray-400 font-medium">Dalam Proses</p>
            <h3 className="text-2xl font-bold text-gray-900 mt-1">{proses}</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-xs border border-gray-100 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl font-bold border border-emerald-100">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-gray-400 font-medium">Selesai</p>
            <h3 className="text-2xl font-bold text-gray-900 mt-1">{selesai}</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-xs border border-gray-100 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center text-xl font-bold border border-rose-100">
            <Ban className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-gray-400 font-medium">Ditolak</p>
            <h3 className="text-2xl font-bold text-gray-900 mt-1">{ditolak}</h3>
          </div>
        </div>
      </div>

      {/* Recharts Graphs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-xs border border-gray-100 flex flex-col h-80">
          <h3 className="font-bold text-gray-800 text-sm mb-4">Grafik Status Pengajuan Barang</h3>
          <div className="flex-1 w-full h-full min-h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#6b7280' }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', borderColor: '#e5e7eb', fontSize: '12px' }} 
                />
                <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                  {barData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-xs border border-gray-100 flex flex-col h-80">
          <h3 className="font-bold text-gray-800 text-sm mb-2">Grafik Kontribusi Pengaju</h3>
          <div className="flex-1 w-full h-full min-h-[180px] flex items-center justify-center">
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <RePieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`pie-cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', borderColor: '#e5e7eb', fontSize: '12px' }}
                  />
                </RePieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-xs text-gray-400">Belum ada data pengajuan</p>
            )}
          </div>
        </div>
      </div>

      {/* Login History (Admin only) */}
      {currentUser.role === 'Admin' && (
        <div className="bg-white rounded-2xl shadow-xs border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-800 text-sm flex items-center gap-2">
              <Shield className="w-4 h-4 text-blue-600" />
              Riwayat Login Sistem Terbaru
            </h3>
            <span className="text-xs text-gray-400">5 Aktivitas Terakhir</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 text-xs text-gray-400 uppercase font-semibold">
                  <th className="py-3 px-4">User</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Waktu</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {loginHistory.slice(0, 5).map((h) => (
                  <tr key={h.id} className="border-b border-gray-50 hover:bg-gray-50/80 transition-colors">
                    <td className="py-3 px-4 font-medium text-gray-800">{h.user}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2.5 py-0.5 rounded-md text-xs font-semibold ${
                        h.role === 'Admin' ? 'bg-blue-50 text-blue-700' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {h.role}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-500 text-xs flex items-center gap-1.5 pt-4">
                      <Clock className="w-3.5 h-3.5 text-gray-400" />
                      {h.waktu}
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-emerald-600 font-medium text-xs bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                        {h.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
