/* ============================================================
   knowledge.js — 知識庫瀏覽
   ============================================================ */

const Knowledge = (function () {
  'use strict';

  /* ---------- Mock Data ---------- */
  const entries = [
    {
      id: 1, type: '法規',
      title: '公務人員退休資遣撫卹法',
      summary: '規範公務人員退休、資遣及撫卹事項之專法，2023年7月1日施行。涵蓋退休條件、退休金種類及計算、撫卹金給與、退撫基金管理等。',
      tags: ['退休', '法規', '退撫'],
      source: '全國法規資料庫',
      date: '2024-12-15',
    },
    {
      id: 2, type: '新聞',
      title: '行政院拍板114年公務人員調薪4%',
      summary: '行政院軍公教待遇審議委員會決議114年全面調薪4%，為近10年最大幅度。預估增加政府人事費約280億元，調薪自1月1日生效。',
      tags: ['調薪', '待遇', '俸給'],
      source: '中央社',
      date: '2024-12-11',
    },
    {
      id: 3, type: '文獻',
      title: 'OECD Public Employment and Management 2024',
      summary: 'OECD年度報告分析38個會員國公務員制度，重點包含：數位技能缺口、彈性工作制度、績效管理改革、高齡化人力對策。',
      tags: ['OECD', '國際比較', '年度報告'],
      source: 'OECD Publishing',
      date: '2024-11-20',
    },
    {
      id: 4, type: '評論',
      title: '公務員退休年齡延後之利弊分析',
      summary: '本文從財政永續、人力活用、世代正義三個面向分析延後退休年齡之影響，並比較日本、韓國、新加坡之改革經驗，提出漸進式延後退休之政策建議。',
      tags: ['退休', '政策分析', '延後退休'],
      source: '系統生成評論',
      date: '2024-12-14',
    },
    {
      id: 5, type: '法規',
      title: '公務人員考績法',
      summary: '規範公務人員年終考績及專案考績之法律依據，包含考績等次（甲乙丙丁）、考核程序、獎懲規定、考績委員會組成等。',
      tags: ['考績', '法規', '績效'],
      source: '全國法規資料庫',
      date: '2024-10-05',
    },
    {
      id: 6, type: '新聞',
      title: '考試院通過高考增設數位治理類科',
      summary: '考試院通過修正高考三級考試規則，新增數位治理類科。考試科目包含資料科學、AI政策、數位轉型管理、資安隱私，預計114年開始辦理。',
      tags: ['考試', '數位治理', '新類科'],
      source: '考試院',
      date: '2024-12-13',
    },
    {
      id: 7, type: '文獻',
      title: '公務人員職系職組改革之研究',
      summary: '本研究分析我國現行職組職系制度之問題，比較各國職位分類制度，提出「大職系」改革方案，簡化分類架構以利人力調配。',
      tags: ['職系', '分類制度', '學術研究'],
      source: '考銓季刊',
      date: '2024-09-15',
    },
    {
      id: 8, type: '評論',
      title: '數位時代的公務人力轉型策略',
      summary: '探討數位轉型對公務人力之衝擊與因應策略，涵蓋AI對行政工作之替代效應、數位技能培訓需求、組織結構調整、新型人才招募管道等面向。',
      tags: ['數位轉型', 'AI', '人力轉型'],
      source: '系統生成評論',
      date: '2024-12-08',
    },
    {
      id: 9, type: '新聞',
      title: '深化公務員分類改革方案公布',
      summary: '國家公務員局發布深化分類改革方案，明確綜合管理、專業技術、行政執法三類職責邊界，建立獨立晉升通道，分3年推進實施。',
      tags: ['分類改革', '中國大陸', '職位分類'],
      source: '國家公務員局',
      date: '2024-12-10',
    },
    {
      id: 10, type: '文獻',
      title: '日本國家公務員制度改革白皮書',
      summary: '日本人事院發布年度白皮書，重點報告國家公務員之錄用狀況、任職環境改善、工作方式改革、國際人才交流等議題。',
      tags: ['日本', '國際比較', '白皮書'],
      source: '日本人事院',
      date: '2024-08-30',
    },
  ];

  const categories = [
    { key: '全部', label: '全部', icon: '📋' },
    { key: '新聞', label: '新聞報導', icon: '📰' },
    { key: '文獻', label: '學術文獻', icon: '📚' },
    { key: '評論', label: '政策評論', icon: '✍️' },
    { key: '法規', label: '法規條文', icon: '⚖️' },
  ];

  let currentCategory = '全部';
  let searchQuery = '';

  /* ---------- Type badge ---------- */
  function typeBadge(type) {
    const map = {
      '新聞': 'badge-info',
      '文獻': 'badge-primary',
      '評論': 'badge-warning',
      '法規': 'badge-success',
    };
    return `<span class="badge ${map[type] || 'badge-muted'}">${type}</span>`;
  }

  /* ---------- Filter ---------- */
  function getFiltered() {
    let result = entries;
    if (currentCategory !== '全部') {
      result = result.filter(e => e.type === currentCategory);
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(e =>
        e.title.toLowerCase().includes(q) ||
        e.summary.toLowerCase().includes(q) ||
        e.tags.some(t => t.toLowerCase().includes(q))
      );
    }
    return result;
  }

  /* ---------- Stats ---------- */
  function getStats() {
    return {
      total: entries.length,
      news: entries.filter(e => e.type === '新聞').length,
      literature: entries.filter(e => e.type === '文獻').length,
      commentary: entries.filter(e => e.type === '評論').length,
      regulation: entries.filter(e => e.type === '法規').length,
    };
  }

  /* ---------- Render ---------- */
  function render() {
    const container = document.getElementById('knowledgeContainer');
    if (!container) return;
    const filtered = getFiltered();
    const st = getStats();

    container.innerHTML = `
      <div class="grid" style="grid-template-columns: 240px 1fr; gap: var(--sp-5);">

        <!-- Left: Category filter + Stats -->
        <div class="flex flex-col gap-5">
          <!-- Categories -->
          <div class="card">
            <div class="card-header"><h3>📂 分類</h3></div>
            <div class="card-body" style="padding:var(--sp-2) var(--sp-3);">
              ${categories.map(c => `
                <div class="nav-item ${currentCategory === c.key ? 'active' : ''} kb-category" data-cat="${c.key}" style="border-left-width:3px;">
                  <span class="nav-icon">${c.icon}</span>
                  <span class="nav-text">${c.label}</span>
                  <span class="badge badge-muted" style="margin-left:auto;">
                    ${c.key === '全部' ? entries.length : entries.filter(e => e.type === c.key).length}
                  </span>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Stats -->
          <div class="card">
            <div class="card-header"><h3>📊 統計</h3></div>
            <div class="card-body">
              <div class="flex flex-col gap-3">
                <div class="flex justify-between">
                  <span class="fs-sm text-secondary">總條目</span>
                  <span class="fs-sm fw-600">${st.total}</span>
                </div>
                <div class="flex justify-between">
                  <span class="fs-sm text-secondary">📰 新聞</span>
                  <span class="fs-sm fw-600">${st.news}</span>
                </div>
                <div class="flex justify-between">
                  <span class="fs-sm text-secondary">📚 文獻</span>
                  <span class="fs-sm fw-600">${st.literature}</span>
                </div>
                <div class="flex justify-between">
                  <span class="fs-sm text-secondary">✍️ 評論</span>
                  <span class="fs-sm fw-600">${st.commentary}</span>
                </div>
                <div class="flex justify-between">
                  <span class="fs-sm text-secondary">⚖️ 法規</span>
                  <span class="fs-sm fw-600">${st.regulation}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right: Search + Results -->
        <div>
          <!-- Search bar -->
          <div class="filter-bar mb-5">
            <div class="search-box" style="flex:1;">
              <svg class="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              <input type="text" placeholder="搜尋知識庫..." id="kbSearch" value="${searchQuery}" style="width:100%;">
            </div>
          </div>

          <!-- Results -->
          <div class="flex flex-col gap-4" id="kbResults">
            ${filtered.map((e, i) => `
              <div class="knowledge-card card-enter" style="animation-delay:${i * 50}ms;">
                <div class="flex items-center justify-between mb-2">
                  <div class="flex items-center gap-3">
                    ${typeBadge(e.type)}
                    <span class="fs-xs text-muted">${e.date}</span>
                  </div>
                  <span class="fs-xs text-muted">${e.source}</span>
                </div>
                <div class="article-title kb-title" data-id="${e.id}" style="font-size:var(--text-base);margin-bottom:var(--sp-2);">
                  ${e.title}
                </div>
                <div class="fs-sm text-secondary line-clamp-2 mb-3" style="line-height:1.7;">
                  ${e.summary}
                </div>
                <div class="flex items-center justify-between">
                  <div class="flex flex-wrap gap-2">
                    ${e.tags.map(t => `<span class="tag">${t}</span>`).join('')}
                  </div>
                  <button class="btn btn-sm btn-ghost kb-detail" data-id="${e.id}">查看詳情 →</button>
                </div>
              </div>
            `).join('')}
          </div>

          ${filtered.length === 0 ? `
            <div class="empty-state">
              <div class="empty-state-icon">🔍</div>
              <div class="empty-state-title">未找到相關知識條目</div>
              <div class="empty-state-desc">嘗試不同的搜尋關鍵詞或分類篩選</div>
            </div>
          ` : ''}
        </div>
      </div>
    `;

    bindEvents();
  }

  /* ---------- Events ---------- */
  function bindEvents() {
    /* Category clicks */
    document.querySelectorAll('.kb-category').forEach(el => {
      el.addEventListener('click', () => {
        currentCategory = el.dataset.cat;
        render();
      });
    });

    /* Search */
    const search = document.getElementById('kbSearch');
    if (search) {
      search.addEventListener('input', () => {
        searchQuery = search.value;
        /* Re-render results only */
        const filtered = getFiltered();
        const resultsContainer = document.getElementById('kbResults');
        if (resultsContainer) {
          resultsContainer.innerHTML = filtered.map((e, i) => `
            <div class="knowledge-card card-enter" style="animation-delay:${i * 50}ms;">
              <div class="flex items-center justify-between mb-2">
                <div class="flex items-center gap-3">
                  ${typeBadge(e.type)}
                  <span class="fs-xs text-muted">${e.date}</span>
                </div>
                <span class="fs-xs text-muted">${e.source}</span>
              </div>
              <div class="article-title kb-title" data-id="${e.id}" style="font-size:var(--text-base);margin-bottom:var(--sp-2);">
                ${e.title}
              </div>
              <div class="fs-sm text-secondary line-clamp-2 mb-3" style="line-height:1.7;">
                ${e.summary}
              </div>
              <div class="flex items-center justify-between">
                <div class="flex flex-wrap gap-2">
                  ${e.tags.map(t => `<span class="tag">${t}</span>`).join('')}
                </div>
                <button class="btn btn-sm btn-ghost kb-detail" data-id="${e.id}">查看詳情 →</button>
              </div>
            </div>
          `).join('');

          /* Re-bind detail events */
          resultsContainer.querySelectorAll('.kb-detail, .kb-title').forEach(el => {
            el.addEventListener('click', () => showDetail(parseInt(el.dataset.id)));
          });
        }
      });
    }

    /* Detail click */
    document.querySelectorAll('.kb-detail, .kb-title').forEach(el => {
      el.addEventListener('click', () => showDetail(parseInt(el.dataset.id)));
    });
  }

  /* ---------- Detail Modal ---------- */
  function showDetail(id) {
    const e = entries.find(x => x.id === id);
    if (!e) return;

    App.showModal(`
      <div class="modal-header">
        <h2>${e.title}</h2>
        <button class="modal-close" onclick="App.closeModal()">&times;</button>
      </div>
      <div class="modal-body">
        <div class="flex items-center gap-3 mb-4">
          ${typeBadge(e.type)}
          <span class="fs-xs text-muted">📅 ${e.date}</span>
          <span class="fs-xs text-muted">📰 ${e.source}</span>
        </div>
        <div class="fs-sm text-secondary mb-5" style="line-height:1.8;">
          ${e.summary}
        </div>
        <div class="flex flex-wrap gap-2 mb-4">
          ${e.tags.map(t => `<span class="tag tag-primary">${t}</span>`).join('')}
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-secondary" onclick="App.closeModal()">關閉</button>
        <button class="btn btn-primary" onclick="App.showToast('評論編輯器即將推出','info');App.closeModal();">✍️ 撰寫評論</button>
      </div>
    `);
  }

  /* ---------- Init ---------- */
  function init() {
    render();
  }

  return { init };
})();
