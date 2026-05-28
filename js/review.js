/* ============================================================
   review.js — 審核介面
   ============================================================ */

const Review = (function () {
  'use strict';

  /* ---------- Mock Articles ---------- */
  const articles = [
    {
      id: 1,
      title: '公務人員退休資遣撫卹法修正草案預告——延後退休年齡至65歲',
      source: '銓敘部',
      date: '2024-12-15',
      score: 92,
      status: '待審核',
      excerpt: '銓敘部於今日預告「公務人員退休資遣撫卹法」修正草案，重點包括：將自願退休年齡由60歲延後至65歲、調整退休金計算基準、新增彈性退休機制，以因應高齡化社會之人力需求。',
      fullText: '銓敘部於今日預告「公務人員退休資遣撫卹法」修正草案，主要修正重點如下：\n\n一、自願退休年齡由現行60歲延後至65歲，分階段實施，每年延後1歲。\n二、月退休金計算基準由最後在職俸額調整為最後15年平均俸額。\n三、新增彈性退休機制，允許55歲以上公務人員申請減少工時之漸進式退休。\n四、強化退撫基金永續經營，調整提撥率上限。\n\n本修正草案預告期間為60日，歡迎各界提供意見。',
      aiSummary: '此修正草案為近年來最大規模的退休制度改革，將影響約34萬在職公務人員。延後退休年齡與調整計算基準為國際趨勢，但可能引發公務人員反彈。建議從「財政永續」與「人力活用」兩個角度深入分析。',
      relatedArticles: ['公務人員退撫基金精算報告', '日本延後退休年齡政策比較']
    },
    {
      id: 2,
      title: '考績法施行細則修正——強化績效管理與淘汰機制',
      source: '人事行政總處',
      date: '2024-12-14',
      score: 88,
      status: '待審核',
      excerpt: '行政院人事行政總處修正發布「公務人員考績法施行細則」，引入360度考核回饋機制、新增績效改善計畫（PIP），並明確考績丙等之具體認定標準。',
      fullText: '人事行政總處修正發布考績法施行細則重點：\n\n一、引入360度多元回饋機制，納入同僚與民眾評價。\n二、新增績效改善計畫（PIP），考列丙等前須給予6個月改善期。\n三、明確考績丙等認定標準，訂定具體量化指標。\n四、連續兩年考列丙等得予資遣或免職。',
      aiSummary: '此修正強化了公務人員績效管理的客觀性與程序正義。360度回饋與PIP制度借鏡企業管理實務，有助於提升政府效能。然而，具體量化指標之訂定需考量不同職系之差異性。',
      relatedArticles: ['各國公務員考績制度比較', '績效管理最佳實踐']
    },
    {
      id: 3,
      title: '高考三級考試增設「數位治理」類科——培育政府數位人才',
      source: '考試院',
      date: '2024-12-13',
      score: 85,
      status: '待審核',
      excerpt: '考試院通過修正「公務人員高等考試三級考試規則」，新增數位治理類科，考試科目包含資料科學、人工智慧政策、數位轉型管理等，預計自114年開始辦理。',
      fullText: '考試院通過修正高考三級考試規則重點：\n\n一、新增「數位治理」類科，歸類於一般行政職系。\n二、專業科目包含：資料科學概論、人工智慧政策與倫理、數位轉型管理、資訊安全與隱私保護。\n三、共同科目維持國文、法學知識與英文。\n四、預計每年錄取30-50人，分發至各機關資訊及數位治理相關單位。',
      aiSummary: '數位治理類科之增設反映政府對數位轉型人才之迫切需求。然而需注意：1.考試科目設計是否能有效鑑別數位治理能力；2.錄取者進入公務體系後之職涯發展路徑；3.與現有資訊處理類科之區隔與整合。',
      relatedArticles: ['各國政府數位人才政策', '公務員數位能力框架']
    },
    {
      id: 4,
      title: '行政院推動組織改造——精簡公務員編制釋放人力',
      source: '中央社',
      date: '2024-12-12',
      score: 78,
      status: '已通過',
      excerpt: '行政院宣布啟動新一輪組織改造計畫，將合併功能重疊之部會單位，精簡約5%公務員編制，並將釋放之人力轉用於數位治理、社會安全網等重點領域。',
      fullText: '行政院宣布啟動新一輪組織改造：\n\n一、合併功能重疊之次級機關與所屬機構。\n二、精簡約5%公務員編制（約1.7萬人），以自然減員及優退方式執行。\n三、釋放人力優先配置於數位治理、社會安全網、淨零碳排等重點領域。\n四、預計3年內完成第一階段改造。',
      aiSummary: '組織改造為提升政府效能之重要手段，但歷史經驗顯示執行難度高。需關注：1.精簡人力之配套措施；2.合併機關之文化整合；3.對基層公務人員士氣之影響。',
      relatedArticles: ['歷次行政院組織改造評析', '英國公務體系精簡經驗']
    },
    {
      id: 5,
      title: '公務員調薪方案拍板——明年全面加薪4%',
      source: '自由時報',
      date: '2024-12-11',
      score: 76,
      status: '已通過',
      excerpt: '行政院拍板114年度公務人員調薪方案，全面加薪4%，為近10年最大幅度調薪。軍公教待遇審議委員會指出，調薪係考量物價漲幅、民間薪資成長及政府財政狀況。',
      fullText: '行政院拍板114年度調薪方案重點：\n\n一、全體公務人員加薪4%，為近10年最大幅度。\n二、調薪自114年1月1日生效。\n三、預估增加政府人事費用約280億元。\n四、同步調整退休人員月退休金、公保養老給付等。',
      aiSummary: '4%調幅雖為近年最高，但考量近年物價累計漲幅，實質購買力增長有限。值得關注：1.與民間薪資差距變化；2.對政府財政之長期影響；3.公務人員招募競爭力。',
      relatedArticles: ['公務員薪資制度國際比較', '物價指數與公務員待遇']
    },
    {
      id: 6,
      title: '深化公務員分類改革實施方案公布——職位分類新框架',
      source: '國家公務員局',
      date: '2024-12-10',
      score: 73,
      status: '待審核',
      excerpt: '國家公務員局發布深化公務員分類改革實施方案，建立以職位分類為基礎的管理體系，明確綜合管理類、專業技術類、行政執法類之職責邊界與晉升通道。',
      fullText: '國家公務員局發布分類改革方案重點：\n\n一、明確三大類別（綜合管理、專業技術、行政執法）之職責邊界。\n二、建立各類別獨立之職務序列與晉升通道。\n三、專業技術類引入職稱評審制度。\n四、行政執法類強化執法資格認證。\n五、分3年推進實施。',
      aiSummary: '此改革方案為大陸公務員制度之重要變革，有助於解決「千軍萬馬過獨木橋」的晉升困境。可與台灣職系職等制度進行比較分析。',
      relatedArticles: ['中國大陸公務員制度沿革', '職位分類制度國際比較']
    },
    {
      id: 7,
      title: '公務人員保障法修正——強化申訴救濟程序',
      source: '保訓會',
      date: '2024-12-09',
      score: 70,
      status: '已拒絕',
      excerpt: '公務人員保障暨培訓委員會修正保障法，擴大保障範圍，強化申訴、再申訴及復審程序之時效與透明度，並引入調解機制以降低訟源。',
      fullText: '保訓會修正保障法重點：\n\n一、擴大保障範圍，納入約聘僱人員部分權益保障。\n二、縮短申訴及復審程序之審理期限。\n三、引入調解機制，於正式審議前提供調解選項。\n四、強化決定書之說理要求，提升透明度。',
      aiSummary: '保障法修正有助於完善公務人員權益救濟體系。引入調解機制為制度創新，可有效降低訟源。建議觀察實施後之調解成功率與公務人員滿意度。',
      relatedArticles: ['公務人員權益保障制度比較', '行政救濟制度改革']
    },
    {
      id: 8,
      title: '特種考試原住民族考試規則修正——放寬應考資格',
      source: '考試院',
      date: '2024-12-08',
      score: 60,
      status: '待審核',
      excerpt: '考試院修正「特種考試原住民族考試規則」，放寬部分類科之學歷限制，增設文化事務類科，以提升原住民族進入公務體系之管道。',
      fullText: '考試院修正原住民族考試規則重點：\n\n一、放寬三等考試部分類科學歷限制。\n二、新增「原住民族文化事務」類科。\n三、擴大五等考試錄取名額。\n四、強化族語加分機制。',
      aiSummary: '此修正有助於落實原住民族就業保障，但需注意與一般考試之公平性平衡問題。',
      relatedArticles: ['原住民族公務人員任用分析', '少數族群公務員政策']
    },
  ];

  let currentFilter = '全部';
  let selectedIds = new Set();

  /* ---------- Helpers ---------- */
  function statusBadge(status) {
    const map = {
      '待審核': 'badge-warning',
      '已通過': 'badge-success',
      '已拒絕': 'badge-danger',
    };
    return `<span class="badge ${map[status] || 'badge-muted'}">${status}</span>`;
  }

  function getFiltered() {
    if (currentFilter === '全部') return articles;
    return articles.filter(a => a.status === currentFilter);
  }

  /* ---------- Render ---------- */
  function render() {
    const container = document.getElementById('reviewContainer');
    if (!container) return;
    const filtered = getFiltered();

    container.innerHTML = `
      <!-- Filter Bar -->
      <div class="filter-bar">
        <select class="select" id="reviewStatusFilter" style="min-width:130px;">
          <option value="全部" ${currentFilter === '全部' ? 'selected' : ''}>全部 (${articles.length})</option>
          <option value="待審核" ${currentFilter === '待審核' ? 'selected' : ''}>待審核 (${articles.filter(a=>a.status==='待審核').length})</option>
          <option value="已通過" ${currentFilter === '已通過' ? 'selected' : ''}>已通過 (${articles.filter(a=>a.status==='已通過').length})</option>
          <option value="已拒絕" ${currentFilter === '已拒絕' ? 'selected' : ''}>已拒絕 (${articles.filter(a=>a.status==='已拒絕').length})</option>
        </select>
        <input type="text" class="input" placeholder="搜尋文章..." id="reviewSearch" style="max-width:240px;">
        <div style="flex:1;"></div>
        <span class="fs-xs text-muted">共 ${filtered.length} 篇文章</span>
      </div>

      <!-- Batch Actions -->
      <div class="flex items-center justify-between mb-4" id="batchBar" style="display:${selectedIds.size > 0 ? 'flex' : 'none'};">
        <span class="fs-sm text-secondary">已選取 <strong>${selectedIds.size}</strong> 篇</span>
        <div class="flex gap-2">
          <button class="btn btn-sm btn-success" id="batchApprove">✓ 批次通過</button>
          <button class="btn btn-sm btn-danger" id="batchReject">✗ 批次拒絕</button>
          <button class="btn btn-sm btn-ghost" id="batchClear">取消選取</button>
        </div>
      </div>

      <!-- Article List -->
      <div class="flex flex-col gap-4" id="articleList">
        ${filtered.map((a, i) => `
          <div class="article-card card-enter" style="animation-delay:${i * 60}ms;">
            <div class="flex items-center gap-3 mb-3">
              <label class="checkbox-label">
                <input type="checkbox" data-id="${a.id}" class="article-check" ${selectedIds.has(a.id) ? 'checked' : ''}>
              </label>
              <div class="article-title" data-id="${a.id}">${a.title}</div>
            </div>
            <div class="article-meta">
              <span>📰 ${a.source}</span>
              <span>📅 ${a.date}</span>
              <div class="flex items-center gap-2">
                <span>📊</span>
                <div class="article-score">
                  <div class="article-score-fill" style="width:${a.score}%;"></div>
                </div>
                <span>${a.score}</span>
              </div>
              ${statusBadge(a.status)}
            </div>
            <div class="article-excerpt">${a.excerpt}</div>
            <div class="article-actions">
              <button class="btn btn-sm btn-primary action-research" data-id="${a.id}">🔬 展開研究</button>
              <button class="btn btn-sm btn-ghost action-ignore" data-id="${a.id}">忽略</button>
              <button class="btn btn-sm btn-ghost action-later" data-id="${a.id}">稍後處理</button>
            </div>
          </div>
        `).join('')}
      </div>

      ${filtered.length === 0 ? `
        <div class="empty-state">
          <div class="empty-state-icon">📭</div>
          <div class="empty-state-title">沒有符合條件的文章</div>
          <div class="empty-state-desc">嘗試調整篩選條件或等待新的掃瞄結果</div>
        </div>
      ` : ''}

      <!-- Pagination -->
      <div class="pagination">
        <button class="pagination-btn">‹</button>
        <button class="pagination-btn active">1</button>
        <button class="pagination-btn">2</button>
        <button class="pagination-btn">3</button>
        <button class="pagination-btn">›</button>
      </div>
    `;

    bindEvents();
  }

  /* ---------- Events ---------- */
  function bindEvents() {
    /* Filter */
    const filter = document.getElementById('reviewStatusFilter');
    if (filter) {
      filter.addEventListener('change', () => {
        currentFilter = filter.value;
        selectedIds.clear();
        render();
      });
    }

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

    /* Batch actions */
    document.getElementById('batchApprove')?.addEventListener('click', () => {
      selectedIds.forEach(id => {
        const a = articles.find(x => x.id === id);
        if (a) a.status = '已通過';
      });
      selectedIds.clear();
      render();
      App.showToast('已批次通過所選文章', 'success');
    });
    document.getElementById('batchReject')?.addEventListener('click', () => {
      selectedIds.forEach(id => {
        const a = articles.find(x => x.id === id);
        if (a) a.status = '已拒絕';
      });
      selectedIds.clear();
      render();
      App.showToast('已批次拒絕所選文章', 'warning');
    });
    document.getElementById('batchClear')?.addEventListener('click', () => {
      selectedIds.clear();
      render();
    });

    /* Title click → modal */
    document.querySelectorAll('.article-title').forEach(el => {
      el.addEventListener('click', () => {
        const id = parseInt(el.dataset.id);
        showArticleDetail(id);
      });
    });

    /* Action buttons */
    document.querySelectorAll('.action-research').forEach(btn => {
      btn.addEventListener('click', () => {
        App.showToast('已開始深度研究', 'info');
        const a = articles.find(x => x.id === parseInt(btn.dataset.id));
        if (a) a.status = '已通過';
        render();
      });
    });
    document.querySelectorAll('.action-ignore').forEach(btn => {
      btn.addEventListener('click', () => {
        const a = articles.find(x => x.id === parseInt(btn.dataset.id));
        if (a) a.status = '已拒絕';
        render();
        App.showToast('文章已忽略', 'warning');
      });
    });
  }

  /* ---------- Article Detail Modal ---------- */
  function showArticleDetail(id) {
    const a = articles.find(x => x.id === id);
    if (!a) return;
    App.showModal(`
      <div class="modal-header">
        <h2>${a.title}</h2>
        <button class="modal-close" onclick="App.closeModal()">&times;</button>
      </div>
      <div class="modal-body">
        <div class="article-meta mb-4">
          <span>📰 ${a.source}</span>
          <span>📅 ${a.date}</span>
          <span>📊 相關度 ${a.score}</span>
          ${statusBadge(a.status)}
        </div>

        <h3 class="fs-base fw-600 mb-2">📄 全文</h3>
        <div class="fs-sm text-secondary mb-5" style="white-space:pre-line;line-height:1.8;">
          ${a.fullText}
        </div>

        <h3 class="fs-base fw-600 mb-2">🤖 AI 分析摘要</h3>
        <div class="p-4 mb-5" style="background:rgba(var(--primary-rgb),.06);border-radius:var(--radius-md);border:1px solid rgba(var(--primary-rgb),.15);">
          <div class="fs-sm text-secondary" style="line-height:1.8;">${a.aiSummary}</div>
        </div>

        <h3 class="fs-base fw-600 mb-2">🔗 相關文章</h3>
        <div class="flex flex-col gap-2 mb-4">
          ${a.relatedArticles.map(r => `
            <div class="tag tag-primary cursor-pointer">${r}</div>
          `).join('')}
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-secondary" onclick="App.closeModal()">關閉</button>
        <button class="btn btn-primary" onclick="App.showToast('已加入知識庫','success');App.closeModal();">📚 加入知識庫</button>
        <button class="btn btn-primary" onclick="App.showToast('評論編輯器即將推出','info');App.closeModal();">✍️ 開始撰寫評論</button>
      </div>
    `);
  }

  /* ---------- Init ---------- */
  function init() {
    render();
  }

  return { init };
})();
