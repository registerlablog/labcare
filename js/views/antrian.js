// TAMPILAN: ANTRIAN
// ==========================================
function viewAntrian() {
  var filter = window._filter || 'semua'; var dateFilter = window._dateFilter || 'today';
  var list = patients.slice().sort(function(a, b) { return (a.tglDaftar || '').localeCompare(b.tglDaftar || ''); });
  if (dateFilter === 'today') { list = list.filter(function(p) { return p.tglDaftar && p.tglDaftar.slice(0, 10) === today(); }); }
  var filtered = filter === 'semua' ? list : list.filter(function(p) { return p.status === filter; });
  var tabsHtml = ['semua'].concat(Object.keys(STATUS)).map(function(k) { var count = k === 'semua' ? list.length : list.filter(function(p) { return p.status === k; }).length; var label = k === 'semua' ? 'Semua' : STATUS[k].label; return '<button class="pill' + (filter === k ? ' active' : '') + '" onclick="window._filter=\'' + k + '\'; render();">' + label + ' <span class="count">(' + count + ')</span></button>'; }).join('');
  var dateTabsHtml = '<button class="pill' + (dateFilter === 'today' ? ' active' : '') + '" onclick="window._dateFilter=\'today\'; window._filter=\'semua\'; render();">📅 Hari Ini</button><button class="pill' + (dateFilter === 'all' ? ' active' : '') + '" onclick="window._dateFilter=\'all\'; window._filter=\'semua\'; render();">📋 Semua Tanggal</button>';
  var content;
  if (filtered.length === 0) { var emptyMsg = dateFilter === 'today' ? 'Belum ada pasien terdaftar hari ini.' : 'Tidak ada pasien pada kategori ini.'; content = '<div class="empty-state"><span class="em">📭</span><p>' + emptyMsg + '</p></div>'; }
  else {
    content = '<div class="patient-grid">' + filtered.map(function(p) {
      var testChips = (p.tests || []).map(function(k) { var t = findTest(k); return '<span class="test-chip">' + esc(t ? t.nama : k) + '</span>'; }).join('');
      var actionsHtml = '<span style="flex:1;font-size:12px;color:var(--slate-500);font-weight:600;padding:8px 0;">Status: ' + STATUS[p.status].label + '</span>';
      return '<div class="patient-card ' + p.status + '">' +
        '<div class="patient-card-head"><div><div class="antrian">' + esc(p.noAntrian) + '</div><div class="rm">' + esc(p.noRM) + '</div></div><span class="badge ' + STATUS[p.status].cls + '">' + STATUS[p.status].label + '</span></div>' +
        '<h4>' + esc(p.nama) + '</h4>' +
        '<p class="meta">' + (p.jk === 'L' ? 'Laki-laki' : 'Perempuan') + ' • ' + esc(umur(p.tglLahir)) + '</p>' +
        (p.spesimen === 'ada' ? '<p class="meta" style="color:#16a34a;font-weight:600;">📦 Spesimen: Sudah ada (dari luar)</p>' : '<p class="meta" style="color:#d97706;font-weight:600;">📦 Spesimen: Perlu sampling</p>') +
        (p.pengirim ? '<p class="meta">📤 Pengirim: ' + esc(p.pengirim) + '</p>' : '') +
        (p.dokter ? '<p class="meta">DPJP: ' + esc(p.dokter) + '</p>' : '') +
        (p.analis ? '<p class="meta">Analis: ' + esc(p.analis) + '</p>' : '') +
        '<div class="test-chips">' + testChips + '</div>' +
        '<div class="patient-card-actions">' + actionsHtml +
        (p.spesimen !== 'ada' && p.status === 'menunggu' ? '<button class="btn-icon" onclick="panggilPasien(\'' + p.id + '\')" title="Panggil ke Sampling" style="background:#fef3c7;color:#b45309;font-weight:bold;">🔊</button>' : '') +
        '<button class="btn-icon" onclick="modalEditPasien(\'' + p.id + '\')" title="Edit Data Pasien" style="background:#f3e8ff;color:#7e22ce;">👤</button>' +
        '<button class="btn-icon" onclick="modalEditPemeriksaan(\'' + p.id + '\')" title="Edit Pemeriksaan" style="background:#dbeafe;color:#1d4ed8;"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg></button>' +
        '<button class="btn-icon" onclick="cetakHasil(\'' + p.id + '\')" title="Cetak"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg></button>' +
        '<button class="btn-icon danger" onclick="hapusPasien(\'' + p.id + '\')" title="Hapus"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg></button>' +
        '</div></div>';
    }).join('') + '</div>';
  }
  return '<div class="page-header"><h2>Antrian & Status</h2><p>Kelola alur status pasien dari pendaftaran hingga selesai.</p></div><div class="pill-row">' + dateTabsHtml + '</div><div class="pill-row">' + tabsHtml + '</div>' + content;
}

// ==========================================

