/* ============================================================
   dashboard.js — 掃瞄監控面板
   ============================================================ */

const Dashboard = (function () {
  'use strict';

  /* ---------- Mock Data ---------- */
  const stats = [
    { id: 'scans',     label: '今日掃瞄', value: 247, icon: '📡', trend: '+18%',  up: true  },
    { id: 'pending',   label: '待處理',   value: 12,  icon: '⏳', trend: '-3',     up: false },
    { id: 'published', label: '已發布',   value: 38,  icon: '📤', trend: '+5',     up: true  },
    { id: 'knowledge', label: '知識條目', value: 1456,icon: '📚', trend: '+124',   up: true  },
  ];

  const scanResults = [
    { source: '銓敘部',         title: '公務人員退休資遣撫卹法修正草案預告',                time: '09:42', score: 92, status: '新發現' },
    { source: '人事行政總處',   title: '113年度公務人員考績法施行細則修正發布',              time: '09:38', score: 88, status: '新發現' },
    { source: '考試院',         title: '高考三級考試增設數位治理類科',                       time: '09:15', score: 85, status: '研究中' },
    { source: '中央社',         title: '行政院推動組織改造 精簡公務員編制',                  time: '08:50', score: 78, status: '已處理' },
    { source: '自由時報',       title: '公務員調薪方案拍板 明年加薪4%',                      time: '08:32', score: 76, status: '已處理' },
    { source: '國家公務員局',   title: '深化公務員分類改革實施方案公布',                     time: '08:10', score: 73, status: '新發現' },
    { source: '人力資源部',     title: '事業單位人事管理條例修訂徵求意見',                   time: '07:45', score: 68, status: '已忽略' },
    { source: 'OECD',           title: 'Public Employment and Management 2024 Report',      time: '07:20', score: 65, status: '已忽略' },
    { source: '銓敘部',         title: '公務人員俸給法修正重點說明',                         time: '06:55', score: 90, status: '研究中' },
    { source: '考試院',         title: '特種考試原住民族考試規則修正',                       time: '06:30', score: 60, status: '已處理' },
  ];

  const timelineItems = [
    { time: '09:42', text: '銓敘部 — 發現 3 篇高相關度新聞',             dot: ''        },
    { time: '09:38', text: '人事行政總處 — 考績法施行細則掃瞄完成',       dot: 'success' },
    { time: '09:15', text: '考試院 — 已啟動深度研究',                     dot: 'warning' },
    { time: '08:50', text: '中央社 — 組織改造新聞已歸檔',                 dot: 'success' },
    { time: '08:32', text: '自由時報 — 調薪方案新聞已處理',               dot: 'success' },
    { time: '08:10', text: '國家公務員局 — 發現新政策動態',               dot: ''        },
    { time: '07:45', text: '過濾引擎 — 已忽略 4 篇低相關度文章',          dot: 'danger'  },
    { time: '07:00', text: '排程器 — 定時掃瞄啟動 (第 5 輪)',             dot: ''        },
  ];

  const crawlers = [
    { name: '台灣政府機關', status: 'running', articles: 14 },
    { name: 'RSS 訂閱源',   status: 'running', articles: 8  },
    { name: '中國大陸來源', status: 'stopped', articles: 3  },
    { name: '國際來源',     status: 'stopped', articles: 0  },
  ];

  let scanning = true;

  /* ---------- Status badge helper ---------- */
  function statusBadge(status) {
    const map = {
      '新發現': 'badge-info',
      '已處理': 'badge-success',
      '已忽略': 'badge-muted',
      '研究中': 'badge-warning',
    };
    return `<span class="badge ${map[status] || 'badge-muted'}">${status}</span>`;
  }

  /* ---------- Render ---------- */
  function render() {
    const container = document.getElementById('dashboardContainer');
    if (!container) return;

    container.innerHTML = `
      <!-- Stats Row -->
      <div class="stats-row">
        ${stats.map((s, i) => `
          <div class="stat-card card-enter" style="position:relative;">
            <div class="stat-label">${s.label}</div>
            <div class="stat-value">${s.value.toLocaleString()}</div>
            <div class="stat-trend ${s.up ? 'up' : 'down'}">
              ${s.up ? '↑' : '↓'} ${s.trend}
            </div>
            <div class="stat-icon">${s.icon}</div>
          </div>
        `).join('')}
      </div>

      <div class="grid" style="grid-template-columns: 1fr 340px; gap: var(--sp-5);">
        <!-- Left: Table + Scanner -->
        <div class="flex flex-col gap-5">

          <!-- Recent Scans Table -->
          <div class="card">
            <div class="card-header">
              <h3>📋 最近掃瞄結果</h3>
              <span class="text-muted fs-xs" id="lastRefresh">最後更新：--:--:--</span>
            </div>
            <div class="card-body" style="padding:0;">
              <div class="table-container">
                <table class="table">
                  <thead>
                    <tr>
                      <th>來源</th>
                      <th>標題</th>
                      <th>時間</th>
                      <th>評分</th>
                      <th>狀態</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${scanResults.map(r => `
                      <tr>
                        <td>${r.source}</td>
                        <td class="truncate" style="max-width:320px;">${r.title}</td>
                        <td style="white-space:nowrap;">${r.time}</td>
                        <td>
                          <div class="flex items-center gap-2">
                            <div class="article-score" style="width:60px;">
                              <div class="article-score-fill" style="width:${r.score}%;"></div>
                            </div>
                            <span class="fs-xs text-muted">${r.score}</span>
                          </div>
                        </td>
                        <td>${statusBadge(r.status)}</td>
                      </tr>
                    `).join('')}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <!-- Scanner Status -->
          <div class="card">
            <div class="card-header">
              <h3>🕷️ 爬蟲狀態</h3>
              <div class="flex gap-2">
                <button class="btn btn-sm ${scanning ? 'btn-danger' : 'btn-primary'}" id="scanToggle">
                  ${scanning ? '⏹ 停止掃瞄' : '▶ 開始掃瞄'}
                </button>
              </div>
            </div>
            <div class="card-body">
              <div class="grid" style="grid-template-columns: repeat(2, 1fr); gap: var(--sp-4);">
                ${crawlers.map(c => `
                  <div class="flex items-center justify-between p-3" style="background:var(--bg-surface);border-radius:var(--radius-md);">
                    <div class="flex items-center gap-3">
                      <span class="status-dot ${c.status}"></span>
                      <div>
                        <div class="fs-sm fw-500 text-primary">${c.name}</div>
                        <div class="fs-xs text-muted">${c.articles} 篇文章</div>
                      </div>
                    </div>
                    <span class="badge ${c.status === 'running' ? 'badge-success' : 'badge-muted'}">
                      ${c.status === 'running' ? '運行中' : '已停止'}
                    </span>
                  </div>
                `).join('')}
              </div>
            </div>
          </div>
        </div>

        <!-- Right: Timeline -->
        <div class="card" style="align-self:start;">
          <div class="card-header">
            <h3>📊 活動時間線</h3>
          </div>
          <div class="card-body">
            <div class="timeline">
              ${timelineItems.map(t => `
                <div class="timeline-item">
                  <div class="timeline-dot ${t.dot}"></div>
                  <div class="timeline-time">${t.time}</div>
                  <div class="timeline-content">${t.text}</div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      </div>
    `;

    /* Bind scan toggle */
    const toggle = document.getElementById('scanToggle');
    if (toggle) {
      toggle.addEventListener('click', () => {
        scanning = !scanning;
        App.showToast(scanning ? '掃瞄已啟動' : '掃瞄已停止', scanning ? 'success' : 'warning');
        render();
      });
    }

    /* Auto-refresh timestamp */
    updateRefresh();
  }

  function updateRefresh() {
    const el = document.getElementById('lastRefresh');
    if (el) {
      const now = new Date();
      el.textContent = '最後更新：' + now.toLocaleTimeString('zh-TW');
    }
  }

  /* ---------- Init ---------- */
  function init() {
    render();
    /* Simulate auto-refresh */
    setInterval(updateRefresh, 30000);
  }

  return { init };
})();
