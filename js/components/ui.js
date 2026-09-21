/* ================================================================
   YORU — Shared UI Components
   Reusable rendering functions for cards, badges, and notifications
   ================================================================ */

window.Yoru = window.Yoru || {};
Yoru.UI = {};

// ===== SVG ICONS =====
Yoru.UI.icons = {
  back: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/></svg>',
  logout: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>',
  chevronRight: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>',
  chevronLeft: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>',
  play: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>',
  book: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>',
  shield: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
  moon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>'
};

// ===== NOVEL CARD =====
Yoru.UI.renderNovelCard = function(novel, index) {
  const delay = index || 0;
  const coverStyle = novel.cover.image 
    ? `background: ${novel.cover.gradient}; background-image: url('${novel.cover.image}'); background-size: cover; background-position: center;`
    : `background: ${novel.cover.gradient};`;
  return `
    <article class="novel-card stagger-${delay + 1}" onclick="Yoru.router.navigate('/novel/${novel.id}')" id="novel-card-${novel.id}">
      <div class="novel-card-cover">
        <div class="novel-card-cover-art" style="${coverStyle}">
          <div class="cover-decoration"></div>
          <span class="cover-title">${novel.title}</span>
          <span class="cover-author">${novel.author}</span>
        </div>
      </div>
      <div class="novel-card-body">
        <h3 class="novel-card-title">${novel.title}</h3>
        <p class="novel-card-author">${novel.author}</p>
        <div class="novel-card-meta">
          <span class="novel-card-chapters">${novel.chapters.length} Chapters</span>
          <span class="novel-card-badge">${Yoru.UI.icons.shield} 18+</span>
        </div>
      </div>
    </article>
  `;
};

// ===== COVER ART (Large) =====
Yoru.UI.renderCoverArt = function(novel, size) {
  const cls = size === 'large' ? 'novel-detail-cover-art' : 'novel-card-cover-art';
  const coverStyle = novel.cover.image 
    ? `background: ${novel.cover.gradient}; background-image: url('${novel.cover.image}'); background-size: cover; background-position: center;`
    : `background: ${novel.cover.gradient};`;
  return `
    <div class="${cls}" style="${coverStyle}">
      <div class="cover-decoration"></div>
      <span class="cover-title">${novel.title}</span>
      <span class="cover-author">${novel.author}</span>
    </div>
  `;
};

// ===== MATURE BADGE =====
Yoru.UI.renderMatureBadge = function() {
  return `<span class="badge-mature">${Yoru.UI.icons.shield} 18+ Mature Content</span>`;
};

// ===== GENRE BADGES =====
Yoru.UI.renderGenreBadges = function(genres) {
  return genres.map(g => `<span class="badge-genre">${g}</span>`).join('');
};

// ===== AUTHOR FILTER PILLS =====
Yoru.UI.renderFilterPills = function(activeFilter) {
  const filters = ['All', ...Yoru.authors];
  return filters.map(f => `
    <button 
      class="filter-pill ${activeFilter === f ? 'active' : ''}" 
      onclick="Yoru.Pages.Dashboard.filter('${f}')"
      id="filter-${f.toLowerCase()}"
    >${f}</button>
  `).join('');
};

// ===== CHAPTER LIST ITEM =====
Yoru.UI.renderChapterItem = function(novelId, chapter, index) {
  return `
    <div class="chapter-item" onclick="Yoru.router.navigate('/read/${novelId}/${chapter.id}')" id="chapter-${chapter.id}">
      <div class="chapter-item-left">
        <span class="chapter-item-number">${String(index + 1).padStart(2, '0')}</span>
        <span class="chapter-item-title">${chapter.title}</span>
      </div>
      <span class="chapter-item-arrow">${Yoru.UI.icons.chevronRight}</span>
    </div>
  `;
};

// ===== APP HEADER =====
Yoru.UI.renderHeader = function() {
  const user = Yoru.auth.getUser();
  return `
    <header class="app-header" id="app-header">
      <div class="header-brand" onclick="Yoru.router.navigate('/dashboard')">夜 Yoru</div>
      <div class="header-actions">
        <div class="header-user">
          <span class="header-user-dot"></span>
          <span>${user ? user.username : 'Guest'}</span>
        </div>
        <button class="logout-btn" onclick="Yoru.auth.logout()" id="logout-btn">
          ${Yoru.UI.icons.logout}
          <span>Exit</span>
        </button>
      </div>
    </header>
  `;
};

// ===== TOAST NOTIFICATIONS =====
Yoru.UI.toast = function(message, type) {
  type = type || 'default';
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = 'toast toast-' + type;
  toast.textContent = message;
  container.appendChild(toast);

  setTimeout(function() {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(20px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(function() {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 300);
  }, 3000);
};

// ===== EMPTY STATE =====
Yoru.UI.renderEmptyState = function(message) {
  return `
    <div class="empty-state">
      <div class="empty-state-icon">${Yoru.UI.icons.book}</div>
      <p class="empty-state-text">${message}</p>
    </div>
  `;
};
