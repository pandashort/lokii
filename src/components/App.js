import { LoginScreen } from './LoginScreen.js';
import { StudentDashboard } from './StudentDashboard.js';
import { TeacherDashboard } from './TeacherDashboard.js';
import { ModuleViewer } from './ModuleViewer.js';
import { OfflineIndicator } from './OfflineIndicator.js';

export class App {
    constructor({ offlineManager, analytics, localization }) {
        this.offlineManager = offlineManager;
        this.analytics = analytics;
        this.localization = localization;
        this.currentUser = null;
        this.currentView = 'login';
        this.modules = [];
        this.students = [];
        this.teachers = [];
    }

    mount(selector) {
        this.container = document.querySelector(selector);
        this.render();
        this.setupEventListeners();
    }

    render() {
        const isOnline = navigator.onLine;
        
        this.container.innerHTML = `
            <div class="app">
                ${!isOnline ? '<div class="offline-banner">📡 Working offline - changes will sync when connected</div>' : ''}
                <div class="app-header">
                    <div class="container">
                        <div class="header-content">
                            <h1 class="app-title">🎓 LearnSTEM</h1>
                            <div class="header-actions">
                                ${this.currentUser ? `
                                    <div class="user-info">
                                        <span class="user-name">${this.currentUser.name}</span>
                                        <span class="user-role">${this.currentUser.role}</span>
                                    </div>
                                    <button class="btn btn-outline btn-sm" id="logout-btn">Logout</button>
                                ` : ''}
                                <div class="offline-indicator" id="offline-indicator"></div>
                            </div>
                        </div>
                    </div>
                </div>
                <main class="app-main">
                    <div class="container">
                        ${this.renderCurrentView()}
                    </div>
                </main>
                <footer class="app-footer">
                    <div class="container">
                        <p>&copy; 2024 Gamified Learning Platform. Built for rural education.</p>
                    </div>
                </footer>
            </div>
        `;

        // Initialize offline indicator
        if (this.offlineManager) {
            new OfflineIndicator(this.offlineManager).mount('#offline-indicator');
        }
    }

    renderCurrentView() {
        switch (this.currentView) {
            case 'login':
                return new LoginScreen(this).render();
            case 'student-dashboard':
                return new StudentDashboard(this).render();
            case 'teacher-dashboard':
                return new TeacherDashboard(this).render();
            case 'module':
                return new ModuleViewer(this).render();
            default:
                return '<div class="error-container">Unknown view</div>';
        }
    }

    setupEventListeners() {
        // Logout button
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => this.logout());
        }

        // Handle online/offline events
        window.addEventListener('online', () => {
            this.render();
            if (this.offlineManager) {
                this.offlineManager.sync();
            }
        });

        window.addEventListener('offline', () => {
            this.render();
        });
    }

    async login(credentials) {
        try {
            // Simulate API call - in real app, this would be an actual API
            const user = await this.authenticateUser(credentials);
            
            if (user) {
                this.currentUser = user;
                this.currentView = user.role === 'student' ? 'student-dashboard' : 'teacher-dashboard';
                
                // Track login event
                if (this.analytics) {
                    this.analytics.track('user_login', {
                        userId: user.id,
                        role: user.role,
                        timestamp: new Date().toISOString()
                    });
                }
                
                this.render();
                return true;
            } else {
                throw new Error('Invalid credentials');
            }
        } catch (error) {
            console.error('Login failed:', error);
            this.showError('Login failed. Please check your credentials.');
            return false;
        }
    }

    async authenticateUser(credentials) {
        // Mock authentication - replace with real API
        const mockUsers = [
            { id: 1, username: 'student1', password: 'password', name: 'Alice Johnson', role: 'student', grade: 8 },
            { id: 2, username: 'student2', password: 'password', name: 'Bob Smith', role: 'student', grade: 9 },
            { id: 3, username: 'teacher1', password: 'password', name: 'Ms. Rodriguez', role: 'teacher', subjects: ['Math', 'Science'] },
            { id: 4, username: 'admin', password: 'admin', name: 'Admin User', role: 'admin' }
        ];

        const user = mockUsers.find(u => 
            u.username === credentials.username && u.password === credentials.password
        );

        if (user) {
            // Remove password from returned user object
            const { password, ...userWithoutPassword } = user;
            return userWithoutPassword;
        }

        return null;
    }

    logout() {
        this.currentUser = null;
        this.currentView = 'login';
        
        // Track logout event
        if (this.analytics) {
            this.analytics.track('user_logout', {
                timestamp: new Date().toISOString()
            });
        }
        
        this.render();
    }

    navigateTo(view, params = {}) {
        this.currentView = view;
        this.currentParams = params;
        this.render();
    }

    showError(message) {
        // Create a simple error notification
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-notification';
        errorDiv.innerHTML = `
            <div class="error-content">
                <span class="error-icon">⚠️</span>
                <span class="error-message">${message}</span>
                <button class="error-close" onclick="this.parentElement.parentElement.remove()">×</button>
            </div>
        `;
        
        // Add styles if not already added
        if (!document.getElementById('error-styles')) {
            const style = document.createElement('style');
            style.id = 'error-styles';
            style.textContent = `
                .error-notification {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    background: var(--danger-color);
                    color: white;
                    padding: var(--spacing-md);
                    border-radius: var(--border-radius);
                    box-shadow: var(--shadow);
                    z-index: 1000;
                    max-width: 400px;
                }
                .error-content {
                    display: flex;
                    align-items: center;
                    gap: var(--spacing-sm);
                }
                .error-close {
                    background: none;
                    border: none;
                    color: white;
                    font-size: 20px;
                    cursor: pointer;
                    padding: 0;
                    margin-left: auto;
                }
            `;
            document.head.appendChild(style);
        }
        
        document.body.appendChild(errorDiv);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (errorDiv.parentElement) {
                errorDiv.remove();
            }
        }, 5000);
    }

    showSuccess(message) {
        // Similar to showError but with success styling
        const successDiv = document.createElement('div');
        successDiv.className = 'success-notification';
        successDiv.innerHTML = `
            <div class="success-content">
                <span class="success-icon">✅</span>
                <span class="success-message">${message}</span>
                <button class="success-close" onclick="this.parentElement.parentElement.remove()">×</button>
            </div>
        `;
        
        // Add styles if not already added
        if (!document.getElementById('success-styles')) {
            const style = document.createElement('style');
            style.id = 'success-styles';
            style.textContent = `
                .success-notification {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    background: var(--success-color);
                    color: white;
                    padding: var(--spacing-md);
                    border-radius: var(--border-radius);
                    box-shadow: var(--shadow);
                    z-index: 1000;
                    max-width: 400px;
                }
                .success-content {
                    display: flex;
                    align-items: center;
                    gap: var(--spacing-sm);
                }
                .success-close {
                    background: none;
                    border: none;
                    color: white;
                    font-size: 20px;
                    cursor: pointer;
                    padding: 0;
                    margin-left: auto;
                }
            `;
            document.head.appendChild(style);
        }
        
        document.body.appendChild(successDiv);
        
        // Auto-remove after 3 seconds
        setTimeout(() => {
            if (successDiv.parentElement) {
                successDiv.remove();
            }
        }, 3000);
    }
}
