// Module Player for Interactive STEM Content
class ModulePlayer {
    constructor() {
        this.currentModule = null;
        this.currentQuestion = 0;
        this.score = 0;
        this.timeSpent = 0;
        this.hintsUsed = 0;
        this.startTime = null;
        this.timer = null;
        this.userAnswers = [];
        this.offlineStorage = null;
        this.gamification = null;
        this.i18n = null;
    }

    setDependencies(offlineStorage, gamification, i18n) {
        this.offlineStorage = offlineStorage;
        this.gamification = gamification;
        this.i18n = i18n;
    }

    async loadModule(module) {
        this.currentModule = module;
        this.currentQuestion = 0;
        this.score = 0;
        this.timeSpent = 0;
        this.hintsUsed = 0;
        this.userAnswers = [];
        this.startTime = Date.now();
        
        // Update UI
        this.updateModuleHeader();
        this.startTimer();
        
        // Load module content
        await this.loadModuleContent();
    }

    updateModuleHeader() {
        if (!this.currentModule) return;
        
        document.getElementById('module-title').textContent = 
            this.i18n.t(this.currentModule.title);
        
        this.updateProgress();
    }

    updateProgress() {
        const totalQuestions = this.currentModule.questions?.length || 10;
        const progressPercent = (this.currentQuestion / totalQuestions) * 100;
        
        document.getElementById('module-progress-text').textContent = 
            `${this.i18n.t('question')} ${this.currentQuestion + 1} ${this.i18n.t('of')} ${totalQuestions}`;
        
        const progressBar = document.getElementById('module-progress-bar');
        if (progressBar) {
            progressBar.style.width = `${progressPercent}%`;
        }
    }

    startTimer() {
        this.startTime = Date.now();
        this.timer = setInterval(() => {
            this.timeSpent = Math.floor((Date.now() - this.startTime) / 1000);
            this.updateTimerDisplay();
        }, 1000);
    }

