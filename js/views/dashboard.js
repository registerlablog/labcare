// ==========================================
// TAMPILAN: DASHBOARD
// ==========================================
var dashboardChartInstance = null; 

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
    // HANYA KARTU PERTAMA YANG BISA DIKLIK
    if (index === 0) {
      clickAction = 'onclick="bukaModalPasienHariIni()" style="cursor: pointer; transition: transform 0.2s, box-shadow 0.2s;" onmouseover="this.style.transform=\'translateY(-3px)\'; this.style.boxShadow=\'0 6px 15px rgba(0,0,0,0.1)\'" onmouseout="this.style.transform=\'translateY(0)\'; this.style.boxShadow=\'none\'"';
    }
    
    return '<div class="stat-card ' + x.cls + '" ' + clickAction + '>' +
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
        <canvas id="trenKunjunganChart"></canvas>
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
// FUNGSI KLIK KARTU PASIEN HARI INI (MODAL)
// ==========================================
function bukaModalPasienHariIni() {
  var todayPatients = patients.filter(function(p) { return p.tglDaftar && p.tglDaftar.slice(0, 10) === today(); });
  
  var listHtml = '';
  if (todayPatients.length === 0) {
    listHtml = '<div class="empty-state" style="padding: 30px 10px; text-align: center; color: #a8a29e; background: #f8fafc; border-radius: 12px; border: 1px dashed #cbd5e1;"><span class="em" style="font-size: 32px; display: block; margin-bottom: 10px;">📭</span><p>Belum ada pasien terdaftar hari ini.</p></div>';
  } else {
    listHtml = '<div class="table-wrap" style="max-height: 300px; overflow-y: auto; border: 1px solid #e2e8f0; border-radius: 12px;">' +
      '<table style="width: 100%; font-size: 13px; margin: 0;">' +
      '<thead><tr style="background: #f8fafc; position: sticky; top: 0; z-index: 1;"><th style="padding: 10px;">Antrian</th><th style="padding: 10px;">Nama Pasien</th><th style="padding: 10px;">Status</th></tr></thead><tbody>' +
      todayPatients.map(function(p) {
        return '<tr style="border-bottom: 1px solid #f1f5f9;">' +
          '<td class="mono" style="color: var(--primary); font-weight: 700; padding: 10px; text-align:center;">' + esc(p.noAntrian) + '</td>' +
          '<td style="font-weight: 500; padding: 10px;">' + esc(p.nama) + '</td>' +
          '<td style="padding: 10px;"><span class="badge ' + STATUS[p.status].cls + '">' + STATUS[p.status].label + '</span></td>' +
          '</tr>';
      }).join('') + '</tbody></table></div>';
  }

  var html = `
    <div class="modal-body" style="padding: 0;">
      <div class="modal-head" style="display: flex; justify-content: space-between; align-items: center; padding: 20px 24px; border-bottom: 1px solid #e2e8f0; background: #f8fafc; border-radius: 16px 16px 0 0;">
        <div>
          <h3 style="margin: 0; font-size: 18px; color: #1c1917;">Pasien Hari Ini</h3>
          <p style="margin: 4px 0 0; font-size: 13px; color: #78716c;">Total: <b>${todayPatients.length}</b> pasien terdaftar.</p>
        </div>
        <button onclick="closeModal()" style="background: none; border: none; font-size: 24px; cursor: pointer; color: #a8a29e;">&times;</button>
      </div>
      
      <div style="padding: 20px 24px;">
        ${listHtml}
      </div>

      <div style="padding: 16px 24px; background: #f8fafc; border-top: 1px solid #e2e8f0; border-radius: 0 0 16px 16px; display: flex; gap: 10px;">
        <button onclick="closeModal()" class="btn btn-secondary" style="flex: 1; padding: 12px;">Tutup</button>
        <button onclick="lanjutKeFormPendaftaran()" class="btn btn-primary" style="flex: 2; padding: 12px; display: flex; align-items: center; justify-content: center; gap: 8px; font-size: 14px;">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Daftarkan Pasien Baru
        </button>
      </div>
    </div>
  `;

  // Tampilkan modal
  var modalContent = document.getElementById('modalContent');
  var modalOverlay = document.getElementById('modal');
  if(modalContent && modalOverlay) {
    modalContent.innerHTML = html;
    modalContent.style.padding = "0"; // Menghilangkan padding bawaan modal
    modalOverlay.classList.add('open');
  }
}

