// Gamification System
class GamificationSystem {
    constructor() {
        this.achievements = this.initializeAchievements();
        this.levels = this.initializeLevels();
    }

    initializeAchievements() {
        return [
            {
                id: 'first_module',
                name: 'first_steps',
                description: 'first_steps_desc',
                icon: '🌱',
                condition: 'modules_completed',
                threshold: 1,
                points: 10,
                category: 'progress'
            },
            {
                id: 'math_explorer',
                name: 'math_explorer',
                description: 'math_explorer_desc',
                icon: '🔢',
                condition: 'math_modules_completed',
                threshold: 3,
                points: 25,
                category: 'subject'
            },
            {
                id: 'science_master',
                name: 'science_master',
                description: 'science_master_desc',
                icon: '🔬',
                condition: 'science_modules_completed',
                threshold: 3,
                points: 25,
                category: 'subject'
            },
            {
                id: 'perfect_score',
                name: 'perfect_score',
                description: 'perfect_score_desc',
                icon: '💯',
                condition: 'perfect_scores',
                threshold: 1,
                points: 15,
                category: 'performance'
            },
            {
                id: 'streak_7',
                name: 'week_warrior',
                description: 'week_warrior_desc',
                icon: '🔥',
                condition: 'daily_streak',
                threshold: 7,
                points: 50,
                category: 'consistency'
            },
            {
                id: 'speed_demon',
                name: 'speed_demon',
                description: 'speed_demon_desc',
                icon: '⚡',
                condition: 'fast_completion',
                threshold: 1,
                points: 20,
                category: 'performance'
            },
            {
                id: 'helpful_student',
                name: 'helpful_student',
                description: 'helpful_student_desc',
                icon: '🤝',
                condition: 'hints_used',
                threshold: 10,
                points: 15,
                category: 'learning'
            },
            {
                id: 'dedicated_learner',
                name: 'dedicated_learner',
                description: 'dedicated_learner_desc',
                icon: '📚',
                condition: 'total_time',
                threshold: 300, // 5 hours in minutes
                points: 30,
                category: 'dedication'
            }
        ];
    }

    initializeLevels() {
        return [
            { level: 1, minPoints: 0, maxPoints: 99, title: 'novice', color: '#6b7280' },
            { level: 2, minPoints: 100, maxPoints: 249, title: 'apprentice', color: '#10b981' },
            { level: 3, minPoints: 250, maxPoints: 499, title: 'scholar', color: '#3b82f6' },
            { level: 4, minPoints: 500, maxPoints: 999, title: 'expert', color: '#8b5cf6' },
            { level: 5, minPoints: 1000, maxPoints: 1999, title: 'master', color: '#f59e0b' },
            { level: 6, minPoints: 2000, maxPoints: 4999, title: 'grandmaster', color: '#ef4444' },
            { level: 7, minPoints: 5000, maxPoints: 9999, title: 'legend', color: '#ec4899' },
            { level: 8, minPoints: 10000, maxPoints: Infinity, title: 'mythic', color: '#6366f1' }
        ];
    }

    // Calculate user level based on points
    calculateLevel(points) {
        const level = this.levels.find(l => points >= l.minPoints && points <= l.maxPoints);
        return level || this.levels[0];
    }

    // Calculate progress to next level
    calculateLevelProgress(points) {
        const currentLevel = this.calculateLevel(points);
        const nextLevel = this.levels.find(l => l.level === currentLevel.level + 1);
        
        if (!nextLevel) {
            return { progress: 100, pointsToNext: 0, isMaxLevel: true };
        }
        
        const progressInLevel = points - currentLevel.minPoints;
        const levelRange = nextLevel.minPoints - currentLevel.minPoints;
        const progress = (progressInLevel / levelRange) * 100;
        const pointsToNext = nextLevel.minPoints - points;
        
        return { progress, pointsToNext, isMaxLevel: false };
    }

    // Award points for various actions
    awardPoints(userId, action, data = {}) {
        const pointValues = {
            'module_completed': 20,
            'perfect_score': 10,
            'good_score': 5, // 80-99%
            'decent_score': 3, // 60-79%
            'attempted': 1,
            'daily_login': 5,
            'streak_bonus': 2,
            'hint_used': -1, // Small penalty for using hints
            'achievement_unlocked': 0 // Achievements have their own point values
        };
        
        const basePoints = pointValues[action] || 0;
        let bonusPoints = 0;
        
        // Apply multipliers and bonuses
        if (action === 'module_completed') {
            // Difficulty bonus
            const difficultyMultiplier = {
                'easy': 1,
                'medium': 1.5,
                'hard': 2
            };
            bonusPoints = Math.floor(basePoints * (difficultyMultiplier[data.difficulty] || 1));
            
            // Speed bonus
            if (data.completionTime && data.expectedTime) {
                const speedRatio = data.expectedTime / data.completionTime;
                if (speedRatio > 1.5) {
                    bonusPoints += Math.floor(basePoints * 0.5); // 50% bonus for fast completion
                }
            }
        }
        
        return Math.max(0, basePoints + bonusPoints);
    }

    // Check and unlock achievements
    async checkAchievements(userId, action, data = {}) {
        const userProgress = await this.getUserProgress(userId);
        const newAchievements = [];
        
        for (const achievement of this.achievements) {
            // Skip if already unlocked
            if (userProgress.achievements.includes(achievement.id)) {
                continue;
            }
            
            // Check if achievement condition is met
            if (await this.checkAchievementCondition(achievement, userProgress, action, data)) {
                newAchievements.push(achievement);
            }
        }
        
        return newAchievements;
    }

