function navIcon(name) {
  var icons = {
    dashboard: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="9" rx="1"/><rect x="14" y="3" width="7" height="5" rx="1"/><rect x="14" y="12" width="7" height="9" rx="1"/><rect x="3" y="16" width="7" height="5" rx="1"/></svg>',
    'user-plus': '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg>',
    clock: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',
    flask: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 3h6v6l4 8a2 2 0 0 1-2 3H7a2 2 0 0 1-2-3l4-8V3z"/><path d="M9 3h6"/></svg>',
    file: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>',
    clipboard: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1"/></svg>',
    settings: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>',
    logout: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>',
    sync: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>'
  };
  return icons[name] || '';
}
function renderNav() {
  // Ambil jabatan user
  var userRole = (localStorage.getItem('labcare_role') || '').toLowerCase();
  var isAdmin = userRole.indexOf('admin') !== -1; // HANYA ADMIN

  // Filter menu: Jika adminOnly tapi bukan admin, jangan tampilkan
  var html = NAV_ITEMS.filter(function(i) {
    if (i.adminOnly && !isAdmin) return false;
    return true;
  }).map(function(i) {
    return '<button class="nav-btn' + (view === i.view ? ' active' : '') + '" data-view="' + i.view + '"><span class="nav-icon">' + navIcon(i.icon) + '</span><span>' + i.label + '</span></button>';
  }).join('');

  document.getElementById('nav').innerHTML = html;
  
  document.getElementById('mobileNav').innerHTML = html + 
  '<div style="margin-top: 10px; padding-top: 10px; border-top: 1px solid var(--border);">' +
    '<button class="nav-btn" onclick="doLogoutAdmin()" style="color: #dc2626;"><span class="nav-icon">' + navIcon('logout') + '</span><span>Logout</span></button>' +
  '</div>';
  
  document.querySelectorAll('.nav-btn[data-view]').forEach(function(b) {
    b.onclick = function() {
      view = b.dataset.view;
      mobileNavOpen = false;
      document.getElementById('mobileNav').classList.remove('open');
      renderNav();
      render();
    };
  });
}
function toggleMobileNav() { mobileNavOpen = !mobileNavOpen; document.getElementById('mobileNav').classList.toggle('open', mobileNavOpen); }
function render() {
  // Cek Hak Akses
  var userRole = (localStorage.getItem('labcare_role') || '').toLowerCase();
  var isAdmin = userRole.indexOf('admin') !== -1;
  
  // HANYA MASTER LAB yang dikunci
  if (view === 'master' && !isAdmin) {
    view = 'dashboard';
    toastMsg('Akses ditolak: Anda tidak memiliki izin ke Master Lab.', 'err');
  }
  var app = document.getElementById('app');
  app.className = 'fade-in';
  if (view === 'dashboard')        app.innerHTML = viewDashboard();
  else if (view === 'pendaftaran') app.innerHTML = viewPendaftaran();
  else if (view === 'antrian')     app.innerHTML = viewAntrian();
  else if (view === 'hasil')       app.innerHTML = viewHasil();
  else if (view === 'laporan')     app.innerHTML = viewLaporan();
  else if (view === 'prolanis')         app.innerHTML = viewKegiatanProlanis();
  else if (view === 'prolanis-detail')  app.innerHTML = viewDetailKegiatan();
  else if (view === 'master')      app.innerHTML = viewMaster();
  window.scrollTo(0, 0);
}
var _panggilTimer;
function mainkanChime(callback) { try { var audio = new Audio('assets/audio/universfield-attention-chime-123107.mp3'); audio.volume = 0.7; audio.play().then(function() { setTimeout(function() { if (callback) callback(); }, 2000); }).catch(function(error) { if (callback) callback(); }); } catch (e) { if (callback) callback(); } }
function panggilPasien(id) {
  var p = patients.find(function(x) { return x.id === id; }); if (!p) return;
  document.getElementById('panggilNo').textContent = p.noAntrian || 'A-000';
  document.getElementById('panggilNama').textContent = p.nama || '';
  var ov = document.getElementById('panggilOverlay'); ov.classList.add('open');
  mainkanChime(function() { try { speechSynthesis.cancel(); var nomorStr = (p.noAntrian || 'A-000').replace('A-', '').split('').join(' '); var teks = 'Nomor antrian A - ' + nomorStr + ', silakan menuju ruang sampling'; var voices = speechSynthesis.getVoices(); var suaraID = voices.find(function(v) { return v.lang === 'id-ID' || v.lang.indexOf('id') === 0; }); var utt = new SpeechSynthesisUtterance(teks); utt.lang = 'id-ID'; utt.rate = 0.85; utt.pitch = 0.85; utt.volume = 1; if (suaraID) utt.voice = suaraID; utt.onend = function() { setTimeout(function() { var utt2 = new SpeechSynthesisUtterance(teks); utt2.lang = 'id-ID'; utt2.rate = 0.85; utt2.pitch = 0.85; utt2.volume = 1; if (suaraID) utt2.voice = suaraID; utt2.onend = function() { setTimeout(function() { tutupPanggil(); }, 500); }; speechSynthesis.speak(utt2); }, 700); }; speechSynthesis.speak(utt); } catch (e) {} });
  if (p.status === 'menunggu') { p.status = 'proses'; save(); apiCall('savePasien', p); render(); }
}
function tutupPanggil() { var ov = document.getElementById('panggilOverlay'); if (ov) ov.classList.remove('open'); clearTimeout(_panggilTimer); try { speechSynthesis.cancel(); } catch (e) {} }
function modalHasilProlanis(kegId, idx) {
  var keg = (window._prolanisList || []).find(function(x) { return String(x.id_kegiatan) === String(kegId); });
  if (!keg) { toastMsg('Kegiatan tidak ditemukan', 'err'); return; }
  var p = (keg.peserta || [])[idx];
  if (!p) { toastMsg('Peserta tidak ditemukan', 'err'); return; }
  var cols = [
  { key: 'chol',    kode: 'LAB-014', label: 'CHOL',  fbSatuan: 'mg/dL', fbRujukan: '< 200' },
  { key: 'trig',    kode: 'LAB-015', label: 'TRIG',  fbSatuan: 'mg/dL', fbRujukan: '< 150' },
  { key: 'hdl',     kode: 'LAB-016', label: 'HDL',   fbSatuan: 'mg/dL', fbRujukan: '> 40' },
  { key: 'ldl',     kode: 'LAB-017', label: 'LDL',   fbSatuan: 'mg/dL', fbRujukan: '< 130' },
  { key: 'creatin', kode: 'LAB-018', label: 'CREA',  fbSatuan: 'mg/dL', fbRujukan: '0.6-1.3' },
  { key: 'ureum',   kode: 'LAB-019', label: 'UREA',  fbSatuan: 'mg/dL', fbRujukan: '15-45' },
  { key: 'hba1c',   kode: 'LAB-061', label: 'HbA1c', fbSatuan: '%',     fbRujukan: '4.0-6.0' },
  { key: 'mikro',   kode: 'LAB-062', label: 'MIKRO', fbSatuan: 'mg/L',  fbRujukan: '< 20' }
];
  var isHT = (p.diagnosa || '').toUpperCase() === 'HT';
  var fieldsHtml = cols.map(function(c) {
  var master = findTest(c.kode);
  var satuan = (master && master.satuan) ? master.satuan : c.fbSatuan;
  var rujukan = (master && master.rujukan) ? master.rujukan : c.fbRujukan;
  var isHba1c = c.key === 'hba1c';
  var disabled = isHba1c && isHT;
  var val = disabled ? '' : cleanValue(p[c.key] || '');
  return '<div style="display:flex;align-items:center;gap:10px;padding:10px 0;border-bottom:1px solid var(--slate-100);' + (disabled ? 'opacity:0.5;' : '') + '">' +
    '<div style="flex:1;min-width:0;">' +
    '<div style="font-size:14px;font-weight:600;">' + c.label + (disabled ? ' <span style="font-size:10px;color:var(--slate-400);">(tidak untuk HT)</span>' : '') + '</div>' +
    '<div style="font-size:11px;color:var(--slate-400);">Rujukan: ' + rujukan + ' ' + satuan + '</div></div>' +
    '<input id="ph_' + c.key + '" type="text" class="inp" style="width:110px;padding:8px 10px;font-size:14px;" value="' + esc(val) + '" placeholder="' + (disabled ? 'N/A' : '-') + '"' + (disabled ? ' disabled' : '') + '>' +
    '</div>';
}).join('');
  var html = '<div class="modal-body">' +
    '<div class="modal-head"><div><h3>Input Hasil Prolanis</h3><p>' + esc(p.nama || '-') + ' • ' + esc(p.no || '-') + '</p></div>' +
    '<button class="modal-close" onclick="closeModal()">&times;</button></div>' +
    '<div class="info-box info-blue" style="margin-bottom:12px;"><span class="info-em">ℹ️</span><span>Diagnosa: <b>' + esc(p.diagnosa || '-') + '</b>' + (isHT ? ' • HbA1c tidak diperlukan untuk Hipertensi' : '') + '</span></div>' +
    '<div class="result-list" style="max-height:none;">' + fieldsHtml + '</div>' +
    '<div style="margin-top:16px;"><label class="lbl">Kesimpulan / Catatan</label>' +
    '<textarea id="pk_kesimpulan" rows="2" class="inp-ta">' + esc(p.kesimpulan || '') + '</textarea></div>' +
    '<div class="btn-row"><button class="btn btn-primary" style="flex:1;" onclick="simpanHasilProlanis(\'' + esc(kegId) + '\', ' + idx + ')">Simpan</button>' +
    '<button class="btn btn-secondary" onclick="closeModal()">Batal</button></div></div>';
  document.getElementById('modalContent').innerHTML = html;
  document.getElementById('modal').classList.add('open');
}

function simpanHasilProlanis(kegId, idx) {
  var keg = (window._prolanisList || []).find(function(x) { return String(x.id_kegiatan) === String(kegId); });
  if (!keg) return;
  var p = (keg.peserta || [])[idx];
  if (!p) return;
  var cols = ['chol','trig','hdl','ldl','creatin','ureum','hba1c','mikro'];
  cols.forEach(function(c) {
    var el = document.getElementById('ph_' + c);
    if (el) {
      var v = el.value.trim();
      if (v) p[c] = v;
      else delete p[c];
    }
  });
  var kes = document.getElementById('pk_kesimpulan');
  p.kesimpulan = kes ? kes.value.trim() : '';
  window._prolanisList.forEach(function(k) { k.peserta_count = (k.peserta || []).length; });
  apiCall('saveMaster', { jenis: 'prolanis_kegiatan', list: window._prolanisList }).then(function() {
    var allPeserta = [];
    (window._prolanisList || []).forEach(function(k) {
      (k.peserta || []).forEach(function(ps, i) {
        var copy = JSON.parse(JSON.stringify(ps));
        copy.id = k.id_kegiatan + '-' + (i + 1);
        copy.id_kegiatan = k.id_kegiatan;
        copy.no = ps.no || ('P-' + String(i + 1).padStart(3, '0'));
        copy.status = 'selesai';
        copy.tgl_input = new Date().toISOString();
        allPeserta.push(copy);
      });
    });
    apiCall('saveMaster', { jenis: 'prolanis_peserta', list: allPeserta });
    toastMsg('Hasil tersimpan', 'ok');
    closeModal();
    render();
  });
}
  function modalKalibrasi() {
  var kandidat = TESTS.filter(function(t) { return t.kal_aktif; });
  if (kandidat.length === 0) {
    toastMsg('Belum ada tes dengan kalibrasi aktif di Master Lab');
    return;
  }
  var rowsHtml = kandidat.map(function(t) {
    return '<tr>' +
      '<td class="mono" style="font-weight:700;color:var(--primary);font-size:12px;">' + esc(t.kode) + '</td>' +
      '<td style="font-size:12px;font-weight:500;">' + esc(t.nama) + '</td>' +
      '<td><select id="kal_op_' + t.kode + '" class="inp-sel" style="padding:6px 8px;font-size:13px;">' +
      '<option value="*"' + (t.kal_operator === '*' ? ' selected' : '') + '>× Kali</option>' +
      '<option value="/"' + (t.kal_operator === '/' ? ' selected' : '') + '>÷ Bagi</option>' +
      '<option value="+"' + (t.kal_operator === '+' ? ' selected' : '') + '>+ Tambah</option>' +
      '<option value="-"' + (t.kal_operator === '-' ? ' selected' : '') + '>− Kurang</option>' +
      '</select></td>' +
      '<td><input type="number" step="any" id="kal_fak_' + t.kode + '" class="inp" value="' + (t.kal_faktor || 1) + '" style="padding:6px 8px;font-size:13px;"></td>' +
      '</tr>';
  }).join('');
  var html = '<div class="modal-body">' +
    '<div class="modal-head"><div><h3>🧮 Atur Kalibrasi</h3><p>Ubah faktor/operator untuk tes aktif</p></div>' +
    '<button class="modal-close" onclick="closeModal()">&times;</button></div>' +
    '<div class="table-wrap"><table style="min-width:auto;">' +
    '<thead><tr><th style="width:80px;">Kode</th><th>Nama</th><th style="width:120px;">Operator</th><th style="width:90px;">Faktor</th></tr></thead>' +
    '<tbody>' + rowsHtml + '</tbody></table></div>' +
    '<div class="info-box" style="margin-top:12px;"><span class="info-em">ℹ️</span><span>Perubahan langsung tersimpan ke Master Lab.</span></div>' +
    '<div class="btn-row"><button class="btn btn-primary" style="flex:1;" onclick="simpanKalibrasiHariIni()">Simpan</button>' +
    '<button class="btn btn-secondary" onclick="closeModal()">Batal</button></div></div>';
  document.getElementById('modalContent').innerHTML = html;
  document.getElementById('modal').classList.add('open');
}

function simpanKalibrasiHariIni() {
  var kandidat = TESTS.filter(function(t) { return t.kal_aktif; });
  kandidat.forEach(function(t) {
    var opEl = document.getElementById('kal_op_' + t.kode);
    var fakEl = document.getElementById('kal_fak_' + t.kode);
    if (opEl) t.kal_operator = opEl.value;
    if (fakEl) t.kal_faktor = parseFloat(fakEl.value) || 1;
  });
  saveTests();
  closeModal();
  render();
  toastMsg('Kalibrasi diperbarui', 'ok');
}
  
  function togglePuskesmasLainnya(val) {
  var manualInput = document.getElementById('pk_pengirim_manual');
  if (manualInput) {
    if (val === 'lainnya') {
      manualInput.style.display = 'block';
      manualInput.focus();
    } else {
      manualInput.style.display = 'none';
    }
  }
}
  function modalKegiatanProlanis(id) {
  var isEdit = !!id;
  var k = isEdit ? (window._prolanisList || []).find(function(x) { return String(x.id_kegiatan) === String(id); }) : null;
  if (isEdit && !k) { toastMsg('Kegiatan tidak ditemukan', 'err'); return; }
  var isCustomPengirim = k && k.pengirim && !masterPuskesmasList.some(function(p) { 
  return p.nama_puskesmas === k.pengirim; 
});

var pengirimHtml = 
  '<div>' +
  '<label class="lbl">Pengirim *</label>' +
  '<select id="pk_pengirim_select" class="inp-sel" onchange="togglePuskesmasLainnya(this.value)">' +
    '<option value="">— Pilih Puskesmas —</option>' +
    masterPuskesmasList.map(function(p) {
      var selected = (k && k.pengirim === p.nama_puskesmas) ? ' selected' : '';
      return '<option value="' + esc(p.nama_puskesmas) + '"' + selected + '>' + esc(p.nama_puskesmas) + '</option>';
    }).join('') +
    '<option value="lainnya"' + (isCustomPengirim ? ' selected' : '') + '>➕ Lainnya (Ketik Manual)</option>' +
  '</select>' +
  '<input type="text" id="pk_pengirim_manual" class="inp" style="display:' + (isCustomPengirim ? 'block' : 'none') + '; margin-top:8px;" value="' + (isCustomPengirim ? esc(k.pengirim) : '') + '" placeholder="Ketik nama Puskesmas baru...">' +
  '</div>';
  var html = '<div class="modal-body">' +
    '<div class="modal-head"><div><h3>' + (isEdit ? 'Edit Kegiatan Prolanis' : '➕ Buat Kegiatan Prolanis') + '</h3><p>Isi data kegiatan</p></div>' +
    '<button class="modal-close" onclick="closeModal()">&times;</button></div>' +
    '<div class="form-row" style="grid-template-columns:1fr;">' +
    '<div><label class="lbl">Nama Kegiatan *</label><input id="pk_nama" class="inp" value="' + (k ? esc(k.nama_kegiatan) : '') + '" placeholder="Contoh: Maesan, Penanggungan"></div>' +
    '<div><label class="lbl">Tanggal *</label><input type="date" id="pk_tanggal" class="inp" value="' + (k ? esc((k.tanggal || '').slice(0, 10)) : '') + '"></div>' +
    pengirimHtml +
    '<div><label class="lbl">Alamat / Wilayah</label><input id="pk_alamat" class="inp" value="' + (k ? esc(k.alamat || '') : '') + '" placeholder="Contoh: Maesan, Penanggungan"></div>' +
    (isEdit ? '' : '<div><label class="lbl">Jumlah Peserta</label><input type="number" id="pk_jumlah" class="inp" value="0" min="0" max="500"><div style="font-size:11px;color:var(--slate-400);margin-top:4px;">Isi jumlah peserta → otomatis buat baris kosong</div></div>') +
    '<div><label class="lbl">Petugas</label><input id="pk_petugas" class="inp" value="' + (k ? esc(k.petugas || '') : '') + '" placeholder="Contoh: Tim A"></div>' +
    '</div>' +
    '<div class="btn-row"><button class="btn btn-primary" style="flex:1;" onclick="simpanKegiatanProlanis(\'' + (isEdit ? esc(id) : '') + '\')">Simpan</button>' +
    '<button class="btn btn-secondary" onclick="closeModal()">Batal</button></div></div>';
  document.getElementById('modalContent').innerHTML = html;
  document.getElementById('modal').classList.add('open');
  setTimeout(function() { var el = document.getElementById('pk_nama'); if (el) el.focus(); }, 100);
}

