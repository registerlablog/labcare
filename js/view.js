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
// TAMPILAN: PENDAFTARAN & TEST PICKER
// ==========================================
function viewPendaftaran() {
  var dokterField;
  if (dokterList.length > 0) { dokterField = '<select name="dokter" class="inp-sel"><option value="">— Pilih Dokter —</option>' + dokterList.map(function(d) { return '<option value="' + esc(d.nama) + '">' + esc(d.nama) + (d.kode ? ' (' + esc(d.kode) + ')' : '') + '</option>'; }).join('') + '</select>'; }
  else { dokterField = '<input name="dokter" class="inp" placeholder="Ketik nama dokter"><div class="info-box"><span class="info-em">ℹ️</span><span>Belum ada data dokter. Tambahkan di <a onclick="goToMaster(\'dokter\')">Master Lab → Dokter</a>.</span></div>'; }
  var analisField;
  if (analisList.length > 0) { analisField = '<select name="analis" class="inp-sel"><option value="">— Pilih Analis —</option>' + analisList.map(function(a) { return '<option value="' + esc(a.nama) + '">' + esc(a.nama) + (a.kode ? ' (' + esc(a.kode) + ')' : '') + '</option>'; }).join('') + '</select>'; }
  else { analisField = '<input name="analis" class="inp" placeholder="Ketik nama analis"><div class="info-box"><span class="info-em">ℹ️</span><span>Belum ada data analis. Tambahkan di <a onclick="goToMaster(\'analis\')">Master Lab → Analis</a>.</span></div>'; }
  return '<div class="page-header"><h2>Pendaftaran Pasien</h2><p>Daftarkan pasien baru beserta pemeriksaan yang diminta.</p></div>' +
    '<form id="formDaftar" class="card">' +
    '<h3 class="section-title" style="margin-top:0;">A. Data Pasien</h3>' +
    '<div class="form-row">' +
    '<div><label class="lbl">Nama Lengkap *</label><input name="nama" required class="inp" placeholder="Nama pasien"></div>' +
    '<div><label class="lbl">No. Rekam Medis</label><input name="noRM" value="' + nextRM() + '" readonly class="inp"></div>' +
    '<div><label class="lbl">Tanggal Lahir *</label><input type="date" name="tglLahir" required class="inp"></div>' +
    '<div><label class="lbl">Jenis Kelamin *</label><select name="jk" class="inp-sel"><option value="L">Laki-laki</option><option value="P">Perempuan</option></select></div>' +
    '<div><label class="lbl">No. Telepon</label><input name="telepon" class="inp" placeholder="08xxxxxxxxxx"></div>' +
    '<div><label class="lbl">Pengirim</label><input name="pengirim" class="inp" placeholder="Contoh: Puskesmas Bondowoso"></div>' +
    '<div style="grid-column:1/-1;"><label class="lbl">Status Spesimen *</label><div style="display:flex;gap:24px;padding-top:8px;flex-wrap:wrap;">' +
    '<label style="display:flex;align-items:center;gap:8px;cursor:pointer;font-size:14px;"><input type="radio" name="spesimen" value="belum" checked required> 📦 Belum Ada (perlu sampling)</label>' +
    '<label style="display:flex;align-items:center;gap:8px;cursor:pointer;font-size:14px;"><input type="radio" name="spesimen" value="ada" required> 📦 Sudah Ada (dari luar)</label>' +
    '</div></div>' +
    '<div><label class="lbl">Dokter Penanggung Jawab</label>' + dokterField + '</div>' +
    '<div><label class="lbl">Nama Analis</label>' + analisField + '</div>' +
    '</div>' +
    '<div style="margin-top:16px;"><label class="lbl">Alamat</label><textarea name="alamat" rows="2" class="inp-ta" placeholder="Alamat lengkap"></textarea></div>' +
    '<h3 class="section-title">B. Pemeriksaan Laboratorium *</h3>' +
    '<div id="testPickerWrap">' + renderTestPicker() + '</div>' +
    '<div style="margin-top:24px;"><label class="lbl">Catatan Klinis</label><textarea name="catatan" rows="2" class="inp-ta" placeholder="Keluhan / diagnosis / catatan"></textarea></div>' +
    '<div class="btn-row"><button type="submit" class="btn btn-primary">Daftarkan Pasien</button><button type="reset" class="btn btn-secondary" onclick="clearPickedTests()">Reset</button></div></form>';
}
function renderTestPicker() {
  if (TESTS.length === 0) { return '<div class="info-box info-blue"><span class="info-em">ℹ️</span><span>Belum ada pemeriksaan. Tambahkan di <a onclick="goToMaster(\'pemeriksaan\')">Master Lab → Pemeriksaan</a>.</span></div>'; }
  var categories = ['semua'].concat(Array.from(new Set(TESTS.map(function(t) { return t.kategori; }))).sort());
  var katOptions = categories.map(function(k) { var count = k === 'semua' ? TESTS.length : TESTS.filter(function(t) { return t.kategori === k; }).length; var label = k === 'semua' ? '📋 Semua Kategori' : k; return '<option value="' + esc(k) + '"' + (window._katFilter === k ? ' selected' : '') + '>' + label + ' (' + count + ')</option>'; }).join('');
  return '<div class="pick-bar"><div><label class="lbl">Filter Kategori</label><select class="inp-sel" id="katFilter" onchange="changeKatFilter(this.value)">' + katOptions + '</select></div><div><label class="lbl">Cari Pemeriksaan</label><input class="inp" id="pickSearch" placeholder="Ketik nama atau kode..." value="' + esc(window._pickSearch) + '" oninput="onPickSearchChange(this.value)"></div></div>' +
    '<div class="pick-actions"><button type="button" class="btn btn-secondary btn-sm" onclick="selectAllVisible()">✔️ Pilih Semua (Tampil)</button><button type="button" class="btn btn-secondary btn-sm" onclick="clearPickedTests()">🗑️ Bersihkan Semua</button></div>' +
    '<div id="pickSummaryWrap">' + renderPickSummary() + '</div>' +
    '<div class="pick-grid" id="pickGrid">' + renderPickItems() + '</div>';
}
function renderPickSummary() { var picked = Object.keys(window._pickedTests); if (picked.length === 0) return '<div class="pick-chip-row"><span class="empty-text">Belum ada pemeriksaan yang dipilih.</span></div>'; var chips = picked.map(function(kode) { var t = findTest(kode); var nama = t ? t.nama : kode; return '<span class="pick-chip"><span>' + esc(nama) + '</span><button type="button" onclick="removePickedTest(\'' + esc(kode) + '\')" title="Hapus">&times;</button></span>'; }).join(''); return '<div class="pick-chip-row">' + chips + '</div>'; }
function renderPickItems() {
  var filter = window._katFilter; var search = (window._pickSearch || '').toLowerCase();
  var filtered = TESTS.filter(function(t) { var matchKat = filter === 'semua' || t.kategori === filter; var matchSearch = !search || t.kode.toLowerCase().indexOf(search) >= 0 || t.nama.toLowerCase().indexOf(search) >= 0 || t.kategori.toLowerCase().indexOf(search) >= 0; return matchKat && matchSearch; });
  if (filtered.length === 0) return '<div class="pick-empty">Tidak ada pemeriksaan yang cocok dengan filter.</div>';
  return filtered.map(function(t) { var picked = !!window._pickedTests[t.kode]; return '<label class="pick-item' + (picked ? ' picked' : '') + '"><input type="checkbox" ' + (picked ? 'checked' : '') + ' onchange="toggleTestPick(\'' + esc(t.kode) + '\', this.checked)"><div class="pi-body"><div class="pi-name">' + esc(t.nama) + '</div><div class="pi-detail">Rujukan: ' + esc(t.rujukan) + (t.satuan ? ' • ' + esc(t.satuan) : '') + '</div></div><span class="pi-cat">' + esc(t.kategori) + '</span></label>'; }).join('');
}
function refreshPicker() { var wrap = document.getElementById('testPickerWrap'); if (wrap) wrap.innerHTML = renderTestPicker(); }
function changeKatFilter(val) { window._katFilter = val; refreshPicker(); }
function onPickSearchChange(val) { window._pickSearch = val; var grid = document.getElementById('pickGrid'); if (grid) grid.innerHTML = renderPickItems(); }
function toggleTestPick(kode, checked) { if (checked) window._pickedTests[kode] = true; else delete window._pickedTests[kode]; var summary = document.getElementById('pickSummaryWrap'); if (summary) summary.innerHTML = renderPickSummary(); var grid = document.getElementById('pickGrid'); if (grid) grid.innerHTML = renderPickItems(); }
function removePickedTest(kode) { delete window._pickedTests[kode]; var summary = document.getElementById('pickSummaryWrap'); if (summary) summary.innerHTML = renderPickSummary(); var grid = document.getElementById('pickGrid'); if (grid) grid.innerHTML = renderPickItems(); }
function clearPickedTests() { window._pickedTests = {}; refreshPicker(); }
function selectAllVisible() { var filter = window._katFilter; var search = (window._pickSearch || '').toLowerCase(); var filtered = TESTS.filter(function(t) { var matchKat = filter === 'semua' || t.kategori === filter; var matchSearch = !search || t.kode.toLowerCase().indexOf(search) >= 0 || t.nama.toLowerCase().indexOf(search) >= 0 || t.kategori.toLowerCase().indexOf(search) >= 0; return matchKat && matchSearch; }); filtered.forEach(function(t) { window._pickedTests[t.kode] = true; }); refreshPicker(); toastMsg(filtered.length + ' pemeriksaan ditambahkan'); }

