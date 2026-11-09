// ==========================================
// KONFIGURASI APLIKASI
// ==========================================
var API_URL = 'https://script.google.com/macros/s/AKfycbzvDFJuyrswvUIsS7Jw-OxfQTjf_8AU4SGj9c5a_9UB8MSrE3dfxRERz7XllhlwIDT_/exec';
var SYNC_ENABLED = /^https?:\/\//.test(API_URL);
var syncState = 'idle';

var CLINIC = {
  baris1: 'PEMERINTAH KABUPATEN BONDOWOSO',
  baris2: 'DINAS KESEHATAN',
  baris3: 'UPTD. LABKESDA BONDOWOSO',
  alamat: 'Jln. Santawi No. 08 Nangkaan',
  website: 'https://labkesda.bondowoso.go.id',
  telp: '085172185410',
  logoKiri: 'assets/images/bondowoso.jpg',
  logoKanan: 'assets/images/kemenkes.png',
  warnaHijau: '#16a34a',
  warnaHijauMuda: '#dcfce7',
  warnaOranye: '#f59e0b'
};

// ==========================================
// DATA KONSTANTA
// ==========================================
var DEFAULT_TESTS = [
  { kode:'DL',   nama:'Darah Lengkap',      kategori:'Hematologi', satuan:'',       rujukan:'-' },
  { kode:'LED',  nama:'LED (BBS)',          kategori:'Hematologi', satuan:'mm/jam', rujukan:'< 15' },
  { kode:'GD',   nama:'Gula Darah Puasa',   kategori:'Kimia',      satuan:'mg/dL',  rujukan:'70 - 110' },
  { kode:'GDS',  nama:'Gula Darah Sewaktu', kategori:'Kimia',      satuan:'mg/dL',  rujukan:'< 200' },
  { kode:'KOL',  nama:'Kolesterol Total',   kategori:'Kimia',      satuan:'mg/dL',  rujukan:'< 200' },
  { kode:'TG',   nama:'Trigliserida',       kategori:'Kimia',      satuan:'mg/dL',  rujukan:'< 150' },
  { kode:'HDL',  nama:'HDL Kolesterol',     kategori:'Kimia',      satuan:'mg/dL',  rujukan:'> 40' },
  { kode:'LDL',  nama:'LDL Kolesterol',     kategori:'Kimia',      satuan:'mg/dL',  rujukan:'< 130' },
  { kode:'AU',   nama:'Asam Urat',          kategori:'Kimia',      satuan:'mg/dL',  rujukan:'L: 3.4-7.0 / P: 2.4-6.0' },
  { kode:'URE',  nama:'Ureum',              kategori:'Kimia',      satuan:'mg/dL',  rujukan:'15 - 45' },
  { kode:'CRE',  nama:'Kreatinin',          kategori:'Kimia',      satuan:'mg/dL',  rujukan:'L: 0.7-1.3 / P: 0.6-1.1' },
  { kode:'SGOT', nama:'SGOT (AST)',         kategori:'Kimia',      satuan:'U/L',    rujukan:'< 35' },
  { kode:'SGPT', nama:'SGPT (ALT)',         kategori:'Kimia',      satuan:'U/L',    rujukan:'< 35' },
  { kode:'UR',   nama:'Urine Lengkap',      kategori:'Urinalisa',  satuan:'',       rujukan:'-' },
  { kode:'WID',  nama:'Widal Test',         kategori:'Serologi',   satuan:'titer',  rujukan:'< 1/80' },
  { kode:'HBS',  nama:'HBsAg',              kategori:'Serologi',   satuan:'',       rujukan:'Negatif' }
];

var STATUS = {
  menunggu: { label: 'Menunggu', cls: 'badge-menunggu' },
  proses:   { label: 'Diproses', cls: 'badge-proses' },
  selesai:  { label: 'Selesai',  cls: 'badge-selesai' }
};

