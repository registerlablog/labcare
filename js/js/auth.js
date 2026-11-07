// ==========================================
// OPERATOR & LOGOUT
// ==========================================
function updateOperatorUI() {
  var el = document.getElementById('lblOperator');
  if (el) el.textContent = getOperatorName();
}

function doLogoutAdmin() {
  if (confirm('Apakah Anda yakin ingin keluar dari aplikasi?')) {
    localStorage.removeItem('labcare_operator');
    localStorage.removeItem('labcare_token');
    localStorage.removeItem('labcare_role');
    location.reload();
  }
}

// ==========================================
// LOGIN KARTU PETUGAS
// ==========================================
var selectedAdminId = '';

async function loadAdminCards() {
  var vContainer = document.getElementById('adminCardsVertical');
  var hContainer = document.getElementById('adminCardsHorizontal');
  
  updateLoginClockGreeting();
  setInterval(updateLoginClockGreeting, 1000);

  try {
    var res = await fetch(API_URL, {
      method: 'POST', 
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ action: 'getAdminList', data: {} })
    });
    
    var text = await res.text();
    
    try {
      var json = JSON.parse(text);
      if (json && json.ok && json.list.length > 0) {
        window._adminList = json.list;
        renderAdminCards(json.list);
      } else {
        vContainer.innerHTML = '<p style="color:#dc2626; text-align:center; width:100%;">Belum ada data admin di Master_Admin.</p>';
      }
    } catch (parseErr) {
      vContainer.innerHTML = '<p style="color:#ef4444; text-align:center; width:100%;">Error Server: Gagal memuat daftar (Error 500).</p>';
    }
  } catch (e) {
    vContainer.innerHTML = '<p style="color:#ef4444; text-align:center; width:100%;">Gagal memuat daftar petugas. Periksa koneksi internet.</p>';
  }
}