// ==========================================
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
// TAMPILAN: INPUT HASIL
// ==========================================
function viewHasil() {
  var tab = window._hasilTab || 'umum';
  var tabsHtml = 
    '<button class="pill' + (tab === 'umum' ? ' active' : '') + '" onclick="window._hasilTab=\'umum\'; render();">👤 Pasien Umum</button>' +
    '<button class="pill' + (tab === 'prolanis' ? ' active' : '') + '" onclick="window._hasilTab=\'prolanis\'; render();">📋 Peserta Prolanis</button>';
  var content = tab === 'prolanis' ? viewHasilProlanis() : viewHasilUmum();
  return '<div class="page-header"><h2>Input Hasil Pemeriksaan</h2><p>Masukkan hasil laboratorium.</p></div>' +
    '<div class="pill-row">' + tabsHtml + '</div>' + content;
}

function viewHasilUmum() {
  var list = patients.slice().sort(function(a, b) { return (b.tglDaftar || '').localeCompare(a.tglDaftar || ''); });
  if (list.length === 0) { return '<div class="page-header-flex"><div><h3 style="font-size:17px;font-weight:700;">Pasien Umum</h3><p style="font-size:13px;color:var(--slate-500);">Belum ada pasien terdaftar.</p></div><button class="btn btn-secondary btn-sm" onclick="modalKalibrasi()">🧮 Atur Kalibrasi</button></div><div class="empty-state"><span class="em">🔬</span><p>Belum ada pasien terdaftar.</p></div>'; }
  var rowsHtml = list.map(function(p) {
    var tests = p.tests || []; var hasil = p.hasil || {};
    var filled = tests.filter(function(k) { return hasil[k]; }).length;
    var done = tests.length > 0 && filled === tests.length;
    return '<tr><td class="mono" style="font-weight:700;color:var(--primary);">' + esc(p.noAntrian) + '</td><td><div style="font-weight:500;">' + esc(p.nama) + '</div><div class="mono" style="font-size:11px;color:var(--slate-400);">' + esc(p.noRM) + '</div></td><td style="font-size:12px;color:var(--slate-500);">' + tests.length + ' tes • <span style="color:' + (done ? 'var(--success)' : 'var(--warning)') + ';font-weight:600;">' + filled + '/' + tests.length + '</span></td><td><span class="badge ' + STATUS[p.status].cls + '">' + STATUS[p.status].label + '</span></td><td style="text-align:right;"><button class="btn btn-primary btn-sm" onclick="modalHasil(\'' + p.id + '\')">' + (done ? 'Edit' : 'Input') + '</button></td></tr>';
  }).join('');
  return '<div class="page-header-flex"><div><h3 style="font-size:17px;font-weight:700;">Pasien Umum</h3><p style="font-size:13px;color:var(--slate-500);">Daftar pasien umum.</p></div><button class="btn btn-secondary btn-sm" onclick="modalKalibrasi()">🧮 Atur Kalibrasi</button></div><div class="table-wrap"><table><thead><tr><th>Antrian</th><th>Pasien</th><th>Pemeriksaan</th><th>Status</th><th style="text-align:right;">Aksi</th></tr></thead><tbody>' + rowsHtml + '</tbody></table></div>';
}
function getColsProlanis(diagnosa) {
  var allCols = ['chol','trig','hdl','ldl','creatin','ureum','hba1c','mikro'];
  var d = String(diagnosa || '').toUpperCase();
  if (d === 'HT') return allCols.filter(function(c) { return c !== 'hba1c'; });
  return allCols;
}