var NAV_ITEMS = [
  { view: 'dashboard',   label: 'Dashboard',   icon: 'dashboard' },
  { view: 'pendaftaran', label: 'Pendaftaran', icon: 'user-plus' },
  { view: 'antrian',     label: 'Antrian',     icon: 'clock' },
  { view: 'hasil',       label: 'Input Hasil', icon: 'flask' },
  { view: 'laporan',     label: 'Laporan',     icon: 'file' },
  { view: 'prolanis',    label: 'Prolanis',    icon: 'clipboard' },
  { view: 'master',      label: 'Master Lab',  icon: 'settings', adminOnly: true }
];

// ==========================================
// STATE GLOBAL
// ==========================================
var TESTS = [];
var analisList = [];
var dokterList = [];
var patients = [];
var view = 'dashboard';
var mobileNavOpen = false;
var editKode = null;
var editKaryawanId = null;
var stempelUrl = '';
var masterPuskesmasList = [];

// State UI (window._* agar persisten antar render)
window._pickedTests      = window._pickedTests || {};
window._katFilter        = window._katFilter || 'semua';
window._pickSearch       = window._pickSearch || '';
window._dateFilter       = window._dateFilter || 'today';
window._editPickedTests  = window._editPickedTests || {};
window._editPatientId    = null;
window._editKatFilter    = 'semua';
window._editPickSearch   = '';
window._prolanisList     = window._prolanisList || [];
window._prolanisDetail   = window._prolanisDetail || null;
window._prolanisMode     = window._prolanisMode || 'list';
window._prolanisFilter   = window._prolanisFilter || 'semua';
window._prolanisSearch   = window._prolanisSearch || '';
window._kegiatanSearch   = window._kegiatanSearch || '';
window._kegiatanDateFilter = window._kegiatanDateFilter === undefined
  ? new Date().toISOString().slice(0, 10)
  : window._kegiatanDateFilter;
window._hasilTab = window._hasilTab || 'umum';
window._logSearch = '';
window._logDate   = '';

// ==========================================
// UTILITY
// ==========================================
function uid()  { return 'P' + Date.now() + Math.floor(Math.random() * 1000); }
function uidK() { return 'K' + Date.now() + Math.floor(Math.random() * 1000); }
function today() { return new Date().toISOString().slice(0, 10); }

function fmtDate(iso) {
  try { return new Date(iso).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }); }
  catch (e) { return '-'; }
}

function umur(tglLahir) {
  if (!tglLahir) return '-';
  var d = new Date(tglLahir), n = new Date();
  var y = n.getFullYear() - d.getFullYear();
  var m = n.getMonth() - d.getMonth();
  if (m < 0 || (m === 0 && n.getDate() < d.getDate())) y--;
  return y + ' th';
}

function nextRM() {
  return 'RM-' + String(patients.length + 1).padStart(4, '0');
}

function nextQueueNo() {
  var t = patients.filter(function(p) {
    return p.tglDaftar && p.tglDaftar.slice(0, 10) === today();
  });
  return t.length + 1;
}

function esc(s) {
  if (s == null) return '';
  return String(s).replace(/[&<>"']/g, function(c) {
    return { '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c];
  });
}

function cleanValue(v) {
  if (v === undefined || v === null) return '';
  var s = String(v).trim();
  if (/^\d{4}-\d{2}-\d{2}/.test(s)) return '';
  return s;
}

function fmtTanggalKeg(tgl) {
  if (!tgl) return '-';
  var s = String(tgl);
  if (s.indexOf('T') > 0) s = s.split('T')[0];
  return s;
}

function fmtTglLahir(v) {
  if (!v) return '-';
  var s = String(v);
  if (s.indexOf('T') > 0) {
    try {
      var d = new Date(s);
      return String(d.getDate()).padStart(2,'0') + '/' +
             String(d.getMonth() + 1).padStart(2,'0') + '/' + d.getFullYear();
    } catch (e) { return s.slice(0, 10); }
  }
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) {
    var parts = s.split('-');
    return parts[2] + '/' + parts[1] + '/' + parts[0];
  }
  return s;
}

function findTest(kode) { return TESTS.find(function(x) { return x.kode === kode; }); }

function getOperatorName() {
  return localStorage.getItem('labcare_operator') || 'Admin LabCare';
}