function renderAdminCards(list) {
  var vContainer = document.getElementById('adminCardsVertical');
  var hContainer = document.getElementById('adminCardsHorizontal');
  if (!vContainer || !hContainer) return;

  var barcodeSvg = '<svg width="100%" height="26" viewBox="0 0 200 26" preserveAspectRatio="none"><g fill="#1e293b"><rect x="0" y="0" width="2" height="26"/><rect x="4" y="0" width="1" height="26"/><rect x="7" y="0" width="3" height="26"/><rect x="12" y="0" width="1" height="26"/><rect x="15" y="0" width="2" height="26"/><rect x="19" y="0" width="3" height="26"/><rect x="24" y="0" width="1" height="26"/><rect x="27" y="0" width="2" height="26"/><rect x="31" y="0" width="3" height="26"/><rect x="36" y="0" width="1" height="26"/><rect x="39" y="0" width="2" height="26"/><rect x="43" y="0" width="3" height="26"/><rect x="48" y="0" width="1" height="26"/><rect x="51" y="0" width="2" height="26"/><rect x="55" y="0" width="3" height="26"/><rect x="60" y="0" width="1" height="26"/><rect x="63" y="0" width="2" height="26"/><rect x="67" y="0" width="3" height="26"/><rect x="72" y="0" width="1" height="26"/><rect x="75" y="0" width="2" height="26"/><rect x="79" y="0" width="3" height="26"/><rect x="84" y="0" width="1" height="26"/><rect x="87" y="0" width="2" height="26"/><rect x="91" y="0" width="3" height="26"/><rect x="96" y="0" width="1" height="26"/><rect x="99" y="0" width="2" height="26"/><rect x="103" y="0" width="3" height="26"/><rect x="108" y="0" width="1" height="26"/><rect x="111" y="0" width="2" height="26"/><rect x="115" y="0" width="3" height="26"/><rect x="120" y="0" width="1" height="26"/><rect x="123" y="0" width="2" height="26"/><rect x="127" y="0" width="3" height="26"/><rect x="132" y="0" width="1" height="26"/><rect x="135" y="0" width="2" height="26"/><rect x="139" y="0" width="3" height="26"/><rect x="144" y="0" width="1" height="26"/><rect x="147" y="0" width="2" height="26"/><rect x="151" y="0" width="3" height="26"/><rect x="156" y="0" width="1" height="26"/><rect x="159" y="0" width="2" height="26"/><rect x="163" y="0" width="3" height="26"/><rect x="168" y="0" width="1" height="26"/><rect x="171" y="0" width="2" height="26"/><rect x="175" y="0" width="3" height="26"/><rect x="180" y="0" width="1" height="26"/><rect x="183" y="0" width="2" height="26"/><rect x="187" y="0" width="3" height="26"/><rect x="192" y="0" width="1" height="26"/><rect x="195" y="0" width="2" height="26"/><rect x="198" y="0" width="2" height="26"/></g></svg>';
  var arrowSvg = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>';

  vContainer.innerHTML = list.map(function(a, index) {
    var nama = a['Nama'] || '';
    var initial = nama ? nama.charAt(0).toUpperCase() : '?';
    var idPegawai = a['Nomer NIP'] || a['Nomer KTP'] || '-';
    var jabatan = a['Jabatan'] || 'Petugas';
    
    return `
      <div class="admin-card-v" data-name="${esc(nama.toLowerCase())}" onclick="selectAdminByIndex(${index})">
        <div class="lanyard-hole"></div>
        <div class="card-header">
          <div class="card-badge">KARTU PEGAWAI DIGITAL</div>
          <h4>LABKESDA BONDOWOSO</h4>
        </div>
        <div class="card-avatar-wrap">
          <div class="avatar-ring">
            <div class="avatar-initial">${initial}</div>
            <span class="status-dot"></span>
          </div>
          <h3 class="card-name">${esc(nama)}</h3>
          <p class="card-role">${esc(jabatan)}</p>
          <div class="card-nip">${esc(idPegawai)}</div>
        </div>
        <div class="card-footer">
          <div class="barcode-box">${barcodeSvg}<span>TAP KARTU UNTUK LOGIN</span></div>
        </div>
      </div>`;
  }).join('');

  hContainer.innerHTML = list.map(function(a, index) {
    var nama = a['Nama'] || '';
    var initial = nama ? nama.charAt(0).toUpperCase() : '?';
    var idPegawai = a['Nomer NIP'] || a['Nomer KTP'] || '-';
    var jabatan = a['Jabatan'] || 'Petugas';

    return `
      <div class="admin-card-h" data-name="${esc(nama.toLowerCase())}" onclick="selectAdminByIndex(${index})">
        <div class="card-h-left">
          <div class="avatar-ring-h"><div class="avatar-initial-h">${initial}</div></div>
          <div class="card-h-info">
            <div class="card-h-nip"><span class="nip-tag">${esc(idPegawai)}</span><span class="dot-on"></span></div>
            <h3 class="card-h-name">${esc(nama)}</h3>
            <p class="card-h-role">${esc(jabatan)}</p>
          </div>
        </div>
        <div class="card-h-arrow">${arrowSvg}</div>
      </div>`;
  }).join('');
}

function setLoginView(mode) {
  var v = document.getElementById('adminCardsVertical');
  var h = document.getElementById('adminCardsHorizontal');
  var bv = document.getElementById('btnLoginVert');
  var bh = document.getElementById('btnLoginHoriz');
  if (!v || !h) return;

  if (mode === 'vertical') {
    v.style.display = 'flex'; h.style.display = 'none';
    bv.classList.add('active'); bh.classList.remove('active');
  } else {
    v.style.display = 'none'; h.style.display = 'flex';
    bh.classList.add('active'); bv.classList.remove('active');
  }
}

function filterAdminCards() {
  var q = (document.getElementById('loginSearch').value || '').toLowerCase();
  document.querySelectorAll('.admin-card-v, .admin-card-h').forEach(function(el) {
    var name = el.getAttribute('data-name') || '';
    el.style.display = name.indexOf(q) >= 0 ? '' : 'none';
  });
}