function viewHasilProlanis() {
  var kegId = window._hasilProlanisKegId || null;
  if (kegId) return viewHasilProlanisDetail(kegId);
  // Level 1: Daftar Kegiatan
  var list = window._prolanisList || [];
  if (list.length === 0) {
    return '<div class="empty-state"><span class="em"><svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1"/></svg></span><p>Belum ada kegiatan Prolanis.</p></div>';
  }
  var cols = ['chol','trig','hdl','ldl','creatin','ureum','hba1c','mikro'];
  var cards = list.map(function(keg) {
    var pesertaList = keg.peserta || [];
    var totalFilled = 0, totalAll = 0;
    pesertaList.forEach(function(p) {
      var colsP = getColsProlanis(p.diagnosa);
      totalAll += colsP.length;
      colsP.forEach(function(c) { if (p[c]) totalFilled++; });
    });
    var persen = totalAll > 0 ? Math.round(totalFilled / totalAll * 100) : 0;
    return '<div class="patient-card" style="cursor:pointer;" onclick="bukaHasilProlanisKeg(\'' + esc(keg.id_kegiatan) + '\')">' +
      '<div class="patient-card-head">' +
      '<div><div style="font-size:15px;font-weight:800;">' + esc(keg.nama_kegiatan || '-') + '</div>' +
      '<div style="font-size:11px;color:var(--slate-400);">' + esc(fmtTanggalKeg(keg.tanggal)) + '</div></div>' +
      '<span class="badge badge-proses">' + pesertaList.length + ' peserta</span>' +
      '</div>' +
      (keg.alamat ? '<p class="meta">📍 ' + esc(keg.alamat) + '</p>' : '') +
      '<div style="margin-top:8px;background:var(--slate-100);border-radius:6px;height:6px;overflow:hidden;">' +
      '<div style="background:var(--primary);height:100%;width:' + persen + '%;"></div></div>' +
      '<div style="font-size:11px;color:var(--slate-500);margin-top:4px;">Terisi: <b>' + totalFilled + '/' + totalAll + '</b> (' + persen + '%)</div>' +
      '<div class="patient-card-actions" style="margin-top:10px;">' +
      '<span style="flex:1;font-size:12px;font-weight:600;color:var(--primary);padding:6px 0;">Klik untuk buka →</span>' +
      '</div></div>';
  }).join('');
  return '<div class="patient-grid">' + cards + '</div>';
}

