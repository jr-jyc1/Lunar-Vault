// Theme Toggle Management
class ThemeManager {
    constructor() {
        this.currentTheme = 'dark';
        this.toggle = null;
        this.init();
    }
    
    init() {
        this.createToggle();
        this.loadSavedTheme();
        this.setupEventListeners();
    }
    
    createToggle() {
        // Check if toggle already exists
        this.toggle = document.getElementById('theme-toggle');
        
        if (!this.toggle) {
            // Create toggle if it doesn't exist
            this.toggle = document.createElement('div');
            this.toggle.id = 'theme-toggle';
            this.toggle.className = 'theme-toggle';
            this.toggle.innerHTML = `
                <i class="fas fa-sun theme-toggle-icon"></i>
                <span class="theme-toggle-text">Light Mode</span>
            `;
            
            document.body.appendChild(this.toggle);
        }
    }
    
    setupEventListeners() {
        if (this.toggle) {
            this.toggle.addEventListener('click', () => {
                this.toggleTheme();
            });
        }
        
        // Listen for system theme changes
        if (window.matchMedia) {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            mediaQuery.addEventListener('change', (e) => {
                if (!localStorage.getItem('theme')) {
                    this.setTheme(e.matches ? 'dark' : 'light');
                }
            });
        }
        
        // Keyboard shortcut (Ctrl/Cmd + T)
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 't') {
                e.preventDefault();
                this.toggleTheme();
            }
        });
    }
    
    loadSavedTheme() {
        // Check for saved theme preference
        const savedTheme = localStorage.getItem('theme');
        
        if (savedTheme) {
            this.setTheme(savedTheme);
        } else {
            // Use system preference if available
            if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                this.setTheme('dark');
            } else {
                this.setTheme('light');
            }
        }
    }
    
    toggleTheme() {
        const newTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
        this.setTheme(newTheme);
        
        // Add toggle animation
        this.animateToggle();
        
        // Save to server if user is logged in
        this.saveThemeToServer(newTheme);
    }
    
    setTheme(theme) {
        this.currentTheme = theme;
        
        // Update document attribute
        document.documentElement.setAttribute('data-theme', theme);
        
        // Save to localStorage
        localStorage.setItem('theme', theme);
        
        // Update toggle appearance
        this.updateToggleAppearance(theme);
        
        // Dispatch custom event for other components
        const event = new CustomEvent('themeChanged', {
            detail: { theme }
        });
        document.dispatchEvent(event);
        
        // Update meta theme-color for mobile browsers
        this.updateMetaThemeColor(theme);
        
        // Announce change for screen readers
        this.announceThemeChange(theme);
    }
    
    updateToggleAppearance(theme) {
        if (!this.toggle) return;
        
        const icon = this.toggle.querySelector('.theme-toggle-icon');
        const text = this.toggle.querySelector('.theme-toggle-text');
        
        if (icon) {
            icon.className = `fas fa-${theme === 'dark' ? 'sun' : 'moon'} theme-toggle-icon`;
        }
        
        if (text) {
            text.textContent = theme === 'dark' ? 'Light Mode' : 'Dark Mode';
        }
        
        // Update tooltip
        this.toggle.title = `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`;
    }
    
    animateToggle() {
        if (!this.toggle) return;
        
        // Add pulse animation
        this.toggle.style.transform = 'scale(0.9)';
        this.toggle.style.transition = 'transform 0.1s ease';
        
        setTimeout(() => {
            this.toggle.style.transform = 'scale(1.1)';
            setTimeout(() => {
                this.toggle.style.transform = 'scale(1)';
                this.toggle.style.transition = '';
            }, 100);
        }, 100);
        
        // Create ripple effect
        this.createRippleEffect();
    }
    
    createRippleEffect() {
        const ripple = document.createElement('div');
        ripple.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            width: 0;
            height: 0;
            background: var(--accent-primary);
            border-radius: 50%;
            transform: translate(-50%, -50%);
            opacity: 0.3;
            pointer-events: none;
            animation: ripple 0.6s ease-out;
        `;
        
        // Add ripple animation keyframes if not already added
        if (!document.querySelector('#ripple-keyframes')) {
            const style = document.createElement('style');
            style.id = 'ripple-keyframes';
            style.textContent = `
                @keyframes ripple {
                    0% {
                        width: 0;
                        height: 0;
                        opacity: 0.3;
                    }
                    100% {
                        width: 100px;
                        height: 100px;
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }
        
        this.toggle.style.position = 'relative';
        this.toggle.appendChild(ripple);
        
        setTimeout(() => {
            if (ripple.parentNode) {
                ripple.parentNode.removeChild(ripple);
            }
        }, 600);
    }
    
    updateMetaThemeColor(theme) {
        let metaThemeColor = document.querySelector('meta[name="theme-color"]');
        
        if (!metaThemeColor) {
            metaThemeColor = document.createElement('meta');
            metaThemeColor.name = 'theme-color';
            document.head.appendChild(metaThemeColor);
        }
        
        metaThemeColor.content = theme === 'dark' ? '#0a0a0a' : '#f8fafc';
    }
    
    announceThemeChange(theme) {
        // Create announcement for screen readers
        const announcement = document.createElement('div');
        announcement.setAttribute('aria-live', 'polite');
        announcement.setAttribute('aria-atomic', 'true');
        announcement.style.cssText = `
            position: absolute;
            left: -10000px;
            width: 1px;
            height: 1px;
            overflow: hidden;
        `;
        announcement.textContent = `Theme changed to ${theme} mode`;
        
        document.body.appendChild(announcement);
        
        setTimeout(() => {
            document.body.removeChild(announcement);
        }, 1000);
    }
    
    saveThemeToServer(theme) {
        // Only save if user is authenticated
        if (window.lunarVault && window.lunarVault.socket) {
            fetch('/api/theme', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ theme })
            }).catch(error => {
                console.warn('Failed to save theme preference to server:', error);
            });
        }
    }
    
    // Get current theme
    getCurrentTheme() {
        return this.currentTheme;
    }
    
    // Check if theme is dark
    isDarkTheme() {
        return this.currentTheme === 'dark';
    }
    
    // Apply theme-specific styles programmatically
    applyThemeStyles(element, styles) {
        const currentStyles = styles[this.currentTheme];
        if (currentStyles && element) {
            Object.assign(element.style, currentStyles);
        }
    }
    
    // Get CSS custom property value for current theme
    getThemeProperty(property) {
        return getComputedStyle(document.documentElement)
            .getPropertyValue(property);
    }
}

// Initialize theme manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.themeManager = new ThemeManager();
});

// Export for use in other modules
window.ThemeManager = ThemeManager;
