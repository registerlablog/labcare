// TAMPILAN: PENDAFTARAN & TEST PICKER
function viewPendaftaran() {
  var dokterField;
  if (dokterList.length > 0) { dokterField = '<select name="dokter" class="inp-sel"><option value="">— Pilih Dokter —</option>' + dokterList.map(function(d) { return '<option value="' + esc(d.nama) + '">' + esc(d.nama) + (d.kode ? ' (' + esc(d.kode) + ')' : '') + '</option>'; }).join('') + '</select>'; }
  else { dokterField = '<input name="dokter" class="inp" placeholder="Ketik nama dokter"><div class="info-box"><span class="info-em">ℹ️</span><span>Belum ada data dokter. Tambahkan di <a onclick="goToMaster(\'dokter\')">Master Lab → Dokter</a>.</span></div>'; }
  
  var analisField;
  if (analisList.length > 0) { analisField = '<select name="analis" class="inp-sel"><option value="">— Pilih Analis —</option>' + analisList.map(function(a) { return '<option value="' + esc(a.nama) + '">' + esc(a.nama) + (a.kode ? ' (' + esc(a.kode) + ')' : '') + '</option>'; }).join('') + '</select>'; }
  else { analisField = '<input name="analis" class="inp" placeholder="Ketik nama analis"><div class="info-box"><span class="info-em">ℹ️</span><span>Belum ada data analis. Tambahkan di <a onclick="goToMaster(\'analis\')">Master Lab → Analis</a>.</span></div>'; }

  // Panggil fungsi pengambil nomor secara async (di latar belakang)
  setTimeout(fetchAutoNumbers, 100);

  return '<div class="page-header"><h2>Pendaftaran Pasien</h2><p>Daftarkan pasien baru beserta pemeriksaan yang diminta.</p></div>' +
    '<form id="formDaftar" class="card" onsubmit="event.preventDefault();">' +
    '<h3 class="section-title" style="margin-top:0;">A. Data Pasien</h3>' +
    
    // TAMBAHKAN ID PADA INPUT AGAR BISA DIUBAH OLEH JAVASCRIPT
'<div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 24px; border-bottom: 2px dashed #e5e7eb; padding-bottom: 16px;">' +
  '<div>' +
    '<label class="lbl" style="color: #6b7280;">ID Pasien</label>' +
    '<div id="autoIdPasien" style="font-size: 16px; font-weight: 700; color: #374151; margin-top: 4px;">Memuat...</div>' +
    // PERBAIKAN: Ubah name="idPasien" menjadi name="id"
    '<input type="hidden" name="id" id="hiddenIdPasien">' + 
  '</div>' +
  '<div>' +
    '<label class="lbl" style="color: #6b7280;">No. Antrian</label>' +
    '<div id="autoNoAntrian" style="font-size: 20px; font-weight: 800; color: #0f766e; margin-top: 2px;">Memuat...</div>' +
    '<input type="hidden" name="noAntrian" id="hiddenNoAntrian">' +
  '</div>' +
  '<div>' +
    '<label class="lbl" style="color: #6b7280;">No. Rekam Medis</label>' +
    '<div id="autoNoRM" style="font-size: 16px; font-weight: 700; color: #374151; margin-top: 4px;">Memuat...</div>' +
    '<input type="hidden" name="noRM" id="hiddenNoRM">' +
  '</div>' +
  // PERBAIKAN: Tambahkan input tersembunyi untuk tanggal pendaftaran
  '<input type="hidden" name="tglDaftar" value="' + new Date().toISOString() + '">' +
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
    '<div class="btn-row"><button type="button" class="btn btn-primary" onclick="prosesSimpanPasien()">Daftarkan Pasien</button><button type="reset" class="btn btn-secondary" onclick="clearPickedTests()">Reset</button></div></form>';
}

