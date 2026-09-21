window.Yoru = window.Yoru || {};
window.Yoru.Pages = window.Yoru.Pages || {};

window.Yoru.Pages.Contact = {
    render: function() {
        return `
            ${window.Yoru.UI && window.Yoru.UI.renderHeader ? window.Yoru.UI.renderHeader() : ''}
            <main class="contact-page container" style="min-height: 70vh; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 2rem; color: #e0e0e0;">
                <h1 style="color: #dc143c; margin-bottom: 1rem; font-size: 2.5rem; text-transform: uppercase; letter-spacing: 2px; text-shadow: 0 2px 4px rgba(0,0,0,0.5);">Contact Us</h1>
                
                <p style="margin-bottom: 2.5rem; max-width: 600px; font-size: 1.2rem; line-height: 1.6; opacity: 0.9;">
                    Have questions, suggestions, or experiencing issues on the platform? Reach out to our administrator directly. We are always looking for ways to improve your reading experience on Yoru.
                </p>
                
                <a href="https://t.me/yorunovel" target="_blank" rel="noopener noreferrer" style="display: inline-flex; align-items: center; justify-content: center; background: linear-gradient(135deg, #dc143c 0%, #8b0000 100%); color: #ffffff; padding: 1rem 2.5rem; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 1.2rem; transition: transform 0.2s ease, box-shadow 0.2s ease; box-shadow: 0 4px 15px rgba(220, 20, 60, 0.3); border: 1px solid #dc143c;">
                    <svg style="width: 24px; height: 24px; margin-right: 12px; fill: currentColor;" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.18-.08-.05-.19-.02-.27 0-.12.03-1.97 1.25-5.56 3.67-.53.36-1.01.54-1.44.53-.47-.01-1.38-.27-2.06-.49-.83-.27-1.49-.41-1.43-.87.03-.24.37-.48 1.03-.73 4.03-1.75 6.72-2.91 8.07-3.47 3.83-1.59 4.63-1.87 5.16-1.88.11 0 .37.03.54.17.14.12.18.28.2.42-.01.06-.01.12-.02.26z"/>
                    </svg>
                    Contact via Telegram
                </a>
                
                <div style="margin-top: 3rem; font-size: 0.9rem; opacity: 0.6;">
                    <p>Admin Telegram: <span style="color: #ffd700;">@yorunovel</span></p>
                </div>
            </main>
        `;
    },
    
    afterRender: function() {
        document.title = 'Contact Us - Yoru';
        window.scrollTo(0, 0);
        
        // Add hover effects for the button
        const btn = document.querySelector('.contact-page a');
        if (btn) {
            btn.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-2px)';
                this.style.boxShadow = '0 6px 20px rgba(220, 20, 60, 0.5)';
            });
            btn.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0)';
                this.style.boxShadow = '0 4px 15px rgba(220, 20, 60, 0.3)';
            });
        }
    }
};