function updateLoginClockGreeting() {
  var now = new Date();
  var h = now.getHours();
  var greet = 'Selamat Pagi';
  if (h >= 11 && h < 15) greet = 'Selamat Siang';
  else if (h >= 15 && h < 18) greet = 'Selamat Sore';
  else if (h >= 18 || h < 4) greet = 'Selamat Malam';
  
  var gEl = document.getElementById('greetingTitle');
  if (gEl) gEl.textContent = greet + ', Silakan Pilih Kartu Petugas';
  
  var cEl = document.getElementById('liveClockLogin');
  if (cEl) {
    var days = ['MINGGU','SENIN','SELASA','RABU','KAMIS','JUMAT','SABTU'];
    var months = ['JAN','FEB','MAR','APR','MEI','JUN','JUL','AGS','SEP','OKT','NOV','DES'];
    var dt = String(now.getDate()).padStart(2,'0');
    var hr = String(now.getHours()).padStart(2,'0');
    var mn = String(now.getMinutes()).padStart(2,'0');
    cEl.textContent = days[now.getDay()] + ', ' + dt + ' ' + months[now.getMonth()] + ' ' + now.getFullYear() + ' • ' + hr + ':' + mn + ' WIB';
  }
}

function selectAdminByIndex(index) {
  var admin = window._adminList[index];
  if (!admin) return;
  
  var nama = admin['Nama'] || '';
  selectedAdminId = admin['Nomer NIP'] || admin['Nomer KTP']; 
  
  if (!selectedAdminId || selectedAdminId === '') {
      toastMsg('NIP/KTP petugas ini belum diisi di database.', 'err');
      return;
  }

  document.getElementById('nameSelected').innerText = nama;
  document.getElementById('avatarSelected').innerText = nama ? nama.charAt(0).toUpperCase() : '?';
  
  document.getElementById('loginStep1').style.display = 'none';
  document.getElementById('loginStep2').style.display = 'block';
  document.getElementById('loginPinAdmin').value = '';
  document.getElementById('loginPinAdmin').focus();
}

function backToStep1() {
  document.getElementById('loginStep2').style.display = 'none';
  document.getElementById('loginStep1').style.display = 'block';
  selectedAdminId = '';
}

async function doLoginAdmin() {
  var pin = document.getElementById('loginPinAdmin').value.trim();
  var errEl = document.getElementById('loginError');
  var btn = document.getElementById('btnLoginAdmin');

  if (!pin) { errEl.style.display = 'block'; errEl.innerText = 'PIN tidak boleh kosong.'; return; }

  errEl.style.display = 'none';
  btn.innerText = 'Memeriksa...';
  btn.disabled = true;

  try {
    var res = await fetch(API_URL, {
      method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ action: 'loginAdmin', data: { id: selectedAdminId, pin: pin } })
    });
    var json = await res.json();

    if (json && json.ok) {
      localStorage.setItem('labcare_operator', json.nama_asli);
      if(json.jabatan) localStorage.setItem('labcare_role', json.jabatan);
      localStorage.setItem('labcare_token', json.token);
      
      document.getElementById('loginOverlay').style.display = 'none';
      updateOperatorUI();
      toastMsg('Selamat datang, ' + json.nama_asli, 'ok');
      renderNav(); 
      render();
    } else {
      errEl.style.display = 'block';
      errEl.innerText = json.error || 'PIN Salah.';
      btn.innerText = 'Masuk →';
      btn.disabled = false;
    }
  } catch (e) {
    errEl.style.display = 'block';
    errEl.innerText = 'Error koneksi ke server.';
    btn.innerText = 'Masuk →';
    btn.disabled = false;
  }
}

// ==========================================
// PENDAFTARAN PETUGAS BARU
// ==========================================
function bukaModalDaftar() {
  document.getElementById('modalDaftarPetugas').classList.add('open');
  document.getElementById('formDaftarPetugas').reset();
  document.getElementById('reg_error').style.display = 'none';
}

