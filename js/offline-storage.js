// Offline Storage Manager using IndexedDB
class OfflineStorage {
    constructor() {
        this.dbName = 'STEMPlatformDB';
        this.dbVersion = 1;
        this.db = null;
    }

    async init() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.dbVersion);
            
            request.onerror = () => {
                console.error('Failed to open IndexedDB:', request.error);
                reject(request.error);
            };
            
            request.onsuccess = () => {
                this.db = request.result;
                console.log('IndexedDB opened successfully');
                resolve();
            };
            
            request.onupgradeneeded = (event) => {
                this.db = event.target.result;
                this.createObjectStores();
            };
        });
    }

    createObjectStores() {
        // User data store
        if (!this.db.objectStoreNames.contains('users')) {
            this.db.createObjectStore('users', { keyPath: 'id' });
        }

        // Modules store
        if (!this.db.objectStoreNames.contains('modules')) {
            this.db.createObjectStore('modules', { keyPath: 'id' });
        }

        // Progress store
        if (!this.db.objectStoreNames.contains('progress')) {
            const progressStore = this.db.createObjectStore('progress', { keyPath: 'id', autoIncrement: true });
            progressStore.createIndex('userId', 'userId', { unique: false });
            progressStore.createIndex('moduleId', 'moduleId', { unique: false });
        }

        // Analytics store
        if (!this.db.objectStoreNames.contains('analytics')) {
            const analyticsStore = this.db.createObjectStore('analytics', { keyPath: 'id', autoIncrement: true });
            analyticsStore.createIndex('userId', 'userId', { unique: false });
            analyticsStore.createIndex('timestamp', 'timestamp', { unique: false });
        }

        // Offline queue store
        if (!this.db.objectStoreNames.contains('offlineQueue')) {
            const queueStore = this.db.createObjectStore('offlineQueue', { keyPath: 'id', autoIncrement: true });
            queueStore.createIndex('type', 'type', { unique: false });
            queueStore.createIndex('synced', 'synced', { unique: false });
        }

        // Settings store
        if (!this.db.objectStoreNames.contains('settings')) {
            this.db.createObjectStore('settings', { keyPath: 'key' });
        }
    }

    // User management
    async saveUser(user) {
        return this.addData('users', user);
    }

    async getUser() {
        const users = await this.getAllData('users');
        return users.length > 0 ? users[0] : null;
    }

    async clearUser() {
        return this.clearStore('users');
    }

    // Module management
    async saveModules(modules) {
        const transaction = this.db.transaction(['modules'], 'readwrite');
        const store = transaction.objectStore('modules');
        
        // Clear existing modules
        await store.clear();
        
        // Add new modules
        for (const module of modules) {
            await store.add(module);
        }
        
        return new Promise((resolve, reject) => {
            transaction.oncomplete = () => resolve();
            transaction.onerror = () => reject(transaction.error);
        });
    }

    async getModules() {
        return this.getAllData('modules');
    }

    async getModule(id) {
        return this.getData('modules', id);
    }

    async updateModule(module) {
        return this.updateData('modules', module);
    }

    // Progress tracking
    async saveProgress(progress) {
        progress.timestamp = new Date().toISOString();
        progress.synced = false;
        
        const result = await this.addData('progress', progress);
        
        // Add to offline queue for syncing
        await this.addToOfflineQueue('progress', progress);
        
        return result;
    }

    async getProgress(userId, moduleId = null) {
        const allProgress = await this.getAllData('progress');
        
        let filtered = allProgress.filter(p => p.userId === userId);
        
        if (moduleId) {
            filtered = filtered.filter(p => p.moduleId === moduleId);
        }
        
        return filtered;
    }

    async getUserProgress(userId) {
        const progress = await this.getProgress(userId);
        
        // Group by module and calculate completion
        const moduleProgress = {};
        
        progress.forEach(p => {
            if (!moduleProgress[p.moduleId]) {
                moduleProgress[p.moduleId] = {
                    moduleId: p.moduleId,
                    attempts: 0,
                    bestScore: 0,
                    totalTime: 0,
                    completed: false,
                    lastAttempt: null
                };
            }
            
            moduleProgress[p.moduleId].attempts++;
            moduleProgress[p.moduleId].bestScore = Math.max(moduleProgress[p.moduleId].bestScore, p.score);
            moduleProgress[p.moduleId].totalTime += p.timeSpent;
            moduleProgress[p.moduleId].lastAttempt = p.timestamp;
            
            if (p.score >= 80) { // 80% threshold for completion
                moduleProgress[p.moduleId].completed = true;
            }
        });
        
        return Object.values(moduleProgress);
    }

    // Analytics tracking
    async trackEvent(eventType, data) {
        const event = {
            type: eventType,
            data: data,
            timestamp: new Date().toISOString(),
            userId: data.userId || null,
            synced: false
        };
        
        const result = await this.addData('analytics', event);
        
        // Add to offline queue
        await this.addToOfflineQueue('analytics', event);
        
        return result;
    }

    async getAnalytics(userId = null, startDate = null, endDate = null) {
        let analytics = await this.getAllData('analytics');
        
        if (userId) {
            analytics = analytics.filter(a => a.userId === userId);
        }
        
        if (startDate) {
            analytics = analytics.filter(a => new Date(a.timestamp) >= new Date(startDate));
        }
        
        if (endDate) {
            analytics = analytics.filter(a => new Date(a.timestamp) <= new Date(endDate));
        }
        
        return analytics.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    }

    // Offline queue management
    async addToOfflineQueue(type, data) {
        const queueItem = {
            type: type,
            data: data,
            timestamp: new Date().toISOString(),
            synced: false
        };
        
        return this.addData('offlineQueue', queueItem);
    }

    async getOfflineQueue() {
        return this.getAllData('offlineQueue');
    }

    async getUnsyncedItems() {
        const queue = await this.getOfflineQueue();
        return queue.filter(item => !item.synced);
    }

    async markAsSynced(id) {
        const item = await this.getData('offlineQueue', id);
        if (item) {
            item.synced = true;
            return this.updateData('offlineQueue', item);
        }
    }

    // Settings management
    async saveSetting(key, value) {
        return this.addData('settings', { key, value });
    }

    async getSetting(key) {
        const setting = await this.getData('settings', key);
        return setting ? setting.value : null;
    }

    async getCurrentModule() {
        return this.getSetting('currentModule');
    }

    async setCurrentModule(module) {
        return this.saveSetting('currentModule', module);
    }

    // Sync with server
    async syncData() {
        if (!navigator.onLine) {
            console.log('Device is offline, skipping sync');
            return;
        }

        const unsyncedItems = await this.getUnsyncedItems();
        
        if (unsyncedItems.length === 0) {
            console.log('No data to sync');
            return;
        }

        console.log(`Syncing ${unsyncedItems.length} items...`);

        try {
            const response = await fetch('/api/sync', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    items: unsyncedItems.map(item => ({
                        type: item.type,
                        data: item.data,
                        timestamp: item.timestamp
                    }))
                })
            });

            if (response.ok) {
                // Mark items as synced
                for (const item of unsyncedItems) {
                    await this.markAsSynced(item.id);
                }
                
                console.log('Data synced successfully');
            } else {
                throw new Error(`Sync failed: ${response.status}`);
            }
        } catch (error) {
            console.error('Sync failed:', error);
            throw error;
        }
    }

    // Generic data operations
    async addData(storeName, data) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([storeName], 'readwrite');
            const store = transaction.objectStore(storeName);
            const request = store.add(data);
            
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async getData(storeName, key) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([storeName], 'readonly');
            const store = transaction.objectStore(storeName);
            const request = store.get(key);
            
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async getAllData(storeName) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([storeName], 'readonly');
            const store = transaction.objectStore(storeName);
            const request = store.getAll();
            
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async updateData(storeName, data) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([storeName], 'readwrite');
            const store = transaction.objectStore(storeName);
            const request = store.put(data);
            
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async deleteData(storeName, key) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([storeName], 'readwrite');
            const store = transaction.objectStore(storeName);
            const request = store.delete(key);
            
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async clearStore(storeName) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([storeName], 'readwrite');
            const store = transaction.objectStore(storeName);
            const request = store.clear();
            
            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }

    // Storage quota management
    async getStorageUsage() {
        if ('storage' in navigator && 'estimate' in navigator.storage) {
            const estimate = await navigator.storage.estimate();
            return {
                used: estimate.usage,
                quota: estimate.quota,
                percentage: (estimate.usage / estimate.quota) * 100
            };
        }
        return null;
    }

    // Cleanup old data
    async cleanupOldData(daysToKeep = 30) {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);
        
        // Clean up old analytics
        const analytics = await this.getAllData('analytics');
        const oldAnalytics = analytics.filter(a => new Date(a.timestamp) < cutoffDate);
        
        for (const item of oldAnalytics) {
            await this.deleteData('analytics', item.id);
        }
        
        console.log(`Cleaned up ${oldAnalytics.length} old analytics records`);
    }
}