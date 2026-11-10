// TAMPILAN: MASTER LAB
// ==========================================
function goToMaster(tab) { view = 'master'; window._masterTab = tab; renderNav(); render(); }
function viewMaster() {
  var tab = window._masterTab || 'pemeriksaan';
  var tabsArr = [];
  tabsArr.push('<button class="pill' + (tab === 'pemeriksaan' ? ' active' : '') + '" onclick="window._masterTab=\'pemeriksaan\'; render();">🔬 Pemeriksaan</button>');
  tabsArr.push('<button class="pill' + (tab === 'analis' ? ' active' : '') + '" onclick="window._masterTab=\'analis\'; render();">👨‍🔬 Analis</button>');
  tabsArr.push('<button class="pill' + (tab === 'dokter' ? ' active' : '') + '" onclick="window._masterTab=\'dokter\'; render();">🩺 Dokter</button>');
  tabsArr.push('<button class="pill' + (tab === 'stempel' ? ' active' : '') + '" onclick="window._masterTab=\'stempel\'; render();">🏢 Stempel</button>');
  tabsArr.push('<button class="pill' + (tab === 'puskesmas' ? ' active' : '') + '" onclick="window._masterTab=\'puskesmas\'; render();">🔐 Akses Puskesmas</button>');
  tabsArr.push('<button class="pill' + (tab === 'logbackup' ? ' active' : '') + '" onclick="window._masterTab=\'logbackup\'; render();">🛡️ Log & Backup</button>');
  tabsArr.push('<button class="pill' + (tab === 'sistem' ? ' active' : '') + '" onclick="window._masterTab=\'sistem\'; render();">⚙️ Pengaturan Sistem</button>');
  tabsArr.push('<button class="pill' + (tab === 'persetujuan' ? ' active' : '') + '" onclick="window._masterTab=\'persetujuan\'; render();">👥 Persetujuan Petugas</button>');
  tabsArr.push('<button class="pill' + (tab === 'kelolapetugas' ? ' active' : '') + '" onclick="window._masterTab=\'kelolapetugas\'; render();">👨‍💼 Kelola Petugas</button>');
  
  var tabsHtml = tabsArr.join('');
  var content = '';
  if (tab === 'pemeriksaan') content = viewMasterPemeriksaan();
  else if (tab === 'analis') content = viewMasterAnalis();
  else if (tab === 'dokter') content = viewMasterDokter();
  else if (tab === 'stempel') content = viewMasterStempel();
  else if (tab === 'puskesmas') content = viewMasterPuskesmas();
  else if (tab === 'logbackup') content = viewMasterLogBackup();
  else if (tab === 'persetujuan') content = viewMasterPersetujuan(); 
  else if (tab === 'sistem') content = viewMasterSistem();
  else if (tab === 'kelolapetugas') content = viewMasterKelolaPetugas();
  return '<div class="page-header"><h2>🧬 Master Lab</h2><p>Kelola master data laboratorium: pemeriksaan, analis, dan dokter.</p></div><div class="pill-row">' + tabsHtml + '</div>' + content;
}
function viewMasterPemeriksaan() {
  var filter = window._testFilter || 'semua'; var search = (window._testSearch || '').toLowerCase();
  var categories = ['semua'].concat(Array.from(new Set(TESTS.map(function(t) { return t.kategori; }))).sort());
  var pillsHtml = categories.map(function(k) { var count = k === 'semua' ? TESTS.length : TESTS.filter(function(t) { return t.kategori === k; }).length; var label = k === 'semua' ? 'Semua' : k; return '<button class="pill' + (filter === k ? ' active' : '') + '" onclick="window._testFilter=\'' + k.replace(/'/g, "\\'") + '\'; render();">' + esc(label) + ' <span class="count">(' + count + ')</span></button>'; }).join('');
  var filtered = TESTS.filter(function(t) { var matchCat = filter === 'semua' || t.kategori === filter; var matchSearch = !search || t.kode.toLowerCase().indexOf(search) >= 0 || t.nama.toLowerCase().indexOf(search) >= 0; return matchCat && matchSearch; });
  return '<div class="page-header-flex"><div><h3 style="font-size:17px;font-weight:700;">Master Pemeriksaan</h3><p style="font-size:13px;color:var(--slate-500);margin-top:2px;">Daftar pemeriksaan, kategori, satuan, nilai rujukan.</p></div><div style="display:flex;gap:8px;flex-wrap:wrap;"><button class="btn btn-primary" onclick="modalTest(null)">➕ Tambah Pemeriksaan</button><button class="btn btn-secondary" onclick="resetTests()">🔄 Reset</button></div></div>' +
    '<div class="master-toolbar"><div class="search-box"><input id="testSearch" placeholder="Cari kode atau nama..." value="' + esc(window._testSearch || '') + '" oninput="filterTestTable()"></div><span id="testCount" style="font-size:13px;color:var(--slate-500);font-weight:600;">' + filtered.length + ' pemeriksaan</span></div>' +
    '<div class="pill-row">' + pillsHtml + '</div>' +
    '<div class="table-wrap"><table><thead><tr><th style="width:80px;">Kode</th><th>Nama Pemeriksaan</th><th>Kategori</th><th>Satuan</th><th>Nilai Rujukan</th><th>Kalibrasi</th><th style="text-align:right;width:110px;">Aksi</th></tr></thead><tbody id="testTableBody">' + buildTestRows(filtered) + '</tbody></table></div>';
}
function buildTestRows(list) {
  if (list.length === 0) return '<tr><td colspan="7" style="padding:40px;text-align:center;color:var(--slate-400);">Tidak ada pemeriksaan yang cocok.</td></tr>';
  return list.map(function(t) {
    return '<tr><td class="mono" style="font-weight:700;color:var(--primary);">' + esc(t.kode) + '</td>' +
      '<td style="font-weight:500;">' + esc(t.nama) + '</td>' +
      '<td><span class="test-chip">' + esc(t.kategori) + '</span></td>' +
      '<td style="font-size:12px;">' + esc(t.satuan || '-') + '</td>' +
      '<td style="font-size:12px;color:var(--slate-500);">' + esc(t.rujukan) + '</td>' +
      '<td>' + (t.kal_aktif ? '<span class="badge badge-selesai" style="font-size:10px;">⚡ ' + (t.kal_operator || '*') + ' ' + (t.kal_faktor || 1) + '</span>' : '<span style="color:var(--slate-400);font-size:12px;">-</span>') + '</td>' +
      '<td style="text-align:right;white-space:nowrap;">' +
      '<button class="btn-icon" onclick="modalTest(\'' + esc(t.kode).replace(/'/g, "\\'") + '\')" title="Edit"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg></button> ' +
      '<button class="btn-icon danger" onclick="hapusTest(\'' + esc(t.kode).replace(/'/g, "\\'") + '\')" title="Hapus"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg></button>' +
      '</td></tr>';
  }).join('');
}
function filterTestTable() { var search = (document.getElementById('testSearch').value || '').toLowerCase(); var filter = window._testFilter || 'semua'; window._testSearch = document.getElementById('testSearch').value; var filtered = TESTS.filter(function(t) { var matchCat = filter === 'semua' || t.kategori === filter; var matchSearch = !search || t.kode.toLowerCase().indexOf(search) >= 0 || t.nama.toLowerCase().indexOf(search) >= 0; return matchCat && matchSearch; }); var tbody = document.getElementById('testTableBody'); if (tbody) tbody.innerHTML = buildTestRows(filtered); var counter = document.getElementById('testCount'); if (counter) counter.textContent = filtered.length + ' pemeriksaan'; }
function viewMasterAnalis() {
  var rows;
  if (analisList.length === 0) { rows = '<tr><td colspan="4" style="padding:40px;text-align:center;color:var(--slate-400);">Belum ada data analis.</td></tr>'; }
  else { rows = analisList.map(function(a, i) { return '<tr><td style="color:var(--slate-500);font-size:12px;">' + (i + 1) + '</td><td style="font-weight:500;">' + esc(a.nama) + '</td><td style="font-size:12px;">' + esc(a.kode || '-') + '</td><td style="text-align:right;white-space:nowrap;"><button class="btn-icon" onclick="modalKaryawan(\'analis\', \'' + esc(a.id) + '\')" title="Edit"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg></button> <button class="btn-icon danger" onclick="hapusKaryawan(\'analis\', \'' + esc(a.id) + '\')" title="Hapus"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg></button></td></tr>'; }).join(''); }
  return '<div class="page-header-flex"><div><h3 style="font-size:17px;font-weight:700;">Master Analis</h3><p style="font-size:13px;color:var(--slate-500);margin-top:2px;">Daftar nama analis laboratorium.</p></div><div style="display:flex;gap:8px;flex-wrap:wrap;"><button class="btn btn-primary" onclick="modalKaryawan(\'analis\', null)">➕ Tambah Analis</button>' + (analisList.length > 0 ? '<button class="btn btn-secondary" onclick="resetAnalis()">🔄 Reset</button>' : '') + '</div></div><div class="table-wrap"><table><thead><tr><th style="width:50px;">No</th><th>Nama Analis</th><th>NIP / Kode</th><th style="text-align:right;width:110px;">Aksi</th></tr></thead><tbody>' + rows + '</tbody></table></div>';
}
function viewMasterDokter() {
  var rows;
  if (dokterList.length === 0) { rows = '<tr><td colspan="4" style="padding:40px;text-align:center;color:var(--slate-400);">Belum ada data dokter.</td></tr>'; }
  else { rows = dokterList.map(function(d, i) { return '<tr><td style="color:var(--slate-500);font-size:12px;">' + (i + 1) + '</td><td style="font-weight:500;">' + esc(d.nama) + '</td><td style="font-size:12px;">' + esc(d.kode || '-') + '</td><td style="text-align:right;white-space:nowrap;"><button class="btn-icon" onclick="modalKaryawan(\'dokter\', \'' + esc(d.id) + '\')" title="Edit"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg></button> <button class="btn-icon danger" onclick="hapusKaryawan(\'dokter\', \'' + esc(d.id) + '\')" title="Hapus"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg></button></td></tr>'; }).join(''); }
  return '<div class="page-header-flex"><div><h3 style="font-size:17px;font-weight:700;">Master Dokter</h3><p style="font-size:13px;color:var(--slate-500);margin-top:2px;">Daftar dokter penanggung jawab (DPJP).</p></div><div style="display:flex;gap:8px;flex-wrap:wrap;"><button class="btn btn-primary" onclick="modalKaryawan(\'dokter\', null)">➕ Tambah Dokter</button>' + (dokterList.length > 0 ? '<button class="btn btn-secondary" onclick="resetDokter()">🔄 Reset</button>' : '') + '</div></div><div class="table-wrap"><table><thead><tr><th style="width:50px;">No</th><th>Nama Dokter</th><th>SIP / Kode</th><th style="text-align:right;width:110px;">Aksi</th></tr></thead><tbody>' + rows + '</tbody></table></div>';
}
function viewMasterStempel() {
  var s = stempelUrl || '';
  return '<div class="page-header-flex"><div><h3 style="font-size:17px;font-weight:700;">Stempel Klinik</h3><p style="font-size:13px;color:var(--slate-500);margin-top:2px;">Stempel akan otomatis muncul di atas tanda tangan dokter saat cetak.</p></div></div>' +
    '<div class="card"><label class="lbl">Gambar Stempel <span class="lbl-hint">(PNG transparan disarankan, maks 500 KB)</span></label><input type="file" id="stempelFile" accept="image/*" class="inp" onchange="previewStempel(this)"><div style="margin-top:12px; padding:20px; border:1px dashed var(--slate-300); border-radius:10px; background:#fff; min-height:160px; display:flex; align-items:center; justify-content:center;"><img id="stempelPreview" src="' + (s ? esc(s) : '') + '" style="max-height:140px; max-width:100%; object-fit:contain; ' + (s ? '' : 'display:none;') + '"><span id="stempelPlaceholder" style="font-size:13px; color:var(--slate-400); ' + (s ? 'display:none;' : '') + '">Belum ada stempel</span></div><div class="btn-row"><button class="btn btn-primary" onclick="simpanStempel()">Simpan Stempel</button>' + (s ? '<button class="btn btn-secondary" onclick="hapusStempel()">🗑️ Hapus Stempel</button>' : '') + '</div></div>';
}
function viewMasterLogBackup() {
  setTimeout(loadLogDanBackup, 100);
  return '<div class="page-header-flex">' +
    '<div><h3 style="font-size:17px;font-weight:700;">Log & Backup Sistem</h3><p style="font-size:13px;color:var(--slate-500);margin-top:2px;">Pantau aktivitas petugas dan riwayat pencadangan data.</p></div>' +
    '<div style="display:flex; gap:8px; flex-wrap:wrap;">' +
    '<button class="btn" style="background:#f59e0b; color:#fff;" onclick="prosesArsipSekarang()">📦 Arsipkan Log Lama</button>' +
    '<button class="btn btn-primary" onclick="prosesBackupSekarang()">🔄 Backup Sekarang</button>' +
    '</div></div>' +
    '<div class="card" style="margin-bottom: 16px;">' +
      '<h3 class="section-title" style="margin-top:0; border-bottom:none; padding-bottom:0;">📜 Log Aktivitas</h3>' +
      '<div style="display:flex; gap:8px; flex-wrap:wrap; margin-bottom:12px; align-items:center;">' +
        '<input type="text" id="logSearchInput" placeholder="🔍 Cari pengguna, aksi, atau detail..." oninput="onSearchLog(this.value)" style="flex:1; min-width:200px; padding:10px 14px; border:1px solid var(--slate-300); border-radius:10px; font-size:14px; font-family:inherit; outline:none;">' +
        '<div style="display:flex; align-items:center; background:#fff; border:1px solid var(--slate-300); border-radius:10px; padding:0 10px;">' +
          '<span style="font-size:16px;">📅</span>' +
          '<input type="date" id="logDateInput" onchange="onFilterDateLog(this.value)" style="border:none; outline:none; padding:10px 6px; font-size:14px; font-family:inherit; background:transparent;">' +
          '<button onclick="clearLogFilter()" style="border:none; background:none; cursor:pointer; padding:0 4px; font-size:16px;" title="Hapus Filter Tanggal">✕</button>' +
        '</div>' +
      '</div>' +
      '<div id="logTableContainer"><div class="empty-state"><span class="em">⏳</span><p>Memuat data log...</p></div></div>' +
    '</div>' +
    '<div class="card">' +
      '<h3 class="section-title" style="margin-top:0; border-bottom:none; padding-bottom:0;">💾 Riwayat Backup Terbaru</h3>' +
      '<div id="backupTableContainer"><div class="empty-state"><span class="em">⏳</span><p>Memuat data backup...</p></div></div>' +
    '</div>';
}
function viewMasterSistem() {
  // Beri jeda sejenak untuk mengisi textarea dengan pengumuman yang aktif saat ini
  setTimeout(function() {
    var inputPeng = document.getElementById('inputPengumuman');
    if (inputPeng) {
      var teksDefault = 'Selamat datang di Sistem Informasi LabCare. Pastikan Sebelum Kerja Teriak " Saya Akan Lawan !!! ".';
      inputPeng.value = localStorage.getItem('labcare_pengumuman') || teksDefault;
    }
  }, 100);

  return '<div class="page-header-flex"><div><h3 style="font-size:17px;font-weight:700;">⚙️ Pengaturan Sistem</h3><p style="font-size:13px;color:var(--slate-500);margin-top:2px;">Kelola pengumuman dashboard dan tindakan khusus admin.</p></div></div>' +
    
    // --- KARTU BARU: PENGATURAN PENGUMUMAN ---
    '<div class="card" style="margin-bottom: 24px; border-radius: 12px; border: 1px solid #e2e8f0;">' +
      '<h3 style="color: #1c1917; margin-bottom: 8px; font-size: 16px; font-weight: 700;">📢 Pengaturan Running Text (Dashboard)</h3>' +
      '<p style="font-size: 13px; color: var(--slate-600); margin-bottom: 16px;">Ubah teks pengumuman yang berjalan di bagian paling atas halaman Dashboard.</p>' +
      '<div class="form-row" style="grid-template-columns: 1fr;">' +
        '<div>' +
          '<label class="lbl">Teks Pengumuman</label>' +
          '<textarea id="inputPengumuman" class="inp-ta" rows="3" placeholder="Ketik pengumuman di sini..."></textarea>' +
        '</div>' +
      '</div>' +
      '<div style="display: flex; gap: 10px; margin-top: 12px;">' +
        '<button type="button" class="btn btn-primary" onclick="simpanPengumumanBaru()">💾 Simpan Pengumuman</button>' +
      '</div>' +
    '</div>' +
    // ------------------------------------------

    // --- KARTU LAMA: ZONA BERBAHAYA ---
    '<div class="card" style="border: 2px solid var(--danger); background: #fff5f5;">' +
      '<h3 style="color: var(--danger); margin-bottom: 8px;">⚠️ Reset Data Pasien</h3>' +
      '<p style="font-size: 13px; color: var(--slate-600); margin-bottom: 16px;">Fitur ini akan <b>menghapus permanen</b> seluruh data pasien (Nama, Hasil Lab, Riwayat). Hanya gunakan fitur ini di akhir tahun untuk mereset penomoran RM.</p>' +
      '<button class="btn" style="background:var(--danger); color:#fff;" onclick="modalResetData()">🗑️ Mulai Proses Reset</button>' +
    '</div>';
}
async function loadLogDanBackup() {
  var logContainer = document.getElementById('logTableContainer');
  var backupContainer = document.getElementById('backupTableContainer');
  if (!logContainer) return;
  try {
    var [resLog, resBackup] = await Promise.all([
      apiCall('getRecentLogs', { search: window._logSearch, date: window._logDate }),
      apiCall('getBackupHistory', {})
    ]);
    if (resLog && resLog.ok && resLog.list.length > 0) {
      var logRows = resLog.list.map(function(l) {
        var warna = l.aksi.includes('Hapus') || l.aksi.includes('Gagal') ? 'color:var(--danger);font-weight:600;' : (l.aksi.includes('Berhasil') ? 'color:var(--success);font-weight:600;' : '');
        return '<tr><td style="font-size:11px;white-space:nowrap;">' + esc(l.waktu) + '</td><td style="font-weight:600;">' + esc(l.pengguna) + '</td><td style="' + warna + '">' + esc(l.aksi) + '</td><td style="font-size:12px;color:var(--slate-500);">' + esc(l.detail) + '</td></tr>';
      }).join('');
      logContainer.innerHTML = '<div class="table-wrap" style="max-height: 400px; overflow-y: auto;"><table><thead><tr><th style="width:120px;">Waktu</th><th>Pengguna</th><th>Aksi</th><th>Detail</th></tr></thead><tbody>' + logRows + '</tbody></table></div>';
    } else {
      logContainer.innerHTML = '<div class="empty-state" style="padding:20px;"><p>Tidak ada log aktivitas yang cocok dengan pencarian.</p></div>';
    }
    if (backupContainer) {
      if (resBackup && resBackup.ok && resBackup.list.length > 0) {
        var backupRows = resBackup.list.map(function(b) {
          var badgeColor = b.kategori === 'Harian' ? 'badge-proses' : (b.kategori === 'Bulanan' ? 'badge-menunggu' : 'badge-selesai');
          return '<tr><td><span class="badge ' + badgeColor + '">' + esc(b.kategori) + '</span></td><td style="font-weight:500;">' + esc(b.nama) + '</td><td style="font-size:12px;">' + esc(b.tanggal) + '</td><td style="font-size:12px;">' + esc(b.ukuran) + '</td><td style="text-align:right; white-space:nowrap;"><a href="' + b.url + '" target="_blank" class="btn btn-secondary btn-sm" style="margin-right:4px;">Buka</a><button class="btn btn-primary btn-sm" onclick="konfirmasiRestore(\'' + b.fileId + '\', \'' + esc(b.nama) + '\', \'' + esc(b.tanggal) + '\')">♻️ Restore</button></td></tr>';
        }).join('');
        backupContainer.innerHTML = '<div class="table-wrap"><table><thead><tr><th>Kategori</th><th>Nama File</th><th>Tanggal Dibuat</th><th>Ukuran</th><th style="text-align:right;">Aksi</th></tr></thead><tbody>' + backupRows + '</tbody></table></div>';
      } else {
        var errorMsg = (resBackup && resBackup.error) ? resBackup.error : 'Belum ada file backup yang terbaca / folder kosong.';
        backupContainer.innerHTML = '<div class="empty-state" style="padding:20px;"><p style="color:var(--danger); font-family:monospace;">ERROR: ' + esc(errorMsg) + '</p></div>';
      }
    }
  } catch (e) {
    if (logContainer) logContainer.innerHTML = '<div class="empty-state"><p>Gagal memuat data Log.</p></div>';
  }
}
var _logSearchTimer;
function onSearchLog(val) {
  window._logSearch = val;
  clearTimeout(_logSearchTimer);
  _logSearchTimer = setTimeout(function() {
    var logContainer = document.getElementById('logTableContainer');
    if (logContainer) logContainer.innerHTML = '<div class="empty-state"><span class="em">⏳</span><p>Mencari...</p></div>';
    apiCall('getRecentLogs', { search: window._logSearch, date: window._logDate }).then(function(resLog) {
       if (resLog && resLog.ok) {
          var logRows = resLog.list.map(function(l) { 
             var warna = l.aksi.includes('Hapus') || l.aksi.includes('Gagal') ? 'color:var(--danger);font-weight:600;' : (l.aksi.includes('Berhasil') ? 'color:var(--success);font-weight:600;' : '');
             return '<tr><td style="font-size:11px;white-space:nowrap;">' + esc(l.waktu) + '</td><td style="font-weight:600;">' + esc(l.pengguna) + '</td><td style="' + warna + '">' + esc(l.aksi) + '</td><td style="font-size:12px;color:var(--slate-500);">' + esc(l.detail) + '</td></tr>'; 
          }).join('');
          logContainer.innerHTML = '<div class="table-wrap" style="max-height: 400px; overflow-y: auto;"><table><thead><tr><th style="width:120px;">Waktu</th><th>Pengguna</th><th>Aksi</th><th>Detail</th></tr></thead><tbody>' + logRows + '</tbody></table></div>';
       } else {
          logContainer.innerHTML = '<div class="empty-state" style="padding:20px;"><p>Tidak ada log yang cocok.</p></div>';
       }
    });
  }, 500);
}
function onFilterDateLog(val) { window._logDate = val; loadLogDanBackup(); }
function clearLogFilter() { window._logDate = ''; window._logSearch = ''; var dateInput = document.getElementById('logDateInput'); var searchInput = document.getElementById('logSearchInput'); if (dateInput) dateInput.value = ''; if (searchInput) searchInput.value = ''; loadLogDanBackup(); }
function viewMasterPuskesmas() {
  setTimeout(loadDataPuskesmas, 100); 
  return '<div class="page-header-flex"><div><h3 style="font-size:17px;font-weight:700;">Akses Puskesmas</h3><p style="font-size:13px;color:var(--slate-500);margin-top:2px;">Kelola persetujuan akun portal Puskesmas.</p></div></div>' +
    '<div id="puskesmasTableWrap"><div class="empty-state"><span class="em">⏳</span><p>Memuat data...</p></div></div>';
}
async function loadDataPuskesmas() {
  var wrap = document.getElementById('puskesmasTableWrap');
  if (!wrap) return;
  var res = await apiCall('getMasterPuskesmas');
  if (!res || !res.ok) { wrap.innerHTML = '<div class="empty-state"><span class="em">❌</span><p>Gagal memuat data Puskesmas.</p></div>'; return; }
  var list = res.list || [];
  var rows = list.map(function(p, i) {
    var badge = p.status === 'Aktif' ? '<span class="badge badge-selesai">Aktif</span>' : '<span class="badge badge-menunggu">Pending</span>';
    var action = p.status === 'Aktif' ? '<span style="font-size:12px;color:var(--slate-400);">Tidak ada aksi</span>' : '<button class="btn btn-primary btn-sm" onclick="aktifkanPuskesmas(\'' + esc(p.nama) + '\')">✔️ Setujui</button>';
    return '<tr><td style="color:var(--slate-500);font-size:12px;">' + (i + 1) + '</td><td style="font-weight:600;">' + esc(p.nama) + '</td><td>' + badge + '</td><td style="text-align:right;">' + action + '</td></tr>';
  }).join('');
  if (list.length === 0) { wrap.innerHTML = '<div class="empty-state"><span class="em">📭</span><p>Belum ada data Puskesmas.</p></div>'; } else { wrap.innerHTML = '<div class="table-wrap"><table><thead><tr><th style="width:50px;">No</th><th>Nama Puskesmas</th><th>Status</th><th style="text-align:right;width:120px;">Aksi</th></tr></thead><tbody>' + rows + '</tbody></table></div>'; }
}
async function aktifkanPuskesmas(nama) {
  if (!confirm('Aktifkan akses untuk "' + nama + '"?')) return;
  showLoading(true);
  var res = await apiCall('approvePuskesmas', { nama_pusk: nama });
  showLoading(false);
  if (res && res.ok) { toastMsg('✅ Akses berhasil diaktifkan', 'ok'); loadDataPuskesmas(); } else { toastMsg(res.error || 'Gagal mengaktifkan akses', 'err'); }
}
