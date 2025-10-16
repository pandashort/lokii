const express = require('express');
const router = express.Router();

// Mock progress database - in a real app, this would be a proper database
const progress = [
    {
        id: 1,
        userId: 1,
        moduleId: 1,
        score: 85,
        timeSpent: 900, // seconds
        completedAt: '2024-01-15T10:30:00Z',
        answers: [
            { questionId: 1, answer: 1, isCorrect: true },
            { questionId: 2, answer: 0, isCorrect: true }
        ],
        hintsUsed: 0,
        attempts: 1
    },
    {
        id: 2,
        userId: 1,
        moduleId: 2,
        score: 90,
        timeSpent: 1200,
        completedAt: '2024-01-16T14:20:00Z',
        answers: [
            { questionId: 1, answer: 1, isCorrect: true },
            { questionId: 2, answer: 2, isCorrect: true }
        ],
        hintsUsed: 1,
        attempts: 1
    },
    {
        id: 3,
        userId: 2,
        moduleId: 1,
        score: 75,
        timeSpent: 1100,
        completedAt: '2024-01-17T09:15:00Z',
        answers: [
            { questionId: 1, answer: 0, isCorrect: false },
            { questionId: 2, answer: 0, isCorrect: true }
        ],
        hintsUsed: 2,
        attempts: 2
    }
];

// Get user progress
router.get('/user/:userId', (req, res) => {
    try {
        const userId = parseInt(req.params.userId);
        const userProgress = progress.filter(p => p.userId === userId);
        
        res.json({
            success: true,
            progress: userProgress,
            total: userProgress.length
        });
        
    } catch (error) {
        console.error('Get user progress error:', error);
        res.status(500).json({ 
            error: 'Internal server error' 
        });
    }
});

// Get progress for specific module
router.get('/user/:userId/module/:moduleId', (req, res) => {
    try {
        const userId = parseInt(req.params.userId);
        const moduleId = parseInt(req.params.moduleId);
        
        const moduleProgress = progress.find(p => 
            p.userId === userId && p.moduleId === moduleId
        );
        
        if (!moduleProgress) {
            return res.status(404).json({ 
                error: 'Progress not found' 
            });
        }
        
        res.json({
            success: true,
            progress: moduleProgress
        });
        
    } catch (error) {
        console.error('Get module progress error:', error);
        res.status(500).json({ 
            error: 'Internal server error' 
        });
    }
});

// Save progress
router.post('/', (req, res) => {
    try {
        const { userId, moduleId, score, timeSpent, answers, hintsUsed, attempts } = req.body;
        
        if (!userId || !moduleId || score === undefined) {
            return res.status(400).json({ 
                error: 'userId, moduleId, and score are required' 
            });
        }
        
        // Check if progress already exists
        const existingProgress = progress.find(p => 
            p.userId === userId && p.moduleId === moduleId
        );
        
        if (existingProgress) {
            // Update existing progress
            existingProgress.score = score;
            existingProgress.timeSpent = timeSpent || existingProgress.timeSpent;
            existingProgress.answers = answers || existingProgress.answers;
            existingProgress.hintsUsed = hintsUsed || existingProgress.hintsUsed;
            existingProgress.attempts = (existingProgress.attempts || 0) + 1;
            existingProgress.completedAt = new Date().toISOString();
            
            res.json({
                success: true,
                progress: existingProgress,
                message: 'Progress updated successfully'
            });
        } else {
            // Create new progress
            const newProgress = {
                id: progress.length + 1,
                userId,
                moduleId,
                score,
                timeSpent: timeSpent || 0,
                completedAt: new Date().toISOString(),
                answers: answers || [],
                hintsUsed: hintsUsed || 0,
                attempts: attempts || 1
            };
            
            progress.push(newProgress);
            
            res.status(201).json({
                success: true,
                progress: newProgress,
                message: 'Progress saved successfully'
            });
        }
        
    } catch (error) {
        console.error('Save progress error:', error);
        res.status(500).json({ 
            error: 'Internal server error' 
        });
    }
});

