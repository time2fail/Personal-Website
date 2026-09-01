(function () {
  "use strict";

  /* ============================================================
     0. VERİ — Grand Games "Magic Sort" vaka dosyasındaki 25 level.
     Kaynak sütunlar birebir; türetilmiş metrikler aşağıda hesaplanıyor.
     ============================================================ */
  var RAW = [
    {level:1,zorluk:'Normal',renk:1,sise:2,perdeliSise:0,bos:0,parca:2,bilinmez:0,perdeliParca:0,karanlik:0},
    {level:2,zorluk:'Normal',renk:2,sise:3,perdeliSise:0,bos:0,parca:4,bilinmez:0,perdeliParca:0,karanlik:0},
    {level:3,zorluk:'Normal',renk:3,sise:4,perdeliSise:0,bos:1,parca:6,bilinmez:0,perdeliParca:0,karanlik:0},
    {level:4,zorluk:'Normal',renk:3,sise:5,perdeliSise:0,bos:2,parca:10,bilinmez:0,perdeliParca:0,karanlik:0},
    {level:5,zorluk:'Normal',renk:4,sise:6,perdeliSise:0,bos:2,parca:14,bilinmez:0,perdeliParca:0,karanlik:0},
    {level:6,zorluk:'Normal',renk:5,sise:7,perdeliSise:0,bos:2,parca:16,bilinmez:0,perdeliParca:0,karanlik:0},
    {level:7,zorluk:'Normal',renk:6,sise:8,perdeliSise:0,bos:2,parca:22,bilinmez:6,perdeliParca:0,karanlik:0},
    {level:8,zorluk:'Normal',renk:6,sise:8,perdeliSise:0,bos:2,parca:20,bilinmez:12,perdeliParca:0,karanlik:0},
    {level:9,zorluk:'Normal',renk:6,sise:8,perdeliSise:0,bos:2,parca:24,bilinmez:12,perdeliParca:0,karanlik:0},
    {level:10,zorluk:'Normal',renk:7,sise:9,perdeliSise:0,bos:2,parca:26,bilinmez:6,perdeliParca:0,karanlik:0},
    {level:11,zorluk:'Normal',renk:7,sise:9,perdeliSise:0,bos:2,parca:27,bilinmez:9,perdeliParca:0,karanlik:0},
    {level:12,zorluk:'Normal',renk:8,sise:10,perdeliSise:0,bos:2,parca:30,bilinmez:9,perdeliParca:0,karanlik:0},
    {level:13,zorluk:'Normal',renk:8,sise:10,perdeliSise:0,bos:2,parca:31,bilinmez:10,perdeliParca:0,karanlik:0},
    {level:14,zorluk:'Hard',renk:8,sise:10,perdeliSise:0,bos:2,parca:31,bilinmez:15,perdeliParca:0,karanlik:0},
    {level:15,zorluk:'Normal',renk:7,sise:9,perdeliSise:0,bos:2,parca:26,bilinmez:12,perdeliParca:0,karanlik:0},
    {level:16,zorluk:'Normal',renk:8,sise:10,perdeliSise:0,bos:2,parca:31,bilinmez:18,perdeliParca:0,karanlik:0},
    {level:17,zorluk:'Normal',renk:8,sise:10,perdeliSise:0,bos:2,parca:31,bilinmez:17,perdeliParca:0,karanlik:0},
    {level:18,zorluk:'Normal',renk:9,sise:11,perdeliSise:0,bos:2,parca:35,bilinmez:12,perdeliParca:0,karanlik:0},
    {level:19,zorluk:'Super Hard',renk:9,sise:12,perdeliSise:0,bos:0,parca:36,bilinmez:24,perdeliParca:0,karanlik:0},
    {level:20,zorluk:'Normal',renk:5,sise:6,perdeliSise:3,bos:1,parca:13,bilinmez:0,perdeliParca:9,karanlik:0},
    {level:21,zorluk:'Normal',renk:6,sise:8,perdeliSise:4,bos:2,parca:19,bilinmez:0,perdeliParca:12,karanlik:0},
    {level:22,zorluk:'Normal',renk:7,sise:9,perdeliSise:2,bos:2,parca:26,bilinmez:0,perdeliParca:7,karanlik:0},
    {level:23,zorluk:'Normal',renk:8,sise:10,perdeliSise:5,bos:2,parca:26,bilinmez:0,perdeliParca:17,karanlik:0},
    {level:24,zorluk:'Hard',renk:8,sise:10,perdeliSise:4,bos:2,parca:29,bilinmez:0,perdeliParca:8,karanlik:6},
    {level:25,zorluk:'Normal',renk:8,sise:10,perdeliSise:5,bos:2,parca:29,bilinmez:0,perdeliParca:19,karanlik:0}
  ];

  var MECHANIC_LEVELS = [
    {level: 7, label: 'Bilinmez Parça'},
    {level: 20, label: 'Perdeli Şişe/Parça'},
    {level: 24, label: 'Karanlık Parça'}
  ];

  function metricsFor(r) {
    var dolu = r.sise - r.bos;
    return {
      level: r.level, zorluk: r.zorluk,
      renk: r.renk, sise: r.sise, bos: r.bos, dolu: dolu, parca: r.parca,
      m1: r.renk / r.sise,
      m2: dolu / r.sise,
      m3: r.parca / dolu,
      m4: (r.bilinmez + r.perdeliParca + r.karanlik) / r.parca,
      m4a: r.bilinmez / r.parca,
      m4b: r.perdeliParca / r.parca,
      m4c: r.karanlik / r.parca,
      m5: r.renk / dolu,
      m6: r.bos / r.renk,
      m7: r.parca / r.renk
    };
  }

  var M = RAW.map(metricsFor);
  var HARD_LEVELS = M.filter(function (r) { return r.zorluk === 'Hard'; }).map(function (r) { return r.level; });
  var SUPERHARD_LEVELS = M.filter(function (r) { return r.zorluk === 'Super Hard'; }).map(function (r) { return r.level; });

  function deltaSeries(key) {
    return M.map(function (r, i) { return i === 0 ? null : r[key] - M[i - 1][key]; });
  }
  var dRenk = deltaSeries('renk'), dSise = deltaSeries('sise'), dParca = deltaSeries('parca');

  function pearson(xs, ys) {
    var n = xs.length;
    var mx = xs.reduce(function (a, b) { return a + b; }, 0) / n;
    var my = ys.reduce(function (a, b) { return a + b; }, 0) / n;
    var num = 0, dx2 = 0, dy2 = 0;
    for (var i = 0; i < n; i++) {
      var dx = xs[i] - mx, dy = ys[i] - my;
      num += dx * dy; dx2 += dx * dx; dy2 += dy * dy;
    }
    return num / Math.sqrt(dx2 * dy2);
  }

  /* ============================================================
     1. Renk paleti / Chart.js varsayılanları
     ============================================================ */
  var C = {
    ink: '#14202B', inkSoft: '#3C4C58', blue: '#1F4E79', brass: '#B8873A',
    moss: '#4C7A5E', danger: '#A63D40', gridLine: '#C7D4D6', paperRaised: '#F4F7F7'
  };
  var BAND_HARD = 'rgba(184, 135, 58, 0.28)';
  var BAND_SUPERHARD = 'rgba(166, 61, 64, 0.24)';
  var MECH_LINE = 'rgba(20, 32, 43, 0.55)';

  function rgba(hex, a) {
    var h = hex.replace('#', '');
    var r = parseInt(h.substring(0, 2), 16), g = parseInt(h.substring(2, 4), 16), b = parseInt(h.substring(4, 6), 16);
    return 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')';
  }

  Chart.defaults.font.family = "'IBM Plex Sans', sans-serif";
  Chart.defaults.font.size = 11;
  Chart.defaults.color = C.inkSoft;
  Chart.defaults.borderColor = C.gridLine;
  Chart.defaults.plugins.legend.labels.usePointStyle = true;
  Chart.defaults.plugins.legend.labels.font = { family: "'IBM Plex Mono', monospace", size: 10 };
  Chart.defaults.plugins.tooltip.titleFont = { family: "'IBM Plex Mono', monospace", size: 11 };
  Chart.defaults.plugins.tooltip.bodyFont = { family: "'IBM Plex Mono', monospace", size: 11 };
  Chart.defaults.plugins.tooltip.backgroundColor = C.ink;
  Chart.defaults.plugins.tooltip.padding = 8;
  Chart.defaults.plugins.tooltip.cornerRadius = 0;
  Chart.defaults.elements.point.radius = 3;
  Chart.defaults.elements.point.hoverRadius = 5;
  Chart.defaults.elements.line.borderWidth = 1.75;
  Chart.defaults.elements.line.tension = 0.15;

  /* ---- Zorluk bantları + mekanik çizgileri (kategori ekseni üzerinde) ---- */
  var difficultyBands = {
    id: 'difficultyBands',
    beforeDatasetsDraw: function (chart, args, opts) {
      if (!opts || !opts.enabled) return;
      var xScale = chart.scales.x, yScale = chart.scales.y;
      var labels = xScale.getLabels ? xScale.getLabels() : [];
      var n = labels.length;
      if (n < 2) return;
      var half = (xScale.getPixelForValue(1) - xScale.getPixelForValue(0)) / 2;
      function xFor(level) {
        var idx = labels.indexOf(String(level));
        return idx === -1 ? null : xScale.getPixelForValue(idx);
      }
      var ctx = chart.ctx;
      ctx.save();
      function band(levels, color) {
        levels.forEach(function (lv) {
          var cx = xFor(lv);
          if (cx === null) return;
          ctx.fillStyle = color;
          ctx.fillRect(cx - half, yScale.top, half * 2, yScale.bottom - yScale.top);
        });
      }
      band(HARD_LEVELS, BAND_HARD);
      band(SUPERHARD_LEVELS, BAND_SUPERHARD);
      if (opts.mechanics) {
        MECHANIC_LEVELS.forEach(function (mech) {
          var cx = xFor(mech.level);
          if (cx === null) return;
          ctx.setLineDash([4, 3]);
          ctx.strokeStyle = MECH_LINE;
          ctx.lineWidth = 1;
          ctx.beginPath(); ctx.moveTo(cx, yScale.top); ctx.lineTo(cx, yScale.bottom); ctx.stroke();
          ctx.setLineDash([]);
        });
      }
      ctx.restore();
    }
  };

  /* ---- Scatter noktalarının yanına level numarası yazan eklenti ---- */
  var pointLabels = {
    id: 'pointLabels',
    afterDatasetsDraw: function (chart, args, opts) {
      if (!opts || !opts.enabled) return;
      var ctx = chart.ctx;
      ctx.save();
      ctx.font = "9px 'IBM Plex Mono', monospace";
      ctx.fillStyle = C.inkSoft;
      chart.data.datasets.forEach(function (ds, i) {
        var meta = chart.getDatasetMeta(i);
        if (meta.hidden) return;
        meta.data.forEach(function (el, j) {
          var raw = ds.data[j];
          if (raw && raw.level != null) ctx.fillText(String(raw.level), el.x + 6, el.y + 3);
        });
      });
      ctx.restore();
    }
  };

  Chart.register(difficultyBands, pointLabels);

  var LEVEL_LABELS = M.map(function (r) { return String(r.level); });

  function baseScales(opts) {
    opts = opts || {};
    return {
      x: {
        type: 'category',
        labels: opts.labels || LEVEL_LABELS,
        grid: { color: C.gridLine, drawTicks: false },
        ticks: { font: { family: "'IBM Plex Mono', monospace", size: 9 }, maxRotation: 0, autoSkip: true, autoSkipPadding: 6 },
        title: opts.xTitle ? { display: true, text: opts.xTitle, font: { family: "'IBM Plex Mono', monospace", size: 10 } } : undefined
      },
      y: {
        grid: { color: C.gridLine },
        ticks: { font: { family: "'IBM Plex Mono', monospace", size: 9 } },
        title: opts.yTitle ? { display: true, text: opts.yTitle, font: { family: "'IBM Plex Mono', monospace", size: 10 } } : undefined,
        beginAtZero: !!opts.beginAtZero,
        min: opts.min, max: opts.max
      }
    };
  }

  function lineChart(canvasId, datasets, opts) {
    var el = document.getElementById(canvasId);
    if (!el) return;
    opts = opts || {};
    return new Chart(el, {
      type: 'line',
      data: { labels: opts.labels || LEVEL_LABELS, datasets: datasets },
      options: {
        responsive: true, maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        scales: baseScales(opts),
        plugins: {
          legend: { display: datasets.length > 1, position: 'top', align: 'end' },
          difficultyBands: { enabled: true, mechanics: !!opts.mechanics },
          tooltip: { callbacks: { label: function (ctx) { return ctx.dataset.label + ': ' + ctx.formattedValue; } } }
        }
      }
    });
  }

  function fmt(n, d) { return Number(n).toFixed(d == null ? 3 : d); }

  /* ============================================================
     2. BÖLÜM 01 — Ham Parametreler
     ============================================================ */
  lineChart('chartRenk', [{ label: 'Renk Sayısı', data: M.map(function (r) { return r.renk; }), borderColor: C.blue, backgroundColor: C.blue, pointBackgroundColor: C.blue }], { mechanics: true });
  lineChart('chartSise', [{ label: 'Şişe Sayısı', data: M.map(function (r) { return r.sise; }), borderColor: C.moss, backgroundColor: C.moss, pointBackgroundColor: C.moss }], { mechanics: true });
  lineChart('chartParca', [{ label: 'Parça Sayısı', data: M.map(function (r) { return r.parca; }), borderColor: C.danger, backgroundColor: C.danger, pointBackgroundColor: C.danger }], { mechanics: true });
  lineChart('chartBos', [{ label: 'Boş Şişe Sayısı', data: M.map(function (r) { return r.bos; }), borderColor: C.brass, backgroundColor: C.brass, pointBackgroundColor: C.brass }], { mechanics: true });

  /* ============================================================
     3. BÖLÜM 02 — Türetilmiş Oranlar (M1, M2, M5, M3, M7, M6)
     ============================================================ */
  lineChart('chartM1', [{ label: 'M1', data: M.map(function (r) { return r.m1; }), borderColor: C.blue, backgroundColor: C.blue, pointBackgroundColor: C.blue }], { mechanics: true });
  lineChart('chartM2', [{ label: 'M2', data: M.map(function (r) { return r.m2; }), borderColor: C.moss, backgroundColor: C.moss, pointBackgroundColor: C.moss }], { mechanics: true, min: 0, max: 1.05 });
  lineChart('chartM5', [{ label: 'M5', data: M.map(function (r) { return r.m5; }), borderColor: C.brass, backgroundColor: C.brass, pointBackgroundColor: C.brass }], { mechanics: true });
  lineChart('chartM3', [{ label: 'M3', data: M.map(function (r) { return r.m3; }), borderColor: C.danger, backgroundColor: C.danger, pointBackgroundColor: C.danger }], { mechanics: true });
  lineChart('chartM7', [{ label: 'M7', data: M.map(function (r) { return r.m7; }), borderColor: '#8172B2', backgroundColor: '#8172B2', pointBackgroundColor: '#8172B2' }], { mechanics: true });
  lineChart('chartM6', [{ label: 'M6', data: M.map(function (r) { return r.m6; }), borderColor: C.inkSoft, backgroundColor: C.inkSoft, pointBackgroundColor: C.inkSoft }], { mechanics: true });

  /* ============================================================
     4. BÖLÜM 03 — M4 Gizli Bilgi Oranı
     ============================================================ */
  lineChart('chartM4Total', [{ label: 'M4 — Toplam', data: M.map(function (r) { return r.m4; }), borderColor: C.danger, backgroundColor: C.danger, pointBackgroundColor: C.danger }], { mechanics: true, min: 0, max: 1 });
  lineChart('chartM4Split', [
    { label: 'M4a — Bilinmez', data: M.map(function (r) { return r.m4a; }), borderColor: C.blue, backgroundColor: C.blue, pointBackgroundColor: C.blue },
    { label: 'M4b — Perdeli', data: M.map(function (r) { return r.m4b; }), borderColor: C.moss, backgroundColor: C.moss, pointBackgroundColor: C.moss },
    { label: 'M4c — Karanlık', data: M.map(function (r) { return r.m4c; }), borderColor: '#8172B2', backgroundColor: '#8172B2', pointBackgroundColor: '#8172B2' }
  ], { mechanics: true, min: 0, max: 0.75 });

  /* ============================================================
     5. BÖLÜM 04 — Level başına değişim (Δ)
     ============================================================ */
  (function () {
    var el = document.getElementById('chartDelta');
    if (!el) return;
    var labels = M.slice(1).map(function (r) { return String(r.level); });
    new Chart(el, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          { label: 'Δ Parça', data: dParca.slice(1), backgroundColor: rgba(C.danger, 0.85) },
          { label: 'Δ Renk', data: dRenk.slice(1), backgroundColor: rgba(C.blue, 0.85) },
          { label: 'Δ Şişe', data: dSise.slice(1), backgroundColor: rgba(C.moss, 0.85) }
        ]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        scales: baseScales({ labels: labels }),
        plugins: {
          legend: { position: 'top', align: 'end' },
          difficultyBands: { enabled: true, mechanics: true }
        }
      }
    });
  })();

  /* ============================================================
     6. BÖLÜM 05 — Zorluk gruplarına göre ortalamalar
     ============================================================ */
  (function () {
    var el = document.getElementById('chartGroupMeans');
    if (!el) return;
    var codes = ['m1', 'm2', 'm3', 'm4', 'm5', 'm6', 'm7'];
    var labels = ['M1', 'M2', 'M3', 'M4', 'M5', 'M6', 'M7'];
    var groups = { Normal: [], Hard: [], 'Super Hard': [] };
    M.forEach(function (r) { groups[r.zorluk].push(r); });
    function meansFor(g) {
      var rows = groups[g];
      return codes.map(function (c) { return rows.reduce(function (a, r) { return a + r[c]; }, 0) / rows.length; });
    }
    new Chart(el, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          { label: 'Normal', data: meansFor('Normal'), backgroundColor: rgba(C.moss, 0.85) },
          { label: 'Hard', data: meansFor('Hard'), backgroundColor: rgba(C.brass, 0.9) },
          { label: 'Super Hard', data: meansFor('Super Hard'), backgroundColor: rgba(C.danger, 0.9) }
        ]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        scales: {
          x: { grid: { display: false }, ticks: { font: { family: "'IBM Plex Mono', monospace", size: 10 } } },
          y: { grid: { color: C.gridLine }, ticks: { font: { family: "'IBM Plex Mono', monospace", size: 9 } } }
        },
        plugins: { legend: { position: 'top', align: 'end' } }
      }
    });
  })();

  /* ============================================================
     7. BÖLÜM 06 — Tüm metrikler, ham tablo
     ============================================================ */
  (function () {
    var tbody = document.getElementById('dataTableBody');
    if (!tbody) return;
    var rows = M.map(function (r) {
      var cls = r.zorluk === 'Hard' ? 'is-hard' : (r.zorluk === 'Super Hard' ? 'is-superhard' : '');
      return '<tr class="' + cls + '">' +
        '<td>' + r.level + '</td>' +
        '<td>' + r.zorluk + '</td>' +
        '<td>' + fmt(r.m1) + '</td>' +
        '<td>' + fmt(r.m2) + '</td>' +
        '<td>' + fmt(r.m3) + '</td>' +
        '<td>' + fmt(r.m4) + '</td>' +
        '<td>' + fmt(r.m5) + '</td>' +
        '<td>' + fmt(r.m6) + '</td>' +
        '<td>' + fmt(r.m7) + '</td>' +
        '</tr>';
    });
    tbody.innerHTML = rows.join('');
  })();

  /* ============================================================
     8. BÖLÜM 07.1 — Korelasyon matrisi
     ============================================================ */
  (function () {
    var wrap = document.getElementById('corrGrid');
    if (!wrap) return;
    var keys = ['level', 'm1', 'm2', 'm3', 'm4', 'm5', 'm6', 'm7'];
    var labels = ['Level', 'M1', 'M2', 'M3', 'M4', 'M5', 'M6', 'M7'];
    var series = {};
    keys.forEach(function (k) { series[k] = M.map(function (r) { return k === 'level' ? r.level : r[k]; }); });

    function mixHex(hexA, hexB, t) {
      var a = hexA.replace('#', ''), b = hexB.replace('#', '');
      var ar = parseInt(a.substring(0, 2), 16), ag = parseInt(a.substring(2, 4), 16), ab = parseInt(a.substring(4, 6), 16);
      var br = parseInt(b.substring(0, 2), 16), bg = parseInt(b.substring(2, 4), 16), bb = parseInt(b.substring(4, 6), 16);
      var r = Math.round(ar + (br - ar) * t), g = Math.round(ag + (bg - ag) * t), bl = Math.round(ab + (bb - ab) * t);
      return 'rgb(' + r + ',' + g + ',' + bl + ')';
    }
    function corrColor(v) {
      return v >= 0 ? mixHex('#F4F7F7', C.danger, v) : mixHex('#F4F7F7', C.blue, -v);
    }

    wrap.style.gridTemplateColumns = 'repeat(' + (labels.length + 1) + ', minmax(60px, 1fr))';
    var cells = ['<div class="corr-cell"></div>'];
    labels.forEach(function (l) { cells.push('<div class="corr-cell is-header">' + l + '</div>'); });
    labels.forEach(function (rowLabel, i) {
      cells.push('<div class="corr-cell is-rowhead">' + rowLabel + '</div>');
      labels.forEach(function (colLabel, j) {
        var v = pearson(series[keys[i]], series[keys[j]]);
        var bg = corrColor(v);
        var fg = Math.abs(v) > 0.6 ? '#F4F7F7' : C.ink;
        cells.push('<div class="corr-cell" style="background:' + bg + ';color:' + fg + '">' + v.toFixed(2) + '</div>');
      });
    });
    wrap.innerHTML = cells.join('');
  })();

  /* ============================================================
     9. BÖLÜM 07.2 — M4 vs M6, zorluk kümeleri (scatter)
     ============================================================ */
  (function () {
    var el = document.getElementById('chartScatter');
    if (!el) return;
    function pointsFor(g) {
      return M.filter(function (r) { return r.zorluk === g; }).map(function (r) { return { x: r.m6, y: r.m4, level: r.level }; });
    }
    new Chart(el, {
      type: 'scatter',
      data: {
        datasets: [
          { label: 'Normal', data: pointsFor('Normal'), backgroundColor: rgba(C.moss, 0.85), pointRadius: 5, pointHoverRadius: 7 },
          { label: 'Hard', data: pointsFor('Hard'), backgroundColor: rgba(C.brass, 0.95), pointRadius: 6, pointHoverRadius: 8 },
          { label: 'Super Hard', data: pointsFor('Super Hard'), backgroundColor: rgba(C.danger, 0.95), pointRadius: 6, pointHoverRadius: 8 }
        ]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        layout: { padding: { right: 30, top: 6 } },
        scales: {
          x: {
            reverse: true, grid: { color: C.gridLine },
            title: { display: true, text: 'M6 — Renk Başına Manevra Alanı (azalan →)', font: { family: "'IBM Plex Mono', monospace", size: 10 } },
            ticks: { font: { family: "'IBM Plex Mono', monospace", size: 9 } }
          },
          y: {
            grid: { color: C.gridLine },
            title: { display: true, text: 'M4 — Toplam Gizli Bilgi Oranı', font: { family: "'IBM Plex Mono', monospace", size: 10 } },
            ticks: { font: { family: "'IBM Plex Mono', monospace", size: 9 } }
          }
        },
        plugins: {
          legend: { position: 'top', align: 'end' },
          pointLabels: { enabled: true },
          tooltip: { callbacks: { label: function (ctx) { return 'Level ' + ctx.raw.level + ' — M6: ' + fmt(ctx.raw.x, 2) + ', M4: ' + fmt(ctx.raw.y, 2); } } }
        }
      }
    });
  })();

  /* ============================================================
     10. Hero — şişe doluluk şeması (Level 1 / 19 / 25)
     ============================================================ */
  (function () {
    var mount = document.getElementById('bottleRacks');
    if (!mount) return;
    var picks = [1, 19, 25];
    var W = 16, H = 40, GAP = 4;

    function bottleSvg(row) {
      var n = row.sise;
      var width = n * W + (n - 1) * GAP;
      var svg = '<svg width="' + width + '" height="' + H + '" viewBox="0 0 ' + width + ' ' + H + '" role="img" aria-label="Level ' + row.level + ' şişe düzeni">';
      for (var i = 0; i < n; i++) {
        var x = i * (W + GAP);
        var isEmpty = i >= row.dolu;
        var fill = isEmpty ? 'none' : (row.zorluk === 'Super Hard' ? C.danger : (row.zorluk === 'Hard' ? C.brass : C.blue));
        var fillOpacity = isEmpty ? 0 : 0.85;
        svg += '<rect x="' + x + '" y="0" width="' + W + '" height="' + H + '" rx="4" ' +
          'fill="' + (isEmpty ? 'none' : fill) + '" fill-opacity="' + fillOpacity + '" ' +
          'stroke="' + (isEmpty ? C.gridLine : fill) + '" stroke-width="1.5"/>';
      }
      svg += '</svg>';
      return svg;
    }

    var html = picks.map(function (lv) {
      var row = M[lv - 1];
      var pct = Math.round(row.m2 * 100);
      return '<figure class="bottle-rack reveal">' +
        bottleSvg(row) +
        '<figcaption>Level ' + row.level + ' <span aria-hidden="true">·</span> ' + row.zorluk + '<br>' +
        '<strong>' + row.sise + '</strong> şişe, <strong>' + row.bos + '</strong> boş — %' + pct + ' dolu</figcaption>' +
        '</figure>';
    }).join('');
    mount.innerHTML = html;
  })();

  /* ============================================================
     11. Kayan / sürüklenebilir metrik sözlüğü widget'ı
     ============================================================ */
  (function () {
    var widget = document.getElementById('glossaryFloat');
    var handle = document.getElementById('glossaryHandle');
    var srcTable = document.getElementById('legendTable');
    var dstTable = document.getElementById('glossaryTable');
    if (!widget || !handle || !srcTable || !dstTable) return;

    dstTable.innerHTML = srcTable.innerHTML;

    var STORAGE_KEY = 'magicSortGlossaryState';
    function loadState() {
      try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}'); } catch (e) { return {}; }
    }
    function saveState(patch) {
      var st = loadState();
      for (var k in patch) st[k] = patch[k];
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(st)); } catch (e) {}
    }

    var state = loadState();
    if (typeof state.left === 'number' && typeof state.top === 'number') {
      widget.style.left = state.left + 'px';
      widget.style.top = state.top + 'px';
      widget.style.right = 'auto';
      widget.style.bottom = 'auto';
    }
    widget.classList.toggle('is-collapsed', state.collapsed !== false);

    function clampToViewport() {
      if (!widget.style.left) return;
      var maxX = window.innerWidth - widget.offsetWidth - 8;
      var maxY = window.innerHeight - widget.offsetHeight - 8;
      var x = Math.min(Math.max(8, parseFloat(widget.style.left)), Math.max(8, maxX));
      var y = Math.min(Math.max(8, parseFloat(widget.style.top)), Math.max(8, maxY));
      widget.style.left = x + 'px';
      widget.style.top = y + 'px';
    }
    window.addEventListener('resize', clampToViewport);

    var dragging = false, moved = false, startX = 0, startY = 0, offsetX = 0, offsetY = 0;
    handle.addEventListener('pointerdown', function (e) {
      dragging = true; moved = false;
      startX = e.clientX; startY = e.clientY;
      var rect = widget.getBoundingClientRect();
      offsetX = e.clientX - rect.left;
      offsetY = e.clientY - rect.top;
      widget.style.left = rect.left + 'px';
      widget.style.top = rect.top + 'px';
      widget.style.right = 'auto';
      widget.style.bottom = 'auto';
      widget.classList.add('is-dragging');
      handle.setPointerCapture(e.pointerId);
    });
    handle.addEventListener('pointermove', function (e) {
      if (!dragging) return;
      if (Math.abs(e.clientX - startX) > 4 || Math.abs(e.clientY - startY) > 4) moved = true;
      var maxX = window.innerWidth - widget.offsetWidth - 8;
      var maxY = window.innerHeight - widget.offsetHeight - 8;
      var x = Math.min(Math.max(8, e.clientX - offsetX), Math.max(8, maxX));
      var y = Math.min(Math.max(8, e.clientY - offsetY), Math.max(8, maxY));
      widget.style.left = x + 'px';
      widget.style.top = y + 'px';
    });
    function endDrag() {
      if (!dragging) return;
      dragging = false;
      widget.classList.remove('is-dragging');
      if (!moved) widget.classList.toggle('is-collapsed');
      saveState({
        left: parseFloat(widget.style.left),
        top: parseFloat(widget.style.top),
        collapsed: widget.classList.contains('is-collapsed')
      });
    }
    handle.addEventListener('pointerup', endDrag);
    handle.addEventListener('pointercancel', endDrag);

    var heroLegend = document.querySelector('.cs-hero .legend-card');
    if (heroLegend && 'IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            widget.classList.remove('is-shown');
          } else if (entry.boundingClientRect.top < 0) {
            widget.classList.add('is-shown');
          }
        });
      }, { threshold: 0 });
      io.observe(heroLegend);
    } else {
      widget.classList.add('is-shown');
    }
  })();

  /* ============================================================
     12. Scroll reveal (site genelindeki .reveal davranışıyla aynı)
     ============================================================ */
  (function () {
    var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var revealEls = document.querySelectorAll('.reveal');
    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
      revealEls.forEach(function (elx) { elx.classList.add('is-visible'); });
      return;
    }
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });
    revealEls.forEach(function (elx) { observer.observe(elx); });
  })();
})();