function bukaHasilProlanisKeg(kegId) {
  window._hasilProlanisKegId = kegId;
  render();
}

function viewHasilProlanisDetail(kegId) {
  var keg = (window._prolanisList || []).find(function(x) { return String(x.id_kegiatan) === String(kegId); });
  if (!keg) { window._hasilProlanisKegId = null; return viewHasilProlanis(); }
  var cols = ['chol','trig','hdl','ldl','creatin','ureum','hba1c','mikro'];
  var pesertaList = keg.peserta || [];
  var cardsHtml = pesertaList.map(function(p, idx) {
    var colsP = getColsProlanis(p.diagnosa);
    var totalP = colsP.length;
    var filled = colsP.filter(function(c) { return p[c]; }).length;
    var done = filled === totalP;
    var cls = done ? 'selesai' : (filled > 0 ? 'proses' : 'menunggu');
    var bgColor = p.diagnosa === 'DM' ? '#eff6ff' : (p.diagnosa === 'HT' ? '#fff7ed' : '#fff');
    return '<div class="patient-card ' + cls + '" style="cursor:pointer;background:' + bgColor + ';" onclick="modalHasilProlanis(\'' + esc(kegId) + '\', ' + idx + ')">' +
      '<div class="patient-card-head">' +
      '<div><div class="antrian" style="font-size:16px;">' + esc(p.no || '-') + '</div>' +
      '<div class="rm">' + esc(p.diagnosa || '-') + '</div></div>' +
      '<span class="badge ' + (done ? 'badge-selesai' : (filled > 0 ? 'badge-proses' : 'badge-menunggu')) + '">' + (done ? 'Selesai' : (filled > 0 ? 'Proses' : 'Belum')) + '</span>' +
      '</div>' +
      '<h4 style="margin-bottom:4px;">' + esc(p.nama || '-') + '</h4>' +
      '<div style="margin-top:8px;background:var(--slate-100);border-radius:6px;height:6px;overflow:hidden;">' +
      '<div style="background:var(--primary);height:100%;width:' + (filled/totalP*100) + '%;"></div></div>' +
      '<div style="font-size:11px;color:var(--slate-500);margin-top:4px;">Hasil: <b>' + filled + '/' + totalP + '</b> • Klik untuk input →</div>' +
      '</div>';
  }).join('');
  return '<button class="btn btn-secondary btn-sm" style="margin-bottom:12px;" onclick="window._hasilProlanisKegId=null; render();">← Kembali ke Daftar Kegiatan</button>' +
    '<div class="card" style="margin-bottom:16px;padding:16px;">' +
    '<div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:12px;flex-wrap:wrap;gap:8px;">' +
    '<div><div style="font-size:16px;font-weight:700;">' + esc(keg.nama_kegiatan || '-') + '</div>' +
    '<div style="font-size:12px;color:var(--slate-500);">' + esc(fmtTanggalKeg(keg.tanggal)) + ' • ' + esc(keg.alamat || '-') + '</div></div>' +
    '<span class="badge badge-proses">' + pesertaList.length + ' peserta</span>' +
    '</div>' +
    '<div class="patient-grid">' + (cardsHtml || '<div class="empty-state" style="grid-column:1/-1;"><span class="em"><svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg></span><p>Belum ada peserta.</p></div>') + '</div></div>';
}

