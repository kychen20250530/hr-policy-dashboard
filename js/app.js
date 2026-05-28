/* ============================================================
   app.js — Main Application Controller
   公務人事政策評論系統
   ============================================================ */

const App = (function () {
  'use strict';

  /* ---------- Event Bus ---------- */
  const _listeners = {};
  const EventBus = {
    on(event, fn) {
      (_listeners[event] = _listeners[event] || []).push(fn);
    },
    off(event, fn) {
      if (!_listeners[event]) return;
      _listeners[event] = _listeners[event].filter(f => f !== fn);
    },
    emit(event, data) {
      (_listeners[event] || []).forEach(fn => fn(data));
    }
  };

  /* ---------- State ---------- */
  let currentPage = 'dashboard';
  let sidebarCollapsed = false;

  /* ---------- Page titles ---------- */
  const pageTitles = {
    dashboard: '掃瞄監控',
    review:    '待審核',
    topics:    '議題管理',
    knowledge: '知識庫',
    settings:  '系統設定'
  };

  /* ---------- Navigation ---------- */
  function initNavigation() {
    const navItems = document.querySelectorAll('.nav-item[data-page]');
    navItems.forEach(item => {
      item.addEventListener('click', e => {
        e.preventDefault();
        const page = item.dataset.page;
        if (page === currentPage) return;
        switchPage(page);
      });
    });
  }

  function switchPage(page) {
    /* Update nav active state */
    document.querySelectorAll('.nav-item[data-page]').forEach(n => {
      n.classList.toggle('active', n.dataset.page === page);
    });

    /* Hide current, show new */
    document.querySelectorAll('.page-panel').forEach(p => p.classList.remove('active'));
    const panel = document.getElementById('page-' + page);
    if (panel) {
      panel.classList.add('active');
      panel.style.animation = 'none';
      // Force reflow
      void panel.offsetHeight;
      panel.style.animation = '';
    }

    /* Update title */
    const title = document.getElementById('pageTitle');
    if (title) title.textContent = pageTitles[page] || page;

    currentPage = page;

    /* Close mobile sidebar */
    document.getElementById('sidebar')?.classList.remove('mobile-open');

    EventBus.emit('page:change', page);
  }

  /* ---------- Sidebar Toggle ---------- */
  function initSidebar() {
    const toggle = document.getElementById('sidebarToggle');
    const sidebar = document.getElementById('sidebar');
    if (toggle && sidebar) {
      toggle.addEventListener('click', () => {
        sidebarCollapsed = !sidebarCollapsed;
        sidebar.classList.toggle('collapsed', sidebarCollapsed);
      });
    }

    /* Mobile menu */
    const mobileBtn = document.getElementById('mobileMenuBtn');
    if (mobileBtn && sidebar) {
      mobileBtn.addEventListener('click', () => {
        sidebar.classList.toggle('mobile-open');
      });
      /* Close on outside click */
      document.addEventListener('click', e => {
        if (sidebar.classList.contains('mobile-open') &&
            !sidebar.contains(e.target) &&
            e.target !== mobileBtn &&
            !mobileBtn.contains(e.target)) {
          sidebar.classList.remove('mobile-open');
        }
      });
    }
  }

  /* ---------- Header Clock ---------- */
  function initClock() {
    const el = document.getElementById('headerTime');
    if (!el) return;
    function tick() {
      const now = new Date();
      el.textContent = now.toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    }
    tick();
    setInterval(tick, 1000);
  }

  /* ---------- Theme Toggle ---------- */
  function initTheme() {
    const btn = document.getElementById('themeToggle');
    if (!btn) return;
    btn.addEventListener('click', () => {
      document.body.classList.toggle('light-theme');
      showToast('主題已切換', 'info');
    });
  }

  /* ---------- Global Search Shortcut ---------- */
  function initSearch() {
    document.addEventListener('keydown', e => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        const input = document.getElementById('globalSearchInput');
        if (input) input.focus();
      }
    });
  }

  /* ---------- Settings interactions ---------- */
  function initSettings() {
    const threshold = document.getElementById('relevanceThreshold');
    const thresholdVal = document.getElementById('thresholdValue');
    if (threshold && thresholdVal) {
      threshold.addEventListener('input', () => {
        thresholdVal.textContent = threshold.value + '%';
      });
    }
  }

  /* ---------- Toast ---------- */
  function showToast(message, type = 'info', duration = 3000) {
    const container = document.getElementById('toastContainer');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = 'toast toast-' + type;
    toast.innerHTML = `
      <span class="toast-message">${message}</span>
      <button class="toast-close" onclick="this.parentElement.remove()">&times;</button>
    `;
    container.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(40px)';
      toast.style.transition = 'all .3s';
      setTimeout(() => toast.remove(), 300);
    }, duration);
  }

  /* ---------- Modal ---------- */
  function showModal(content) {
    const overlay = document.getElementById('modalOverlay');
    const modalEl = document.getElementById('modalContent');
    if (!overlay || !modalEl) return;
    modalEl.innerHTML = content;
    overlay.classList.add('active');
    /* Close on overlay click */
    overlay.onclick = e => {
      if (e.target === overlay) closeModal();
    };
    /* Close on Escape */
    const esc = e => {
      if (e.key === 'Escape') { closeModal(); document.removeEventListener('keydown', esc); }
    };
    document.addEventListener('keydown', esc);
  }

  function closeModal() {
    const overlay = document.getElementById('modalOverlay');
    if (overlay) overlay.classList.remove('active');
  }

  /* ---------- Init ---------- */
  function init() {
    initNavigation();
    initSidebar();
    initClock();
    initTheme();
    initSearch();
    initSettings();

    /* Init sub-modules */
    if (typeof Dashboard !== 'undefined') Dashboard.init();
    if (typeof Review !== 'undefined') Review.init();
    if (typeof Topics !== 'undefined') Topics.init();
    if (typeof Knowledge !== 'undefined') Knowledge.init();
  }

  document.addEventListener('DOMContentLoaded', init);

  return { EventBus, showToast, showModal, closeModal, switchPage };
})();
