/**
 * Facebook Posts API Integration
 * Fetches real, recent posts from Facebook Page
 */

class FacebookPostsAPI {
    constructor() {
        this.pageId = 'casadeavivamientoyreinocerete';
        // Use provided access token or fallback to localStorage
        this.accessToken = 'EAAUSJJlkXmwBPH6kiZBMstGBEutW1IiXtOfSf5XVfUENl3UtfDzfgQ1M3qYk3fUUiBZCCK61vIM3U0E0B6WZBkn8NFkHOJg0HRhZCCmnyjUB244VnONF4ihZAC6ESsmGYeAHF5YbKcSsdf9q2fWryZAI9VWEOGqLfK2Fl5oYNTAqq6ZBeVrnR5XldPIK5Weq7WMalWZBeKcdxguSSz1nnUyYcCBLpZBvem3MZAz0pl9ZCXHAIwbwZCXX' || localStorage.getItem('facebook_access_token') || '';
        this.apiVersion = 'v18.0';
        this.baseUrl = `https://graph.facebook.com/${this.apiVersion}`;
        this.postsContainer = document.querySelector('.posts-container');
        this.refreshBtn = document.getElementById('refresh-posts');
        
        // Store the token for future use
        if (this.accessToken) {
            localStorage.setItem('facebook_access_token', this.accessToken);
        }
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.loadPosts();
        
        // Auto-refresh every 5 minutes
        setInterval(() => {
            this.loadPosts();
        }, 5 * 60 * 1000);
    }
    
