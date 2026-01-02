// ===========================
// Social Sharing Functionality
// ===========================

class SocialSharing {
    constructor() {
        this.shareData = {
            title: 'Ryan James Indangan - Full-Stack Developer & AI/ML Engineer',
            text: 'Check out this amazing interactive portfolio! 8+ years of experience in Full-Stack Development, AI/ML, Document Intelligence, and more.',
            url: window.location.href
        };
        this.init();
    }
    
    init() {
        // Add social sharing buttons to various sections
        this.addSharingToAbout();
        this.addSharingToProjects();
        this.addGlobalShareButton();
    }
    
    // Share to specific platform
    shareToPlatform(platform) {
        const url = encodeURIComponent(this.shareData.url);
        const title = encodeURIComponent(this.shareData.title);
        const text = encodeURIComponent(this.shareData.text);
        
        let shareUrl = '';
        
        switch(platform) {
            case 'twitter':
                shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${text}`;
                break;
            case 'linkedin':
                shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
                break;
            case 'facebook':
                shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
                break;
            case 'reddit':
                shareUrl = `https://reddit.com/submit?url=${url}&title=${title}`;
                break;
            case 'whatsapp':
                shareUrl = `https://wa.me/?text=${text}%20${url}`;
                break;
            case 'telegram':
                shareUrl = `https://t.me/share/url?url=${url}&text=${text}`;
                break;
            case 'email':
                shareUrl = `mailto:?subject=${title}&body=${text}%20${url}`;
                break;
            default:
                return;
        }
        
        if (shareUrl) {
            window.open(shareUrl, '_blank', 'width=600,height=400');
        }
    }
    
    // Use Web Share API if available (mobile)
    async nativeShare() {
        if (navigator.share) {
            try {
                await navigator.share(this.shareData);
            } catch (err) {
                // User cancelled or error
                console.log('Share cancelled or failed');
            }
        } else {
            // Fallback: show share menu
            this.showShareMenu();
        }
    }
    
    // Show share menu modal
    showShareMenu() {
        // Remove existing share menu if any
        const existing = document.getElementById('shareMenuModal');
        if (existing) {
            existing.remove();
        }
        
        const modal = document.createElement('div');
        modal.id = 'shareMenuModal';
        modal.className = 'share-menu-modal';
        modal.innerHTML = `
            <div class="share-menu-content">
                <div class="share-menu-header">
                    <h3>Share Portfolio</h3>
                    <button class="share-menu-close" onclick="this.closest('.share-menu-modal').remove()">×</button>
                </div>
                <div class="share-menu-buttons">
                    <button class="share-btn share-twitter" onclick="window.socialSharing.shareToPlatform('twitter')">
                        <span class="share-icon">🐦</span>
                        <span>Twitter</span>
                    </button>
                    <button class="share-btn share-linkedin" onclick="window.socialSharing.shareToPlatform('linkedin')">
                        <span class="share-icon">💼</span>
                        <span>LinkedIn</span>
                    </button>
                    <button class="share-btn share-facebook" onclick="window.socialSharing.shareToPlatform('facebook')">
                        <span class="share-icon">📘</span>
                        <span>Facebook</span>
                    </button>
                    <button class="share-btn share-reddit" onclick="window.socialSharing.shareToPlatform('reddit')">
                        <span class="share-icon">🤖</span>
                        <span>Reddit</span>
                    </button>
                    <button class="share-btn share-whatsapp" onclick="window.socialSharing.shareToPlatform('whatsapp')">
                        <span class="share-icon">💬</span>
                        <span>WhatsApp</span>
                    </button>
                    <button class="share-btn share-telegram" onclick="window.socialSharing.shareToPlatform('telegram')">
                        <span class="share-icon">✈️</span>
                        <span>Telegram</span>
                    </button>
                    <button class="share-btn share-email" onclick="window.socialSharing.shareToPlatform('email')">
                        <span class="share-icon">📧</span>
                        <span>Email</span>
                    </button>
                    <button class="share-btn share-copy" onclick="window.socialSharing.copyLink()">
                        <span class="share-icon">📋</span>
                        <span>Copy Link</span>
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Close on outside click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
        
        // Close on Escape key
        const closeHandler = (e) => {
            if (e.key === 'Escape') {
                modal.remove();
                document.removeEventListener('keydown', closeHandler);
            }
        };
        document.addEventListener('keydown', closeHandler);
    }
    
    // Copy link to clipboard
    async copyLink() {
        try {
            await navigator.clipboard.writeText(this.shareData.url);
            if (window.showNotification) {
                window.showNotification('Link copied to clipboard! 📋', 'success', 2000);
            }
            
            // Close share menu if open
            const modal = document.getElementById('shareMenuModal');
            if (modal) {
                setTimeout(() => modal.remove(), 500);
            }
        } catch (err) {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = this.shareData.url;
            textArea.style.position = 'fixed';
            textArea.style.opacity = '0';
            document.body.appendChild(textArea);
            textArea.select();
            try {
                document.execCommand('copy');
                if (window.showNotification) {
                    window.showNotification('Link copied to clipboard! 📋', 'success', 2000);
                }
            } catch (e) {
                if (window.showNotification) {
                    window.showNotification('Failed to copy link', 'error', 2000);
                }
            }
            document.body.removeChild(textArea);
        }
    }
    
    // Add sharing buttons to About section
    addSharingToAbout() {
        // This will be called when About app is opened
        // We'll add share buttons dynamically
    }
    
    // Add sharing buttons to Projects section
    addSharingToProjects() {
        // This will be called when Projects app is opened
        // We'll add share buttons dynamically
    }
    
    // Add global share button (can be added to taskbar or header)
    addGlobalShareButton() {
        // Add share button to taskbar or create a floating share button
        // This can be triggered from anywhere
    }
    
    // Create share button HTML
    createShareButton(platform = null, label = 'Share') {
        if (platform) {
            return `
                <button class="social-share-btn" onclick="window.socialSharing.shareToPlatform('${platform}')" title="Share on ${platform}">
                    <span class="share-icon">${this.getPlatformIcon(platform)}</span>
                    <span>${label}</span>
                </button>
            `;
        } else {
            return `
                <button class="social-share-btn share-primary" onclick="window.socialSharing.nativeShare()" title="Share portfolio">
                    <span class="share-icon">🔗</span>
                    <span>${label}</span>
                </button>
            `;
        }
    }
    
    getPlatformIcon(platform) {
        const icons = {
            'twitter': '🐦',
            'linkedin': '💼',
            'facebook': '📘',
            'reddit': '🤖',
            'whatsapp': '💬',
            'telegram': '✈️',
            'email': '📧'
        };
        return icons[platform] || '🔗';
    }
}

// Initialize on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.socialSharing = new SocialSharing();
    });
} else {
    window.socialSharing = new SocialSharing();
}

