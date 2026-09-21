/* ================================================================
   YORU — Application Core
   Router, authentication, and app initialization
   ================================================================ */

window.Yoru = window.Yoru || {};

// ===== AUTHENTICATION =====
Yoru.auth = {
  // Login now uses Supabase Auth with email/password.
  // We simulate username login by appending @yoru.app to the username.
  login: async function(username, password) {
    let cleanUsername = username.trim().toLowerCase();
    const email = cleanUsername.includes('@') ? cleanUsername : cleanUsername + '@yoru.app';
    const { data, error } = await Yoru.supabase.auth.signInWithPassword({
      email: email,
      password: password
    });
    
    if (error) {
      throw error;
    }
    
    if (data.session && data.session.user) {
      await Yoru.auth.loadUserProfile(data.session.user.id);
    }
    
    return data;
  },

  logout: async function() {
    await Yoru.supabase.auth.signOut();
    Yoru.currentUser = null;
    Yoru.router.navigate('/login');
    Yoru.UI.toast('You have exited. Until next time.', 'default');
  },

  isAuthenticated: function() {
    return !!Yoru.currentUser;
  },

  getUser: function() {
    return Yoru.currentUser;
  },
  
  // Fetches the current session and loads profile data
  initAuth: async function() {
    const { data: { session } } = await Yoru.supabase.auth.getSession();
    if (session && session.user) {
      await Yoru.auth.loadUserProfile(session.user.id);
    } else {
      Yoru.currentUser = null;
    }
    
    // Listen for auth changes
    Yoru.supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        await Yoru.auth.loadUserProfile(session.user.id);
      } else if (event === 'SIGNED_OUT') {
        Yoru.currentUser = null;
      }
    });
  },
  
  loadUserProfile: async function(userId) {
    const { data, error } = await Yoru.supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
      
    if (data) {
      Yoru.currentUser = data;
    } else {
      // Fallback if profile doesn't exist yet
      Yoru.currentUser = { id: userId, username: 'User', role: 'reader' };
    }
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
    if (parts[0] === 'login') return { route: 'login', params: {} };
    if (parts[0] === 'dashboard') return { route: 'dashboard', params: {} };
    if (parts[0] === 'contact') return { route: 'contact', params: {} };
    if (parts[0] === 'profile') return { route: 'profile', params: {} };
    if (parts[0] === 'admin') return { route: 'admin', params: {} };
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
    
    // Admin guard
    if (route === 'admin') {
      const user = Yoru.auth.getUser();
      if (!user || user.role !== 'admin') {
        Yoru.router.navigate('/dashboard');
        Yoru.UI.toast('Access denied.', 'error');
        return;
      }
    }

    var html = '';
    var afterRender = null;
    
    // Support async rendering since we fetch data from Supabase
    var renderPromise = null;

    switch (route) {
      case 'login':
        renderPromise = Promise.resolve(Yoru.Pages.Login.render());
        afterRender = Yoru.Pages.Login.afterRender;
        break;

      case 'dashboard':
        renderPromise = Yoru.Pages.Dashboard.render();
        afterRender = Yoru.Pages.Dashboard.afterRender;
        break;

      case 'novel':
        renderPromise = Yoru.Pages.Novel.render(params.novelId);
        afterRender = Yoru.Pages.Novel.afterRender;
        break;

      case 'reader':
        renderPromise = Yoru.Pages.Reader.render(params.novelId, params.chapterId);
        afterRender = Yoru.Pages.Reader.afterRender;
        break;
        
      case 'contact':
        if(Yoru.Pages.Contact) {
          renderPromise = Promise.resolve(Yoru.Pages.Contact.render());
          afterRender = Yoru.Pages.Contact.afterRender;
        }
        break;
        
      case 'profile':
        if(Yoru.Pages.Profile) {
          renderPromise = Promise.resolve(Yoru.Pages.Profile.render());
          afterRender = Yoru.Pages.Profile.afterRender;
        }
        break;
        
      case 'admin':
        if(Yoru.Pages.Admin) {
          renderPromise = Promise.resolve(Yoru.Pages.Admin.render());
          afterRender = Yoru.Pages.Admin.afterRender;
        }
        break;

      default:
        renderPromise = Promise.resolve(Yoru.Pages.Login.render());
        afterRender = Yoru.Pages.Login.afterRender;
    }

    // Render with page transition
    app.style.opacity = '0';
    app.style.transition = 'opacity 0.15s ease';

    renderPromise.then(function(resolvedHtml) {
      setTimeout(function() {
        app.innerHTML = resolvedHtml;
        app.style.opacity = '1';

        // Execute afterRender callback
        if (typeof afterRender === 'function') {
          afterRender(params);
        }
      }, 150);
    }).catch(function(error) {
      console.error('Render error:', error);
      setTimeout(function() {
        app.innerHTML = Yoru.UI.renderEmptyState('Failed to load page. ' + error.message);
        app.style.opacity = '1';
      }, 150);
    });
  }
};

// ===== INITIALIZATION =====
(async function() {
  // Wait for Supabase to initialize auth before routing
  try {
    if (Yoru.auth.initAuth) {
      await Yoru.auth.initAuth();
    }
  } catch(e) {
    console.error("Auth init failed:", e);
  }

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
