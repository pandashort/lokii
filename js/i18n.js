// Internationalization (i18n) System
class I18nSystem {
    constructor() {
        this.currentLanguage = 'en';
        this.translations = {};
        this.fallbackLanguage = 'en';
    }

    async init(language = 'en') {
        this.currentLanguage = language;
        await this.loadTranslations(language);
    }

    async loadTranslations(language) {
        try {
            // Try to load from server first
            if (navigator.onLine) {
                const response = await fetch(`/api/translations/${language}`);
                if (response.ok) {
                    this.translations[language] = await response.json();
                    return;
                }
            }
        } catch (error) {
            console.log('Failed to load translations from server, using offline fallback');
        }

        // Fallback to embedded translations
        this.translations[language] = this.getEmbeddedTranslations(language);
    }

    getEmbeddedTranslations(language) {
        const translations = {
            en: {
                // Navigation
                'welcome': 'Welcome',
                'login': 'Login',
                'logout': 'Logout',
                'back': 'Back',
                'next': 'Next',
                'previous': 'Previous',
                'submit': 'Submit',
                'cancel': 'Cancel',
                'save': 'Save',
                'delete': 'Delete',
                'edit': 'Edit',
                'close': 'Close',
                
                // User roles
                'student': 'Student',
                'teacher': 'Teacher',
                'admin': 'Admin',
                
                // Common UI
                'loading': 'Loading...',
                'error': 'Error',
                'success': 'Success',
                'warning': 'Warning',
                'info': 'Information',
                'yes': 'Yes',
                'no': 'No',
                'ok': 'OK',
                
                // Authentication
                'username': 'Username',
                'password': 'Password',
                'language': 'Language',
                'select_role': 'Select role',
                'invalid_credentials': 'Invalid credentials. Please try again.',
                'login_failed': 'Login failed. Please check your connection and try again.',
                
                // Student Dashboard
                'your_progress': 'Your Progress',
                'available_modules': 'Available Modules',
                'recent_achievements': 'Recent Achievements',
                'points': 'Points',
                'level': 'Level',
                'modules_completed': 'modules completed',
                
                // Teacher Dashboard
                'teacher_dashboard': 'Teacher Dashboard',
                'overview': 'Overview',
                'students': 'Students',
                'analytics': 'Analytics',
                'assignments': 'Assignments',
                'class_performance': 'Class Performance',
                'active_students': 'Active Students',
                'student_name': 'Student Name',
                'progress': 'Progress',
                'last_active': 'Last Active',
                'create_assignment': 'Create Assignment',
                'assignment_title': 'Assignment Title',
                'select_modules': 'Select Modules',
                'due_date': 'Due Date',
                
                // Module content
                'question': 'Question',
                'of': 'of',
                'hint': 'Hint',
                'time_spent': 'Time Spent',
                'score': 'Score',
                'correct': 'Correct!',
                'incorrect': 'Incorrect',
                'try_again': 'Try Again',
                'well_done': 'Well Done!',
                'excellent': 'Excellent!',
                'good_job': 'Good Job!',
                'keep_trying': 'Keep Trying!',
                
                // Subjects
                'mathematics': 'Mathematics',
                'science': 'Science',
                'math': 'Math',
                
                // Difficulty levels
                'easy': 'Easy',
                'medium': 'Medium',
                'hard': 'Hard',
                
                // Module titles and descriptions
                'basic_algebra': 'Basic Algebra',
                'basic_algebra_desc': 'Learn the fundamentals of algebraic expressions and equations',
                'fractions': 'Working with Fractions',
                'fractions_desc': 'Master addition, subtraction, multiplication, and division of fractions',
                'photosynthesis': 'Photosynthesis Process',
                'photosynthesis_desc': 'Understand how plants convert sunlight into energy',
                'solar_system': 'Our Solar System',
                'solar_system_desc': 'Explore the planets, moons, and other celestial bodies',
                
                // Achievements
                'first_steps': 'First Steps',
                'first_steps_desc': 'Complete your first module',
                'math_master': 'Math Master',
                'math_master_desc': 'Complete 5 mathematics modules',
                'science_explorer': 'Science Explorer',
                'science_explorer_desc': 'Complete 5 science modules',
                'perfect_score': 'Perfect Score',
                'perfect_score_desc': 'Get a perfect score on 3 modules',
                'streak_master': 'Streak Master',
                'streak_master_desc': 'Study for 7 consecutive days',
                'speed_demon': 'Speed Demon',
                'speed_demon_desc': 'Complete 5 modules in half the expected time',
                'persistent_learner': 'Persistent Learner',
                'persistent_learner_desc': 'Complete 20 modules total',
                'helpful_student': 'Independent Learner',
                'helpful_student_desc': 'Complete modules without using hints',
                
                // Level titles
                'novice': 'Novice',
                'apprentice': 'Apprentice',
                'practitioner': 'Practitioner',
                'expert': 'Expert',
                'master': 'Master',
                'grandmaster': 'Grandmaster',
                
                // Connection status
                'online': 'Online',
                'offline': 'Offline',
                'connecting': 'Connecting...',
                
                // Time units
                'minute': 'minute',
                'minutes': 'minutes',
                'hour': 'hour',
                'hours': 'hours',
                'day': 'day',
                'days': 'days',
                'week': 'week',
                'weeks': 'weeks',
                
                // Feedback messages
                'module_completed': 'Module Completed!',
                'achievement_unlocked': 'Achievement Unlocked!',
                'level_up': 'Level Up!',
                'new_high_score': 'New High Score!',
                'streak_broken': 'Streak Broken',
                'streak_continued': 'Streak Continued!',
                
                // Error messages
                'network_error': 'Network error. Please check your connection.',
                'module_load_error': 'Failed to load module. Please try again.',
                'save_error': 'Failed to save progress. Please try again.',
                'sync_error': 'Failed to sync data. Will retry when online.',
                
                // Accessibility
                'skip_to_content': 'Skip to main content',
                'close_menu': 'Close menu',
                'open_menu': 'Open menu',
                'increase_text_size': 'Increase text size',
                'decrease_text_size': 'Decrease text size',
                'high_contrast_mode': 'High contrast mode',
                'screen_reader_mode': 'Screen reader mode'
            },
            
            es: {
                // Navigation
                'welcome': 'Bienvenido',
                'login': 'Iniciar Sesión',
                'logout': 'Cerrar Sesión',
                'back': 'Atrás',
                'next': 'Siguiente',
                'previous': 'Anterior',
                'submit': 'Enviar',
                'cancel': 'Cancelar',
                'save': 'Guardar',
                'delete': 'Eliminar',
                'edit': 'Editar',
                'close': 'Cerrar',
                
                // User roles
                'student': 'Estudiante',
                'teacher': 'Maestro',
                'admin': 'Administrador',
                
                // Common UI
                'loading': 'Cargando...',
                'error': 'Error',
                'success': 'Éxito',
                'warning': 'Advertencia',
                'info': 'Información',
                'yes': 'Sí',
                'no': 'No',
                'ok': 'OK',
                
                // Authentication
                'username': 'Nombre de usuario',
                'password': 'Contraseña',
                'language': 'Idioma',
                'select_role': 'Seleccionar rol',
                'invalid_credentials': 'Credenciales inválidas. Inténtalo de nuevo.',
                'login_failed': 'Error al iniciar sesión. Verifica tu conexión e inténtalo de nuevo.',
                
                // Student Dashboard
                'your_progress': 'Tu Progreso',
                'available_modules': 'Módulos Disponibles',
                'recent_achievements': 'Logros Recientes',
                'points': 'Puntos',
                'level': 'Nivel',
                'modules_completed': 'módulos completados',
                
                // Teacher Dashboard
                'teacher_dashboard': 'Panel del Maestro',
                'overview': 'Resumen',
                'students': 'Estudiantes',
                'analytics': 'Análisis',
                'assignments': 'Tareas',
                'class_performance': 'Rendimiento de la Clase',
                'active_students': 'Estudiantes Activos',
                'student_name': 'Nombre del Estudiante',
                'progress': 'Progreso',
                'last_active': 'Última Actividad',
                'create_assignment': 'Crear Tarea',
                'assignment_title': 'Título de la Tarea',
                'select_modules': 'Seleccionar Módulos',
                'due_date': 'Fecha de Vencimiento',
                
                // Module content
                'question': 'Pregunta',
                'of': 'de',
                'hint': 'Pista',
                'time_spent': 'Tiempo Transcurrido',
                'score': 'Puntuación',
                'correct': '¡Correcto!',
                'incorrect': 'Incorrecto',
                'try_again': 'Inténtalo de Nuevo',
                'well_done': '¡Bien Hecho!',
                'excellent': '¡Excelente!',
                'good_job': '¡Buen Trabajo!',
                'keep_trying': '¡Sigue Intentando!',
                
                // Subjects
                'mathematics': 'Matemáticas',
                'science': 'Ciencias',
                'math': 'Matemáticas',
                
                // Difficulty levels
                'easy': 'Fácil',
                'medium': 'Medio',
                'hard': 'Difícil',
                
                // Module titles and descriptions
                'basic_algebra': 'Álgebra Básica',
                'basic_algebra_desc': 'Aprende los fundamentos de las expresiones y ecuaciones algebraicas',
                'fractions': 'Trabajando con Fracciones',
                'fractions_desc': 'Domina la suma, resta, multiplicación y división de fracciones',
                'photosynthesis': 'Proceso de Fotosíntesis',
                'photosynthesis_desc': 'Entiende cómo las plantas convierten la luz solar en energía',
                'solar_system': 'Nuestro Sistema Solar',
                'solar_system_desc': 'Explora los planetas, lunas y otros cuerpos celestes',
                
                // Achievements
                'first_steps': 'Primeros Pasos',
                'first_steps_desc': 'Completa tu primer módulo',
                'math_master': 'Maestro de Matemáticas',
                'math_master_desc': 'Completa 5 módulos de matemáticas',
                'science_explorer': 'Explorador de Ciencias',
                'science_explorer_desc': 'Completa 5 módulos de ciencias',
                'perfect_score': 'Puntuación Perfecta',
                'perfect_score_desc': 'Obtén una puntuación perfecta en 3 módulos',
                'streak_master': 'Maestro de Racha',
                'streak_master_desc': 'Estudia por 7 días consecutivos',
                'speed_demon': 'Demonio de Velocidad',
                'speed_demon_desc': 'Completa 5 módulos en la mitad del tiempo esperado',
                'persistent_learner': 'Estudiante Persistente',
                'persistent_learner_desc': 'Completa 20 módulos en total',
                'helpful_student': 'Estudiante Independiente',
                'helpful_student_desc': 'Completa módulos sin usar pistas',
                
                // Level titles
                'novice': 'Novato',
                'apprentice': 'Aprendiz',
                'practitioner': 'Practicante',
                'expert': 'Experto',
                'master': 'Maestro',
                'grandmaster': 'Gran Maestro',
                
                // Connection status
                'online': 'En Línea',
                'offline': 'Sin Conexión',
                'connecting': 'Conectando...',
                
                // Time units
                'minute': 'minuto',
                'minutes': 'minutos',
                'hour': 'hora',
                'hours': 'horas',
                'day': 'día',
                'days': 'días',
                'week': 'semana',
                'weeks': 'semanas',
                
                // Feedback messages
                'module_completed': '¡Módulo Completado!',
                'achievement_unlocked': '¡Logro Desbloqueado!',
                'level_up': '¡Subida de Nivel!',
                'new_high_score': '¡Nuevo Récord!',
                'streak_broken': 'Racha Rota',
                'streak_continued': '¡Racha Continuada!',
                
                // Error messages
                'network_error': 'Error de red. Verifica tu conexión.',
                'module_load_error': 'Error al cargar módulo. Inténtalo de nuevo.',
                'save_error': 'Error al guardar progreso. Inténtalo de nuevo.',
                'sync_error': 'Error al sincronizar datos. Se reintentará cuando esté en línea.',
                
                // Accessibility
                'skip_to_content': 'Saltar al contenido principal',
                'close_menu': 'Cerrar menú',
                'open_menu': 'Abrir menú',
                'increase_text_size': 'Aumentar tamaño de texto',
                'decrease_text_size': 'Disminuir tamaño de texto',
                'high_contrast_mode': 'Modo de alto contraste',
                'screen_reader_mode': 'Modo lector de pantalla'
            },
            
            fr: {
                // Navigation
                'welcome': 'Bienvenue',
                'login': 'Connexion',
                'logout': 'Déconnexion',
                'back': 'Retour',
                'next': 'Suivant',
                'previous': 'Précédent',
                'submit': 'Soumettre',
                'cancel': 'Annuler',
                'save': 'Sauvegarder',
                'delete': 'Supprimer',
                'edit': 'Modifier',
                'close': 'Fermer',
                
                // User roles
                'student': 'Étudiant',
                'teacher': 'Enseignant',
                'admin': 'Administrateur',
                
                // Common UI
                'loading': 'Chargement...',
                'error': 'Erreur',
                'success': 'Succès',
                'warning': 'Avertissement',
                'info': 'Information',
                'yes': 'Oui',
                'no': 'Non',
                'ok': 'OK',
                
                // Authentication
                'username': 'Nom d\'utilisateur',
                'password': 'Mot de passe',
                'language': 'Langue',
                'select_role': 'Sélectionner un rôle',
                'invalid_credentials': 'Identifiants invalides. Veuillez réessayer.',
                'login_failed': 'Échec de la connexion. Vérifiez votre connexion et réessayez.',
                
                // Student Dashboard
                'your_progress': 'Votre Progrès',
                'available_modules': 'Modules Disponibles',
                'recent_achievements': 'Réalisations Récentes',
                'points': 'Points',
                'level': 'Niveau',
                'modules_completed': 'modules terminés',
                
                // Teacher Dashboard
                'teacher_dashboard': 'Tableau de Bord Enseignant',
                'overview': 'Aperçu',
                'students': 'Étudiants',
                'analytics': 'Analyses',
                'assignments': 'Devoirs',
                'class_performance': 'Performance de la Classe',
                'active_students': 'Étudiants Actifs',
                'student_name': 'Nom de l\'Étudiant',
                'progress': 'Progrès',
                'last_active': 'Dernière Activité',
                'create_assignment': 'Créer un Devoir',
                'assignment_title': 'Titre du Devoir',
                'select_modules': 'Sélectionner les Modules',
                'due_date': 'Date d\'Échéance',
                
                // Module content
                'question': 'Question',
                'of': 'de',
                'hint': 'Indice',
                'time_spent': 'Temps Écoulé',
                'score': 'Score',
                'correct': 'Correct !',
                'incorrect': 'Incorrect',
                'try_again': 'Réessayer',
                'well_done': 'Bien Joué !',
                'excellent': 'Excellent !',
                'good_job': 'Bon Travail !',
                'keep_trying': 'Continuez d\'Essayer !',
                
                // Subjects
                'mathematics': 'Mathématiques',
                'science': 'Sciences',
                'math': 'Maths',
                
                // Difficulty levels
                'easy': 'Facile',
                'medium': 'Moyen',
                'hard': 'Difficile',
                
                // Module titles and descriptions
                'basic_algebra': 'Algèbre de Base',
                'basic_algebra_desc': 'Apprenez les fondamentaux des expressions et équations algébriques',
                'fractions': 'Travailler avec les Fractions',
                'fractions_desc': 'Maîtrisez l\'addition, la soustraction, la multiplication et la division des fractions',
                'photosynthesis': 'Processus de Photosynthèse',
                'photosynthesis_desc': 'Comprenez comment les plantes convertissent la lumière du soleil en énergie',
                'solar_system': 'Notre Système Solaire',
                'solar_system_desc': 'Explorez les planètes, lunes et autres corps célestes',
                
                // Achievements
                'first_steps': 'Premiers Pas',
                'first_steps_desc': 'Terminez votre premier module',
                'math_master': 'Maître des Maths',
                'math_master_desc': 'Terminez 5 modules de mathématiques',
                'science_explorer': 'Explorateur des Sciences',
                'science_explorer_desc': 'Terminez 5 modules de sciences',
                'perfect_score': 'Score Parfait',
                'perfect_score_desc': 'Obtenez un score parfait sur 3 modules',
                'streak_master': 'Maître de Série',
                'streak_master_desc': 'Étudiez pendant 7 jours consécutifs',
                'speed_demon': 'Démon de Vitesse',
                'speed_demon_desc': 'Terminez 5 modules en la moitié du temps attendu',
                'persistent_learner': 'Apprenant Persistant',
                'persistent_learner_desc': 'Terminez 20 modules au total',
                'helpful_student': 'Étudiant Indépendant',
                'helpful_student_desc': 'Terminez des modules sans utiliser d\'indices',
                
                // Level titles
                'novice': 'Novice',
                'apprentice': 'Apprenti',
                'practitioner': 'Pratiquant',
                'expert': 'Expert',
                'master': 'Maître',
                'grandmaster': 'Grand Maître',
                
                // Connection status
                'online': 'En Ligne',
                'offline': 'Hors Ligne',
                'connecting': 'Connexion...',
                
                // Time units
                'minute': 'minute',
                'minutes': 'minutes',
                'hour': 'heure',
                'hours': 'heures',
                'day': 'jour',
                'days': 'jours',
                'week': 'semaine',
                'weeks': 'semaines',
                
                // Feedback messages
                'module_completed': 'Module Terminé !',
                'achievement_unlocked': 'Réalisation Débloquée !',
                'level_up': 'Niveau Supérieur !',
                'new_high_score': 'Nouveau Record !',
                'streak_broken': 'Série Rompue',
                'streak_continued': 'Série Continuée !',
                
                // Error messages
                'network_error': 'Erreur réseau. Vérifiez votre connexion.',
                'module_load_error': 'Échec du chargement du module. Réessayez.',
                'save_error': 'Échec de la sauvegarde. Réessayez.',
                'sync_error': 'Échec de la synchronisation. Réessaiera quand en ligne.',
                
                // Accessibility
                'skip_to_content': 'Aller au contenu principal',
                'close_menu': 'Fermer le menu',
                'open_menu': 'Ouvrir le menu',
                'increase_text_size': 'Augmenter la taille du texte',
                'decrease_text_size': 'Diminuer la taille du texte',
                'high_contrast_mode': 'Mode contraste élevé',
                'screen_reader_mode': 'Mode lecteur d\'écran'
            },
            
            hi: {
                // Navigation
                'welcome': 'स्वागत है',
                'login': 'लॉगिन',
                'logout': 'लॉगआउट',
                'back': 'वापस',
                'next': 'अगला',
                'previous': 'पिछला',
                'submit': 'जमा करें',
                'cancel': 'रद्द करें',
                'save': 'सहेजें',
                'delete': 'हटाएं',
                'edit': 'संपादित करें',
                'close': 'बंद करें',
                
                // User roles
                'student': 'छात्र',
                'teacher': 'शिक्षक',
                'admin': 'प्रशासक',
                
                // Common UI
                'loading': 'लोड हो रहा है...',
                'error': 'त्रुटि',
                'success': 'सफलता',
                'warning': 'चेतावनी',
                'info': 'जानकारी',
                'yes': 'हाँ',
                'no': 'नहीं',
                'ok': 'ठीक है',
                
                // Authentication
                'username': 'उपयोगकर्ता नाम',
                'password': 'पासवर्ड',
                'language': 'भाषा',
                'select_role': 'भूमिका चुनें',
                'invalid_credentials': 'अमान्य क्रेडेंशियल्स। कृपया पुनः प्रयास करें।',
                'login_failed': 'लॉगिन असफल। कृपया अपना कनेक्शन जांचें और पुनः प्रयास करें।',
                
                // Student Dashboard
                'your_progress': 'आपकी प्रगति',
                'available_modules': 'उपलब्ध मॉड्यूल',
                'recent_achievements': 'हाल की उपलब्धियां',
                'points': 'अंक',
                'level': 'स्तर',
                'modules_completed': 'मॉड्यूल पूरे',
                
                // Teacher Dashboard
                'teacher_dashboard': 'शिक्षक डैशबोर्ड',
                'overview': 'अवलोकन',
                'students': 'छात्र',
                'analytics': 'विश्लेषण',
                'assignments': 'असाइनमेंट',
                'class_performance': 'कक्षा प्रदर्शन',
                'active_students': 'सक्रिय छात्र',
                'student_name': 'छात्र का नाम',
                'progress': 'प्रगति',
                'last_active': 'अंतिम सक्रिय',
                'create_assignment': 'असाइनमेंट बनाएं',
                'assignment_title': 'असाइनमेंट शीर्षक',
                'select_modules': 'मॉड्यूल चुनें',
                'due_date': 'देय तिथि',
                
                // Module content
                'question': 'प्रश्न',
                'of': 'का',
                'hint': 'संकेत',
                'time_spent': 'बिताया गया समय',
                'score': 'स्कोर',
                'correct': 'सही!',
                'incorrect': 'गलत',
                'try_again': 'पुनः प्रयास करें',
                'well_done': 'बहुत बढ़िया!',
                'excellent': 'उत्कृष्ट!',
                'good_job': 'अच्छा काम!',
                'keep_trying': 'कोशिश करते रहें!',
                
                // Subjects
                'mathematics': 'गणित',
                'science': 'विज्ञान',
                'math': 'गणित',
                
                // Difficulty levels
                'easy': 'आसान',
                'medium': 'मध्यम',
                'hard': 'कठिन',
                
                // Module titles and descriptions
                'basic_algebra': 'बुनियादी बीजगणित',
                'basic_algebra_desc': 'बीजीय व्यंजकों और समीकरणों की मूल बातें सीखें',
                'fractions': 'भिन्नों के साथ काम करना',
                'fractions_desc': 'भिन्नों के जोड़, घटाव, गुणा और भाग में महारत हासिल करें',
                'photosynthesis': 'प्रकाश संश्लेषण प्रक्रिया',
                'photosynthesis_desc': 'समझें कि पौधे सूरज की रोशनी को ऊर्जा में कैसे बदलते हैं',
                'solar_system': 'हमारा सौर मंडल',
                'solar_system_desc': 'ग्रहों, चंद्रमाओं और अन्य खगोलीय पिंडों का अन्वेषण करें',
                
                // Achievements
                'first_steps': 'पहले कदम',
                'first_steps_desc': 'अपना पहला मॉड्यूल पूरा करें',
                'math_master': 'गणित मास्टर',
                'math_master_desc': '5 गणित मॉड्यूल पूरे करें',
                'science_explorer': 'विज्ञान अन्वेषक',
                'science_explorer_desc': '5 विज्ञान मॉड्यूल पूरे करें',
                'perfect_score': 'परफेक्ट स्कोर',
                'perfect_score_desc': '3 मॉड्यूल में परफेक्ट स्कोर प्राप्त करें',
                'streak_master': 'स्ट्रीक मास्टर',
                'streak_master_desc': '7 दिन लगातार अध्ययन करें',
                'speed_demon': 'स्पीड डेमन',
                'speed_demon_desc': '5 मॉड्यूल आधे समय में पूरे करें',
                'persistent_learner': 'लगातार सीखने वाला',
                'persistent_learner_desc': 'कुल 20 मॉड्यूल पूरे करें',
                'helpful_student': 'स्वतंत्र छात्र',
                'helpful_student_desc': 'संकेतों का उपयोग किए बिना मॉड्यूल पूरे करें',
                
                // Level titles
                'novice': 'नौसिखिया',
                'apprentice': 'शिक्षु',
                'practitioner': 'अभ्यासी',
                'expert': 'विशेषज्ञ',
                'master': 'मास्टर',
                'grandmaster': 'ग्रैंड मास्टर',
                
                // Connection status
                'online': 'ऑनलाइन',
                'offline': 'ऑफलाइन',
                'connecting': 'कनेक्ट हो रहा है...',
                
                // Time units
                'minute': 'मिनट',
                'minutes': 'मिनट',
                'hour': 'घंटा',
                'hours': 'घंटे',
                'day': 'दिन',
                'days': 'दिन',
                'week': 'सप्ताह',
                'weeks': 'सप्ताह',
                
                // Feedback messages
                'module_completed': 'मॉड्यूल पूरा!',
                'achievement_unlocked': 'उपलब्धि अनलॉक!',
                'level_up': 'लेवल अप!',
                'new_high_score': 'नया हाई स्कोर!',
                'streak_broken': 'स्ट्रीक टूटी',
                'streak_continued': 'स्ट्रीक जारी!',
                
                // Error messages
                'network_error': 'नेटवर्क त्रुटि। कृपया अपना कनेक्शन जांचें।',
                'module_load_error': 'मॉड्यूल लोड करने में असफल। पुनः प्रयास करें।',
                'save_error': 'प्रगति सहेजने में असफल। पुनः प्रयास करें।',
                'sync_error': 'डेटा सिंक करने में असफल। ऑनलाइन होने पर पुनः प्रयास करेगा।',
                
                // Accessibility
                'skip_to_content': 'मुख्य सामग्री पर जाएं',
                'close_menu': 'मेनू बंद करें',
                'open_menu': 'मेनू खोलें',
                'increase_text_size': 'टेक्स्ट साइज बढ़ाएं',
                'decrease_text_size': 'टेक्स्ट साइज घटाएं',
                'high_contrast_mode': 'उच्च कंट्रास्ट मोड',
                'screen_reader_mode': 'स्क्रीन रीडर मोड'
            }
        };
        
        return translations[language] || translations[this.fallbackLanguage];
    }

