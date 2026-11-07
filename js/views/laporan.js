// TAMPILAN: LAPORAN
// ==========================================
function viewLaporan() {
  var list = patients.slice().sort(function(a, b) { return (b.tglDaftar || '').localeCompare(a.tglDaftar || ''); });
  var rowsHtml;
  if (list.length === 0) { rowsHtml = '<tr><td colspan="10" style="padding:40px;text-align:center;color:var(--slate-400);">Belum ada data.</td></tr>'; }
  else {
    rowsHtml = list.map(function(p, i) {
      var names = (p.tests || []).map(function(k) { var t = findTest(k); return t ? t.nama : k; }).join(', ');
      return '<tr><td>' + (i + 1) + '</td><td class="mono" style="font-size:12px;">' + esc(p.noRM) + '</td><td style="font-weight:500;">' + esc(p.nama) + '</td><td style="font-size:12px;">' + esc(umur(p.tglLahir)) + ' / ' + esc(p.jk) + '</td><td style="font-size:12px;color:var(--slate-500);">' + esc(names) + '</td><td style="font-size:12px;">' + esc(p.pengirim || '-') + '</td><td style="font-size:12px;">' + esc(p.dokter || '-') + '</td><td style="font-size:12px;">' + esc(p.analis || '-') + '</td><td><span class="badge ' + STATUS[p.status].cls + '">' + STATUS[p.status].label + '</span></td><td style="font-size:12px;color:var(--slate-500);">' + esc(fmtDate(p.tglDaftar)) + '</td></tr>';
    }).join('');
  }
  return '<div class="page-header-flex"><div><h2>Laporan Pasien</h2><p>Riwayat seluruh pasien laboratorium.</p></div><button class="btn" style="background:var(--slate-800);color:#fff;" onclick="cetakLaporan()">🖨️ Cetak Laporan</button></div><div class="table-wrap"><table><thead><tr><th>No</th><th>No. RM</th><th>Nama</th><th>Umur/JK</th><th>Pemeriksaan</th><th>Pengirim</th><th>DPJP</th><th>Analis</th><th>Status</th><th>Tanggal</th></tr></thead><tbody>' + rowsHtml + '</tbody></table></div>';
}

// ==========================================
