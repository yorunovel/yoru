/* ================================================================
   YORU — Dashboard Page
   Novel library with author filter pills and card grid
   ================================================================ */

window.Yoru = window.Yoru || {};
Yoru.Pages = Yoru.Pages || {};

Yoru.Pages.Dashboard = {
  currentFilter: 'All',

  render: function() {
    var filter = Yoru.Pages.Dashboard.currentFilter;
    var novels = Yoru.getNovelsByAuthor(filter);

    var cardsHtml = '';
    if (novels.length === 0) {
      cardsHtml = Yoru.UI.renderEmptyState('No novels found for this author.');
    } else {
      cardsHtml = novels.map(function(novel, i) {
        return Yoru.UI.renderNovelCard(novel, i);
      }).join('');
    }

    return `
      ${Yoru.UI.renderHeader()}
      <div class="dashboard-page" id="dashboard-page">
        <div class="dashboard-content">

          <!-- Hero Section -->
          <div class="dashboard-hero">
            <h1 class="dashboard-hero-title heading-serif">Your Library</h1>
            <p class="dashboard-hero-subtitle">Curated stories for the discerning reader</p>
          </div>

          <!-- Author Filters -->
          <div class="filter-bar" id="filter-bar">
            ${Yoru.UI.renderFilterPills(filter)}
          </div>

          <!-- Novel Grid -->
          <div class="novel-grid" id="novel-grid">
            ${cardsHtml}
          </div>

        </div>
      </div>
    `;
  },

  filter: function(author) {
    Yoru.Pages.Dashboard.currentFilter = author;
    // Re-render just the grid and filter bar for smooth transition
    var grid = document.getElementById('novel-grid');
    var filterBar = document.getElementById('filter-bar');

    if (grid && filterBar) {
      var novels = Yoru.getNovelsByAuthor(author);

      // Update filter pills
      filterBar.innerHTML = Yoru.UI.renderFilterPills(author);

      // Fade out grid
      grid.style.opacity = '0';
      grid.style.transform = 'translateY(10px)';
      grid.style.transition = 'all 0.25s ease';

      setTimeout(function() {
        if (novels.length === 0) {
          grid.innerHTML = Yoru.UI.renderEmptyState('No novels found for this author.');
        } else {
          grid.innerHTML = novels.map(function(novel, i) {
            return Yoru.UI.renderNovelCard(novel, i);
          }).join('');
        }

        // Fade in
        grid.style.opacity = '1';
        grid.style.transform = 'translateY(0)';
      }, 250);
    }
  },

  afterRender: function() {
    // Nothing extra needed
  }
};
