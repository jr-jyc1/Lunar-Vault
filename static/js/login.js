function showRegisterForm() {
    const loginPanel = document.querySelector('.login-panel:first-of-type');
    const registerPanel = document.getElementById('register-panel');

    loginPanel.style.display = 'none';
    registerPanel.style.display = 'block';

    // Focus first input
    setTimeout(() => {
        document.getElementById('reg-username').focus();
    }, 100);
}

function showLoginForm() {
    const loginPanel = document.querySelector('.login-panel:first-of-type');
    const registerPanel = document.getElementById('register-panel');

    registerPanel.style.display = 'none';
    loginPanel.style.display = 'block';

    // Focus first input
    setTimeout(() => {
        document.getElementById('email').focus();
    }, 100);
}

function showForgotPassword() {
    alert('Password reset functionality would be implemented here. For demo purposes, use any email/password combination to login.');
}

function signInWithGoogle() {
    // Simulate Google OAuth - in production this would integrate with Google OAuth
    alert('Google OAuth integration would be implemented here. For demo purposes, use the regular login form.');
}

function signInWithApple() {
    // Simulate Apple OAuth - in production this would integrate with Apple Sign In
    alert('Apple Sign In integration would be here. For demo purposes, use the regular login form.');
}

// Add input animations
document.addEventListener('DOMContentLoaded', function() {
    const inputs = document.querySelectorAll('.form-input');

    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');

            // Add subtle glow effect
            if (window.threeBackground) {
                window.threeBackground.addEnergyPulse(0.3);
            }
        });

        input.addEventListener('blur', function() {
            if (!this.value) {
                this.parentElement.classList.remove('focused');
            }
        });

        // Add floating label effect
        input.addEventListener('input', function() {
            if (this.value) {
                this.parentElement.classList.add('has-value');
            } else {
                this.parentElement.classList.remove('has-value');
            }
        });
    });

    // Add submit button animation
    const submitBtns = document.querySelectorAll('.btn-primary');
    submitBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            // Create ripple effect
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;

            ripple.style.cssText = `
                position: absolute;
                top: ${y}px;
                left: ${x}px;
                width: ${size}px;
                height: ${size}px;
                background: rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s ease-out;
                pointer-events: none;
            `;

            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);

            setTimeout(() => {
                if (ripple.parentNode) {
                    ripple.parentNode.removeChild(ripple);
                }
            }, 600);
        });
    });
});

// Auto-focus first input when page loads
window.addEventListener('load', function() {
    const firstInput = document.getElementById('email');
    if (firstInput) {
        firstInput.focus();
    }
});