function simpanKegiatanProlanis(editId) {
  var nama = (document.getElementById('pk_nama').value || '').trim();
  var tanggal = (document.getElementById('pk_tanggal').value || '').trim();
  var selectPengirim = document.getElementById('pk_pengirim_select').value;
  var pengirim = '';

  if (selectPengirim === 'lainnya') {
    pengirim = (document.getElementById('pk_pengirim_manual').value || '').trim();
    if (!pengirim) { alert('Nama Puskesmas manual wajib diisi!'); return; }
  } else {
    pengirim = selectPengirim;
    if (!pengirim) { alert('Pilih Puskesmas Pengirim terlebih dahulu.'); return; }
  }
  
  var alamat = (document.getElementById('pk_alamat').value || '').trim();
  var petugas = (document.getElementById('pk_petugas').value || '').trim();
  var jumlahEl = document.getElementById('pk_jumlah');
  var jumlah = jumlahEl ? (parseInt(jumlahEl.value || '0', 10) || 0) : 0;
  
  if (!nama || !tanggal) { alert('Nama dan tanggal wajib diisi.'); return; }
  if (jumlah < 0) jumlah = 0;
  if (jumlah > 500) jumlah = 500;
  
  window._prolanisList = window._prolanisList || [];
  
  if (editId) {
    var k = window._prolanisList.find(function(x) { return String(x.id_kegiatan) === String(editId); });
    if (!k) { toastMsg('Kegiatan tidak ditemukan', 'err'); return; }
    k.nama_kegiatan = nama;
    k.tanggal = tanggal;
    k.pengirim = pengirim;
    k.alamat = alamat;
    k.petugas = petugas;
    // Update alamat semua peserta agar sinkron dengan alamat kegiatan baru
    if (k.peserta && k.peserta.length > 0) {
      k.peserta.forEach(function(p) {
        p.alamat = alamat; 
      });
    }
    // ---------------------------
    if (jumlah > 0) {
      k.peserta = k.peserta || [];
      for (var i = 0; i < jumlah; i++) {
        var noBaru = getNextProlanisNo(k);
        k.peserta.push({ no: noBaru, nik:'', nama:'', tgl_lahir:'', alamat: k.alamat || '', diagnosa:'', chol:'', trig:'', hdl:'', ldl:'', creatin:'', ureum:'', hba1c:'', mikro:'' });
      }
    }
  } else {
    var id = 'PKG' + Date.now();
    var peserta = [];
    for (var j = 0; j < jumlah; j++) {
      peserta.push({ no: 'P-' + String(j + 1).padStart(3, '0'), nik:'', nama:'', tgl_lahir:'', alamat: alamat, diagnosa:'', chol:'', trig:'', hdl:'', ldl:'', creatin:'', ureum:'', hba1c:'', mikro:'' });
    }
    window._prolanisList.push({
      id_kegiatan: id,
      nama_kegiatan: nama,
      tanggal: tanggal,
      pengirim: pengirim,
      alamat: alamat,
      petugas: petugas,
      peserta: peserta
    });
  }

  // --- TAMBAHAN BARU: Kumpulkan semua peserta untuk disimpan ---
  var allPeserta = [];
  (window._prolanisList || []).forEach(function(keg) {
    (keg.peserta || []).forEach(function(p, i) {
      var ps = JSON.parse(JSON.stringify(p));
      ps.id = keg.id_kegiatan + '-' + (i + 1);
      ps.id_kegiatan = keg.id_kegiatan;
      ps.status = ps.status || 'belum';
      if (!ps.tgl_input) ps.tgl_input = new Date().toISOString();
      allPeserta.push(ps);
    });
  });
  // -----------------------------------------------------------

  showLoading(true);
  
  // Simpan Kegiatan, lalu Simpan Peserta
  apiCall('saveMaster', { jenis: 'prolanis_kegiatan', list: window._prolanisList })
    .then(function(res) {
      if (res && res.ok) {
        return apiCall('saveMaster', { jenis: 'prolanis_peserta', list: allPeserta });
      } else {
        throw new Error((res && res.error) ? res.error : 'Gagal menyimpan kegiatan');
      }
    })
    .then(function() {
      showLoading(false);
      toastMsg(editId ? '✅ Kegiatan diperbarui' : '✅ Kegiatan dibuat', 'ok');
      closeModal();
      render();
    })
    .catch(function(err) {
      showLoading(false);
      alert('GAGAL MENYIMPAN:\n\n' + err.message);
      toastMsg('Gagal menyimpan data', 'err');
    });
}
  function bukaKegiatanProlanis(id) {
  var k = (window._prolanisList || []).find(function(x) { return String(x.id_kegiatan) === String(id); });
  if (!k) { toastMsg('Kegiatan tidak ditemukan', 'err'); return; }
  window._prolanisDetail = JSON.parse(JSON.stringify(k));
  window._prolanisDetail.peserta = window._prolanisDetail.peserta || [];
  view = 'prolanis-detail';
  render();
}
function getNextProlanisNo(keg) {
  var list = (keg && keg.peserta) || [];
  var max = 0;
  list.forEach(function(p) {
    var n = parseInt(String(p.no || '').replace(/\D/g, ''), 10);
    if (n > max) max = n;
  });
  return 'P-' + String(max + 1).padStart(3, '0');
}

function tambahPesertaProlanis() {
  if (!window._prolanisDetail) return;
  window._prolanisDetail.peserta = window._prolanisDetail.peserta || [];
  var nextNo = getNextProlanisNo(window._prolanisDetail);
  var alamatKeg = window._prolanisDetail.alamat || '';
  window._prolanisDetail.peserta.push({ 
    no: nextNo,
    nik:'', nama:'', tgl_lahir:'', 
    alamat: alamatKeg,
    diagnosa:'',
    chol:'', trig:'', hdl:'', ldl:'', creatin:'', ureum:'', hba1c:'', mikro:'' 
  });
  render();
}
function updatePesertaField(idx, field, val) {
  if (!window._prolanisDetail || !window._prolanisDetail.peserta) return;
  if (!window._prolanisDetail.peserta[idx]) return;
  window._prolanisDetail.peserta[idx][field] = val;
}

function hapusPesertaProlanis(idx) {
  if (!window._prolanisDetail || !window._prolanisDetail.peserta) return;
  if (!confirm('Hapus baris ini?')) return;
  window._prolanisDetail.peserta.splice(idx, 1);
  render();
}

/* ===== PROLANIS: PASTE/IMPORT EXCEL (Level 2+3+4) ===== */

// --- Helper: normalisasi tanggal berbagai format ---
function normalizeDate(v) {
  if (!v) return '';
  v = String(v).trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(v)) return v;
  var m1 = v.match(/^(\d{1,2})[\/\-\.](\d{1,2})[\/\-\.](\d{4})$/);
  if (m1) return m1[3] + '-' + m1[2].padStart(2, '0') + '-' + m1[1].padStart(2, '0');
  var m2 = v.match(/^(\d{4})[\/\-\.](\d{1,2})[\/\-\.](\d{1,2})$/);
  if (m2) return m2[1] + '-' + m2[2].padStart(2, '0') + '-' + m2[3].padStart(2, '0');
  return v;
}

// --- Helper: matrix → array objek (auto-detect header + mapping kolom) ---
function matrixToProlanisObjects(matrix) {
  if (!matrix || matrix.length === 0) return [];
  var headerKeywords = ['nik','nama','tgl','lahir','alamat','chol','kolesterol','hdl','ldl'];
  var firstRow = matrix[0].map(function(c) { return String(c).toLowerCase().trim(); });
  // --- VALIDASI HEADER KETAT ---
var firstRowStr = firstRow.join('|');
if (firstRowStr.indexOf('nama') === -1 || firstRowStr.indexOf('chol') === -1) {
  toastMsg('❌ Format Excel tidak sesuai template. Pastikan ada kolom Nama & Chol.', 'err');
  return [];
}
// ------------------------------
  var headerFound = headerKeywords.some(function(k) {
    return firstRow.some(function(c) { return c.indexOf(k) >= 0; });
  });
  var idxMap = {};
  var dataRows;
  if (headerFound) {
    firstRow.forEach(function(h, i) {
    var hl = h;
      if (hl === 'no' || hl.indexOf('nomor') >= 0) idxMap.no = i;
      else if (hl.indexOf('nik') >= 0) idxMap.nik = i;
      else if (hl === 'nama' || hl.indexOf('nama ') === 0) idxMap.nama = i;
      else if (hl.indexOf('lahir') >= 0 || hl === 'tgl' || hl === 'tanggal lahir') idxMap.tgl_lahir = i;
      else if (hl.indexOf('alamat') >= 0) idxMap.alamat = i;
      else if (hl.indexOf('diagnosa') >= 0 || hl === 'dx' || hl === 'diag') idxMap.diagnosa = i;
      else if (hl.indexOf('chol') >= 0 || hl.indexOf('kolesterol') >= 0) idxMap.chol = i;
      else if (hl.indexOf('trig') >= 0) idxMap.trig = i;
      else if (hl === 'hdl') idxMap.hdl = i;
      else if (hl === 'ldl') idxMap.ldl = i;
      else if (hl.indexOf('crea') >= 0) idxMap.creatin = i;
      else if (hl.indexOf('ureum') >= 0 || hl.indexOf('urea') >= 0) idxMap.ureum = i;
      else if (hl.indexOf('hba1c') >= 0) idxMap.hba1c = i;
      else if (hl.indexOf('mikro') >= 0) idxMap.mikro = i;
    });
    dataRows = matrix.slice(1);
  } else {
    var order = ['nik','nama','tgl_lahir','alamat','chol','trig','hdl','ldl','creatin','ureum','hba1c','mikro'];
    order.forEach(function(k, i) { idxMap[k] = i; });
    dataRows = matrix;
  }
  var result = [];
  dataRows.forEach(function(row) {
    var obj = {};
    Object.keys(idxMap).forEach(function(k) {
      var v = row[idxMap[k]];
      if (v === undefined || v === null) v = '';
      v = String(v).trim();
if (k === 'tgl_lahir') v = normalizeDate(v);

// Bersihkan jika ada teks tanggal masuk ke kolom hasil lab
if (['chol','trig','hdl','ldl','creatin','ureum','hba1c','mikro'].indexOf(k) !== -1) {
  if (/^\d{4}-\d{2}-\d{2}T/.test(v)) v = ''; 
}

obj[k] = v;
    });
    if (obj.nama || obj.nik || obj.no) result.push(obj);
  });
  return result;
}

// --- Helper: parse text paste (auto-detect delimiter) ---
function parsePastedText(text) {
  var lines = text.split(/\r?\n/).filter(function(l) { return l.trim(); });
  if (lines.length === 0) return [];
  var sample = lines[0];
  var tabCount = (sample.match(/\t/g) || []).length;
  var semiCount = (sample.match(/;/g) || []).length;
  var commaCount = (sample.match(/,/g) || []).length;
  var delim = '\t';
  if (tabCount === 0) delim = (semiCount >= commaCount) ? ';' : ',';
  var matrix = lines.map(function(l) { return l.split(delim).map(function(c) { return c.trim(); }); });
  return matrixToProlanisObjects(matrix);
}

// --- Helper: render preview tabel di modal ---
function renderProlanisPreview(containerId, rows, onConfirm) {
  var html = '<div style="background:#f0fdf4;border:1px solid #86efac;border-radius:8px;padding:10px;font-size:12px;margin-bottom:8px;">' +
    '<b>✅ ' + rows.length + ' baris terdeteksi</b></div>';
  html += '<div style="max-height:200px;overflow:auto;border:1px solid var(--slate-200);border-radius:8px;">' +
    '<table style="width:100%;font-size:11px;border-collapse:collapse;">' +
    '<thead><tr style="background:var(--slate-100);">' +
    '<th style="padding:4px;text-align:left;">Nama</th>' +
    '<th style="padding:4px;text-align:left;">NIK</th>' +
    '<th style="padding:4px;text-align:left;">Tgl Lahir</th>' +
    '<th style="padding:4px;text-align:center;">Chol</th>' +
    '<th style="padding:4px;text-align:center;">Trig</th>' +
    '<th style="padding:4px;text-align:center;">HDL</th>' +
    '</tr></thead><tbody>';
  rows.slice(0, 5).forEach(function(r) {
    html += '<tr>' +
      '<td style="padding:4px;border-bottom:1px solid var(--slate-100);">' + esc(r.nama || '-') + '</td>' +
      '<td style="padding:4px;border-bottom:1px solid var(--slate-100);">' + esc(r.nik || '-') + '</td>' +
      '<td style="padding:4px;border-bottom:1px solid var(--slate-100);">' + esc(r.tgl_lahir || '-') + '</td>' +
      '<td style="padding:4px;border-bottom:1px solid var(--slate-100);text-align:center;">' + esc(r.chol || '-') + '</td>' +
      '<td style="padding:4px;border-bottom:1px solid var(--slate-100);text-align:center;">' + esc(r.trig || '-') + '</td>' +
      '<td style="padding:4px;border-bottom:1px solid var(--slate-100);text-align:center;">' + esc(r.hdl || '-') + '</td>' +
      '</tr>';
  });
  html += '</tbody></table></div>';
  if (rows.length > 5) {
    html += '<div style="font-size:11px;color:var(--slate-500);margin-top:4px;text-align:center;">...dan ' + (rows.length - 5) + ' baris lagi</div>';
  }
  html += '<div class="btn-row" style="margin-top:12px;">' +
    '<button class="btn btn-primary" style="flex:1;" onclick="' + onConfirm + '()">✅ Tambahkan ' + rows.length + ' Baris</button>' +
    '<button class="btn btn-secondary" onclick="closeModal()">Batal</button>' +
    '</div>';
  document.getElementById(containerId).innerHTML = html;
}

