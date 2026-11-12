// ==========================================
// TAMPILAN: DASHBOARD (INTERAKTIF PENUH)
// ==========================================
var dashboardChartInstance = null; 
var _chartRawDates = []; // Menyimpan format YYYY-MM-DD untuk grafik

function viewDashboard() {
  var t = patients.filter(function(p) { return p.tglDaftar && p.tglDaftar.slice(0, 10) === today(); });
  var c = function(s) { return t.filter(function(p) { return p.status === s; }).length; };
  
  var cards = [
    { label: 'Pasien Hari Ini', val: t.length, cls: 'stat-blue', filter: 'semua', icon: '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>' },
    { label: 'Menunggu', val: c('menunggu'), cls: 'stat-amber', filter: 'menunggu', icon: '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>' },
    { label: 'Diproses', val: c('proses') + c('sampling'), cls: 'stat-purple', filter: 'proses', icon: '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 3h6v6l4 8a2 2 0 0 1-2 3H7a2 2 0 0 1-2-3l4-8V3z"/><path d="M9 3h6"/></svg>' },
    { label: 'Selesai', val: c('selesai'), cls: 'stat-green', filter: 'selesai', icon: '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>' }
  ];
  
  var cardsHtml = cards.map(function(x, index) { 
    var clickAction = "";
    var hover = 'onmouseover="this.style.transform=\'translateY(-3px)\'; this.style.boxShadow=\'0 6px 15px rgba(0,0,0,0.1)\'" onmouseout="this.style.transform=\'translateY(0)\'; this.style.boxShadow=\'none\'" style="cursor: pointer; transition: transform 0.2s, box-shadow 0.2s;"';
    
    if (index === 0) clickAction = 'onclick="bukaModalPasienHariIni()"';
    else if (index === 1) clickAction = 'onclick="bukaModalMenunggu()"';
    else if (index === 2) clickAction = 'onclick="bukaModalDiproses()"';
    else if (index === 3) clickAction = 'onclick="bukaModalSelesai()"';
    
    return '<div class="stat-card ' + x.cls + '" ' + clickAction + ' ' + hover + '>' +
           '<div class="icon">' + x.icon + '</div>' +
           '<div class="val">' + x.val + '</div>' +
           '<div class="lbl">' + x.label + '</div></div>'; 
  }).join('');
  
  var chartHtml = `
    <div class="chart-card" style="background: #ffffff; border-radius: 16px; padding: 20px; margin-bottom: 24px; box-shadow: 0 4px 12px rgba(0,0,0,0.03); margin-top: 24px;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; flex-wrap: wrap; gap: 10px;">
        <h3 style="margin: 0; font-size: 16px; color: #1c1917; font-weight: 700;">Tren Kunjungan Pasien</h3>
        <select onchange="updateChartFilter(this.value)" style="font-size: 12px; color: #57534e; background: #f5f2eb; padding: 6px 12px; border-radius: 20px; border: 1px solid #e7e5e4; outline: none; cursor: pointer; font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 600; transition: all 0.2s;">
          <option value="7">7 Hari Terakhir</option>
          <option value="14">14 Hari Terakhir</option>
          <option value="30">30 Hari Terakhir</option>
        </select>
      </div>
      <div style="position: relative; height: 250px; width: 100%; min-height: 250px;">
        <canvas id="trenKunjunganChart" style="cursor: pointer;" title="Klik titik grafik untuk melihat detail pasien"></canvas>
      </div>
    </div>
  `;

  var recent = patients.slice().sort(function(a, b) { return (b.tglDaftar || '').localeCompare(a.tglDaftar || ''); }).slice(0, 6);
  var recentHtml;
  if (recent.length === 0) { 
    recentHtml = '<div class="empty-state"><span class="em">📭</span><p>Belum ada data pasien.</p></div>'; 
  } else {
    recentHtml = '<div class="table-wrap"><table><thead><tr><th>Antrian</th><th>No. RM</th><th>Nama</th><th>Tes</th><th>Status</th><th>Tanggal</th></tr></thead><tbody>' +
      recent.map(function(p) { 
        return '<tr class="clickable-row" onclick="showDetailPasienDashboard(\'' + esc(p.noRM) + '\')">' +
               '<td class="mono" style="color:var(--primary);font-weight:700;">' + esc(p.noAntrian) + '</td>' +
               '<td class="mono" style="font-size:12px;">' + esc(p.noRM) + '</td>' +
               '<td style="font-weight:500;">' + esc(p.nama) + '</td>' +
               '<td style="font-size:12px;color:var(--slate-500);">' + (p.tests ? p.tests.length : 0) + ' tes</td>' +
               '<td><span class="badge ' + STATUS[p.status].cls + '">' + STATUS[p.status].label + '</span></td>' +
               '<td style="font-size:12px;color:var(--slate-500);">' + esc(fmtDate(p.tglDaftar)) + '</td></tr>'; 
      }).join('') + '</tbody></table></div>';
  }

  setTimeout(function() { renderTrenChart(7); }, 100);

  return '<div class="page-header"><h2>Dashboard</h2><p>Ringkasan pelayanan — ' + esc(fmtDate(new Date().toISOString())) + '</p></div>' +
         '<div class="stats-grid">' + cardsHtml + '</div>' + 
         chartHtml + 
         '<h3 class="section-title">Pasien Terbaru</h3>' + recentHtml;
}

