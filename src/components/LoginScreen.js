export class LoginScreen {
    constructor(app) {
        this.app = app;
    }

    render() {
        return `
            <div class="login-container">
                <div class="login-card">
                    <div class="login-header">
                        <h2>Welcome to LearnSTEM</h2>
                        <p>Gamified learning for rural schools</p>
                    </div>
                    
                    <form class="login-form" id="login-form">
                        <div class="form-group">
                            <label for="username" class="form-label">Username</label>
                            <input 
                                type="text" 
                                id="username" 
                                name="username" 
                                class="form-input" 
                                placeholder="Enter your username"
                                required
                                autocomplete="username"
                            >
                        </div>
                        
                        <div class="form-group">
                            <label for="password" class="form-label">Password</label>
                            <input 
                                type="password" 
                                id="password" 
                                name="password" 
                                class="form-input" 
                                placeholder="Enter your password"
                                required
                                autocomplete="current-password"
                            >
                        </div>
                        
                        <button type="submit" class="btn btn-primary btn-lg" id="login-btn">
                            <span class="btn-text">Sign In</span>
                            <span class="btn-loading" style="display: none;">
                                <div class="loading"></div>
                                Signing in...
                            </span>
                        </button>
                    </form>
                    
                    <div class="login-footer">
                        <p class="demo-credentials">
                            <strong>Demo Credentials:</strong><br>
                            Students: student1/password, student2/password<br>
                            Teacher: teacher1/password<br>
                            Admin: admin/admin
                        </p>
                    </div>
                </div>
                
                <div class="features-preview">
                    <h3>What you'll find here:</h3>
                    <div class="features-grid">
                        <div class="feature-item">
                            <div class="feature-icon">🎮</div>
                            <h4>Gamified Learning</h4>
                            <p>Interactive games and challenges make learning fun</p>
                        </div>
                        <div class="feature-item">
                            <div class="feature-icon">📱</div>
                            <h4>Works Offline</h4>
                            <p>Learn anywhere, even without internet connection</p>
                        </div>
                        <div class="feature-item">
                            <div class="feature-icon">📊</div>
                            <h4>Progress Tracking</h4>
                            <p>See your learning progress and achievements</p>
                        </div>
                        <div class="feature-item">
                            <div class="feature-icon">🌍</div>
                            <h4>Multilingual</h4>
                            <p>Available in multiple languages for local communities</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    setupEventListeners() {
        const form = document.getElementById('login-form');
        const loginBtn = document.getElementById('login-btn');
        const btnText = loginBtn.querySelector('.btn-text');
        const btnLoading = loginBtn.querySelector('.btn-loading');

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = new FormData(form);
            const credentials = {
                username: formData.get('username'),
                password: formData.get('password')
            };

            // Show loading state
            btnText.style.display = 'none';
            btnLoading.style.display = 'flex';
            loginBtn.disabled = true;

            try {
                const success = await this.app.login(credentials);
                
                if (!success) {
                    // Reset button state
                    btnText.style.display = 'flex';
                    btnLoading.style.display = 'none';
                    loginBtn.disabled = false;
                }
            } catch (error) {
                console.error('Login error:', error);
                // Reset button state
                btnText.style.display = 'flex';
                btnLoading.style.display = 'none';
                loginBtn.disabled = false;
            }
        });

        // Handle Enter key in password field
        document.getElementById('password').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                form.dispatchEvent(new Event('submit'));
            }
        });
    }

    mount(selector) {
        const container = document.querySelector(selector);
        if (container) {
            container.innerHTML = this.render();
            this.setupEventListeners();
        }
    }
}
