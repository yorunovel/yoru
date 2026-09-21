/* ================================================================
   YORU — Novel Detail Page
   Shows novel info, 18+ badge, synopsis, and chapter list
   ================================================================ */

window.Yoru = window.Yoru || {};
Yoru.Pages = Yoru.Pages || {};

Yoru.Pages.Novel = {
  render: function(novelId) {
    var novel = Yoru.getNovelById(novelId);

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
              <h1 class="novel-detail-title">${novel.title}</h1>
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
              ${chaptersHtml}
            </div>
          </div>

        </div>
      </div>
    `;
  },

  afterRender: function() {
    // Scroll to top on page load
    window.scrollTo(0, 0);
  }
};
