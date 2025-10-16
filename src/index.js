import './styles/main.css';
import { App } from './components/App.js';
import { OfflineManager } from './utils/OfflineManager.js';
import { Analytics } from './utils/Analytics.js';
import { Localization } from './utils/Localization.js';

// Initialize the application
class LearningPlatform {
    constructor() {
        this.offlineManager = new OfflineManager();
        this.analytics = new Analytics();
        this.localization = new Localization();
        this.init();
    }

    async init() {
        try {
            // Initialize offline capabilities
            await this.offlineManager.init();
            
            // Initialize analytics
            await this.analytics.init();
            
            // Initialize localization
            await this.localization.init();
            
            // Initialize the main app
            this.app = new App({
                offlineManager: this.offlineManager,
                analytics: this.analytics,
                localization: this.localization
            });
            
            // Mount the app
            this.app.mount('#app');
            
            console.log('Learning Platform initialized successfully');
        } catch (error) {
            console.error('Failed to initialize Learning Platform:', error);
            this.showError('Failed to load the learning platform. Please refresh the page.');
        }
    }

    showError(message) {
        const app = document.getElementById('app');
        app.innerHTML = `
            <div class="error-container">
                <div class="error-icon">⚠️</div>
                <h2>Oops! Something went wrong</h2>
                <p>${message}</p>
                <button onclick="location.reload()" class="retry-button">Try Again</button>
            </div>
        `;
    }
}

// Start the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new LearningPlatform();
});

// Handle online/offline status changes
window.addEventListener('online', () => {
    console.log('Connection restored');
    // Trigger sync when back online
    if (window.learningPlatform?.offlineManager) {
        window.learningPlatform.offlineManager.sync();
    }
});

window.addEventListener('offline', () => {
    console.log('Connection lost - working offline');
});

// Make the platform globally accessible for debugging
window.learningPlatform = null;
document.addEventListener('DOMContentLoaded', () => {
    window.learningPlatform = new LearningPlatform();
});
