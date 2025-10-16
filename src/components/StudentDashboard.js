export class StudentDashboard {
    constructor(app) {
        this.app = app;
        this.modules = [];
        this.progress = [];
        this.achievements = [];
    }

    async render() {
        await this.loadData();
        
        return `
            <div class="student-dashboard">
                <div class="dashboard-header">
                    <h2>${this.app.localization?.t('dashboard.welcome', { name: this.app.currentUser.name }) || `Welcome back, ${this.app.currentUser.name}!`}</h2>
                    <div class="user-stats">
                        <div class="stat-item">
                            <span class="stat-value">${this.getTotalPoints()}</span>
                            <span class="stat-label">${this.app.localization?.t('game.points') || 'Points'}</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-value">${this.getCurrentLevel()}</span>
                            <span class="stat-label">${this.app.localization?.t('game.level') || 'Level'}</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-value">${this.getStreak()}</span>
                            <span class="stat-label">${this.app.localization?.t('game.streak') || 'Day Streak'}</span>
                        </div>
                    </div>
                </div>

                <div class="dashboard-content">
                    <div class="dashboard-grid">
                        <!-- Continue Learning Section -->
                        <div class="dashboard-section">
                            <h3>${this.app.localization?.t('dashboard.continue_learning') || 'Continue Learning'}</h3>
                            <div class="continue-learning">
                                ${this.renderContinueLearning()}
                            </div>
                        </div>

                        <!-- New Modules Section -->
                        <div class="dashboard-section">
                            <h3>${this.app.localization?.t('dashboard.new_modules') || 'New Modules'}</h3>
                            <div class="modules-grid">
                                ${this.renderNewModules()}
                            </div>
                        </div>

                        <!-- Progress Section -->
                        <div class="dashboard-section">
                            <h3>${this.app.localization?.t('dashboard.progress') || 'Your Progress'}</h3>
                            <div class="progress-overview">
                                ${this.renderProgressOverview()}
                            </div>
                        </div>

                        <!-- Achievements Section -->
                        <div class="dashboard-section">
                            <h3>${this.app.localization?.t('dashboard.achievements') || 'Achievements'}</h3>
                            <div class="achievements-grid">
                                ${this.renderAchievements()}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    async loadData() {
        // Load modules and progress data
        this.modules = await this.getMockModules();
        this.progress = await this.getMockProgress();
        this.achievements = await this.getMockAchievements();
    }

    renderContinueLearning() {
        const inProgressModules = this.modules.filter(module => {
            const progress = this.progress.find(p => p.moduleId === module.id);
            return progress && progress.status === 'in_progress';
        });

        if (inProgressModules.length === 0) {
            return `
                <div class="no-continue-learning">
                    <p>No modules in progress. Start a new module!</p>
                </div>
            `;
        }

        return inProgressModules.map(module => {
            const progress = this.progress.find(p => p.moduleId === module.id);
            const progressPercent = progress ? (progress.completedSteps / module.totalSteps) * 100 : 0;
            
            return `
                <div class="continue-module-card" onclick="window.learningPlatform.app.navigateTo('module', { moduleId: '${module.id}' })">
                    <div class="module-header">
                        <h4>${module.title}</h4>
                        <span class="module-subject">${module.subject}</span>
                    </div>
                    <div class="module-progress">
                        <div class="progress">
                            <div class="progress-bar" style="width: ${progressPercent}%"></div>
                        </div>
                        <span class="progress-text">${Math.round(progressPercent)}% complete</span>
                    </div>
                    <div class="module-actions">
                        <button class="btn btn-primary btn-sm">
                            ${this.app.localization?.t('module.continue') || 'Continue'}
                        </button>
                    </div>
                </div>
            `;
        }).join('');
    }

    renderNewModules() {
        const newModules = this.modules.filter(module => {
            const progress = this.progress.find(p => p.moduleId === module.id);
            return !progress || progress.status === 'not_started';
        }).slice(0, 4);

        return newModules.map(module => `
            <div class="module-card" onclick="window.learningPlatform.app.navigateTo('module', { moduleId: '${module.id}' })">
                <div class="module-icon">${module.icon}</div>
                <div class="module-info">
                    <h4>${module.title}</h4>
                    <p class="module-description">${module.description}</p>
                    <div class="module-meta">
                        <span class="module-difficulty">${module.difficulty}</span>
                        <span class="module-duration">${module.estimatedTime} min</span>
                    </div>
                </div>
                <div class="module-actions">
                    <button class="btn btn-primary btn-sm">
                        ${this.app.localization?.t('module.start') || 'Start Module'}
                    </button>
                </div>
            </div>
        `).join('');
    }

    renderProgressOverview() {
        const completedModules = this.progress.filter(p => p.status === 'completed').length;
        const totalModules = this.modules.length;
        const completionRate = totalModules > 0 ? (completedModules / totalModules) * 100 : 0;

        return `
            <div class="progress-stats">
                <div class="progress-stat">
                    <span class="stat-value">${completedModules}/${totalModules}</span>
                    <span class="stat-label">${this.app.localization?.t('progress.modules_completed') || 'Modules Completed'}</span>
                </div>
                <div class="progress-stat">
                    <span class="stat-value">${Math.round(completionRate)}%</span>
                    <span class="stat-label">Completion Rate</span>
                </div>
            </div>
            <div class="progress-chart">
                <div class="chart-bar">
                    <div class="chart-fill" style="width: ${completionRate}%"></div>
                </div>
            </div>
        `;
    }

    renderAchievements() {
        return this.achievements.map(achievement => `
            <div class="achievement-card ${achievement.unlocked ? 'unlocked' : 'locked'}">
                <div class="achievement-icon">${achievement.icon}</div>
                <div class="achievement-info">
                    <h4>${achievement.title}</h4>
                    <p>${achievement.description}</p>
                    ${achievement.unlocked ? 
                        `<span class="achievement-date">Unlocked ${new Date(achievement.unlockedAt).toLocaleDateString()}</span>` :
                        `<span class="achievement-progress">${achievement.progress}/${achievement.required}</span>`
                    }
                </div>
            </div>
        `).join('');
    }

    getTotalPoints() {
        return this.progress.reduce((total, p) => total + (p.points || 0), 0);
    }

    getCurrentLevel() {
        const totalPoints = this.getTotalPoints();
        return Math.floor(totalPoints / 100) + 1;
    }

    getStreak() {
        // Mock streak calculation
        return Math.floor(Math.random() * 7) + 1;
    }

    async getMockModules() {
        return [
            {
                id: 'math-algebra-1',
                title: 'Introduction to Algebra',
                description: 'Learn the basics of algebraic expressions and equations',
                subject: 'Mathematics',
                difficulty: 'Beginner',
                estimatedTime: 15,
                totalSteps: 8,
                icon: '🔢',
                grade: this.app.currentUser.grade || 8
            },
            {
                id: 'science-physics-1',
                title: 'Forces and Motion',
                description: 'Understand the fundamental concepts of physics',
                subject: 'Physics',
                difficulty: 'Intermediate',
                estimatedTime: 20,
                totalSteps: 10,
                icon: '⚡',
                grade: this.app.currentUser.grade || 8
            },
            {
                id: 'science-chemistry-1',
                title: 'Atomic Structure',
                description: 'Explore the building blocks of matter',
                subject: 'Chemistry',
                difficulty: 'Intermediate',
                estimatedTime: 18,
                totalSteps: 9,
                icon: '🧪',
                grade: this.app.currentUser.grade || 8
            },
            {
                id: 'math-geometry-1',
                title: 'Basic Geometry',
                description: 'Learn about shapes, angles, and measurements',
                subject: 'Mathematics',
                difficulty: 'Beginner',
                estimatedTime: 12,
                totalSteps: 6,
                icon: '📐',
                grade: this.app.currentUser.grade || 8
            }
        ];
    }

    async getMockProgress() {
        return [
            {
                id: 'progress-1',
                userId: this.app.currentUser.id,
                moduleId: 'math-algebra-1',
                status: 'in_progress',
                completedSteps: 3,
                totalSteps: 8,
                points: 45,
                lastAccessed: new Date().toISOString()
            },
            {
                id: 'progress-2',
                userId: this.app.currentUser.id,
                moduleId: 'science-physics-1',
                status: 'completed',
                completedSteps: 10,
                totalSteps: 10,
                points: 100,
                completedAt: new Date(Date.now() - 86400000).toISOString()
            }
        ];
    }

    async getMockAchievements() {
        return [
            {
                id: 'first-module',
                title: 'First Steps',
                description: 'Complete your first module',
                icon: '🎯',
                unlocked: true,
                unlockedAt: new Date(Date.now() - 172800000).toISOString()
            },
            {
                id: 'math-master',
                title: 'Math Master',
                description: 'Complete 5 math modules',
                icon: '🧮',
                unlocked: false,
                progress: 2,
                required: 5
            },
            {
                id: 'streak-7',
                title: 'Week Warrior',
                description: 'Learn for 7 days in a row',
                icon: '🔥',
                unlocked: false,
                progress: 3,
                required: 7
            },
            {
                id: 'perfect-score',
                title: 'Perfectionist',
                description: 'Get a perfect score on any module',
                icon: '⭐',
                unlocked: true,
                unlockedAt: new Date(Date.now() - 86400000).toISOString()
            }
        ];
    }
}