// ==========================================
// TAMPILAN: PROLANIS KEGIATAN & PESERTA
// ==========================================
function viewKegiatanProlanis() {
  var list = window._prolanisList || [];
  var search = (window._kegiatanSearch || '').toLowerCase();
  var filter = window._kegiatanFilter || 'semua';
  
  // Filter
  var filtered = list.filter(function(k) {
    // Filter status
    if (filter !== 'semua') {
      var pesertaKeg = k.peserta || [];
      var total = pesertaKeg.length;
      if (total === 0) {
        if (filter === 'belum') return true;
        if (filter === 'proses' || filter === 'selesai') return false;
      } else {
        var allCols = ['chol','trig','hdl','ldl','creatin','ureum','hba1c','mikro'];
        var totalSelesai = pesertaKeg.filter(function(p) {
          var d = String(p.diagnosa || '').toUpperCase();
          var colsP = (d === 'HT') ? allCols.filter(function(c) { return c !== 'hba1c'; }) : allCols;
          var filled = colsP.filter(function(c) { return p[c]; }).length;
          return filled === colsP.length && colsP.length > 0;
        }).length;
        if (filter === 'belum') return totalSelesai === 0;
        if (filter === 'proses') return totalSelesai > 0 && totalSelesai < total;
        if (filter === 'selesai') return totalSelesai === total;
      }
    }
    // Filter Tanggal
    var dateFilter = window._kegiatanDateFilter;
    if (dateFilter) {
      if (String(k.tanggal || '').indexOf(dateFilter) === -1) return false;
    }
    // Search
    if (search) {
      return (k.nama_kegiatan || '').toLowerCase().indexOf(search) >= 0 ||
             (k.pengirim || '').toLowerCase().indexOf(search) >= 0 ||
             (k.alamat || '').toLowerCase().indexOf(search) >= 0 ||
             (k.petugas || '').toLowerCase().indexOf(search) >= 0 ||
             String(k.tanggal || '').indexOf(search) >= 0;
    }
    return true;
  });

  var cards = filtered.map(function(k) {
    var pesertaList = k.peserta || [];
    var jumlah = pesertaList.length || k.peserta_count || 0;
    var totalFilled = 0, totalAll = 0;
    pesertaList.forEach(function(p) {
      var colsP = getColsProlanis(p.diagnosa);
      totalAll += colsP.length;
      colsP.forEach(function(c) { if (p[c]) totalFilled++; });
    });
    var persen = totalAll > 0 ? Math.round(totalFilled / totalAll * 100) : 0;
    return '<div class="patient-card" style="cursor:pointer;margin-bottom:14px;" onclick="bukaKegiatanProlanis(\'' + esc(k.id_kegiatan) + '\')">' +
      '<div class="patient-card-head">' +
      '<div><div style="font-size:16px;font-weight:800;color:var(--slate-800);">' + esc(k.nama_kegiatan || '-') + '</div>' +
      '<div style="font-size:11px;color:var(--slate-400);">' + esc(fmtTanggalKeg(k.tanggal)) + '</div></div>' +
      '<span class="badge badge-proses">' + jumlah + ' peserta</span>' +
      '</div>' +
      '<p class="meta">🏥 Pengirim: ' + esc(k.pengirim || '-') + '</p>' +
      '<p class="meta">📍 Alamat: ' + esc(k.alamat || '-') + '</p>' +
      (k.petugas ? '<p class="meta">👤 Petugas: ' + esc(k.petugas) + '</p>' : '') +
      '<div style="margin-top:12px; background:var(--slate-100); border-radius:6px; height:6px; overflow:hidden;">' +
      '<div style="background:var(--primary); height:100%; width:' + persen + '%; transition:width 0.3s;"></div></div>' +
      '<div style="font-size:11px; color:var(--slate-500); margin-top:6px; display:flex; justify-content:space-between;">' +
      '<span>Terisi: <b>' + totalFilled + '/' + totalAll + '</b></span>' +
      '<span><b>' + persen + '%</b></span>' +
      '</div>' +
      '<div class="patient-card-actions" style="margin-top:10px;">' +
      '<span style="flex:1;font-size:12px;font-weight:600;color:var(--primary);padding:6px 0;">Klik untuk buka →</span>' +
      '<button class="btn-icon" onclick="event.stopPropagation();exportProlanisXLSX(\'' + esc(k.id_kegiatan) + '\')" title="Unduh Excel" style="background:#dcfce7;color:#16a34a;font-weight:bold;">📥</button>' +
      '<button class="btn-icon" onclick="event.stopPropagation();cetakProlanisKegiatan(\'' + esc(k.id_kegiatan) + '\')" title="Cetak PDF Rekap" style="background:#dbeafe;color:#1d4ed8;font-weight:bold;"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg></button>' +
      '<button class="btn-icon danger" onclick="event.stopPropagation();hapusKegiatanProlanis(\'' + esc(k.id_kegiatan) + '\',\'' + esc(k.nama_kegiatan) + '\')" title="Hapus"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg></button>' +
      '<button class="btn-icon" onclick="event.stopPropagation();modalKegiatanProlanis(\'' + esc(k.id_kegiatan) + '\')" title="Edit" style="background:#f3e8ff;color:#7e22ce;"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg></button>' +
      '</div>' +
      '</div>';
  }).join('');
  
  if (list.length === 0) {
    cards = '<div class="empty-state" style="grid-column:1/-1;"><span class="em"><svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1"/></svg></span><p>Belum ada kegiatan Prolanis.</p><p style="margin-top:8px;">Klik "➕ Buat Kegiatan" untuk mulai.</p></div>';
  } else if (filtered.length === 0) {
    cards = '<div class="empty-state" style="grid-column:1/-1;"><span class="em"><svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg></span><p>Tidak ada kegiatan yang cocok dengan filter/pencarian.</p></div>';
  }
  
  var totalSemua = list.length;
  var totalTampil = filtered.length;
  
  return '<div class="page-header-flex"><div><h2>Kegiatan Prolanis</h2><p>Kelola kegiatan pemeriksaan Prolanis</p></div>' +
    '<div style="display:flex;gap:8px;flex-wrap:wrap;">' +
    '<button class="btn btn-primary" onclick="modalKegiatanProlanis()">➕ Buat Kegiatan</button>' +
    '<button class="btn btn-secondary" onclick="syncAllFromServer(false)">🔄 Refresh</button>' +
    '</div></div>' +
    
    '<div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:10px;align-items:center;">' +
    '<input type="text" id="kegiatanSearchInput" placeholder="🔍 Cari nama kegiatan / pengirim / petugas / tanggal..." value="' + esc(window._kegiatanSearch || '') + '" oninput="onSearchKegiatan(this.value)" style="flex:1;min-width:250px;padding:10px 14px;border:1px solid var(--slate-300);border-radius:10px;font-size:14px;font-family:inherit;outline:none;">' +
    '<div style="display:flex;align-items:center;background:#fff;border:1px solid var(--slate-300);border-radius:10px;padding:0 10px;">' +
      '<span style="font-size:16px;">📅</span>' +
      '<input type="date" value="' + (window._kegiatanDateFilter || '') + '" onchange="onFilterDateKegiatan(this.value)" style="border:none;outline:none;padding:10px 6px;font-size:14px;font-family:inherit;background:transparent;">' +
      (window._kegiatanDateFilter ? '<button onclick="onFilterDateKegiatan(\'\')" style="border:none;background:none;cursor:pointer;padding:0 4px;font-size:16px;" title="Hapus Filter Tanggal">✕</button>' : '') +
    '</div>' +
    '<select onchange="onFilterKegiatan(this.value)" style="padding:10px 14px;border:1px solid var(--slate-300);border-radius:10px;font-size:14px;font-family:inherit;background:#fff;outline:none;">' +
    '<option value="semua"' + (filter === 'semua' ? ' selected' : '') + '>📋 Semua</option>' +
    '<option value="belum"' + (filter === 'belum' ? ' selected' : '') + '>⏳ Belum Selesai</option>' +
    '<option value="proses"' + (filter === 'proses' ? ' selected' : '') + '>✏️ Sedang Proses</option>' +
    '<option value="selesai"' + (filter === 'selesai' ? ' selected' : '') + '>✅ Selesai Semua</option>' +
    '</select>' +
    '<span style="font-size:13px;color:var(--slate-500);font-weight:600;">' + totalTampil + ' dari ' + totalSemua + ' kegiatan</span>' +
    '</div>' +
    '<div style="font-size:12px;color:var(--slate-500);margin-bottom:16px;font-style:italic;">' +
    '💡 Jika tidak menemukan data berdasarkan tgl pelaksanaan, coba cari berdasarkan tanggal klaim.' +
    '</div>' +
    '<div class="patient-grid">' + cards + '</div>';
}

