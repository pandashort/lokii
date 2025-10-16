// Student Dashboard Controller
class StudentDashboard {
    constructor() {
        this.offlineStorage = null;
        this.gamification = null;
        this.i18n = null;
    }

    setDependencies(offlineStorage, gamification, i18n) {
        this.offlineStorage = offlineStorage;
        this.gamification = gamification;
        this.i18n = i18n;
    }

    async loadStudentData() {
        if (!this.offlineStorage) return;
        
        const user = await this.offlineStorage.getUser();
        if (!user) return;
        
        // Load modules
        await this.loadModules();
        
        // Load progress
        await this.loadProgress();
        
        // Load achievements
        await this.loadAchievements();
        
        // Update user stats
        this.updateUserStats(user);
    }

    async loadModules() {
        const modulesGrid = document.getElementById('modules-grid');
        if (!modulesGrid) return;
        
        const modules = await this.offlineStorage.getModules();
        const user = await this.offlineStorage.getUser();
        const userProgress = await this.offlineStorage.getUserProgress(user.id);
        
        modulesGrid.innerHTML = '';
        
        modules.forEach(module => {
            const progress = userProgress.find(p => p.moduleId === module.id);
            const moduleCard = this.createModuleCard(module, progress);
            modulesGrid.appendChild(moduleCard);
        });
    }

    createModuleCard(module, progress) {
        const card = document.createElement('div');
        card.className = 'module-card';
        card.dataset.moduleId = module.id;
        
        const isCompleted = progress?.completed || false;
        const progressPercent = progress ? Math.round((progress.bestScore || 0)) : 0;
        
        if (isCompleted) {
            card.classList.add('completed');
        }
        
        const difficultyClass = `difficulty-${module.difficulty}`;
        const subjectIcon = module.subject === 'math' ? '🧮' : '🔬';
        
        card.innerHTML = `
            <div class="module-header">
                <span class="module-icon">${subjectIcon}</span>
                <span class="module-difficulty ${difficultyClass}">
                    ${this.i18n ? this.i18n.t(module.difficulty) : module.difficulty}
                </span>
            </div>
            <h4>${this.i18n ? this.i18n.t(module.title) : module.title}</h4>
            <p>${this.i18n ? this.i18n.t(module.description) : module.description}</p>
            <div class="module-progress">
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${progressPercent}%"></div>
                </div>
                <span class="progress-text">${progressPercent}%</span>
            </div>
            <div class="module-meta">
                <span class="module-duration">${module.duration} ${this.i18n ? this.i18n.t('minutes') : 'min'}</span>
                <span class="module-status">
                    ${isCompleted ? '✅' : '⏳'}
                </span>
            </div>
        `;
        
        card.addEventListener('click', () => this.startModule(module));
        
        return card;
    }

    async startModule(module) {
        if (window.stemApp) {
            await window.stemApp.startModule(module);
        }
    }

    async loadProgress() {
        const progressSection = document.querySelector('.progress-section');
        if (!progressSection) return;
        
        const user = await this.offlineStorage.getUser();
        if (!user) return;
        
        const userProgress = await this.offlineStorage.getUserProgress(user.id);
        const modules = await this.offlineStorage.getModules();
        
        // Calculate subject progress
        const mathModules = modules.filter(m => m.subject === 'math');
        const scienceModules = modules.filter(m => m.subject === 'science');
        
        const mathProgress = this.calculateSubjectProgress(userProgress, mathModules);
        const scienceProgress = this.calculateSubjectProgress(userProgress, scienceModules);
        
        // Update progress cards
        this.updateProgressCard('mathematics', mathProgress, mathModules.length);
        this.updateProgressCard('science', scienceProgress, scienceModules.length);
    }

    calculateSubjectProgress(userProgress, modules) {
        if (modules.length === 0) return 0;
        
        const completedModules = modules.filter(module => {
            const progress = userProgress.find(p => p.moduleId === module.id);
            return progress?.completed || false;
        });
        
        return Math.round((completedModules.length / modules.length) * 100);
    }

