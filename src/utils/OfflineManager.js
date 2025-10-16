export class OfflineManager {
    constructor() {
        this.dbName = 'LearnSTEM_Offline';
        this.dbVersion = 1;
        this.db = null;
        this.syncQueue = [];
        this.isOnline = navigator.onLine;
        this.setupEventListeners();
    }

    async init() {
        try {
            this.db = await this.openDatabase();
            await this.createTables();
            console.log('OfflineManager initialized successfully');
        } catch (error) {
            console.error('Failed to initialize OfflineManager:', error);
            throw error;
        }
    }

    openDatabase() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.dbVersion);
            
            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve(request.result);
            
            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                
                // Create object stores
                if (!db.objectStoreNames.contains('modules')) {
                    const moduleStore = db.createObjectStore('modules', { keyPath: 'id' });
                    moduleStore.createIndex('subject', 'subject', { unique: false });
                    moduleStore.createIndex('grade', 'grade', { unique: false });
                }
                
                if (!db.objectStoreNames.contains('progress')) {
                    const progressStore = db.createObjectStore('progress', { keyPath: 'id' });
                    progressStore.createIndex('userId', 'userId', { unique: false });
                    progressStore.createIndex('moduleId', 'moduleId', { unique: false });
                }
                
                if (!db.objectStoreNames.contains('syncQueue')) {
                    db.createObjectStore('syncQueue', { keyPath: 'id', autoIncrement: true });
                }
                
                if (!db.objectStoreNames.contains('settings')) {
                    db.createObjectStore('settings', { keyPath: 'key' });
                }
            };
        });
    }

    async createTables() {
        // Tables are created in onupgradeneeded
        // This method can be used for additional setup
        return Promise.resolve();
    }

    setupEventListeners() {
        window.addEventListener('online', () => {
            this.isOnline = true;
            console.log('Connection restored - starting sync');
            this.sync();
        });

        window.addEventListener('offline', () => {
            this.isOnline = false;
            console.log('Connection lost - working offline');
        });
    }

    // Module management
    async saveModule(module) {
        try {
            const transaction = this.db.transaction(['modules'], 'readwrite');
            const store = transaction.objectStore('modules');
            await store.put(module);
            console.log('Module saved locally:', module.id);
        } catch (error) {
            console.error('Failed to save module:', error);
            throw error;
        }
    }

    async getModule(id) {
        try {
            const transaction = this.db.transaction(['modules'], 'readonly');
            const store = transaction.objectStore('modules');
            const request = store.get(id);
            
            return new Promise((resolve, reject) => {
                request.onsuccess = () => resolve(request.result);
                request.onerror = () => reject(request.error);
            });
        } catch (error) {
            console.error('Failed to get module:', error);
            throw error;
        }
    }

    async getAllModules() {
        try {
            const transaction = this.db.transaction(['modules'], 'readonly');
            const store = transaction.objectStore('modules');
            const request = store.getAll();
            
            return new Promise((resolve, reject) => {
                request.onsuccess = () => resolve(request.result);
                request.onerror = () => reject(request.error);
            });
        } catch (error) {
            console.error('Failed to get all modules:', error);
            throw error;
        }
    }

    // Progress tracking
    async saveProgress(progress) {
        try {
            const transaction = this.db.transaction(['progress'], 'readwrite');
            const store = transaction.objectStore('progress');
            await store.put(progress);
            
            // Add to sync queue if offline
            if (!this.isOnline) {
                await this.addToSyncQueue('progress', progress);
            }
            
            console.log('Progress saved locally:', progress.id);
        } catch (error) {
            console.error('Failed to save progress:', error);
            throw error;
        }
    }

    async getProgress(userId, moduleId) {
        try {
            const transaction = this.db.transaction(['progress'], 'readonly');
            const store = transaction.objectStore('progress');
            const index = store.index('userId');
            const request = index.getAll(userId);
            
            return new Promise((resolve, reject) => {
                request.onsuccess = () => {
                    const progress = request.result.find(p => p.moduleId === moduleId);
                    resolve(progress || null);
                };
                request.onerror = () => reject(request.error);
            });
        } catch (error) {
            console.error('Failed to get progress:', error);
            throw error;
        }
    }

    async getUserProgress(userId) {
        try {
            const transaction = this.db.transaction(['progress'], 'readonly');
            const store = transaction.objectStore('progress');
            const index = store.index('userId');
            const request = index.getAll(userId);
            
            return new Promise((resolve, reject) => {
                request.onsuccess = () => resolve(request.result);
                request.onerror = () => reject(request.error);
            });
        } catch (error) {
            console.error('Failed to get user progress:', error);
            throw error;
        }
    }

    // Sync queue management
    async addToSyncQueue(type, data) {
        try {
            const syncItem = {
                type,
                data,
                timestamp: new Date().toISOString(),
                attempts: 0
            };
            
            const transaction = this.db.transaction(['syncQueue'], 'readwrite');
            const store = transaction.objectStore('syncQueue');
            await store.add(syncItem);
            
            console.log('Added to sync queue:', type);
        } catch (error) {
            console.error('Failed to add to sync queue:', error);
            throw error;
        }
    }

    async getSyncQueue() {
        try {
            const transaction = this.db.transaction(['syncQueue'], 'readonly');
            const store = transaction.objectStore('syncQueue');
            const request = store.getAll();
            
            return new Promise((resolve, reject) => {
                request.onsuccess = () => resolve(request.result);
                request.onerror = () => reject(request.error);
            });
        } catch (error) {
            console.error('Failed to get sync queue:', error);
            throw error;
        }
    }

    async clearSyncQueue() {
        try {
            const transaction = this.db.transaction(['syncQueue'], 'readwrite');
            const store = transaction.objectStore('syncQueue');
            await store.clear();
            console.log('Sync queue cleared');
        } catch (error) {
            console.error('Failed to clear sync queue:', error);
            throw error;
        }
    }

    // Settings management
    async saveSetting(key, value) {
        try {
            const transaction = this.db.transaction(['settings'], 'readwrite');
            const store = transaction.objectStore('settings');
            await store.put({ key, value });
            console.log('Setting saved:', key);
        } catch (error) {
            console.error('Failed to save setting:', error);
            throw error;
        }
    }

    async getSetting(key, defaultValue = null) {
        try {
            const transaction = this.db.transaction(['settings'], 'readonly');
            const store = transaction.objectStore('settings');
            const request = store.get(key);
            
            return new Promise((resolve, reject) => {
                request.onsuccess = () => {
                    const result = request.result;
                    resolve(result ? result.value : defaultValue);
                };
                request.onerror = () => reject(request.error);
            });
        } catch (error) {
            console.error('Failed to get setting:', error);
            return defaultValue;
        }
    }

    // Sync functionality
    async sync() {
        if (!this.isOnline) {
            console.log('Offline - sync queued for later');
            return;
        }

        try {
            const syncQueue = await this.getSyncQueue();
            console.log(`Syncing ${syncQueue.length} items...`);

            for (const item of syncQueue) {
                try {
                    await this.syncItem(item);
                    await this.removeSyncItem(item.id);
                } catch (error) {
                    console.error('Failed to sync item:', item, error);
                    // Increment attempts and potentially remove if too many failures
                    item.attempts = (item.attempts || 0) + 1;
                    if (item.attempts >= 3) {
                        console.log('Removing failed sync item after 3 attempts:', item);
                        await this.removeSyncItem(item.id);
                    }
                }
            }

            console.log('Sync completed');
        } catch (error) {
            console.error('Sync failed:', error);
        }
    }

    async syncItem(item) {
        // Mock API calls - replace with real API endpoints
        const apiEndpoints = {
            progress: '/api/progress',
            module: '/api/modules',
            user: '/api/users'
        };

        const endpoint = apiEndpoints[item.type];
        if (!endpoint) {
            throw new Error(`Unknown sync type: ${item.type}`);
        }

        // Simulate API call
        console.log(`Syncing ${item.type} to ${endpoint}:`, item.data);
        
        // In a real app, this would be:
        // const response = await fetch(endpoint, {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify(item.data)
        // });
        // if (!response.ok) throw new Error('Sync failed');
        
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 100));
    }

    async removeSyncItem(id) {
        try {
            const transaction = this.db.transaction(['syncQueue'], 'readwrite');
            const store = transaction.objectStore('syncQueue');
            await store.delete(id);
        } catch (error) {
            console.error('Failed to remove sync item:', error);
            throw error;
        }
    }

    // Utility methods
    async isModuleAvailable(id) {
        const module = await this.getModule(id);
        return module !== undefined;
    }

    async getStorageUsage() {
        if (!navigator.storage || !navigator.storage.estimate) {
            return { used: 0, available: 0 };
        }

        try {
            const estimate = await navigator.storage.estimate();
            return {
                used: estimate.usage || 0,
                available: estimate.quota || 0
            };
        } catch (error) {
            console.error('Failed to get storage usage:', error);
            return { used: 0, available: 0 };
        }
    }

    async clearAllData() {
        try {
            const transaction = this.db.transaction(['modules', 'progress', 'syncQueue', 'settings'], 'readwrite');
            
            await Promise.all([
                transaction.objectStore('modules').clear(),
                transaction.objectStore('progress').clear(),
                transaction.objectStore('syncQueue').clear(),
                transaction.objectStore('settings').clear()
            ]);
            
            console.log('All offline data cleared');
        } catch (error) {
            console.error('Failed to clear all data:', error);
            throw error;
        }
    }
}
