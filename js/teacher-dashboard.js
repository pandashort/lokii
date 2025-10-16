// Teacher Dashboard Controller
class TeacherDashboard {
    constructor() {
        this.offlineStorage = null;
        this.gamification = null;
        this.i18n = null;
        this.charts = {};
    }

    setDependencies(offlineStorage, gamification, i18n) {
        this.offlineStorage = offlineStorage;
        this.gamification = gamification;
        this.i18n = i18n;
    }

    async loadTeacherData() {
        if (!this.offlineStorage) return;
        
        const user = await this.offlineStorage.getUser();
        if (!user) return;
        
        // Load class statistics
        await this.loadClassStatistics();
        
        // Load students list
        await this.loadStudentsList();
        
        // Load analytics
        await this.loadAnalytics();
        
        // Load assignments
        await this.loadAssignments();
        
        // Set up event listeners
        this.setupEventListeners();
    }

    async loadClassStatistics() {
        // Load mock class data
        const classStats = await this.getMockClassStats();
        
        // Update overview tab
        document.getElementById('class-performance').textContent = classStats.performance + '%';
        document.getElementById('active-students').textContent = classStats.activeStudents;
        document.getElementById('modules-completed').textContent = classStats.modulesCompleted;
        document.getElementById('avg-engagement').textContent = classStats.avgEngagement + '%';
    }

    async getMockClassStats() {
        // In a real app, this would come from the server
        return {
            performance: 78,
            activeStudents: 22,
            modulesCompleted: 156,
            avgEngagement: 85
        };
    }

