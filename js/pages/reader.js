/* ================================================================
   YORU — Reading Interface
   Distraction-free, immersive reading experience with controls
   ================================================================ */

window.Yoru = window.Yoru || {};
Yoru.Pages = Yoru.Pages || {};

Yoru.Pages.Reader = {
  fontSize: 18,
  minFontSize: 14,
  maxFontSize: 28,

  render: async function(novelId, chapterId) {
    var novel = await Yoru.getNovelById(novelId);
    if (!novel) {
      return `
        <div class="reader-page">
          <div class="reader-container">
            ${Yoru.UI.renderEmptyState('Novel not found.')}
          </div>
        </div>
      `;
    }

    var chapter = await Yoru.getChapter(novelId, chapterId);
    if (!chapter) {
      return `
        <div class="reader-page">
          <div class="reader-container">
            ${Yoru.UI.renderEmptyState('Chapter not found.')}
          </div>
        </div>
      `;
    }

    var chapterIndex = Yoru.getChapterIndex(novel, chapterId);
    var prevChapter = chapterIndex > 0 ? novel.chapters[chapterIndex - 1] : null;
    var nextChapter = chapterIndex < novel.chapters.length - 1 ? novel.chapters[chapterIndex + 1] : null;

    var paragraphs = '';
    const contentTrimmed = chapter.content.trim();
    if (contentTrimmed.startsWith('https://docs.google.com/document/d/')) {
      let docUrl = contentTrimmed;
      if (docUrl.includes('/edit')) {
          docUrl = docUrl.replace(/\/edit.*$/, '/preview');
      } else if (!docUrl.endsWith('/preview') && !docUrl.includes('/pub')) {
          docUrl = docUrl + '/preview';
      }
      paragraphs = `<div class="gdocs-container" style="background: white; padding: 10px; border-radius: 8px; margin: 2rem 0;"><iframe src="${docUrl}" width="100%" height="800px" style="border: none; border-radius: 4px;"></iframe></div>`;
    } else {
      paragraphs = chapter.content.split('\n').filter(p => p.trim() !== '').map(function(p) {
        let text = p.trim();
        let imgRegex = /^!\[(.*?)\]\((.*?)\)$/;
        let match = text.match(imgRegex);
        if (match) {
          return `<img src="${match[2]}" alt="${match[1]}" class="reader-inline-image" style="max-width: 100%; border-radius: 8px; margin: 2rem auto; display: block;">`;
        }
        return '<p>' + text + '</p>';
      }).join('');
    }

    return `
      <!-- Reading Progress Bar -->
      <div class="reader-progress" id="reader-progress" style="width: 0%;"></div>

      <div class="reader-page" id="reader-page">
        <!-- Top Bar -->
        <div class="reader-top-bar">
          <div class="reader-top-left">
            <button class="reader-back-btn" onclick="Yoru.router.navigate('/novel/${novel.id}')" id="reader-back-btn">
              ${Yoru.UI.icons.back}
              <span>Back</span>
            </button>
            <span class="reader-chapter-title">${chapter.title}</span>
          </div>
          <div class="reader-top-right">
            <div class="font-size-controls">
              <button class="font-size-btn" onclick="Yoru.Pages.Reader.adjustFontSize(-1)" id="font-decrease" aria-label="Decrease font size">A−</button>
              <span class="font-size-label" id="font-size-display">${Yoru.Pages.Reader.fontSize}px</span>
              <button class="font-size-btn" onclick="Yoru.Pages.Reader.adjustFontSize(1)" id="font-increase" aria-label="Increase font size">A+</button>
            </div>
          </div>
        </div>

        <!-- Reading Content -->
        <div class="reader-container">
          <div class="reader-header">
            <p class="reader-novel-title">${novel.title}</p>
            <h1 class="reader-chapter-heading">${chapter.title}</h1>
          </div>
          <div class="reader-content no-select" id="reader-content" style="font-size: ${Yoru.Pages.Reader.fontSize}px;">
            ${paragraphs}
          </div>
          
          <!-- Comments Section -->
          <div style="margin-top: 64px; padding-bottom: 64px;">
            ${window.Yoru.UI.renderCommentsSection ? window.Yoru.UI.renderCommentsSection(novel.id, chapter.id) : ''}
          </div>
        </div>

        <!-- Bottom Navigation Bar -->
        <div class="reader-bottom-bar" id="reader-bottom-bar">
          <button 
            class="reader-nav-btn" 
            ${prevChapter ? 'onclick="Yoru.router.navigate(\'/read/' + novel.id + '/' + prevChapter.id + '\')"' : 'disabled'}
            id="prev-chapter-btn"
          >
            ${Yoru.UI.icons.chevronLeft}
            <span>Previous</span>
          </button>
          <span class="reader-nav-current">
            ${chapterIndex + 1} / ${novel.chapters.length}
          </span>
          <button 
            class="reader-nav-btn"
            ${nextChapter ? 'onclick="Yoru.router.navigate(\'/read/' + novel.id + '/' + nextChapter.id + '\')"' : 'disabled'}
            id="next-chapter-btn"
          >
            <span>Next</span>
            ${Yoru.UI.icons.chevronRight}
          </button>
        </div>
      </div>
    `;
  },

  adjustFontSize: function(delta) {
    var newSize = Yoru.Pages.Reader.fontSize + (delta * 2);
    if (newSize < Yoru.Pages.Reader.minFontSize || newSize > Yoru.Pages.Reader.maxFontSize) return;

    Yoru.Pages.Reader.fontSize = newSize;

    var contentEl = document.getElementById('reader-content');
    var displayEl = document.getElementById('font-size-display');

    if (contentEl) {
      contentEl.style.fontSize = newSize + 'px';
      contentEl.style.transition = 'font-size 0.2s ease';
    }
    if (displayEl) {
      displayEl.textContent = newSize + 'px';
    }
  },

  setupScrollProgress: function() {
    var progressBar = document.getElementById('reader-progress');
    if (!progressBar) return;

    var ticking = false;

    function updateProgress() {
      var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      var docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      var progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      progressBar.style.width = Math.min(progress, 100) + '%';
      ticking = false;
    }

    window.addEventListener('scroll', function() {
      if (!ticking) {
        requestAnimationFrame(updateProgress);
        ticking = true;
      }
    });

    updateProgress();
  },

  setupAntiCopy: function() {
    var contentEl = document.getElementById('reader-content');
    if (!contentEl) return;
    
    // Prevent right click
    contentEl.addEventListener('contextmenu', function(e) {
      e.preventDefault();
      Yoru.UI.toast('Copying content is disabled.', 'error');
    });
    
    // Prevent copying
    contentEl.addEventListener('copy', function(e) {
      e.preventDefault();
      Yoru.UI.toast('Copying content is disabled.', 'error');
    });
    
    // Prevent keyboard shortcuts (Ctrl+C, Ctrl+A)
    document.addEventListener('keydown', function(e) {
      // Only protect if we are on the reader page
      if (document.getElementById('reader-page')) {
        if (e.ctrlKey || e.metaKey) {
          if (e.key === 'c' || e.key === 'C' || e.key === 'a' || e.key === 'A') {
            e.preventDefault();
            Yoru.UI.toast('Copying content is disabled.', 'error');
          }
        }
      }
    });
  },

  afterRender: function(params) {
    window.scrollTo(0, 0);
    Yoru.Pages.Reader.setupScrollProgress();
    Yoru.Pages.Reader.setupAntiCopy();
    
    // Load comments
    if (window.Yoru.loadComments && params && params.novelId && params.chapterId) {
      window.Yoru.loadComments(params.novelId, params.chapterId);
    }
  }
};