// ==========================================
// FUNGSI KLIK KARTU STATISTIK
// ==========================================
function bukaModalPasienHariIni() {
  var list = patients.filter(function(p) { return p.tglDaftar && p.tglDaftar.slice(0, 10) === today(); });
  
  // Buat tombol tambah pasien
  var btnAddHtml = `<button onclick="bukaFormPendaftaran()" class="btn btn-primary" style="flex: 2; padding: 10px 24px; background: #0f766e; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 600; display: inline-flex; align-items: center; justify-content: center; gap: 6px;">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
    Tambah Pasien
  </button>`;

  renderModalPasien(
    "Pasien Hari Ini", 
    "Total: " + list.length + " pasien terdaftar hari ini.", 
    list, 
    function(p) {
      return ''; // Tidak ada tombol aksi khusus di baris
    }, 
    "Tutup", 
    "closeModal()", 
    "#0f766e", 
    btnAddHtml // Masukkan tombol ke parameter terakhir
  );
}

// FUNGSI BARU: Untuk pindah ke halaman pendaftaran
// ==========================================
// FITUR PENDAFTARAN CEPAT DI DASHBOARD (DENGAN FILTER KATEGORI)
// ==========================================
function bukaFormPendaftaran() {
  // Reset pilihan tes dan filter
  window._pickedTests = {};
  window._quickKatFilter = 'semua';
  window._quickSearch = '';
  
  // Siapkan opsi dropdown dokter & analis
  var dokterField = dokterList.length > 0 
    ? '<select name="dokter" class="inp-sel"><option value="">— Pilih Dokter —</option>' + dokterList.map(d => '<option value="' + esc(d.nama) + '">' + esc(d.nama) + '</option>').join('') + '</select>'
    : '<input type="text" name="dokter" class="inp" placeholder="Nama dokter">';
    
  var analisField = analisList.length > 0 
    ? '<select name="analis" class="inp-sel"><option value="">— Pilih Analis —</option>' + analisList.map(a => '<option value="' + esc(a.nama) + '">' + esc(a.nama) + '</option>').join('') + '</select>'
    : '<input type="text" name="analis" class="inp" placeholder="Nama analis">';

  var html = `
    <div class="modal-body" style="padding: 0;">
      <div class="modal-head" style="display: flex; justify-content: space-between; align-items: center; padding: 20px 24px; border-bottom: 1px solid #e2e8f0; background: #f8fafc; border-radius: 16px 16px 0 0;">
        <div>
          <h3 style="margin: 0; font-size: 18px; color: #1c1917;">Pendaftaran Cepat</h3>
          <p style="margin: 4px 0 0; font-size: 13px; color: #78716c;">Daftarkan pasien baru langsung dari Dashboard</p>
        </div>
        <button onclick="closeModal()" style="background: none; border: none; font-size: 24px; cursor: pointer; color: #a8a29e;">&times;</button>
      </div>

      <div style="padding: 20px 24px; max-height: 65vh; overflow-y: auto;">
        <form id="formDaftar">
          <div class="form-row" style="grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 16px;">
            <div style="grid-column: 1 / -1;">
              <label class="lbl">Nama Lengkap *</label>
              <input type="text" name="nama" class="inp" required placeholder="Nama pasien">
            </div>
            <div>
              <label class="lbl">No. RM *</label>
              <input type="text" name="noRM" class="inp" required placeholder="Contoh: RM-001" value="RM-${String(patients.length + 1).padStart(3, '0')}">
            </div>
            <div>
              <label class="lbl">Tgl Lahir *</label>
              <input type="date" name="tglLahir" class="inp" required>
            </div>
            <div>
              <label class="lbl">Jenis Kelamin</label>
              <select name="jk" class="inp-sel">
                <option value="L">Laki-laki</option>
                <option value="P">Perempuan</option>
              </select>
            </div>
            <div>
              <label class="lbl">No. Telepon</label>
              <input type="text" name="telepon" class="inp" placeholder="08xxxxxxxxxx">
            </div>
            <div style="grid-column: 1 / -1;">
              <label class="lbl">Pengirim</label>
              <input type="text" name="pengirim" class="inp" placeholder="Contoh: Umum / Puskesmas" value="Umum">
            </div>
            <div>
              <label class="lbl">Dokter Penanggung Jawab</label>
              ${dokterField}
            </div>
            <div>
              <label class="lbl">Nama Analis</label>
              ${analisField}
            </div>
            <div style="grid-column: 1 / -1;">
              <label class="lbl">Status Spesimen</label>
              <select name="spesimen" class="inp-sel">
                <option value="belum">📦 Belum Ada (Menunggu)</option>
                <option value="ada">📦 Sudah Ada (Langsung Proses)</option>
              </select>
            </div>
            <div style="grid-column: 1 / -1;">
              <label class="lbl">Alamat</label>
              <textarea name="alamat" class="inp-ta" rows="2" placeholder="Alamat lengkap"></textarea>
            </div>
          </div>

          <!-- BAGIAN PEMILIHAN TES YANG BARU -->
          <div style="margin-bottom: 16px; border-top: 1px dashed #cbd5e1; padding-top: 16px;">
            <label class="lbl" style="font-size: 14px; margin-bottom: 10px;">B. Pemeriksaan Laboratorium *</label>
            
            <!-- Filter Kategori & Search -->
            <div class="pick-bar" style="margin-bottom: 10px;">
              <div>
                <select class="inp-sel" id="quick_kat" onchange="window._quickKatFilter=this.value; renderQuickPickItems();">
                  <option value="semua">📋 Semua Kategori</option>
                  ${Array.from(new Set(TESTS.map(t => t.kategori))).sort().map(k => `<option value="${esc(k)}">${esc(k)}</option>`).join('')}
                </select>
              </div>
              <div>
                <input type="text" class="inp" id="quick_search" placeholder="Cari nama atau kode..." oninput="window._quickSearch=this.value; renderQuickPickItems();">
              </div>
            </div>

            <!-- Tombol Aksi Massal -->
            <div style="display: flex; gap: 8px; margin-bottom: 10px;">
              <button type="button" class="btn btn-secondary" onclick="pilihSemuaQuickTests()" style="font-size: 11px; padding: 6px 12px;">✔️ Pilih Semua (Tampil)</button>
              <button type="button" class="btn btn-secondary" onclick="bersihkanQuickTests()" style="font-size: 11px; padding: 6px 12px;">🗑️ Bersihkan Semua</button>
            </div>

            <!-- Ringkasan Tes yang Dipilih (Chips) -->
            <div id="quick_summary_wrap" style="margin-bottom: 10px;"></div>

            <!-- Grid Tes -->
            <div class="pick-grid" id="quick_pick_grid" style="max-height: 250px; overflow-y: auto;">
              <!-- Item tes akan dimuat oleh JS -->
            </div>
          </div>

          <div style="display: flex; gap: 10px; margin-top: 20px;">
            <button type="button" onclick="closeModal()" class="btn btn-secondary" style="flex: 1;">Batal</button>
            <button type="submit" class="btn btn-primary" style="flex: 2;">Daftarkan Pasien</button>
          </div>
        </form>
      </div>
    </div>
  `;

  var modalContent = document.getElementById('modalContent');
  var modalOverlay = document.getElementById('modal');
  if(modalContent && modalOverlay) {
    modalContent.innerHTML = html;
    modalContent.style.padding = "0"; 
    modalOverlay.classList.add('open');
    
    // Panggil fungsi untuk merender item tes pertama kali
    renderQuickPickItems();
  }
}

