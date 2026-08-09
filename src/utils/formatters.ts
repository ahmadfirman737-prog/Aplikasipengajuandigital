import { StatusRTL } from '../types';

export const formatRupiah = (amount: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(amount || 0);
};

export const formatDateID = (dateString: string): string => {
  if (!dateString) return '-';
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(date);
  } catch {
    return dateString;
  }
};

export const getStatusBadgeStyle = (status: StatusRTL): string => {
  switch (status) {
    case 'Sedang Dalam Antrian':
      return 'bg-blue-100 text-blue-700 border-blue-200';
    case 'Sedang Dalam Proses':
      return 'bg-amber-100 text-amber-800 border-amber-300';
    case 'Selesai':
      return 'bg-emerald-100 text-emerald-800 border-emerald-300';
    case 'Pengajuan Ditolak':
      return 'bg-rose-100 text-rose-800 border-rose-300';
    default:
      return 'bg-gray-100 text-gray-700 border-gray-200';
  }
};
