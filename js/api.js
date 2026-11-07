// ==========================================
// LOADING & TOAST
// ==========================================
var _toastTimer;
function toastMsg(msg, type) { 
  var t = document.getElementById('toast'); 
  if (!t) return; 
  t.textContent = msg; 
  t.className = 'toast show' + (type ? ' ' + type : ''); 
  clearTimeout(_toastTimer); 
  _toastTimer = setTimeout(function() { t.className = 'toast'; }, 2400); 
}

function showLoading(show) {
  var el = document.getElementById('loading');
  if (el) el.className = show ? 'loading show' : 'loading';
}

function setSyncState(state) {
  syncState = state;
  var badge = document.getElementById('syncBadge');
  var badgeText = document.getElementById('syncBadgeText');
  var mobile = document.getElementById('syncBadgeMobile');
  var labels = { idle: 'Offline (lokal)', syncing: 'Menyinkron...', online: 'Tersinkron', offline: 'Gagal sinkron' };
  var cls = 'sync-badge ' + (state === 'online' ? 'online' : state === 'offline' ? 'offline' : state === 'syncing' ? 'syncing' : '');
  if (badge) badge.className = cls;
  if (badgeText) badgeText.textContent = labels[state] || state;
  if (mobile) mobile.className = cls;
}

// ==========================================
// API CALL (Koneksi ke Google Apps Script)
// ==========================================
async function apiCall(action, data) {
  if (!SYNC_ENABLED) return null;
  setSyncState('syncing');
  var payloadData = data || {};
  payloadData.operator = getOperatorName();
  payloadData.token = localStorage.getItem('labcare_token') || '';
  try {
    var res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ action: action, data: payloadData }),
      redirect: 'follow'
    });
    var text = await res.text();
    try {
      var json = JSON.parse(text);
      setSyncState(json && json.ok ? 'online' : 'offline');
      return json;
    } catch (parseErr) {
      setSyncState('offline');
      return { ok: false, error: 'Server Crash/Error 500. Respon: ' + text.substring(0, 50) };
    }
  } catch (e) {
    setSyncState('offline');
    return { ok: false, error: 'Koneksi putus: ' + e.message };
  }
}

async function syncAllFromServer(silent) {
  if (!SYNC_ENABLED) { setSyncState('idle'); return; }
  var r = await apiCall('getAll');
  if (!r || !r.ok) {
    if (!silent) toastMsg('Gagal sinkron dari Spreadsheet', 'err');
    return;
  }
  if (Array.isArray(r.pasien)) patients = r.pasien.map(normalizePasien);
  if (Array.isArray(r.pemeriksaan) && r.pemeriksaan.length) TESTS = r.pemeriksaan;
  if (Array.isArray(r.analis)) analisList = r.analis;
  if (Array.isArray(r.dokter)) dokterList = r.dokter;
  if (Array.isArray(r.master_puskesmas)) masterPuskesmasList = r.master_puskesmas;

  if (Array.isArray(r.prolanis_kegiatan)) {
    var kegList = r.prolanis_kegiatan || [];
    var pesList = r.prolanis_peserta || [];
    kegList.forEach(function(keg) {
      keg.peserta = pesList.filter(function(p) {
        return String(p.id_kegiatan) === String(keg.id_kegiatan);
      });
      keg.peserta_count = keg.peserta.length;
    });
    window._prolanisList = kegList;
  }

  try {
    localStorage.setItem('labcare_patients', JSON.stringify(patients));
    localStorage.setItem('labcare_tests', JSON.stringify(TESTS));
    localStorage.setItem('labcare_analis', JSON.stringify(analisList));
    localStorage.setItem('labcare_dokter', JSON.stringify(dokterList));
  } catch (e) {}

  try {
    var sr = await apiCall('getStempel');
    if (sr && sr.ok && sr.url) {
      stempelUrl = sr.url;
      try { localStorage.setItem('labcare_stempel_url', stempelUrl); } catch (e) {}
    }
  } catch (e) {}

  window._isDataSynced = true;
  renderNav();
  render();
  if (!silent) toastMsg('Tersinkron dengan Spreadsheet', 'ok');
}

function normalizePasien(p) {
  if (!p) return p;
  if (typeof p.tests === 'string') {
    try { p.tests = JSON.parse(p.tests || '[]'); } catch (e) { p.tests = []; }
  }
  if (typeof p.hasil === 'string') {
    try { p.hasil = JSON.parse(p.hasil || '{}'); } catch (e) { p.hasil = {}; }
  }
  if (!p.tests) p.tests = [];
  if (!p.hasil) p.hasil = {};
  if (!p.status) p.status = 'menunggu';
  if (typeof p.pengirim !== 'string') p.pengirim = '';
  return p;
}

function manualSync() {
  if (!SYNC_ENABLED) { toastMsg('Mode offline: API belum dikonfigurasi'); return; }
  syncAllFromServer(false);
}

// ==========================================
// LOCAL STORAGE (Penyimpanan Lokal)
// ==========================================
function save() {
  try { localStorage.setItem('labcare_patients', JSON.stringify(patients)); } catch (e) {}
}

function load() {
  try {
    var raw = localStorage.getItem('labcare_patients');
    if (raw) patients = (JSON.parse(raw) || []).map(normalizePasien);
  } catch (e) { patients = []; }
}

function loadKaryawan() {
  try {
    var a = localStorage.getItem('labcare_analis');
    if (a) analisList = JSON.parse(a) || [];
    var d = localStorage.getItem('labcare_dokter');
    if (d) dokterList = JSON.parse(d) || [];
  } catch (e) { analisList = []; dokterList = []; }
}

function loadTests() {
  try {
    var raw = localStorage.getItem('labcare_tests');
    if (raw) {
      var parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) { TESTS = parsed; return; }
    }
  } catch (e) {}
  TESTS = DEFAULT_TESTS.slice();
}

function saveTests() {
  if (!window._isDataSynced && !confirm('Data master belum sinkron sempurna. Yakin ingin menimpa database?')) return;
  try { localStorage.setItem('labcare_tests', JSON.stringify(TESTS)); } catch (e) {}
  apiCall('saveMaster', { jenis: 'pemeriksaan', list: TESTS });
}

function saveAnalis() {
  if (!window._isDataSynced && !confirm('Data master belum sinkron sempurna. Yakin ingin menimpa database?')) return;
  try { localStorage.setItem('labcare_analis', JSON.stringify(analisList)); } catch (e) {}
  apiCall('saveMaster', { jenis: 'analis', list: analisList });
}

function saveDokter() {
  if (!window._isDataSynced && !confirm('Data master belum sinkron sempurna. Yakin ingin menimpa database?')) return;
  try { localStorage.setItem('labcare_dokter', JSON.stringify(dokterList)); } catch (e) {}
  apiCall('saveMaster', { jenis: 'dokter', list: dokterList });
}

function resetAnalis() {
  if (!confirm('Reset daftar analis?')) return;
  analisList = [];
  saveAnalis();
  render();
  toastMsg('Daftar analis direset');
}

function resetDokter() {
  if (!confirm('Reset daftar dokter?')) return;
  dokterList = [];
  saveDokter();
  render();
  toastMsg('Daftar dokter direset');
}