// ==========================================
// FUNGSI BANTUAN UNTUK FILTER & PILIH TES
// ==========================================
function renderQuickPickItems() {
  var filter = window._quickKatFilter || 'semua';
  var search = (window._quickSearch || '').toLowerCase();
  
  // 1. Render Ringkasan (Chips)
  var picked = Object.keys(window._pickedTests || {});
  var summaryHtml = '';
  if (picked.length === 0) {
    summaryHtml = '<div class="pick-chip-row"><span class="empty-text" style="font-size: 12px; color: #a8a29e;">Belum ada pemeriksaan yang dipilih.</span></div>';
  } else {
    summaryHtml = '<div class="pick-chip-row">' + picked.map(function(kode) {
      var t = findTest(kode);
      var nama = t ? t.nama : kode;
      return '<span class="pick-chip">' + esc(nama) + ' <button type="button" onclick="removeQuickPickedTest(\'' + esc(kode) + '\')" title="Hapus">&times;</button></span>';
    }).join('') + '</div>';
  }
  var summaryWrap = document.getElementById('quick_summary_wrap');
  if (summaryWrap) summaryWrap.innerHTML = summaryHtml;

  // 2. Render Grid Item Tes
  var filtered = TESTS.filter(function(t) {
    var matchKat = filter === 'semua' || t.kategori === filter;
    var matchSearch = !search || t.kode.toLowerCase().indexOf(search) >= 0 || t.nama.toLowerCase().indexOf(search) >= 0;
    return matchKat && matchSearch;
  });

  var grid = document.getElementById('quick_pick_grid');
  if (!grid) return;

  if (filtered.length === 0) {
    grid.innerHTML = '<div class="pick-empty">Tidak ada pemeriksaan yang cocok.</div>';
    return;
  }

  grid.innerHTML = filtered.map(function(t) {
    var isPicked = !!window._pickedTests[t.kode];
    return '<label class="pick-item' + (isPicked ? ' picked' : '') + '" style="padding: 10px;">' +
      '<input type="checkbox" ' + (isPicked ? 'checked' : '') + ' onchange="toggleQuickTest(\'' + esc(t.kode) + '\', this.checked)">' +
      '<div class="pi-body"><div class="pi-name" style="font-size: 13px;">' + esc(t.nama) + '</div>' +
      '<div class="pi-detail" style="font-size: 11px;">Rujukan: ' + esc(t.rujukan) + '</div></div>' +
      '</label>';
  }).join('');
}

