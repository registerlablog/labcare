// ==========================================
// TAMPILAN: DASHBOARD
// ==========================================
function viewDashboard() {
  var t = patients.filter(function(p) { return p.tglDaftar && p.tglDaftar.slice(0, 10) === today(); });
  var c = function(s) { return t.filter(function(p) { return p.status === s; }).length; };
  var cards = [
    { label: 'Pasien Hari Ini', val: t.length,       cls: 'stat-blue',   icon: '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>' },
    { label: 'Menunggu',        val: c('menunggu'),  cls: 'stat-amber',  icon: '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>' },
    { label: 'Diproses',        val: c('proses') + c('sampling'), cls: 'stat-purple', icon: '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 3h6v6l4 8a2 2 0 0 1-2 3H7a2 2 0 0 1-2-3l4-8V3z"/><path d="M9 3h6"/></svg>' },
    { label: 'Selesai',         val: c('selesai'),   cls: 'stat-green',  icon: '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>' }
  ];
  var cardsHtml = cards.map(function(x) { return '<div class="stat-card ' + x.cls + '"><div class="icon">' + x.icon + '</div><div class="val">' + x.val + '</div><div class="lbl">' + x.label + '</div></div>'; }).join('');
  var recent = patients.slice().sort(function(a, b) { return (b.tglDaftar || '').localeCompare(a.tglDaftar || ''); }).slice(0, 6);
  var recentHtml;
  if (recent.length === 0) { recentHtml = '<div class="empty-state"><span class="em">📭</span><p>Belum ada data pasien.</p></div>'; }
  else {
    recentHtml = '<div class="table-wrap"><table><thead><tr><th>Antrian</th><th>No. RM</th><th>Nama</th><th>Tes</th><th>Status</th><th>Tanggal</th></tr></thead><tbody>' +
      recent.map(function(p) { return '<tr><td class="mono" style="color:var(--primary);font-weight:700;">' + esc(p.noAntrian) + '</td><td class="mono" style="font-size:12px;">' + esc(p.noRM) + '</td><td style="font-weight:500;">' + esc(p.nama) + '</td><td style="font-size:12px;color:var(--slate-500);">' + (p.tests ? p.tests.length : 0) + ' tes</td><td><span class="badge ' + STATUS[p.status].cls + '">' + STATUS[p.status].label + '</span></td><td style="font-size:12px;color:var(--slate-500);">' + esc(fmtDate(p.tglDaftar)) + '</td></tr>'; }).join('') + '</tbody></table></div>';
  }
  return '<div class="page-header"><h2>Dashboard</h2><p>Ringkasan pelayanan — ' + esc(fmtDate(new Date().toISOString())) + '</p></div><div class="stats-grid">' + cardsHtml + '</div><h3 class="section-title">Pasien Terbaru</h3>' + recentHtml;
}

// ==========================================

