import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { PengajuanItem, AppSettings } from '../types';
import { formatRupiah, formatDateID } from './formatters';

export const exportToExcel = (items: PengajuanItem[], schoolSettings: AppSettings) => {
  const dataToExport = items.map((item, idx) => ({
    "No": idx + 1,
    "ID Pengajuan": item.id,
    "Tanggal": formatDateID(item.tgl),
    "Nama Pengaju": item.pengaju,
    "Nama Barang": item.barang,
    "Spesifikasi": item.spesifikasi,
    "Jumlah": `${item.qty} ${item.satuan}`,
    "Harga Satuan (Rp)": item.harga,
    "Total Estimasi (Rp)": Number(item.harga) * Number(item.qty),
    "Keterangan / Alasan": item.ket,
    "Status RTL": item.status,
    "Catatan Admin": item.catatanAdmin || '-'
  }));

  const worksheet = XLSX.utils.json_to_sheet(dataToExport);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Laporan Pengajuan");

  const sanitizedSchoolName = schoolSettings.nama.replace(/[^a-zA-Z0-9]/g, '_');
  const dateStr = new Date().toISOString().slice(0, 10);
  XLSX.writeFile(workbook, `Laporan_Pengajuan_${sanitizedSchoolName}_${dateStr}.xlsx`);
};

export const exportToPDF = (items: PengajuanItem[], schoolSettings: AppSettings) => {
  const doc = new jsPDF('l', 'pt', 'a4');

  // School Header Letterhead
  doc.setFontSize(16);
  doc.setTextColor(30, 64, 175); // Primary blue
  doc.text(`LAPORAN HASIL PENGAJUAN BARANG DIGITAL`, 40, 40);
  
  doc.setFontSize(12);
  doc.setTextColor(31, 41, 55);
  doc.text(schoolSettings.nama, 40, 58);

  doc.setFontSize(9);
  doc.setTextColor(107, 114, 128);
  doc.text(schoolSettings.alamat, 40, 72);
  doc.text(`Tanggal Cetak: ${new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}`, 40, 85);

  doc.setLineWidth(1);
  doc.setDrawColor(229, 231, 235);
  doc.line(40, 95, 802, 95);

  const tableColumn = ["No", "Tanggal", "Pengaju", "Nama Barang", "Spesifikasi", "Jumlah", "Total Harga", "Status RTL"];
  const tableRows = items.map((item, idx) => [
    idx + 1,
    formatDateID(item.tgl),
    item.pengaju,
    item.barang,
    item.spesifikasi,
    `${item.qty} ${item.satuan}`,
    formatRupiah(Number(item.harga) * Number(item.qty)),
    item.status
  ]);

  autoTable(doc, {
    head: [tableColumn],
    body: tableRows,
    startY: 110,
    theme: 'grid',
    headStyles: { 
      fillColor: [37, 99, 235],
      textColor: [255, 255, 255],
      fontStyle: 'bold'
    },
    styles: { fontSize: 8, cellPadding: 6 },
    columnStyles: {
      0: { cellWidth: 30 },
      1: { cellWidth: 65 },
      2: { cellWidth: 110 },
      3: { cellWidth: 130 },
      4: { cellWidth: 140 },
      5: { cellWidth: 55 },
      6: { cellWidth: 90 },
      7: { cellWidth: 90 }
    }
  });

  const sanitizedSchoolName = schoolSettings.nama.replace(/[^a-zA-Z0-9]/g, '_');
  const dateStr = new Date().toISOString().slice(0, 10);
  doc.save(`Laporan_Pengajuan_${sanitizedSchoolName}_${dateStr}.pdf`);
};