function tutupModalDaftar() {
  document.getElementById('modalDaftarPetugas').classList.remove('open');
}

async function prosesDaftarPetugas(e) {
  e.preventDefault();
  var btn = document.getElementById('btnRegSubmit');
  var errEl = document.getElementById('reg_error');

  var nama = document.getElementById('reg_nama').value.trim();
  var nip = document.getElementById('reg_nip').value.trim();
  var ktp = document.getElementById('reg_ktp').value.trim();
  var jabatan = document.getElementById('reg_jabatan').value.trim();
  var telp = document.getElementById('reg_telp').value.trim();
  var pin = document.getElementById('reg_pin').value.trim();

  if (!nama || !jabatan || !telp || !pin) {
    errEl.innerText = 'Harap lengkapi semua kolom bertanda bintang (*).';
    errEl.style.display = 'block';
    return;
  }
  if (pin.length !== 6) {
    errEl.innerText = 'PIN harus terdiri dari 6 angka.';
    errEl.style.display = 'block';
    return;
  }
  if (!nip && !ktp) {
    errEl.innerText = 'Isi salah satu: NIP atau KTP.';
    errEl.style.display = 'block';
    return;
  }

  errEl.style.display = 'none';
  btn.innerText = 'Mengirim...';
  btn.disabled = true;

  try {
    var res = await fetch(API_URL, {
      method: 'POST', 
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ action: 'registerAdmin', data: { nama: nama, nip: nip, ktp: ktp, jabatan: jabatan, telp: telp, pin: pin } })
    });
    var json = await res.json();

    if (json && json.ok) {
      tutupModalDaftar();
      toastMsg('✅ Pendaftaran berhasil! Tunggu persetujuan Admin.', 'ok');
    } else {
      errEl.innerText = json.error || 'Gagal mendaftar. Silakan coba lagi.';
      errEl.style.display = 'block';
      btn.innerText = 'Kirim Pendaftaran';
      btn.disabled = false;
    }
  } catch (err) {
    errEl.innerText = 'Error koneksi ke server. Periksa internet Anda.';
    errEl.style.display = 'block';
    btn.innerText = 'Kirim Pendaftaran';
    btn.disabled = false;
  }
}

// ==========================================
// MASTER: PERSETUJUAN & KELOLA PETUGAS
// ==========================================
function viewMasterPersetujuan() {
  setTimeout(loadDataPersetujuan, 100);
  return '<div class="page-header-flex"><div><h3 style="font-size:17px;font-weight:700;">Persetujuan Petugas</h3><p style="font-size:13px;color:var(--slate-500);margin-top:2px;">Daftar petugas baru yang menunggu persetujuan akses.</p></div></div><div id="persetujuanTableWrap"><div class="empty-state"><span class="em">⏳</span><p>Memuat data...</p></div></div>';
}

