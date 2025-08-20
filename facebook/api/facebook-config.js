// Facebook API Configuration for Casa de Avivamiento y Reino Cerete
// Configuration file for Facebook integration

const FacebookConfig = {
    // Facebook Page Configuration
    pageId: 'casadeavivamientoyreinocerete',
    pageName: 'Casa de Avivamiento y Reino Cerete',
    pageUrl: 'https://www.facebook.com/casadeavivamientoyreinocerete',
    
    // API Configuration
    apiVersion: 'v18.0',
    locale: 'es_LA',
    
    // Access Token (needs to be configured)
    // To get an access token:
    // 1. Go to https://developers.facebook.com/tools/explorer/
    // 2. Select your app or create a new one
    // 3. Generate a Page Access Token with the following permissions:
    //    - pages_read_engagement
    //    - pages_show_list
    //    - public_profile
    accessToken: '', // Add your Facebook Page Access Token here
    
    // Refresh Settings
    refreshInterval: 300000, // 5 minutes in milliseconds
    maxPosts: 10,
    
    // Display Settings
    showImages: true,
    showVideos: true,
    showReels: true,
    truncateLength: 150,
    
    // Auto-refresh on page load
    autoStart: true,
    
    // Fallback content when API is not available
    fallbackEnabled: true,
    
    // Initialize Facebook integration
    init: function() {
        if (this.accessToken && window.facebookFeed) {
            window.facebookFeed.setAccessToken(this.accessToken);
            console.log('Facebook API configurado correctamente');
        } else if (!this.accessToken) {
            console.warn('Facebook Access Token no configurado. Las actividades recientes no estarán disponibles.');
            this.showSetupInstructions();
        }
    },
    
    // Show setup instructions
    showSetupInstructions: function() {
        const container = document.getElementById('facebook-recent-activities');
        if (container) {
            container.innerHTML = `
                <div class="setup-instructions">
                    <div class="setup-card">
                        <i class="fab fa-facebook" style="font-size: 48px; color: #1877f2; margin-bottom: 15px;"></i>
                        <h4>Configuración de Facebook API</h4>
                        <p>Para mostrar actividades recientes automáticamente, necesitas configurar un Access Token de Facebook.</p>
                        
                        <div class="setup-steps">
                            <h5>Pasos para configurar:</h5>
                            <ol>
                                <li>Ve a <a href="https://developers.facebook.com/tools/explorer/" target="_blank">Facebook Graph API Explorer</a></li>
                                <li>Selecciona tu aplicación de Facebook o crea una nueva</li>
                                <li>Genera un "Page Access Token" con permisos:
                                    <ul>
                                        <li>pages_read_engagement</li>
                                        <li>pages_show_list</li>
                                        <li>public_profile</li>
                                    </ul>
                                </li>
                                <li>Copia el token y pégalo en el archivo <code>facebook-config.js</code></li>
                                <li>Recarga la página</li>
                            </ol>
                        </div>
                        
                        <div class="manual-token-input" style="margin-top: 20px;">
                            <h5>O ingresa el token manualmente:</h5>
                            <div style="display: flex; gap: 10px; margin-top: 10px;">
                                <input type="password" id="manual-token-input" placeholder="Pega tu Access Token aquí" 
                                       style="flex: 1; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                                <button onclick="FacebookConfig.setManualToken()" 
                                        style="background: #1877f2; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer;">
                                    Configurar
                                </button>
                            </div>
                        </div>
                        
                        <div style="margin-top: 20px;">
                            <a href="${this.pageUrl}" target="_blank" class="btn btn-primary">
                                <i class="fab fa-facebook"></i> Ver página de Facebook
                            </a>
                        </div>
                    </div>
                </div>
            `;
        }
    },
    
    // Set token manually from input
    setManualToken: function() {
        const tokenInput = document.getElementById('manual-token-input');
        if (tokenInput && tokenInput.value.trim()) {
            const token = tokenInput.value.trim();
            this.accessToken = token;
            localStorage.setItem('facebook_access_token', token);
            
            if (window.facebookFeed) {
                window.facebookFeed.setAccessToken(token);
                window.facebookFeed.refresh();
            }
            
            // Show success message
            const container = document.getElementById('facebook-recent-activities');
            if (container) {
                container.innerHTML = `
                    <div style="text-align: center; padding: 20px;">
                        <i class="fas fa-check-circle" style="color: #28a745; font-size: 48px; margin-bottom: 15px;"></i>
                        <h4>¡Configuración exitosa!</h4>
                        <p>Cargando actividades recientes...</p>
                    </div>
                `;
            }
            
            // Reload activities after a short delay
            setTimeout(() => {
                if (window.facebookFeed) {
                    window.facebookFeed.refresh();
                }
            }, 2000);
        } else {
            alert('Por favor, ingresa un Access Token válido.');
        }
    },
    
    // Load saved token from localStorage
    loadSavedToken: function() {
        const savedToken = localStorage.getItem('facebook_access_token');
        if (savedToken) {
            this.accessToken = savedToken;
            return true;
        }
        return false;
    }
};

// Auto-initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Load saved token
    FacebookConfig.loadSavedToken();
    
    // Initialize configuration
    setTimeout(() => {
        FacebookConfig.init();
    }, 1000);
});

// Export for global access
window.FacebookConfig = FacebookConfig;
