/* ================================================================
   YORU — Login Page
   Strictly invite-only authentication. No signup, no register,
   no forgot password. Exclusive access only.
   ================================================================ */

window.Yoru = window.Yoru || {};
Yoru.Pages = Yoru.Pages || {};

Yoru.Pages.Login = {
  render: function() {
    return `
      <div class="login-page" id="login-page">
        <div class="login-container">
          
          <!-- Brand -->
          <div class="login-brand">
            <h1 class="login-brand-name">夜 Yoru</h1>
            <div class="login-brand-divider"></div>
            <p class="login-brand-tagline">Exclusive Access Only</p>
          </div>

          <!-- Login Card -->
          <div class="login-card">
            <form class="login-form" id="login-form">
              
              <div class="form-group">
                <label class="form-label" for="login-username">Username</label>
                <input 
                  type="text" 
                  class="form-input" 
                  id="login-username" 
                  placeholder="Enter your username"
                  autocomplete="username"
                  required
                >
              </div>

              <div class="form-group">
                <label class="form-label" for="login-password">Password</label>
                <input 
                  type="password" 
                  class="form-input" 
                  id="login-password" 
                  placeholder="Enter your password"
                  autocomplete="current-password"
                  required
                >
              </div>

              <div class="login-error" id="login-error">
                Access denied. Invalid credentials.
              </div>

              <button type="submit" class="login-btn" id="login-submit-btn">
                Enter
              </button>

            </form>
          </div>

          <!-- Footer -->
          <div class="login-footer">
            <p class="login-footer-text">This is a private platform. Access is by invitation only.</p>
          </div>

        </div>
      </div>
    `;
  },

  handleSubmit: function(e) {
    e.preventDefault();

    var username = document.getElementById('login-username').value.trim();
    var password = document.getElementById('login-password').value;
    var errorEl = document.getElementById('login-error');
    var submitBtn = document.getElementById('login-submit-btn');

    // Clear previous errors
    errorEl.classList.remove('visible');

    // Disable button during validation
    submitBtn.disabled = true;
    submitBtn.textContent = 'Verifying...';

    // Simulate a brief delay for realism (or just wait for auth)
    Yoru.auth.login(username, password)
      .then(function(data) {
        // Successful login
        Yoru.UI.toast('Welcome back.', 'success');
        Yoru.router.navigate('/dashboard');
      })
      .catch(function(error) {
        // Failed login
        errorEl.textContent = 'Access denied. ' + (error.message || 'Invalid credentials.');
        errorEl.classList.add('visible');
        submitBtn.disabled = false;
        submitBtn.textContent = 'Enter';

        // Shake animation on the card
        var card = document.querySelector('.login-card');
        card.style.animation = 'none';
        card.style.opacity = '1'; // Fix: prevent card from disappearing
        card.offsetHeight; // Force reflow
        card.style.animation = 'shake 0.4s ease';
      });
  },

  afterRender: function() {
    // Attach event listener properly
    var form = document.getElementById('login-form');
    if (form) {
      form.addEventListener('submit', Yoru.Pages.Login.handleSubmit);
    }
    
    // Focus the username field after render
    setTimeout(function() {
      var usernameInput = document.getElementById('login-username');
      if (usernameInput) {
        usernameInput.focus();
      }
    }, 1000);
  }
};
