// ==========================================
// TAMPILAN: DASHBOARD
// ==========================================

// Variabel global untuk menyimpan instance grafik agar bisa dihapus/diperbarui
var dashboardChartInstance = null; 

function viewDashboard() {
  var t = patients.filter(function(p) { return p.tglDaftar && p.tglDaftar.slice(0, 10) === today(); });
  var c = function(s) { return t.filter(function(p) { return p.status === s; }).length; };
  var cards = [
    { label: 'Pasien Hari Ini', val: t.length,       cls: 'stat-blue',   icon: '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>' },
    { label: 'Menunggu',        val: c('menunggu'),  cls: 'stat-amber',  icon: '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>' },
    { label: 'Diproses',        val: c('proses') + c('sampling'), cls: 'stat-purple', icon: '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 3h6v6l4 8a2 2 0 0 1-2 3H7a2 2 0 0 1-2-3l4-8V3z"/><path d="M9 3h6"/></svg>' },
    { label: 'Selesai',         val: c('selesai'),   cls: 'stat-green',  icon: '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>' }
  ];
  
  var cardsHtml = cards.map(function(x) { return '<div class="stat-card ' + x.cls + '"><div class="icon">' + x.icon + '</div><div class="val">' + x.val + '</div><div class="lbl">' + x.label + '</div></div>'; }).join('');
  
  // --- SENTUHAN AKHIR: DESAIN GRAFIK & DROPDOWN FILTER ---
  var chartHtml = `
    <div class="chart-card" style="background: #ffffff; border-radius: 16px; padding: 20px; margin-bottom: 24px; box-shadow: 0 4px 12px rgba(0,0,0,0.03); margin-top: 24px;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; flex-wrap: wrap; gap: 10px;">
        <h3 style="margin: 0; font-size: 16px; color: #1c1917; font-weight: 700;">Tren Kunjungan Pasien</h3>
        
        <!-- Dropdown Filter Waktu -->
        <select onchange="updateChartFilter(this.value)" style="font-size: 12px; color: #57534e; background: #f5f2eb; padding: 6px 12px; border-radius: 20px; border: 1px solid #e7e5e4; outline: none; cursor: pointer; font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 600; transition: all 0.2s;">
          <option value="7">7 Hari Terakhir</option>
          <option value="14">14 Hari Terakhir</option>
          <option value="30">30 Hari Terakhir</option>
        </select>
      </div>
      
      <!-- Wadah Canvas Grafik (Responsif) -->
      <div style="position: relative; height: 250px; width: 100%; min-height: 250px;">
        <canvas id="trenKunjunganChart"></canvas>
      </div>
    </div>
  `;

  var recent = patients.slice().sort(function(a, b) { return (b.tglDaftar || '').localeCompare(a.tglDaftar || ''); }).slice(0, 6);
  var recentHtml;
  if (recent.length === 0) { recentHtml = '<div class="empty-state"><span class="em">📭</span><p>Belum ada data pasien.</p></div>'; }
  else {
    recentHtml = '<div class="table-wrap"><table><thead><tr><th>Antrian</th><th>No. RM</th><th>Nama</th><th>Tes</th><th>Status</th><th>Tanggal</th></tr></thead><tbody>' +
      recent.map(function(p) { return '<tr><td class="mono" style="color:var(--primary);font-weight:700;">' + esc(p.noAntrian) + '</td><td class="mono" style="font-size:12px;">' + esc(p.noRM) + '</td><td style="font-weight:500;">' + esc(p.nama) + '</td><td style="font-size:12px;color:var(--slate-500);">' + (p.tests ? p.tests.length : 0) + ' tes</td><td><span class="badge ' + STATUS[p.status].cls + '">' + STATUS[p.status].label + '</span></td><td style="font-size:12px;color:var(--slate-500);">' + esc(fmtDate(p.tglDaftar)) + '</td></tr>'; }).join('') + '</tbody></table></div>';
  }

  // Panggil fungsi render grafik default 7 hari
  setTimeout(function() {
    renderTrenChart(7);
  }, 100);

  return '<div class="page-header"><h2>Dashboard</h2><p>Ringkasan pelayanan — ' + esc(fmtDate(new Date().toISOString())) + '</p></div>' +
         '<div class="stats-grid">' + cardsHtml + '</div>' + 
         chartHtml + 
         '<h3 class="section-title">Pasien Terbaru</h3>' + recentHtml;
}

// ==========================================
// FUNGSI UNTUK MENGUBAH FILTER GRAFIK
// ==========================================
function updateChartFilter(days) {
  renderTrenChart(parseInt(days));
}

// ==========================================
// FUNGSI RENDER GRAFIK (CHART.JS)
// ==========================================
function renderTrenChart(days) {
  var ctx = document.getElementById('trenKunjunganChart');
  if (!ctx) return;

  // Hapus grafik lama jika ada, agar tidak tumpang tindih saat ganti filter
  if (dashboardChartInstance) {
    dashboardChartInstance.destroy();
  }

  var labels = [];
  var dataKunjungan = [];
  var todayObj = new Date();
  var bulanIndo = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Ags", "Sep", "Okt", "Nov", "Des"];

  // Looping mundur sesuai jumlah hari yang dipilih
  for (var i = days - 1; i >= 0; i--) {
    var d = new Date(todayObj);
    d.setDate(todayObj.getDate() - i);
    
    var dateStr = d.toISOString().slice(0, 10); 
    
    // Label: "04 Nov". Jika 30 hari, buat format lebih ringkas jika perlu (contoh: hanya tanggal)
    var labelStr = String(d.getDate()).padStart(2, '0') + ' ' + bulanIndo[d.getMonth()];
    labels.push(labelStr);

    // Hitung pasien
    var count = patients.filter(function(p) {
      return p.tglDaftar && p.tglDaftar.slice(0, 10) === dateStr;
    }).length;
    
    dataKunjungan.push(count);
  }

  // Render Grafik Baru
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
        pointRadius: days > 14 ? 2 : 4, // Perkecil titik jika datanya banyak (30 hari)
        pointHoverRadius: 6,
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
          backgroundColor: '#1c1917',
          padding: 10,
          displayColors: false,
          callbacks: {
            label: function(context) {
              return context.parsed.y + ' Pasien';
            }
          }
        }
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { 
            color: '#78716c', 
            font: { family: "'Plus Jakarta Sans', sans-serif", size: 11 },
            maxRotation: 45, // Miringkan teks jika datanya banyak (30 hari)
            minRotation: 0
          }
        },
        y: {
          beginAtZero: true,
          grid: { color: '#f5f2eb' },
          ticks: { color: '#78716c', stepSize: 1, font: { family: "'Plus Jakarta Sans', sans-serif", size: 11 } }
        }
      }
    }
  });
}
