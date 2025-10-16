export class Localization {
    constructor() {
        this.currentLanguage = 'en';
        this.translations = {};
        this.supportedLanguages = ['en', 'es', 'fr', 'hi', 'sw']; // English, Spanish, French, Hindi, Swahili
        this.fallbackLanguage = 'en';
    }

    async init() {
        try {
            // Load saved language preference
            this.currentLanguage = localStorage.getItem('preferred_language') || this.detectLanguage();
            
            // Load translations for current language
            await this.loadTranslations(this.currentLanguage);
            
            console.log('Localization initialized with language:', this.currentLanguage);
        } catch (error) {
            console.error('Failed to initialize Localization:', error);
            // Fallback to English
            this.currentLanguage = 'en';
            await this.loadTranslations('en');
        }
    }

    detectLanguage() {
        // Try to detect language from browser
        const browserLang = navigator.language || navigator.userLanguage;
        const langCode = browserLang.split('-')[0];
        
        if (this.supportedLanguages.includes(langCode)) {
            return langCode;
        }
        
        return this.fallbackLanguage;
    }

    async loadTranslations(language) {
        try {
            // In a real app, this would load from a server or bundled files
            this.translations[language] = await this.getTranslationsForLanguage(language);
            console.log(`Translations loaded for language: ${language}`);
        } catch (error) {
            console.error(`Failed to load translations for ${language}:`, error);
            // Fallback to English if available
            if (language !== this.fallbackLanguage) {
                await this.loadTranslations(this.fallbackLanguage);
            }
        }
    }

    async getTranslationsForLanguage(language) {
        // Mock translations - in a real app, these would be loaded from files or API
        const translations = {
            en: {
                // Common
                'app.title': 'LearnSTEM',
                'app.subtitle': 'Gamified Learning Platform',
                'common.loading': 'Loading...',
                'common.error': 'Error',
                'common.success': 'Success',
                'common.cancel': 'Cancel',
                'common.save': 'Save',
                'common.delete': 'Delete',
                'common.edit': 'Edit',
                'common.back': 'Back',
                'common.next': 'Next',
                'common.previous': 'Previous',
                'common.finish': 'Finish',
                'common.retry': 'Try Again',
                
                // Navigation
                'nav.dashboard': 'Dashboard',
                'nav.modules': 'Modules',
                'nav.progress': 'Progress',
                'nav.settings': 'Settings',
                'nav.logout': 'Logout',
                
                // Login
                'login.title': 'Welcome to LearnSTEM',
                'login.subtitle': 'Gamified learning for rural schools',
                'login.username': 'Username',
                'login.password': 'Password',
                'login.signin': 'Sign In',
                'login.demo_credentials': 'Demo Credentials',
                
                // Student Dashboard
                'student.welcome': 'Welcome back, {name}!',
                'student.progress': 'Your Progress',
                'student.modules': 'Available Modules',
                'student.achievements': 'Achievements',
                'student.points': 'Points',
                'student.level': 'Level',
                'student.streak': 'Day Streak',
                
                // Teacher Dashboard
                'teacher.welcome': 'Welcome, {name}!',
                'teacher.students': 'Students',
                'teacher.class_progress': 'Class Progress',
                'teacher.analytics': 'Analytics',
                'teacher.reports': 'Reports',
                'teacher.assignments': 'Assignments',
                
                // Modules
                'module.start': 'Start Module',
                'module.continue': 'Continue',
                'module.completed': 'Completed',
                'module.score': 'Score',
                'module.time_spent': 'Time Spent',
                'module.difficulty': 'Difficulty',
                'module.subject': 'Subject',
                'module.grade': 'Grade',
                
                // Gamification
                'game.points': 'Points',
                'game.badges': 'Badges',
                'game.leaderboard': 'Leaderboard',
                'game.achievement_unlocked': 'Achievement Unlocked!',
                'game.level_up': 'Level Up!',
                'game.streak': 'Day Streak',
                'game.hint': 'Hint',
                'game.hint_used': 'Hint Used',
                
                // Offline
                'offline.working_offline': 'Working offline - changes will sync when connected',
                'offline.sync_pending': 'Sync pending',
                'offline.sync_complete': 'Sync complete',
                
                // Errors
                'error.login_failed': 'Login failed. Please check your credentials.',
                'error.module_load_failed': 'Failed to load module. Please try again.',
                'error.network_error': 'Network error. Please check your connection.',
                'error.offline_error': 'This feature requires an internet connection.',
                
                // Subjects
                'subject.math': 'Mathematics',
                'subject.science': 'Science',
                'subject.physics': 'Physics',
                'subject.chemistry': 'Chemistry',
                'subject.biology': 'Biology',
                'subject.earth_science': 'Earth Science',
                
                // Grades
                'grade.6': 'Grade 6',
                'grade.7': 'Grade 7',
                'grade.8': 'Grade 8',
                'grade.9': 'Grade 9',
                'grade.10': 'Grade 10',
                'grade.11': 'Grade 11',
                'grade.12': 'Grade 12'
            },
            
            es: {
                // Common
                'app.title': 'LearnSTEM',
                'app.subtitle': 'Plataforma de Aprendizaje Gamificado',
                'common.loading': 'Cargando...',
                'common.error': 'Error',
                'common.success': 'Éxito',
                'common.cancel': 'Cancelar',
                'common.save': 'Guardar',
                'common.delete': 'Eliminar',
                'common.edit': 'Editar',
                'common.back': 'Atrás',
                'common.next': 'Siguiente',
                'common.previous': 'Anterior',
                'common.finish': 'Terminar',
                'common.retry': 'Intentar de Nuevo',
                
                // Navigation
                'nav.dashboard': 'Panel',
                'nav.modules': 'Módulos',
                'nav.progress': 'Progreso',
                'nav.settings': 'Configuración',
                'nav.logout': 'Cerrar Sesión',
                
                // Login
                'login.title': 'Bienvenido a LearnSTEM',
                'login.subtitle': 'Aprendizaje gamificado para escuelas rurales',
                'login.username': 'Usuario',
                'login.password': 'Contraseña',
                'login.signin': 'Iniciar Sesión',
                'login.demo_credentials': 'Credenciales de Demostración',
                
                // Student Dashboard
                'student.welcome': '¡Bienvenido de nuevo, {name}!',
                'student.progress': 'Tu Progreso',
                'student.modules': 'Módulos Disponibles',
                'student.achievements': 'Logros',
                'student.points': 'Puntos',
                'student.level': 'Nivel',
                'student.streak': 'Racha de Días',
                
                // Teacher Dashboard
                'teacher.welcome': 'Bienvenido, {name}!',
                'teacher.students': 'Estudiantes',
                'teacher.class_progress': 'Progreso de la Clase',
                'teacher.analytics': 'Analíticas',
                'teacher.reports': 'Reportes',
                'teacher.assignments': 'Asignaciones',
                
                // Modules
                'module.start': 'Iniciar Módulo',
                'module.continue': 'Continuar',
                'module.completed': 'Completado',
                'module.score': 'Puntuación',
                'module.time_spent': 'Tiempo Invertido',
                'module.difficulty': 'Dificultad',
                'module.subject': 'Materia',
                'module.grade': 'Grado',
                
                // Gamification
                'game.points': 'Puntos',
                'game.badges': 'Insignias',
                'game.leaderboard': 'Tabla de Posiciones',
                'game.achievement_unlocked': '¡Logro Desbloqueado!',
                'game.level_up': '¡Subir de Nivel!',
                'game.streak': 'Racha de Días',
                'game.hint': 'Pista',
                'game.hint_used': 'Pista Usada',
                
                // Offline
                'offline.working_offline': 'Trabajando sin conexión - los cambios se sincronizarán cuando se conecte',
                'offline.sync_pending': 'Sincronización pendiente',
                'offline.sync_complete': 'Sincronización completa',
                
                // Errors
                'error.login_failed': 'Error de inicio de sesión. Verifique sus credenciales.',
                'error.module_load_failed': 'Error al cargar el módulo. Intente de nuevo.',
                'error.network_error': 'Error de red. Verifique su conexión.',
                'error.offline_error': 'Esta función requiere conexión a internet.',
                
                // Subjects
                'subject.math': 'Matemáticas',
                'subject.science': 'Ciencias',
                'subject.physics': 'Física',
                'subject.chemistry': 'Química',
                'subject.biology': 'Biología',
                'subject.earth_science': 'Ciencias de la Tierra',
                
                // Grades
                'grade.6': 'Grado 6',
                'grade.7': 'Grado 7',
                'grade.8': 'Grado 8',
                'grade.9': 'Grado 9',
                'grade.10': 'Grado 10',
                'grade.11': 'Grado 11',
                'grade.12': 'Grado 12'
            },
            
            fr: {
                // Common
                'app.title': 'LearnSTEM',
                'app.subtitle': 'Plateforme d\'Apprentissage Gamifiée',
                'common.loading': 'Chargement...',
                'common.error': 'Erreur',
                'common.success': 'Succès',
                'common.cancel': 'Annuler',
                'common.save': 'Sauvegarder',
                'common.delete': 'Supprimer',
                'common.edit': 'Modifier',
                'common.back': 'Retour',
                'common.next': 'Suivant',
                'common.previous': 'Précédent',
                'common.finish': 'Terminer',
                'common.retry': 'Réessayer',
                
                // Navigation
                'nav.dashboard': 'Tableau de Bord',
                'nav.modules': 'Modules',
                'nav.progress': 'Progrès',
                'nav.settings': 'Paramètres',
                'nav.logout': 'Déconnexion',
                
                // Login
                'login.title': 'Bienvenue sur LearnSTEM',
                'login.subtitle': 'Apprentissage gamifié pour les écoles rurales',
                'login.username': 'Nom d\'utilisateur',
                'login.password': 'Mot de passe',
                'login.signin': 'Se Connecter',
                'login.demo_credentials': 'Identifiants de Démonstration',
                
                // Student Dashboard
                'student.welcome': 'Bon retour, {name}!',
                'student.progress': 'Votre Progrès',
                'student.modules': 'Modules Disponibles',
                'student.achievements': 'Réalisations',
                'student.points': 'Points',
                'student.level': 'Niveau',
                'student.streak': 'Série de Jours',
                
                // Teacher Dashboard
                'teacher.welcome': 'Bienvenue, {name}!',
                'teacher.students': 'Étudiants',
                'teacher.class_progress': 'Progrès de la Classe',
                'teacher.analytics': 'Analytiques',
                'teacher.reports': 'Rapports',
                'teacher.assignments': 'Devoirs',
                
                // Modules
                'module.start': 'Commencer le Module',
                'module.continue': 'Continuer',
                'module.completed': 'Terminé',
                'module.score': 'Score',
                'module.time_spent': 'Temps Passé',
                'module.difficulty': 'Difficulté',
                'module.subject': 'Matière',
                'module.grade': 'Niveau',
                
                // Gamification
                'game.points': 'Points',
                'game.badges': 'Badges',
                'game.leaderboard': 'Classement',
                'game.achievement_unlocked': 'Réalisation Débloquée!',
                'game.level_up': 'Niveau Supérieur!',
                'game.streak': 'Série de Jours',
                'game.hint': 'Indice',
                'game.hint_used': 'Indice Utilisé',
                
                // Offline
                'offline.working_offline': 'Hors ligne - les modifications seront synchronisées lors de la connexion',
                'offline.sync_pending': 'Synchronisation en attente',
                'offline.sync_complete': 'Synchronisation terminée',
                
                // Errors
                'error.login_failed': 'Échec de la connexion. Vérifiez vos identifiants.',
                'error.module_load_failed': 'Échec du chargement du module. Réessayez.',
                'error.network_error': 'Erreur réseau. Vérifiez votre connexion.',
                'error.offline_error': 'Cette fonctionnalité nécessite une connexion internet.',
                
                // Subjects
                'subject.math': 'Mathématiques',
                'subject.science': 'Sciences',
                'subject.physics': 'Physique',
                'subject.chemistry': 'Chimie',
                'subject.biology': 'Biologie',
                'subject.earth_science': 'Sciences de la Terre',
                
                // Grades
                'grade.6': 'Niveau 6',
                'grade.7': 'Niveau 7',
                'grade.8': 'Niveau 8',
                'grade.9': 'Niveau 9',
                'grade.10': 'Niveau 10',
                'grade.11': 'Niveau 11',
                'grade.12': 'Niveau 12'
            }
        };

        return translations[language] || translations[this.fallbackLanguage];
    }

    t(key, params = {}) {
        const translation = this.translations[this.currentLanguage]?.[key] || 
                          this.translations[this.fallbackLanguage]?.[key] || 
                          key;

        // Replace parameters in translation
        return translation.replace(/\{(\w+)\}/g, (match, param) => {
            return params[param] || match;
        });
    }

    setLanguage(language) {
        if (this.supportedLanguages.includes(language)) {
            this.currentLanguage = language;
            localStorage.setItem('preferred_language', language);
            this.loadTranslations(language);
            console.log('Language changed to:', language);
        } else {
            console.warn(`Language ${language} is not supported`);
        }
    }

    getCurrentLanguage() {
        return this.currentLanguage;
    }

    getSupportedLanguages() {
        return this.supportedLanguages;
    }

    getLanguageName(code) {
        const names = {
            'en': 'English',
            'es': 'Español',
            'fr': 'Français',
            'hi': 'हिन्दी',
            'sw': 'Kiswahili'
        };
        return names[code] || code;
    }

    isRTL(language = this.currentLanguage) {
        const rtlLanguages = ['ar', 'he', 'fa', 'ur'];
        return rtlLanguages.includes(language);
    }

    formatNumber(number, language = this.currentLanguage) {
        try {
            return new Intl.NumberFormat(language).format(number);
        } catch (error) {
            return number.toString();
        }
    }

    formatDate(date, language = this.currentLanguage) {
        try {
            return new Intl.DateTimeFormat(language).format(date);
        } catch (error) {
            return date.toLocaleDateString();
        }
    }

    formatTime(date, language = this.currentLanguage) {
        try {
            return new Intl.DateTimeFormat(language, {
                hour: '2-digit',
                minute: '2-digit'
            }).format(date);
        } catch (error) {
            return date.toLocaleTimeString();
        }
    }
}