async function loadDataPersetujuan() {
  var wrap = document.getElementById('persetujuanTableWrap');
  if (!wrap) return;
  var res = await apiCall('getAllAdminsForManagement');
  if (!res || !res.ok) {
    wrap.innerHTML = '<div class="empty-state"><span class="em">❌</span><p>Gagal memuat data petugas.</p></div>';
    return;
  }
  var pendingList = res.list.filter(function(u) {
    return String(u['Status'] || '').trim().toLowerCase() === 'pending';
  });
  
  if (pendingList.length === 0) {
    wrap.innerHTML = '<div class="empty-state"><span class="em">✅</span><p>Tidak ada pendaftar baru. Semua sudah diproses.</p></div>';
    return;
  }
  
  var rows = pendingList.map(function(u, i) {
    var idPegawai = u['Nomer NIP'] || u['Nomer KTP'] || '-';
    var nama = u['Nama'] || '-';
    var jabatan = u['Jabatan'] || '-';
    var telp = u['Nomer Telpon'] || '-';
    return '<tr><td style="color:var(--slate-500);font-size:12px;">' + (i + 1) + '</td><td style="font-weight:600;">' + esc(nama) + '</td><td style="font-size:12px;">' + esc(idPegawai) + '</td><td style="font-size:12px;">' + esc(jabatan) + '</td><td style="font-size:12px;">' + esc(telp) + '</td><td><span class="badge badge-menunggu">Pending</span></td><td style="text-align:right;white-space:nowrap;"><button class="btn btn-primary btn-sm" onclick="setujuiPetugas(\'' + esc(idPegawai) + '\')">✔️ Setujui</button> <button class="btn btn-secondary btn-sm" style="color:#dc2626; border-color:#dc2626;" onclick="tolakPetugas(\'' + esc(idPegawai) + '\')">✖️ Tolak</button></td></tr>';
  }).join('');
  
  wrap.innerHTML = '<div class="table-wrap"><table><thead><tr><th style="width:50px;">No</th><th>Nama Lengkap</th><th>NIP / KTP</th><th>Jabatan</th><th>No. Telp</th><th>Status</th><th style="text-align:right;width:180px;">Aksi</th></tr></thead><tbody>' + rows + '</tbody></table></div>';
}

async function setujuiPetugas(id) {
  if (!confirm('Setujui akses untuk petugas ini? Mereka akan bisa login.')) return;
  showLoading(true);
  var res = await apiCall('updateAdminStatus', { id: id, status: 'Aktif' });
  showLoading(false);
  if (res && res.ok) {
    toastMsg('✅ Petugas berhasil disetujui', 'ok');
    loadDataPersetujuan();
  } else {
    alert('Gagal menyetujui: ' + (res ? res.error : 'Error koneksi'));
  }
}

async function tolakPetugas(id) {
  if (!confirm('Tolak dan hapus pendaftaran ini secara permanen?')) return;
  showLoading(true);
  var res = await apiCall('deleteAdmin', { id: id });
  showLoading(false);
  if (res && res.ok) {
    toastMsg('🗑️ Pendaftaran ditolak dan dihapus', 'ok');
    loadDataPersetujuan();
  } else {
    alert('Gagal menolak: ' + (res ? res.error : 'Error koneksi'));
  }
}

function viewMasterKelolaPetugas() {
  setTimeout(loadDataKelolaPetugas, 100);
  return '<div class="page-header-flex"><div><h3 style="font-size:17px;font-weight:700;">Kelola Petugas</h3><p style="font-size:13px;color:var(--slate-500);margin-top:2px;">Daftar seluruh petugas. Anda dapat menonaktifkan atau menghapus akun.</p></div></div><div id="kelolaPetugasTableWrap"><div class="empty-state"><span class="em">⏳</span><p>Memuat data...</p></div></div>';
}

