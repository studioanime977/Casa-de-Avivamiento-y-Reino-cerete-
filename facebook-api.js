// Facebook API Integration for Casa de Avivamiento y Reino Cerete
// Automatic detection and display of recent Facebook activities

class FacebookActivityFeed {
    constructor() {
        this.pageId = 'casadeavivamientoyreinocerete';
        this.accessToken = ''; // Will be set from environment or user input
        this.apiVersion = 'v18.0';
        this.baseUrl = `https://graph.facebook.com/${this.apiVersion}`;
        this.refreshInterval = 300000; // 5 minutes
        this.maxPosts = 10;
        
        this.init();
    }

    init() {
        this.loadRecentActivities();
        this.startAutoRefresh();
        this.setupEventListeners();
    }

    // Load recent Facebook activities
    async loadRecentActivities() {
        try {
            const activities = await this.fetchRecentPosts();
            this.displayActivities(activities);
            this.updateLastRefresh();
        } catch (error) {
            console.error('Error loading Facebook activities:', error);
            this.showFallbackContent();
        }
    }

    // Fetch recent posts from Facebook Graph API
    async fetchRecentPosts() {
        if (!this.accessToken) {
            throw new Error('Facebook Access Token not configured');
        }

        const fields = 'id,message,story,created_time,type,attachments{media,url,title},permalink_url,reactions.summary(true),comments.summary(true),shares';
        const url = `${this.baseUrl}/${this.pageId}/posts?fields=${fields}&limit=${this.maxPosts}&access_token=${this.accessToken}`;

        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Facebook API error: ${response.status}`);
        }

        const data = await response.json();
        return data.data || [];
    }

    // Display activities in the UI
    displayActivities(activities) {
        const container = document.getElementById('facebook-recent-activities');
        if (!container) return;

        container.innerHTML = '';

        if (activities.length === 0) {
            container.innerHTML = '<p class="no-activities">No hay actividades recientes disponibles.</p>';
            return;
        }

        activities.forEach(activity => {
            const activityElement = this.createActivityElement(activity);
            container.appendChild(activityElement);
        });
    }

    // Create HTML element for each activity
    createActivityElement(activity) {
        const div = document.createElement('div');
        div.className = 'facebook-activity-item';
        
        const timeAgo = this.getTimeAgo(activity.created_time);
        const activityType = this.getActivityType(activity);
        const content = activity.message || activity.story || 'Nueva actividad';
        
        div.innerHTML = `
            <div class="activity-header">
                <div class="activity-type">
                    <i class="${this.getActivityIcon(activity)}"></i>
                    <span>${activityType}</span>
                </div>
                <div class="activity-time">${timeAgo}</div>
            </div>
            <div class="activity-content">
                <p>${this.truncateText(content, 150)}</p>
                ${this.getActivityMedia(activity)}
            </div>
            <div class="activity-stats">
                ${this.getActivityStats(activity)}
                <a href="${activity.permalink_url}" target="_blank" class="view-post-btn">
                    <i class="fas fa-external-link-alt"></i> Ver en Facebook
                </a>
            </div>
        `;

        return div;
    }

    // Get activity type based on post data
    getActivityType(activity) {
        if (activity.attachments && activity.attachments.data) {
            const attachment = activity.attachments.data[0];
            if (attachment.media && attachment.media.source) {
                return 'Video/Reel';
            }
            if (attachment.media && attachment.media.image) {
                return 'Foto';
            }
        }
        return 'Publicación';
    }

    // Get appropriate icon for activity type
    getActivityIcon(activity) {
        const type = this.getActivityType(activity);
        switch (type) {
            case 'Video/Reel': return 'fas fa-video';
            case 'Foto': return 'fas fa-image';
            default: return 'fas fa-edit';
        }
    }

    // Get media content for activity
    getActivityMedia(activity) {
        if (!activity.attachments || !activity.attachments.data) return '';
        
        const attachment = activity.attachments.data[0];
        if (attachment.media) {
            if (attachment.media.image) {
                return `<div class="activity-media">
                    <img src="${attachment.media.image.src}" alt="Imagen de la publicación" loading="lazy">
                </div>`;
            }
        }
        return '';
    }

    // Get activity statistics
    getActivityStats(activity) {
        const reactions = activity.reactions ? activity.reactions.summary.total_count : 0;
        const comments = activity.comments ? activity.comments.summary.total_count : 0;
        const shares = activity.shares ? activity.shares.count : 0;

        return `
            <div class="activity-engagement">
                <span class="stat-item">
                    <i class="fas fa-heart"></i> ${reactions}
                </span>
                <span class="stat-item">
                    <i class="fas fa-comment"></i> ${comments}
                </span>
                <span class="stat-item">
                    <i class="fas fa-share"></i> ${shares}
                </span>
            </div>
        `;
    }

    // Calculate time ago
    getTimeAgo(dateString) {
        const now = new Date();
        const postDate = new Date(dateString);
        const diffInMinutes = Math.floor((now - postDate) / (1000 * 60));

        if (diffInMinutes < 60) {
            return `hace ${diffInMinutes} min`;
        } else if (diffInMinutes < 1440) {
            const hours = Math.floor(diffInMinutes / 60);
            return `hace ${hours}h`;
        } else {
            const days = Math.floor(diffInMinutes / 1440);
            return `hace ${days}d`;
        }
    }

    // Truncate text to specified length
    truncateText(text, maxLength) {
        if (!text) return '';
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    }

    // Start automatic refresh
    startAutoRefresh() {
        setInterval(() => {
            this.loadRecentActivities();
        }, this.refreshInterval);
    }

    // Setup event listeners
    setupEventListeners() {
        const refreshBtn = document.getElementById('refresh-activities-btn');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => {
                this.loadRecentActivities();
            });
        }
    }

    // Update last refresh time display
    updateLastRefresh() {
        const lastRefreshElement = document.getElementById('last-refresh-time');
        if (lastRefreshElement) {
            const now = new Date();
            lastRefreshElement.textContent = `Última actualización: ${now.toLocaleTimeString('es-ES')}`;
        }
    }

    // Show fallback content when API fails
    showFallbackContent() {
        const container = document.getElementById('facebook-recent-activities');
        if (!container) return;

        container.innerHTML = `
            <div class="fallback-content">
                <div class="fallback-message">
                    <i class="fas fa-wifi"></i>
                    <h4>Conectando con Facebook...</h4>
                    <p>Para ver las actividades más recientes, visita nuestra página de Facebook.</p>
                    <a href="https://www.facebook.com/casadeavivamientoyreinocerete" target="_blank" class="btn btn-primary">
                        <i class="fab fa-facebook"></i> Ir a Facebook
                    </a>
                </div>
            </div>
        `;
    }

    // Set access token (to be called from main application)
    setAccessToken(token) {
        this.accessToken = token;
    }

    // Manual refresh method
    refresh() {
        this.loadRecentActivities();
    }
}

// Initialize Facebook Activity Feed when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on a page that needs Facebook activities
    if (document.getElementById('facebook-recent-activities')) {
        window.facebookFeed = new FacebookActivityFeed();
        
        // Try to load access token from localStorage or prompt user
        const savedToken = localStorage.getItem('facebook_access_token');
        if (savedToken) {
            window.facebookFeed.setAccessToken(savedToken);
        } else {
            // Show setup instructions
            console.log('Facebook Access Token needed for live updates');
        }
    }
});

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FacebookActivityFeed;
}
