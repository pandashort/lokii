export class ModuleViewer {
    constructor(app) {
        this.app = app;
        this.currentModule = null;
        this.currentQuestion = 0;
        this.score = 0;
        this.startTime = null;
        this.questions = [];
        this.userAnswers = [];
    }

    async render() {
        const moduleId = this.app.currentParams?.moduleId;
        if (!moduleId) {
            return '<div class="error-container">Module not found</div>';
        }

        await this.loadModule(moduleId);
        
        if (!this.currentModule) {
            return '<div class="error-container">Failed to load module</div>';
        }

        return `
            <div class="module-viewer">
                <div class="module-header">
                    <button class="btn btn-outline" onclick="this.app.navigateTo('student-dashboard')">
                        ← Back to Dashboard
                    </button>
                    <div class="module-info">
                        <h2>${this.currentModule.title}</h2>
                        <div class="module-meta">
                            <span class="badge badge-primary">${this.currentModule.subject}</span>
                            <span class="badge badge-secondary">${this.currentModule.grade}</span>
                            <span class="module-difficulty">${this.currentModule.difficulty}</span>
                        </div>
                    </div>
                    <div class="module-progress">
                        <div class="progress">
                            <div class="progress-bar" style="width: ${this.getProgressPercentage()}%"></div>
                        </div>
                        <span class="progress-text">${this.currentQuestion + 1} / ${this.questions.length}</span>
                    </div>
                </div>

                <div class="module-content">
                    ${this.renderCurrentQuestion()}
                </div>

                <div class="module-footer">
                    <div class="module-actions">
                        ${this.currentQuestion > 0 ? `
                            <button class="btn btn-outline" onclick="this.previousQuestion()">
                                Previous
                            </button>
                        ` : ''}
                        <button class="btn btn-primary" onclick="this.nextQuestion()" id="next-btn">
                            ${this.currentQuestion === this.questions.length - 1 ? 'Finish' : 'Next'}
                        </button>
                    </div>
                    <div class="module-hints">
                        <button class="btn btn-sm btn-outline" onclick="this.showHint()" id="hint-btn">
                            💡 Hint
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    async loadModule(moduleId) {
        // Mock module data - in a real app, this would load from the offline manager
        const modules = {
            1: {
                id: 1,
                title: 'Basic Algebra',
                subject: 'Math',
                grade: 8,
                difficulty: 'Easy',
                description: 'Learn the fundamentals of algebraic expressions',
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
                    },
                    {
                        id: 3,
                        type: 'drag_drop',
                        question: 'Drag the correct values to complete the equation: 2x + 3 = 9',
                        options: ['x = 2', 'x = 3', 'x = 4', 'x = 5'],
                        correct: 1,
                        explanation: '2x + 3 = 9, so 2x = 6, therefore x = 3'
                    }
                ]
            },
            2: {
                id: 2,
                title: 'Photosynthesis',
                subject: 'Science',
                grade: 8,
                difficulty: 'Medium',
                description: 'Understand how plants make their own food',
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
            }
        };

        this.currentModule = modules[moduleId];
        if (this.currentModule) {
            this.questions = this.currentModule.questions;
            this.startTime = Date.now();
            
            // Track module start
            if (this.app.analytics) {
                this.app.analytics.trackModuleStart(moduleId, this.currentModule.title);
            }
        }
    }

    renderCurrentQuestion() {
        if (this.currentQuestion >= this.questions.length) {
            return this.renderResults();
        }

        const question = this.questions[this.currentQuestion];
        const userAnswer = this.userAnswers[this.currentQuestion];

        return `
            <div class="question-container">
                <div class="question-header">
                    <h3>Question ${this.currentQuestion + 1}</h3>
                    <div class="question-type">${this.getQuestionTypeLabel(question.type)}</div>
                </div>
                
                <div class="question-content">
                    <p class="question-text">${question.question}</p>
                    
                    ${this.renderQuestionOptions(question, userAnswer)}
                    
                    ${userAnswer !== undefined ? this.renderAnswerFeedback(question, userAnswer) : ''}
                </div>
            </div>
        `;
    }

    renderQuestionOptions(question, userAnswer) {
        if (question.type === 'multiple_choice') {
            return `
                <div class="options-container">
                    ${question.options.map((option, index) => `
                        <label class="option-item ${userAnswer === index ? 'selected' : ''}">
                            <input type="radio" name="question_${question.id}" value="${index}" 
                                   ${userAnswer === index ? 'checked' : ''} 
                                   onchange="this.selectAnswer(${index})">
                            <span class="option-text">${option}</span>
                        </label>
                    `).join('')}
                </div>
            `;
        } else if (question.type === 'drag_drop') {
            return `
                <div class="drag-drop-container">
                    <div class="drop-zone">
                        <div class="drop-placeholder">Drop your answer here</div>
                    </div>
                    <div class="drag-options">
                        ${question.options.map((option, index) => `
                            <div class="drag-item" draggable="true" data-value="${index}">
                                ${option}
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        }
        
        return '';
    }

    renderAnswerFeedback(question, userAnswer) {
        const isCorrect = userAnswer === question.correct;
        
        return `
            <div class="answer-feedback ${isCorrect ? 'correct' : 'incorrect'}">
                <div class="feedback-icon">${isCorrect ? '✅' : '❌'}</div>
                <div class="feedback-content">
                    <div class="feedback-title">${isCorrect ? 'Correct!' : 'Incorrect'}</div>
                    <div class="feedback-explanation">${question.explanation}</div>
                </div>
            </div>
        `;
    }

    renderResults() {
        const totalQuestions = this.questions.length;
        const correctAnswers = this.userAnswers.filter((answer, index) => 
            answer === this.questions[index].correct
        ).length;
        const percentage = Math.round((correctAnswers / totalQuestions) * 100);
        const timeSpent = Math.round((Date.now() - this.startTime) / 1000);

        // Track module completion
        if (this.app.analytics) {
            this.app.analytics.trackModuleComplete(
                this.currentModule.id, 
                this.currentModule.title, 
                percentage, 
                timeSpent
            );
        }

        return `
            <div class="results-container">
                <div class="results-header">
                    <h2>Module Complete!</h2>
                    <div class="completion-badge">🎉</div>
                </div>
                
                <div class="results-stats">
                    <div class="stat-item">
                        <div class="stat-value">${percentage}%</div>
                        <div class="stat-label">Score</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-value">${correctAnswers}/${totalQuestions}</div>
                        <div class="stat-label">Correct Answers</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-value">${Math.floor(timeSpent / 60)}m ${timeSpent % 60}s</div>
                        <div class="stat-label">Time Spent</div>
                    </div>
                </div>

                <div class="results-actions">
                    <button class="btn btn-primary" onclick="this.app.navigateTo('student-dashboard')">
                        Back to Dashboard
                    </button>
                    <button class="btn btn-outline" onclick="this.restartModule()">
                        Try Again
                    </button>
                </div>
            </div>
        `;
    }

    getQuestionTypeLabel(type) {
        const labels = {
            'multiple_choice': 'Multiple Choice',
            'drag_drop': 'Drag & Drop',
            'fill_blank': 'Fill in the Blank',
            'true_false': 'True/False'
        };
        return labels[type] || type;
    }

    getProgressPercentage() {
        return ((this.currentQuestion + 1) / this.questions.length) * 100;
    }

    selectAnswer(answerIndex) {
        this.userAnswers[this.currentQuestion] = answerIndex;
        this.updateNextButton();
    }

    updateNextButton() {
        const nextBtn = document.getElementById('next-btn');
        if (nextBtn) {
            const hasAnswer = this.userAnswers[this.currentQuestion] !== undefined;
            nextBtn.disabled = !hasAnswer;
        }
    }

    nextQuestion() {
        if (this.currentQuestion < this.questions.length - 1) {
            this.currentQuestion++;
            this.render();
        } else {
            this.finishModule();
        }
    }

    previousQuestion() {
        if (this.currentQuestion > 0) {
            this.currentQuestion--;
            this.render();
        }
    }

    finishModule() {
        this.currentQuestion = this.questions.length; // Show results
        this.render();
    }

    restartModule() {
        this.currentQuestion = 0;
        this.userAnswers = [];
        this.score = 0;
        this.startTime = Date.now();
        this.render();
    }

    showHint() {
        const question = this.questions[this.currentQuestion];
        if (question.hint) {
            this.app.showSuccess(`Hint: ${question.hint}`);
        } else {
            this.app.showSuccess('No hint available for this question');
        }

        // Track hint usage
        if (this.app.analytics) {
            this.app.analytics.trackHintUsed(this.currentModule.id, 'general');
        }
    }

    setupEventListeners() {
        // Add event listeners for drag and drop
        document.querySelectorAll('.drag-item').forEach(item => {
            item.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('text/plain', e.target.dataset.value);
            });
        });

        document.querySelectorAll('.drop-zone').forEach(zone => {
            zone.addEventListener('dragover', (e) => {
                e.preventDefault();
                zone.classList.add('drag-over');
            });

            zone.addEventListener('dragleave', (e) => {
                zone.classList.remove('drag-over');
            });

            zone.addEventListener('drop', (e) => {
                e.preventDefault();
                zone.classList.remove('drag-over');
                const value = e.dataTransfer.getData('text/plain');
                this.selectAnswer(parseInt(value));
            });
        });
    }

    mount(selector) {
        const container = document.querySelector(selector);
        if (container) {
            this.render().then(html => {
                container.innerHTML = html;
                this.setupEventListeners();
            });
        }
    }
}
