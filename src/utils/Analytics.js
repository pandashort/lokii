export class Analytics {
    constructor() {
        this.events = [];
        this.sessionStart = Date.now();
        this.isEnabled = true;
    }

    async init() {
        try {
            // Check if analytics is enabled in settings
            this.isEnabled = localStorage.getItem('analytics_enabled') !== 'false';
            console.log('Analytics initialized, enabled:', this.isEnabled);
        } catch (error) {
            console.error('Failed to initialize Analytics:', error);
            this.isEnabled = false;
        }
    }

    track(eventName, properties = {}) {
        if (!this.isEnabled) {
            return;
        }

        try {
            const event = {
                id: this.generateEventId(),
                name: eventName,
                properties: {
                    ...properties,
                    timestamp: new Date().toISOString(),
                    sessionId: this.getSessionId(),
                    userAgent: navigator.userAgent,
                    url: window.location.href,
                    online: navigator.onLine
                }
            };

            this.events.push(event);
            console.log('Analytics event tracked:', event);

            // Store in localStorage for offline persistence
            this.persistEvent(event);

            // Send to server if online
            if (navigator.onLine) {
                this.sendEvent(event);
            }

        } catch (error) {
            console.error('Failed to track event:', error);
        }
    }

    generateEventId() {
        return 'evt_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    getSessionId() {
        let sessionId = sessionStorage.getItem('analytics_session_id');
        if (!sessionId) {
            sessionId = 'sess_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            sessionStorage.setItem('analytics_session_id', sessionId);
        }
        return sessionId;
    }

    persistEvent(event) {
        try {
            const storedEvents = JSON.parse(localStorage.getItem('analytics_events') || '[]');
            storedEvents.push(event);
            
            // Keep only last 1000 events to prevent storage bloat
            if (storedEvents.length > 1000) {
                storedEvents.splice(0, storedEvents.length - 1000);
            }
            
            localStorage.setItem('analytics_events', JSON.stringify(storedEvents));
        } catch (error) {
            console.error('Failed to persist event:', error);
        }
    }

    async sendEvent(event) {
        try {
            // Mock API call - replace with real analytics endpoint
            console.log('Sending analytics event to server:', event);
            
            // In a real app, this would be:
            // await fetch('/api/analytics/events', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify(event)
            // });
            
            // Simulate network delay
            await new Promise(resolve => setTimeout(resolve, 50));
        } catch (error) {
            console.error('Failed to send event:', error);
        }
    }

    async sendPendingEvents() {
        if (!navigator.onLine) {
            return;
        }

        try {
            const storedEvents = JSON.parse(localStorage.getItem('analytics_events') || '[]');
            const unsentEvents = storedEvents.filter(event => !event.sent);
            
            console.log(`Sending ${unsentEvents.length} pending events...`);
            
            for (const event of unsentEvents) {
                await this.sendEvent(event);
                event.sent = true;
            }
            
            // Update localStorage with sent events
            localStorage.setItem('analytics_events', JSON.stringify(storedEvents));
            
        } catch (error) {
            console.error('Failed to send pending events:', error);
        }
    }

    // Specific tracking methods for common events
    trackPageView(pageName, properties = {}) {
        this.track('page_view', {
            page_name: pageName,
            ...properties
        });
    }

    trackModuleStart(moduleId, moduleName, properties = {}) {
        this.track('module_started', {
            module_id: moduleId,
            module_name: moduleName,
            ...properties
        });
    }

    trackModuleComplete(moduleId, moduleName, score, timeSpent, properties = {}) {
        this.track('module_completed', {
            module_id: moduleId,
            module_name: moduleName,
            score: score,
            time_spent: timeSpent,
            ...properties
        });
    }

    trackQuizAnswer(moduleId, questionId, isCorrect, timeSpent, properties = {}) {
        this.track('quiz_answer', {
            module_id: moduleId,
            question_id: questionId,
            is_correct: isCorrect,
            time_spent: timeSpent,
            ...properties
        });
    }

    trackHintUsed(moduleId, hintType, properties = {}) {
        this.track('hint_used', {
            module_id: moduleId,
            hint_type: hintType,
            ...properties
        });
    }

    trackUserLogin(userId, role, properties = {}) {
        this.track('user_login', {
            user_id: userId,
            role: role,
            ...properties
        });
    }

    trackUserLogout(userId, sessionDuration, properties = {}) {
        this.track('user_logout', {
            user_id: userId,
            session_duration: sessionDuration,
            ...properties
        });
    }

    trackError(errorMessage, errorStack, properties = {}) {
        this.track('error', {
            error_message: errorMessage,
            error_stack: errorStack,
            ...properties
        });
    }

    trackOfflineAction(action, properties = {}) {
        this.track('offline_action', {
            action: action,
            ...properties
        });
    }

    trackSyncEvent(syncType, itemCount, success, properties = {}) {
        this.track('sync_event', {
            sync_type: syncType,
            item_count: itemCount,
            success: success,
            ...properties
        });
    }

    // Analytics queries and reports
    getSessionDuration() {
        return Date.now() - this.sessionStart;
    }

    getEventsByType(eventType) {
        return this.events.filter(event => event.name === eventType);
    }

    getEventsByTimeRange(startTime, endTime) {
        return this.events.filter(event => {
            const eventTime = new Date(event.properties.timestamp).getTime();
            return eventTime >= startTime && eventTime <= endTime;
        });
    }

    getModuleEngagement(moduleId) {
        const moduleEvents = this.events.filter(event => 
            event.properties.module_id === moduleId
        );
        
        const starts = moduleEvents.filter(e => e.name === 'module_started').length;
        const completions = moduleEvents.filter(e => e.name === 'module_completed').length;
        const avgTimeSpent = this.calculateAverageTimeSpent(moduleEvents);
        
        return {
            starts,
            completions,
            completionRate: starts > 0 ? (completions / starts) * 100 : 0,
            averageTimeSpent: avgTimeSpent
        };
    }

    calculateAverageTimeSpent(events) {
        const completionEvents = events.filter(e => e.name === 'module_completed');
        if (completionEvents.length === 0) return 0;
        
        const totalTime = completionEvents.reduce((sum, event) => 
            sum + (event.properties.time_spent || 0), 0
        );
        
        return totalTime / completionEvents.length;
    }

    getUserEngagement(userId) {
        const userEvents = this.events.filter(event => 
            event.properties.user_id === userId
        );
        
        const sessionDuration = this.getSessionDuration();
        const modulesStarted = userEvents.filter(e => e.name === 'module_started').length;
        const modulesCompleted = userEvents.filter(e => e.name === 'module_completed').length;
        const hintsUsed = userEvents.filter(e => e.name === 'hint_used').length;
        
        return {
            sessionDuration,
            modulesStarted,
            modulesCompleted,
            completionRate: modulesStarted > 0 ? (modulesCompleted / modulesStarted) * 100 : 0,
            hintsUsed,
            totalEvents: userEvents.length
        };
    }

    // Export analytics data
    exportData(format = 'json') {
        const data = {
            sessionId: this.getSessionId(),
            sessionStart: new Date(this.sessionStart).toISOString(),
            sessionEnd: new Date().toISOString(),
            totalEvents: this.events.length,
            events: this.events
        };

        if (format === 'json') {
            return JSON.stringify(data, null, 2);
        } else if (format === 'csv') {
            return this.convertToCSV(data.events);
        }

        return data;
    }

    convertToCSV(events) {
        if (events.length === 0) return '';

        const headers = ['timestamp', 'event_name', 'user_id', 'module_id', 'properties'];
        const rows = events.map(event => [
            event.properties.timestamp,
            event.name,
            event.properties.user_id || '',
            event.properties.module_id || '',
            JSON.stringify(event.properties)
        ]);

        return [headers, ...rows].map(row => 
            row.map(field => `"${field}"`).join(',')
        ).join('\n');
    }

    // Settings
    enable() {
        this.isEnabled = true;
        localStorage.setItem('analytics_enabled', 'true');
        console.log('Analytics enabled');
    }

    disable() {
        this.isEnabled = false;
        localStorage.setItem('analytics_enabled', 'false');
        console.log('Analytics disabled');
    }

    clearData() {
        this.events = [];
        localStorage.removeItem('analytics_events');
        localStorage.removeItem('analytics_session_id');
        console.log('Analytics data cleared');
    }
}
