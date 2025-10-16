const express = require('express');
const router = express.Router();

// Mock modules database - in a real app, this would be a proper database
const modules = [
    {
        id: 1,
        title: 'Basic Algebra',
        subject: 'Math',
        grade: 8,
        difficulty: 'Easy',
        estimatedTime: '15 min',
        description: 'Learn the fundamentals of algebraic expressions',
        image: '/assets/modules/algebra.jpg',
        content: {
            type: 'quiz',
            questions: [
                {
                    id: 1,
                    type: 'multiple_choice',
                    question: 'What is the value of x in the equation 2x + 5 = 13?',
                    options: ['3', '4', '5', '6'],
                    correct: 1,
                    explanation: 'To solve: 2x + 5 = 13, subtract 5 from both sides: 2x = 8, then divide by 2: x = 4'
                },
                {
                    id: 2,
                    type: 'multiple_choice',
                    question: 'Simplify the expression: 3x + 2x - 5',
                    options: ['5x - 5', '5x + 5', 'x - 5', '6x - 5'],
                    correct: 0,
                    explanation: 'Combine like terms: 3x + 2x = 5x, so 3x + 2x - 5 = 5x - 5'
                }
            ]
        },
        isActive: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
    },
    {
        id: 2,
        title: 'Photosynthesis',
        subject: 'Science',
        grade: 8,
        difficulty: 'Medium',
        estimatedTime: '20 min',
        description: 'Understand how plants make their own food',
        image: '/assets/modules/photosynthesis.jpg',
        content: {
            type: 'quiz',
            questions: [
                {
                    id: 1,
                    type: 'multiple_choice',
                    question: 'What gas do plants absorb from the atmosphere during photosynthesis?',
                    options: ['Oxygen', 'Carbon Dioxide', 'Nitrogen', 'Water Vapor'],
                    correct: 1,
                    explanation: 'Plants absorb carbon dioxide from the atmosphere during photosynthesis'
                },
                {
                    id: 2,
                    type: 'multiple_choice',
                    question: 'What is the main product of photosynthesis?',
                    options: ['Water', 'Carbon Dioxide', 'Glucose', 'Oxygen'],
                    correct: 2,
                    explanation: 'Glucose is the main product of photosynthesis, which plants use for energy'
                }
            ]
        },
        isActive: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
    },
    {
        id: 3,
        title: 'Electric Circuits',
        subject: 'Physics',
        grade: 9,
        difficulty: 'Hard',
        estimatedTime: '25 min',
        description: 'Explore the basics of electrical circuits',
        image: '/assets/modules/circuits.jpg',
        content: {
            type: 'interactive',
            steps: [
                {
                    id: 1,
                    title: 'Introduction to Circuits',
                    content: 'Learn about basic electrical components and how they work together',
                    type: 'text'
                },
                {
                    id: 2,
                    title: 'Building Your First Circuit',
                    content: 'Interactive simulation to build a simple circuit',
                    type: 'simulation'
                }
            ]
        },
        isActive: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
    },
    {
        id: 4,
        title: 'Chemical Reactions',
        subject: 'Chemistry',
        grade: 10,
        difficulty: 'Medium',
        estimatedTime: '18 min',
        description: 'Discover different types of chemical reactions',
        image: '/assets/modules/chemistry.jpg',
        content: {
            type: 'quiz',
            questions: [
                {
                    id: 1,
                    type: 'multiple_choice',
                    question: 'What type of reaction is: 2H2 + O2 → 2H2O?',
                    options: ['Combination', 'Decomposition', 'Single Replacement', 'Double Replacement'],
                    correct: 0,
                    explanation: 'This is a combination reaction where two or more substances combine to form a single product'
                }
            ]
        },
        isActive: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
    }
];

