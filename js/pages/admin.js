window.Yoru = window.Yoru || {};
window.Yoru.Pages = window.Yoru.Pages || {};

window.Yoru.Pages.Admin = {
    render: function() {
        const user = window.Yoru.auth ? window.Yoru.auth.getUser() : null;
        if (!user || user.role !== 'admin') {
            return `
                <div class="admin-error">
                    <h2>Access Denied</h2>
                    <p>You do not have permission to view this page.</p>
                </div>
            `;
        }

        return `
            ${window.Yoru.UI.renderHeader()}
            <div class="admin-page yoru-container" id="admin-page">
                <div class="admin-content" style="max-width: 800px; margin: 0 auto; padding: 2rem;">
                    <!-- Back Button -->
                    <div onclick="Yoru.router.navigate('/dashboard')" style="cursor: pointer; margin-bottom: 2rem; display: inline-flex; align-items: center; gap: 0.5rem; color: var(--text-muted); font-size: 0.9rem;">
                        ${window.Yoru.UI.icons ? window.Yoru.UI.icons.back : '&larr;'} Back to Dashboard
                    </div>
                    
                    <h1 class="page-title heading-serif" style="color: var(--accent-gold, #ffd700); margin-bottom: 2rem;">Admin Panel</h1>
                
                <section class="admin-section" style="margin-top: 2rem; background: var(--bg-surface, #1e1e1e); padding: 1.5rem; border-radius: 8px;">
                    <h2 style="color: var(--accent-gold, #ffd700); margin-bottom: 1rem;">Add New Novel</h2>
                    <form id="add-novel-form" class="admin-form">
                        <div class="form-group" style="margin-bottom: 1rem;">
                            <label for="novel-id" style="display: block; margin-bottom: 0.5rem;">Novel ID (slug)</label>
                            <div style="display: flex; gap: 8px;">
                                <input type="text" id="novel-id" required style="flex: 1; padding: 0.5rem; background: var(--bg-input, #2a2a2a); border: 1px solid var(--border-color, #333); color: white; border-radius: 4px;">
                                <button type="button" id="load-novel-btn" style="background: #333; color: white; border: none; padding: 0 1rem; border-radius: 4px; cursor: pointer;">Load</button>
                            </div>
                            <small style="color: #888;">To edit an existing novel, enter its ID and click Load.</small>
                        </div>
                        <div class="form-group" style="margin-bottom: 1rem;">
                            <label for="novel-title" style="display: block; margin-bottom: 0.5rem;">Title</label>
                            <input type="text" id="novel-title" required style="width: 100%; padding: 0.5rem; background: var(--bg-input, #2a2a2a); border: 1px solid var(--border-color, #333); color: white; border-radius: 4px;">
                        </div>
                        <div class="form-group" style="margin-bottom: 1rem;">
                            <label for="novel-author" style="display: block; margin-bottom: 0.5rem;">Author</label>
                            <input type="text" id="novel-author" required style="width: 100%; padding: 0.5rem; background: var(--bg-input, #2a2a2a); border: 1px solid var(--border-color, #333); color: white; border-radius: 4px;">
                        </div>
                        <div class="form-group" style="margin-bottom: 1rem;">
                            <label for="novel-genre" style="display: block; margin-bottom: 0.5rem;">Genres (comma separated)</label>
                            <input type="text" id="novel-genre" required style="width: 100%; padding: 0.5rem; background: var(--bg-input, #2a2a2a); border: 1px solid var(--border-color, #333); color: white; border-radius: 4px;">
                        </div>
                        <div class="form-group" style="margin-bottom: 1rem;">
                            <label for="novel-synopsis" style="display: block; margin-bottom: 0.5rem;">Synopsis</label>
                            <textarea id="novel-synopsis" rows="4" required style="width: 100%; padding: 0.5rem; background: var(--bg-input, #2a2a2a); border: 1px solid var(--border-color, #333); color: white; border-radius: 4px;"></textarea>
                        </div>
                        <div class="form-group" style="margin-bottom: 1rem;">
                            <label for="novel-cover" style="display: block; margin-bottom: 0.5rem;">Cover Image URL (optional)</label>
                            <input type="text" id="novel-cover" placeholder="e.g. https://drive.google.com/uc?id=YOUR_FILE_ID" style="width: 100%; padding: 0.5rem; background: var(--bg-input, #2a2a2a); border: 1px solid var(--border-color, #333); color: white; border-radius: 4px;">
                        </div>
                        <button type="submit" class="btn btn-primary" style="background: var(--accent-crimson, #dc143c); color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 4px; cursor: pointer;">Add Novel</button>
                    </form>
                </section>

                <section class="admin-section" style="margin-top: 2rem; background: var(--bg-surface, #1e1e1e); padding: 1.5rem; border-radius: 8px;">
                    <h2 style="color: var(--accent-gold, #ffd700); margin-bottom: 1rem;">Add New Chapter</h2>
                    <form id="add-chapter-form" class="admin-form">
                        <div class="form-group" style="margin-bottom: 1rem;">
                            <label for="chapter-novel-id" style="display: block; margin-bottom: 0.5rem;">Novel ID</label>
                            <input type="text" id="chapter-novel-id" required style="width: 100%; padding: 0.5rem; background: var(--bg-input, #2a2a2a); border: 1px solid var(--border-color, #333); color: white; border-radius: 4px;">
                        </div>
                        <div class="form-group" style="margin-bottom: 1rem;">
                            <label for="chapter-id" style="display: block; margin-bottom: 0.5rem;">Chapter ID (slug)</label>
                            <div style="display: flex; gap: 8px;">
                                <input type="text" id="chapter-id" required style="flex: 1; padding: 0.5rem; background: var(--bg-input, #2a2a2a); border: 1px solid var(--border-color, #333); color: white; border-radius: 4px;">
                                <button type="button" id="load-chapter-btn" style="background: #333; color: white; border: none; padding: 0 1rem; border-radius: 4px; cursor: pointer;">Load</button>
                            </div>
                            <small style="color: #888;">To edit a chapter, enter Novel ID & Chapter ID, then click Load.</small>
                        </div>
                        <div class="form-group" style="margin-bottom: 1rem;">
                            <label for="chapter-title" style="display: block; margin-bottom: 0.5rem;">Chapter Title</label>
                            <input type="text" id="chapter-title" required style="width: 100%; padding: 0.5rem; background: var(--bg-input, #2a2a2a); border: 1px solid var(--border-color, #333); color: white; border-radius: 4px;">
                        </div>
                        <div class="form-group" style="margin-bottom: 1rem;">
                            <label for="chapter-content" style="display: block; margin-bottom: 0.5rem;">Content (Markdown Support)</label>
                            <p style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 8px;">Tip: You can use Markdown formatting like <strong>**bold**</strong>, <em>*italic*</em>, and <code>![alt](url)</code> for images.</p>
                            <textarea id="chapter-content" rows="10" required style="width: 100%; padding: 0.5rem; background: var(--bg-input, #2a2a2a); border: 1px solid var(--border-color, #333); color: white; border-radius: 4px; font-family: monospace;"></textarea>
                        </div>
                        <button type="submit" class="btn btn-primary" style="background: var(--accent-crimson, #dc143c); color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 4px; cursor: pointer;">Add Chapter</button>
                    </form>
                </section>
            </div>
        `;
    },

    afterRender: function() {
        const user = window.Yoru.auth ? window.Yoru.auth.getUser() : null;
        if (!user || user.role !== 'admin') {
            return;
        }
        
        function convertGoogleDriveLink(url) {
            if (!url) return null;
            const match = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) || url.match(/\/d\/([a-zA-Z0-9_-]+)/);
            if (match && match[1]) {
                return `https://lh3.googleusercontent.com/d/${match[1]}`;
            }
            return url;
        }

        const loadNovelBtn = document.getElementById('load-novel-btn');
        if (loadNovelBtn) {
            loadNovelBtn.addEventListener('click', async function() {
                const id = document.getElementById('novel-id').value.trim();
                if (!id) return alert('Please enter a Novel ID first');
                
                const { data, error } = await window.Yoru.supabase.from('novels').select('*').eq('id', id).single();
                if (error || !data) {
                    return alert('Novel not found');
                }
                
                document.getElementById('novel-title').value = data.title || '';
                document.getElementById('novel-author').value = data.author || '';
                document.getElementById('novel-genre').value = data.genre ? data.genre.join(', ') : '';
                document.getElementById('novel-synopsis').value = data.synopsis || '';
                document.getElementById('novel-cover').value = data.cover_image || '';
                
                window.Yoru.UI.toast('Novel data loaded', 'success');
            });
        }

        const addNovelForm = document.getElementById('add-novel-form');
        if (addNovelForm) {
            addNovelForm.addEventListener('submit', async function(e) {
                e.preventDefault();
                
                const id = document.getElementById('novel-id').value.trim();
                const title = document.getElementById('novel-title').value.trim();
                const author = document.getElementById('novel-author').value.trim();
                const genreInput = document.getElementById('novel-genre').value;
                const synopsis = document.getElementById('novel-synopsis').value.trim();
                const coverImageRaw = document.getElementById('novel-cover') ? document.getElementById('novel-cover').value.trim() : null;
                
                const coverImage = convertGoogleDriveLink(coverImageRaw);
                const genre = genreInput.split(',').map(g => g.trim()).filter(g => g);

                try {
                    const novelData = { id, title, author, genre, synopsis };
                    if (coverImage) novelData.cover_image = coverImage;
                    
                    const { data, error } = await window.Yoru.supabase
                        .from('novels')
                        .upsert([novelData]);

                    if (error) throw error;
                    
                    if (window.Yoru.UI && window.Yoru.UI.toast) {
                        window.Yoru.UI.toast('Novel saved successfully', 'success');
                    } else {
                        alert('Novel saved successfully');
                    }
                    addNovelForm.reset();
                } catch (error) {
                    console.error('Error saving novel:', error);
                    if (window.Yoru.UI && window.Yoru.UI.toast) {
                        window.Yoru.UI.toast('Error saving novel: ' + error.message, 'error');
                    } else {
                        alert('Error saving novel: ' + error.message);
                    }
                }
            });
        }

        const loadChapterBtn = document.getElementById('load-chapter-btn');
        if (loadChapterBtn) {
            loadChapterBtn.addEventListener('click', async function() {
                const novelId = document.getElementById('chapter-novel-id').value.trim();
                const id = document.getElementById('chapter-id').value.trim();
                if (!novelId || !id) return alert('Please enter both Novel ID and Chapter ID first');
                
                const { data, error } = await window.Yoru.supabase.from('chapters')
                    .select('*').eq('novel_id', novelId).eq('id', id).single();
                if (error || !data) {
                    return alert('Chapter not found');
                }
                
                document.getElementById('chapter-title').value = data.title || '';
                document.getElementById('chapter-content').value = data.content || '';
                
                window.Yoru.UI.toast('Chapter data loaded', 'success');
            });
        }



        const addChapterForm = document.getElementById('add-chapter-form');
        if (addChapterForm) {
            addChapterForm.addEventListener('submit', async function(e) {
                e.preventDefault();
                
                const submitBtn = addChapterForm.querySelector('button[type="submit"]');
                const originalBtnText = submitBtn.innerText;
                
                const novel_id = document.getElementById('chapter-novel-id').value.trim();
                const id = document.getElementById('chapter-id').value.trim();
                const title = document.getElementById('chapter-title').value.trim();
                let content = document.getElementById('chapter-content').value.trim();
                
                submitBtn.innerText = 'Saving...';
                submitBtn.disabled = true;
                
                // Process any markdown images that have Google Drive links
                content = content.replace(/!\[(.*?)\]\((https:\/\/drive\.google\.com\/.*?)\)/g, function(match, alt, fullUrl) {
                    const driveIdMatch = fullUrl.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) || fullUrl.match(/\/d\/([a-zA-Z0-9_-]+)/);
                    if (driveIdMatch && driveIdMatch[1]) {
                        return `![${alt}](https://lh3.googleusercontent.com/d/${driveIdMatch[1]})`;
                    }
                    return match;
                });

                try {
                    const { data, error } = await window.Yoru.supabase
                        .from('chapters')
                        .upsert([{ novel_id, id, title, content }]);

                    if (error) throw error;
                    
                    if (window.Yoru.UI && window.Yoru.UI.toast) {
                        window.Yoru.UI.toast('Chapter saved successfully', 'success');
                    } else {
                        alert('Chapter saved successfully');
                    }
                    addChapterForm.reset();
                } catch (error) {
                    console.error('Error saving chapter:', error);
                    if (window.Yoru.UI && window.Yoru.UI.toast) {
                        window.Yoru.UI.toast('Error saving chapter: ' + error.message, 'error');
                    } else {
                        alert('Error saving chapter: ' + error.message);
                    }
                } finally {
                    submitBtn.innerText = originalBtnText;
                    submitBtn.disabled = false;
                }
            });
        }
    }
};