function toggleQuickTest(kode, checked) {
  window._pickedTests = window._pickedTests || {};
  if (checked) window._pickedTests[kode] = true;
  else delete window._pickedTests[kode];
  renderQuickPickItems();
}

function removeQuickPickedTest(kode) {
  delete window._pickedTests[kode];
  renderQuickPickItems();
}

function pilihSemuaQuickTests() {
  var filter = window._quickKatFilter || 'semua';
  var search = (window._quickSearch || '').toLowerCase();
  
  var filtered = TESTS.filter(function(t) {
    var matchKat = filter === 'semua' || t.kategori === filter;
    var matchSearch = !search || t.kode.toLowerCase().indexOf(search) >= 0 || t.nama.toLowerCase().indexOf(search) >= 0;
    return matchKat && matchSearch;
  });

  filtered.forEach(function(t) { window._pickedTests[t.kode] = true; });
  renderQuickPickItems();
}

function bersihkanQuickTests() {
  window._pickedTests = {};
  renderQuickPickItems();
}
// Fungsi untuk mencatat tes yang dicentang
function toggleDashTest(kode, checked) {
  window._pickedTests = window._pickedTests || {};
  if (checked) window._pickedTests[kode] = true;
  else delete window._pickedTests[kode];
}
function bukaModalMenunggu() {
  var list = patients.filter(function(p) { return p.status === 'menunggu' && p.tglDaftar && p.tglDaftar.slice(0, 10) === today(); });
  renderModalPasien("Pasien Menunggu", "Ada " + list.length + " pasien dalam antrean.", list, function(p) {
    return '<button onclick="panggilDariDashboard(\'' + p.id + '\')" class="btn" style="padding: 6px 12px; font-size: 12px; background: #d97706; color: white; border: none; border-radius: 6px; cursor: pointer; display: inline-flex; align-items: center; gap: 5px;"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/></svg> Panggil</button>';
  }, "Tutup", "closeModal()", "#d97706", '');
}