// --- Helper: tambah rows ke kegiatan aktif ---
function appendProlanisRows(rows) {
  if (!window._prolanisDetail || !rows || rows.length === 0) return 0;
  if (!window._prolanisDetail.peserta) window._prolanisDetail.peserta = [];
  var nextNum = parseInt(getNextProlanisNo(window._prolanisDetail).replace(/\D/g, ''), 10);
  var alamatKeg = window._prolanisDetail.alamat || '';
  var added = 0;
  rows.forEach(function(r) {
    window._prolanisDetail.peserta.push({
      no: 'P-' + String(nextNum + added).padStart(3, '0'),
      nik: r.nik || '',
      nama: r.nama || '',
      tgl_lahir: r.tgl_lahir || '',
      alamat: r.alamat || alamatKeg,
      diagnosa: r.diagnosa || '',
      chol: r.chol || '',
      trig: r.trig || '',
      hdl: r.hdl || '',
      ldl: r.ldl || '',
      creatin: r.creatin || '',
      ureum: r.ureum || '',
      hba1c: r.hba1c || '',
      mikro: r.mikro || ''
    });
    added++;
  });
  return added;
}

// ===== LEVEL 2: PASTE MODAL =====
function pasteExcelProlanis() {
  var html = '<div class="modal-body">' +
    '<div class="modal-head"><div><h3>📋 Paste dari Excel</h3><p>Copy dari Excel/Sheets, paste di kotak bawah</p></div>' +
    '<button class="modal-close" onclick="closeModal()">&times;</button></div>' +
    '<div class="info-box info-blue" style="margin-bottom:12px;">' +
    '<span class="info-em">💡</span>' +
    '<span>Block sel di Excel (termasuk header kalau ada) → Ctrl+C → paste di bawah. <b>Delimiter auto-detect</b> (TAB/koma/titik-koma). <b>Header auto-detect</b>. Tanggal format apapun akan dikonversi.</span>' +
    '</div>' +
    '<textarea id="pasteArea" rows="10" class="inp-ta" placeholder="Klik di sini lalu Ctrl+V..." style="font-family:monospace;font-size:12px;min-height:200px;"></textarea>' +
    '<div id="pastePreview" style="margin-top:12px;"></div>' +
    '<div class="btn-row" id="pasteActions">' +
    '<button class="btn btn-primary" style="flex:1;" onclick="prosesPasteProlanis()">🔍 Proses &amp; Preview</button>' +
    '<button class="btn btn-secondary" onclick="closeModal()">Batal</button>' +
    '</div></div>';
  document.getElementById('modalContent').innerHTML = html;
  document.getElementById('modal').classList.add('open');
  window._pasteParsedRows = null;
  setTimeout(function() { var el = document.getElementById('pasteArea'); if (el) el.focus(); }, 100);
}

function prosesPasteProlanis() {
  var text = document.getElementById('pasteArea').value;
  if (!text || !text.trim()) { toastMsg('Belum ada data dipaste', 'err'); return; }
  var rows = parsePastedText(text);
  if (rows.length === 0) { toastMsg('Tidak ada baris valid terdeteksi', 'err'); return; }
  window._pasteParsedRows = rows;
  renderProlanisPreview('pastePreview', rows, 'konfirmasiPasteProlanis');
}

function konfirmasiPasteProlanis() {
  if (!window._pasteParsedRows || window._pasteParsedRows.length === 0) {
    toastMsg('Tidak ada data', 'err'); return;
  }
  var added = appendProlanisRows(window._pasteParsedRows);
  window._pasteParsedRows = null;
  closeModal();
  render();
  toastMsg('✅ ' + added + ' peserta ditambahkan', 'ok');
}

// ===== LEVEL 3: UPLOAD FILE =====
function uploadExcelProlanis() {
  var html = '<div class="modal-body">' +
    '<div class="modal-head"><div><h3>📁 Upload File Excel / CSV</h3><p>Pilih file .xlsx, .xls, atau .csv</p></div>' +
    '<button class="modal-close" onclick="closeModal()">&times;</button></div>' +
    '<div class="info-box info-blue" style="margin-bottom:12px;">' +
    '<span class="info-em">💡</span>' +
    '<span>Format kolom: <b>No, Nama, Tgl Lahir, Alamat, Diagnosa, Chol, Trig, HDL, LDL, Crea, Ureum, HbA1c, Mikro</b>.<br>Header otomatis terdeteksi. Baris dengan No terisi akan di-import meskipun Nama kosong.</span>' +
    '</div>' +
    '<input type="file" id="fileExcel" accept=".xlsx,.xls,.csv" class="inp" onchange="handleUploadProlanis(this)" style="padding:12px;">' +
    '<div id="uploadPreview" style="margin-top:12px;"></div>' +
    '</div>';
  document.getElementById('modalContent').innerHTML = html;
  document.getElementById('modal').classList.add('open');
  window._uploadParsedRows = null;
}

function handleUploadProlanis(input) {
  var file = input.files && input.files[0];
if (!file) return;
var _savedFile = file;
input.value = '';
  if (typeof XLSX === 'undefined') { toastMsg('Library Excel belum siap', 'err'); return; }
  var reader = new FileReader();
  reader.onload = function(e) {
    try {
      var data = new Uint8Array(e.target.result);
      var wb = XLSX.read(data, { type: 'array', cellDates: false });
      var ws = wb.Sheets[wb.SheetNames[0]];
      var matrix = XLSX.utils.sheet_to_json(ws, { header: 1, raw: false, defval: '' });
      matrix = matrix.filter(function(row) { return row.some(function(c) { return String(c).trim() !== ''; }); });
      if (matrix.length === 0) { toastMsg('File kosong', 'err'); return; }
      var rows = matrixToProlanisObjects(matrix);
      if (rows.length === 0) { toastMsg('Tidak ada baris valid', 'err'); return; }
      window._uploadParsedRows = rows;
      renderProlanisPreview('uploadPreview', rows, 'konfirmasiUploadProlanis');
    } catch (err) {
      toastMsg('Gagal baca file: ' + err.message, 'err');
    }
  };
  reader.readAsArrayBuffer(_savedFile);
}