    async checkAchievementCondition(achievement, userProgress, action, data) {
        switch (achievement.condition) {
            case 'modules_completed':
                return userProgress.modulesCompleted >= achievement.threshold;
                
            case 'math_modules_completed':
                return userProgress.mathModulesCompleted >= achievement.threshold;
                
            case 'science_modules_completed':
                return userProgress.scienceModulesCompleted >= achievement.threshold;
                
            case 'perfect_scores':
                return userProgress.perfectScores >= achievement.threshold;
                
            case 'daily_streak':
                return userProgress.currentStreak >= achievement.threshold;
                
            case 'fast_completion':
                return data.completionTime && data.expectedTime && 
                       (data.expectedTime / data.completionTime) > 1.5;
                
            case 'hints_used':
                return userProgress.totalHintsUsed >= achievement.threshold;
                
            case 'total_time':
                return userProgress.totalTimeSpent >= achievement.threshold;
                
            default:
                return false;
        }
    }

    // Get user achievements
    async getUserAchievements(userId) {
        const userProgress = await this.getUserProgress(userId);
        return this.achievements.filter(achievement => 
            userProgress.achievements.includes(achievement.id)
        );
    }

    // Get user progress summary
    async getUserProgress(userId) {
        // This would typically fetch from offline storage
        // For now, return mock data
        return {
            userId: userId,
            totalPoints: 0,
            level: 1,
            modulesCompleted: 0,
            mathModulesCompleted: 0,
            scienceModulesCompleted: 0,
            perfectScores: 0,
            currentStreak: 0,
            totalHintsUsed: 0,
            totalTimeSpent: 0,
            achievements: [],
            lastActive: null
        };
    }

    // Update user progress
    async updateUserProgress(userId, action, data = {}) {
        const points = this.awardPoints(userId, action, data);
        const newAchievements = await this.checkAchievements(userId, action, data);
        
        // Update user stats
        const userProgress = await this.getUserProgress(userId);
        userProgress.totalPoints += points;
        userProgress.level = this.calculateLevel(userProgress.totalPoints).level;
        
        // Add new achievements
        newAchievements.forEach(achievement => {
            userProgress.achievements.push(achievement.id);
        });
        
        // Save updated progress
        await this.saveUserProgress(userProgress);
        
        return {
            pointsAwarded: points,
            newAchievements: newAchievements,
            newLevel: userProgress.level,
            totalPoints: userProgress.totalPoints
        };
    }

    // Save user progress (would integrate with offline storage)
    async saveUserProgress(progress) {
        // This would save to IndexedDB via offline storage
        console.log('Saving user progress:', progress);
    }

    // Get leaderboard data
    async getLeaderboard(classId, limit = 10) {
        // This would fetch from offline storage or API
        // For now, return mock data
        return [
            { name: 'Alice Johnson', points: 450, level: 4, rank: 1 },
            { name: 'Bob Smith', points: 380, level: 3, rank: 2 },
            { name: 'Carol Davis', points: 320, level: 3, rank: 3 },
            { name: 'David Wilson', points: 280, level: 3, rank: 4 },
            { name: 'Eva Brown', points: 250, level: 2, rank: 5 }
        ];
    }

    // Get achievement statistics
    getAchievementStats() {
        const categories = {};
        
        this.achievements.forEach(achievement => {
            if (!categories[achievement.category]) {
                categories[achievement.category] = {
                    total: 0,
                    unlocked: 0,
                    points: 0
                };
            }
            
            categories[achievement.category].total++;
            categories[achievement.category].points += achievement.points;
        });
        
        return categories;
    }

    // Generate motivational messages
    getMotivationalMessage(userProgress, action) {
        const messages = {
            'module_completed': [
                'Great job completing that module!',
                'You\'re making excellent progress!',
                'Keep up the fantastic work!',
                'You\'re becoming a true STEM expert!'
            ],
            'level_up': [
                'Congratulations! You\'ve reached a new level!',
                'Amazing! Your dedication is paying off!',
                'Level up! You\'re unstoppable!',
                'Outstanding! You\'ve earned this achievement!'
            ],
            'achievement_unlocked': [
                'Achievement unlocked! You\'re incredible!',
                'Wow! You\'ve earned a special badge!',
                'Fantastic! You\'ve unlocked a new achievement!',
                'Outstanding work! You deserve this recognition!'
            ]
        };
        
        const actionMessages = messages[action] || messages['module_completed'];
        return actionMessages[Math.floor(Math.random() * actionMessages.length)];
    }

    // Calculate engagement score
    calculateEngagementScore(userProgress) {
        const weights = {
            modulesCompleted: 0.3,
            timeSpent: 0.25,
            streak: 0.2,
            achievements: 0.15,
            recentActivity: 0.1
        };
        
        // Normalize each metric to 0-100 scale
        const normalizedMetrics = {
            modulesCompleted: Math.min(userProgress.modulesCompleted * 10, 100),
            timeSpent: Math.min(userProgress.totalTimeSpent / 5, 100), // 5 hours = 100%
            streak: Math.min(userProgress.currentStreak * 10, 100),
            achievements: Math.min(userProgress.achievements.length * 15, 100),
            recentActivity: userProgress.lastActive ? 
                (Date.now() - new Date(userProgress.lastActive)) < 86400000 ? 100 : 50 : 0
        };
        
        // Calculate weighted average
        let score = 0;
        for (const [metric, weight] of Object.entries(weights)) {
            score += normalizedMetrics[metric] * weight;
        }
        
        return Math.round(score);
    }
}