async function fetchAutoNumbers() {
  var res = await apiCall('getNextNumbers');
  
  if (res && res.ok) {
    var elId = document.getElementById('autoIdPasien');
    var elAnt = document.getElementById('autoNoAntrian');
    var elRM = document.getElementById('autoNoRM');
    
    var hidId = document.getElementById('hiddenIdPasien');
    var hidAnt = document.getElementById('hiddenNoAntrian');
    var hidRM = document.getElementById('hiddenNoRM');

    if (elId) elId.textContent = res.id;
    if (elRM) elRM.textContent = res.rm;
    if (hidId) hidId.value = res.id;
    if (hidRM) hidRM.value = res.rm;

    // ✅ PERBAIKAN: Jangan timpa nomor antrian JIKA form dibuka dari menu Antrian Pendaftaran
    if (!window._isDariAntrian) {
      if (elAnt) elAnt.textContent = res.antrian;
      if (hidAnt) hidAnt.value = res.antrian;
      var antrianNum = parseInt(res.antrian.replace(/\D/g, ''));
      localStorage.setItem('labcare_last_generated_Q', antrianNum);
    }

  } else {
    // ... (biarkan kode error seperti aslinya)
  }
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
function prosesSimpanPasien() {
  var form = document.getElementById('formDaftar');
  var f = new FormData(form);
  var tests = Object.keys(window._pickedTests || {});
  
  if (tests.length === 0) { 
    alert('Pilih minimal satu pemeriksaan laboratorium.'); 
    return; 
  }

  var spesimen = f.get('spesimen') || 'belum';
  var statusAwal = spesimen === 'ada' ? 'proses' : 'menunggu';
  
  var p = { 
    id: f.get('id') || uid(), 
    noRM: f.get('noRM'), 
    nama: f.get('nama').trim(), 
    tglLahir: f.get('tglLahir'), 
    jk: f.get('jk'), 
    telepon: f.get('telepon'), 
    pengirim: (f.get('pengirim') || '').trim(), 
    dokter: f.get('dokter'), 
    analis: f.get('analis'), 
    alamat: f.get('alamat'), 
    catatan: f.get('catatan'), 
    tests: tests, 
    hasil: {}, 
    status: statusAwal, 
    spesimen: spesimen, 
    noAntrian: f.get('noAntrian'), 
    tglDaftar: new Date().toISOString(), 
    kesimpulan: '' 
  };
  
  patients.push(p); 
  save(); 
  apiCall('savePasien', p);
  
  form.reset(); 
  window._pickedTests = {}; 
  window._katFilter = 'semua'; 
  window._pickSearch = '';
  window._isDariAntrian = false;
  
  document.getElementById('modalContent').innerHTML = '<div class="modal-success"><div class="big-em">✅</div><h3>Pasien Terdaftar</h3><p>' + esc(p.nama) + ' — ' + esc(p.noRM) + '</p><div class="success-number-box"><p>Nomor Antrian</p><div class="big-no">' + esc(p.noAntrian) + '</div></div>' +
    '<div style="display:flex;gap:8px;">' +
    '<button class="btn btn-secondary" style="flex:1;" onclick="closeModal(); view=\'antrian\'; renderNav(); render();">📋 Antrian</button>' +
    '<button class="btn btn-primary" style="flex:1;" onclick="inputHasilPasien(\'' + p.id + '\')">🔬 Input Hasil</button>' +
    '</div></div>';
  document.getElementById('modal').classList.add('open');
}
async function fetchAutoNumbers() {
  var res = await apiCall('getNextNumbers');
  
  if (res && res.ok) {
    // 1. Update Tampilan Teks (Div)
    var elId = document.getElementById('autoIdPasien');
    var elAnt = document.getElementById('autoNoAntrian');
    var elRM = document.getElementById('autoNoRM');
    if (elId) elId.textContent = res.id;
    if (elAnt) elAnt.textContent = res.antrian;
    if (elRM) elRM.textContent = res.rm;
    
    // 2. Update Nilai Hidden Input
    var hidId = document.getElementById('hiddenIdPasien');
    var hidAnt = document.getElementById('hiddenNoAntrian');
    var hidRM = document.getElementById('hiddenNoRM');
    if (hidId) hidId.value = res.id;
    if (hidAnt) hidAnt.value = res.antrian;
    if (hidRM) hidRM.value = res.rm;

    // ✅ TAMBAHKAN BARIS INI:
    // Simpan nomor antrian terakhir yang di-booking ke LocalStorage
    var antrianNum = parseInt(res.antrian.replace(/\D/g, '')); // Ambil angkanya saja (misal "A-003" jadi 3)
    localStorage.setItem('labcare_last_generated_Q', antrianNum);

  } else {
    // ... (kode error biarkan seperti sebelumnya)
  }
}
// FUNGSI BARU: TAMPILAN ANTRIAN PENDAFTARAN (TIKET FISIK)
function viewAntrianPendaftaran() {
  var list = JSON.parse(localStorage.getItem('labcare_antrian_pendaftaran') || '[]');
  
  var listHtml = '';
  if (list.length === 0) {
    listHtml = '<div class="empty-state" style="padding: 40px; text-align: center; background: #f8fafc; border-radius: 12px; border: 1px dashed #cbd5e1;"><span style="font-size: 40px; display: block; margin-bottom: 10px;">🎫</span><h3 style="margin:0; color:#334155;">Belum Ada Antrian</h3><p style="color:#64748b; font-size: 14px;">Silakan cetak tiket di halaman Dashboard.</p></div>';
  } else {
    listHtml = '<div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 16px;">' +
      list.map(function(item) {
        var jam = new Date(item.waktuCetak).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
        return '<div class="card" style="padding: 20px; border-left: 4px solid #0f766e; display: flex; justify-content: space-between; align-items: center; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">' +
          '<div>' +
            '<div style="font-size: 11px; font-weight: 700; color: #64748b; margin-bottom: 4px;">TIKET DICETAK (Jam ' + jam + ')</div>' +
            '<div style="font-size: 28px; font-weight: 900; color: #0f766e; line-height: 1;">' + item.noAntrian + '</div>' +
          '</div>' +
          '<button onclick="daftarkanDariAntrian(\'' + item.noAntrian + '\')" class="btn btn-primary" style="padding: 10px 16px; border-radius: 8px; font-size: 13px;">Daftarkan</button>' +
        '</div>';
      }).join('') + '</div>';
  }

  return '<div class="page-header"><h2>Antrian Pendaftaran</h2><p>Daftar tiket walk-in yang sudah dicetak dan menunggu untuk diinput datanya.</p></div>' +
    '<div class="card" style="padding: 24px;">' + listHtml + '</div>';
}

// FUNGSI BARU: JEMBATAN DARI ANTRIAN KE FORM PENDAFTARAN
function daftarkanDariAntrian(noAntrian) {
  // 1. Set penanda bahwa kita sedang mendaftar dari antrian
  window._isDariAntrian = true;

  // 2. Pindah ke halaman form pendaftaran
  view = 'pendaftaran';
  renderNav(); 
  
  // 3. Render form (Gunakan ID 'app')
  document.getElementById('app').innerHTML = viewPendaftaran(); 
  
  setTimeout(function() {
    // 4. Isi kolom No. Antrian secara paksa
    var elAnt = document.getElementById('autoNoAntrian');
    if (elAnt) elAnt.textContent = noAntrian;
    
    var hidAnt = document.getElementById('hiddenNoAntrian');
    if (hidAnt) hidAnt.value = noAntrian;

    // 5. Hapus dari daftar tunggu (LocalStorage)
    var list = JSON.parse(localStorage.getItem('labcare_antrian_pendaftaran') || '[]');
    var newList = list.filter(function(item) { return item.noAntrian !== noAntrian; });
    localStorage.setItem('labcare_antrian_pendaftaran', JSON.stringify(newList));
  }, 200);
}