// Get all modules
router.get('/', (req, res) => {
    try {
        const { subject, grade, difficulty, search } = req.query;
        
        let filteredModules = modules.filter(module => module.isActive);
        
        // Filter by subject
        if (subject) {
            filteredModules = filteredModules.filter(module => 
                module.subject.toLowerCase() === subject.toLowerCase()
            );
        }
        
        // Filter by grade
        if (grade) {
            filteredModules = filteredModules.filter(module => 
                module.grade === parseInt(grade)
            );
        }
        
        // Filter by difficulty
        if (difficulty) {
            filteredModules = filteredModules.filter(module => 
                module.difficulty.toLowerCase() === difficulty.toLowerCase()
            );
        }
        
        // Search by title or description
        if (search) {
            const searchTerm = search.toLowerCase();
            filteredModules = filteredModules.filter(module => 
                module.title.toLowerCase().includes(searchTerm) ||
                module.description.toLowerCase().includes(searchTerm)
            );
        }
        
        res.json({
            success: true,
            modules: filteredModules,
            total: filteredModules.length
        });
        
    } catch (error) {
        console.error('Get modules error:', error);
        res.status(500).json({ 
            error: 'Internal server error' 
        });
    }
});

// Get module by ID
router.get('/:id', (req, res) => {
    try {
        const moduleId = parseInt(req.params.id);
        const module = modules.find(m => m.id === moduleId && m.isActive);
        
        if (!module) {
            return res.status(404).json({ 
                error: 'Module not found' 
            });
        }
        
        res.json({
            success: true,
            module
        });
        
    } catch (error) {
        console.error('Get module error:', error);
        res.status(500).json({ 
            error: 'Internal server error' 
        });
    }
});

// Get module content
router.get('/:id/content', (req, res) => {
    try {
        const moduleId = parseInt(req.params.id);
        const module = modules.find(m => m.id === moduleId && m.isActive);
        
        if (!module) {
            return res.status(404).json({ 
                error: 'Module not found' 
            });
        }
        
        res.json({
            success: true,
            content: module.content
        });
        
    } catch (error) {
        console.error('Get module content error:', error);
        res.status(500).json({ 
            error: 'Internal server error' 
        });
    }
});

// Get modules by subject
router.get('/subject/:subject', (req, res) => {
    try {
        const subject = req.params.subject;
        const subjectModules = modules.filter(module => 
            module.subject.toLowerCase() === subject.toLowerCase() && module.isActive
        );
        
        res.json({
            success: true,
            modules: subjectModules,
            total: subjectModules.length
        });
        
    } catch (error) {
        console.error('Get modules by subject error:', error);
        res.status(500).json({ 
            error: 'Internal server error' 
        });
    }
});

// Get modules by grade
router.get('/grade/:grade', (req, res) => {
    try {
        const grade = parseInt(req.params.grade);
        const gradeModules = modules.filter(module => 
            module.grade === grade && module.isActive
        );
        
        res.json({
            success: true,
            modules: gradeModules,
            total: gradeModules.length
        });
        
    } catch (error) {
        console.error('Get modules by grade error:', error);
        res.status(500).json({ 
            error: 'Internal server error' 
        });
    }
});

// Get module statistics
router.get('/:id/stats', (req, res) => {
    try {
        const moduleId = parseInt(req.params.id);
        const module = modules.find(m => m.id === moduleId && m.isActive);
        
        if (!module) {
            return res.status(404).json({ 
                error: 'Module not found' 
            });
        }
        
        // Mock statistics - in a real app, this would come from analytics
        const stats = {
            totalAttempts: Math.floor(Math.random() * 100) + 50,
            averageScore: Math.floor(Math.random() * 30) + 70,
            completionRate: Math.floor(Math.random() * 20) + 80,
            averageTimeSpent: Math.floor(Math.random() * 10) + 15
        };
        
        res.json({
            success: true,
            stats
        });
        
    } catch (error) {
        console.error('Get module stats error:', error);
        res.status(500).json({ 
            error: 'Internal server error' 
        });
    }
});

module.exports = router;
