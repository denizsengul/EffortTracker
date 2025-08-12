// Authentication and User Management
class AuthManager {
    constructor(dataManager) {
        this.dataManager = dataManager;
    }

    // Handle login form submission
    handleLogin(email, password) {
        const user = this.dataManager.login(email, password);
        
        if (user) {
            this.onLoginSuccess(user);
            return true;
        } else {
            this.showLoginError('Geçersiz e-posta veya şifre!');
            return false;
        }
    }

    // Handle successful login
    onLoginSuccess(user) {
        // Hide login screen and show main app
        document.getElementById('login-screen').classList.add('hidden');
        document.getElementById('main-app').classList.remove('hidden');
        
        // Update UI with user info
        document.getElementById('user-name').textContent = user.name;
        const userRoleElement = document.getElementById('user-role');
        userRoleElement.textContent = user.role === 'developer' ? 'Developer' : 'Manager';
        userRoleElement.setAttribute('data-role', user.role);
        
        // Debug log to check data-role attribute
        console.log('User role set:', user.role, 'Element data-role:', userRoleElement.getAttribute('data-role'));
        
        // Show/hide navigation items based on role
        if (user.role === 'manager') {
            document.getElementById('all-entries-nav').style.display = 'block';
            // Hide entries (Kayıtlar) nav for managers
            document.getElementById('entries-nav').style.display = 'none';
            // Hide add entry button for managers
            const addEntryBtn = document.getElementById('add-entry-btn');
            if (addEntryBtn) addEntryBtn.style.display = 'none';
            // For managers, start with all-entries view
            document.querySelector('[data-view="all-entries"]').classList.add('active');
            document.querySelector('[data-view="dashboard"]').classList.remove('active');
        } else {
            document.getElementById('all-entries-nav').style.display = 'none';
            // Show entries (Kayıtlar) nav for developers
            document.getElementById('entries-nav').style.display = 'block';
            // Show add entry button for developers
            const addEntryBtn = document.getElementById('add-entry-btn');
            if (addEntryBtn) addEntryBtn.style.display = 'inline-flex';
            // For developers, start with dashboard
            document.querySelector('[data-view="dashboard"]').classList.add('active');
        }
        
        // Initialize the application
        if (window.app) {
            window.app.init(user.role);
        }
        
        // Show success toast
        showToast('Başarıyla giriş yapıldı!', 'success');
    }

    // Show login error
    showLoginError(message) {
        const errorElement = document.getElementById('login-error');
        errorElement.textContent = message;
        errorElement.classList.add('show');
        
        // Hide error after 5 seconds
        setTimeout(() => {
            errorElement.classList.remove('show');
        }, 5000);
    }

    // Handle logout
    logout() {
        this.dataManager.logout();
        
        // Show login screen and hide main app
        document.getElementById('main-app').classList.add('hidden');
        document.getElementById('login-screen').classList.remove('hidden');
        
        // Clear forms
        document.getElementById('login-form').reset();
        
        // Reset navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        document.querySelector('[data-view="dashboard"]').classList.add('active');
        
        showToast('Başarıyla çıkış yapıldı!', 'info');
    }

    // Check if user is logged in
    isLoggedIn() {
        return this.dataManager.getCurrentUser() !== null;
    }

    // Get current user
    getCurrentUser() {
        return this.dataManager.getCurrentUser();
    }
}

// Demo account helper function
function fillLogin(email, password) {
    document.getElementById('email').value = email;
    document.getElementById('password').value = password;
}

// Global logout function
function logout() {
    window.authManager.logout();
}

// Initialize auth manager when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.authManager = new AuthManager(window.dataManager);
    
    // Check if user is already logged in
    if (window.authManager.isLoggedIn()) {
        window.authManager.onLoginSuccess(window.authManager.getCurrentUser());
    }
    
    // Setup login form handler
    document.getElementById('login-form').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        window.authManager.handleLogin(email, password);
    });
});