function konfirmasiUploadProlanis() {
  if (!window._uploadParsedRows || window._uploadParsedRows.length === 0) {
    toastMsg('Tidak ada data', 'err'); return;
  }
  
  // Munculkan konfirmasi sebelum menimpa data
  if (!confirm('⚠️ Data peserta di layar akan DIGANTI dengan data dari Excel ini. Lanjutkan?')) return;

  var rows = window._uploadParsedRows;
  var newList = [];
  
  // Susun ulang data dari Excel ke format aplikasi
  rows.forEach(function(r, i) {
    newList.push({
      no: 'P-' + String(i + 1).padStart(3, '0'),
      nik: r.nik || '',
      nama: r.nama || '',
      tgl_lahir: r.tgl_lahir || '',
      alamat: r.alamat || (window._prolanisDetail ? window._prolanisDetail.alamat : ''),
      diagnosa: r.diagnosa || '',
      chol: r.chol || '',
      trig: r.trig || '',
      hdl: r.hdl || '',
      ldl: r.ldl || '',
      creatin: r.creatin || '',
      ureum: r.ureum || '',
      hba1c: r.hba1c || '',
      mikro: r.mikro || ''
    });
  });

  // Timpa daftar peserta yang lama dengan data yang baru
  window._prolanisDetail.peserta = newList;
  
  window._uploadParsedRows = null;
  closeModal();
  render();
toastMsg('✅ ' + newList.length + ' peserta diperbarui. KLIK TOMBOL SIMPAN untuk menyimpan permanen.', 'ok');
}
function downloadTemplateProlanis() {
  if (typeof XLSX === 'undefined') { toastMsg('Library Excel belum siap', 'err'); return; }
  var header = ['No','Nama','Tgl Lahir','Alamat','Diagnosa','Chol','Trig','HDL','LDL','Creatinin','Ureum','HbA1c','Mikro'];
  var dataPeserta = [];
// Jika sedang buka kegiatan dan ada pesertanya, ambil data asli
if (window._prolanisDetail && window._prolanisDetail.peserta && window._prolanisDetail.peserta.length > 0) {
  window._prolanisDetail.peserta.forEach(function(p, i) {
    dataPeserta.push([
      i + 1, 
      p.nama || '', 
      p.tgl_lahir || '', 
      p.alamat || '', 
      p.diagnosa || '', 
      p.chol || '', 
      p.trig || '', 
      p.hdl || '', 
      p.ldl || '', 
      p.creatin || '', 
      p.ureum || '', 
      p.hba1c || '', 
      p.mikro || ''
    ]);
  });
} else {
  // Kalau belum ada peserta, pakai contoh statis
  dataPeserta = [
    [1, 'Budi Santoso', '10/02/1996', 'Curah Dami, Jatis', 'DM', '200', '150', '50', '100', '1.0', '30', '5.5', '15'],
    [2, 'Siti Aminah', '15/05/1975', 'Krajan, Jatis', 'HT', '180', '120', '45', '90', '0.9', '28', '', '12']
  ];
}
var aoa = [header].concat(dataPeserta);
  var ws = XLSX.utils.aoa_to_sheet(aoa);
  ws['!cols'] = [
    { wch: 5 },   // No
    { wch: 24 },  // Nama
    { wch: 12 },  // Tgl Lahir
    { wch: 26 },  // Alamat
    { wch: 10 },  // Diagnosa
    { wch: 8 },   // Chol
    { wch: 8 },   // Trig
    { wch: 8 },   // HDL
    { wch: 8 },   // LDL
    { wch: 10 },  // Creatinin
    { wch: 8 },   // Ureum
    { wch: 8 },   // HbA1c
    { wch: 8 }    // Mikro
  ];
  var headerStyle = {
    font: { bold: true, color: { rgb: 'FFFFFF' } },
    fill: { fgColor: { rgb: '1E40AF' } },
    alignment: { horizontal: 'center', vertical: 'center' },
    border: {
      top: { style: 'thin', color: { rgb: 'CBD5E1' } },
      bottom: { style: 'thin', color: { rgb: 'CBD5E1' } },
      left: { style: 'thin', color: { rgb: 'CBD5E1' } },
      right: { style: 'thin', color: { rgb: 'CBD5E1' } }
    }
  };
  for (var c = 0; c < header.length; c++) {
    var addr = XLSX.utils.encode_cell({ r: 0, c: c });
    if (ws[addr]) ws[addr].s = headerStyle;
  }
  var wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Prolanis');
  var _keg = window._prolanisDetail;
  var _namaKeg = (_keg && _keg.nama_kegiatan) ? _keg.nama_kegiatan : 'Prolanis';
  var _namaFile = 'Template ' + _namaKeg.replace(/[\\\/:*?"<>|]/g, '') + '.xlsx';
  XLSX.writeFile(wb, _namaFile);
  toastMsg('📥 Template ter-download — isi lalu upload balik', 'ok');
}
function simpanDetailKegiatan() {
  if (!window._prolanisDetail) return;
  var k = window._prolanisDetail;
  
  // Update list lokal
  var idx = (window._prolanisList || []).findIndex(function(x) { return String(x.id_kegiatan) === String(k.id_kegiatan); });
  if (idx >= 0) window._prolanisList[idx] = k;
  else window._prolanisList.push(k);

  // Siapkan data peserta
  var allPeserta = [];
  (window._prolanisList || []).forEach(function(keg) {
    (keg.peserta || []).forEach(function(p, i) {
      var ps = JSON.parse(JSON.stringify(p));
      ps.id = keg.id_kegiatan + '-' + (i + 1);
      ps.id_kegiatan = keg.id_kegiatan;
      ps.status = ps.status || 'belum';
      if (!ps.tgl_input) ps.tgl_input = new Date().toISOString();
      allPeserta.push(ps);
    });
  });

  showLoading(true);

  apiCall('saveMaster', { jenis: 'prolanis_kegiatan', list: window._prolanisList })
    .then(function(res) {
      if (res && res.ok) {
        return apiCall('saveMaster', { jenis: 'prolanis_peserta', list: allPeserta });
      } else {
        throw new Error((res && res.error) ? res.error : 'Gagal menyimpan kegiatan');
      }
    })
    .then(function() {
      showLoading(false);
      toastMsg('✅ Kegiatan & peserta tersimpan', 'ok');
      render();
    })
    .catch(function(err) {
      showLoading(false);
      alert('GAGAL MENYIMPAN:\n\n' + err.message);
      toastMsg('Gagal menyimpan data', 'err');
    });
}
/* ===== EXPORT PROLANIS KE EXCEL (STYLED) ===== */
function exportProlanisXLSX(kegId) {
  var keg = (window._prolanisList || []).find(function(x) {
    return String(x.id_kegiatan) === String(kegId);
  });
  if (!keg) { toastMsg('Kegiatan tidak ditemukan', 'err'); return; }
  
  var peserta = keg.peserta || [];
  if (peserta.length === 0) {
    toastMsg('Belum ada peserta di kegiatan ini', 'err');
    return;
  }
if (typeof XLSX === 'undefined') {
  toastMsg('Library Excel belum siap. Cek koneksi internet.', 'err');
  return;
}

// --- LOG DI SINI (SETELAH SEMUA PENGECEKAN) ---
apiCall('logActivityManual', { aksi: '📥 Export Excel Prolanis', detail: 'Kegiatan: ' + keg.nama_kegiatan + ' | Total: ' + peserta.length + ' peserta' });
// ----------------------------------------------
  // === 1. Susun data mentah ===
  var aoa = [];
  aoa.push(['LAPORAN HASIL PEMERIKSAAN PROLANIS', '', '', '', '', '', '', '', '', '', '', '', '', '', '']);
  aoa.push([]);
  aoa.push(['Nama Kegiatan', keg.nama_kegiatan || '-', '', '', '', '', '', '', '', '', '', '', '', '', '']);
  aoa.push(['Tanggal', fmtTanggalKeg(keg.tanggal), '', '', '', '', '', '', '', '', '', '', '', '', '']);
  aoa.push(['Pengirim', keg.pengirim || '-', '', '', '', '', '', '', '', '', '', '', '', '', '']);
  aoa.push(['Alamat', keg.alamat || '-', '', '', '', '', '', '', '', '', '', '', '', '', '']);
  aoa.push(['Petugas', keg.petugas || '-', '', '', '', '', '', '', '', '', '', '', '', '', '']);
  aoa.push([]);
  
  var header = ['No','Nama','NIK','Tgl Lahir','Alamat','Diagnosa','Chol','Trig','HDL','LDL','Creatinin','Ureum','HbA1c','Mikro','Kesimpulan'];
  aoa.push(header);
  
  var dataStartRow = aoa.length;
  peserta.forEach(function(p, i) {
    aoa.push([
      i + 1,
      p.nama || '',
      p.nik || '',
      fmtTglLahir(p.tgl_lahir) || '',
      p.alamat || '',
      p.diagnosa || '',
      p.chol || '',
      p.trig || '',
      p.hdl || '',
      p.ldl || '',
      p.creatin || '',
      p.ureum || '',
      p.hba1c || '',
      p.mikro || '',
      p.kesimpulan || ''
    ]);
  });
  
  var ws = XLSX.utils.aoa_to_sheet(aoa);
  
  // === 2. Styling warna & font ===
  var C = {
    biruTua:  '1E40AF',
    biruMuda: 'EFF6FF',
    abuMuda:  'F1F5F9',
    abuTua:   '334155',
    putih:    'FFFFFF',
    hitam:    '000000',
    merah:    'DC2626',
    ungu:     '7E22CE'
  };
  
  // Border standar
  var B = {
    top:    { style: 'thin', color: { rgb: 'CBD5E1' } },
    bottom: { style: 'thin', color: { rgb: 'CBD5E1' } },
    left:   { style: 'thin', color: { rgb: 'CBD5E1' } },
    right:  { style: 'thin', color: { rgb: 'CBD5E1' } }
  };
  
  // Helper: apply style ke cell
  function setStyle(r, c, s) {
    var addr = XLSX.utils.encode_cell({ r: r, c: c });
    if (!ws[addr]) ws[addr] = { v: '', t: 's' };
    ws[addr].s = s;
  }
  
  // --- Judul besar (row 0) ---
  setStyle(0, 0, {
    font: { name: 'Calibri', sz: 16, bold: true, color: { rgb: C.putih } },
    fill: { fgColor: { rgb: C.biruTua } },
    alignment: { horizontal: 'center', vertical: 'center' },
    border: B
  });
  for (var i = 1; i < 15; i++) setStyle(0, i, {
    fill: { fgColor: { rgb: C.biruTua } },
    border: B
  });
  
  // --- Info kegiatan (row 2-6) ---
  for (var r = 2; r <= 6; r++) {
    setStyle(r, 0, {
      font: { sz: 11, bold: true, color: { rgb: C.abuTua } },
      fill: { fgColor: { rgb: C.abuMuda } },
      alignment: { horizontal: 'left', vertical: 'center' },
      border: B
    });
    setStyle(r, 1, {
      font: { sz: 11, color: { rgb: C.hitam } },
      alignment: { horizontal: 'left', vertical: 'center' },
      border: B
    });
    // Sisa kolom biar border rapih
    for (var j = 2; j < 15; j++) setStyle(r, j, { border: B });
  }
  
  // --- Header tabel (baris dataStartRow - 1) ---
  var headerRow = dataStartRow - 1;
  for (var c = 0; c < 15; c++) {
    setStyle(headerRow, c, {
      font: { sz: 11, bold: true, color: { rgb: C.putih } },
      fill: { fgColor: { rgb: C.biruTua } },
      alignment: { horizontal: 'center', vertical: 'center', wrapText: true },
      border: B
    });
  }
  
  // --- Data rows (selang-seling) ---
  for (var r2 = dataStartRow; r2 < dataStartRow + peserta.length; r2++) {
    var isEven = (r2 - dataStartRow) % 2 === 0;
    for (var c2 = 0; c2 < 15; c2++) {
      var style = {
        font: { sz: 10, color: { rgb: C.hitam } },
        fill: { fgColor: { rgb: isEven ? C.putih : C.biruMuda } },
        alignment: { horizontal: c2 === 0 ? 'center' : 'left', vertical: 'center', wrapText: false },
        border: B
      };
      // Diagnosa: warna khusus
      if (c2 === 5) {
        var diag = String(ws[XLSX.utils.encode_cell({ r: r2, c: 5 })]?.v || '').toUpperCase();
        if (diag === 'DM') {
          style.font = { sz: 10, bold: true, color: { rgb: C.merah } };
        } else if (diag === 'HT') {
          style.font = { sz: 10, bold: true, color: { rgb: C.ungu } };
        } else {
          style.alignment = { horizontal: 'center', vertical: 'center' };
        }
      }
      // Kolom angka: rata kanan
      if (c2 >= 6 && c2 <= 13) {
        style.alignment = { horizontal: 'center', vertical: 'center' };
      }
      setStyle(r2, c2, style);
    }
  }
  
  // === 3. Merge cells ===
  ws['!merges'] = [
    { s: { r: 0, c: 0 },  e: { r: 0, c: 14 } }, // Judul
    { s: { r: 2, c: 1 },  e: { r: 2, c: 14 } }, // Nama Kegiatan value
    { s: { r: 3, c: 1 },  e: { r: 3, c: 14 } }, // Tanggal value
    { s: { r: 4, c: 1 },  e: { r: 4, c: 14 } }, // Pengirim value
    { s: { r: 5, c: 1 },  e: { r: 5, c: 14 } }, // Alamat value
    { s: { r: 6, c: 1 },  e: { r: 6, c: 14 } }  // Petugas value
  ];
  
  // === 4. Lebar kolom ===
  ws['!cols'] = [
    { wch: 5 },   // No
    { wch: 24 },  // Nama
    { wch: 18 },  // NIK
    { wch: 11 },  // Tgl Lahir
    { wch: 26 },  // Alamat
    { wch: 9 },   // Diagnosa
    { wch: 7 },   // Chol
    { wch: 7 },   // Trig
    { wch: 7 },   // HDL
    { wch: 7 },   // LDL
    { wch: 9 },   // Creatinin
    { wch: 7 },   // Ureum
    { wch: 7 },   // HbA1c
    { wch: 7 },   // Mikro
    { wch: 30 }   // Kesimpulan
  ];
  
  // === 5. Tinggi baris ===
  ws['!rows'] = [{ hpt: 32 }]; // Judul lebih tinggi
  
  var wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Prolanis');
  
  // === 6. Nama file ===
  var namaSafe = (keg.nama_kegiatan || 'kegiatan')
    .replace(/[^a-zA-Z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
  var tglSafe = String(keg.tanggal || today()).replace(/[^0-9]/g, '-');
  var namaFile = 'Prolanis_' + namaSafe + '_' + tglSafe + '.xlsx';
  
  XLSX.writeFile(wb, namaFile);
  toastMsg('📥 File Excel ter-download', 'ok');
}
/* ===== CETAK PDF PROLANIS ===== */

function getTanggalKode(t) {
  if (!t) return '';
  var s = String(t);
  if (s.indexOf('T') > 0) s = s.split('T')[0];
  return s.replace(/[^0-9]/g, '');
}

function getProlanisPrintCols(diagnosa) {
  // Mapping key internal → kode lab di Master
  var base = [
    { key:'chol',    kode:'LAB-014', label:'Cholesterol',  kategori:'LEMAK LENGKAP',  fbSatuan:'mg/dL', fbRujukan:'< 200' },
    { key:'trig',    kode:'LAB-015', label:'Trigliserida', kategori:'LEMAK LENGKAP',  fbSatuan:'mg/dL', fbRujukan:'< 150' },
    { key:'hdl',     kode:'LAB-016', label:'HDL',          kategori:'LEMAK LENGKAP',  fbSatuan:'mg/dL', fbRujukan:'> 40' },
    { key:'ldl',     kode:'LAB-017', label:'LDL',          kategori:'LEMAK LENGKAP',  fbSatuan:'mg/dL', fbRujukan:'< 130' },
    { key:'creatin', kode:'LAB-018', label:'Kreatinin',    kategori:'GINJAL LENGKAP', fbSatuan:'mg/dL', fbRujukan:'0.6-1.3' },
    { key:'ureum',   kode:'LAB-019', label:'Ureum',        kategori:'GINJAL LENGKAP', fbSatuan:'mg/dL', fbRujukan:'15-45' },
    { key:'hba1c',   kode:'LAB-061', label:'HbA1c',        kategori:'KIMIA',          fbSatuan:'%',     fbRujukan:'4.0-6.0' },
    { key:'mikro',   kode:'LAB-062', label:'Mikroalbumin', kategori:'URIN',           fbSatuan:'mg/L',  fbRujukan:'< 20' }
  ];
  // Ambil nama/satuan/rujukan dari Master Lab (biar sinkron dengan pasien umum)
  var all = base.map(function(b) {
    var master = findTest(b.kode);
    return {
      key: b.key,
      kode: b.kode,
      label: (master && master.nama) ? master.nama : b.label,
      satuan: (master && master.satuan) ? master.satuan : b.fbSatuan,
      rujukan: (master && master.rujukan) ? master.rujukan : b.fbRujukan,
      kategori: b.kategori
    };
  });
  
  var d = String(diagnosa || '').toUpperCase();
  if (d === 'HT') return all.filter(function(c) { return c.key !== 'hba1c'; });
  return all;
}

function buildProlanisPrintPage(keg, peserta) {
  var cols = getProlanisPrintCols(peserta.diagnosa);
  var nomorRegister = getTanggalKode(keg.tanggal) + '-' + (peserta.no || 'P-001');
  
  // 1. PERBAIKAN TANGGAL: Jadi DD-MM-YYYY
  var tglTampil = fmtTanggalKeg(keg.tanggal);
  if (tglTampil && /^\d{4}-\d{2}-\d{2}$/.test(tglTampil)) {
    var tp = tglTampil.split('-');
    tglTampil = tp[2] + '-' + tp[1] + '-' + tp[0];
  }
  
  var umurStr = peserta.tgl_lahir ? umur(peserta.tgl_lahir) : '-';
  var pemeriksaData = (analisList || []).find(function(a) {
    return a.nama && a.nama.toLowerCase().indexOf('linda') >= 0;
  }) || { nama: 'Linda Hardiyanti Putri, A.Md.Kes', kode: 'NIP. 19980128 202521 2 008', ttd: '' };
  var dokterData = (dokterList || []).find(function(d) {
    return d.nama && d.nama.toLowerCase().indexOf('titik') >= 0;
  }) || { nama: 'Dr. Titik Erna Erawati', kode: 'NIP. 19771231 200501 2 014', ttd: '' };
  var ttdPemeriksa = pemeriksaData.ttd ? '<img src="' + pemeriksaData.ttd + '" style="max-height:150px; max-width:90%; object-fit:contain; display:block; margin:0 auto 2px;">' : '';
  var ttdDokter = dokterData.ttd ? '<img src="' + dokterData.ttd + '" style="max-height:150px; max-width:90%; object-fit:contain; display:block; margin:0 auto 2px;">' : '';
  var stempelHtml = stempelUrl ? '<img src="' + stempelUrl + '" style="position:absolute; top:-120px; left:0%; width:225px; height:225px; object-fit:contain; opacity:0.75; z-index:2; pointer-events:none; mix-blend-mode:multiply;">' : '';
  var logoKiriHtml = CLINIC.logoKiri ? '<img src="' + esc(CLINIC.logoKiri) + '" style="max-width:100%; max-height:100%; object-fit:contain;">' : '';
  var logoKananHtml = CLINIC.logoKanan ? '<img src="' + esc(CLINIC.logoKanan) + '" style="max-width:100%; max-height:100%; object-fit:contain;">' : '';

  // 2. PERBAIKAN KOP: Baris 1 jadi normal (tidak terlalu tebal) & ukuran disamakan
  var kopHtml = '<div style="display:flex; align-items:center; justify-content:space-between; padding-bottom:6px;">' +
  '<div style="width:80px; height:80px; flex-shrink:0; display:flex; align-items:center; justify-content:center;">' + logoKiriHtml + '</div>' +
  '<div style="flex:1; text-align:center; padding: 0 10px; font-family: Arial, sans-serif;">' +
  '<div style="font-size:13px; font-weight:normal; color:#000;">' + esc(CLINIC.baris1) + '</div>' +
  '<div style="font-size:13px; font-weight:800; color:#000;">' + esc(CLINIC.baris2) + '</div>' +
  '<div style="font-size:17px; font-weight:900; color:#000; margin:2px 0;">' + esc(CLINIC.baris3) + '</div>' +
  '<div style="font-size:10px; color:#000;">' + esc(CLINIC.alamat) + '</div>' +
  '<div style="font-size:10px; color:#000;">Website :' + esc(CLINIC.website) + '</div>' +
  '</div>' +
  '<div style="width:140px; height:140px; flex-shrink:0; display:flex; align-items:center; justify-content:center;">' + logoKananHtml + '</div>' +
  '</div>' +
  '<div style="border-top:2.5px solid #000; margin:0;"></div>' +
  '<div style="border-top:0.8px solid #000; margin-top:2px;"></div>';
  
  var judulHtml = '<div style="text-align:center; margin-top:12px; margin-bottom:8px;">' +
    '<div style="font-size:18px; font-weight:bold; color:#000;">HASIL PEMERIKSAAN LABORATORIUM</div></div>';

  var infoHtml = '<div style="margin-top:0; margin-bottom:12px; font-size:13px; font-family: Arial, sans-serif; color:#000; line-height:1.5;">' +
    '<div style="width:100%; overflow:hidden; margin-bottom:3px;">' +
    '<div style="float:left; width:15%;">Nama</div><div style="float:left; width:45%;">: ' + esc(peserta.nama || '-') + '</div>' +
    '<div style="float:left; width:20%;">Tanggal Periksa</div><div style="float:left; width:20%;">: ' + esc(tglTampil) + '</div>' +
    '<div style="clear:both;"></div></div>' +
    '<div style="width:100%; overflow:hidden; margin-bottom:3px;">' +
    '<div style="float:left; width:15%;">Umur</div><div style="float:left; width:45%;">: ' + esc(umurStr) + '</div>' +
    '<div style="float:left; width:20%;">Nomor Register</div><div style="float:left; width:20%;">: ' + esc(nomorRegister) + '</div>' +
    '<div style="clear:both;"></div></div>' +
    '<div style="width:100%; overflow:hidden; margin-bottom:3px;">' +
    '<div style="float:left; width:15%;">Alamat</div><div style="float:left; width:45%;">: ' + esc(keg.alamat || peserta.alamat || '-') + '</div>' +
    '<div style="float:left; width:20%;">Pengirim</div><div style="float:left; width:20%;">: ' + esc(keg.pengirim || '-') + '</div>' +
    '<div style="clear:both;"></div></div>' +
    '</div>';

  // 3. PERBAIKAN LEBAR KOLOM HEADER: 35% / 20% / 45%
  var headerTabel = '<div style="display:flex; width:100%; border-bottom:2px solid #000; padding-bottom:5px; margin-bottom:6px; font-weight:bold; font-size:13px; font-family: Arial, sans-serif; color:#000;">' +
    '<div style="width:35%; text-align:left;">PEMERIKSAAN LABORATORIUM</div>' +
    '<div style="width:20%; text-align:center;">HASIL</div>' +
    '<div style="width:45%; text-align:left; padding-left:15px; box-sizing:border-box;">NILAI RUJUKAN</div>' +
    '</div>';
    
  var grup = {};
  var urutanKategori = [];
  cols.forEach(function(c) {
    var kat = c.kategori || 'LAINNYA';
    if (!grup[kat]) { grup[kat] = []; urutanKategori.push(kat); }
    grup[kat].push(c);
  });

  // 4. PERBAIKAN LEBAR KOLOM DATA: 35% / 20% / 45%
  var rowsHtml = '';
  urutanKategori.forEach(function(kat) {
    rowsHtml += '<div style="width:100%; margin-top:8px; margin-bottom:4px; font-weight:bold; font-size:13px; font-family: Arial, sans-serif; color:#000;">' + esc(kat) + '</div>';
    grup[kat].forEach(function(c) {
      var val = peserta[c.key];
      if (val === undefined || val === null || val === '') val = '-';
      var rujukanLengkap = c.rujukan + ' ' + c.satuan;
      rowsHtml += '<div style="display:flex; width:100%; margin-bottom:3px; font-size:13px; font-family: Arial, sans-serif; color:#000;">' +
        '<div style="width:35%; text-align:left; padding-right:10px; box-sizing:border-box;">' + esc(c.label) + '</div>' +
        '<div style="width:20%; text-align:center;">' + esc(val) + '</div>' +
        '<div style="width:45%; text-align:left; padding-left:15px; padding-right:15px; box-sizing:border-box;">' + esc(rujukanLengkap) + '</div>' +
        '</div>';
    });
  });

  var content = kopHtml + judulHtml + infoHtml + headerTabel + '<div style="width:100%; overflow:hidden;">' + rowsHtml + '</div>';

  var footer =
    '<div style="display:flex; width:100%; font-size:12px; color:#000;">' +
      '<div style="width:50%; text-align:center; padding:6px 12px 0; font-weight:bold;">&nbsp;<br>Pemeriksa,</div>' +
      '<div style="width:50%; text-align:center; padding:6px 12px 0; font-weight:bold;">Mengetahui,<br>Dokter Penanggungjawab</div>' +
    '</div>' +
    '<div style="display:flex; width:100%; font-size:12px; color:#000;">' +
      '<div style="width:50%; text-align:center; position:relative; height:80px; padding:0 12px;">' +
        (ttdPemeriksa ? '<div style="position:absolute; top:50%; left:50%; transform:translate(-50%,-50%); width:95%; text-align:center;">' + ttdPemeriksa + '</div>' : '') +
      '</div>' +
      '<div style="width:50%; text-align:center; position:relative; height:80px; padding:0 12px;">' +
        (ttdDokter ? '<div style="position:absolute; top:50%; left:50%; transform:translate(-50%,-50%); width:95%; text-align:center;">' + ttdDokter + '</div>' : '') +
        stempelHtml +
      '</div>' +
    '</div>' +
    '<div style="display:flex; width:100%; font-size:12px; color:#000;">' +
      '<div style="width:50%; text-align:center; padding:0 12px; font-weight:bold;">' + esc(pemeriksaData.nama || '-') + '</div>' +
      '<div style="width:50%; text-align:center; padding:0 12px; font-weight:bold;">' + esc(dokterData.nama || '-') + '</div>' +
    '</div>' +
    '<div style="display:flex; width:100%; font-size:12px; color:#000;">' +
      '<div style="width:50%; text-align:center; padding:0 12px;">' + esc(pemeriksaData.kode || '-') + '</div>' +
      '<div style="width:50%; text-align:center; padding:0 12px;">' + esc(dokterData.kode || '-') + '</div>' +
    '</div>';
  return { content: content, footer: footer };
}
function showMultiPagePrint(pages, title) {
  var overlay = document.getElementById('printOverlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'printOverlay';
    document.body.appendChild(overlay);
  }
  var pagesHtml = pages.map(function(p, i) {
    var isLast = (i === pages.length - 1);
    var breakStyle = isLast ? '' : 'page-break-after:always;';
    return '<div class="print-page" style="position:relative;padding:0;box-sizing:border-box;width:210mm;height:287mm;overflow:hidden;' + breakStyle + '">' +
      '<img src="assets/images/border.png" alt="" style="position:absolute;top:0;left:0;width:100%;height:287mm;object-fit:fill;z-index:0;pointer-events:none;">' +
      '<div style="position:absolute;top:13mm;left:20mm;right:20mm;bottom:72mm;overflow:hidden;z-index:1;">' + p.content + '</div>' +
      (p.footer ? '<div style="position:absolute;bottom:20mm;left:20mm;right:20mm;z-index:2;">' + p.footer + '</div>' : '') +
      '</div>';
  }).join('');
  overlay.innerHTML = '<div class="print-toolbar">' +
    '<button class="print-btn-cancel" onclick="closePrintPreview()">✕ Tutup</button>' +
    '<div class="print-title">' + esc(title || 'Pratinjau Cetak') + '</div>' +
    '<button class="print-btn-print" onclick="window.print()">Cetak / PDF</button>' +
    '</div>' + pagesHtml;
  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function cetakProlanisKegiatan(kegId) {
  var keg = (window._prolanisList || []).find(function(x) {return String(x.id_kegiatan) === String(kegId);});
  if (!keg) { toastMsg('Kegiatan tidak ditemukan', 'err'); return; }
  var peserta = keg.peserta || [];
  if (peserta.length === 0) {
    toastMsg('Belum ada peserta di kegiatan ini', 'err');
    return;
  }
  apiCall('logActivityManual', { aksi: '🖨️ Cetak Rekap Prolanis (PDF)', detail: 'Kegiatan: ' + keg.nama_kegiatan + ' | Total: ' + (keg.peserta ? keg.peserta.length : 0) + ' peserta' });
  var pages = peserta.map(function(p) {
    return buildProlanisPrintPage(keg, p);
  });
  var title = 'Cetak ' + peserta.length + ' halaman — ' + (keg.nama_kegiatan || 'Prolanis');
  showMultiPagePrint(pages, title);
}

function cetakProlanisPeserta(kegId, idx) {
  var keg = (window._prolanisList || []).find(function(x) {
    return String(x.id_kegiatan) === String(kegId);
  });
  if (!keg) { toastMsg('Kegiatan tidak ditemukan', 'err'); return; }
  var p = (keg.peserta || [])[idx];
  if (!p) { toastMsg('Peserta tidak ditemukan', 'err'); return; }
  var page = buildProlanisPrintPage(keg, p);
  var title = 'Cetak — ' + (p.nama || 'Peserta');
  showMultiPagePrint([page], title);
}
function hapusKegiatanProlanis(id, nama) {
  if (!confirm('Hapus kegiatan "' + nama + '"? Semua peserta di dalamnya akan hilang.')) return;
  window._prolanisList = (window._prolanisList || []).filter(function(x) { return String(x.id_kegiatan) !== String(id); });
  apiCall('deleteProlanisKegiatan', { id: id, nama: nama }).then(function() {
    toastMsg('Kegiatan dihapus', 'ok');
  });
  render();
}
async function prosesBackupSekarang() {
  if (!confirm('Apakah Anda yakin ingin membuat file backup baru sekarang?')) return;

  showLoading(true);
  try {
    var res = await apiCall('triggerManualBackup', {});
    showLoading(false);

    if (res && res.ok) {
      toastMsg('✅ Backup berhasil dibuat!', 'ok');
      loadLogDanBackup(); // Muat ulang tabel agar file baru muncul
    } else {
      toastMsg(res.error || 'Gagal membuat backup', 'err');
    }
  } catch (e) {
    showLoading(false);
    toastMsg('Error koneksi: ' + e.message, 'err');
  }
}
async function prosesArsipSekarang() {
  if (!confirm('Arsipkan log yang umurnya lebih dari 90 hari ke sheet Audit_Log_Arsip?\n\n(Pastikan Anda sudah melakukan Backup sebelum melakukan ini).')) return;

  showLoading(true);
  try {
    var res = await apiCall('triggerManualArsip', {});
    showLoading(false);

    if (res && res.ok) {
      toastMsg('✅ ' + res.message, 'ok');
      loadLogDanBackup(); // Muat ulang tabel log agar data terbaru muncul
    } else {
      toastMsg(res.error || 'Gagal mengarsipkan log', 'err');
    }
  } catch (e) {
    showLoading(false);
    toastMsg('Error koneksi: ' + e.message, 'err');
  }
}
function previewStempel(input) { var file = input.files && input.files[0]; if (!file) return; if (file.size > 500 * 1024) { alert('Ukuran gambar terlalu besar. Maksimal 500 KB.'); input.value = ''; return; } var reader = new FileReader(); reader.onload = function(e) { window._stempelTemp = e.target.result; var prev = document.getElementById('stempelPreview'); var ph = document.getElementById('stempelPlaceholder'); if (prev) { prev.src = e.target.result; prev.style.display = ''; } if (ph) ph.style.display = 'none'; }; reader.readAsDataURL(file); }
async function simpanStempel() { var ttdBaru = window._stempelTemp; if (!ttdBaru || ttdBaru.indexOf('data:image') !== 0) { toastMsg('Pilih gambar stempel terlebih dahulu'); return; } toastMsg('Mengunggah stempel ke Drive...'); var up = await apiCall('uploadTTD', { jenis: 'stempel', nama: 'klinik', base64: ttdBaru }); if (!up || !up.ok) { toastMsg('Gagal upload: ' + (up && up.error ? up.error : 'error'), 'err'); return; } stempelUrl = up.url; try { localStorage.setItem('labcare_stempel_url', stempelUrl); } catch (e) {} await apiCall('saveStempel', { url: stempelUrl }); window._stempelTemp = undefined; render(); toastMsg('Stempel tersimpan'); }
async function hapusStempel() { if (!confirm('Hapus stempel klinik?')) return; stempelUrl = ''; try { localStorage.removeItem('labcare_stempel_url'); } catch (e) {} await apiCall('saveStempel', { url: '' }); render(); toastMsg('Stempel dihapus'); }
function modalEditPemeriksaan(id) { var p = patients.find(function(x) { return x.id === id; }); if (!p) return; window._editPickedTests = {}; (p.tests || []).forEach(function(k) { window._editPickedTests[k] = true; }); window._editPatientId = id; window._editKatFilter = 'semua'; window._editPickSearch = ''; var html = '<div class="modal-body"><div class="modal-head"><div><h3>Edit Pemeriksaan</h3><p>' + esc(p.nama) + ' • ' + esc(p.noRM) + ' • ' + esc(p.noAntrian) + '</p></div><button class="modal-close" onclick="closeModal()">&times;</button></div><div id="editTestPickerWrap">' + renderEditTestPicker() + '</div><div class="btn-row"><button class="btn btn-primary" style="flex:1;" onclick="simpanEditPemeriksaan()">Simpan Pemeriksaan</button><button class="btn btn-secondary" onclick="closeModal()">Batal</button></div></div>'; document.getElementById('modalContent').innerHTML = html; document.getElementById('modal').classList.add('open'); }
function modalEditPasien(id) {
  var p = patients.find(function(x) { return x.id === id; }); if (!p) return;
  var dokterField;
  if (dokterList.length > 0) { dokterField = '<select id="ep_dokter" class="inp-sel"><option value="">— Pilih Dokter —</option>' + dokterList.map(function(d) { return '<option value="' + esc(d.nama) + '"' + (d.nama === p.dokter ? ' selected' : '') + '>' + esc(d.nama) + '</option>'; }).join('') + '</select>'; }
  else { dokterField = '<input id="ep_dokter" class="inp" value="' + esc(p.dokter || '') + '" placeholder="Nama dokter">'; }
  var analisField;
  if (analisList.length > 0) { analisField = '<select id="ep_analis" class="inp-sel"><option value="">— Pilih Analis —</option>' + analisList.map(function(a) { return '<option value="' + esc(a.nama) + '"' + (a.nama === p.analis ? ' selected' : '') + '>' + esc(a.nama) + '</option>'; }).join('') + '</select>'; }
  else { analisField = '<input id="ep_analis" class="inp" value="' + esc(p.analis || '') + '" placeholder="Nama analis">'; }
  var html = '<div class="modal-body"><div class="modal-head"><div><h3>Edit Data Pasien</h3><p>' + esc(p.noRM) + ' • ' + esc(p.noAntrian) + '</p></div><button class="modal-close" onclick="closeModal()">&times;</button></div>' +
    '<div class="form-row" style="grid-template-columns:1fr;">' +
    '<div><label class="lbl">Nama Lengkap *</label><input id="ep_nama" class="inp" value="' + esc(p.nama || '') + '"></div>' +
    '<div><label class="lbl">Tanggal Lahir *</label><input type="date" id="ep_tglLahir" class="inp" value="' + esc((p.tglLahir || '').slice(0, 10)) + '"></div>' +
    '<div><label class="lbl">Jenis Kelamin</label><select id="ep_jk" class="inp-sel"><option value="L"' + (p.jk === 'L' ? ' selected' : '') + '>Laki-laki</option><option value="P"' + (p.jk === 'P' ? ' selected' : '') + '>Perempuan</option></select></div>' +
    '<div><label class="lbl">No. Telepon</label><input id="ep_telepon" class="inp" value="' + esc(p.telepon || '') + '" placeholder="08xxxxxxxxxx"></div>' +
    '<div><label class="lbl">Pengirim</label><input id="ep_pengirim" class="inp" value="' + esc(p.pengirim || '') + '"></div>' +
    '<div><label class="lbl">Dokter Penanggung Jawab</label>' + dokterField + '</div>' +
    '<div><label class="lbl">Nama Analis</label>' + analisField + '</div>' +
    '<div><label class="lbl">Status Spesimen</label><select id="ep_spesimen" class="inp-sel"><option value="belum"' + (p.spesimen === 'belum' ? ' selected' : '') + '>📦 Belum Ada</option><option value="ada"' + (p.spesimen === 'ada' ? ' selected' : '') + '>📦 Sudah Ada</option></select></div>' +
    '<div><label class="lbl">Alamat</label><textarea id="ep_alamat" class="inp-ta" rows="2">' + esc(p.alamat || '') + '</textarea></div>' +
    '<div><label class="lbl">Catatan Klinis</label><textarea id="ep_catatan" class="inp-ta" rows="2">' + esc(p.catatan || '') + '</textarea></div>' +
    '</div><div class="btn-row"><button class="btn btn-primary" style="flex:1;" onclick="simpanEditPasien(\'' + p.id + '\')">Simpan Perubahan</button><button class="btn btn-secondary" onclick="closeModal()">Batal</button></div></div>';
  document.getElementById('modalContent').innerHTML = html; document.getElementById('modal').classList.add('open');
  setTimeout(function() { var el = document.getElementById('ep_nama'); if (el) el.focus(); }, 100);
}
function simpanEditPasien(id) {
  var p = patients.find(function(x) { return x.id === id; }); if (!p) return;
  var nama = (document.getElementById('ep_nama').value || '').trim();
  if (!nama) { alert('Nama wajib diisi.'); return; }
  p.nama = nama; p.tglLahir = document.getElementById('ep_tglLahir').value; p.jk = document.getElementById('ep_jk').value;
  p.telepon = document.getElementById('ep_telepon').value.trim(); p.pengirim = document.getElementById('ep_pengirim').value.trim();
  p.dokter = document.getElementById('ep_dokter').value.trim(); p.analis = document.getElementById('ep_analis').value.trim();
  p.alamat = document.getElementById('ep_alamat').value.trim(); p.catatan = document.getElementById('ep_catatan').value.trim();
  var spBaru = document.getElementById('ep_spesimen').value;
  if (spBaru !== p.spesimen) { p.spesimen = spBaru; if (spBaru === 'ada' && p.status === 'menunggu') p.status = 'proses'; }
  save(); apiCall('savePasien', p); closeModal(); render(); toastMsg('Data pasien diperbarui', 'ok');
}
function renderEditTestPicker() { var categories = ['semua'].concat(Array.from(new Set(TESTS.map(function(t) { return t.kategori; }))).sort()); var katOptions = categories.map(function(k) { var count = k === 'semua' ? TESTS.length : TESTS.filter(function(t) { return t.kategori === k; }).length; var label = k === 'semua' ? '📋 Semua Kategori' : k; return '<option value="' + esc(k) + '"' + (window._editKatFilter === k ? ' selected' : '') + '>' + label + ' (' + count + ')</option>'; }).join(''); return '<div class="pick-bar"><div><label class="lbl">Filter Kategori</label><select class="inp-sel" onchange="window._editKatFilter=this.value; refreshEditPicker();">' + katOptions + '</select></div><div><label class="lbl">Cari Pemeriksaan</label><input class="inp" placeholder="Ketik nama atau kode..." value="' + esc(window._editPickSearch) + '" oninput="window._editPickSearch=this.value; refreshEditPickerItems();"></div></div><div id="editPickSummaryWrap">' + renderEditPickSummary() + '</div><div class="pick-grid" id="editPickGrid">' + renderEditPickItems() + '</div>'; }
function renderEditPickSummary() { var picked = Object.keys(window._editPickedTests); if (picked.length === 0) return '<div class="pick-chip-row"><span class="empty-text">Belum ada pemeriksaan yang dipilih.</span></div>'; var chips = picked.map(function(kode) { var t = findTest(kode); var nama = t ? t.nama : kode; return '<span class="pick-chip"><span>' + esc(nama) + '</span><button type="button" onclick="removeEditPickedTest(\'' + esc(kode) + '\')" title="Hapus">&times;</button></span>'; }).join(''); return '<div class="pick-chip-row">' + chips + '</div>'; }
function renderEditPickItems() { var filter = window._editKatFilter; var search = (window._editPickSearch || '').toLowerCase(); var filtered = TESTS.filter(function(t) { var matchKat = filter === 'semua' || t.kategori === filter; var matchSearch = !search || t.kode.toLowerCase().indexOf(search) >= 0 || t.nama.toLowerCase().indexOf(search) >= 0; return matchKat && matchSearch; }); if (filtered.length === 0) return '<div class="pick-empty">Tidak ada pemeriksaan yang cocok.</div>'; return filtered.map(function(t) { var picked = !!window._editPickedTests[t.kode]; return '<label class="pick-item' + (picked ? ' picked' : '') + '"><input type="checkbox" ' + (picked ? 'checked' : '') + ' onchange="toggleEditPickedTest(\'' + esc(t.kode) + '\', this.checked)"><div class="pi-body"><div class="pi-name">' + esc(t.nama) + '</div><div class="pi-detail">Rujukan: ' + esc(t.rujukan) + '</div></div><span class="pi-cat">' + esc(t.kategori) + '</span></label>'; }).join(''); }
function refreshEditPicker() { var wrap = document.getElementById('editTestPickerWrap'); if (wrap) wrap.innerHTML = renderEditTestPicker(); }
function refreshEditPickerItems() { var summary = document.getElementById('editPickSummaryWrap'); if (summary) summary.innerHTML = renderEditPickSummary(); var grid = document.getElementById('editPickGrid'); if (grid) grid.innerHTML = renderEditPickItems(); }
function toggleEditPickedTest(kode, checked) { if (checked) window._editPickedTests[kode] = true; else delete window._editPickedTests[kode]; refreshEditPickerItems(); }
function removeEditPickedTest(kode) { delete window._editPickedTests[kode]; refreshEditPickerItems(); }
async function simpanEditPemeriksaan() { var id = window._editPatientId; var p = patients.find(function(x) { return x.id === id; }); if (!p) return; var newTests = Object.keys(window._editPickedTests); if (newTests.length === 0) { alert('Pilih minimal 1 pemeriksaan.'); return; } var oldTests = p.tests || []; if (!p.hasil) p.hasil = {}; oldTests.forEach(function(k) { if (newTests.indexOf(k) < 0) delete p.hasil[k]; }); p.tests = newTests; save(); apiCall('savePasien', p); closeModal(); render(); toastMsg('Pemeriksaan diperbarui (' + newTests.length + ' tes)'); }
function modalTest(kode) {
  editKode = kode || null; var isEdit = !!kode; var t = isEdit ? findTest(kode) : null;
  if (isEdit && !t) { toastMsg('Pemeriksaan tidak ditemukan'); return; }
  var kategoriList = Array.from(new Set(TESTS.map(function(x) { return x.kategori; }))).sort();
  var html = '<div class="modal-body"><div class="modal-head"><div><h3>' + (isEdit ? 'Edit Pemeriksaan' : 'Tambah Pemeriksaan') + '</h3><p>' + (isEdit ? 'Ubah parameter pemeriksaan' : 'Daftarkan pemeriksaan baru') + '</p></div><button class="modal-close" onclick="closeModal()">&times;</button></div>' +
    '<div class="form-row" style="grid-template-columns:1fr;">' +
    '<div><label class="lbl">Kode *</label><input id="t_kode" class="inp" value="' + (t ? esc(t.kode) : '') + '" ' + (isEdit ? 'readonly style="background:var(--slate-100);text-transform:uppercase;font-weight:700;"' : 'placeholder="Contoh: GD" maxlength="10" style="text-transform:uppercase;font-weight:700;"') + '></div>' +
    '<div><label class="lbl">Nama Pemeriksaan *</label><input id="t_nama" class="inp" value="' + (t ? esc(t.nama) : '') + '" placeholder="Contoh: Gula Darah Puasa"></div>' +
    '<div><label class="lbl">Kategori *</label><input id="t_kat" class="inp" list="katList" value="' + (t ? esc(t.kategori) : '') + '" placeholder="Contoh: Kimia"><datalist id="katList">' + kategoriList.map(function(k) { return '<option value="' + esc(k) + '"></option>'; }).join('') + '</datalist></div>' +
    '<div><label class="lbl">Satuan</label><input id="t_sat" class="inp" value="' + (t ? esc(t.satuan) : '') + '" placeholder="Contoh: mg/dL"></div>' +
    '<div><label class="lbl">Nilai Rujukan *</label><input id="t_ruj" class="inp" value="' + (t ? esc(t.rujukan) : '') + '" placeholder="Contoh: 70 - 110"></div>' +
    '<h3 class="section-title">⚡ Kalibrasi (Opsional)</h3>' +
'<div style="background:var(--slate-50);padding:12px;border-radius:10px;border:1px solid var(--slate-200);">' +
'<label style="display:flex;align-items:center;gap:8px;cursor:pointer;font-weight:600;font-size:13px;">' +
'<input type="checkbox" id="t_kal_aktif"' + (t && t.kal_aktif ? ' checked' : '') + ' style="width:18px;height:18px;accent-color:var(--primary);">' +
'Aktifkan kalibrasi untuk tes ini' +
'</label>' +
'<div class="form-row" style="grid-template-columns:1fr 1fr;margin-top:10px;">' +
'<div><label class="lbl">Operator</label><select id="t_kal_op" class="inp-sel">' +
'<option value="*"' + (t && t.kal_operator === '*' ? ' selected' : '') + '>× Kali</option>' +
'<option value="/"' + (t && t.kal_operator === '/' ? ' selected' : '') + '>÷ Bagi</option>' +
'<option value="+"' + (t && t.kal_operator === '+' ? ' selected' : '') + '>+ Tambah</option>' +
'<option value="-"' + (t && t.kal_operator === '-' ? ' selected' : '') + '>− Kurang</option>' +
'</select></div>' +
'<div><label class="lbl">Faktor</label><input type="number" step="any" id="t_kal_faktor" class="inp" value="' + (t && t.kal_faktor ? t.kal_faktor : '1') + '" placeholder="Contoh: 0.5"></div>' +
'</div></div>' +
    '</div>' + (isEdit ? '<div class="info-box"><span class="info-em">ℹ️</span><span>Kode tidak bisa diubah.</span></div>' : '') +
    '<div class="btn-row"><button class="btn btn-primary" style="flex:1;" onclick="simpanTest()">Simpan</button><button class="btn btn-secondary" onclick="closeModal()">Batal</button></div></div>';
  document.getElementById('modalContent').innerHTML = html; document.getElementById('modal').classList.add('open');
  setTimeout(function() { var el = document.getElementById(isEdit ? 't_nama' : 't_kode'); if (el) el.focus(); }, 100);
}
function simpanTest() {
  var kode = (document.getElementById('t_kode').value || '').trim().toUpperCase().replace(/\s+/g, '');
  var nama = (document.getElementById('t_nama').value || '').trim();
  var kategori = (document.getElementById('t_kat').value || '').trim();
  var satuan = (document.getElementById('t_sat').value || '').trim();
  var rujukan = (document.getElementById('t_ruj').value || '').trim();
  var kalAktif = document.getElementById('t_kal_aktif').checked;
  var kalOp = document.getElementById('t_kal_op').value;
  var kalFaktor = parseFloat(document.getElementById('t_kal_faktor').value) || 1;
  
  if (!kode || !nama || !kategori || !rujukan) {
    alert('Semua kolom bertanda * harus diisi.');
    return;
  }
  
  if (editKode) {
    var t = findTest(editKode);
    if (!t) { toastMsg('Pemeriksaan tidak ditemukan'); return; }
    t.nama = nama;
    t.kategori = kategori;
    t.satuan = satuan;
    t.rujukan = rujukan;
    t.kal_aktif = kalAktif;
    t.kal_operator = kalOp;
    t.kal_faktor = kalFaktor;
    saveTests();
    closeModal();
    render();
    toastMsg('Pemeriksaan diperbarui');
  } else {
    if (findTest(kode)) { alert('Kode "' + kode + '" sudah digunakan.'); return; }
    TESTS.push({
      kode: kode,
      nama: nama,
      kategori: kategori,
      satuan: satuan,
      rujukan: rujukan,
      kal_aktif: kalAktif,
      kal_operator: kalOp,
      kal_faktor: kalFaktor
    });
    saveTests();
    closeModal();
    render();
    toastMsg('Pemeriksaan ditambahkan');
  }
}
function hapusTest(kode) { var t = findTest(kode); if (!t) return; var usedCount = patients.filter(function(p) { return p.tests && p.tests.indexOf(kode) >= 0; }).length; var msg = 'Hapus pemeriksaan "' + t.nama + '" (' + kode + ')?'; if (usedCount > 0) msg += '\n\n⚠️ Sudah dipakai di ' + usedCount + ' data pasien.'; if (!confirm(msg)) return; TESTS = TESTS.filter(function(x) { return x.kode !== kode; }); delete window._pickedTests[kode]; saveTests(); render(); toastMsg('Pemeriksaan dihapus'); }
function modalKaryawan(jenis, id) {
  editKaryawanId = id || null; var isEdit = !!id; var list = jenis === 'analis' ? analisList : dokterList;
  var k = isEdit ? list.find(function(x) { return x.id === id; }) : null;
  if (isEdit && !k) { toastMsg('Data tidak ditemukan'); return; }
  var labelJenis = jenis === 'analis' ? 'Analis' : 'Dokter';
  var placeholderNama = jenis === 'analis' ? 'Contoh: Siti Rahma, A.Md.AK' : 'Contoh: dr. Budi Santoso';
  var placeholderKode = jenis === 'analis' ? 'Contoh: NIP-001 (opsional)' : 'Contoh: SIP-12345 (opsional)';
  var html = '<div class="modal-body"><div class="modal-head"><div><h3>' + (isEdit ? 'Edit ' + labelJenis : 'Tambah ' + labelJenis) + '</h3><p>' + (isEdit ? 'Ubah data' : 'Daftarkan baru') + '</p></div><button class="modal-close" onclick="closeModal()">&times;</button></div>' +
    '<div class="form-row" style="grid-template-columns:1fr;">' +
    '<div><label class="lbl">Nama ' + labelJenis + ' *</label><input id="k_nama" class="inp" value="' + (k ? esc(k.nama) : '') + '" placeholder="' + placeholderNama + '"></div>' +
    '<div><label class="lbl">' + (jenis === 'analis' ? 'NIP / Kode' : 'SIP / Kode') + '</label><input id="k_kode" class="inp" value="' + (k ? esc(k.kode || '') : '') + '" placeholder="' + placeholderKode + '"></div>' +
    '<div><label class="lbl">Tanda Tangan</label><input type="file" id="k_ttd" accept="image/*" class="inp" onchange="previewTTD(this)"><div style="margin-top:8px; padding:8px; border:1px dashed var(--slate-300); border-radius:8px; background:#fff; min-height:70px; display:flex; align-items:center; justify-content:center;"><img id="ttdPreview" src="' + (k && k.ttd ? esc(k.ttd) : '') + '" style="max-height:60px; max-width:100%; object-fit:contain; ' + (k && k.ttd ? '' : 'display:none;') + '"><span id="ttdPlaceholder" style="font-size:11px; color:var(--slate-400); ' + (k && k.ttd ? 'display:none;' : '') + '">Belum ada tanda tangan</span></div>' +
    (k && k.ttd ? '<button type="button" class="btn btn-secondary btn-sm" style="margin-top:6px;" onclick="hapusTTD()">🗑️ Hapus TTD</button>' : '') +
    '</div></div>' +
    '<div class="btn-row"><button class="btn btn-primary" style="flex:1;" onclick="simpanKaryawan(\'' + jenis + '\')">Simpan</button><button class="btn btn-secondary" onclick="closeModal()">Batal</button></div></div>';
  document.getElementById('modalContent').innerHTML = html; document.getElementById('modal').classList.add('open');
  setTimeout(function() { var el = document.getElementById('k_nama'); if (el) el.focus(); }, 100);
  window._ttdTemp = undefined;
}
function previewTTD(input) { var file = input.files && input.files[0]; if (!file) return; if (file.size > 500 * 1024) { alert('Ukuran gambar terlalu besar. Maksimal 500 KB.'); input.value = ''; return; } var reader = new FileReader(); reader.onload = function(e) { window._ttdTemp = e.target.result; var prev = document.getElementById('ttdPreview'); var ph = document.getElementById('ttdPlaceholder'); if (prev) { prev.src = e.target.result; prev.style.display = ''; } if (ph) ph.style.display = 'none'; }; reader.readAsDataURL(file); }
function hapusTTD() { window._ttdTemp = ''; var prev = document.getElementById('ttdPreview'); var ph = document.getElementById('ttdPlaceholder'); if (prev) { prev.src = ''; prev.style.display = 'none'; } if (ph) ph.style.display = ''; toastMsg('Tanda tangan dihapus saat disimpan'); }
async function simpanKaryawan(jenis) {
  var nama = (document.getElementById('k_nama').value || '').trim();
  var kodeEl = document.getElementById('k_kode'); var kode = kodeEl ? kodeEl.value.trim() : '';
  if (!nama) { alert('Nama harus diisi.'); return; }
  var list = jenis === 'analis' ? analisList : dokterList;
  var saveFn = jenis === 'analis' ? saveAnalis : saveDokter;
  var ttdBaru = window._ttdTemp; var ttdUrl = undefined;
  if (ttdBaru === '') { ttdUrl = ''; }
  else if (ttdBaru && ttdBaru.indexOf('data:image') === 0) { toastMsg('Mengunggah tanda tangan ke Drive...'); var up = await apiCall('uploadTTD', { jenis: jenis, nama: nama, base64: ttdBaru }); if (!up || !up.ok) { toastMsg('Gagal upload', 'err'); return; } ttdUrl = up.url; }
  else if (ttdBaru && ttdBaru.indexOf('http') === 0) { ttdUrl = ttdBaru; }
  if (editKaryawanId) { var k = list.find(function(x) { return x.id === editKaryawanId; }); if (!k) return; k.nama = nama; k.kode = kode; if (ttdUrl !== undefined) k.ttd = ttdUrl; saveFn(); closeModal(); render(); toastMsg('Data diperbarui'); }
  else { list.push({ id: uidK(), nama: nama, kode: kode, ttd: ttdUrl || '' }); saveFn(); closeModal(); render(); toastMsg('Data ditambahkan'); }
}
function hapusKaryawan(jenis, id) { var list = jenis === 'analis' ? analisList : dokterList; var k = list.find(function(x) { return x.id === id; }); if (!k) return; if (!confirm('Hapus?')) return; if (jenis === 'analis') { analisList = analisList.filter(function(x) { return x.id !== id; }); saveAnalis(); } else { dokterList = dokterList.filter(function(x) { return x.id !== id; }); saveDokter(); } render(); toastMsg('Data dihapus'); }
function hapusPasien(id) { 
  if (!confirm('Hapus data pasien ini?')) return; 
  var p = patients.find(function(x) { return x.id === id; });
  var namaPasien = p ? p.nama : 'Tidak Diketahui';
  
  patients = patients.filter(function(p) { return p.id !== id; }); 
  save(); 
  apiCall('deletePasien', { id: id, nama: namaPasien }); 
  render(); 
  toastMsg('Pasien dihapus'); 
}
function resetData() { if (!confirm('Hapus SEMUA data pasien?')) return; patients = []; save(); apiCall('resetPasien'); render(); toastMsg('Semua data pasien dihapus'); }
function modalHasil(id) {
  var p = patients.find(function(x) { return x.id === id; }); if (!p) return;
  var tests = p.tests || []; var hasil = p.hasil || {};
  var fieldsHtml = tests.map(function(k) {
  var t = findTest(k);
  if (!t) {
    return '<div class="result-item" style="opacity:.7;"><div><div class="ri-name">' + esc(k) + '</div><div class="ri-ref">Rujukan: -</div></div>' +
      '<input id="h_' + k + '" value="' + esc(hasil[k] || '') + '" placeholder="Hasil"><div class="ri-unit">-</div></div>';
  }
  if (t.kal_aktif) {
    return '<div style="background:var(--slate-50);border-radius:10px;padding:12px;margin-bottom:6px;">' +
      '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">' +
      '<div class="ri-name" style="font-size:14px;font-weight:600;">' + esc(t.nama) + '</div>' +
      '<span style="font-size:10px;background:var(--primary-light);color:var(--primary);padding:2px 8px;border-radius:999px;font-weight:700;">⚡ Kalibrasi</span>' +
      '</div>' +
      '<div class="ri-ref" style="font-size:11px;color:var(--slate-400);margin-bottom:8px;">Rujukan: ' + esc(t.rujukan) + (t.satuan ? ' • ' + esc(t.satuan) : '') + '</div>' +
      '<div style="display:flex;gap:10px;align-items:flex-end;">' +
      '<div style="flex:1;">' +
      '<label style="font-size:11px;color:var(--slate-500);font-weight:600;display:block;margin-bottom:2px;">Bacaan:</label>' +
      '<input id="raw_' + k + '" type="number" step="any" class="inp" value="" placeholder="Input" oninput="hitungKalibrasi(\'' + k + '\')" style="padding:8px 10px;font-size:14px;">' +
      '</div>' +
      '<div style="flex:1;">' +
      '<label style="font-size:11px;color:var(--slate-500);font-weight:600;display:block;margin-bottom:2px;">Hasil:</label>' +
      '<input id="h_' + k + '" type="number" step="any" class="inp" value="' + esc(hasil[k] || '') + '" placeholder="Auto" style="padding:8px 10px;font-size:14px;font-weight:700;color:var(--primary);">' +
      '</div>' +
      '</div>' +
      '<div style="font-size:10px;color:var(--slate-400);margin-top:6px;font-style:italic;">⚡ Auto-hitung: Bacaan ' + (t.kal_operator || '*') + ' ' + (t.kal_faktor || 1) + '</div>' +
      '</div>';
  }
  return '<div class="result-item"><div><div class="ri-name">' + esc(t.nama) + '</div>' +
    '<div class="ri-ref">Rujukan: ' + esc(t.rujukan) + '</div></div>' +
    '<input id="h_' + k + '" value="' + esc(hasil[k] || '') + '" placeholder="Hasil">' +
    '<div class="ri-unit">' + esc(t.satuan || '-') + '</div></div>';
}).join('');
  var analisField;
  if (analisList.length > 0) { var currentAnalis = p.analis || ''; var options = '<option value="">— Pilih Analis —</option>' + analisList.map(function(a) { return '<option value="' + esc(a.nama) + '"' + (a.nama === currentAnalis ? ' selected' : '') + '>' + esc(a.nama) + (a.kode ? ' (' + esc(a.kode) + ')' : '') + '</option>'; }).join(''); analisField = '<select id="analisEdit" class="inp-sel">' + options + '</select>'; }
  else { analisField = '<input id="analisEdit" class="inp" value="' + esc(p.analis || '') + '" placeholder="Nama analis">'; }
  var html = '<div class="modal-body"><div class="modal-head"><div><h3>Input Hasil</h3><p>' + esc(p.nama) + ' • ' + esc(p.noRM) + ' • ' + esc(p.noAntrian) + '</p></div><button class="modal-close" onclick="closeModal()">&times;</button></div>' +
    '<div class="result-list">' + fieldsHtml + '</div>' +
    '<div style="margin-top:16px;"><label class="lbl">Nama Analis</label>' + analisField + '</div>' +
    '<div style="margin-top:16px;"><label class="lbl">Kesimpulan / Catatan Petugas</label><textarea id="kesimpulan" rows="2" class="inp-ta">' + esc(p.kesimpulan || '') + '</textarea></div>' +
    '<div class="btn-row"><button class="btn btn-primary" style="flex:1;" onclick="simpanHasil(\'' + p.id + '\')">Simpan Hasil</button><button class="btn btn-secondary" onclick="closeModal()">Batal</button></div></div>';
  document.getElementById('modalContent').innerHTML = html; document.getElementById('modal').classList.add('open');
}
  function hitungKalibrasi(kode) {
  var t = findTest(kode);
  if (!t || !t.kal_aktif) return;
  var rawEl = document.getElementById('raw_' + kode);
  var outEl = document.getElementById('h_' + kode);
  if (!rawEl || !outEl) return;
  var raw = parseFloat(rawEl.value);
  if (isNaN(raw)) { outEl.value = ''; return; }
  var faktor = parseFloat(t.kal_faktor) || 1;
  var result = raw;
  switch (t.kal_operator) {
    case '*': result = raw * faktor; break;
    case '/': result = faktor ? raw / faktor : raw; break;
    case '+': result = raw + faktor; break;
    case '-': result = raw - faktor; break;
  }
  result = Math.round(result * 100) / 100;
  outEl.value = result;
}
function inputHasilPasien(id) { closeModal(); view = 'hasil'; renderNav(); render(); setTimeout(function() { modalHasil(id); }, 150); }
async function simpanHasil(id) {
  var p = patients.find(function(x) { return x.id === id; }); if (!p) return;
  if (!p.hasil) p.hasil = {};
  (p.tests || []).forEach(function(k) { var el = document.getElementById('h_' + k); if (el && el.value.trim()) p.hasil[k] = el.value.trim(); });
  var analisEl = document.getElementById('analisEdit'); if (analisEl) p.analis = analisEl.value.trim();
  var kes = document.getElementById('kesimpulan'); p.kesimpulan = kes ? kes.value.trim() : '';
  var filled = (p.tests || []).filter(function(k) { return p.hasil[k]; }).length;
  if (filled === (p.tests || []).length && p.status !== 'selesai') p.status = 'selesai';
save();
showLoading(true); 

// --- PERBAIKAN: Paksa timpa data (bypass cek konflik) ---
p._forceOverwrite = true; 
var res = await apiCall('savePasien', p);
showLoading(false);

if (!res || !res.ok) {
  // Tampilkan pesan error yang lebih akurat
  var pesanErr = '';
  if (res && res.error) {
    pesanErr = res.error;
  } else if (res && res.conflict) {
    pesanErr = 'Data telah diubah oleh pengguna lain. Silakan refresh halaman.';
  } else {
    pesanErr = 'Gagal sinkron ke server. Periksa koneksi internet.';
  }
  alert('GAGAL MENYIMPAN:\n\n' + pesanErr);
  return;
}
// --------------------------------------------------------  
var sisa = (p.tests || []).length - filled;
  document.getElementById('modalContent').innerHTML = '<div class="modal-success"><div class="big-em"><svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#059669" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg></div><h3>Hasil Tersimpan</h3><p>' + esc(p.nama) + ' — ' + esc(p.noRM) + '</p><div class="success-number-box"><p>Pemeriksaan</p><div class="big-no">' + filled + '/' + (p.tests || []).length + '</div><p style="margin-top:8px;font-size:12px;color:' + (sisa > 0 ? 'var(--warning)' : 'var(--success)') + ';font-weight:600;">' + (sisa > 0 ? sisa + ' tes belum diisi' : '✓ Lengkap') + '</p></div>' +
    '<div style="display:flex;flex-direction:column;gap:8px;">' +
    '<button class="btn btn-primary" style="width:100%;" onclick="closeModal(); cetakHasil(\'' + p.id + '\');">Cetak Hasil Sekarang</button>' +
    '<button class="btn btn-secondary" style="width:100%;" onclick="closeModal(); render();">Edit Lagi</button>' +
    '<button class="btn btn-secondary" style="width:100%;" onclick="closeModal(); view=\'antrian\'; renderNav(); render();">Selesai</button>' +
    '</div></div>';
  document.getElementById('modal').classList.add('open');
}
function closeModal() { document.getElementById('modal').classList.remove('open'); editKode = null; editKaryawanId = null; window._ttdTemp = undefined; }
function showPrintPreview(html, title, options) {
  options = options || {}; var footerHtml = options.footerHtml || '';
  var overlay = document.getElementById('printOverlay');
  if (!overlay) { overlay = document.createElement('div'); overlay.id = 'printOverlay'; document.body.appendChild(overlay); }
  overlay.innerHTML = '<div class="print-toolbar"><button class="print-btn-cancel" onclick="closePrintPreview()">✕ Tutup</button><div class="print-title">' + esc(title || 'Pratinjau Cetak') + '</div><button class="print-btn-print" onclick="window.print()">Cetak / PDF</button></div>' +
    '<div class="print-page" style="position:relative;padding:0;box-sizing:border-box;width:210mm;height:287mm;overflow:hidden;">' +
    '<img src="assets/images/border.png" alt="" style="position:absolute;top:0;left:0;width:100%;height:287mm;object-fit:fill;z-index:0;pointer-events:none;">' +
    '<div style="position:absolute;top:13mm;left:20mm;right:20mm;bottom:72mm;overflow:hidden;z-index:1;">' + html + '</div>' +
    (footerHtml ? '<div style="position:absolute;bottom:20mm;left:20mm;right:20mm;z-index:2;">' + footerHtml + '</div>' : '') +
    '</div>';
  overlay.classList.add('open'); document.body.style.overflow = 'hidden';
}
function closePrintPreview() { var overlay = document.getElementById('printOverlay'); if (overlay) { overlay.classList.remove('open'); overlay.innerHTML = ''; } document.body.style.overflow = ''; }
function buildTwoColumnHtml(grouped) {
  var catData = Object.keys(grouped).map(function(kat) { return { kat: kat, items: grouped[kat], weight: grouped[kat].length + 1 }; });
  var totalWeight = catData.reduce(function(s, c) { return s + c.weight; }, 0);
  var halfWeight = totalWeight / 2; var runningWeight = 0; var leftCats = [], rightCats = [];
  catData.forEach(function(c) { if (leftCats.length === 0 || runningWeight + c.weight <= halfWeight + 1) { leftCats.push(c); runningWeight += c.weight; } else { rightCats.push(c); } });
  if (rightCats.length === 0 && leftCats.length > 1) { rightCats.push(leftCats.pop()); }
  function renderCat(catList) { return catList.map(function(c) { var h = '<div style="font-size:10px; font-weight:bold; color:#000; margin:5px 0 2px 0; padding-bottom:1px; border-bottom:1px solid #333;">' + esc(c.kat) + '</div>'; c.items.forEach(function(item) { var rujukanLengkap = item.t.rujukan + (item.t.satuan ? ' ' + item.t.satuan : ''); h += '<div style="margin-bottom:1px;"><div style="line-height:1.15; overflow:hidden;"><span style="float:left; width:65%; font-size:10px; color:#000;">' + esc(item.t.nama) + '</span><span style="float:right; width:33%; text-align:right; font-weight:bold; font-size:12px; color:#000;">' + esc(item.hasil || '-') + '</span><div style="clear:both;"></div></div><div style="font-size:8px; color:#555; line-height:1.05;">' + esc(rujukanLengkap) + '</div></div>'; }); return h; }).join(''); }
  return '<div style="width:100%; overflow:hidden;"><div style="float:left; width:50%; padding-right:5px; box-sizing:border-box;">' + renderCat(leftCats) + '</div><div style="float:left; width:50%; padding-left:5px; box-sizing:border-box;">' + renderCat(rightCats) + '</div><div style="clear:both;"></div></div>';
}
function cetakHasil(id) {
  var p = patients.find(function(x) { return x.id === id; }); if (!p) return;
  apiCall('logActivityManual', { aksi: '🖨️ Cetak Hasil Lab (Umum)', detail: 'Pasien: ' + p.nama + ' | RM: ' + p.noRM });
  var hasil = p.hasil || {};
  var totalTes = (p.tests || []).length; var fs;
  if (totalTes <= 18) fs = 12; else if (totalTes <= 25) fs = 11; else fs = 10;
  var tanggalKode = (p.tglDaftar || '').slice(0, 10).replace(/-/g, '');
  var antrianKode = (p.noAntrian || 'A-001').replace('A-', '');
  var nomorLab = tanggalKode + '-' + antrianKode;
  var grouped = {};
  (p.tests || []).forEach(function(kode) { var t = findTest(kode) || { nama: kode, kategori: 'Lainnya', satuan: '', rujukan: '-' }; var kat = (t.kategori || 'Lainnya').toUpperCase(); if (!grouped[kat]) grouped[kat] = []; grouped[kat].push({ kode: kode, t: t, hasil: hasil[kode] }); });
  var rowsHtml = '';
  if (totalTes > 25) { rowsHtml = buildTwoColumnHtml(grouped); }
  else { Object.keys(grouped).forEach(function(kat) { rowsHtml += '<div style="width: 100%; margin-top: 6px; font-weight: bold; font-size: ' + fs + 'px; color: #000;">' + esc(kat) + '</div>'; grouped[kat].forEach(function(item) { var rujukanLengkap = item.t.rujukan + (item.t.satuan ? ' ' + item.t.satuan : ''); rowsHtml += '<div style="width: 100%; margin-bottom: 3px; overflow: hidden;"><div style="float: left; width: 45%; font-size: ' + fs + 'px; color: #000; padding-right: 10px; box-sizing: border-box; text-align: left;">' + esc(item.t.nama) + '</div><div style="float: left; width: 15%; text-align: center; font-size: ' + fs + 'px; color: #000;">' + esc(item.hasil || '-') + '</div><div style="float: left; width: 40%; font-size: ' + fs + 'px; color: #000; padding-left: 10px; box-sizing: border-box; text-align: left;">' + esc(rujukanLengkap) + '</div><div style="clear: both;"></div></div>'; }); }); }
  var logoKiriHtml = CLINIC.logoKiri ? '<img src="' + esc(CLINIC.logoKiri) + '" style="max-width:100%; max-height:100%; object-fit:contain;">' : '';
  var logoKananHtml = CLINIC.logoKanan ? '<img src="' + esc(CLINIC.logoKanan) + '" style="max-width:100%; max-height:100%; object-fit:contain;">' : '';
  var analisData = analisList.find(function(a) { return a.nama === p.analis; });
  var dokterData = dokterList.find(function(d) { return d.nama === p.dokter; });
  var ttdAnalisHtml = analisData && analisData.ttd ? '<img src="' + analisData.ttd + '" style="max-height:150px; max-width:90%; object-fit:contain; display:block; margin:0 auto 2px;">' : '';
  var ttdDokterHtml = dokterData && dokterData.ttd ? '<img src="' + dokterData.ttd + '" style="max-height:150px; max-width:90%; object-fit:contain; display:block; margin:0 auto 2px;">' : '';
  var html = '<div style="position:relative; width:100%; background:transparent; padding: 0; font-family: Arial, sans-serif;">' +
    '<div style="display:flex; align-items:center; justify-content:space-between; padding-bottom:4px;">' +
    '<div style="width:80px; height:80px; flex-shrink:0; display:flex; align-items:center; justify-content:center;">' + logoKiriHtml + '</div>' +
    '<div style="flex:1; text-align:center; padding: 0 10px;">' +
    '<div style="font-size:11.5px; font-weight:800; color:#000;">' + esc(CLINIC.baris1) + '</div>' +
    '<div style="font-size:11.5px; font-weight:800; color:#000;">' + esc(CLINIC.baris2) + '</div>' +
    '<div style="font-size:15px; font-weight:900; color:#000; margin:2px 0;">' + esc(CLINIC.baris3) + '</div>' +
    '<div style="font-size:9px; color:#000;">' + esc(CLINIC.alamat) + '</div>' +
    '<div style="font-size:9px; color:#000;">Website :' + esc(CLINIC.website) + '</div>' +
    '</div><div style="width:110px; height:110px; flex-shrink:0; display:flex; align-items:center; justify-content:center;">' + logoKananHtml + '</div></div>' +
    '<div style="border-top:2.5px solid #000; margin:0;"></div><div style="border-top:0.8px solid #000; margin-top:2px;"></div>' +
    '<div style="text-align:center; margin-top:10px; margin-bottom:4px;"><div style="font-size:16px; font-weight:bold; color:#000;">HASIL PEMERIKSAAN LABORATORIUM</div></div>' +
    '<div style="margin-top:0; margin-bottom:12px; font-size:12px; color:#000; line-height:1.25;">' +
    '<div style="width: 100%; overflow: hidden; margin-bottom: 2px;"><div style="float: left; width: 15%;">Nama</div><div style="float: left; width: 45%;">: ' + esc(p.nama) + '</div><div style="float: left; width: 20%;">Tanggal Periksa</div><div style="float: left; width: 20%;">: ' + esc(p.tglDaftar ? p.tglDaftar.slice(0, 10) : '-') + '</div><div style="clear: both;"></div></div>' +
    '<div style="width: 100%; overflow: hidden; margin-bottom: 2px;"><div style="float: left; width: 15%;">Umur</div><div style="float: left; width: 45%;">: ' + esc(umur(p.tglLahir)) + '</div><div style="float: left; width: 20%;">Nomor Register</div><div style="float: left; width: 20%;">: ' + esc(nomorLab) + '</div><div style="clear: both;"></div></div>' +
    '<div style="width: 100%; overflow: hidden; margin-bottom: 2px;"><div style="float: left; width: 15%;">Alamat</div><div style="float: left; width: 45%;">: ' + esc(p.alamat || '-') + '</div><div style="float: left; width: 20%;">Pengirim</div><div style="float: left; width: 20%;">: ' + esc(p.pengirim || '-') + '</div><div style="clear: both;"></div></div></div>' +
    (totalTes > 25 ? '' : '<div style="width: 100%; border-bottom: 2px solid #000; padding-bottom: 6px; margin-bottom: 6px; font-weight: bold; font-size: 12px; color:#000; overflow: hidden;"><div style="float: left; width: 45%; text-align: left;">PEMERIKSAAN LABORATORIUM</div><div style="float: left; width: 15%; text-align: center;">HASIL</div><div style="float: left; width: 40%; text-align: left; padding-left: 10px; box-sizing: border-box;">NILAI RUJUKAN</div><div style="clear: both;"></div></div>') +
    '<div style="width: 100%; overflow: hidden;">' + rowsHtml + '</div></div>';
 var ttdHtml =
    '<div style="display:flex; width:100%; font-size:12px; color:#000;">' +
      '<div style="width:50%; text-align:center; padding:6px 12px 0; font-weight:bold;">&nbsp;<br>Pemeriksa,</div>' +
      '<div style="width:50%; text-align:center; padding:6px 12px 0; font-weight:bold;">Mengetahui,<br>Dokter Penanggungjawab</div>' +
    '</div>' +
    '<div style="display:flex; width:100%; font-size:12px; color:#000;">' +
      '<div style="width:50%; text-align:center; position:relative; height:80px; padding:0 12px;">' +
        (ttdAnalisHtml ? '<div style="position:absolute; top:50%; left:50%; transform:translate(-50%,-50%); width:95%; text-align:center;">' + ttdAnalisHtml + '</div>' : '') +
      '</div>' +
      '<div style="width:50%; text-align:center; position:relative; height:80px; padding:0 12px;">' +
        (ttdDokterHtml ? '<div style="position:absolute; top:50%; left:50%; transform:translate(-50%,-50%); width:95%; text-align:center;">' + ttdDokterHtml + '</div>' : '') +
        (stempelUrl ? '<img src="' + stempelUrl + '" style="position:absolute; top:-120px; left:0%; width:225px; height:225px; object-fit:contain; opacity:0.75; z-index:2; pointer-events:none; mix-blend-mode:multiply;">' : '') +
      '</div>' +
    '</div>' +
    '<div style="display:flex; width:100%; font-size:12px; color:#000;">' +
      '<div style="width:50%; text-align:center; padding:0 12px; font-weight:bold;">' + esc(p.analis || 'Linda Hardiyanti Putri, A.Md.Kes') + '</div>' +
      '<div style="width:50%; text-align:center; padding:0 12px; font-weight:bold;">' + esc(p.dokter || 'dr. Arief Sudibyo') + '</div>' +
    '</div>' +
    '<div style="display:flex; width:100%; font-size:12px; color:#000;">' +
      '<div style="width:50%; text-align:center; padding:0 12px;">' + esc(analisData && analisData.kode ? analisData.kode : 'NIP. -') + '</div>' +
      '<div style="width:50%; text-align:center; padding:0 12px;">' + esc(dokterData && dokterData.kode ? dokterData.kode : 'NIP. -') + '</div>' +
    '</div>';
  showPrintPreview(html, 'Hasil Lab — ' + p.nama, { footerHtml: ttdHtml });
}
function cetakLaporan() {
  var list = patients.slice().sort(function(a, b) { return (b.tglDaftar || '').localeCompare(a.tglDaftar || ''); });
  var rows = list.map(function(p, i) { var names = (p.tests || []).map(function(k) { var t = findTest(k); return t ? t.nama : k; }).join(', '); return '<tr><td style="padding:5px 6px;border-bottom:1px solid #e2e8f0;text-align:center;">' + (i + 1) + '</td><td style="padding:5px 6px;font-family:monospace;font-size:10px;">' + esc(p.noRM) + '</td><td style="padding:5px 6px;font-weight:500;">' + esc(p.nama) + '</td><td style="padding:5px 6px;font-size:10px;">' + esc(umur(p.tglLahir)) + ' / ' + esc(p.jk) + '</td><td style="padding:5px 6px;font-size:10px;color:#64748b;">' + esc(names) + '</td><td style="padding:5px 6px;font-size:10px;">' + esc(p.pengirim || '-') + '</td><td style="padding:5px 6px;font-size:10px;">' + esc(p.dokter || '-') + '</td><td style="padding:5px 6px;font-size:10px;">' + esc(p.analis || '-') + '</td><td style="padding:5px 6px;font-size:10px;">' + (STATUS[p.status] ? STATUS[p.status].label : p.status) + '</td><td style="padding:5px 6px;font-size:10px;">' + esc(fmtDate(p.tglDaftar)) + '</td></tr>'; }).join('');
  var tglCetak = new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' });
  var jamCetak = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
  var totalPasien = list.length; var totalSelesai = list.filter(function(p) { return p.status === 'selesai'; }).length; var totalProses = list.filter(function(p) { return p.status === 'proses' || p.status === 'sampling'; }).length; var totalMenunggu = list.filter(function(p) { return p.status === 'menunggu'; }).length;
  var logoKiriHtml = CLINIC.logoKiri ? '<img src="' + esc(CLINIC.logoKiri) + '" style="max-width:100%;max-height:100%;object-fit:contain;">' : '';
  var logoKananHtml = CLINIC.logoKanan ? '<img src="' + esc(CLINIC.logoKanan) + '" style="max-width:100%;max-height:100%;object-fit:contain;">' : '';
  var html = '<div style="position:relative;"><div style="position:relative;z-index:2;">' +
    '<div style="display:flex;align-items:center;gap:14px;padding-bottom:10px;border-bottom:1px solid #94a3b8;margin-bottom:4px;"><div style="width:75px;height:75px;flex-shrink:0;display:flex;align-items:center;justify-content:center;">' + logoKiriHtml + '</div>' +
    '<div style="flex:1;text-align:center;">' +
    '<div style="font-size:10.5px;font-weight:600;color:#334155;">' + esc(CLINIC.baris1) + '</div>' +
    '<div style="font-size:10.5px;font-weight:600;color:#334155;">' + esc(CLINIC.baris2) + '</div>' +
    '<div style="font-size:15px;font-weight:800;color:#0f172a;margin-top:2px;">' + esc(CLINIC.baris3) + '</div>' +
    '<div style="font-size:9px;color:#64748b;">' + esc(CLINIC.alamat) + '</div>' +
    '</div><div style="width:75px;height:75px;flex-shrink:0;display:flex;align-items:center;justify-content:center;">' + logoKananHtml + '</div></div>' +
    '<div style="text-align:center;border-top:2px solid #0f172a;border-bottom:2px solid #0f172a;padding:6px 0;margin-bottom:12px;"><div style="font-size:13px;font-weight:800;color:#0f172a;">LAPORAN DATA PASIEN LABORATORIUM</div></div>' +
    '<div style="display:flex;gap:8px;margin-bottom:12px;font-size:10px;">' +
    '<div style="flex:1;padding:8px 10px;background:#fef3c7;border-radius:6px;"><b style="font-size:14px;color:#b45309;">' + totalMenunggu + '</b><br><span style="color:#78350f;">Menunggu</span></div>' +
    '<div style="flex:1;padding:8px 10px;background:#f3e8ff;border-radius:6px;"><b style="font-size:14px;color:#7e22ce;">' + totalProses + '</b><br><span style="color:#581c87;">Diproses</span></div>' +
    '<div style="flex:1;padding:8px 10px;background:#dcfce7;border-radius:6px;"><b style="font-size:14px;color:#15803d;">' + totalSelesai + '</b><br><span style="color:#14532d;">Selesai</span></div>' +
    '<div style="flex:1;padding:8px 10px;background:#dbeafe;border-radius:6px;"><b style="font-size:14px;color:#1d4ed8;">' + totalPasien + '</b><br><span style="color:#1e3a8a;">Total</span></div></div>' +
    '<table style="width:100%;border-collapse:collapse;font-size:10px;"><thead><tr style="background:' + CLINIC.warnaHijau + ';color:#fff;"><th style="text-align:center;padding:6px;width:28px;">No</th><th style="text-align:left;padding:6px;">No. RM</th><th style="text-align:left;padding:6px;">Nama</th><th style="text-align:left;padding:6px;">Umur/JK</th><th style="text-align:left;padding:6px;">Pemeriksaan</th><th style="text-align:left;padding:6px;">Pengirim</th><th style="text-align:left;padding:6px;">DPJP</th><th style="text-align:left;padding:6px;">Analis</th><th style="text-align:left;padding:6px;">Status</th><th style="text-align:left;padding:6px;">Tanggal</th></tr></thead><tbody>' + rows + '</tbody></table>' +
    '<div style="margin-top:24px;display:flex;justify-content:flex-end;font-size:11px;"><div style="text-align:center;"><div style="color:#64748b;font-size:10px;margin-bottom:4px;">Dicetak: ' + esc(tglCetak) + ' ' + esc(jamCetak) + '</div><div style="height:40px;"></div><div style="border-top:1px solid #0f172a;padding-top:4px;font-weight:600;min-width:180px;">Petugas LabCare</div></div></div>' +
    '<div style="margin-top:18px;padding-top:8px;border-top:1px solid #e2e8f0;font-size:9px;color:#94a3b8;text-align:center;font-style:italic;">Dokumen ini dicetak otomatis oleh sistem LabCare</div></div></div>';
  showPrintPreview(html, 'Laporan Pasien — ' + totalPasien + ' data');
}
function updateClock() { var d = new Date(); var t = d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }); var dd = d.toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric', month: 'short' }); var el = document.getElementById('clock'); if (el) el.textContent = t + ' • ' + dd; }
setInterval(updateClock, 1000); updateClock();
document.addEventListener('submit', function(e) {
  if (e.target.id !== 'formDaftar') return;
  e.preventDefault();
  var f = new FormData(e.target);
  var tests = Object.keys(window._pickedTests);
  if (tests.length === 0) { alert('Pilih minimal satu pemeriksaan laboratorium.'); return; }
  var spesimen = f.get('spesimen') || 'belum';
  var statusAwal = spesimen === 'ada' ? 'proses' : 'menunggu';
  var p = { id: uid(), noRM: f.get('noRM'), nama: f.get('nama').trim(), tglLahir: f.get('tglLahir'), jk: f.get('jk'), telepon: f.get('telepon'), pengirim: (f.get('pengirim') || '').trim(), dokter: f.get('dokter'), analis: f.get('analis'), alamat: f.get('alamat'), catatan: f.get('catatan'), tests: tests, hasil: {}, status: statusAwal, spesimen: spesimen, noAntrian: 'A-' + String(nextQueueNo()).padStart(3, '0'), tglDaftar: new Date().toISOString(), kesimpulan: '' };
  patients.push(p); save(); apiCall('savePasien', p);
  e.target.reset(); window._pickedTests = {}; window._katFilter = 'semua'; window._pickSearch = '';
  document.getElementById('modalContent').innerHTML = '<div class="modal-success"><div class="big-em"><svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#059669" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg></div><h3>Pasien Terdaftar</h3><p>' + esc(p.nama) + ' — ' + esc(p.noRM) + '</p><div class="success-number-box"><p>Nomor Antrian</p><div class="big-no">' + esc(p.noAntrian) + '</div></div>' +
    '<div style="display:flex;gap:8px;">' +
    '<button class="btn btn-secondary" style="flex:1;" onclick="closeModal(); view=\'antrian\'; renderNav(); render();">Antrian</button>' +
    '<button class="btn btn-primary" style="flex:1;" onclick="inputHasilPasien(\'' + p.id + '\')">Input Hasil</button>' +
    '</div></div>';
  document.getElementById('modal').classList.add('open');
});
document.getElementById('modal').addEventListener('click', function(e) { if (e.target.id === 'modal') closeModal(); });
try { var _s = localStorage.getItem('labcare_stempel_url'); if (_s) stempelUrl = _s; } catch (e) {}
window._isDataSynced = false;
loadTests(); loadKaryawan(); load(); renderNav();
render();
setSyncState(SYNC_ENABLED ? 'syncing' : 'idle');
if (SYNC_ENABLED) setTimeout(function() { syncAllFromServer(true); }, 300);

function modalResetData() {
  var html = '<div class="modal-body">' +
    '<div class="modal-head"><div><h3 style="color:var(--danger);">Konfirmasi Hapus Permanen</h3><p>Data yang dihapus tidak bisa dikembalikan.</p></div>' +
    '<button class="modal-close" onclick="closeModal()">&times;</button></div>' +
    
    '<div class="info-box" style="background:#fee2e2; color:#991b1b; margin-bottom:16px;"><span class="info-em">🚨</span><span>Sistem akan melakukan <b>Backup otomatis</b> sebelum menghapus seluruh data pasien.</span></div>' +
    
    '<div style="margin-bottom:16px;">' +
      '<label class="lbl">Pintu 1: Ketik <b>HAPUS PERMANEN</b></label>' +
      '<input type="text" id="reset_teks" class="inp" placeholder="HAPUS PERMANEN" style="border-color:var(--danger);">' +
    '</div>' +
    
    '<div style="margin-bottom:16px;">' +
      '<label class="lbl">Pintu 2: Masukkan PIN Login Anda</label>' +
      '<input type="password" id="reset_pin" class="inp" placeholder="••••••" style="border-color:var(--danger);">' +
    '</div>' +
    
    '<p id="reset_error" style="color:var(--danger); font-size:12px; font-weight:600; display:none; margin-bottom:8px;"></p>' +
    
    '<div class="btn-row">' +
      '<button class="btn btn-secondary" onclick="closeModal()" style="flex:1;">Batal</button>' +
      '<button id="btn_reset_submit" class="btn" onclick="prosesResetData()" style="flex:1; background:var(--danger); color:#fff;">Hapus Sekarang</button>' +
    '</div>' +
  '</div>';
  document.getElementById('modalContent').innerHTML = html;
  document.getElementById('modal').classList.add('open');
  setTimeout(function() { var el = document.getElementById('reset_teks'); if (el) el.focus(); }, 100);
}

async function prosesResetData() {
  var teks = document.getElementById('reset_teks').value.trim();
  var pin = document.getElementById('reset_pin').value.trim();
  var errEl = document.getElementById('reset_error');
  var btn = document.getElementById('btn_reset_submit');

  if (teks !== 'HAPUS PERMANEN') {
    errEl.innerText = 'Kata kunci salah. Harap ketik HAPUS PERMANEN (huruf besar).';
    errEl.style.display = 'block';
    return;
  }
  if (!pin) {
    errEl.innerText = 'PIN wajib diisi.';
    errEl.style.display = 'block';
    return;
  }

  errEl.style.display = 'none';
  btn.innerText = 'Memproses...';
  btn.disabled = true;

  showLoading(true);
  
  // Kirim perintah ke server beserta PIN untuk verifikasi
  var res = await apiCall('resetPasien', { pin: pin });
  
  showLoading(false);

  if (res && res.ok) {
    closeModal();
    patients = []; // Bersihkan memory lokal
    save(); // Simpan ke localStorage
    render(); // Refresh UI
    toastMsg('Semua data pasien berhasil dihapus.', 'ok');
  } else {
    btn.innerText = 'Hapus Sekarang';
    btn.disabled = false;
    errEl.innerText = (res && res.error) ? res.error : 'Gagal reset. Periksa PIN atau koneksi.';
    errEl.style.display = 'block';
  }
}
function konfirmasiRestore(fileId, namaFile, tanggalFile) {
  if (!confirm('PERINGATAN!\n\nSeluruh data pasien saat ini akan DIGANTI dengan data dari file backup:\n\nNama: ' + namaFile + '\nTanggal: ' + tanggalFile + '\n\nLanjutkan?')) return;

  showLoading(true);
  
  // Kita gunakan apiCall agar token & operator terkirim
  apiCall('restoreBackup', { fileId: fileId }).then(function(res) {
    showLoading(false);
    
    if (res && res.ok) {
      toastMsg('✅ ' + res.message, 'ok');
      // Sinkronkan ulang data dari server agar tampilan web terupdate
      syncAllFromServer(true).then(function() {
         render(); // Render ulang tampilan
      });
    } else {
      alert('GAGAL RESTORE:\n\n' + (res.error || 'Periksa koneksi atau file backup.'));
      toastMsg('Gagal melakukan restore', 'err');
    }
  });
}
document.addEventListener('DOMContentLoaded', initLoginState);
// ==========================================
// FUNGSI MINIMIZE SIDEBAR (DESKTOP)
// ==========================================
function toggleDesktopSidebar() {
  var layout = document.querySelector('.layout');
  if (layout) {
    // Toggle class untuk menyembunyikan/menampilkan sidebar
    layout.classList.toggle('sidebar-collapsed');
    
    // Beri jeda sejenak agar animasi CSS selesai, 
    // lalu paksa Chart.js untuk menyesuaikan ukuran grafiknya
    setTimeout(function() {
      window.dispatchEvent(new Event('resize'));
    }, 350); 
  }
}
