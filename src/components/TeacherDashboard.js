export class TeacherDashboard {
    constructor(app) {
        this.app = app;
        this.students = [];
        this.classProgress = [];
        this.analytics = {};
    }

    async render() {
        await this.loadData();
        
        return `
            <div class="teacher-dashboard">
                <div class="dashboard-header">
                    <h2>${this.app.localization?.t('teacher.class_progress') || 'Class Progress Dashboard'}</h2>
                    <div class="teacher-actions">
                        <button class="btn btn-primary" onclick="this.showCreateAssignment()">
                            ${this.app.localization?.t('teacher.create_assignment') || 'Create Assignment'}
                        </button>
                        <button class="btn btn-secondary" onclick="this.exportReport()">
                            Export Report
                        </button>
                    </div>
                </div>

                <div class="dashboard-content">
                    <div class="dashboard-grid">
                        <!-- Class Overview -->
                        <div class="dashboard-section">
                            <h3>Class Overview</h3>
                            <div class="class-overview">
                                ${this.renderClassOverview()}
                            </div>
                        </div>

                        <!-- Student Progress -->
                        <div class="dashboard-section">
                            <h3>Student Progress</h3>
                            <div class="student-progress">
                                ${this.renderStudentProgress()}
                            </div>
                        </div>

                        <!-- Analytics -->
                        <div class="dashboard-section">
                            <h3>Analytics</h3>
                            <div class="analytics">
                                ${this.renderAnalytics()}
                            </div>
                        </div>

                        <!-- Recent Activity -->
                        <div class="dashboard-section">
                            <h3>Recent Activity</h3>
                            <div class="recent-activity">
                                ${this.renderRecentActivity()}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    async loadData() {
        this.students = await this.getMockStudents();
        this.classProgress = await this.getMockClassProgress();
        this.analytics = await this.getMockAnalytics();
    }

    renderClassOverview() {
        const totalStudents = this.students.length;
        const activeStudents = this.classProgress.filter(p => p.isActive).length;
        const avgCompletionRate = this.calculateAverageCompletionRate();
        const totalModulesCompleted = this.classProgress.reduce((sum, p) => sum + p.modulesCompleted, 0);

        return `
            <div class="overview-stats">
                <div class="overview-stat">
                    <span class="stat-value">${totalStudents}</span>
                    <span class="stat-label">Total Students</span>
                </div>
                <div class="overview-stat">
                    <span class="stat-value">${activeStudents}</span>
                    <span class="stat-label">Active Students</span>
                </div>
                <div class="overview-stat">
                    <span class="stat-value">${Math.round(avgCompletionRate)}%</span>
                    <span class="stat-label">Avg Completion Rate</span>
                </div>
                <div class="overview-stat">
                    <span class="stat-value">${totalModulesCompleted}</span>
                    <span class="stat-label">Modules Completed</span>
                </div>
            </div>
        `;
    }

    renderStudentProgress() {
        return this.students.map(student => {
            const progress = this.classProgress.find(p => p.studentId === student.id);
            const completionRate = progress ? (progress.modulesCompleted / progress.totalModules) * 100 : 0;
            
            return `
                <div class="student-progress-item">
                    <div class="student-info">
                        <div class="student-avatar">${student.name.charAt(0)}</div>
                        <div class="student-details">
                            <h4>${student.name}</h4>
                            <span class="student-grade">Grade ${student.grade}</span>
                        </div>
                    </div>
                    <div class="student-stats">
                        <div class="stat">
                            <span class="stat-value">${progress?.modulesCompleted || 0}</span>
                            <span class="stat-label">Modules</span>
                        </div>
                        <div class="stat">
                            <span class="stat-value">${Math.round(completionRate)}%</span>
                            <span class="stat-label">Complete</span>
                        </div>
                        <div class="stat">
                            <span class="stat-value">${progress?.points || 0}</span>
                            <span class="stat-label">Points</span>
                        </div>
                    </div>
                    <div class="student-progress-bar">
                        <div class="progress">
                            <div class="progress-bar" style="width: ${completionRate}%"></div>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }

    renderAnalytics() {
        return `
            <div class="analytics-charts">
                <div class="chart-container">
                    <h4>Module Completion by Subject</h4>
                    <div class="chart">
                        ${this.renderSubjectChart()}
                    </div>
                </div>
                <div class="chart-container">
                    <h4>Weekly Activity</h4>
                    <div class="chart">
                        ${this.renderWeeklyActivityChart()}
                    </div>
                </div>
            </div>
        `;
    }

    renderSubjectChart() {
        const subjects = ['Math', 'Science', 'Physics', 'Chemistry'];
        return subjects.map(subject => {
            const completed = Math.floor(Math.random() * 20) + 5;
            const total = completed + Math.floor(Math.random() * 10) + 5;
            const percentage = (completed / total) * 100;
            
            return `
                <div class="chart-item">
                    <span class="chart-label">${subject}</span>
                    <div class="chart-bar">
                        <div class="chart-fill" style="width: ${percentage}%"></div>
                    </div>
                    <span class="chart-value">${completed}/${total}</span>
                </div>
            `;
        }).join('');
    }

    renderWeeklyActivityChart() {
        const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        return days.map(day => {
            const activity = Math.floor(Math.random() * 100);
            return `
                <div class="chart-item">
                    <span class="chart-label">${day}</span>
                    <div class="chart-bar">
                        <div class="chart-fill" style="width: ${activity}%"></div>
                    </div>
                    <span class="chart-value">${activity}%</span>
                </div>
            `;
        }).join('');
    }

    renderRecentActivity() {
        const activities = [
            { student: 'Alice Johnson', action: 'completed', module: 'Introduction to Algebra', time: '2 hours ago' },
            { student: 'Bob Smith', action: 'started', module: 'Forces and Motion', time: '3 hours ago' },
            { student: 'Carol Davis', action: 'achieved', module: 'Math Master badge', time: '5 hours ago' },
            { student: 'David Wilson', action: 'completed', module: 'Atomic Structure', time: '1 day ago' }
        ];

        return activities.map(activity => `
            <div class="activity-item">
                <div class="activity-icon">${this.getActivityIcon(activity.action)}</div>
                <div class="activity-content">
                    <p><strong>${activity.student}</strong> ${activity.action} <strong>${activity.module}</strong></p>
                    <span class="activity-time">${activity.time}</span>
                </div>
            </div>
        `).join('');
    }

    getActivityIcon(action) {
        const icons = {
            'completed': '✅',
            'started': '🚀',
            'achieved': '🏆',
            'failed': '❌'
        };
        return icons[action] || '📝';
    }

    calculateAverageCompletionRate() {
        if (this.classProgress.length === 0) return 0;
        
        const totalRate = this.classProgress.reduce((sum, p) => {
            const rate = (p.modulesCompleted / p.totalModules) * 100;
            return sum + rate;
        }, 0);
        
        return totalRate / this.classProgress.length;
    }

    showCreateAssignment() {
        // Mock assignment creation
        alert('Assignment creation feature would open here');
    }

    exportReport() {
        // Mock report export
        const reportData = {
            classOverview: this.renderClassOverview(),
            studentProgress: this.students.map(s => ({
                name: s.name,
                progress: this.classProgress.find(p => p.studentId === s.id)
            })),
            analytics: this.analytics
        };
        
        const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `class-report-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }

    async getMockStudents() {
        return [
            { id: 1, name: 'Alice Johnson', grade: 8, email: 'alice@school.edu' },
            { id: 2, name: 'Bob Smith', grade: 8, email: 'bob@school.edu' },
            { id: 3, name: 'Carol Davis', grade: 9, email: 'carol@school.edu' },
            { id: 4, name: 'David Wilson', grade: 9, email: 'david@school.edu' },
            { id: 5, name: 'Eva Brown', grade: 8, email: 'eva@school.edu' }
        ];
    }

    async getMockClassProgress() {
        return [
            { studentId: 1, modulesCompleted: 8, totalModules: 12, points: 450, isActive: true },
            { studentId: 2, modulesCompleted: 5, totalModules: 12, points: 280, isActive: true },
            { studentId: 3, modulesCompleted: 10, totalModules: 12, points: 520, isActive: true },
            { studentId: 4, modulesCompleted: 3, totalModules: 12, points: 150, isActive: false },
            { studentId: 5, modulesCompleted: 7, totalModules: 12, points: 380, isActive: true }
        ];
    }

    async getMockAnalytics() {
        return {
            totalModules: 12,
            totalStudents: 5,
            averageCompletionRate: 66,
            mostPopularSubject: 'Mathematics',
            averageSessionTime: 25
        };
    }
}