async function loadDataKelolaPetugas() {
  var wrap = document.getElementById('kelolaPetugasTableWrap');
  if (!wrap) return;
  var res = await apiCall('getAllAdminsForManagement');
  if (!res || !res.ok) {
    wrap.innerHTML = '<div class="empty-state"><span class="em">❌</span><p>Gagal memuat data petugas.</p></div>';
    return;
  }
  
  var sortedList = res.list.sort(function(a, b) {
    var statusA = String(a['Status'] || '').toLowerCase();
    var statusB = String(b['Status'] || '').toLowerCase();
    if (statusA === 'pending' && statusB !== 'pending') return -1;
    if (statusB === 'pending' && statusA !== 'pending') return 1;
    if (statusA === 'aktif' && statusB === 'nonaktif') return -1;
    if (statusB === 'aktif' && statusA === 'nonaktif') return 1;
    return 0;
  });

  if (sortedList.length === 0) {
    wrap.innerHTML = '<div class="empty-state"><span class="em">📭</span><p>Belum ada data petugas.</p></div>';
    return;
  }
  
  var currentAdminName = localStorage.getItem('labcare_operator');
  var rows = sortedList.map(function(u, i) {
    var idPegawai = u['Nomer NIP'] || u['Nomer KTP'] || '-';
    var nama = u['Nama'] || '-';
    var jabatan = u['Jabatan'] || '-';
    var status = String(u['Status'] || '').trim();
    var statusLower = status.toLowerCase();
    
    var badgeHtml = '';
    if (statusLower === 'aktif') badgeHtml = '<span class="badge badge-selesai">Aktif</span>';
    else if (statusLower === 'pending') badgeHtml = '<span class="badge badge-menunggu">Pending</span>';
    else badgeHtml = '<span class="badge badge-danger" style="background:#fee2e2;color:#dc2626;">Nonaktif</span>';
    
    var actionHtml = '';
    if (statusLower === 'pending') {
      actionHtml += '<button class="btn btn-primary btn-sm" onclick="setujuiPetugas(\'' + esc(idPegawai) + '\')">✔️ Setujui</button> ';
    } else if (statusLower === 'aktif') {
      if (nama !== currentAdminName) {
        actionHtml += '<button class="btn btn-secondary btn-sm" style="color:#d97706;border-color:#d97706;" onclick="ubahStatusPetugas(\'' + esc(idPegawai) + '\', \'Nonaktif\')">🚫 Nonaktifkan</button> ';
      }
    } else if (statusLower === 'nonaktif') {
      actionHtml += '<button class="btn btn-secondary btn-sm" style="color:#16a34a;border-color:#16a34a;" onclick="ubahStatusPetugas(\'' + esc(idPegawai) + '\', \'Aktif\')">✔️ Aktifkan</button> ';
    }
    
    if (nama !== currentAdminName) {
      actionHtml += '<button class="btn btn-secondary btn-sm" style="color:#dc2626;border-color:#dc2626;" onclick="tolakPetugas(\'' + esc(idPegawai) + '\')">🗑️ Hapus</button>';
    } else {
      actionHtml += '<span style="font-size:11px;color:var(--slate-400);font-style:italic;">(Akun Anda)</span>';
    }
    
    return '<tr><td style="color:var(--slate-500);font-size:12px;">' + (i + 1) + '</td><td style="font-weight:600;">' + esc(nama) + '</td><td style="font-size:12px;">' + esc(idPegawai) + '</td><td style="font-size:12px;">' + esc(jabatan) + '</td><td>' + badgeHtml + '</td><td style="text-align:right;white-space:nowrap;">' + actionHtml + '</td></tr>';
  }).join('');
  
  wrap.innerHTML = '<div class="table-wrap"><table><thead><tr><th style="width:50px;">No</th><th>Nama Lengkap</th><th>NIP / KTP</th><th>Jabatan</th><th>Status</th><th style="text-align:right;width:220px;">Aksi</th></tr></thead><tbody>' + rows + '</tbody></table></div>';
}

async function ubahStatusPetugas(id, statusBaru) {
  if (!confirm('Ubah status petugas ini menjadi "' + statusBaru + '"?')) return;
  showLoading(true);
  var res = await apiCall('updateAdminStatus', { id: id, status: statusBaru });
  showLoading(false);
  if (res && res.ok) {
    toastMsg('✅ Status berhasil diubah menjadi ' + statusBaru, 'ok');
    loadDataKelolaPetugas(); 
  } else {
    alert('Gagal mengubah status: ' + (res ? res.error : 'Error koneksi'));
  }
}

// ==========================================
// INIT LOGIN STATE
// ==========================================
function initLoginState() {
  var isLoggedIn = localStorage.getItem('labcare_operator');
  var overlay = document.getElementById('loginOverlay');
  
  if (isLoggedIn && isLoggedIn !== 'Admin LabCare') {
    if(overlay) overlay.style.display = 'none';
    updateOperatorUI();
  } else {
    if(overlay) overlay.style.display = 'flex';
    loadAdminCards();
  }
}
