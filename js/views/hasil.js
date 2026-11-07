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