function bukaModalDiproses() {
  var list = patients.filter(function(p) { return (p.status === 'proses' || p.status === 'sampling') && p.tglDaftar && p.tglDaftar.slice(0, 10) === today(); });
  renderModalPasien("Pasien Diproses", "Ada " + list.length + " pasien sedang diproses.", list, function(p) {
    return '<button onclick="inputHasilPasien(\'' + p.id + '\')" class="btn" style="padding: 6px 12px; font-size: 12px; background: #7c3aed; color: white; border: none; border-radius: 6px; cursor: pointer; display: inline-flex; align-items: center; gap: 5px;"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg> Input Hasil</button>';
  }, "Tutup", "closeModal()", "#7c3aed", '');
}

function bukaModalSelesai() {
  var list = patients.filter(function(p) { return p.status === 'selesai' && p.tglDaftar && p.tglDaftar.slice(0, 10) === today(); });
  renderModalPasien("Pasien Selesai", "Ada " + list.length + " pasien telah menyelesaikan pemeriksaan.", list, function(p) {
    return '<button onclick="cetakHasil(\'' + p.id + '\')" class="btn" style="padding: 6px 12px; font-size: 12px; background: #059669; color: white; border: none; border-radius: 6px; cursor: pointer; display: inline-flex; align-items: center; gap: 5px;"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg> Cetak</button>';
  }, "Tutup", "closeModal()", "#059669", '');
}

// ==========================================
// FUNGSI KLIK GRAFIK (CHART)
// ==========================================
function handleChartClick(event, elements) {
  if (elements && elements.length > 0) {
    var index = elements[0].index;
    var dateStr = _chartRawDates[index]; // Ambil format YYYY-MM-DD
    var displayDate = dashboardChartInstance.data.labels[index];
    
    var list = patients.filter(function(p) { return p.tglDaftar && p.tglDaftar.slice(0, 10) === dateStr; });
    
    renderModalPasien(
      "Kunjungan Tgl " + displayDate, 
      "Total: " + list.length + " pasien terdaftar.", 
      list, 
      function(p) {
        return '<span class="badge ' + STATUS[p.status].cls + '">' + STATUS[p.status].label + '</span>';
      }, 
      "Tutup", "closeModal()", "#0f766e", ''
    );
  }
}

// ==========================================
// FUNGSI PEMBUAT MODAL UNIVERSAL (DIPERBARUI)
// ==========================================
function renderModalPasien(title, subtitle, list, actionBuilder, btnCloseText, btnCloseAction, accentColor, btnMainHtml) {
  var listHtml = '';
  
  if (list.length === 0) {
    // TOMBOL DI KOTAK KOSONG SUDAH DIHAPUS
    listHtml = `<div class="empty-state" style="padding: 30px 10px; text-align: center; color: #a8a29e; background: #f8fafc; border-radius: 12px; border: 1px dashed #cbd5e1;">
      <span class="em" style="font-size: 32px; display: block; margin-bottom: 10px;">📭</span>
      <p style="margin-bottom: 0;">Tidak ada data pasien.</p>
    </div>`;
  } else {
    listHtml = '<div class="table-wrap" style="max-height: 350px; overflow-y: auto; border: 1px solid #e2e8f0; border-radius: 12px;">' +
      '<table style="width: 100%; font-size: 13px; margin: 0;">' +
      '<thead><tr style="background: #f8fafc; position: sticky; top: 0; z-index: 1;">' +
      '<th style="padding: 10px; text-align:center;">Antrian</th>' +
      '<th style="padding: 10px;">Nama Pasien</th>' +
      '<th style="padding: 10px; text-align:center;">Aksi / Status</th>' +
      '</tr></thead><tbody>' +
      list.map(function(p) {
        return '<tr onclick="bukaDetailDariModal(\'' + p.noRM + '\')" style="border-bottom: 1px solid #f1f5f9; cursor: pointer; transition: background 0.2s;" onmouseover="this.style.background=\'#f8fafc\'" onmouseout="this.style.background=\'transparent\'">' +
          '<td class="mono" style="color: ' + accentColor + '; font-weight: 700; padding: 10px; text-align:center; font-size: 14px;">' + esc(p.noAntrian) + '</td>' +
          '<td style="font-weight: 500; padding: 10px;">' + esc(p.nama) + '</td>' +
          '<td style="padding: 10px; text-align:center;" onclick="event.stopPropagation()">' + actionBuilder(p) + '</td>' +
          '</tr>';
      }).join('') + '</tbody></table></div>';
  }

  var html = `
    <div class="modal-body" style="padding: 0;">
      <div class="modal-head" style="display: flex; justify-content: space-between; align-items: center; padding: 20px 24px; border-bottom: 1px solid #e2e8f0; background: #f8fafc; border-radius: 16px 16px 0 0;">
        <div>
          <h3 style="margin: 0; font-size: 18px; color: #1c1917;">${title}</h3>
          <p style="margin: 4px 0 0; font-size: 13px; color: #78716c;">${subtitle}</p>
        </div>
        <button onclick="closeModal()" style="background: none; border: none; font-size: 24px; cursor: pointer; color: #a8a29e;">&times;</button>
      </div>
      
      <div style="padding: 20px 24px;">
        ${listHtml}
      </div>

      <div style="padding: 16px 24px; background: #f8fafc; border-top: 1px solid #e2e8f0; border-radius: 0 0 16px 16px; display: flex; gap: 10px; justify-content: flex-end;">
        <button onclick="${btnCloseAction}" class="btn btn-secondary" style="flex: 1; padding: 10px 24px; background: #efeae2; color: #57534e; border: none; border-radius: 8px; cursor: pointer; font-weight: 600;">${btnCloseText}</button>
        ${btnMainHtml ? btnMainHtml : ''}
      </div>
    </div>
  `;

  var modalContent = document.getElementById('modalContent');
  var modalOverlay = document.getElementById('modal');
  if(modalContent && modalOverlay) {
    modalContent.innerHTML = html;
    modalContent.style.padding = "0"; 
    modalOverlay.classList.add('open');
  }
}
// FUNGSI BARU UNTUK KLIK BARIS DI DALAM MODAL
function bukaDetailDariModal(noRM) {
  closeModal(); // Tutup modal daftar
  setTimeout(function() {
    showDetailPasienDashboard(noRM); // Buka modal detail setelah jeda sedikit
  }, 200);
}

