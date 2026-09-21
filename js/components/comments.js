window.Yoru = window.Yoru || {};
window.Yoru.UI = window.Yoru.UI || {};

/**
 * Returns the HTML for the comments section
 * @param {string} novelId 
 * @param {string} chapterId (Optional)
 * @returns {string} HTML string
 */
window.Yoru.UI.renderCommentsSection = function(novelId, chapterId) {
    const isAuthenticated = window.Yoru.auth ? window.Yoru.auth.isAuthenticated() : false;
    const user = window.Yoru.auth ? window.Yoru.auth.getUser() : null;
    
    // Ensure string 'null' isn't used if chapterId is undefined
    const safeChapterId = chapterId ? `'${chapterId}'` : 'null';

    return `
        <div class="comments-section" id="comments-section">
            <h3 class="comments-section__title">Comments</h3>
            ${isAuthenticated ? `
                <div class="comments-section__form-container">
                    <img src="${user.avatar_url || '/assets/default-avatar.png'}" alt="Avatar" class="comments-section__avatar">
                    <form class="comments-section__form" onsubmit="event.preventDefault(); window.Yoru.submitComment('${novelId}', ${safeChapterId})">
                        <textarea id="comment-input" class="comments-section__input" placeholder="Write a comment..." required rows="3"></textarea>
                        <button type="submit" class="btn btn--primary comments-section__submit">Post Comment</button>
                    </form>
                </div>
            ` : `
                <div class="comments-section__login-prompt">
                    <p>Please <a href="#" onclick="event.preventDefault(); window.Yoru.router.navigate('/login')">log in</a> to leave a comment.</p>
                </div>
            `}
            <div id="comments-list" class="comments-list">
                <div class="comments-list__loading">Loading comments...</div>
            </div>
        </div>
    `;
};

/**
 * Submits a new comment to Supabase
 * @param {string} novelId 
 * @param {string|null} chapterId 
 */
window.Yoru.submitComment = async function(novelId, chapterId) {
    if (!window.Yoru.auth.isAuthenticated()) {
        window.Yoru.UI.toast('You must be logged in to comment.', 'error');
        return;
    }

    const inputEl = document.getElementById('comment-input');
    const content = inputEl.value.trim();

    if (!content) {
        window.Yoru.UI.toast('Comment cannot be empty.', 'error');
        return;
    }

    const user = window.Yoru.auth.getUser();

    try {
        const { error } = await window.Yoru.supabase
            .from('comments')
            .insert([
                {
                    user_id: user.id,
                    novel_id: novelId,
                    chapter_id: chapterId,
                    content: content
                }
            ]);

        if (error) throw error;

        inputEl.value = '';
        window.Yoru.UI.toast('Comment posted successfully!', 'success');
        
        // Refresh comments list
        await window.Yoru.loadComments(novelId, chapterId);
    } catch (error) {
        console.error('Error submitting comment:', error);
        window.Yoru.UI.toast('Failed to post comment. Please try again.', 'error');
    }
};

/**
 * Loads comments from Supabase and renders them in the list container
 * @param {string} novelId 
 * @param {string|null} chapterId 
 */
window.Yoru.loadComments = async function(novelId, chapterId) {
    const listContainer = document.getElementById('comments-list');
    if (!listContainer) return;

    listContainer.innerHTML = '<div class="comments-list__loading">Loading comments...</div>';

    try {
        let query = window.Yoru.supabase
            .from('comments')
            .select(\`
                id,
                content,
                created_at,
                profiles (
                    username,
                    avatar_url,
                    role
                )
            \`)
            .eq('novel_id', novelId)
            .order('created_at', { ascending: false });

        if (chapterId) {
            query = query.eq('chapter_id', chapterId);
        } else {
            query = query.is('chapter_id', null);
        }

        const { data, error } = await query;

        if (error) throw error;

        if (!data || data.length === 0) {
            listContainer.innerHTML = '<div class="comments-list__empty">No comments yet. Be the first to comment!</div>';
            return;
        }

        listContainer.innerHTML = data.map(comment => {
            // Handle array or object from join depending on relationship setup
            const profile = Array.isArray(comment.profiles) ? comment.profiles[0] : comment.profiles || {};
            const username = profile.username || 'Unknown User';
            const avatarUrl = profile.avatar_url || '/assets/default-avatar.png';
            const date = new Date(comment.created_at).toLocaleDateString(undefined, {
                year: 'numeric', month: 'short', day: 'numeric',
                hour: '2-digit', minute: '2-digit'
            });

            return \`
                <div class="comment" id="comment-\${comment.id}">
                    <img src="\${avatarUrl}" alt="\${username}'s avatar" class="comment__avatar">
                    <div class="comment__content-wrapper">
                        <div class="comment__header">
                            <span class="comment__username \${profile.role === 'admin' ? 'comment__username--admin' : ''}">\${username}</span>
                            <span class="comment__date">\${date}</span>
                        </div>
                        <div class="comment__text">\${window.Yoru.UI.escapeHTML ? window.Yoru.UI.escapeHTML(comment.content) : comment.content}</div>
                    </div>
                </div>
            \`;
        }).join('');

    } catch (error) {
        console.error('Error loading comments:', error);
        listContainer.innerHTML = '<div class="comments-list__error">Failed to load comments.</div>';
    }
};

// Add a simple HTML escape function if not exists
window.Yoru.UI.escapeHTML = window.Yoru.UI.escapeHTML || function(str) {
    if (typeof str !== 'string') return str;
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
};