    setupEventListeners() {
        if (this.refreshBtn) {
            this.refreshBtn.addEventListener('click', () => {
                this.loadPosts();
            });
        }
        
        // Load more button
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('load-more-btn')) {
                this.loadMorePosts();
            }
        });
    }
    
    async loadPosts() {
        try {
            this.showLoading();
            
            if (!this.accessToken) {
                this.showTokenInput();
                return;
            }
            
            const posts = await this.fetchPosts();
            this.renderPosts(posts);
            this.hideLoading();
            
        } catch (error) {
            console.error('Error loading posts:', error);
            this.showError('Error al cargar las publicaciones. Verifica tu token de acceso.');
        }
    }
    
    async fetchPosts(limit = 10, after = null) {
        const fields = [
            'id',
            'message',
            'story',
            'full_picture',
            'attachments{media,type,title,description,url}',
            'created_time',
            'updated_time',
            'type',
            'status_type',
            'link',
            'name',
            'caption',
            'description',
            'picture',
            'source',
            'likes.summary(true)',
            'comments.summary(true)',
            'shares'
        ].join(',');
        
        let url = `${this.baseUrl}/${this.pageId}/posts?fields=${fields}&limit=${limit}&access_token=${this.accessToken}`;
        
        if (after) {
            url += `&after=${after}`;
        }
        
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.error) {
            throw new Error(data.error.message);
        }
        
        return data;
    }
    
    renderPosts(data) {
        if (!data.data || data.data.length === 0) {
            this.showEmptyState();
            return;
        }
        
        // Clear existing posts (except load more button)
        const loadMoreContainer = this.postsContainer.querySelector('.load-more-container');
        this.postsContainer.innerHTML = '';
        
        data.data.forEach(post => {
            const postElement = this.createPostElement(post);
            this.postsContainer.appendChild(postElement);
        });
        
        // Re-add load more button
        if (loadMoreContainer) {
            this.postsContainer.appendChild(loadMoreContainer);
        }
        
        // Store pagination info
        this.paginationInfo = data.paging;
    }
    
    createPostElement(post) {
        const article = document.createElement('article');
        article.className = `facebook-post ${this.getPostType(post)}`;
        
        const postTime = this.formatTime(post.created_time);
        const engagement = this.getEngagement(post);
        
        article.innerHTML = `
            <div class="post-header">
                <div class="post-avatar">
                    <img src="https://graph.facebook.com/${this.pageId}/picture?type=normal&access_token=${this.accessToken}" 
                         alt="Casa de Avivamiento y Reino Cerete"
                         onerror="this.src='https://via.placeholder.com/40x40/6c5ce7/ffffff?text=CA'">
                </div>
                <div class="post-info">
                    <h3 class="page-name">Casa de Avivamiento y Reino Cerete</h3>
                    <div class="post-meta">
                        <span class="post-time">${postTime}</span>
                        <i class="fas fa-globe-americas"></i>
                    </div>
                </div>
                <div class="post-options">
                    <button class="options-btn"><i class="fas fa-ellipsis-h"></i></button>
                </div>
            </div>
            
            <div class="post-content">
                ${this.renderPostContent(post)}
            </div>
            
            <div class="post-engagement">
                <div class="engagement-stats">
                    <div class="reactions-count">
                        <div class="reaction-icons">
                            <i class="fas fa-heart" style="color: #f33e58;"></i>
                            <i class="fas fa-thumbs-up" style="color: #1877f2;"></i>
                        </div>
                        <span>${engagement.likes}</span>
                    </div>
                    <div class="comments-shares">
                        <span>${engagement.comments} comentarios</span>
                        <span>${engagement.shares} veces compartido</span>
                    </div>
                </div>
                
                <div class="engagement-actions">
                    <button class="action-btn" onclick="window.open('https://www.facebook.com/${post.id}', '_blank')">
                        <i class="fas fa-thumbs-up"></i> Me gusta
                    </button>
                    <button class="action-btn" onclick="window.open('https://www.facebook.com/${post.id}', '_blank')">
                        <i class="fas fa-comment"></i> Comentar
                    </button>
                    <button class="action-btn" onclick="window.open('https://www.facebook.com/${post.id}', '_blank')">
                        <i class="fas fa-share"></i> Compartir
                    </button>
                </div>
            </div>
        `;
        
        return article;
    }
    
    renderPostContent(post) {
        let content = '';
        
        // Add text content
        if (post.message || post.story) {
            const text = post.message || post.story;
            content += `<p class="post-text">${this.formatText(text)}</p>`;
        }
        
        // Add media content based on type
        if (post.attachments && post.attachments.data.length > 0) {
            const attachment = post.attachments.data[0];
            
            switch (attachment.type) {
                case 'video_inline':
                case 'video_autoplay':
                    content += this.renderVideo(post, attachment);
                    break;
                case 'photo':
                    content += this.renderPhoto(post, attachment);
                    break;
                case 'album':
                    content += this.renderPhotoAlbum(post, attachment);
                    break;
                case 'share':
                case 'link':
                    content += this.renderLink(post, attachment);
                    break;
            }
        } else if (post.full_picture) {
            // Fallback for posts with pictures
            content += `
                <div class="photo-container">
                    <img src="${post.full_picture}" alt="Publicación" class="post-photo">
                </div>
            `;
        }
        
        return content;
    }
    
    renderVideo(post, attachment) {
        const videoId = post.id;
        return `
            <div class="video-container">
                <div class="video-player">
                    <iframe src="https://www.facebook.com/plugins/video.php?height=314&href=https%3A%2F%2Fwww.facebook.com%2F${videoId}&show_text=false&width=560&t=0" 
                            width="100%" 
                            height="300" 
                            style="border:none;overflow:hidden" 
                            scrolling="no" 
                            frameborder="0" 
                            allowfullscreen="true" 
                            allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share">
                    </iframe>
                </div>
                <div class="video-info">
                    <div class="video-duration">
                        <i class="fas fa-play"></i>
                        <span>Video</span>
                    </div>
                </div>
            </div>
        `;
    }
    
    renderPhoto(post, attachment) {
        const imageUrl = attachment.media?.image?.src || post.full_picture || post.picture;
        if (!imageUrl) return '';
        
        return `
            <div class="photo-container">
                <img src="${imageUrl}" alt="${attachment.title || 'Foto'}" class="post-photo">
            </div>
        `;
    }
    
    renderPhotoAlbum(post, attachment) {
        // For albums, show the first photo with indicator
        const imageUrl = attachment.media?.image?.src || post.full_picture;
        if (!imageUrl) return '';
        
        return `
            <div class="photo-container">
                <img src="${imageUrl}" alt="Álbum de fotos" class="post-photo">
                <div class="album-indicator">
                    <i class="fas fa-images"></i>
                    <span>Álbum</span>
                </div>
            </div>
        `;
    }
    
    renderLink(post, attachment) {
        if (!attachment.url) return '';
        
        return `
            <div class="link-preview">
                ${attachment.media?.image ? `<img src="${attachment.media.image.src}" alt="${attachment.title}" class="link-image">` : ''}
                <div class="link-content">
                    <h4>${attachment.title || ''}</h4>
                    <p>${attachment.description || ''}</p>
                    <span class="link-url">${new URL(attachment.url).hostname}</span>
                </div>
            </div>
        `;
    }
    
    getPostType(post) {
        if (post.attachments && post.attachments.data.length > 0) {
            const type = post.attachments.data[0].type;
            switch (type) {
                case 'video_inline':
                case 'video_autoplay':
                    return 'video-post';
                case 'photo':
                case 'album':
                    return 'photo-post';
                case 'share':
                case 'link':
                    return 'link-post';
                default:
                    return 'text-post';
            }
        }
        return 'text-post';
    }
    
    getEngagement(post) {
        return {
            likes: post.likes?.summary?.total_count || 0,
            comments: post.comments?.summary?.total_count || 0,
            shares: post.shares?.count || 0
        };
    }
    
    formatTime(timestamp) {
        const date = new Date(timestamp);
        const now = new Date();
        const diffMs = now - date;
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffDays = Math.floor(diffHours / 24);
        
        if (diffHours < 1) {
            return 'hace menos de 1 hora';
        } else if (diffHours < 24) {
            return `hace ${diffHours} ${diffHours === 1 ? 'hora' : 'horas'}`;
        } else if (diffDays < 7) {
            return `hace ${diffDays} ${diffDays === 1 ? 'día' : 'días'}`;
        } else {
            return date.toLocaleDateString('es-ES', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            });
        }
    }
    
    formatText(text) {
        // Convert hashtags to links
        text = text.replace(/#(\w+)/g, '<span class="hashtag">#$1</span>');
        
        // Convert URLs to links
        text = text.replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank">$1</a>');
        
        // Convert line breaks
        text = text.replace(/\n/g, '<br>');
        
        return text;
    }
    
    showLoading() {
        if (this.refreshBtn) {
            this.refreshBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Cargando...';
            this.refreshBtn.disabled = true;
        }
    }
    
    hideLoading() {
        if (this.refreshBtn) {
            this.refreshBtn.innerHTML = '<i class="fas fa-sync-alt"></i> Actualizar';
            this.refreshBtn.disabled = false;
        }
    }
    
    showError(message) {
        this.postsContainer.innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-triangle"></i>
                <h3>Error al cargar publicaciones</h3>
                <p>${message}</p>
                <button class="btn btn-primary" onclick="location.reload()">
                    <i class="fas fa-refresh"></i> Intentar de nuevo
                </button>
            </div>
        `;
        this.hideLoading();
    }
    
    showEmptyState() {
        this.postsContainer.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-newspaper"></i>
                <h3>No hay publicaciones disponibles</h3>
                <p>No se encontraron publicaciones recientes.</p>
                <a href="https://www.facebook.com/casadeavivamientoyreinocerete" target="_blank" class="btn btn-primary">
                    <i class="fab fa-facebook"></i> Ver en Facebook
                </a>
            </div>
        `;
    }
    
    showTokenInput() {
        this.postsContainer.innerHTML = `
            <div class="token-input-container">
                <div class="token-card">
                    <h3><i class="fab fa-facebook"></i> Configuración de Facebook</h3>
                    <p>Para mostrar las publicaciones más recientes, necesitas configurar un token de acceso de Facebook.</p>
                    
                    <div class="token-input-group">
                        <label for="facebook-token">Token de Acceso de Facebook:</label>
                        <input type="password" id="facebook-token" placeholder="Ingresa tu token de acceso">
                        <button class="btn btn-primary" onclick="this.saveToken()">
                            <i class="fas fa-save"></i> Guardar y Cargar
                        </button>
                    </div>
                    
                    <div class="token-help">
                        <h4>¿Cómo obtener un token de acceso?</h4>
                        <ol>
                            <li>Ve a <a href="https://developers.facebook.com/tools/explorer" target="_blank">Facebook Graph API Explorer</a></li>
                            <li>Selecciona tu aplicación de Facebook</li>
                            <li>Genera un token de acceso con permisos de páginas</li>
                            <li>Copia y pega el token aquí</li>
                        </ol>
                    </div>
                </div>
            </div>
        `;
        
        // Add event listener for save button
        setTimeout(() => {
            const saveBtn = document.querySelector('.token-input-container .btn');
            if (saveBtn) {
                saveBtn.onclick = () => this.saveToken();
            }
        }, 100);
    }
    
    saveToken() {
        const tokenInput = document.getElementById('facebook-token');
        const token = tokenInput.value.trim();
        
        if (token) {
            localStorage.setItem('facebook_access_token', token);
            this.accessToken = token;
            this.loadPosts();
        } else {
            alert('Por favor ingresa un token válido.');
        }
    }
    
    async loadMorePosts() {
        if (!this.paginationInfo || !this.paginationInfo.next) {
            return;
        }
        
        try {
            const response = await fetch(this.paginationInfo.next);
            const data = await response.json();
            
            if (data.data && data.data.length > 0) {
                const loadMoreContainer = this.postsContainer.querySelector('.load-more-container');
                
                data.data.forEach(post => {
                    const postElement = this.createPostElement(post);
                    this.postsContainer.insertBefore(postElement, loadMoreContainer);
                });
                
                this.paginationInfo = data.paging;
            }
            
        } catch (error) {
            console.error('Error loading more posts:', error);
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new FacebookPostsAPI();
});
