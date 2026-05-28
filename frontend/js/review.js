/* ============================================================
   review.js — 審核介面（含明確工作流程）
   ============================================================ */

const Review = (function () {
  'use strict';

  /* ---------- 工作流程定義 ---------- */
  const WORKFLOW = [
    { key: 'scan',    label: '掃瞄發現', icon: '📡' },
    { key: 'review',  label: '人工審核', icon: '👁️' },
    { key: 'research',label: '深度研究', icon: '🔬' },
    { key: 'analyze', label: 'AI 分析',  icon: '🤖' },
    { key: 'draft',   label: '撰寫評論', icon: '✍️' },
    { key: 'publish', label: '發布',     icon: '📤' },
  ];

  /* ---------- Mock Articles ---------- */
  const articles = [
    {
      id: 1, title: '公務人員退休資遣撫卹法修正草案預告——延後退休年齡至65歲',
      source: '銓敘部', date: '2024-12-15', score: 92, stage: 'review',
      excerpt: '銓敘部於今日預告「公務人員退休資遣撫卹法」修正草案，重點包括：將自願退休年齡由60歲延後至65歲、調整退休金計算基準、新增彈性退休機制。',
      fullText: '銓敘部於今日預告「公務人員退休資遣撫卹法」修正草案，主要修正重點如下：\n\n一、自願退休年齡由現行60歲延後至65歲，分階段實施。\n二、月退休金計算基準由最後在職俸額調整為最後15年平均俸額。\n三、新增彈性退休機制，允許55歲以上申請漸進式退休。\n四、強化退撫基金永續經營，調整提撥率上限。',
      aiSummary: '此修正草案為近年來最大規模的退休制度改革，將影響約34萬在職公務人員。建議從「財政永續」與「人力活用」兩個角度深入分析。',
      relatedArticles: ['公務人員退撫基金精算報告', '日本延後退休年齡政策比較'],
    },
    {
      id: 2, title: '考績法施行細則修正——強化績效管理與淘汰機制',
      source: '人事行政總處', date: '2024-12-14', score: 88, stage: 'review',
      excerpt: '行政院人事行政總處修正發布「公務人員考績法施行細則」，引入360度考核回饋機制、新增績效改善計畫（PIP），並明確考績丙等之具體認定標準。',
      fullText: '人事行政總處修正發布考績法施行細則重點：\n\n一、引入360度多元回饋機制，納入同僚與民眾評價。\n二、新增績效改善計畫（PIP），考列丙等前須給予6個月改善期。\n三、明確考績丙等認定標準，訂定具體量化指標。\n四、連續兩年考列丙等得予資遣或免職。',
      aiSummary: '此修正強化了績效管理的客觀性與程序正義。360度回饋與PIP制度借鏡企業管理實務，有助於提升政府效能。',
      relatedArticles: ['各國公務員考績制度比較', '績效管理最佳實踐'],
    },
    {
      id: 3, title: '高考三級考試增設「數位治理」類科',
      source: '考試院', date: '2024-12-13', score: 85, stage: 'research',
      excerpt: '考試院通過修正「公務人員高等考試三級考試規則」，新增數位治理類科，考試科目包含資料科學、人工智慧政策、數位轉型管理等。',
      fullText: '考試院通過修正高考三級考試規則重點：\n\n一、新增「數位治理」類科。\n二、專業科目包含：資料科學概論、AI政策與倫理、數位轉型管理、資安與隱私保護。\n三、預計每年錄取30-50人。',
      aiSummary: '數位治理類科反映政府對數位轉型人才之迫切需求。需注意考試科目設計是否能有效鑑別能力、錄取者之職涯發展路徑。',
      relatedArticles: ['各國政府數位人才政策', '公務員數位能力框架'],
    },
    {
      id: 4, title: '行政院推動組織改造——精簡公務員編制釋放人力',
      source: '中央社', date: '2024-12-12', score: 78, stage: 'analyze',
      excerpt: '行政院宣布啟動新一輪組織改造計畫，將合併功能重疊之部會單位，精簡約5%公務員編制，並將釋放之人力轉用於重點領域。',
      fullText: '行政院宣布啟動新一輪組織改造：\n\n一、合併功能重疊之次級機關。\n二、精簡約5%公務員編制（約1.7萬人）。\n三、釋放人力優先配置於數位治理、社會安全網等領域。',
      aiSummary: '組織改造為提升政府效能之重要手段，但歷史經驗顯示執行難度高。需關注精簡人力之配套措施及對基層士氣之影響。',
      relatedArticles: ['歷次行政院組織改造評析', '英國公務體系精簡經驗'],
    },
    {
      id: 5, title: '公務員調薪方案拍板——明年全面加薪4%',
      source: '自由時報', date: '2024-12-11', score: 76, stage: 'draft',
      excerpt: '行政院拍板114年度公務人員調薪方案，全面加薪4%，為近10年最大幅度調薪。',
      fullText: '行政院拍板114年度調薪方案重點：\n\n一、全體公務人員加薪4%。\n二、調薪自114年1月1日生效。\n三、預估增加政府人事費用約280億元。',
      aiSummary: '4%調幅雖為近年最高，但考量物價累計漲幅，實質購買力增長有限。值得關注與民間薪資差距變化。',
      relatedArticles: ['公務員薪資制度國際比較', '物價指數與公務員待遇'],
    },
    {
      id: 6, title: '深化公務員分類改革實施方案公布',
      source: '國家公務員局', date: '2024-12-10', score: 73, stage: 'review',
      excerpt: '國家公務員局發布深化公務員分類改革實施方案，建立以職位分類為基礎的管理體系。',
      fullText: '國家公務員局發布分類改革方案重點：\n\n一、明確三大類別之職責邊界。\n二、建立各類別獨立之晉升通道。\n三、分3年推進實施。',
      aiSummary: '此改革有助於解決「千軍萬馬過獨木橋」的晉升困境。可與台灣職系職等制度進行比較。',
      relatedArticles: ['中國大陸公務員制度沿革', '職位分類制度國際比較'],
    },
    {
      id: 7, title: '公務人員保障法修正——強化申訴救濟程序',
      source: '保訓會', date: '2024-12-09', score: 70, stage: 'publish',
      excerpt: '公務人員保障暨培訓委員會修正保障法，擴大保障範圍，強化申訴、再申訴及復審程序之時效與透明度。',
      fullText: '保訓會修正保障法重點：\n\n一、擴大保障範圍，納入約聘僱人員。\n二、引入調解機制。\n三、強化決定書之說理要求。',
      aiSummary: '保障法修正有助於完善權益救濟體系。引入調解機制為制度創新，可有效降低訟源。',
      relatedArticles: ['公務人員權益保障制度比較', '行政救濟制度改革'],
    },
    {
      id: 8, title: '特種考試原住民族考試規則修正——放寬應考資格',
      source: '考試院', date: '2024-12-08', score: 60, stage: 'scan',
      excerpt: '考試院修正「特種考試原住民族考試規則」，放寬部分類科之學歷限制，增設文化事務類科。',
      fullText: '考試院修正原住民族考試規則重點：\n\n一、放寬三等考試部分類科學歷限制。\n二、新增「原住民族文化事務」類科。\n三、強化族語加分機制。',
      aiSummary: '此修正有助於落實原住民族就業保障，但需注意與一般考試之公平性平衡問題。',
      relatedArticles: ['原住民族公務人員任用分析', '少數族群公務員政策'],
    },
  ];

  let currentFilter = '全部';
  let selectedIds = new Set();

  /* ---------- Helpers ---------- */
  function stageIndex(stage) { return WORKFLOW.findIndex(w => w.key === stage); }
  function stageLabel(stage) { return WORKFLOW.find(w => w.key === stage)?.label || stage; }
  function stageIcon(stage)  { return WORKFLOW.find(w => w.key === stage)?.icon || '❓'; }

  function stageBadge(stage) {
    const colors = { scan:'badge-muted', review:'badge-warning', research:'badge-info', analyze:'badge-primary', draft:'badge-success', publish:'badge-success' };
    return `<span class="badge ${colors[stage] || 'badge-muted'}">${stageIcon(stage)} ${stageLabel(stage)}</span>`;
  }

  /* Stage counts */
  function stageCounts() {
    const c = {};
    WORKFLOW.forEach(w => c[w.key] = 0);
    articles.forEach(a => { if (c[a.stage] !== undefined) c[a.stage]++; });
    return c;
  }

  function getFiltered() {
    if (currentFilter === '全部') return articles;
    return articles.filter(a => a.stage === currentFilter);
  }

  /* Mini workflow bar for each card */
  function miniWorkflow(stage) {
    const idx = stageIndex(stage);
    return `<div class="mini-workflow">${WORKFLOW.map((w, i) => {
      let cls = 'step-dot';
      if (i < idx) cls += ' done';
      else if (i === idx) cls += ' current';
      return `<div class="${cls}" title="${w.label}">${i <= idx ? w.icon : '○'}</div>${i < WORKFLOW.length-1 ? '<div class="step-line'+(i < idx ? ' done' : '')+'"></div>' : ''}`;
    }).join('')}</div>`;
  }

  /* Next action button text & style for each stage */
  function nextAction(stage) {
    const map = {
      scan:     { label: '👁️ 開始審核', next: 'review',   cls: 'btn-warning' },
      review:   { label: '🔬 進入研究', next: 'research', cls: 'btn-primary' },
      research: { label: '🤖 送交 AI 分析', next: 'analyze', cls: 'btn-primary' },
      analyze:  { label: '✍️ 撰寫評論', next: 'draft',    cls: 'btn-primary' },
      draft:    { label: '📤 發布評論', next: 'publish',  cls: 'btn-success' },
      publish:  { label: '✅ 已完成',   next: null,       cls: 'btn-ghost'   },
    };
    return map[stage] || map.scan;
  }

  /* ---------- Render ---------- */
  function render() {
    const container = document.getElementById('reviewContainer');
    if (!container) return;
    const filtered = getFiltered();
    const counts = stageCounts();

    container.innerHTML = `
      <!-- 全域流程概覽 -->
      <div class="workflow-overview card-enter">
        ${WORKFLOW.map((w, i) => `
          <div class="wo-step ${currentFilter === w.key ? 'active' : ''}" data-stage="${w.key}">
            <div class="wo-icon">${w.icon}</div>
            <div class="wo-label">${w.label}</div>
            <div class="wo-count">${counts[w.key]}</div>
          </div>
          ${i < WORKFLOW.length-1 ? '<div class="wo-arrow">→</div>' : ''}
        `).join('')}
        <div class="wo-step ${currentFilter === '全部' ? 'active' : ''}" data-stage="全部" style="margin-left:auto;">
          <div class="wo-icon">📋</div>
          <div class="wo-label">全部</div>
          <div class="wo-count">${articles.length}</div>
        </div>
      </div>

      <!-- Filter & Search -->
      <div class="filter-bar">
        <input type="text" class="input" placeholder="搜尋文章標題..." id="reviewSearch" style="max-width:280px;">
        <div style="flex:1;"></div>
        <span class="fs-xs text-muted">顯示 ${filtered.length} 篇文章</span>
      </div>

      <!-- Batch Actions -->
      <div class="flex items-center justify-between mb-4" id="batchBar" style="display:${selectedIds.size > 0 ? 'flex' : 'none'};">
        <span class="fs-sm text-secondary">已選取 <strong>${selectedIds.size}</strong> 篇</span>
        <div class="flex gap-2">
          <button class="btn btn-sm btn-primary" id="batchAdvance">⏩ 批次推進到下一階段</button>
          <button class="btn btn-sm btn-ghost" id="batchClear">取消選取</button>
        </div>
      </div>

      <!-- Article List -->
      <div class="flex flex-col gap-4" id="articleList">
        ${filtered.map((a, i) => {
          const na = nextAction(a.stage);
          return `
          <div class="article-card card-enter" style="animation-delay:${i * 60}ms;">
            <!-- 頂部：勾選 + 流程進度 -->
            ${miniWorkflow(a.stage)}

            <!-- 標題列 -->
            <div class="flex items-center gap-3 mt-3 mb-2">
              <label class="checkbox-label">
                <input type="checkbox" data-id="${a.id}" class="article-check" ${selectedIds.has(a.id) ? 'checked' : ''}>
              </label>
              <div class="article-title" data-id="${a.id}">${a.title}</div>
            </div>

            <!-- 中繼資訊 -->
            <div class="article-meta">
              <span>📰 ${a.source}</span>
              <span>📅 ${a.date}</span>
              <div class="flex items-center gap-2">
                <span>📊</span>
                <div class="article-score"><div class="article-score-fill" style="width:${a.score}%;"></div></div>
                <span>${a.score}</span>
              </div>
              ${stageBadge(a.stage)}
            </div>

            <!-- 摘要 -->
            <div class="article-excerpt">${a.excerpt}</div>

            <!-- 動作按鈕 — 根據當前階段顯示下一步 -->
            <div class="article-actions">
              <button class="btn btn-sm ${na.cls} action-next" data-id="${a.id}" data-next="${na.next || ''}" ${!na.next ? 'disabled' : ''}>
                ${na.label}
              </button>
              ${a.stage !== 'publish' ? `
                <button class="btn btn-sm btn-ghost action-skip" data-id="${a.id}" title="跳過此階段，直接推進兩步">⏭️ 跳過</button>
                <button class="btn btn-sm btn-ghost text-danger action-reject" data-id="${a.id}" title="退回到掃瞄階段">↩️ 退回</button>
              ` : `
                <span class="fs-xs text-success fw-600">🎉 流程完成</span>
              `}
              <button class="btn btn-sm btn-ghost action-detail" data-id="${a.id}" style="margin-left:auto;">📄 詳情</button>
            </div>
          </div>`;
        }).join('')}
      </div>

      ${filtered.length === 0 ? `
        <div class="empty-state">
          <div class="empty-state-icon">📭</div>
          <div class="empty-state-title">此階段沒有文章</div>
          <div class="empty-state-desc">點擊上方流程列切換階段篩選</div>
        </div>
      ` : ''}
    `;

    bindEvents();
  }

  /* ---------- Events ---------- */
  function bindEvents() {
    /* Workflow overview click to filter */
    document.querySelectorAll('.wo-step').forEach(el => {
      el.addEventListener('click', () => {
        currentFilter = el.dataset.stage;
        selectedIds.clear();
        render();
      });
    });

    /* Search */
    const search = document.getElementById('reviewSearch');
    if (search) {
      search.addEventListener('input', () => {
        const q = search.value.toLowerCase();
        document.querySelectorAll('.article-card').forEach(card => {
          const title = card.querySelector('.article-title')?.textContent.toLowerCase() || '';
          card.style.display = title.includes(q) ? '' : 'none';
        });
      });
    }

    /* Checkboxes */
    document.querySelectorAll('.article-check').forEach(cb => {
      cb.addEventListener('change', () => {
        const id = parseInt(cb.dataset.id);
        if (cb.checked) selectedIds.add(id); else selectedIds.delete(id);
        const bar = document.getElementById('batchBar');
        if (bar) bar.style.display = selectedIds.size > 0 ? 'flex' : 'none';
        const countEl = bar?.querySelector('strong');
        if (countEl) countEl.textContent = selectedIds.size;
      });
    });

    /* Batch advance */
    document.getElementById('batchAdvance')?.addEventListener('click', () => {
      let count = 0;
      selectedIds.forEach(id => {
        const a = articles.find(x => x.id === id);
        if (a) {
          const na = nextAction(a.stage);
          if (na.next) { a.stage = na.next; count++; }
        }
      });
      selectedIds.clear();
      render();
      App.showToast(`已推進 ${count} 篇文章到下一階段`, 'success');
    });

    document.getElementById('batchClear')?.addEventListener('click', () => {
      selectedIds.clear(); render();
    });

    /* Next action button */
    document.querySelectorAll('.action-next').forEach(btn => {
      btn.addEventListener('click', () => {
        const a = articles.find(x => x.id === parseInt(btn.dataset.id));
        const next = btn.dataset.next;
        if (a && next) {
          const fromLabel = stageLabel(a.stage);
          const toLabel = stageLabel(next);
          a.stage = next;
          render();
          App.showToast(`「${a.title.substring(0,12)}…」：${fromLabel} → ${toLabel}`, 'success');
        }
      });
    });

    /* Skip (advance 2 stages) */
    document.querySelectorAll('.action-skip').forEach(btn => {
      btn.addEventListener('click', () => {
        const a = articles.find(x => x.id === parseInt(btn.dataset.id));
        if (!a) return;
        const idx = stageIndex(a.stage);
        const jumpTo = Math.min(idx + 2, WORKFLOW.length - 1);
        const toLabel = WORKFLOW[jumpTo].label;
        a.stage = WORKFLOW[jumpTo].key;
        render();
        App.showToast(`已跳過，直接進入「${toLabel}」`, 'info');
      });
    });

    /* Reject (back to scan) */
    document.querySelectorAll('.action-reject').forEach(btn => {
      btn.addEventListener('click', () => {
        const a = articles.find(x => x.id === parseInt(btn.dataset.id));
        if (a) {
          a.stage = 'scan';
          render();
          App.showToast('已退回到掃瞄階段', 'warning');
        }
      });
    });

    /* Title click / detail btn → modal */
    document.querySelectorAll('.article-title, .action-detail').forEach(el => {
      el.addEventListener('click', () => {
        showArticleDetail(parseInt(el.dataset.id));
      });
    });
  }

  /* ---------- Article Detail Modal ---------- */
  function showArticleDetail(id) {
    const a = articles.find(x => x.id === id);
    if (!a) return;
    const na = nextAction(a.stage);
    const idx = stageIndex(a.stage);

    App.showModal(`
      <div class="modal-header">
        <h2 style="font-size:var(--text-base);">${a.title}</h2>
        <button class="modal-close" onclick="App.closeModal()">&times;</button>
      </div>
      <div class="modal-body">
        <!-- 流程進度（大版） -->
        <div class="modal-workflow">
          ${WORKFLOW.map((w, i) => {
            let cls = 'mw-step';
            if (i < idx) cls += ' done';
            else if (i === idx) cls += ' current';
            return `<div class="${cls}">
              <div class="mw-dot">${i <= idx ? '✓' : (i === idx + 1 ? '▶' : '')}</div>
              <div class="mw-label">${w.icon} ${w.label}</div>
            </div>${i < WORKFLOW.length-1 ? '<div class="mw-line'+(i < idx ? ' done' : '')+'"></div>' : ''}`;
          }).join('')}
        </div>

        <div class="article-meta mb-4" style="margin-top:var(--sp-4);">
          <span>📰 ${a.source}</span>
          <span>📅 ${a.date}</span>
          <span>📊 相關度 ${a.score}</span>
          ${stageBadge(a.stage)}
        </div>

        <h3 class="fs-sm fw-700 mb-2">📄 全文內容</h3>
        <div class="fs-sm text-secondary mb-4" style="white-space:pre-line;line-height:1.8;background:var(--bg-surface-alt);padding:var(--sp-4);border-radius:var(--radius-md);">
${a.fullText}
        </div>

        <h3 class="fs-sm fw-700 mb-2">🤖 AI 分析摘要</h3>
        <div class="p-4 mb-4" style="background:var(--primary-light);border-radius:var(--radius-md);border:1px solid rgba(var(--primary-rgb),.15);">
          <div class="fs-sm text-secondary" style="line-height:1.8;">${a.aiSummary}</div>
        </div>

        <h3 class="fs-sm fw-700 mb-2">🔗 相關文章</h3>
        <div class="flex flex-wrap gap-2 mb-4">
          ${a.relatedArticles.map(r => `<span class="tag tag-primary">${r}</span>`).join('')}
        </div>
      </div>
      <div class="modal-footer" style="flex-wrap:wrap;gap:var(--sp-2);">
        <button class="btn btn-secondary btn-sm" onclick="App.closeModal()">關閉</button>
        <button class="btn btn-sm btn-ghost text-danger" onclick="Review.setStage(${a.id},'scan');App.closeModal();">↩️ 退回</button>
        <div style="flex:1;"></div>
        ${na.next ? `
          <button class="btn btn-sm ${na.cls}" onclick="Review.setStage(${a.id},'${na.next}');App.closeModal();">
            ${na.label}
          </button>
        ` : `<span class="fs-sm text-success fw-700">🎉 已完成全部流程</span>`}
      </div>
    `);
  }

  /* ---------- Public: set stage ---------- */
  function setStage(id, stage) {
    const a = articles.find(x => x.id === id);
    if (a) {
      const from = stageLabel(a.stage);
      a.stage = stage;
      render();
      App.showToast(`${from} → ${stageLabel(stage)}`, 'success');
    }
  }

  /* ---------- Init ---------- */
  function init() { render(); }

  return { init, setStage };
})();
