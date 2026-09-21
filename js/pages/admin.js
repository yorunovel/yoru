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
            <div class="admin-container" style="max-width: 800px; margin: 0 auto; padding: 2rem;">
                <h1>Admin Panel</h1>
                
                <section class="admin-section" style="margin-top: 2rem; background: var(--bg-surface, #1e1e1e); padding: 1.5rem; border-radius: 8px;">
                    <h2 style="color: var(--accent-gold, #ffd700); margin-bottom: 1rem;">Add New Novel</h2>
                    <form id="add-novel-form" class="admin-form">
                        <div class="form-group" style="margin-bottom: 1rem;">
                            <label for="novel-id" style="display: block; margin-bottom: 0.5rem;">Novel ID (slug)</label>
                            <input type="text" id="novel-id" required style="width: 100%; padding: 0.5rem; background: var(--bg-input, #2a2a2a); border: 1px solid var(--border-color, #333); color: white; border-radius: 4px;">
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
                            <input type="text" id="chapter-id" required style="width: 100%; padding: 0.5rem; background: var(--bg-input, #2a2a2a); border: 1px solid var(--border-color, #333); color: white; border-radius: 4px;">
                        </div>
                        <div class="form-group" style="margin-bottom: 1rem;">
                            <label for="chapter-title" style="display: block; margin-bottom: 0.5rem;">Chapter Title</label>
                            <input type="text" id="chapter-title" required style="width: 100%; padding: 0.5rem; background: var(--bg-input, #2a2a2a); border: 1px solid var(--border-color, #333); color: white; border-radius: 4px;">
                        </div>
                        <div class="form-group" style="margin-bottom: 1rem;">
                            <label for="chapter-content" style="display: block; margin-bottom: 0.5rem;">Content</label>
                            <textarea id="chapter-content" rows="10" required style="width: 100%; padding: 0.5rem; background: var(--bg-input, #2a2a2a); border: 1px solid var(--border-color, #333); color: white; border-radius: 4px;"></textarea>
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

        const addNovelForm = document.getElementById('add-novel-form');
        if (addNovelForm) {
            addNovelForm.addEventListener('submit', async function(e) {
                e.preventDefault();
                
                const id = document.getElementById('novel-id').value.trim();
                const title = document.getElementById('novel-title').value.trim();
                const author = document.getElementById('novel-author').value.trim();
                const genreInput = document.getElementById('novel-genre').value;
                const synopsis = document.getElementById('novel-synopsis').value.trim();
                
                const genre = genreInput.split(',').map(g => g.trim()).filter(g => g);

                try {
                    const { data, error } = await window.Yoru.supabase
                        .from('novels')
                        .insert([{ id, title, author, genre, synopsis }]);

                    if (error) throw error;
                    
                    if (window.Yoru.UI && window.Yoru.UI.toast) {
                        window.Yoru.UI.toast('Novel added successfully', 'success');
                    } else {
                        alert('Novel added successfully');
                    }
                    addNovelForm.reset();
                } catch (error) {
                    console.error('Error adding novel:', error);
                    if (window.Yoru.UI && window.Yoru.UI.toast) {
                        window.Yoru.UI.toast('Error adding novel: ' + error.message, 'error');
                    } else {
                        alert('Error adding novel: ' + error.message);
                    }
                }
            });
        }

        const addChapterForm = document.getElementById('add-chapter-form');
        if (addChapterForm) {
            addChapterForm.addEventListener('submit', async function(e) {
                e.preventDefault();
                
                const novel_id = document.getElementById('chapter-novel-id').value.trim();
                const id = document.getElementById('chapter-id').value.trim();
                const title = document.getElementById('chapter-title').value.trim();
                const content = document.getElementById('chapter-content').value.trim();

                try {
                    const { data, error } = await window.Yoru.supabase
                        .from('chapters')
                        .insert([{ novel_id, id, title, content }]);

                    if (error) throw error;
                    
                    if (window.Yoru.UI && window.Yoru.UI.toast) {
                        window.Yoru.UI.toast('Chapter added successfully', 'success');
                    } else {
                        alert('Chapter added successfully');
                    }
                    addChapterForm.reset();
                } catch (error) {
                    console.error('Error adding chapter:', error);
                    if (window.Yoru.UI && window.Yoru.UI.toast) {
                        window.Yoru.UI.toast('Error adding chapter: ' + error.message, 'error');
                    } else {
                        alert('Error adding chapter: ' + error.message);
                    }
                }
            });
        }
    }
};