    async setLanguage(language) {
        if (language === this.currentLanguage) return;
        
        this.currentLanguage = language;
        await this.loadTranslations(language);
        this.updatePageLanguage();
    }

    t(key, params = {}) {
        const translation = this.translations[this.currentLanguage]?.[key] || 
                          this.translations[this.fallbackLanguage]?.[key] || 
                          key;
        
        // Simple parameter replacement
        let result = translation;
        Object.keys(params).forEach(param => {
            result = result.replace(`{${param}}`, params[param]);
        });
        
        return result;
    }

    updatePageLanguage() {
        // Update HTML lang attribute
        document.documentElement.lang = this.currentLanguage;
        
        // Update any elements with data-i18n attributes
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            const translation = this.t(key);
            
            if (element.tagName === 'INPUT' && element.type === 'text') {
                element.placeholder = translation;
            } else {
                element.textContent = translation;
            }
        });
        
        // Update title and meta description
        document.title = this.t('app_title') || 'STEM Learning Platform';
        
        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) {
            metaDescription.content = this.t('app_description') || 'Gamified STEM learning platform for rural schools';
        }
    }

    // Format numbers according to locale
    formatNumber(number, options = {}) {
        return new Intl.NumberFormat(this.currentLanguage, options).format(number);
    }

    // Format dates according to locale
    formatDate(date, options = {}) {
        return new Intl.DateTimeFormat(this.currentLanguage, options).format(new Date(date));
    }

    // Format relative time (e.g., "2 hours ago")
    formatRelativeTime(date) {
        const now = new Date();
        const targetDate = new Date(date);
        const diffInSeconds = Math.floor((now - targetDate) / 1000);
        
        const intervals = [
            { label: this.t('year'), seconds: 31536000 },
            { label: this.t('month'), seconds: 2592000 },
            { label: this.t('week'), seconds: 604800 },
            { label: this.t('day'), seconds: 86400 },
            { label: this.t('hour'), seconds: 3600 },
            { label: this.t('minute'), seconds: 60 }
        ];
        
        for (const interval of intervals) {
            const count = Math.floor(diffInSeconds / interval.seconds);
            if (count > 0) {
                return `${count} ${interval.label} ${this.t('ago')}`;
            }
        }
        
        return this.t('just_now');
    }

    // Get available languages
    getAvailableLanguages() {
        return [
            { code: 'en', name: 'English', nativeName: 'English' },
            { code: 'es', name: 'Spanish', nativeName: 'Español' },
            { code: 'fr', name: 'French', nativeName: 'Français' },
            { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' }
        ];
    }

    // Check if text direction is RTL
    isRTL() {
        const rtlLanguages = ['ar', 'he', 'fa', 'ur'];
        return rtlLanguages.includes(this.currentLanguage);
    }

    // Get text direction
    getTextDirection() {
        return this.isRTL() ? 'rtl' : 'ltr';
    }
}