// ==========================================
// FUNGSI PANGGIL PASIEN DARI DASHBOARD
// ==========================================
function panggilDariDashboard(id) {
  closeModal();
  if (typeof panggilPasien === 'function') {
    panggilPasien(id);
  }
}

// ==========================================
// FUNGSI INTERAKSI TABEL BAWAH
// ==========================================
function showDetailPasienDashboard(noRM) {
  var pasien = patients.find(function(p) { return p.noRM === noRM; });
  if(!pasien) return;

  var html = `
    <div class="modal-body" style="padding: 0;">
      <!-- Header Modal -->
      <div class="modal-head" style="display: flex; justify-content: space-between; align-items: center; padding: 20px 24px; border-bottom: 1px solid #e2e8f0; background: #f8fafc; border-radius: 16px 16px 0 0;">
        <div>
          <h3 style="margin: 0; font-size: 18px; color: #1c1917;">Detail Pasien</h3>
          <p style="margin: 4px 0 0; font-size: 13px; color: #78716c;">Informasi lengkap pasien</p>
        </div>
        <button onclick="closeModal()" style="background: none; border: none; font-size: 24px; cursor: pointer; color: #a8a29e;">&times;</button>
      </div>
      
      <!-- Body Modal (Isi Data) -->
      <div style="padding: 24px;">
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; font-size: 14px;">
          
          <!-- Nama Pasien (Full Width) -->
          <div style="grid-column: 1 / -1; padding-bottom: 12px; border-bottom: 1px dashed #e2e8f0; margin-bottom: 4px;">
            <strong style="color:#78716c; font-size:11px; display:block; letter-spacing: 0.5px; margin-bottom: 4px;">NAMA PASIEN</strong>
            <span style="font-weight:700; color:#1c1917; font-size: 16px;">${esc(pasien.nama)}</span>
          </div>

          <!-- No RM -->
          <div>
            <strong style="color:#78716c; font-size:11px; display:block; letter-spacing: 0.5px; margin-bottom: 4px;">NO. REKAM MEDIS</strong>
            <span class="mono" style="font-weight:600; color:#1c1917; background: #f1f5f9; padding: 2px 8px; border-radius: 4px;">${esc(pasien.noRM)}</span>
          </div>

          <!-- No Antrian -->
          <div>
            <strong style="color:#78716c; font-size:11px; display:block; letter-spacing: 0.5px; margin-bottom: 4px;">NO. ANTRIAN</strong>
            <span class="mono" style="font-weight:700; color:var(--primary); font-size: 15px;">${esc(pasien.noAntrian)}</span>
          </div>

          <!-- Status -->
          <div>
            <strong style="color:#78716c; font-size:11px; display:block; letter-spacing: 0.5px; margin-bottom: 4px;">STATUS</strong>
            <span class="badge ${STATUS[pasien.status].cls}">${STATUS[pasien.status].label}</span>
          </div>

          <!-- Tanggal Daftar -->
          <div>
            <strong style="color:#78716c; font-size:11px; display:block; letter-spacing: 0.5px; margin-bottom: 4px;">TANGGAL DAFTAR</strong>
            <span style="font-weight:500; color:#1c1917;">${esc(fmtDate(pasien.tglDaftar))}</span>
          </div>
          
          <!-- Total Tes -->
          <div style="grid-column: 1 / -1; margin-top: 8px;">
            <strong style="color:#78716c; font-size:11px; display:block; letter-spacing: 0.5px; margin-bottom: 4px;">PEMERIKSAAN</strong>
            <span style="font-weight:500; color:#1c1917;">${pasien.tests ? pasien.tests.length : 0} Jenis Tes Laboratorium</span>
          </div>

        </div>
      </div>

      <!-- Footer Modal (Tombol) -->
      <div style="padding: 16px 24px; background: #f8fafc; border-top: 1px solid #e2e8f0; border-radius: 0 0 16px 16px; display: flex; justify-content: flex-end;">
        <button onclick="closeModal()" class="btn btn-secondary" style="padding: 10px 24px;">Tutup</button>
      </div>
    </div>
  `;

  var modalContent = document.getElementById('modalContent');
  var modalOverlay = document.getElementById('modal');
  if(modalContent && modalOverlay) {
    modalContent.innerHTML = html;
    modalContent.style.padding = "0"; // Tetap 0 karena padding sudah diatur di dalam div
    modalOverlay.classList.add('open');
  }
}

