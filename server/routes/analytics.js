const express = require('express');
const router = express.Router();

// Mock analytics database - in a real app, this would be a proper database
const analytics = [
    {
        id: 1,
        eventType: 'module_started',
        userId: 1,
        moduleId: 1,
        timestamp: '2024-01-15T10:00:00Z',
        properties: {
            moduleName: 'Basic Algebra',
            subject: 'Math',
            grade: 8
        }
    },
    {
        id: 2,
        eventType: 'module_completed',
        userId: 1,
        moduleId: 1,
        timestamp: '2024-01-15T10:15:00Z',
        properties: {
            moduleName: 'Basic Algebra',
            score: 85,
            timeSpent: 900
        }
    },
    {
        id: 3,
        eventType: 'hint_used',
        userId: 1,
        moduleId: 1,
        timestamp: '2024-01-15T10:10:00Z',
        properties: {
            hintType: 'general',
            questionId: 1
        }
    }
];

// Track analytics event
router.post('/events', (req, res) => {
    try {
        const { eventType, userId, moduleId, properties } = req.body;
        
        if (!eventType || !userId) {
            return res.status(400).json({ 
                error: 'eventType and userId are required' 
            });
        }
        
        const event = {
            id: analytics.length + 1,
            eventType,
            userId,
            moduleId,
            timestamp: new Date().toISOString(),
            properties: properties || {}
        };
        
        analytics.push(event);
        
        res.status(201).json({
            success: true,
            event,
            message: 'Event tracked successfully'
        });
        
    } catch (error) {
        console.error('Track analytics event error:', error);
        res.status(500).json({ 
            error: 'Internal server error' 
        });
    }
});

// Get analytics for user
router.get('/user/:userId', (req, res) => {
    try {
        const userId = parseInt(req.params.userId);
        const { startDate, endDate, eventType } = req.query;
        
        let userAnalytics = analytics.filter(a => a.userId === userId);
        
        // Filter by date range
        if (startDate) {
            userAnalytics = userAnalytics.filter(a => 
                new Date(a.timestamp) >= new Date(startDate)
            );
        }
        
        if (endDate) {
            userAnalytics = userAnalytics.filter(a => 
                new Date(a.timestamp) <= new Date(endDate)
            );
        }
        
        // Filter by event type
        if (eventType) {
            userAnalytics = userAnalytics.filter(a => 
                a.eventType === eventType
            );
        }
        
        res.json({
            success: true,
            analytics: userAnalytics,
            total: userAnalytics.length
        });
        
    } catch (error) {
        console.error('Get user analytics error:', error);
        res.status(500).json({ 
            error: 'Internal server error' 
        });
    }
});

// Get analytics for module
router.get('/module/:moduleId', (req, res) => {
    try {
        const moduleId = parseInt(req.params.moduleId);
        const { startDate, endDate } = req.query;
        
        let moduleAnalytics = analytics.filter(a => a.moduleId === moduleId);
        
        // Filter by date range
        if (startDate) {
            moduleAnalytics = moduleAnalytics.filter(a => 
                new Date(a.timestamp) >= new Date(startDate)
            );
        }
        
        if (endDate) {
            moduleAnalytics = moduleAnalytics.filter(a => 
                new Date(a.timestamp) <= new Date(endDate)
            );
        }
        
        res.json({
            success: true,
            analytics: moduleAnalytics,
            total: moduleAnalytics.length
        });
        
    } catch (error) {
        console.error('Get module analytics error:', error);
        res.status(500).json({ 
            error: 'Internal server error' 
        });
    }
});

// Get engagement metrics
router.get('/engagement/:userId', (req, res) => {
    try {
        const userId = parseInt(req.params.userId);
        const userAnalytics = analytics.filter(a => a.userId === userId);
        
        const engagement = {
            totalSessions: userAnalytics.filter(a => a.eventType === 'session_started').length,
            totalModulesStarted: userAnalytics.filter(a => a.eventType === 'module_started').length,
            totalModulesCompleted: userAnalytics.filter(a => a.eventType === 'module_completed').length,
            totalHintsUsed: userAnalytics.filter(a => a.eventType === 'hint_used').length,
            averageSessionDuration: 0, // Mock calculation
            lastActive: userAnalytics.length > 0 ? 
                userAnalytics[userAnalytics.length - 1].timestamp : null
        };
        
        res.json({
            success: true,
            engagement
        });
        
    } catch (error) {
        console.error('Get engagement metrics error:', error);
        res.status(500).json({ 
            error: 'Internal server error' 
        });
    }
});

// Get class analytics (for teachers)
router.get('/class/:classId', (req, res) => {
    try {
        const classId = req.params.classId;
        
        // Mock class analytics - in a real app, this would come from a database
        const classAnalytics = {
            totalStudents: 25,
            activeStudents: 20,
            averageEngagement: 78,
            topPerformingModule: 'Basic Algebra',
            strugglingStudents: 3,
            averageScore: 82,
            totalModulesCompleted: 156,
            engagementTrend: [
                { date: '2024-01-15', engagement: 75 },
                { date: '2024-01-16', engagement: 80 },
                { date: '2024-01-17', engagement: 78 },
                { date: '2024-01-18', engagement: 85 },
                { date: '2024-01-19', engagement: 82 }
            ]
        };
        
        res.json({
            success: true,
            analytics: classAnalytics
        });
        
    } catch (error) {
        console.error('Get class analytics error:', error);
        res.status(500).json({ 
            error: 'Internal server error' 
        });
    }
});

// Get system-wide analytics (for admins)
router.get('/system', (req, res) => {
    try {
        const systemAnalytics = {
            totalUsers: 150,
            activeUsers: 120,
            totalModules: 25,
            totalSessions: 1250,
            averageEngagement: 75,
            topModules: [
                { moduleId: 1, name: 'Basic Algebra', completions: 85 },
                { moduleId: 2, name: 'Photosynthesis', completions: 78 },
                { moduleId: 3, name: 'Electric Circuits', completions: 65 }
            ],
            userGrowth: [
                { month: '2024-01', users: 120 },
                { month: '2024-02', users: 135 },
                { month: '2024-03', users: 150 }
            ]
        };
        
        res.json({
            success: true,
            analytics: systemAnalytics
        });
        
    } catch (error) {
        console.error('Get system analytics error:', error);
        res.status(500).json({ 
            error: 'Internal server error' 
        });
    }
});

// Export analytics data
router.get('/export/:userId', (req, res) => {
    try {
        const userId = parseInt(req.params.userId);
        const { format = 'json' } = req.query;
        
        const userAnalytics = analytics.filter(a => a.userId === userId);
        
        if (format === 'csv') {
            // Convert to CSV format
            const csv = [
                'Event Type,Module ID,Timestamp,Properties',
                ...userAnalytics.map(a => 
                    `${a.eventType},${a.moduleId || ''},${a.timestamp},"${JSON.stringify(a.properties)}"`
                )
            ].join('\n');
            
            res.setHeader('Content-Type', 'text/csv');
            res.setHeader('Content-Disposition', `attachment; filename="analytics-${userId}.csv"`);
            res.send(csv);
        } else {
            // Return as JSON
            res.json({
                success: true,
                data: userAnalytics,
                exportedAt: new Date().toISOString()
            });
        }
        
    } catch (error) {
        console.error('Export analytics error:', error);
        res.status(500).json({ 
            error: 'Internal server error' 
        });
    }
});

module.exports = router;
