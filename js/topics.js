/* ============================================================
   topics.js — 議題管理
   ============================================================ */

const Topics = (function () {
  'use strict';

  /* ---------- Mock Data ---------- */
  let topics = [
    {
      id: 1,
      name: '公務員退休制度改革',
      description: '追蹤各國公務員退休制度之改革動態，包含退休年齡、退休金計算方式、退撫基金永續經營等議題。',
      keywords: ['退休', '退撫', '年金', '退休年齡', '養老'],
      articleCount: 42,
      lastUpdated: '2024-12-15',
      priority: '高',
      active: true
    },
    {
      id: 2,
      name: '考績制度改革',
      description: '關注公務員考績制度之改革方向，包含績效管理方法、考核標準客觀化、淘汰機制等。',
      keywords: ['考績', '績效', '考核', 'KPI', '淘汰'],
      articleCount: 28,
      lastUpdated: '2024-12-14',
      priority: '高',
      active: true
    },
    {
      id: 3,
      name: '公務員培訓制度',
      description: '追蹤公務員培訓體系變革，包含數位能力培訓、領導力發展、在職進修制度等。',
      keywords: ['培訓', '訓練', '進修', '學習', '能力發展'],
      articleCount: 19,
      lastUpdated: '2024-12-10',
      priority: '中',
      active: true
    },
    {
      id: 4,
      name: '組織改造',
      description: '追蹤政府組織改造動態，包含部會合併、功能調整、人力配置優化等。',
      keywords: ['組織改造', '機關整併', '組織調整', '功能移轉'],
      articleCount: 15,
      lastUpdated: '2024-12-12',
      priority: '中',
      active: true
    },
    {
      id: 5,
      name: '數位轉型人力',
      description: '關注政府數位轉型所需人力政策，包含數位人才招募、AI治理、資料治理人力等。',
      keywords: ['數位轉型', 'AI', '資訊人才', '數位治理', '智慧政府'],
      articleCount: 23,
      lastUpdated: '2024-12-13',
      priority: '高',
      active: true
    },
    {
      id: 6,
      name: '國際公務員制度比較',
      description: '比較分析各國公務員制度之異同，包含任用、俸給、退休、考績等面向之國際趨勢。',
      keywords: ['國際比較', 'OECD', '各國制度', '最佳實踐'],
      articleCount: 8,
      lastUpdated: '2024-12-08',
      priority: '低',
      active: false
    },
  ];

  let nextId = 7;

  /* ---------- Priority badge ---------- */
  function priorityBadge(priority) {
    const map = { '高': 'badge-danger', '中': 'badge-warning', '低': 'badge-info' };
    return `<span class="badge ${map[priority] || 'badge-muted'}">${priority}</span>`;
  }

  /* ---------- Render ---------- */
  function render() {
    const container = document.getElementById('topicsContainer');
    if (!container) return;

    container.innerHTML = `
      <div class="flex items-center justify-between mb-5">
        <div class="flex items-center gap-3">
          <span class="fs-sm text-muted">共 ${topics.length} 個議題</span>
          <span class="fs-sm text-muted">•</span>
          <span class="fs-sm text-success">${topics.filter(t => t.active).length} 個啟用中</span>
        </div>
        <button class="btn btn-primary" id="addTopicBtn">＋ 新增議題</button>
      </div>

      <div class="grid grid-3">
        ${topics.map((t, i) => `
          <div class="card topic-card card-enter" style="animation-delay:${i * 60}ms;opacity:${t.active ? '1' : '.6'};">
            <div class="card-header">
              <div class="flex items-center gap-2">
                <span style="font-size:1.2rem;">${t.active ? '📌' : '📎'}</span>
                <h3 class="fs-base fw-600" style="margin:0;">${t.name}</h3>
              </div>
              ${priorityBadge(t.priority)}
            </div>
            <div class="card-body">
              <div class="fs-sm text-secondary line-clamp-2 mb-3">${t.description}</div>
              <div class="topic-keywords mb-3">
                ${t.keywords.map(k => `<span class="tag tag-primary">${k}</span>`).join('')}
              </div>
              <div class="topic-stats">
                <span>📄 ${t.articleCount} 篇文章</span>
                <span>🕐 ${t.lastUpdated}</span>
              </div>
            </div>
            <div class="card-footer">
              <label class="toggle-switch" title="${t.active ? '停用' : '啟用'}">
                <input type="checkbox" class="topic-toggle" data-id="${t.id}" ${t.active ? 'checked' : ''}>
                <span class="toggle-slider"></span>
              </label>
              <button class="btn btn-sm btn-ghost topic-edit" data-id="${t.id}">✏️ 編輯</button>
              <button class="btn btn-sm btn-ghost text-danger topic-delete" data-id="${t.id}">🗑️</button>
            </div>
          </div>
        `).join('')}
      </div>
    `;

    bindEvents();
  }

  /* ---------- Events ---------- */
  function bindEvents() {
    /* Add topic */
    document.getElementById('addTopicBtn')?.addEventListener('click', () => showTopicModal());

    /* Toggle */
    document.querySelectorAll('.topic-toggle').forEach(cb => {
      cb.addEventListener('change', () => {
        const t = topics.find(x => x.id === parseInt(cb.dataset.id));
        if (t) {
          t.active = cb.checked;
          render();
          App.showToast(`議題「${t.name}」已${t.active ? '啟用' : '停用'}`, t.active ? 'success' : 'warning');
        }
      });
    });

    /* Edit */
    document.querySelectorAll('.topic-edit').forEach(btn => {
      btn.addEventListener('click', () => {
        const t = topics.find(x => x.id === parseInt(btn.dataset.id));
        if (t) showTopicModal(t);
      });
    });

    /* Delete */
    document.querySelectorAll('.topic-delete').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = parseInt(btn.dataset.id);
        const t = topics.find(x => x.id === id);
        if (t && confirm(`確定要刪除議題「${t.name}」嗎？`)) {
          topics = topics.filter(x => x.id !== id);
          render();
          App.showToast('議題已刪除', 'danger');
        }
      });
    });
  }

  /* ---------- Topic Modal ---------- */
  function showTopicModal(existing) {
    const isEdit = !!existing;
    const t = existing || { name: '', description: '', keywords: [], priority: '中' };

    App.showModal(`
      <div class="modal-header">
        <h2>${isEdit ? '✏️ 編輯議題' : '📌 新增議題'}</h2>
        <button class="modal-close" onclick="App.closeModal()">&times;</button>
      </div>
      <div class="modal-body">
        <div class="mb-4">
          <label class="fs-sm fw-500 text-primary mb-1" style="display:block;">議題名稱</label>
          <input type="text" class="input" id="topicNameInput" value="${t.name}" placeholder="輸入議題名稱...">
        </div>
        <div class="mb-4">
          <label class="fs-sm fw-500 text-primary mb-1" style="display:block;">描述</label>
          <textarea class="textarea" id="topicDescInput" placeholder="描述此議題的追蹤範圍...">${t.description}</textarea>
        </div>
        <div class="mb-4">
          <label class="fs-sm fw-500 text-primary mb-1" style="display:block;">關鍵詞</label>
          <div class="flex flex-wrap gap-2 mb-2" id="keywordTags">
            ${t.keywords.map(k => `
              <span class="tag tag-primary tag-removable">
                ${k}<button class="tag-remove" data-kw="${k}">&times;</button>
              </span>
            `).join('')}
          </div>
          <div class="flex gap-2">
            <input type="text" class="input" id="keywordInput" placeholder="輸入關鍵詞後按 Enter..." style="flex:1;">
            <button class="btn btn-sm btn-secondary" id="addKeywordBtn">新增</button>
          </div>
        </div>
        <div class="mb-4">
          <label class="fs-sm fw-500 text-primary mb-1" style="display:block;">優先等級</label>
          <select class="select" id="topicPriorityInput">
            <option value="高" ${t.priority === '高' ? 'selected' : ''}>高</option>
            <option value="中" ${t.priority === '中' ? 'selected' : ''}>中</option>
            <option value="低" ${t.priority === '低' ? 'selected' : ''}>低</option>
          </select>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-secondary" onclick="App.closeModal()">取消</button>
        <button class="btn btn-primary" id="saveTopicBtn">${isEdit ? '儲存變更' : '建立議題'}</button>
      </div>
    `);

    /* Keyword management */
    let keywords = [...t.keywords];

    function refreshKeywords() {
      const container = document.getElementById('keywordTags');
      if (!container) return;
      container.innerHTML = keywords.map(k => `
        <span class="tag tag-primary tag-removable">
          ${k}<button class="tag-remove" data-kw="${k}">&times;</button>
        </span>
      `).join('');
      container.querySelectorAll('.tag-remove').forEach(btn => {
        btn.addEventListener('click', () => {
          keywords = keywords.filter(x => x !== btn.dataset.kw);
          refreshKeywords();
        });
      });
    }

    function addKeyword() {
      const input = document.getElementById('keywordInput');
      const kw = input?.value.trim();
      if (kw && !keywords.includes(kw)) {
        keywords.push(kw);
        refreshKeywords();
        if (input) input.value = '';
      }
    }

    /* Bind keyword events after a tick */
    setTimeout(() => {
      document.querySelectorAll('.tag-remove').forEach(btn => {
        btn.addEventListener('click', () => {
          keywords = keywords.filter(x => x !== btn.dataset.kw);
          refreshKeywords();
        });
      });

      document.getElementById('addKeywordBtn')?.addEventListener('click', addKeyword);
      document.getElementById('keywordInput')?.addEventListener('keydown', e => {
        if (e.key === 'Enter') { e.preventDefault(); addKeyword(); }
      });

      /* Save */
      document.getElementById('saveTopicBtn')?.addEventListener('click', () => {
        const name = document.getElementById('topicNameInput')?.value.trim();
        const desc = document.getElementById('topicDescInput')?.value.trim();
        const priority = document.getElementById('topicPriorityInput')?.value;

        if (!name) { App.showToast('請輸入議題名稱', 'danger'); return; }

        if (isEdit) {
          existing.name = name;
          existing.description = desc;
          existing.keywords = keywords;
          existing.priority = priority;
          App.showToast('議題已更新', 'success');
        } else {
          topics.push({
            id: nextId++,
            name,
            description: desc,
            keywords,
            articleCount: 0,
            lastUpdated: new Date().toISOString().slice(0, 10),
            priority,
            active: true
          });
          App.showToast('新議題已建立', 'success');
        }

        App.closeModal();
        render();
      });
    }, 50);
  }

  /* ---------- Init ---------- */
  function init() {
    render();
  }

  return { init };
})();
