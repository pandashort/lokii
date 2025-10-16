// Main Application Controller
class STEMApp {
    constructor() {
        this.currentUser = null;
        this.currentLanguage = 'en';
        this.isOnline = navigator.onLine;
        this.offlineStorage = new OfflineStorage();
        this.gamification = new GamificationSystem();
        this.i18n = new I18nSystem();
        
        this.init();
    }

    async init() {
        console.log('Initializing STEM Learning Platform...');
        
        // Show loading screen
        this.showScreen('loading-screen');
        this.updateLoadingStatus('Setting up offline capabilities...');
        
        // Initialize offline storage
        await this.offlineStorage.init();
        this.updateLoadingStatus('Loading user data...');
        
        // Check for existing session
        const savedUser = await this.offlineStorage.getUser();
        if (savedUser) {
            this.currentUser = savedUser;
            this.currentLanguage = savedUser.language || 'en';
        }
        
        // Set up event listeners
        this.setupEventListeners();
        
        // Initialize language
        await this.i18n.init(this.currentLanguage);
        
        // Check connection status
        this.updateConnectionStatus();
        
        // Hide loading screen and show appropriate dashboard
        setTimeout(() => {
            this.hideLoadingScreen();
            if (this.currentUser) {
                this.showUserDashboard();
            } else {
                this.showScreen('login-screen');
            }
        }, 2000);
    }

    setupEventListeners() {
        // Connection status
        window.addEventListener('online', () => {
            this.isOnline = true;
            this.updateConnectionStatus();
            this.syncOfflineData();
        });
        
        window.addEventListener('offline', () => {
            this.isOnline = false;
            this.updateConnectionStatus();
        });

        // Login form
        const loginForm = document.getElementById('login-form');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }

        // Logout buttons
        const logoutBtn = document.getElementById('logout-btn');
        const teacherLogoutBtn = document.getElementById('teacher-logout-btn');
        
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => this.handleLogout());
        }
        
        if (teacherLogoutBtn) {
            teacherLogoutBtn.addEventListener('click', () => this.handleLogout());
        }

        // Back to dashboard
        const backBtn = document.getElementById('back-to-dashboard');
        if (backBtn) {
            backBtn.addEventListener('click', () => this.showUserDashboard());
        }
    }

    async handleLogin(event) {
        event.preventDefault();
        
        const formData = new FormData(event.target);
        const userType = formData.get('user-type') || document.getElementById('user-type').value;
        const username = formData.get('username') || document.getElementById('username').value;
        const password = formData.get('password') || document.getElementById('password').value;
        const language = formData.get('language') || document.getElementById('language').value;

        try {
            // Simulate authentication (in real app, this would be an API call)
            const user = await this.authenticateUser(userType, username, password);
            
            if (user) {
                user.language = language;
                this.currentUser = user;
                this.currentLanguage = language;
                
                // Save user to offline storage
                await this.offlineStorage.saveUser(user);
                
                // Update language
                await this.i18n.setLanguage(language);
                
                // Show appropriate dashboard
                this.showUserDashboard();
            } else {
                this.showError('Invalid credentials. Please try again.');
            }
        } catch (error) {
            console.error('Login error:', error);
            this.showError('Login failed. Please check your connection and try again.');
        }
    }

    async authenticateUser(userType, username, password) {
        // Simulate API call with offline fallback
        if (this.isOnline) {
            try {
                const response = await fetch('/api/auth/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ userType, username, password })
                });
                
                if (response.ok) {
                    return await response.json();
                }
            } catch (error) {
                console.log('Online auth failed, trying offline:', error);
            }
        }
        
        // Offline authentication (demo users)
        const demoUsers = {
            student: [
                { id: 1, username: 'student1', name: 'Alice Johnson', type: 'student', classId: 1, points: 150, level: 3 },
                { id: 2, username: 'student2', name: 'Bob Smith', type: 'student', classId: 1, points: 89, level: 2 }
            ],
            teacher: [
                { id: 101, username: 'teacher1', name: 'Ms. Rodriguez', type: 'teacher', classId: 1, students: 25 },
                { id: 102, username: 'teacher2', name: 'Mr. Chen', type: 'teacher', classId: 2, students: 30 }
            ],
            admin: [
                { id: 201, username: 'admin', name: 'Admin User', type: 'admin' }
            ]
        };
        
        const users = demoUsers[userType] || [];
        return users.find(user => user.username === username) || null;
    }

    async handleLogout() {
        this.currentUser = null;
        await this.offlineStorage.clearUser();
        this.showScreen('login-screen');
    }

    showUserDashboard() {
        if (!this.currentUser) {
            this.showScreen('login-screen');
            return;
        }

        if (this.currentUser.type === 'student') {
            this.showStudentDashboard();
        } else if (this.currentUser.type === 'teacher') {
            this.showTeacherDashboard();
        } else if (this.currentUser.type === 'admin') {
            this.showAdminDashboard();
        }
    }

    async showStudentDashboard() {
        this.showScreen('student-dashboard');
        
        // Update user info
        document.getElementById('student-name').textContent = 
            this.i18n.t('welcome') + ', ' + this.currentUser.name + '!';
        document.getElementById('student-points').textContent = this.currentUser.points || 0;
        document.getElementById('student-level').textContent = this.currentUser.level || 1;
        
        // Load modules
        await this.loadStudentModules();
        
        // Load achievements
        await this.loadStudentAchievements();
    }

    async showTeacherDashboard() {
        this.showScreen('teacher-dashboard');
        
        // Update user info
        document.getElementById('teacher-name').textContent = this.currentUser.name;
        document.getElementById('class-size').textContent = this.currentUser.students || 0;
        
        // Load teacher data
        await this.loadTeacherData();
        
        // Set up tab switching
        this.setupTeacherTabs();
    }

    async loadStudentModules() {
        const modulesGrid = document.getElementById('modules-grid');
        if (!modulesGrid) return;

        // Get modules from offline storage or API
        const modules = await this.getModules();
        
        modulesGrid.innerHTML = '';
        
        modules.forEach(module => {
            const moduleCard = this.createModuleCard(module);
            modulesGrid.appendChild(moduleCard);
        });
    }

    createModuleCard(module) {
        const card = document.createElement('div');
        card.className = 'module-card';
        card.dataset.moduleId = module.id;
        
        const difficultyClass = `difficulty-${module.difficulty}`;
        const isCompleted = module.completed || false;
        
        if (isCompleted) {
            card.classList.add('completed');
        }
        
        card.innerHTML = `
            <h4>${this.i18n.t(module.title)}</h4>
            <p>${this.i18n.t(module.description)}</p>
            <div class="module-meta">
                <span class="module-difficulty ${difficultyClass}">
                    ${this.i18n.t(module.difficulty)}
                </span>
                <span class="module-duration">${module.duration} min</span>
            </div>
        `;
        
        card.addEventListener('click', () => this.startModule(module));
        
        return card;
    }

    async startModule(module) {
        // Save current module to offline storage
        await this.offlineStorage.setCurrentModule(module);
        
        // Show module player
        this.showScreen('module-player');
        
        // Initialize module player
        if (window.modulePlayer) {
            await window.modulePlayer.loadModule(module);
        }
    }

    async loadStudentAchievements() {
        const achievementsList = document.getElementById('achievements-list');
        if (!achievementsList) return;

        const achievements = await this.gamification.getUserAchievements(this.currentUser.id);
        
        achievementsList.innerHTML = '';
        
        achievements.forEach(achievement => {
            const badge = document.createElement('div');
            badge.className = 'achievement-badge';
            badge.innerHTML = `
                <span>${achievement.icon}</span>
                <span>${this.i18n.t(achievement.name)}</span>
            `;
            achievementsList.appendChild(badge);
        });
    }

    async loadTeacherData() {
        // Load class statistics
        const stats = await this.getTeacherStats();
        
        document.getElementById('class-performance').textContent = stats.performance + '%';
        document.getElementById('active-students').textContent = stats.activeStudents;
        document.getElementById('modules-completed').textContent = stats.modulesCompleted;
        document.getElementById('avg-engagement').textContent = stats.avgEngagement + '%';
        
        // Load students list
        await this.loadStudentsList();
    }

    async loadStudentsList() {
        const studentsTable = document.getElementById('students-table');
        if (!studentsTable) return;

        const students = await this.getStudents();
        
        studentsTable.innerHTML = `
            <table>
                <thead>
                    <tr>
                        <th>${this.i18n.t('student_name')}</th>
                        <th>${this.i18n.t('progress')}</th>
                        <th>${this.i18n.t('points')}</th>
                        <th>${this.i18n.t('last_active')}</th>
                    </tr>
                </thead>
                <tbody>
                    ${students.map(student => `
                        <tr>
                            <td>${student.name}</td>
                            <td>
                                <div class="progress-bar">
                                    <div class="progress-fill" style="width: ${student.progress}%"></div>
                                </div>
                                ${student.progress}%
                            </td>
                            <td>${student.points}</td>
                            <td>${student.lastActive}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    }

    setupTeacherTabs() {
        const tabButtons = document.querySelectorAll('.tab-btn');
        const tabContents = document.querySelectorAll('.tab-content');
        
        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const targetTab = button.dataset.tab;
                
                // Update active tab button
                tabButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                
                // Update active tab content
                tabContents.forEach(content => {
                    content.classList.remove('active');
                    if (content.id === targetTab + '-tab') {
                        content.classList.add('active');
                    }
                });
            });
        });
    }

    async getModules() {
        // Try to get from offline storage first
        let modules = await this.offlineStorage.getModules();
        
        if (!modules || modules.length === 0) {
            // Load default modules
            modules = [
                {
                    id: 1,
                    title: 'basic_algebra',
                    description: 'basic_algebra_desc',
                    difficulty: 'easy',
                    duration: 10,
                    subject: 'math',
                    completed: false
                },
                {
                    id: 2,
                    title: 'fractions',
                    description: 'fractions_desc',
                    difficulty: 'medium',
                    duration: 15,
                    subject: 'math',
                    completed: false
                },
                {
                    id: 3,
                    title: 'photosynthesis',
                    description: 'photosynthesis_desc',
                    difficulty: 'medium',
                    duration: 12,
                    subject: 'science',
                    completed: false
                },
                {
                    id: 4,
                    title: 'solar_system',
                    description: 'solar_system_desc',
                    difficulty: 'easy',
                    duration: 8,
                    subject: 'science',
                    completed: false
                }
            ];
            
            // Save to offline storage
            await this.offlineStorage.saveModules(modules);
        }
        
        return modules;
    }

    async getTeacherStats() {
        // Simulate teacher statistics
        return {
            performance: 78,
            activeStudents: 22,
            modulesCompleted: 156,
            avgEngagement: 85
        };
    }

    async getStudents() {
        // Simulate student data
        return [
            { name: 'Alice Johnson', progress: 85, points: 150, lastActive: '2 hours ago' },
            { name: 'Bob Smith', progress: 72, points: 89, lastActive: '1 day ago' },
            { name: 'Carol Davis', progress: 91, points: 203, lastActive: '30 min ago' },
            { name: 'David Wilson', progress: 68, points: 67, lastActive: '3 days ago' }
        ];
    }

    showScreen(screenId) {
        // Hide all screens
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.add('hidden');
        });
        
        // Show target screen
        const targetScreen = document.getElementById(screenId);
        if (targetScreen) {
            targetScreen.classList.remove('hidden');
        }
    }

    hideLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            loadingScreen.classList.add('hidden');
        }
    }

    updateLoadingStatus(message) {
        const statusElement = document.getElementById('loading-status');
        if (statusElement) {
            statusElement.textContent = message;
        }
    }

    updateConnectionStatus() {
        const statusElement = document.getElementById('connection-status');
        if (statusElement) {
            if (this.isOnline) {
                statusElement.textContent = '🟢 Online';
                statusElement.className = 'status-online';
            } else {
                statusElement.textContent = '🔴 Offline';
                statusElement.className = 'status-offline';
            }
        }
    }

    async syncOfflineData() {
        if (this.isOnline) {
            try {
                await this.offlineStorage.syncData();
                console.log('Offline data synced successfully');
            } catch (error) {
                console.error('Failed to sync offline data:', error);
            }
        }
    }

    showError(message) {
        // Simple error display - in a real app, you'd want a proper notification system
        alert(message);
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.stemApp = new STEMApp();
});