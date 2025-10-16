const express = require('express');
const router = express.Router();

// Mock admin data - in a real app, this would be a proper database
const schools = [
    {
        id: 1,
        name: 'Rural Elementary School',
        location: 'Rural Area, State',
        totalStudents: 150,
        totalTeachers: 8,
        isActive: true,
        createdAt: '2024-01-01T00:00:00Z'
    },
    {
        id: 2,
        name: 'Mountain View School',
        location: 'Mountain Area, State',
        totalStudents: 200,
        totalTeachers: 12,
        isActive: true,
        createdAt: '2024-01-01T00:00:00Z'
    }
];

const users = [
    {
        id: 1,
        username: 'student1',
        name: 'Alice Johnson',
        role: 'student',
        grade: 8,
        school: 'Rural Elementary School',
        isActive: true,
        lastLogin: '2024-01-20T10:30:00Z'
    },
    {
        id: 2,
        username: 'student2',
        name: 'Bob Smith',
        role: 'student',
        grade: 9,
        school: 'Rural Elementary School',
        isActive: true,
        lastLogin: '2024-01-20T09:15:00Z'
    },
    {
        id: 3,
        username: 'teacher1',
        name: 'Ms. Rodriguez',
        role: 'teacher',
        subjects: ['Math', 'Science'],
        school: 'Rural Elementary School',
        isActive: true,
        lastLogin: '2024-01-20T08:00:00Z'
    }
];

// Get all schools
router.get('/schools', (req, res) => {
    try {
        res.json({
            success: true,
            schools,
            total: schools.length
        });
    } catch (error) {
        console.error('Get schools error:', error);
        res.status(500).json({ 
            error: 'Internal server error' 
        });
    }
});

// Get school by ID
router.get('/schools/:id', (req, res) => {
    try {
        const schoolId = parseInt(req.params.id);
        const school = schools.find(s => s.id === schoolId);
        
        if (!school) {
            return res.status(404).json({ 
                error: 'School not found' 
            });
        }
        
        res.json({
            success: true,
            school
        });
    } catch (error) {
        console.error('Get school error:', error);
        res.status(500).json({ 
            error: 'Internal server error' 
        });
    }
});

// Create new school
router.post('/schools', (req, res) => {
    try {
        const { name, location, totalStudents, totalTeachers } = req.body;
        
        if (!name || !location) {
            return res.status(400).json({ 
                error: 'Name and location are required' 
            });
        }
        
        const newSchool = {
            id: schools.length + 1,
            name,
            location,
            totalStudents: totalStudents || 0,
            totalTeachers: totalTeachers || 0,
            isActive: true,
            createdAt: new Date().toISOString()
        };
        
        schools.push(newSchool);
        
        res.status(201).json({
            success: true,
            school: newSchool,
            message: 'School created successfully'
        });
    } catch (error) {
        console.error('Create school error:', error);
        res.status(500).json({ 
            error: 'Internal server error' 
        });
    }
});

// Get all users
router.get('/users', (req, res) => {
    try {
        const { role, school, isActive } = req.query;
        
        let filteredUsers = users;
        
        // Filter by role
        if (role) {
            filteredUsers = filteredUsers.filter(u => u.role === role);
        }
        
        // Filter by school
        if (school) {
            filteredUsers = filteredUsers.filter(u => 
                u.school.toLowerCase().includes(school.toLowerCase())
            );
        }
        
        // Filter by active status
        if (isActive !== undefined) {
            filteredUsers = filteredUsers.filter(u => u.isActive === (isActive === 'true'));
        }
        
        res.json({
            success: true,
            users: filteredUsers,
            total: filteredUsers.length
        });
    } catch (error) {
        console.error('Get users error:', error);
        res.status(500).json({ 
            error: 'Internal server error' 
        });
    }
});

// Get user by ID
router.get('/users/:id', (req, res) => {
    try {
        const userId = parseInt(req.params.id);
        const user = users.find(u => u.id === userId);
        
        if (!user) {
            return res.status(404).json({ 
                error: 'User not found' 
            });
        }
        
        res.json({
            success: true,
            user
        });
    } catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({ 
            error: 'Internal server error' 
        });
    }
});

