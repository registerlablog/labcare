// TAMPILAN: PENDAFTARAN & TEST PICKER
// ==========================================
// --- FUNGSI BANTUAN UNTUK ID & ANTRIAN (PLACEHOLDER) ---
function nextID() {
  // CATATAN: Idealnya ID ini di-generate dari database / Google Apps Script.
  // Untuk sementara kita buat dummy berbasis waktu (Unix Timestamp).
  return 'P-' + Date.now().toString().slice(-6);
}

function nextAntrian() {
  // CATATAN: Logika antrian asli harus mengambil sisa antrian dari server.
  // Untuk sementara kita buat dummy acak 1-20.
  var nomor = Math.floor(Math.random() * 20) + 1;
  return 'A-' + nomor.toString().padStart(3, '0');
}
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
    '<div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 16px;">' +
      '<div><label class="lbl">ID Pasien</label><input name="idPasien" value="' + nextID() + '" readonly class="inp" style="background-color:#f3f4f6; color:#6b7280; cursor:not-allowed;"></div>' +
      '<div><label class="lbl">No. Antrian</label><input name="noAntrian" value="' + nextAntrian() + '" readonly class="inp" style="background-color:#ecfdf5; color:#047857; font-weight:700; border:1.5px solid #10b981; cursor:not-allowed;"></div>' +
      '<div><label class="lbl">No. Rekam Medis</label><input name="noRM" value="' + nextRM() + '" readonly class="inp" style="background-color:#f3f4f6; color:#6b7280; cursor:not-allowed;"></div>' +
    '</div>' +
    '<div class="form-row">' +
    '<div><label class="lbl">Nama Lengkap *</label><input name="nama" required class="inp" placeholder="Nama pasien"></div>' +
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