// ==========================================
// FUNGSI PINDAH KE HALAMAN FORM
// ==========================================
function lanjutKeFormPendaftaran() {
  closeModal(); // Tutup pop-up
  
  // Kembalikan padding modal ke semula (jaga-jaga)
  var modalContent = document.getElementById('modalContent');
  if (modalContent) modalContent.style.padding = ""; 

  // Pindah halaman ke Pendaftaran
  window.view = 'pendaftaran';
  if (typeof renderNav === 'function') renderNav();
  if (typeof render === 'function') render();

  // Fokuskan kursor ke input nama setelah form muncul
  setTimeout(function() {
    var inputNama = document.querySelector('input[name="nama"]');
    if (inputNama) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      inputNama.focus();
    }
  }, 150);
}

// ==========================================
// FUNGSI INTERAKSI (KLIK) LAINNYA
// ==========================================
function showDetailPasienDashboard(noRM) {
  var pasien = patients.find(function(p) { return p.noRM === noRM; });
  if(!pasien) return;

  var html = `
    <div class="modal-header" style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px; border-bottom:1px solid #eee; padding-bottom:10px;">
      <h3 style="margin:0; font-size:18px; color:#1c1917;">Detail Pasien</h3>
      <button onclick="closeModal()" style="background:none; border:none; font-size:24px; cursor:pointer; color:#a8a29e;">&times;</button>
    </div>
    <div style="display:grid; grid-template-columns:1fr 1fr; gap:15px; font-size:14px;">
      <div><strong style="color:#78716c; font-size:12px; display:block;">NAMA PASIEN</strong><span style="font-weight:600; color:#1c1917;">${esc(pasien.nama)}</span></div>
      <div><strong style="color:#78716c; font-size:12px; display:block;">NO. REKAM MEDIS</strong><span class="mono" style="font-weight:600; color:#1c1917;">${esc(pasien.noRM)}</span></div>
      <div><strong style="color:#78716c; font-size:12px; display:block;">NO. ANTRIAN</strong><span class="mono" style="font-weight:600; color:var(--primary);">${esc(pasien.noAntrian)}</span></div>
      <div><strong style="color:#78716c; font-size:12px; display:block;">STATUS</strong><span class="badge ${STATUS[pasien.status].cls}">${STATUS[pasien.status].label}</span></div>
    </div>
    <div style="margin-top: 25px; text-align: right;">
      <button onclick="closeModal()" class="btn btn-secondary" style="padding: 8px 20px;">Tutup</button>
    </div>
  `;

  var modalContent = document.getElementById('modalContent');
  var modalOverlay = document.getElementById('modal');
  if(modalContent && modalOverlay) {
    modalContent.innerHTML = html;
    modalContent.style.padding = ""; // Pastikan padding normal
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
  var todayObj = new Date();
  var bulanIndo = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Ags", "Sep", "Okt", "Nov", "Des"];

  for (var i = days - 1; i >= 0; i--) {
    var d = new Date(todayObj);
    d.setDate(todayObj.getDate() - i);
    var dateStr = d.toISOString().slice(0, 10); 
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
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#1c1917', padding: 10, displayColors: false,
          callbacks: { label: function(context) { return context.parsed.y + ' Pasien'; } }
        }
      },
      scales: {
        x: { grid: { display: false }, ticks: { color: '#78716c', font: { family: "'Plus Jakarta Sans', sans-serif", size: 11 }, maxRotation: 45, minRotation: 0 } },
        y: { beginAtZero: true, grid: { color: '#f5f2eb' }, ticks: { color: '#78716c', stepSize: 1, font: { family: "'Plus Jakarta Sans', sans-serif", size: 11 } } }
      }
    }
  });
}
