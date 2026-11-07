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