    updateProgressCard(subject, progress, totalModules) {
        const progressCards = document.querySelectorAll('.progress-card');
        const card = Array.from(progressCards).find(card => 
            card.querySelector('h4').textContent.toLowerCase().includes(subject.toLowerCase())
        );
        
        if (!card) return;
        
        const progressBar = card.querySelector('.progress-fill');
        const progressText = card.querySelector('p');
        
        if (progressBar) {
            progressBar.style.width = progress + '%';
        }
        
        if (progressText) {
            const completedModules = Math.round((progress / 100) * totalModules);
            progressText.textContent = `${completedModules}/${totalModules} ${this.i18n ? this.i18n.t('modules_completed') : 'modules completed'}`;
        }
    }

    async loadAchievements() {
        const achievementsList = document.getElementById('achievements-list');
        if (!achievementsList) return;
        
        const user = await this.offlineStorage.getUser();
        if (!user) return;
        
        const achievements = await this.gamification.getUserAchievements(user.id);
        
        // Show only recent achievements (last 5)
        const recentAchievements = achievements.slice(0, 5);
        
        achievementsList.innerHTML = '';
        
        if (recentAchievements.length === 0) {
            achievementsList.innerHTML = `
                <div class="no-achievements">
                    <p>${this.i18n ? this.i18n.t('no_achievements_yet') : 'No achievements yet. Complete modules to earn badges!'}</p>
                </div>
            `;
            return;
        }
        
        recentAchievements.forEach(achievement => {
            const badge = document.createElement('div');
            badge.className = 'achievement-badge';
            badge.innerHTML = `
                <span class="achievement-icon">${achievement.icon}</span>
                <div class="achievement-info">
                    <span class="achievement-name">${this.i18n ? this.i18n.t(achievement.name) : achievement.name}</span>
                    <span class="achievement-date">${this.formatDate(achievement.earnedAt)}</span>
                </div>
            `;
            achievementsList.appendChild(badge);
        });
    }

    updateUserStats(user) {
        // Update points and level
        const pointsElement = document.getElementById('student-points');
        const levelElement = document.getElementById('student-level');
        
        if (pointsElement) {
            pointsElement.textContent = user.points || 0;
        }
        
        if (levelElement) {
            levelElement.textContent = user.level || 1;
        }
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diffInDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
        
        if (diffInDays === 0) {
            return this.i18n ? this.i18n.t('today') : 'Today';
        } else if (diffInDays === 1) {
            return this.i18n ? this.i18n.t('yesterday') : 'Yesterday';
        } else if (diffInDays < 7) {
            return `${diffInDays} ${this.i18n ? this.i18n.t('days_ago') : 'days ago'}`;
        } else {
            return date.toLocaleDateString();
        }
    }

    // Handle module completion updates
    async onModuleCompleted(moduleId, score) {
        // Reload modules to update progress
        await this.loadModules();
        await this.loadProgress();
        await this.loadAchievements();
        
        // Show completion notification
        this.showCompletionNotification(moduleId, score);
    }

    showCompletionNotification(moduleId, score) {
        const notification = document.createElement('div');
        notification.className = 'completion-notification';
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-icon">🎉</span>
                <div class="notification-text">
                    <h4>${this.i18n ? this.i18n.t('module_completed') : 'Module Completed!'}</h4>
                    <p>${this.i18n ? this.i18n.t('score') : 'Score'}: ${score}%</p>
                </div>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    // Handle achievement notifications
    onAchievementEarned(achievement) {
        const notification = document.createElement('div');
        notification.className = 'achievement-notification';
        notification.innerHTML = `
            <div class="achievement-content">
                <span class="achievement-icon">${achievement.icon}</span>
                <div class="achievement-text">
                    <h4>${this.i18n ? this.i18n.t('achievement_unlocked') : 'Achievement Unlocked!'}</h4>
                    <p>${this.i18n ? this.i18n.t(achievement.name) : achievement.name}</p>
                </div>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Remove after 5 seconds
        setTimeout(() => {
            notification.remove();
        }, 5000);
    }
}

// Initialize student dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.studentDashboard = new StudentDashboard();
});