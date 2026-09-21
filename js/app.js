/* ================================================================
   YORU — Application Core
   Router, authentication, and app initialization
   ================================================================ */

window.Yoru = window.Yoru || {};

// ===== AUTHENTICATION =====
Yoru.auth = {
  login: function(user) {
    sessionStorage.setItem('yoru_user', JSON.stringify({
      username: user.username,
      role: user.role,
      loginTime: Date.now()
    }));
  },

  logout: function() {
    sessionStorage.removeItem('yoru_user');
    Yoru.router.navigate('/login');
    Yoru.UI.toast('You have exited. Until next time.', 'default');
  },

  isAuthenticated: function() {
    return sessionStorage.getItem('yoru_user') !== null;
  },

  getUser: function() {
    var data = sessionStorage.getItem('yoru_user');
    return data ? JSON.parse(data) : null;
  }
};

// ===== ROUTER =====
Yoru.router = {
  routes: {},

  // Parse the current hash into route and params
  parseHash: function() {
    var hash = window.location.hash.slice(1) || '/login';
    var parts = hash.split('/').filter(Boolean);

    if (parts.length === 0) return { route: 'login', params: {} };

    // Match routes
    if (parts[0] === 'login') {
      return { route: 'login', params: {} };
    }
    if (parts[0] === 'dashboard') {
      return { route: 'dashboard', params: {} };
    }
    if (parts[0] === 'novel' && parts[1]) {
      return { route: 'novel', params: { novelId: parts[1] } };
    }
    if (parts[0] === 'read' && parts[1] && parts[2]) {
      return { route: 'reader', params: { novelId: parts[1], chapterId: parts[2] } };
    }

    return { route: 'login', params: {} };
  },

  navigate: function(path) {
    window.location.hash = path;
  },

  handleRoute: function() {
    var parsed = Yoru.router.parseHash();
    var route = parsed.route;
    var params = parsed.params;
    var app = document.getElementById('app');

    // Auth guard — redirect to login if not authenticated
    if (route !== 'login' && !Yoru.auth.isAuthenticated()) {
      Yoru.router.navigate('/login');
      return;
    }

    // If authenticated and trying to access login, redirect to dashboard
    if (route === 'login' && Yoru.auth.isAuthenticated()) {
      Yoru.router.navigate('/dashboard');
      return;
    }

    var html = '';
    var afterRender = null;

    switch (route) {
      case 'login':
        html = Yoru.Pages.Login.render();
        afterRender = Yoru.Pages.Login.afterRender;
        break;

      case 'dashboard':
        html = Yoru.Pages.Dashboard.render();
        afterRender = Yoru.Pages.Dashboard.afterRender;
        break;

      case 'novel':
        html = Yoru.Pages.Novel.render(params.novelId);
        afterRender = Yoru.Pages.Novel.afterRender;
        break;

      case 'reader':
        html = Yoru.Pages.Reader.render(params.novelId, params.chapterId);
        afterRender = Yoru.Pages.Reader.afterRender;
        break;

      default:
        html = Yoru.Pages.Login.render();
        afterRender = Yoru.Pages.Login.afterRender;
    }

    // Render with page transition
    app.style.opacity = '0';
    app.style.transition = 'opacity 0.15s ease';

    setTimeout(function() {
      app.innerHTML = html;
      app.style.opacity = '1';

      // Execute afterRender callback
      if (typeof afterRender === 'function') {
        afterRender();
      }
    }, 150);
  }
};

// ===== INITIALIZATION =====
(function() {
  // Listen for hash changes
  window.addEventListener('hashchange', Yoru.router.handleRoute);

  // Initial route on page load
  window.addEventListener('DOMContentLoaded', function() {
    // Set initial hash if empty
    if (!window.location.hash) {
      window.location.hash = '#/login';
    }
    Yoru.router.handleRoute();
  });
})();