// Get class progress (for teachers)
router.get('/class/:classId', (req, res) => {
    try {
        const classId = req.params.classId;
        
        // Mock class data - in a real app, this would come from a database
        const classProgress = [
            {
                studentId: 1,
                studentName: 'Alice Johnson',
                totalModules: 4,
                completedModules: 2,
                averageScore: 87.5,
                totalTimeSpent: 2100,
                lastActive: '2024-01-16T14:20:00Z'
            },
            {
                studentId: 2,
                studentName: 'Bob Smith',
                totalModules: 4,
                completedModules: 1,
                averageScore: 75,
                totalTimeSpent: 1100,
                lastActive: '2024-01-17T09:15:00Z'
            }
        ];
        
        res.json({
            success: true,
            classProgress,
            total: classProgress.length
        });
        
    } catch (error) {
        console.error('Get class progress error:', error);
        res.status(500).json({ 
            error: 'Internal server error' 
        });
    }
});

// Get progress statistics
router.get('/stats/:userId', (req, res) => {
    try {
        const userId = parseInt(req.params.userId);
        const userProgress = progress.filter(p => p.userId === userId);
        
        if (userProgress.length === 0) {
            return res.json({
                success: true,
                stats: {
                    totalModules: 0,
                    completedModules: 0,
                    averageScore: 0,
                    totalTimeSpent: 0,
                    totalHintsUsed: 0,
                    totalAttempts: 0
                }
            });
        }
        
        const stats = {
            totalModules: 4, // Mock total modules
            completedModules: userProgress.length,
            averageScore: Math.round(
                userProgress.reduce((sum, p) => sum + p.score, 0) / userProgress.length
            ),
            totalTimeSpent: userProgress.reduce((sum, p) => sum + p.timeSpent, 0),
            totalHintsUsed: userProgress.reduce((sum, p) => sum + p.hintsUsed, 0),
            totalAttempts: userProgress.reduce((sum, p) => sum + p.attempts, 0)
        };
        
        res.json({
            success: true,
            stats
        });
        
    } catch (error) {
        console.error('Get progress stats error:', error);
        res.status(500).json({ 
            error: 'Internal server error' 
        });
    }
});

// Get progress by module (for analytics)
router.get('/module/:moduleId', (req, res) => {
    try {
        const moduleId = parseInt(req.params.moduleId);
        const moduleProgress = progress.filter(p => p.moduleId === moduleId);
        
        if (moduleProgress.length === 0) {
            return res.json({
                success: true,
                progress: [],
                stats: {
                    totalAttempts: 0,
                    averageScore: 0,
                    completionRate: 0,
                    averageTimeSpent: 0
                }
            });
        }
        
        const stats = {
            totalAttempts: moduleProgress.length,
            averageScore: Math.round(
                moduleProgress.reduce((sum, p) => sum + p.score, 0) / moduleProgress.length
            ),
            completionRate: 100, // Mock completion rate
            averageTimeSpent: Math.round(
                moduleProgress.reduce((sum, p) => sum + p.timeSpent, 0) / moduleProgress.length
            )
        };
        
        res.json({
            success: true,
            progress: moduleProgress,
            stats
        });
        
    } catch (error) {
        console.error('Get module progress error:', error);
        res.status(500).json({ 
            error: 'Internal server error' 
        });
    }
});

// Delete progress (for testing)
router.delete('/:id', (req, res) => {
    try {
        const progressId = parseInt(req.params.id);
        const progressIndex = progress.findIndex(p => p.id === progressId);
        
        if (progressIndex === -1) {
            return res.status(404).json({ 
                error: 'Progress not found' 
            });
        }
        
        progress.splice(progressIndex, 1);
        
        res.json({
            success: true,
            message: 'Progress deleted successfully'
        });
        
    } catch (error) {
        console.error('Delete progress error:', error);
        res.status(500).json({ 
            error: 'Internal server error' 
        });
    }
});

module.exports = router;
