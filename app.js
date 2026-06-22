// ========================================
// AI 术语库 - 应用逻辑 v2
// 新增：热词榜单、扫描状态、数据源管理、轮询
// ========================================

(function() {
  'use strict';

  const API_BASE_URL = window.location.origin;
  const ADMIN_PASSWORD_KEY = 'aiGlossary_adminPwd';
  const BASE_UPDATE_DATE = '2026-06-16';

  // 智能频率：默认与后端一致，仅用于前端显示估算
  const POLL_INTERVALS = {
    trending: 5 * 60 * 1000,    // 5 分钟
    discovered: 60 * 1000,      // 60 秒
    scanStatus: 60 * 1000       // 60 秒
  };

  // 状态
  const state = {
    searchTerm: '',
    activeInitial: null,
    pendingTerms: JSON.parse(localStorage.getItem('aiGlossary_pending') || '[]'),
    userTerms: JSON.parse(localStorage.getItem('aiGlossary_user') || '[]'),
    isAdmin: false,
    // 新增
    trendingRange: '7d',
    trendingList: [],
    scanStatus: null,
    sources: null,
    polling: {
      trending: null,
      discovered: null,
      scanStatus: null
    }
  };

  // ========================================
  // 数据访问
  // ========================================
  function getAllTerms() {
    const dataEnglish = new Set(GLOSSARY_DATA.map(t => t.english.toLowerCase()));
    const uniqueUserTerms = state.userTerms.filter(t => !dataEnglish.has(t.english.toLowerCase()));
    return [...GLOSSARY_DATA, ...uniqueUserTerms];
  }

  function getExample(term) {
    if (term.example && term.example.trim()) return term.example;
    if (typeof TERM_EXAMPLES !== 'undefined' && TERM_EXAMPLES[term.english]) {
      return TERM_EXAMPLES[term.english];
    }
    return '';
  }

  function applyStoredChanges() {
    // 应用删除
    const deleted = JSON.parse(localStorage.getItem('aiGlossary_deleted') || '[]');
    for (let i = GLOSSARY_DATA.length - 1; i >= 0; i--) {
      if (deleted.includes(GLOSSARY_DATA[i].english)) {
        GLOSSARY_DATA.splice(i, 1);
      }
    }
    // 应用编辑
    const edits = JSON.parse(localStorage.getItem('aiGlossary_edits') || '{}');
    GLOSSARY_DATA.forEach((term, idx) => {
      if (edits[term.english]) {
        GLOSSARY_DATA[idx] = { ...term, ...edits[term.english] };
      }
    });
  }

  // ========================================
  // 初始化
  // ========================================
  document.addEventListener('DOMContentLoaded', () => {
    applyStoredChanges();
    initTabs();
    initSearch();
    initLetterNav();
    renderGlossary();
    renderPending();
    initModal();
    initManage();
    initTrendingSection();
    initScanStatus();
    initSourcesPanel();
    initPolling();
    updatePendingCount();
    updateLastUpdateTime();
    renderAuthoritativeSources();
  });

  // ========================================
  // Tab 切换
  // ========================================
  function initTabs() {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const tab = link.dataset.tab;

        if (link.classList.contains('admin-only') && !state.isAdmin) {
          const pwd = prompt('此功能仅限管理员使用\n请输入管理员密码：');
          if (pwd === null) return;
          if (pwd !== getAdminPassword()) {
            alert('密码错误，无法访问管理功能。');
            return;
          }
          state.isAdmin = true;
        }

        navLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
        document.querySelectorAll('.tab-content').forEach(s => s.classList.remove('active'));
        document.getElementById(`tab-${tab}`).classList.add('active');

        // 切到管理页时立即拉一次扫描状态
        if (tab === 'manage') {
          fetchScanStatus();
          fetchDiscovered();
        }
      });
    });
  }

  function getAdminPassword() {
    return localStorage.getItem(ADMIN_PASSWORD_KEY) || 'ai2026';
  }

  // ========================================
  // 搜索
  // ========================================
  function initSearch() {
    const searchInput = document.getElementById('search-input');
    const clearBtn = document.getElementById('clear-search');

    searchInput.addEventListener('input', (e) => {
      state.searchTerm = e.target.value.trim();
      clearBtn.style.display = state.searchTerm ? 'flex' : 'none';
      renderGlossary();
    });

    clearBtn.addEventListener('click', () => {
      searchInput.value = '';
      state.searchTerm = '';
      clearBtn.style.display = 'none';
      renderGlossary();
    });

    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        searchInput.value = '';
        state.searchTerm = '';
        clearBtn.style.display = 'none';
        renderGlossary();
      }
    });
  }

  // ========================================
  // 字母导航
  // ========================================
  function initLetterNav() {
    const navContainer = document.getElementById('letter-nav');
    const initials = getInitials();

    const allBtn = document.createElement('button');
    allBtn.className = 'letter-btn active';
    allBtn.textContent = '全部';
    allBtn.addEventListener('click', () => {
      state.activeInitial = null;
      document.querySelectorAll('.letter-btn').forEach(b => b.classList.remove('active'));
      allBtn.classList.add('active');
      renderGlossary();
    });
    navContainer.appendChild(allBtn);

    initials.forEach(letter => {
      const btn = document.createElement('button');
      btn.className = 'letter-btn';
      btn.textContent = letter;
      btn.addEventListener('click', () => {
        state.activeInitial = letter;
        document.querySelectorAll('.letter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        renderGlossary();
      });
      navContainer.appendChild(btn);
    });
  }

  // ========================================
  // 渲染词库列表
  // ========================================
  function renderGlossary() {
    const container = document.getElementById('glossary-list');
    const statsEl = document.getElementById('search-stats');
    let terms = getAllTerms();

    if (state.activeInitial) {
      terms = terms.filter(t => t.initial === state.activeInitial);
    }

    if (state.searchTerm) {
      const query = state.searchTerm.toLowerCase();
      terms = terms.filter(t =>
        t.english.toLowerCase().includes(query) ||
        t.chinese.toLowerCase().includes(query) ||
        t.brief.toLowerCase().includes(query) ||
        (t.definition || '').toLowerCase().includes(query) ||
        (t.related || []).some(r => r.toLowerCase().includes(query))
      );
    }

    const total = getAllTerms().length;
    if (state.searchTerm) {
      statsEl.textContent = `找到 ${terms.length} 个相关术语（共 ${total} 个）`;
    } else if (state.activeInitial) {
      statsEl.textContent = `${state.activeInitial} 字母下有 ${terms.length} 个术语（共 ${total} 个）`;
    } else {
      statsEl.textContent = `共 ${total} 个 AI 术语`;
    }

    if (terms.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">🔍</div>
          <h3>未找到匹配的术语</h3>
          <p>试试其他关键词，或<a href="#" id="clear-filter-link">查看全部词汇</a></p>
        </div>
      `;
      document.getElementById('clear-filter-link')?.addEventListener('click', (e) => {
        e.preventDefault();
        state.searchTerm = '';
        state.activeInitial = null;
        document.getElementById('search-input').value = '';
        document.getElementById('clear-search').style.display = 'none';
        document.querySelectorAll('.letter-btn').forEach(b => b.classList.remove('active'));
        document.querySelector('.letter-btn')?.classList.add('active');
        renderGlossary();
      });
      return;
    }

    const grouped = {};
    terms.forEach(t => {
      if (!grouped[t.initial]) grouped[t.initial] = [];
      grouped[t.initial].push(t);
    });

    let html = '';
    const sortedKeys = Object.keys(grouped).sort();
    sortedKeys.forEach(letter => {
      html += `
        <div class="letter-section">
          <div class="letter-header" id="letter-anchor-${letter}">
            <span class="letter-badge">${letter}</span>
            <span class="letter-count">${grouped[letter].length} 个术语</span>
          </div>
          <div class="term-cards">
      `;
      grouped[letter].forEach(term => {
        html += renderTermCard(term);
      });
      html += `</div></div>`;
    });

    container.innerHTML = html;

    container.querySelectorAll('.term-card').forEach(card => {
      card.addEventListener('click', () => {
        const english = card.dataset.english;
        const term = getAllTerms().find(t => t.english === english);
        if (term) openDetailModal(term);
      });
    });
  }

  function renderTermCard(term) {
    return `
      <div class="term-card" data-english="${escapeAttr(term.english)}">
        <div class="term-top">
          <span class="term-english">${escapeHtml(term.english)}</span>
          <span class="term-chinese">${escapeHtml(term.chinese)}</span>
        </div>
        <p class="term-brief">${escapeHtml(term.brief)}</p>
      </div>
    `;
  }

  // ========================================
  // 详情弹窗
  // ========================================
  function initModal() {
    const overlay = document.getElementById('modal-overlay');
    const closeBtn = document.getElementById('modal-close');

    closeBtn.addEventListener('click', closeModal);
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeModal();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        if (overlay.classList.contains('active')) closeModal();
      }
    });
  }

  function openDetailModal(term) {
    const overlay = document.getElementById('modal-overlay');
    const body = document.getElementById('modal-body');
    const example = getExample(term);
    const allTerms = getAllTerms();
    const relatedTerms = (term.related || [])
      .map(r => allTerms.find(t => t.english === r))
      .filter(Boolean);

    body.innerHTML = `
      <div class="detail-header">
        <span class="detail-initial">${escapeHtml(term.initial || term.english[0])}</span>
        <h2 class="detail-english">${escapeHtml(term.english)}</h2>
        <p class="detail-chinese">${escapeHtml(term.chinese)}</p>
      </div>

      <div class="detail-section">
        <div class="detail-label">一句话解释</div>
        <div class="detail-brief">${escapeHtml(term.brief)}</div>
      </div>

      ${term.definition ? `
        <div class="detail-section">
          <div class="detail-label">官方定义</div>
          <div class="detail-definition">${escapeHtml(term.definition)}</div>
          ${term.source ? `<div class="detail-source"><a href="${escapeAttr(term.source)}" target="_blank" rel="noopener">📎 查看来源</a></div>` : ''}
        </div>
      ` : ''}

      ${example ? `
        <div class="detail-section">
          <div class="detail-label">生活化示例</div>
          <div class="detail-example">
            <span class="detail-example-tag">💡 AI 生成</span>
            ${escapeHtml(example)}
          </div>
        </div>
      ` : ''}

      <div class="detail-section" id="detail-trending-section" style="display:none;">
        <div class="detail-label">热度趋势</div>
        <div class="detail-trending" id="detail-trending-body">加载中...</div>
      </div>

      ${relatedTerms.length ? `
        <div class="detail-section">
          <div class="detail-label">关联词语</div>
          <div class="related-pills">
            ${relatedTerms.map(t => `<span class="related-pill" data-english="${escapeAttr(t.english)}">${escapeHtml(t.english)}</span>`).join('')}
          </div>
        </div>
      ` : ''}
    `;

    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';

    // 绑定关联词点击
    body.querySelectorAll('.related-pill').forEach(pill => {
      pill.addEventListener('click', () => {
        const english = pill.dataset.english;
        const t = allTerms.find(x => x.english === english);
        if (t) {
          closeModal();
          setTimeout(() => openDetailModal(t), 200);
        }
      });
    });

    // 拉取该词热度趋势
    fetchTrendingDetail(term.english);
  }

  async function fetchTrendingDetail(english) {
    const section = document.getElementById('detail-trending-section');
    const body = document.getElementById('detail-trending-body');
    if (!section || !body) return;

    try {
      const res = await fetch(`${API_BASE_URL}/api/trending/${encodeURIComponent(english)}`);
      if (!res.ok) { section.style.display = 'none'; return; }
      const data = await res.json();
      if (!data || !data.history || data.history.length === 0) {
        section.style.display = 'none';
        return;
      }

      section.style.display = 'block';
      const last7d = sumLastDays(data.history, 7);
      const sources = (data.sources || []).slice(0, 5).join('、');

      body.innerHTML = `
        <div class="detail-trending-header">
          <div class="detail-trending-count"><strong>${last7d}</strong>次提及（近7天）</div>
          <div class="detail-trending-count">总计 ${data.totalMentions || 0} 次</div>
        </div>
        ${renderSparkline(data.history)}
        ${sources ? `<div class="detail-trending-sources">来源：${escapeHtml(sources)}</div>` : ''}
      `;
    } catch (e) {
      section.style.display = 'none';
    }
  }

  function sumLastDays(history, days) {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);
    return history
      .filter(h => new Date(h.date) >= cutoff)
      .reduce((sum, h) => sum + (h.count || 0), 0);
  }

  function renderSparkline(history) {
    const data = [...history].sort((a, b) => new Date(a.date) - new Date(b.date)).slice(-30);
    if (data.length < 2) return '';
    const max = Math.max(...data.map(d => d.count), 1);
    const w = 100;
    const h = 60;
    const step = w / (data.length - 1);
    const points = data.map((d, i) => {
      const x = i * step;
      const y = h - (d.count / max) * (h - 6) - 3;
      return `${x.toFixed(2)},${y.toFixed(2)}`;
    }).join(' ');
    const areaPoints = `0,${h} ${points} ${w},${h}`;
    return `
      <svg class="sparkline" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none">
        <polygon points="${areaPoints}" fill="var(--accent-soft)" />
        <polyline points="${points}" fill="none" stroke="var(--accent)" stroke-width="1.5" />
      </svg>
    `;
  }

  function closeModal() {
    document.getElementById('modal-overlay').classList.remove('active');
    document.body.style.overflow = '';
  }

  // ========================================
  // 热词榜单
  // ========================================
  function initTrendingSection() {
    document.querySelectorAll('.range-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.range-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.trendingRange = btn.dataset.range;
        fetchTrending();
      });
    });
    fetchTrending();
  }

  async function fetchTrending() {
    const listEl = document.getElementById('trending-list');
    const subtitleEl = document.getElementById('trending-subtitle');
    const rangeText = { '24h': '最近 24 小时', '7d': '最近 7 天', '30d': '最近 30 天' };
    if (subtitleEl) subtitleEl.textContent = rangeText[state.trendingRange];

    try {
      const res = await fetch(`${API_BASE_URL}/api/trending?range=${state.trendingRange}&limit=20`);
      if (!res.ok) throw new Error('trending fetch failed');
      const data = await res.json();
      state.trendingList = data.list || [];
      renderTrending();
    } catch (e) {
      if (listEl) {
        listEl.innerHTML = '<div class="trending-empty">未连接后端，热词榜单不可用</div>';
      }
    }
  }

  function renderTrending() {
    const listEl = document.getElementById('trending-list');
    if (!listEl) return;

    if (!state.trendingList || state.trendingList.length === 0) {
      listEl.innerHTML = '<div class="trending-empty">暂无热度数据，请等待后端首次扫描完成</div>';
      return;
    }

    const maxCount = state.trendingList[0].count || 1;
    const allTerms = getAllTerms();

    listEl.innerHTML = state.trendingList.map((item, idx) => {
      const rank = idx + 1;
      const widthPercent = (item.count / maxCount) * 100;
      const knownTerm = allTerms.find(t => t.english === item.term);
      const rankClass = rank <= 3 ? `rank-${rank}` : '';
      const isKnown = !!knownTerm || item.inGlossary;
      const briefText = knownTerm
        ? knownTerm.brief
        : (item.brief || '点击查看解释');
      const chineseText = knownTerm ? knownTerm.chinese : (item.chinese || '');
      const favoriteBtn = isKnown
        ? `<button class="trending-action-btn view-btn" data-action="view">查看详情</button>`
        : `<button class="trending-action-btn fav-btn" data-action="favorite">⭐ 收藏</button>`;

      return `
        <div class="trending-card ${rankClass}" data-term="${escapeAttr(item.term)}">
          <span class="trending-rank">#${rank}</span>
          <div class="trending-term">${escapeHtml(item.term)}${chineseText ? ` <span style="color:var(--text-3);font-size:11px;font-weight:400;">${escapeHtml(chineseText)}</span>` : ''}${isKnown ? '<span class="trending-tag">已收录</span>' : ''}</div>
          <div class="trending-brief">${escapeHtml(briefText)}</div>
          <div class="trending-count">${item.count} 次提及</div>
          <div class="trending-bar"><div class="trending-bar-fill" style="width:${widthPercent}%"></div></div>
          ${item.sources && item.sources.length ? `<div class="trending-sources">${escapeHtml(item.sources.slice(0, 3).join('、'))}</div>` : ''}
          <div class="trending-actions">${favoriteBtn}</div>
        </div>
      `;
    }).join('');

    // 卡片整体点击（除按钮区域）
    listEl.querySelectorAll('.trending-card').forEach(card => {
      card.addEventListener('click', (e) => {
        if (e.target.closest('.trending-actions')) return;
        const termName = card.dataset.term;
        const knownTerm = allTerms.find(t => t.english === termName);
        if (knownTerm) {
          openDetailModal(knownTerm);
        } else {
          openUnknownTermModal(termName);
        }
      });
    });

    // 收藏按钮
    listEl.querySelectorAll('.fav-btn').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        e.stopPropagation();
        const card = btn.closest('.trending-card');
        const termName = card.dataset.term;
        btn.disabled = true;
        btn.textContent = '收藏中...';
        // 拉 brief
        try {
          const res = await fetch(`${API_BASE_URL}/api/trending/${encodeURIComponent(termName)}/brief`);
          const data = res.ok ? await res.json() : {};
          await favoriteTerm(termName, data.chinese || '', data.brief || '（待补充）');
          btn.textContent = '✓ 已收藏';
          btn.classList.add('done');
        } catch (err) {
          await favoriteTerm(termName, '', '（待补充）');
          btn.textContent = '✓ 已收藏';
          btn.classList.add('done');
        }
      });
    });

    // 查看详情按钮
    listEl.querySelectorAll('.view-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const card = btn.closest('.trending-card');
        const termName = card.dataset.term;
        const knownTerm = allTerms.find(t => t.english === termName);
        if (knownTerm) openDetailModal(knownTerm);
      });
    });

    // 为没有 brief 的未知词批量拉取
    listEl.querySelectorAll('.trending-card').forEach(async card => {
      const item = state.trendingList.find(t => t.term === card.dataset.term);
      if (!item || item.inGlossary) return;
      if (item.brief) return; // 已有就不再拉
      const briefEl = card.querySelector('.trending-brief');
      try {
        const res = await fetch(`${API_BASE_URL}/api/trending/${encodeURIComponent(item.term)}/brief`);
        if (!res.ok) return;
        const data = await res.json();
        if (data.brief && briefEl) {
          briefEl.textContent = data.brief;
          item.brief = data.brief;
          item.chinese = data.chinese;
          // 更新中文显示
          const termDiv = card.querySelector('.trending-term');
          if (termDiv && data.chinese) {
            const existing = termDiv.querySelector('span');
            if (!existing) {
              termDiv.insertAdjacentHTML('beforeend', ` <span style="color:var(--text-3);font-size:11px;font-weight:400;">${escapeHtml(data.chinese)}</span>`);
            }
          }
        }
      } catch (e) {}
    });
  }

  function openUnknownTermModal(termName) {
    const body = document.getElementById('modal-body');
    body.innerHTML = `
      <div class="detail-header">
        <span class="detail-initial">${escapeHtml(termName[0].toUpperCase())}</span>
        <h2 class="detail-english">${escapeHtml(termName)}</h2>
        <p class="detail-chinese">该术语尚未收录</p>
      </div>
      <div class="detail-section">
        <div class="detail-brief">这个词在最近的行业信息源中被频繁提及，但尚未进入正式词库。点击下方按钮收藏，待管理员审核通过后即可加入词库。</div>
      </div>
      <div class="detail-section">
        <button class="btn btn-primary" id="favorite-unknown-btn">⭐ 收藏到待审核</button>
      </div>
      <div class="detail-section" id="detail-trending-section">
        <div class="detail-label">热度趋势</div>
        <div class="detail-trending" id="detail-trending-body">加载中...</div>
      </div>
    `;
    document.getElementById('modal-overlay').classList.add('active');
    document.body.style.overflow = 'hidden';
    document.getElementById('favorite-unknown-btn').addEventListener('click', () => {
      favoriteTerm(termName, '', '（待补充 - 来自热词榜单收藏）');
      closeModal();
    });
    fetchTrendingDetail(termName);
  }

  // ========================================
  // 收藏热词到待审核队列
  // ========================================
  async function favoriteTerm(english, chinese, brief) {
    // 重复检查
    const existsPending = state.pendingTerms.some(t => t.english.toLowerCase() === english.toLowerCase());
    const existsGlossary = getAllTerms().some(t => t.english.toLowerCase() === english.toLowerCase());
    if (existsPending) {
      alert(`"${english}" 已在待审核队列中`);
      return;
    }
    if (existsGlossary) {
      alert(`"${english}" 已在词库中`);
      return;
    }

    // 如果没 brief，尝试从后端获取
    let finalBrief = brief;
    let finalChinese = chinese;
    if (!finalBrief || finalBrief === '（待补充 - 来自热词榜单收藏）') {
      try {
        const res = await fetch(`${API_BASE_URL}/api/trending/${encodeURIComponent(english)}/brief`);
        if (res.ok) {
          const data = await res.json();
          if (data.brief) finalBrief = data.brief;
          if (data.chinese) finalChinese = data.chinese;
        }
      } catch (e) {
        // 静默降级
      }
    }

    const term = {
      english,
      chinese: finalChinese || '',
      initial: english[0].toUpperCase(),
      brief: finalBrief || '（待补充）',
      definition: '',
      source: '',
      related: [],
      addedDate: new Date().toISOString().slice(0, 10),
      fromFavorite: true
    };

    state.pendingTerms.push(term);
    localStorage.setItem('aiGlossary_pending', JSON.stringify(state.pendingTerms));
    renderPending();
    updatePendingCount();
    alert(`已收藏 "${english}"，可在管理 Tab 审核通过后加入词库`);
  }

  // ========================================
  // 扫描状态
  // ========================================
  function initScanStatus() {
    const triggerBtn = document.getElementById('trigger-scan-btn');
    triggerBtn.addEventListener('click', async () => {
      if (!state.isAdmin) {
        const pwd = prompt('请输入管理员密码：');
        if (pwd !== getAdminPassword()) {
          alert('密码错误');
          return;
        }
        state.isAdmin = true;
      }
      triggerBtn.disabled = true;
      triggerBtn.textContent = '扫描中...';
      try {
        const res = await fetch(`${API_BASE_URL}/api/scan/trigger`, {
          method: 'POST',
          headers: { 'X-Admin-Password': getAdminPassword() }
        });
        const data = await res.json();
        if (!data.success) {
          alert(data.message || '触发失败');
        } else {
          alert('已触发扫描，预计 30-60 秒后完成');
          setTimeout(fetchScanStatus, 5000);
        }
      } catch (e) {
        alert('触发失败：' + e.message);
      } finally {
        triggerBtn.disabled = false;
        triggerBtn.textContent = '立即扫描';
      }
    });
    fetchScanStatus();
  }

  async function fetchScanStatus() {
    try {
      const res = await fetch(`${API_BASE_URL}/api/scan/status`);
      if (!res.ok) throw new Error();
      const data = await res.json();
      state.scanStatus = data;
      renderScanStatus(data);
    } catch (e) {
      const lastEl = document.getElementById('scan-last');
      if (lastEl) lastEl.textContent = '未连接';
    }
  }

  function renderScanStatus(data) {
    const lastEl = document.getElementById('scan-last');
    const nextEl = document.getElementById('scan-next');
    const stateEl = document.getElementById('scan-state');
    const countEl = document.getElementById('scan-discovered-count');
    const historyEl = document.getElementById('scan-history-list');

    if (lastEl) lastEl.textContent = data.lastScanTime ? formatDateTime(data.lastScanTime) : '-';
    if (nextEl) nextEl.textContent = data.nextScanTime ? formatDateTime(data.nextScanTime) : '-';
    if (stateEl) {
      if (data.scanning) stateEl.textContent = '扫描中...';
      else if (data.lastError) stateEl.textContent = '错误：' + data.lastError;
      else stateEl.textContent = '空闲';
    }
    if (countEl) {
      const disc = JSON.parse(localStorage.getItem('aiGlossary_pending') || '[]');
      countEl.textContent = disc.length;
    }

    if (historyEl) {
      const history = data.history || [];
      if (history.length === 0) {
        historyEl.innerHTML = '<div class="scan-history-item"><span>暂无历史记录</span></div>';
      } else {
        historyEl.innerHTML = history.map(h => `
          <div class="scan-history-item">
            <span>${formatDateTime(h.time)}</span>
            <span>源 ${h.sourcesHit || 0}</span>
            <span>候选 ${h.candidatesFound || 0}</span>
            <span>新词 ${h.newTerms || 0}</span>
          </div>
        `).join('');
      }
    }
  }

  function formatDateTime(iso) {
    if (!iso) return '-';
    const d = new Date(iso);
    const pad = n => String(n).padStart(2, '0');
    return `${d.getFullYear()}/${pad(d.getMonth()+1)}/${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
  }

  // ========================================
  // 数据源管理
  // ========================================
  function initSourcesPanel() {
    const manageBtn = document.getElementById('manage-sources-btn');
    const overlay = document.getElementById('source-modal-overlay');
    const closeBtn = document.getElementById('source-modal-close');
    const cancelBtn = document.getElementById('source-cancel');
    const saveBtn = document.getElementById('source-save');

    manageBtn.addEventListener('click', async () => {
      if (!state.isAdmin) {
        const pwd = prompt('请输入管理员密码：');
        if (pwd !== getAdminPassword()) { alert('密码错误'); return; }
        state.isAdmin = true;
      }
      await fetchSources();
      openSourceEditor();
    });

    closeBtn.addEventListener('click', closeSourceModal);
    cancelBtn.addEventListener('click', closeSourceModal);
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeSourceModal();
    });

    saveBtn.addEventListener('click', async () => {
      const sources = collectSourcesFromEditor();
      try {
        const res = await fetch(`${API_BASE_URL}/api/sources`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Admin-Password': getAdminPassword()
          },
          body: JSON.stringify({ sources })
        });
        const data = await res.json();
        if (data.success) {
          alert('数据源已保存，下次扫描生效');
          closeSourceModal();
          fetchSources();
        } else {
          alert('保存失败：' + (data.error || '未知错误'));
        }
      } catch (e) {
        alert('保存失败：' + e.message);
      }
    });

    fetchSources();
  }

  async function fetchSources() {
    const listEl = document.getElementById('sources-list');
    try {
      const res = await fetch(`${API_BASE_URL}/api/sources`);
      if (!res.ok) throw new Error();
      state.sources = await res.json();
      renderSourcesList();
    } catch (e) {
      if (listEl) listEl.innerHTML = '<div>未连接后端</div>';
    }
  }

  function renderSourcesList() {
    const listEl = document.getElementById('sources-list');
    if (!listEl || !state.sources) return;

    const items = [];
    (state.sources.rss || []).forEach(s => items.push({ name: s.name, enabled: s.enabled, type: 'RSS' }));
    (state.sources.blogs || []).forEach(s => items.push({ name: s.name, enabled: s.enabled, type: 'Blog' }));
    (state.sources.reddit || []).forEach(s => items.push({ name: s.name, enabled: s.enabled, type: 'Reddit' }));
    if (state.sources.hackernews && state.sources.hackernews.enabled) {
      items.push({ name: 'HackerNews', enabled: true, type: 'HN' });
    }
    if (state.sources.googleTrends && state.sources.googleTrends.enabled) {
      items.push({ name: 'Google Trends', enabled: true, type: 'Trends' });
    }

    if (items.length === 0) {
      listEl.innerHTML = '<div>暂无数据源</div>';
      return;
    }

    listEl.innerHTML = items.map(item => `
      <div class="source-item">
        <span class="source-name">${escapeHtml(item.name)} <span style="color:var(--text-3);font-size:11px;">${item.type}</span></span>
        <span class="source-status ${item.enabled ? 'on' : 'off'}">${item.enabled ? '已启用' : '已禁用'}</span>
      </div>
    `).join('');
  }

  function openSourceEditor() {
    const editor = document.getElementById('source-editor');
    if (!state.sources) {
      editor.innerHTML = '<div>加载失败</div>';
      return;
    }

    const s = state.sources;
    let html = '';

    html += renderSourceSection('RSS 源', 'rss', s.rss);
    html += renderSourceSection('博客', 'blogs', s.blogs);
    html += renderSourceSection('Reddit', 'reddit', s.reddit);

    // HackerNews
    const hn = s.hackernews || { enabled: false };
    html += `
      <div class="source-editor-section">
        <h4>HackerNews</h4>
        <div class="source-editor-row">
          <input type="checkbox" data-section="hackernews" data-field="enabled" ${hn.enabled ? 'checked' : ''} />
          <input type="text" value="HackerNews" readonly />
          <span style="font-size:11px;color:var(--text-3);">minScore: ${hn.minScore || 100}</span>
        </div>
      </div>
    `;

    // Google Trends
    const gt = s.googleTrends || { enabled: false };
    html += `
      <div class="source-editor-section">
        <h4>Google Trends（占位）</h4>
        <div class="source-editor-row">
          <input type="checkbox" data-section="googleTrends" data-field="enabled" ${gt.enabled ? 'checked' : ''} />
          <input type="text" value="Google Trends" readonly />
        </div>
      </div>
    `;

    editor.innerHTML = html;
    document.getElementById('source-modal-overlay').classList.add('active');
  }

  function renderSourceSection(title, sectionKey, arr) {
    if (!arr || arr.length === 0) return '';
    const rows = arr.map((s, idx) => `
      <div class="source-editor-row">
        <input type="checkbox" data-section="${sectionKey}" data-index="${idx}" data-field="enabled" ${s.enabled ? 'checked' : ''} />
        <input type="text" value="${escapeAttr(s.name)}" data-section="${sectionKey}" data-index="${idx}" data-field="name" />
        <input type="text" value="${escapeAttr(s.url)}" data-section="${sectionKey}" data-index="${idx}" data-field="url" placeholder="URL" />
      </div>
    `).join('');
    return `
      <div class="source-editor-section">
        <h4>${title}</h4>
        ${rows}
      </div>
    `;
  }

  function collectSourcesFromEditor() {
    const result = JSON.parse(JSON.stringify(state.sources));
    const editor = document.getElementById('source-editor');

    editor.querySelectorAll('input[data-section]').forEach(input => {
      const section = input.dataset.section;
      const field = input.dataset.field;
      const idx = input.dataset.index;

      if (section === 'hackernews' || section === 'googleTrends') {
        if (input.type === 'checkbox') {
          result[section] = result[section] || {};
          result[section].enabled = input.checked;
        }
      } else {
        if (!result[section] || !result[section][idx]) return;
        if (input.type === 'checkbox') {
          result[section][idx].enabled = input.checked;
        } else {
          result[section][idx][field] = input.value;
        }
      }
    });

    return result;
  }

  function closeSourceModal() {
    document.getElementById('source-modal-overlay').classList.remove('active');
  }

  // ========================================
  // 添加词汇表单
  // ========================================
  // ========================================
  // 待审核
  // ========================================
  function renderPending() {
    const list = document.getElementById('pending-list');
    if (!list) return;

    if (state.pendingTerms.length === 0) {
      list.innerHTML = '<div style="padding:16px;text-align:center;color:var(--text-3);font-size:13px;">暂无待审核词汇</div>';
      return;
    }

    list.innerHTML = state.pendingTerms.map((term, idx) => `
      <div class="pending-item">
        <div class="pending-item-info">
          <span class="pending-item-english">${escapeHtml(term.english)}</span>
          <span class="pending-item-chinese">${escapeHtml(term.chinese)}</span>
          <div class="pending-item-brief">${escapeHtml(term.brief)}</div>
        </div>
        <div class="pending-actions">
          <button class="btn btn-primary btn-sm" data-action="approve" data-idx="${idx}">通过</button>
          <button class="btn btn-secondary btn-sm" data-action="reject" data-idx="${idx}">拒绝</button>
        </div>
      </div>
    `).join('');

    list.querySelectorAll('button[data-action]').forEach(btn => {
      btn.addEventListener('click', () => {
        handlePendingAction(btn.dataset.action, parseInt(btn.dataset.idx));
      });
    });
  }

  async function handlePendingAction(action, index) {
    const term = state.pendingTerms[index];
    if (!term) return;

    if (action === 'approve') {
      // 同时写入后端 data.js
      try {
        const res = await fetch(`${API_BASE_URL}/api/terms`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Admin-Password': getAdminPassword()
          },
          body: JSON.stringify({ term })
        });
        const data = await res.json();
        if (!data.success) {
          alert(`写入 data.js 失败：${data.error || '未知错误'}\n该词仍会临时加入本地词库`);
        } else {
          console.log(`[Data] 已写入 data.js: ${term.english}`);
        }
      } catch (e) {
        console.warn('后端写入失败，仅本地保存：', e.message);
      }

      term.addedDate = new Date().toISOString().slice(0, 10);
      state.userTerms.push(term);
      localStorage.setItem('aiGlossary_user', JSON.stringify(state.userTerms));
      localStorage.setItem('aiGlossary_lastUpdate', term.addedDate);
    }

    // 通知后端从 discovered 移除
    fetch(`${API_BASE_URL}/api/discovered/remove`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ english: term.english })
    }).catch(() => {});

    state.pendingTerms.splice(index, 1);
    localStorage.setItem('aiGlossary_pending', JSON.stringify(state.pendingTerms));
    renderPending();
    renderManageList();
    renderGlossary();
    updatePendingCount();
    updateLastUpdateTime();
  }

  function updatePendingCount() {
    const badge = document.getElementById('pending-count');
    if (badge) badge.textContent = state.pendingTerms.length;
  }

  // ========================================
  // 管理列表
  // ========================================
  function initManage() {
    const searchInput = document.getElementById('manage-search');

    searchInput.addEventListener('input', () => {
      renderManageList(searchInput.value.trim().toLowerCase());
    });

    initEditForm();
    renderManageList();
  }

  function renderManageList(query = '') {
    const list = document.getElementById('manage-list');
    if (!list) return;

    let terms = getAllTerms();
    if (query) {
      terms = terms.filter(t =>
        t.english.toLowerCase().includes(query) ||
        t.chinese.toLowerCase().includes(query)
      );
    }

    if (terms.length === 0) {
      list.innerHTML = '<div style="padding:16px;text-align:center;color:var(--text-3);">无匹配术语</div>';
      return;
    }

    list.innerHTML = terms.map(term => `
      <div class="manage-item">
        <span class="manage-item-english">${escapeHtml(term.english)}</span>
        <span class="manage-item-chinese">${escapeHtml(term.chinese)}</span>
        <span class="manage-item-source">${escapeHtml(term.source || '-')}</span>
        <span class="manage-item-date">${escapeHtml(term.addedDate || BASE_UPDATE_DATE)}</span>
        <div class="manage-item-actions">
          <button class="icon-btn" data-edit="${escapeAttr(term.english)}" title="编辑">✏️</button>
          <button class="icon-btn danger" data-delete="${escapeAttr(term.english)}" title="删除">🗑️</button>
        </div>
      </div>
    `).join('');

    list.querySelectorAll('[data-edit]').forEach(btn => {
      btn.addEventListener('click', () => {
        const english = btn.dataset.edit;
        const term = getAllTerms().find(t => t.english === english);
        if (term) openEditModal(term);
      });
    });

    list.querySelectorAll('[data-delete]').forEach(btn => {
      btn.addEventListener('click', () => {
        const english = btn.dataset.delete;
        if (confirm(`确认删除 "${english}"？此操作仅影响本地视图。`)) {
          deleteTerm(english);
        }
      });
    });
  }

  function initEditForm() {
    const overlay = document.getElementById('edit-modal-overlay');
    const closeBtn = document.getElementById('edit-modal-close');
    const cancelBtn = document.getElementById('edit-cancel');
    const form = document.getElementById('edit-term-form');

    closeBtn.addEventListener('click', closeEditModal);
    cancelBtn.addEventListener('click', closeEditModal);
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeEditModal();
    });

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(form);
      const originalEnglish = formData.get('original-english');
      const newTerm = {
        english: formData.get('english').trim(),
        chinese: formData.get('chinese').trim(),
        initial: (formData.get('initial') || formData.get('english')[0]).toUpperCase(),
        brief: formData.get('brief').trim(),
        definition: formData.get('definition').trim(),
        source: formData.get('source').trim(),
        example: formData.get('example').trim(),
        related: formData.get('related').split(',').map(s => s.trim()).filter(Boolean)
      };

      // 同步到后端 data.js
      try {
        const res = await fetch(`${API_BASE_URL}/api/terms/${encodeURIComponent(originalEnglish)}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'X-Admin-Password': getAdminPassword()
          },
          body: JSON.stringify({ term: newTerm })
        });
        const data = await res.json();
        if (!data.success) {
          alert(`写入 data.js 失败：${data.error || '未知错误'}\n编辑仅本地生效`);
        }
      } catch (e) {
        console.warn('后端写入失败，仅本地保存：', e.message);
      }

      // 应用编辑到本地
      const edits = JSON.parse(localStorage.getItem('aiGlossary_edits') || '{}');
      edits[originalEnglish] = newTerm;
      localStorage.setItem('aiGlossary_edits', JSON.stringify(edits));
      localStorage.setItem('aiGlossary_lastUpdate', new Date().toISOString().slice(0, 10));

      closeEditModal();
      applyStoredChanges();
      renderGlossary();
      renderManageList();
      updateLastUpdateTime();

      // 同步示例
      if (typeof TERM_EXAMPLES !== 'undefined' && newTerm.example) {
        TERM_EXAMPLES[newTerm.english] = newTerm.example;
      }
    });
  }

  function openEditModal(term) {
    const form = document.getElementById('edit-term-form');
    form.querySelector('[name="original-english"]').value = term.english;
    form.querySelector('[name="english"]').value = term.english;
    form.querySelector('[name="chinese"]').value = term.chinese;
    form.querySelector('[name="initial"]').value = term.initial;
    form.querySelector('[name="brief"]').value = term.brief;
    form.querySelector('[name="definition"]').value = term.definition || '';
    form.querySelector('[name="source"]').value = term.source || '';
    form.querySelector('[name="example"]').value = getExample(term);
    form.querySelector('[name="related"]').value = (term.related || []).join(', ');
    document.getElementById('edit-modal-overlay').classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeEditModal() {
    document.getElementById('edit-modal-overlay').classList.remove('active');
    document.body.style.overflow = '';
  }

  async function deleteTerm(english) {
    // 同步到后端 data.js
    try {
      const res = await fetch(`${API_BASE_URL}/api/terms/${encodeURIComponent(english)}`, {
        method: 'DELETE',
        headers: { 'X-Admin-Password': getAdminPassword() }
      });
      const data = await res.json();
      if (!data.success) {
        alert(`从 data.js 删除失败：${data.error || '未知错误'}\n删除仅本地生效`);
      }
    } catch (e) {
      console.warn('后端删除失败，仅本地删除：', e.message);
    }

    // 如果是用户添加的，从 userTerms 删
    const userIdx = state.userTerms.findIndex(t => t.english === english);
    if (userIdx >= 0) {
      state.userTerms.splice(userIdx, 1);
      localStorage.setItem('aiGlossary_user', JSON.stringify(state.userTerms));
    } else {
      // 否则记录到 deleted
      const deleted = JSON.parse(localStorage.getItem('aiGlossary_deleted') || '[]');
      if (!deleted.includes(english)) deleted.push(english);
      localStorage.setItem('aiGlossary_deleted', JSON.stringify(deleted));
    }
    applyStoredChanges();
    renderGlossary();
    renderManageList();
    updateLastUpdateTime();
  }

  // ========================================
  // 轮询
  // ========================================
  function initPolling() {
    state.polling.trending = setInterval(() => {
      if (!document.hidden) fetchTrending();
    }, POLL_INTERVALS.trending);

    state.polling.discovered = setInterval(() => {
      if (!document.hidden) fetchDiscovered();
    }, POLL_INTERVALS.discovered);

    state.polling.scanStatus = setInterval(() => {
      if (!document.hidden) fetchScanStatus();
    }, POLL_INTERVALS.scanStatus);

    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
        fetchTrending();
        fetchDiscovered();
        fetchScanStatus();
      }
    });
  }

  async function fetchDiscovered() {
    try {
      const res = await fetch(`${API_BASE_URL}/api/discovered`);
      if (!res.ok) throw new Error();
      const data = await res.json();
      const newTerms = (data.terms || []).filter(t =>
        !state.pendingTerms.some(p => p.english.toLowerCase() === t.english.toLowerCase()) &&
        !getAllTerms().some(g => g.english.toLowerCase() === t.english.toLowerCase())
      );
      if (newTerms.length > 0) {
        state.pendingTerms.push(...newTerms);
        localStorage.setItem('aiGlossary_pending', JSON.stringify(state.pendingTerms));
        renderPending();
        updatePendingCount();
      }
    } catch (e) {
      // 静默失败
    }
  }

  // ========================================
  // 工具函数
  // ========================================
  function updateLastUpdateTime() {
    const el = document.getElementById('last-update');
    if (!el) return;
    let latestDate = BASE_UPDATE_DATE;
    const lastEdit = localStorage.getItem('aiGlossary_lastUpdate');
    if (lastEdit && lastEdit > latestDate) latestDate = lastEdit;
    const parts = latestDate.split('-');
    const formatted = `${parts[0]}/${parseInt(parts[1])}/${parseInt(parts[2])}`;
    el.textContent = `上次更新：${formatted}`;
  }

  function renderAuthoritativeSources() {
    const listEl = document.getElementById('authoritative-sources-list');
    if (!listEl || typeof AUTHORITATIVE_SOURCES === 'undefined') return;
    listEl.innerHTML = AUTHORITATIVE_SOURCES.map(s => `
      <li><a href="${escapeAttr(s.url)}" target="_blank" rel="noopener">${escapeHtml(s.name)}</a> — ${escapeHtml(s.desc || '')}</li>
    `).join('');
  }

  function escapeHtml(str) {
    if (str == null) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function escapeAttr(str) {
    return escapeHtml(str);
  }

})();