function onSearchKegiatan(val) {
  window._kegiatanSearch = val;
  document.getElementById('app').innerHTML = viewKegiatanProlanis();
  var input = document.getElementById('kegiatanSearchInput');
  if (input) { input.focus(); input.setSelectionRange(val.length, val.length); }
}

function onFilterKegiatan(val) {
  window._kegiatanFilter = val;
  document.getElementById('app').innerHTML = viewKegiatanProlanis();
}
function onFilterDateKegiatan(val) {
  window._kegiatanDateFilter = val;
  document.getElementById('app').innerHTML = viewKegiatanProlanis();
}

/* ===== SEARCH & FILTER PESERTA PROLANIS ===== */
function buildProlanisRowsHtml() {
  var k = window._prolanisDetail;
  if (!k) return { rowsHtml: '', count: 0, total: 0 };
  var pesertaList = k.peserta || [];
  var filter = window._prolanisFilter || 'semua';
  var search = (window._prolanisSearch || '').toLowerCase();
  
  var indexed = pesertaList.map(function(p, i) { return { idx: i, p: p }; });
  var allCols = ['chol','trig','hdl','ldl','creatin','ureum','hba1c','mikro'];
  
  if (filter !== 'semua') {
    indexed = indexed.filter(function(x) {
      var d = String(x.p.diagnosa || '').toUpperCase();
      var colsP = (d === 'HT') ? allCols.filter(function(c) { return c !== 'hba1c'; }) : allCols;
      var filled = colsP.filter(function(c) { return x.p[c]; }).length;
      if (filter === 'belum') return filled === 0;
      if (filter === 'proses') return filled > 0 && filled < colsP.length;
      if (filter === 'selesai') return filled === colsP.length && colsP.length > 0;
      return true;
    });
  }
  
  if (search) {
    indexed = indexed.filter(function(x) {
      return (x.p.nama || '').toLowerCase().indexOf(search) >= 0 ||
             (x.p.nik || '').toLowerCase().indexOf(search) >= 0 ||
             (x.p.no || '').toLowerCase().indexOf(search) >= 0;
    });
  }
  
  var cols = ['chol','trig','hdl','ldl','creatin','ureum','hba1c','mikro'];
  
  var rowsHtml = indexed.map(function(item) {
    var p = item.p;
    var idx = item.idx;
    var inputs = cols.map(function(c) {
      return '<td><input class="inp" style="padding:6px 8px;font-size:12px;width:70px;" value="' + esc(cleanValue(p[c] || '')) + '" oninput="updatePesertaField(' + idx + ',\'' + c + '\',this.value)" placeholder="-"></td>';
    }).join('');
    return '<tr>' +
      '<td style="text-align:center;"><input class="inp" readonly style="padding:6px 8px;font-size:12px;width:80px;text-align:center;font-weight:700;color:var(--primary);background:var(--slate-100);cursor:not-allowed;" value="' + esc(p.no || '') + '"></td>' +
      '<td><input class="inp" style="padding:6px 8px;font-size:12px;width:180px;" value="' + esc(p.nama || '') + '" oninput="updatePesertaField(' + idx + ',\'nama\',this.value)"></td>' +
      '<td><input class="inp" type="date" style="padding:6px 8px;font-size:12px;width:130px;" value="' + esc((p.tgl_lahir || '').slice(0,10)) + '" oninput="updatePesertaField(' + idx + ',\'tgl_lahir\',this.value)"></td>' +
      '<td><select class="inp-sel" style="padding:6px 8px;font-size:12px;width:100px;" onchange="updatePesertaField(' + idx + ',\'diagnosa\',this.value)"><option value="">-</option><option value="DM"' + (p.diagnosa === 'DM' ? ' selected' : '') + '>DM</option><option value="HT"' + (p.diagnosa === 'HT' ? ' selected' : '') + '>HT</option></select></td>' +
      inputs +
      '<td style="text-align:center;white-space:nowrap;">' +
      '<button class="btn-icon" onclick="cetakProlanisPeserta(\'' + esc(k.id_kegiatan) + '\',' + idx + ')" title="Cetak PDF" style="background:#dbeafe;color:#1d4ed8;"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg></button> ' +
      '<button class="btn-icon danger" onclick="hapusPesertaProlanis(' + idx + ')" title="Hapus"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg></button>' +
      '</td>' +
      '</tr>';
  }).join('');
  
  return { rowsHtml: rowsHtml, count: indexed.length, total: pesertaList.length };
}

