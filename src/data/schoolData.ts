import { UserAccount, PengajuanItem, AppSettings, LoginRecord } from '../types';

export const INITIAL_SCHOOL_SETTINGS: AppSettings = {
  nama: "SMP KUSUMA BANGSA BOGOR",
  alamat: "Jl. Raya Ciapus No.53 Rt 03 Rw 14 Desa Kota Batu Kecamatan Ciomas Kabupaten Bogor",
  logo: "https://lh3.googleusercontent.com/d/1OFit5uz2AFLxHhwGsgBWK29LEYOMVKhM",
  isCustomLogo: true
};

export const INITIAL_USERS: UserAccount[] = [
  { id: 1, nama: "Ahmad Firmansyah", username: "ahmadfirmansyah", password: "Kusumabangsa123.", role: "Admin" },
  { id: 2, nama: "URIP SARIPUDIN,S.Ag", username: "uripsaripudin", password: "123456", role: "User" },
  { id: 3, nama: "RAHMAN SUMINTO,S.Pd.I", username: "rahmansuminto", password: "123456", role: "User" },
  { id: 4, nama: "SUHENDA,SE", username: "suhenda", password: "123456", role: "User" },
  { id: 5, nama: "ELIN IKMALIYAH,S.Pd.I", username: "elinikmaliyah", password: "123456", role: "User" },
  { id: 6, nama: "Drs. SUHERMAN", username: "suherman", password: "123456", role: "User" },
  { id: 7, nama: "SANTANG,S.Pd.I", username: "santang", password: "123456", role: "User" },
  { id: 8, nama: "DARMAWAN,S.Pd", username: "darmawan", password: "123456", role: "User" },
  { id: 9, nama: "NINA ASMANAH,S.Si", username: "ninaasmanah", password: "123456", role: "User" },
  { id: 10, nama: "VINAWATI,S.Pd.I", username: "vinawati", password: "123456", role: "User" },
  { id: 11, nama: "SUSILAWATI,S.Pd", username: "susilawati", password: "123456", role: "User" },
  { id: 12, nama: "EUIS YUDA DEVI,A.Md", username: "eisyudadevi", password: "123456", role: "User" },
  { id: 13, nama: "ATEP KURNIAWAN, S.Pd", username: "atepkurniawan", password: "123456", role: "User" },
  { id: 14, nama: "MAY RIZA WAYANI,S.Pd", username: "mayrizawayani", password: "123456", role: "User" },
  { id: 15, nama: "NUR ANISAH,S.Pd", username: "nuranisah", password: "123456", role: "User" },
  { id: 16, nama: "SITI FATIMAH,S.Pd", username: "sitifatimah", password: "123456", role: "User" },
  { id: 17, nama: "SYARAVINA JULIANI, S.Pd.", username: "syaravinajuliani", password: "123456", role: "User" },
  { id: 18, nama: "HERDIANA SAPUTRA, S.Pd.I", username: "herdianasaputra", password: "123456", role: "User" },
  { id: 19, nama: "SITI NURHANIFAH, S.Pd.", username: "sitinurhanifah", password: "123456", role: "User" },
  { id: 20, nama: "MUHAMAD MUPTHI RAFSYANZANI, S.Pi.", username: "muhamadmufthirafsyanzani", password: "123456", role: "User" },
  { id: 21, nama: "TARJO SUGIANA, S.Pd.", username: "tarjosugiana", password: "123456", role: "User" },
  { id: 22, nama: "YUSDIANSYAHWANI", username: "yusdiansyahwani", password: "123456", role: "User" },
  { id: 23, nama: "TAUFIK FATHUROHMAN, S.Ag.", username: "taufikfathurohman", password: "123456", role: "User" },
  { id: 24, nama: "SITI SOLEHAH, S.Sn.", username: "sitisolehah", password: "123456", role: "User" },
  { id: 25, nama: "KHORI KHOLIFAH, S.Pd.", username: "khorikholifah", password: "123456", role: "User" },
  { id: 26, nama: "DHEA KHODIJAH, S.Sn.", username: "dheakhodijah", password: "123456", role: "User" },
  { id: 27, nama: "RAHMAN WIJAYA, S.Kom", username: "rahmanwijaya", password: "123456", role: "User" },
  { id: 28, nama: "Dra. ERNI RIANA SYARI", username: "ernirianasyari", password: "123456", role: "User" },
  { id: 29, nama: "ANIL NURHAKIM, S.Pd.", username: "anilnurhakim", password: "123456", role: "User" },
  { id: 30, nama: "MULYADI, SE. M.M.", username: "mulyadi", password: "123456", role: "User" },
  { id: 31, nama: "DHYA AMANDA, SE.", username: "dhyaamanda", password: "123456", role: "User" },
  { id: 32, nama: "YOMAN SEPTIANSYAH", username: "yomanseptiansyah", password: "123456", role: "User" },
  { id: 33, nama: "SEPTIAN GUNTUR", username: "septianggung", password: "123456", role: "User" },
  { id: 34, nama: "DADI SUPRIATNA", username: "dadisupriatna", password: "123456", role: "User" },
  { id: 35, nama: "SYIFA FAUZIAH, S.Pd.", username: "syifafauziah", password: "123456", role: "User" },
  { id: 36, nama: "ARIF RACHMAN HAKIM, SM.", username: "arifrachmanhakim", password: "123456", role: "User" },
  { id: 37, nama: "ARIF RACHMAN HAKIM, SM.", username: "arifrachmanhakim2", password: "123456", role: "User" },
  { id: 38, nama: "HAMDAN IRMANSYAH, A.Md.", username: "hamdanirmansyah", password: "123456", role: "User" },
  { id: 39, nama: "SITI MASITOH", username: "sitimasitoh", password: "123456", role: "User" },
  { id: 40, nama: "SITI SOLIHAH", username: "sitisolihah", password: "123456", role: "User" },
  { id: 41, nama: "MUHAMAD HIDAYAT", username: "muhamadhidayat", password: "123456", role: "User" },
  { id: 42, nama: "KUSNADI", username: "kusnadi", password: "123456", role: "User" },
  { id: 43, nama: "SITI KHODIJAH, SE.", username: "sitikhodijah", password: "123456", role: "User" },
  { id: 44, nama: "DADANG KAMALUDIN", username: "dadangkamaludin", password: "123456", role: "User" }
];

export const INITIAL_PENGAJUAN: PengajuanItem[] = [];

export const INITIAL_LOGIN_HISTORY: LoginRecord[] = [
  { id: "lh-1", user: "ahmadfirmansyah", role: "Admin", waktu: "2026-08-09 09:30:12", status: "Berhasil" },
  { id: "lh-2", user: "uripsaripudin", role: "User", waktu: "2026-08-09 08:15:00", status: "Berhasil" },
  { id: "lh-3", user: "rahmanwijaya", role: "User", waktu: "2026-08-08 14:22:45", status: "Berhasil" }
];
