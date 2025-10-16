export class OfflineIndicator {
    constructor(offlineManager) {
        this.offlineManager = offlineManager;
        this.isOnline = navigator.onLine;
        this.syncStatus = 'idle'; // idle, syncing, success, error
        this.setupEventListeners();
    }

    render() {
        const statusIcon = this.getStatusIcon();
        const statusText = this.getStatusText();
        const statusClass = this.getStatusClass();

        return `
            <div class="offline-indicator ${statusClass}" id="offline-indicator">
                <div class="indicator-icon">${statusIcon}</div>
                <div class="indicator-text">${statusText}</div>
                ${this.syncStatus === 'syncing' ? '<div class="loading"></div>' : ''}
            </div>
        `;
    }

    getStatusIcon() {
        if (!this.isOnline) {
            return '📡';
        }
        
        switch (this.syncStatus) {
            case 'syncing':
                return '🔄';
            case 'success':
                return '✅';
            case 'error':
                return '❌';
            default:
                return '🌐';
        }
    }

    getStatusText() {
        if (!this.isOnline) {
            return 'Offline';
        }
        
        switch (this.syncStatus) {
            case 'syncing':
                return 'Syncing...';
            case 'success':
                return 'Synced';
            case 'error':
                return 'Sync Error';
            default:
                return 'Online';
        }
    }

    getStatusClass() {
        if (!this.isOnline) {
            return 'offline';
        }
        
        switch (this.syncStatus) {
            case 'syncing':
                return 'syncing';
            case 'success':
                return 'success';
            case 'error':
                return 'error';
            default:
                return 'online';
        }
    }

    setupEventListeners() {
        window.addEventListener('online', () => {
            this.isOnline = true;
            this.updateStatus();
            this.triggerSync();
        });

        window.addEventListener('offline', () => {
            this.isOnline = false;
            this.updateStatus();
        });
    }

    updateStatus() {
        const indicator = document.getElementById('offline-indicator');
        if (indicator) {
            indicator.innerHTML = this.render();
        }
    }

    async triggerSync() {
        if (!this.isOnline || !this.offlineManager) {
            return;
        }

        this.syncStatus = 'syncing';
        this.updateStatus();

        try {
            await this.offlineManager.sync();
            this.syncStatus = 'success';
            this.updateStatus();
            
            // Reset to idle after 3 seconds
            setTimeout(() => {
                this.syncStatus = 'idle';
                this.updateStatus();
            }, 3000);
        } catch (error) {
            console.error('Sync failed:', error);
            this.syncStatus = 'error';
            this.updateStatus();
            
            // Reset to idle after 5 seconds
            setTimeout(() => {
                this.syncStatus = 'idle';
                this.updateStatus();
            }, 5000);
        }
    }

    mount(selector) {
        const container = document.querySelector(selector);
        if (container) {
            container.innerHTML = this.render();
        }
    }
}