    stopTimer() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
    }

    updateTimerDisplay() {
        const minutes = Math.floor(this.timeSpent / 60);
        const seconds = this.timeSpent % 60;
        const timeString = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        
        const timeElement = document.getElementById('time-spent');
        if (timeElement) {
            timeElement.textContent = timeString;
        }
    }

    async loadModuleContent() {
        const container = document.getElementById('module-container');
        if (!container) return;
        
        // Load module based on type
        switch (this.currentModule.type || 'quiz') {
            case 'quiz':
                await this.loadQuizContent();
                break;
            case 'simulation':
                await this.loadSimulationContent();
                break;
            case 'puzzle':
                await this.loadPuzzleContent();
                break;
            default:
                await this.loadQuizContent();
        }
    }

    async loadQuizContent() {
        const container = document.getElementById('module-container');
        if (!container) return;
        
        // Generate sample questions if not provided
        const questions = this.currentModule.questions || this.generateSampleQuestions();
        
        if (this.currentQuestion >= questions.length) {
            await this.completeModule();
            return;
        }
        
        const question = questions[this.currentQuestion];
        
        container.innerHTML = `
            <div class="quiz-container">
                <div class="quiz-question">
                    ${this.i18n.t(question.question)}
                </div>
                <div class="quiz-options">
                    ${question.options.map((option, index) => `
                        <div class="quiz-option" data-index="${index}">
                            ${this.i18n.t(option)}
                        </div>
                    `).join('')}
                </div>
                <div id="quiz-feedback" class="quiz-feedback hidden"></div>
            </div>
        `;
        
        // Add event listeners
        this.setupQuizEventListeners();
    }

    generateSampleQuestions() {
        const questionTemplates = {
            math: [
                {
                    question: 'What is 15 + 27?',
                    options: ['40', '42', '32', '52'],
                    correct: 1,
                    explanation: '15 + 27 = 42'
                },
                {
                    question: 'What is 8 × 6?',
                    options: ['46', '48', '54', '42'],
                    correct: 1,
                    explanation: '8 × 6 = 48'
                },
                {
                    question: 'What is 144 ÷ 12?',
                    options: ['10', '11', '12', '13'],
                    correct: 2,
                    explanation: '144 ÷ 12 = 12'
                }
            ],
            science: [
                {
                    question: 'What gas do plants absorb from the atmosphere?',
                    options: ['Oxygen', 'Carbon Dioxide', 'Nitrogen', 'Hydrogen'],
                    correct: 1,
                    explanation: 'Plants absorb carbon dioxide for photosynthesis'
                },
                {
                    question: 'What is the chemical symbol for water?',
                    options: ['H2O', 'CO2', 'NaCl', 'O2'],
                    correct: 0,
                    explanation: 'Water is H2O - two hydrogen atoms and one oxygen atom'
                }
            ]
        };
        
        const subject = this.currentModule.subject || 'math';
        return questionTemplates[subject] || questionTemplates.math;
    }

    setupQuizEventListeners() {
        const options = document.querySelectorAll('.quiz-option');
        const nextBtn = document.getElementById('next-question-btn');
        const hintBtn = document.getElementById('hint-btn');
        
        options.forEach((option, index) => {
            option.addEventListener('click', () => this.selectAnswer(index));
        });
        
        if (nextBtn) {
            nextBtn.addEventListener('click', () => this.nextQuestion());
        }
        
        if (hintBtn) {
            hintBtn.addEventListener('click', () => this.showHint());
        }
    }

    selectAnswer(selectedIndex) {
        const options = document.querySelectorAll('.quiz-option');
        const question = this.currentModule.questions[this.currentQuestion];
        
        // Remove previous selections
        options.forEach(option => {
            option.classList.remove('selected');
        });
        
        // Mark selected option
        options[selectedIndex].classList.add('selected');
        
        // Store answer
        this.userAnswers[this.currentQuestion] = selectedIndex;
        
        // Show feedback
        this.showAnswerFeedback(selectedIndex, question);
    }

    showAnswerFeedback(selectedIndex, question) {
        const options = document.querySelectorAll('.quiz-option');
        const feedback = document.getElementById('quiz-feedback');
        
        // Mark correct/incorrect answers
        options.forEach((option, index) => {
            if (index === question.correct) {
                option.classList.add('correct');
            } else if (index === selectedIndex && index !== question.correct) {
                option.classList.add('incorrect');
            }
        });
        
        // Show feedback message
        const isCorrect = selectedIndex === question.correct;
        feedback.className = `quiz-feedback ${isCorrect ? 'correct' : 'incorrect'}`;
        feedback.textContent = isCorrect ? 
            this.i18n.t('correct') + '! ' + this.i18n.t(question.explanation) :
            this.i18n.t('incorrect') + '. ' + this.i18n.t(question.explanation);
        
        feedback.classList.remove('hidden');
        
        // Update score
        if (isCorrect) {
            this.score += 10;
        }
        
        // Enable next button
        const nextBtn = document.getElementById('next-question-btn');
        if (nextBtn) {
            nextBtn.disabled = false;
            nextBtn.textContent = this.currentQuestion < this.currentModule.questions.length - 1 ? 
                this.i18n.t('next') : this.i18n.t('finish');
        }
    }

    showHint() {
        const question = this.currentModule.questions[this.currentQuestion];
        if (!question.hint) return;
        
        this.hintsUsed++;
        
        // Show hint in feedback area
        const feedback = document.getElementById('quiz-feedback');
        feedback.className = 'quiz-feedback';
        feedback.textContent = this.i18n.t('hint') + ': ' + this.i18n.t(question.hint);
        feedback.classList.remove('hidden');
        
        // Disable hint button
        const hintBtn = document.getElementById('hint-btn');
        if (hintBtn) {
            hintBtn.disabled = true;
            hintBtn.textContent = this.i18n.t('hint') + ' (1)';
        }
    }

    async nextQuestion() {
        this.currentQuestion++;
        
        if (this.currentQuestion >= this.currentModule.questions.length) {
            await this.completeModule();
        } else {
            this.updateProgress();
            await this.loadModuleContent();
        }
    }

    async completeModule() {
        this.stopTimer();
        
        // Calculate final score
        const totalQuestions = this.currentModule.questions.length;
        const percentage = Math.round((this.score / (totalQuestions * 10)) * 100);
        
        // Process completion with gamification
        if (this.gamification && this.offlineStorage) {
            const user = await this.offlineStorage.getUser();
            if (user) {
                const result = await this.gamification.processModuleCompletion(
                    user.id,
                    this.currentModule.id,
                    percentage,
                    this.timeSpent,
                    this.hintsUsed
                );
                
                this.showCompletionScreen(percentage, result);
            }
        } else {
            this.showCompletionScreen(percentage);
        }
    }

    showCompletionScreen(percentage, gamificationResult = null) {
        const container = document.getElementById('module-container');
        if (!container) return;
        
        const isPassed = percentage >= 80;
        const message = isPassed ? this.i18n.t('well_done') : this.i18n.t('keep_trying');
        
        container.innerHTML = `
            <div class="quiz-container">
                <div class="completion-screen">
                    <h2>${this.i18n.t('module_completed')}</h2>
                    <div class="completion-stats">
                        <div class="stat-item">
                            <span class="stat-label">${this.i18n.t('score')}:</span>
                            <span class="stat-value">${percentage}%</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">${this.i18n.t('time_spent')}:</span>
                            <span class="stat-value">${Math.floor(this.timeSpent / 60)}:${(this.timeSpent % 60).toString().padStart(2, '0')}</span>
                        </div>
                        ${gamificationResult ? `
                            <div class="stat-item">
                                <span class="stat-label">${this.i18n.t('points')}:</span>
                                <span class="stat-value">+${gamificationResult.points}</span>
                            </div>
                        ` : ''}
                    </div>
                    <div class="completion-message ${isPassed ? 'success' : 'info'}">
                        ${message}
                    </div>
                    ${gamificationResult && gamificationResult.newAchievements.length > 0 ? `
                        <div class="achievements-unlocked">
                            <h3>${this.i18n.t('achievement_unlocked')}</h3>
                            ${gamificationResult.newAchievements.map(achievement => `
                                <div class="achievement-item">
                                    <span class="achievement-icon">${achievement.icon}</span>
                                    <span class="achievement-name">${this.i18n.t(achievement.name)}</span>
                                </div>
                            `).join('')}
                        </div>
                    ` : ''}
                    <div class="completion-actions">
                        <button id="retry-module" class="btn btn-secondary">${this.i18n.t('try_again')}</button>
                        <button id="back-to-dashboard" class="btn btn-primary">${this.i18n.t('back')} ${this.i18n.t('to')} Dashboard</button>
                    </div>
                </div>
            </div>
        `;
        
        // Add event listeners
        document.getElementById('retry-module').addEventListener('click', () => {
            this.loadModule(this.currentModule);
        });
        
        document.getElementById('back-to-dashboard').addEventListener('click', () => {
            if (window.stemApp) {
                window.stemApp.showUserDashboard();
            }
        });
    }

    async loadSimulationContent() {
        // Placeholder for simulation content
        const container = document.getElementById('module-container');
        container.innerHTML = `
            <div class="simulation-container">
                <h3>Simulation: ${this.i18n.t(this.currentModule.title)}</h3>
                <p>Interactive simulation content would go here.</p>
                <div class="simulation-controls">
                    <button id="start-simulation" class="btn btn-primary">Start Simulation</button>
                </div>
            </div>
        `;
    }

    async loadPuzzleContent() {
        // Placeholder for puzzle content
        const container = document.getElementById('module-container');
        container.innerHTML = `
            <div class="puzzle-container">
                <h3>Puzzle: ${this.i18n.t(this.currentModule.title)}</h3>
                <p>Interactive puzzle content would go here.</p>
                <div class="puzzle-area">
                    <div class="puzzle-piece" draggable="true">Piece 1</div>
                    <div class="puzzle-piece" draggable="true">Piece 2</div>
                    <div class="puzzle-piece" draggable="true">Piece 3</div>
                </div>
            </div>
        `;
    }
}

// Initialize module player when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.modulePlayer = new ModulePlayer();
});