// ==========================================
// FUNGSI GRAFIK (CHART.JS)
// ==========================================
function updateChartFilter(days) { renderTrenChart(parseInt(days)); }

function renderTrenChart(days) {
  var ctx = document.getElementById('trenKunjunganChart');
  if (!ctx) return;
  if (dashboardChartInstance) dashboardChartInstance.destroy();

  var labels = [];
  var dataKunjungan = [];
  _chartRawDates = []; // Reset array tanggal asli
  var todayObj = new Date();
  var bulanIndo = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Ags", "Sep", "Okt", "Nov", "Des"];

  for (var i = days - 1; i >= 0; i--) {
    var d = new Date(todayObj);
    d.setDate(todayObj.getDate() - i);
    var dateStr = d.toISOString().slice(0, 10); 
    
    _chartRawDates.push(dateStr); // Simpan format YYYY-MM-DD
    labels.push(String(d.getDate()).padStart(2, '0') + ' ' + bulanIndo[d.getMonth()]);
    dataKunjungan.push(patients.filter(function(p) { return p.tglDaftar && p.tglDaftar.slice(0, 10) === dateStr; }).length);
  }

  dashboardChartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: 'Jumlah Pasien',
        data: dataKunjungan,
        borderColor: '#0f766e',
        backgroundColor: 'rgba(15, 118, 110, 0.1)',
        borderWidth: 3,
        pointBackgroundColor: '#ffffff',
        pointBorderColor: '#0f766e',
        pointBorderWidth: 2,
        pointRadius: days > 14 ? 3 : 4,
        pointHoverRadius: 7,
        fill: true,
        tension: 0.4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      onClick: handleChartClick, // <-- TAMBAHKAN EVENT KLIK DI SINI
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#1c1917', padding: 10, displayColors: false,
          callbacks: { 
            label: function(context) { 
              return context.parsed.y + ' Pasien (Klik untuk detail)'; 
            } 
          }
        }
      },
      scales: {
        x: { grid: { display: false }, ticks: { color: '#78716c', font: { family: "'Plus Jakarta Sans', sans-serif", size: 11 }, maxRotation: 45, minRotation: 0 } },
        y: { beginAtZero: true, grid: { color: '#f5f2eb' }, ticks: { color: '#78716c', stepSize: 1, font: { family: "'Plus Jakarta Sans', sans-serif", size: 11 } } }
      }
    }
  });
}