// Update user
router.put('/users/:id', (req, res) => {
    try {
        const userId = parseInt(req.params.id);
        const userIndex = users.findIndex(u => u.id === userId);
        
        if (userIndex === -1) {
            return res.status(404).json({ 
                error: 'User not found' 
            });
        }
        
        const updatedUser = {
            ...users[userIndex],
            ...req.body,
            id: userId // Ensure ID doesn't change
        };
        
        users[userIndex] = updatedUser;
        
        res.json({
            success: true,
            user: updatedUser,
            message: 'User updated successfully'
        });
    } catch (error) {
        console.error('Update user error:', error);
        res.status(500).json({ 
            error: 'Internal server error' 
        });
    }
});

// Deactivate user
router.delete('/users/:id', (req, res) => {
    try {
        const userId = parseInt(req.params.id);
        const userIndex = users.findIndex(u => u.id === userId);
        
        if (userIndex === -1) {
            return res.status(404).json({ 
                error: 'User not found' 
            });
        }
        
        users[userIndex].isActive = false;
        
        res.json({
            success: true,
            message: 'User deactivated successfully'
        });
    } catch (error) {
        console.error('Deactivate user error:', error);
        res.status(500).json({ 
            error: 'Internal server error' 
        });
    }
});

// Get system statistics
router.get('/stats', (req, res) => {
    try {
        const stats = {
            totalSchools: schools.length,
            totalUsers: users.length,
            activeUsers: users.filter(u => u.isActive).length,
            students: users.filter(u => u.role === 'student').length,
            teachers: users.filter(u => u.role === 'teacher').length,
            totalStudents: schools.reduce((sum, s) => sum + s.totalStudents, 0),
            totalTeachers: schools.reduce((sum, s) => sum + s.totalTeachers, 0),
            averageStudentsPerSchool: Math.round(
                schools.reduce((sum, s) => sum + s.totalStudents, 0) / schools.length
            )
        };
        
        res.json({
            success: true,
            stats
        });
    } catch (error) {
        console.error('Get system stats error:', error);
        res.status(500).json({ 
            error: 'Internal server error' 
        });
    }
});

// Get user activity
router.get('/activity', (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        
        // Mock activity data - in a real app, this would come from analytics
        const activity = [
            {
                date: '2024-01-20',
                activeUsers: 25,
                newUsers: 3,
                modulesCompleted: 45,
                averageSessionTime: 25
            },
            {
                date: '2024-01-19',
                activeUsers: 22,
                newUsers: 2,
                modulesCompleted: 38,
                averageSessionTime: 23
            },
            {
                date: '2024-01-18',
                activeUsers: 28,
                newUsers: 5,
                modulesCompleted: 52,
                averageSessionTime: 27
            }
        ];
        
        res.json({
            success: true,
            activity
        });
    } catch (error) {
        console.error('Get activity error:', error);
        res.status(500).json({ 
            error: 'Internal server error' 
        });
    }
});

// Export data
router.get('/export', (req, res) => {
    try {
        const { type = 'users', format = 'json' } = req.query;
        
        let data = [];
        let filename = '';
        
        if (type === 'users') {
            data = users;
            filename = 'users';
        } else if (type === 'schools') {
            data = schools;
            filename = 'schools';
        } else {
            return res.status(400).json({ 
                error: 'Invalid export type' 
            });
        }
        
        if (format === 'csv') {
            // Convert to CSV format
            const headers = Object.keys(data[0] || {});
            const csv = [
                headers.join(','),
                ...data.map(item => 
                    headers.map(header => 
                        typeof item[header] === 'object' ? 
                            JSON.stringify(item[header]) : 
                            item[header]
                    ).join(',')
                )
            ].join('\n');
            
            res.setHeader('Content-Type', 'text/csv');
            res.setHeader('Content-Disposition', `attachment; filename="${filename}.csv"`);
            res.send(csv);
        } else {
            // Return as JSON
            res.json({
                success: true,
                data,
                exportedAt: new Date().toISOString()
            });
        }
    } catch (error) {
        console.error('Export data error:', error);
        res.status(500).json({ 
            error: 'Internal server error' 
        });
    }
});

module.exports = router;