    async loadStudentsList() {
        const studentsTable = document.getElementById('students-table');
        if (!studentsTable) return;
        
        const students = await this.getMockStudents();
        
        studentsTable.innerHTML = `
            <table>
                <thead>
                    <tr>
                        <th>${this.i18n ? this.i18n.t('student_name') : 'Student Name'}</th>
                        <th>${this.i18n ? this.i18n.t('progress') : 'Progress'}</th>
                        <th>${this.i18n ? this.i18n.t('points') : 'Points'}</th>
                        <th>${this.i18n ? this.i18n.t('level') : 'Level'}</th>
                        <th>${this.i18n ? this.i18n.t('last_active') : 'Last Active'}</th>
                        <th>${this.i18n ? this.i18n.t('actions') : 'Actions'}</th>
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
                                <span class="progress-text">${student.progress}%</span>
                            </td>
                            <td>${student.points}</td>
                            <td>
                                <span class="level-badge level-${student.level}">
                                    ${student.level}
                                </span>
                            </td>
                            <td>${student.lastActive}</td>
                            <td>
                                <button class="btn btn-sm btn-secondary" onclick="teacherDashboard.viewStudentDetails(${student.id})">
                                    ${this.i18n ? this.i18n.t('view_details') : 'View Details'}
                                </button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    }

    async getMockStudents() {
        return [
            { id: 1, name: 'Alice Johnson', progress: 85, points: 150, level: 3, lastActive: '2 hours ago' },
            { id: 2, name: 'Bob Smith', progress: 72, points: 89, level: 2, lastActive: '1 day ago' },
            { id: 3, name: 'Carol Davis', progress: 91, points: 203, level: 4, lastActive: '30 min ago' },
            { id: 4, name: 'David Wilson', progress: 68, points: 67, level: 1, lastActive: '3 days ago' },
            { id: 5, name: 'Emma Brown', progress: 95, points: 245, level: 5, lastActive: '1 hour ago' },
            { id: 6, name: 'Frank Miller', progress: 45, points: 34, level: 1, lastActive: '1 week ago' }
        ];
    }

    async loadAnalytics() {
        // Load engagement chart
        await this.loadEngagementChart();
        
        // Load progress chart
        await this.loadProgressChart();
    }

    async loadEngagementChart() {
        const canvas = document.getElementById('engagement-chart');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        
        // Mock data for engagement over time
        const data = {
            labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
            datasets: [{
                label: 'Average Engagement %',
                data: [65, 72, 78, 85],
                borderColor: '#2563eb',
                backgroundColor: 'rgba(37, 99, 235, 0.1)',
                tension: 0.4
            }]
        };
        
        // Simple chart implementation (in real app, use Chart.js)
        this.drawSimpleChart(ctx, data, 'line');
    }

    async loadProgressChart() {
        const canvas = document.getElementById('progress-chart');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        
        // Mock data for subject progress
        const data = {
            labels: ['Mathematics', 'Science', 'Physics', 'Chemistry'],
            datasets: [{
                label: 'Completion %',
                data: [78, 65, 45, 52],
                backgroundColor: [
                    '#10b981',
                    '#3b82f6',
                    '#f59e0b',
                    '#ef4444'
                ]
            }]
        };
        
        // Simple chart implementation
        this.drawSimpleChart(ctx, data, 'bar');
    }

    drawSimpleChart(ctx, data, type) {
        const width = ctx.canvas.width;
        const height = ctx.canvas.height;
        const padding = 40;
        
        ctx.clearRect(0, 0, width, height);
        
        if (type === 'line') {
            this.drawLineChart(ctx, data, width, height, padding);
        } else if (type === 'bar') {
            this.drawBarChart(ctx, data, width, height, padding);
        }
    }

    drawLineChart(ctx, data, width, height, padding) {
        const chartWidth = width - 2 * padding;
        const chartHeight = height - 2 * padding;
        
        // Draw axes
        ctx.strokeStyle = '#e5e7eb';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(padding, padding);
        ctx.lineTo(padding, height - padding);
        ctx.lineTo(width - padding, height - padding);
        ctx.stroke();
        
        // Draw line
        ctx.strokeStyle = data.datasets[0].borderColor;
        ctx.lineWidth = 2;
        ctx.beginPath();
        
        data.labels.forEach((label, index) => {
            const x = padding + (index * chartWidth) / (data.labels.length - 1);
            const y = height - padding - (data.datasets[0].data[index] * chartHeight) / 100;
            
            if (index === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        });
        
        ctx.stroke();
        
        // Draw points
        ctx.fillStyle = data.datasets[0].borderColor;
        data.labels.forEach((label, index) => {
            const x = padding + (index * chartWidth) / (data.labels.length - 1);
            const y = height - padding - (data.datasets[0].data[index] * chartHeight) / 100;
            
            ctx.beginPath();
            ctx.arc(x, y, 4, 0, 2 * Math.PI);
            ctx.fill();
        });
    }

    drawBarChart(ctx, data, width, height, padding) {
        const chartWidth = width - 2 * padding;
        const chartHeight = height - 2 * padding;
        const barWidth = chartWidth / data.labels.length * 0.8;
        const barSpacing = chartWidth / data.labels.length * 0.2;
        
        data.labels.forEach((label, index) => {
            const barHeight = (data.datasets[0].data[index] * chartHeight) / 100;
            const x = padding + index * (barWidth + barSpacing) + barSpacing / 2;
            const y = height - padding - barHeight;
            
            // Draw bar
            ctx.fillStyle = data.datasets[0].backgroundColor[index];
            ctx.fillRect(x, y, barWidth, barHeight);
            
            // Draw label
            ctx.fillStyle = '#374151';
            ctx.font = '12px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(label, x + barWidth / 2, height - padding + 15);
        });
    }

    async loadAssignments() {
        const moduleSelection = document.getElementById('module-selection');
        if (!moduleSelection) return;
        
        const modules = await this.offlineStorage.getModules();
        
        moduleSelection.innerHTML = modules.map(module => `
            <label class="module-checkbox">
                <input type="checkbox" value="${module.id}" name="modules">
                <span class="checkbox-label">
                    ${this.i18n ? this.i18n.t(module.title) : module.title}
                    <small>(${module.difficulty})</small>
                </span>
            </label>
        `).join('');
    }

    setupEventListeners() {
        // Assignment form
        const assignmentForm = document.getElementById('assignment-form');
        if (assignmentForm) {
            assignmentForm.addEventListener('submit', (e) => this.handleAssignmentSubmit(e));
        }
        
        // Tab switching
        const tabButtons = document.querySelectorAll('.tab-btn');
        tabButtons.forEach(button => {
            button.addEventListener('click', (e) => this.switchTab(e.target.dataset.tab));
        });
    }

    async handleAssignmentSubmit(event) {
        event.preventDefault();
        
        const formData = new FormData(event.target);
        const title = formData.get('assignment-title') || document.getElementById('assignment-title').value;
        const dueDate = formData.get('assignment-due-date') || document.getElementById('assignment-due-date').value;
        const selectedModules = Array.from(document.querySelectorAll('input[name="modules"]:checked'))
            .map(input => parseInt(input.value));
        
        if (selectedModules.length === 0) {
            alert(this.i18n ? this.i18n.t('select_at_least_one_module') : 'Please select at least one module');
            return;
        }
        
        const assignment = {
            id: Date.now(),
            title: title,
            dueDate: dueDate,
            modules: selectedModules,
            createdAt: new Date().toISOString(),
            status: 'active'
        };
        
        // Save assignment (in real app, this would be sent to server)
        await this.saveAssignment(assignment);
        
        // Show success message
        this.showSuccessMessage(this.i18n ? this.i18n.t('assignment_created') : 'Assignment created successfully!');
        
        // Reset form
        event.target.reset();
    }

    async saveAssignment(assignment) {
        // In a real app, this would be saved to the server
        console.log('Saving assignment:', assignment);
        
        // For demo purposes, just show in console
        return assignment;
    }

    switchTab(tabName) {
        // Update tab buttons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
        
        // Update tab content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(`${tabName}-tab`).classList.add('active');
        
        // Load tab-specific data
        if (tabName === 'analytics') {
            this.loadAnalytics();
        }
    }

    viewStudentDetails(studentId) {
        // In a real app, this would open a detailed student view
        alert(`Viewing details for student ${studentId}`);
    }

    showSuccessMessage(message) {
        const notification = document.createElement('div');
        notification.className = 'success-notification';
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-icon">✅</span>
                <span class="notification-text">${message}</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    // Export student data
    async exportStudentData() {
        const students = await this.getMockStudents();
        const csvContent = this.convertToCSV(students);
        this.downloadCSV(csvContent, 'student-progress.csv');
    }

    convertToCSV(data) {
        const headers = ['Name', 'Progress %', 'Points', 'Level', 'Last Active'];
        const rows = data.map(student => [
            student.name,
            student.progress,
            student.points,
            student.level,
            student.lastActive
        ]);
        
        return [headers, ...rows].map(row => row.join(',')).join('\n');
    }

    downloadCSV(content, filename) {
        const blob = new Blob([content], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        window.URL.revokeObjectURL(url);
    }

    // Generate printable report
    generatePrintableReport() {
        const printWindow = window.open('', '_blank');
        const students = this.getMockStudents();
        
        const reportHTML = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Class Progress Report</title>
                <style>
                    body { font-family: Arial, sans-serif; margin: 20px; }
                    table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                    th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                    th { background-color: #f2f2f2; }
                    .header { text-align: center; margin-bottom: 30px; }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>Class Progress Report</h1>
                    <p>Generated on ${new Date().toLocaleDateString()}</p>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th>Student Name</th>
                            <th>Progress %</th>
                            <th>Points</th>
                            <th>Level</th>
                            <th>Last Active</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${students.map(student => `
                            <tr>
                                <td>${student.name}</td>
                                <td>${student.progress}%</td>
                                <td>${student.points}</td>
                                <td>${student.level}</td>
                                <td>${student.lastActive}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </body>
            </html>
        `;
        
        printWindow.document.write(reportHTML);
        printWindow.document.close();
        printWindow.print();
    }
}

// Initialize teacher dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.teacherDashboard = new TeacherDashboard();
});