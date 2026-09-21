window.Yoru = window.Yoru || {};
window.Yoru.Pages = window.Yoru.Pages || {};

window.Yoru.Pages.Profile = {
  render: function() {
    if (!window.Yoru.auth || !window.Yoru.auth.isAuthenticated()) {
      return `
        <div class="profile-error-page yoru-container">
          <div class="error-card">
            <h2>Access Denied</h2>
            <p>Please log in to view and edit your profile.</p>
            <button class="btn btn-primary" onclick="window.Yoru.router.navigate('/login')">Go to Login</button>
          </div>
        </div>
      `;
    }

    const user = window.Yoru.auth.getUser();
    const avatarUrl = user.avatar_url || '/assets/default-avatar.png'; // Fallback if no avatar

    return `
      ${window.Yoru.UI.renderHeader()}
      <div class="profile-page yoru-container">
        <!-- Back Button -->
        <div onclick="Yoru.router.navigate('/dashboard')" style="cursor: pointer; margin-bottom: 2rem; margin-top: 1rem; display: inline-flex; align-items: center; gap: 0.5rem; color: var(--text-muted); font-size: 0.9rem;">
          ${window.Yoru.UI.icons ? window.Yoru.UI.icons.back : '&larr;'} Back to Dashboard
        </div>
        <h1 class="page-title">Your Profile</h1>
        
        <div class="profile-card dark-panel">
          <div class="profile-avatar-section">
            <img id="profile-avatar-preview" class="profile-avatar-img" src="${avatarUrl}" alt="Avatar">
            <label for="profile-avatar-input" class="btn btn-secondary">Upload New Avatar</label>
            <input type="file" id="profile-avatar-input" accept="image/png, image/jpeg, image/webp" style="display: none;">
            <div id="profile-avatar-filename" class="file-name-display"></div>
            <p class="help-text">Max size: 2MB. Recommended 256x256.</p>
          </div>
          
          <form id="profile-form" class="profile-form">
            <div class="form-group" style="margin-bottom: 1rem;">
              <label class="form-label">Membership Status</label>
              <input type="text" class="form-input" value="Active Member (Since ${user.created_at ? new Date(user.created_at).toLocaleDateString() : 'Unknown'})" disabled style="background: rgba(0,0,0,0.2); color: var(--accent-gold);">
            </div>
            
            <div class="form-group">
              <label for="profile-username" class="form-label">Username</label>
              <input type="text" id="profile-username" class="form-input" value="${user.username || ''}" required minlength="3" maxlength="20">
            </div>
            
            <div class="form-actions">
              <button type="submit" class="btn btn-primary" id="profile-submit-btn">Save Changes</button>
            </div>
          </form>
        </div>
      </div>
    `;
  },
  
  afterRender: function() {
    if (!window.Yoru.auth || !window.Yoru.auth.isAuthenticated()) {
      return;
    }

    const fileInput = document.getElementById('profile-avatar-input');
    const form = document.getElementById('profile-form');
    const avatarPreview = document.getElementById('profile-avatar-preview');
    const fileNameDisplay = document.getElementById('profile-avatar-filename');
    const submitBtn = document.getElementById('profile-submit-btn');
    
    let selectedFile = null;

    if (fileInput) {
      fileInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (!file) {
          selectedFile = null;
          fileNameDisplay.textContent = '';
          return;
        }

        // Check file size (max 2MB)
        const maxSize = 2 * 1024 * 1024;
        if (file.size > maxSize) {
          if (window.Yoru.UI && window.Yoru.UI.toast) {
            window.Yoru.UI.toast('Image size must be less than 2MB', 'error');
          } else {
            alert('Image size must be less than 2MB');
          }
          fileInput.value = '';
          selectedFile = null;
          fileNameDisplay.textContent = '';
          return;
        }

        selectedFile = file;
        fileNameDisplay.textContent = file.name;

        // Preview the selected image
        const reader = new FileReader();
        reader.onload = function(evt) {
          if (avatarPreview) {
            avatarPreview.src = evt.target.result;
          }
        };
        reader.readAsDataURL(file);
      });
    }

    if (form) {
      form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.textContent = 'Saving...';
        }
        
        try {
          const user = window.Yoru.auth.getUser();
          const newUsername = document.getElementById('profile-username').value.trim();
          let newAvatarUrl = user.avatar_url;

          // 1. Upload avatar if a new one is selected
          if (selectedFile) {
            const fileExt = selectedFile.name.split('.').pop();
            const fileName = \`\${user.id}-\${Date.now()}.\${fileExt}\`;
            
            const { data, error: uploadError } = await window.Yoru.supabase
              .storage
              .from('avatars')
              .upload(fileName, selectedFile);

            if (uploadError) {
              throw uploadError;
            }

            // Get the public URL for the uploaded avatar
            const { data: urlData } = window.Yoru.supabase
              .storage
              .from('avatars')
              .getPublicUrl(fileName);
              
            newAvatarUrl = urlData.publicUrl;
          }

          // 2. Update the profiles table
          const { error: updateError } = await window.Yoru.supabase
            .from('profiles')
            .update({ 
              username: newUsername,
              avatar_url: newAvatarUrl,
              updated_at: new Date().toISOString()
            })
            .eq('id', user.id);

          if (updateError) {
             // Handle specific errors like duplicate username
             if (updateError.code === '23505') {
                 throw new Error('Username is already taken');
             }
             throw updateError;
          }

          // 3. Update the local auth state (so the UI reflects the new username/avatar immediately)
          if (window.Yoru.auth.updateCurrentUser) {
             window.Yoru.auth.updateCurrentUser({
                ...user,
                username: newUsername,
                avatar_url: newAvatarUrl
             });
          } else {
             // Fallback if updateCurrentUser is not implemented, just mutate the returned object
             user.username = newUsername;
             user.avatar_url = newAvatarUrl;
          }

          if (window.Yoru.UI && window.Yoru.UI.toast) {
            window.Yoru.UI.toast('Profile updated successfully!', 'success');
          }
          
          // Reset file input state
          selectedFile = null;
          if (fileInput) fileInput.value = '';
          if (fileNameDisplay) fileNameDisplay.textContent = '';
          
        } catch (error) {
          console.error('Error updating profile:', error);
          const errorMsg = error.message || 'Failed to update profile';
          if (window.Yoru.UI && window.Yoru.UI.toast) {
            window.Yoru.UI.toast(errorMsg, 'error');
          } else {
            alert(errorMsg);
          }
        } finally {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Save Changes';
          }
        }
      });
    }
  }
};
