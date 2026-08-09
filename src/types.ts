export type UserRole = 'Admin' | 'User';

export type StatusRTL = 
  | 'Sedang Dalam Antrian' 
  | 'Sedang Dalam Proses' 
  | 'Selesai' 
  | 'Pengajuan Ditolak';

export interface UserAccount {
  id: number;
  nama: string;
  username: string;
  password?: string;
  role: UserRole;
}

export interface PengajuanItem {
  id: string;
  tgl: string;
  pengaju: string;
  barang: string;
  spesifikasi: string;
  qty: number;
  satuan: string;
  harga: number;
  ket: string;
  foto?: string | null;
  status: StatusRTL;
  catatanAdmin?: string;
}

export interface LoginRecord {
  id: string;
  user: string;
  role: string;
  waktu: string;
  status: string;
}

export interface AppSettings {
  nama: string;
  alamat: string;
  logo: string;
  isCustomLogo: boolean;
}

export type ActiveTab = 
  | 'dashboard' 
  | 'pengajuan' 
  | 'status' 
  | 'laporan' 
  | 'users' 
  | 'peraturan';
