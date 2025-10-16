// Authentication Manager
class AuthManager {
    constructor() {
        this.currentUser = null;
        this.token = null;
        this.refreshToken = null;
        this.offlineStorage = null;
    }

    setOfflineStorage(storage) {
        this.offlineStorage = storage;
    }

    async login(credentials) {
        try {
            // Try online authentication first
            if (navigator.onLine) {
                const response = await fetch('/api/auth/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(credentials)
                });

                if (response.ok) {
                    const data = await response.json();
                    await this.setUserSession(data);
                    return { success: true, user: data.user };
                }
            }

            // Fallback to offline authentication
            return await this.offlineLogin(credentials);
        } catch (error) {
            console.error('Login error:', error);
            return { success: false, error: 'Network error. Please try again.' };
        }
    }

    async offlineLogin(credentials) {
        const { userType, username, password } = credentials;
        
        // Demo users for offline mode
        const demoUsers = {
            student: [
                { 
                    id: 1, 
                    username: 'student1', 
                    password: 'password123',
                    name: 'Alice Johnson', 
                    type: 'student', 
                    classId: 1, 
                    points: 150, 
                    level: 3,
                    language: 'en'
                },
                { 
                    id: 2, 
                    username: 'student2', 
                    password: 'password123',
                    name: 'Bob Smith', 
                    type: 'student', 
                    classId: 1, 
                    points: 89, 
                    level: 2,
                    language: 'en'
                }
            ],
            teacher: [
                { 
                    id: 101, 
                    username: 'teacher1', 
                    password: 'password123',
                    name: 'Ms. Rodriguez', 
                    type: 'teacher', 
                    classId: 1, 
                    students: 25,
                    language: 'en'
                },
                { 
                    id: 102, 
                    username: 'teacher2', 
                    password: 'password123',
                    name: 'Mr. Chen', 
                    type: 'teacher', 
                    classId: 2, 
                    students: 30,
                    language: 'en'
                }
            ],
            admin: [
                { 
                    id: 201, 
                    username: 'admin', 
                    password: 'admin123',
                    name: 'Admin User', 
                    type: 'admin',
                    language: 'en'
                }
            ]
        };

        const users = demoUsers[userType] || [];
        const user = users.find(u => u.username === username && u.password === password);

        if (user) {
            // Remove password from user object
            const { password, ...userWithoutPassword } = user;
            await this.setUserSession({ user: userWithoutPassword, token: 'offline-token' });
            return { success: true, user: userWithoutPassword };
        }

        return { success: false, error: 'Invalid credentials' };
    }

    async setUserSession(sessionData) {
        this.currentUser = sessionData.user;
        this.token = sessionData.token;
        this.refreshToken = sessionData.refreshToken;

        // Save to offline storage
        if (this.offlineStorage) {
            await this.offlineStorage.saveUser(this.currentUser);
            await this.offlineStorage.saveSetting('authToken', this.token);
            if (this.refreshToken) {
                await this.offlineStorage.saveSetting('refreshToken', this.refreshToken);
            }
        }

        // Store in session storage for immediate access
        sessionStorage.setItem('currentUser', JSON.stringify(this.currentUser));
        sessionStorage.setItem('authToken', this.token);
    }

    async logout() {
        try {
            // Call logout endpoint if online
            if (navigator.onLine && this.token) {
                await fetch('/api/auth/logout', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${this.token}`
                    }
                });
            }
        } catch (error) {
            console.error('Logout API call failed:', error);
        }

        // Clear local session
        this.currentUser = null;
        this.token = null;
        this.refreshToken = null;

        // Clear storage
        if (this.offlineStorage) {
            await this.offlineStorage.clearUser();
            await this.offlineStorage.saveSetting('authToken', null);
            await this.offlineStorage.saveSetting('refreshToken', null);
        }

        sessionStorage.removeItem('currentUser');
        sessionStorage.removeItem('authToken');
    }

    async getCurrentUser() {
        if (this.currentUser) {
            return this.currentUser;
        }

        // Try to restore from session storage
        const sessionUser = sessionStorage.getItem('currentUser');
        if (sessionUser) {
            this.currentUser = JSON.parse(sessionUser);
            this.token = sessionStorage.getItem('authToken');
            return this.currentUser;
        }

        // Try to restore from offline storage
        if (this.offlineStorage) {
            const user = await this.offlineStorage.getUser();
            const token = await this.offlineStorage.getSetting('authToken');
            
            if (user && token) {
                this.currentUser = user;
                this.token = token;
                return user;
            }
        }

        return null;
    }

    isAuthenticated() {
        return this.currentUser !== null;
    }

    hasRole(role) {
        return this.currentUser && this.currentUser.type === role;
    }

    hasPermission(permission) {
        if (!this.currentUser) return false;

        const permissions = {
            student: ['view_modules', 'complete_modules', 'view_progress'],
            teacher: ['view_modules', 'complete_modules', 'view_progress', 'view_analytics', 'manage_students', 'create_assignments'],
            admin: ['*'] // Admin has all permissions
        };

        const userPermissions = permissions[this.currentUser.type] || [];
        return userPermissions.includes(permission) || userPermissions.includes('*');
    }

    async refreshAuthToken() {
        if (!this.refreshToken || !navigator.onLine) {
            return false;
        }

        try {
            const response = await fetch('/api/auth/refresh', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ refreshToken: this.refreshToken })
            });

            if (response.ok) {
                const data = await response.json();
                this.token = data.token;
                
                if (this.offlineStorage) {
                    await this.offlineStorage.saveSetting('authToken', this.token);
                }
                
                sessionStorage.setItem('authToken', this.token);
                return true;
            }
        } catch (error) {
            console.error('Token refresh failed:', error);
        }

        return false;
    }

    getAuthHeaders() {
        const headers = {
            'Content-Type': 'application/json'
        };

        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }

        return headers;
    }

    async makeAuthenticatedRequest(url, options = {}) {
        const headers = {
            ...this.getAuthHeaders(),
            ...options.headers
        };

        let response = await fetch(url, {
            ...options,
            headers
        });

        // If unauthorized, try to refresh token
        if (response.status === 401 && this.refreshToken) {
            const refreshed = await this.refreshAuthToken();
            if (refreshed) {
                // Retry request with new token
                headers['Authorization'] = `Bearer ${this.token}`;
                response = await fetch(url, {
                    ...options,
                    headers
                });
            }
        }

        return response;
    }

    // Password validation
    validatePassword(password) {
        const minLength = 8;
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumbers = /\d/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

        return {
            isValid: password.length >= minLength && hasUpperCase && hasLowerCase && hasNumbers,
            errors: [
                password.length < minLength ? 'Password must be at least 8 characters long' : null,
                !hasUpperCase ? 'Password must contain at least one uppercase letter' : null,
                !hasLowerCase ? 'Password must contain at least one lowercase letter' : null,
                !hasNumbers ? 'Password must contain at least one number' : null,
                !hasSpecialChar ? 'Password must contain at least one special character' : null
            ].filter(Boolean)
        };
    }

    // Generate secure password
    generateSecurePassword(length = 12) {
        const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
        let password = '';
        
        for (let i = 0; i < length; i++) {
            password += charset.charAt(Math.floor(Math.random() * charset.length));
        }
        
        return password;
    }

    // Check if user session is expired
    isSessionExpired() {
        if (!this.token) return true;

        try {
            // Simple JWT decode (in production, use a proper JWT library)
            const payload = JSON.parse(atob(this.token.split('.')[1]));
            const now = Math.floor(Date.now() / 1000);
            return payload.exp < now;
        } catch (error) {
            return true;
        }
    }

    // Auto-logout on session expiry
    startSessionMonitoring() {
        setInterval(() => {
            if (this.isAuthenticated() && this.isSessionExpired()) {
                console.log('Session expired, logging out...');
                this.logout();
                // Redirect to login page
                if (window.stemApp) {
                    window.stemApp.showScreen('login-screen');
                }
            }
        }, 60000); // Check every minute
    }
}