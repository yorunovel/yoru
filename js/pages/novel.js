/* ================================================================
   YORU — Novel Detail Page
   Shows novel info, 18+ badge, synopsis, and chapter list
   ================================================================ */

window.Yoru = window.Yoru || {};
Yoru.Pages = Yoru.Pages || {};

Yoru.Pages.Novel = {
  render: async function(novelId) {
    var novel = await Yoru.getNovelById(novelId);

    if (!novel) {
      return `
        ${Yoru.UI.renderHeader()}
        <div class="novel-detail-page">
          <div class="novel-detail-content">
            ${Yoru.UI.renderEmptyState('Novel not found.')}
          </div>
        </div>
      `;
    }

    var chaptersHtml = novel.chapters.map(function(ch, i) {
      return Yoru.UI.renderChapterItem(novel.id, ch, i);
    }).join('');

    var firstChapterId = novel.chapters[0] ? novel.chapters[0].id : '';
    
    var likeCount = await Yoru.getLikeCount(novel.id);
    var isLiked = await Yoru.hasUserLiked(novel.id);

    return `
      ${Yoru.UI.renderHeader()}
      <div class="novel-detail-page" id="novel-detail-page">
        <div class="novel-detail-content">

          <!-- Back Button -->
          <div class="novel-detail-back" onclick="Yoru.router.navigate('/dashboard')" id="back-to-library">
            ${Yoru.UI.icons.back}
            <span>Back to Library</span>
          </div>

          <!-- Hero Section -->
          <div class="novel-detail-hero">
            <div class="novel-detail-cover">
              ${Yoru.UI.renderCoverArt(novel, 'large')}
            </div>
            <div class="novel-detail-info">
              <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                <h1 class="novel-detail-title" style="flex: 1;">${novel.title}</h1>
                ${Yoru.UI.renderLikeButton(novel.id, isLiked, likeCount)}
              </div>
              <p class="novel-detail-author">
                by <span class="novel-detail-author-name">${novel.author}</span>
              </p>

              <!-- Badges -->
              <div class="novel-detail-badges">
                ${Yoru.UI.renderMatureBadge()}
                ${Yoru.UI.renderGenreBadges(novel.genre)}
              </div>

              <!-- Synopsis -->
              <div class="novel-detail-synopsis">
                <h3>Synopsis</h3>
                <p>${novel.synopsis}</p>
              </div>

              <!-- Start Reading Button -->
              <button 
                class="novel-detail-start-btn" 
                onclick="Yoru.router.navigate('/read/${novel.id}/${firstChapterId}')"
                id="start-reading-btn"
                ${!firstChapterId ? 'disabled' : ''}
              >
                ${Yoru.UI.icons.play}
                <span>Start Reading</span>
              </button>
            </div>
          </div>

          <!-- Chapter List -->
          <div class="chapter-list-section">
            <div class="chapter-list-header">
              <h2 class="chapter-list-title heading-serif">Chapters</h2>
              <span class="chapter-list-count">${novel.chapters.length} chapters</span>
            </div>
            <div class="chapter-list" id="chapter-list">
              ${chaptersHtml || Yoru.UI.renderEmptyState('No chapters available yet.')}
            </div>
          </div>

          <!-- Comments Section -->
          <div style="margin-top: 48px;">
            ${window.Yoru.UI.renderCommentsSection ? window.Yoru.UI.renderCommentsSection(novel.id) : ''}
          </div>

        </div>
      </div>
    `;
  },
  
  toggleLike: async function(novelId) {
    if (!Yoru.auth.isAuthenticated()) {
      Yoru.UI.toast('Please log in to like this novel.', 'error');
      Yoru.router.navigate('/login');
      return;
    }
    
    const btn = document.getElementById('like-btn-' + novelId);
    if (!btn) return;
    
    const wasLiked = btn.classList.contains('active');
    
    // Optimistic UI update
    if (wasLiked) {
      btn.classList.remove('active');
      btn.innerHTML = Yoru.UI.icons.heart + '<span class="like-count">' + (parseInt(btn.querySelector('.like-count').innerText) - 1) + '</span>';
    } else {
      btn.classList.add('active');
      btn.innerHTML = Yoru.UI.icons.heartFilled + '<span class="like-count">' + (parseInt(btn.querySelector('.like-count').innerText) + 1) + '</span>';
    }
    
    // Actual API call
    try {
      await Yoru.toggleLike(novelId);
    } catch(e) {
      // Revert if failed
      console.error(e);
      Yoru.UI.toast('Failed to update like.', 'error');
      // A full re-render or proper revert would be better, but this is okay for now
    }
  },

  afterRender: function(params) {
    // Scroll to top on page load
    window.scrollTo(0, 0);
    
    // Load comments if the function exists
    if (window.Yoru.loadComments && params && params.novelId) {
      window.Yoru.loadComments(params.novelId);
    }
  }
};
