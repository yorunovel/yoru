/* ================================================================
   YORU — Dashboard Page
   Novel library with filtering and search
   ================================================================ */

window.Yoru = window.Yoru || {};
Yoru.Pages = Yoru.Pages || {};

Yoru.Pages.Dashboard = {
  currentFilter: 'All', // author
  currentGenre: 'All',
  searchQuery: '',
  allNovels: [],

  render: async function() {
    // Fetch all novels once
    Yoru.Pages.Dashboard.allNovels = await Yoru.getAllNovels();
    
    // Extract unique genres for dropdown
    var genres = new Set();
    Yoru.Pages.Dashboard.allNovels.forEach(n => {
      if (n.genre) n.genre.forEach(g => genres.add(g));
    });
    var genreOptions = ['All'].concat(Array.from(genres).sort());
    
    var genreSelectHtml = `
      <select id="genre-filter" onchange="Yoru.Pages.Dashboard.filterByGenre(this.value)" class="form-input" style="width: auto; background: var(--bg-surface); padding: 8px 16px;">
        ${genreOptions.map(g => `<option value="${g}" ${g === Yoru.Pages.Dashboard.currentGenre ? 'selected' : ''}>${g}</option>`).join('')}
      </select>
    `;

    var searchHtml = `
      <div class="search-bar" style="display: flex; gap: 16px; margin-bottom: 24px; align-items: center;">
        <input type="text" id="search-input" class="form-input" placeholder="Search by title..." value="${Yoru.Pages.Dashboard.searchQuery}" oninput="Yoru.Pages.Dashboard.filterBySearch(this.value)" style="flex: 1; padding: 12px; border-radius: 8px;">
        ${genreSelectHtml}
      </div>
    `;

    return `
      ${Yoru.UI.renderHeader()}
      <div class="dashboard-page" id="dashboard-page">
        <div class="dashboard-content">

          <!-- Hero Section -->
          <div class="dashboard-hero">
            <h1 class="dashboard-hero-title heading-serif">Your Library</h1>
            <p class="dashboard-hero-subtitle">Curated stories for the discerning reader</p>
          </div>
          
          ${searchHtml}

          <!-- Author Filters -->
          <div class="filter-bar" id="filter-bar">
            ${Yoru.UI.renderFilterPills(Yoru.Pages.Dashboard.currentFilter)}
          </div>

          <!-- Novel Grid -->
          <div class="novel-grid" id="novel-grid">
            <!-- Rendered in afterRender -->
          </div>

        </div>
      </div>
    `;
  },
  
  applyFilters: function() {
    var grid = document.getElementById('novel-grid');
    if (!grid) return;
    
    var filtered = Yoru.Pages.Dashboard.allNovels;
    
    // Filter by author
    if (Yoru.Pages.Dashboard.currentFilter !== 'All') {
      filtered = filtered.filter(n => n.author === Yoru.Pages.Dashboard.currentFilter);
    }
    
    // Filter by genre
    if (Yoru.Pages.Dashboard.currentGenre !== 'All') {
      filtered = filtered.filter(n => n.genre && n.genre.includes(Yoru.Pages.Dashboard.currentGenre));
    }
    
    // Filter by search
    if (Yoru.Pages.Dashboard.searchQuery) {
      const q = Yoru.Pages.Dashboard.searchQuery.toLowerCase();
      filtered = filtered.filter(n => n.title.toLowerCase().includes(q));
    }
    
    // Fade out grid
    grid.style.opacity = '0';
    grid.style.transform = 'translateY(10px)';
    grid.style.transition = 'all 0.25s ease';

    setTimeout(function() {
      if (filtered.length === 0) {
        grid.innerHTML = Yoru.UI.renderEmptyState('No novels match your filters.');
      } else {
        grid.innerHTML = filtered.map(function(novel, i) {
          return Yoru.UI.renderNovelCard(novel, i);
        }).join('');
      }

      // Fade in
      grid.style.opacity = '1';
      grid.style.transform = 'translateY(0)';
    }, 250);
  },

  filter: function(author) {
    Yoru.Pages.Dashboard.currentFilter = author;
    var filterBar = document.getElementById('filter-bar');
    if (filterBar) {
      filterBar.innerHTML = Yoru.UI.renderFilterPills(author);
    }
    this.applyFilters();
  },
  
  filterByGenre: function(genre) {
    Yoru.Pages.Dashboard.currentGenre = genre;
    this.applyFilters();
  },
  
  filterBySearch: function(query) {
    Yoru.Pages.Dashboard.searchQuery = query;
    this.applyFilters();
  },

  afterRender: function() {
    this.applyFilters();
  }
};