function renderProlanisTbody() {
  var result = buildProlanisRowsHtml();
  var tbody = document.getElementById('prolanisTbody');
  if (tbody) {
    tbody.innerHTML = result.rowsHtml || '<tr><td colspan="13" style="padding:40px;text-align:center;color:var(--slate-400);">Tidak ada peserta yang cocok.</td></tr>';
  }
  var count = document.getElementById('prolanisCount');
  if (count) count.textContent = result.count + ' dari ' + result.total + ' peserta';
}

function onSearchProlanis(val) {
  window._prolanisSearch = val;
  renderProlanisTbody();
}

function onFilterProlanis(val) {
  window._prolanisFilter = val;
  renderProlanisTbody();
}

function viewDetailKegiatan() {
  var k = window._prolanisDetail;
  if (!k) { view = 'prolanis'; return viewKegiatanProlanis(); }
  var pesertaList = (k.peserta || []);
  var cols = ['chol','trig','hdl','ldl','creatin','ureum','hba1c','mikro'];
  var colLabel = { chol:'CHOL', trig:'TRIG', hdl:'HDL', ldl:'LDL', creatin:'CREA', ureum:'UREA', hba1c:'HbA1c', mikro:'MIKRO' };
  var headerCols = cols.map(function(c) { return '<th style="text-align:center;">' + colLabel[c] + '</th>'; }).join('');
  var result = buildProlanisRowsHtml();
  
  return '<div class="page-header-flex"><div>' +
    '<button class="btn btn-secondary btn-sm" onclick="window._prolanisDetail=null;window._prolanisFilter=\'semua\';window._prolanisSearch=\'\';view=\'prolanis\';render();" style="margin-bottom:8px;">← Kembali</button>' +
    '<h2 style="margin-top:8px;">' + esc(k.nama_kegiatan || '-') + '</h2>' +
    '<p>' + esc(fmtTanggalKeg(k.tanggal)) + ' • ' + esc(k.pengirim || '-') + ' • ' + esc(k.alamat || '-') + '</p>' +
    '<p style="margin-top:4px;font-weight:600;color:var(--primary);">' + pesertaList.length + ' peserta</p>' +
    '</div>' +
    '<div style="display:flex;gap:8px;flex-wrap:wrap;">' +
    '<button class="btn btn-primary" onclick="tambahPesertaProlanis()">➕ Tambah</button>' +
    '<button class="btn btn-secondary" onclick="uploadExcelProlanis()">📁 Upload Excel</button>' +
    '<button class="btn btn-secondary" onclick="pasteExcelProlanis()">📋 Paste Excel</button>' +
    '<button class="btn btn-secondary" onclick="downloadTemplateProlanis()">📥 Template</button>' +
    '<button class="btn btn-secondary" onclick="simpanDetailKegiatan()">Simpan</button>' +
    '</div></div>' +
    '<div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:12px;align-items:center;">' +
    '<input type="text" id="prolanisSearchInput" placeholder="🔍 Cari nama / NIK / no..." value="' + esc(window._prolanisSearch || '') + '" oninput="onSearchProlanis(this.value)" style="flex:1;min-width:200px;padding:10px 14px;border:1px solid var(--slate-300);border-radius:10px;font-size:14px;font-family:inherit;outline:none;">' +
    '<select onchange="onFilterProlanis(this.value)" style="padding:10px 14px;border:1px solid var(--slate-300);border-radius:10px;font-size:14px;font-family:inherit;background:#fff;outline:none;">' +
    '<option value="semua"' + (window._prolanisFilter === 'semua' ? ' selected' : '') + '>📋 Semua</option>' +
    '<option value="belum"' + (window._prolanisFilter === 'belum' ? ' selected' : '') + '>⏳ Belum Diisi</option>' +
    '<option value="proses"' + (window._prolanisFilter === 'proses' ? ' selected' : '') + '>✏️ Proses</option>' +
    '<option value="selesai"' + (window._prolanisFilter === 'selesai' ? ' selected' : '') + '>✅ Selesai</option>' +
    '</select>' +
    '<span id="prolanisCount" style="font-size:13px;color:var(--slate-500);font-weight:600;">' + result.count + ' dari ' + result.total + ' peserta</span>' +
    '</div>' +
    '<div class="table-wrap"><table style="min-width:1400px;">' +
    '<thead><tr><th style="width:100px;text-align:center;">No. Sample</th><th>Nama</th><th>Tgl Lahir</th><th>Diagnosa</th>' + headerCols + '<th style="text-align:center;">Aksi</th></tr></thead>' +
    '<tbody id="prolanisTbody">' + (result.rowsHtml || '<tr><td colspan="13" style="padding:40px;text-align:center;color:var(--slate-400);">Belum ada peserta.</td></tr>') + '</tbody>' +
    '</table></div>';
}

// ==========================================
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
  return '<div class="page-header-flex"><div><h3 style="font-size:17px;font-weight:700;">⚙️ Pengaturan Sistem</h3><p style="font-size:13px;color:var(--slate-500);margin-top:2px;">Zona Berbahaya (Hanya untuk Admin).</p></div></div>' +
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
