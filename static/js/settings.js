function initializeSettingsPage() {
    // Tab switching functionality
    const tabs = document.querySelectorAll('.nav-tab');
    const sections = document.querySelectorAll('.settings-section');

    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const targetTab = this.dataset.tab;

            // Update active tab
            tabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');

            // Show corresponding section
            sections.forEach(section => {
                section.classList.remove('active');
                if (section.id === targetTab + '-settings') {
                    section.classList.add('active');
                }
            });

            // Animate tab transition
             this.classList.add('tab-click');
             setTimeout(() => {
                 this.classList.remove('tab-click');
             }, 100);
        });
    });

    // Load persisted UI preferences (background animation + particle quality)
    try {
        const bg = localStorage.getItem('lv.backgroundAnimation');
        const q = localStorage.getItem('lv.particlesQuality');
        const bgEl = document.getElementById('background-animation');
        const qEl = document.getElementById('particle-quality');
        if (bgEl && (bg === 'on' || bg === 'off')) bgEl.checked = (bg !== 'off');
        if (qEl && q) qEl.value = q;
    } catch (e) {}
}

function setupPasswordStrength() {
    const passwordInput = document.getElementById('new-password');
    const strengthIndicator = document.getElementById('password-strength');

    if (passwordInput && strengthIndicator) {
        passwordInput.addEventListener('input', function() {
            const password = this.value;
            const strength = calculatePasswordStrength(password);

            strengthIndicator.className = 'password-strength ' + strength;
        });
    }
}

function calculatePasswordStrength(password) {
    if (password.length < 6) return 'weak';
    if (password.length < 10) return 'medium';
    if (password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)) {
        return 'strong';
    }
    return 'medium';
}

function setupThemeSelector() {
    const themeOptions = document.querySelectorAll('.theme-option');
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';

    // Set initial active theme
    themeOptions.forEach(option => {
        if (option.dataset.theme === currentTheme) {
            option.classList.add('active');
        }

        option.addEventListener('click', function() {
            const selectedTheme = this.dataset.theme;

            // Update active state
            themeOptions.forEach(opt => opt.classList.remove('active'));
            this.classList.add('active');

            // Apply theme
            if (window.themeManager) {
                window.themeManager.setTheme(selectedTheme);
            }
        });
    });
}

function loadSystemLogs() {
    const logsContainer = document.getElementById('system-logs');
    if (!logsContainer) return;

    const logs = [
        '[2025-08-30 14:32:15] INFO: Solar inverter connection established',
        '[2025-08-30 14:31:58] INFO: Battery health check completed - 98.5% capacity',
        '[2025-08-30 14:30:42] INFO: Grid synchronization successful',
        '[2025-08-30 14:29:33] WARN: Minor voltage fluctuation detected - auto-corrected',
        '[2025-08-30 14:28:11] INFO: System startup sequence completed',
        '[2025-08-30 14:27:45] INFO: All sensors calibrated and operational'
    ];

    logsContainer.innerHTML = logs.join('\n');
}

// Settings update functions
function updateProfile() {
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const currentPassword = document.getElementById('current-password').value;
    const newPassword = document.getElementById('new-password').value;

    // Validate inputs
    if (!username || !email) {
        alert('Please fill in all required fields.');
        return;
    }

    // Simulate profile update
    alert('Profile updated successfully!');
}

function updateSystemConfig() {
    // Collect all system configuration values
    const config = {
        panelCapacity: document.getElementById('panel-capacity').value,
        panelCount: document.getElementById('panel-count').value,
        panelEfficiency: document.getElementById('panel-efficiency').value,
        batteryCapacity: document.getElementById('battery-capacity').value,
        utilityProvider: document.getElementById('utility-provider').value,
        ratePlan: document.getElementById('rate-plan').value
    };

    alert('System configuration saved successfully!');
    console.log('System config:', config);
}

function runSystemCalibration() {
    alert('Starting system calibration... This process will take approximately 5 minutes. You will be notified when complete.');

    // Simulate calibration process
    setTimeout(() => {
        alert('System calibration completed successfully! All sensors are now properly calibrated.');
    }, 3000);
}

function updatePreferences() {
    const backgroundAnimationEl = document.getElementById('background-animation');
    const qualityEl = document.getElementById('particle-quality');

    const backgroundAnimation = backgroundAnimationEl ? backgroundAnimationEl.checked : true;
    const quality = qualityEl ? qualityEl.value : 'medium';

    // Persist to localStorage for Three.js background to pick up
    try {
        localStorage.setItem('lv.backgroundAnimation', backgroundAnimation ? 'on' : 'off');
        localStorage.setItem('lv.particlesQuality', quality);
    } catch (e) {
        // no-op
    }

    alert('Preferences saved successfully!');

    // Reload to apply background quality/animation settings cleanly
    setTimeout(() => {
        window.location.reload();
    }, 300);
}

function resetToDefaults() {
    if (confirm('Are you sure you want to reset all preferences to their default values?')) {
        // Reset form values to defaults
        document.getElementById('background-animation').checked = true;
        document.getElementById('holographic-effects').checked = true;

        alert('Preferences reset to default values.');
    }
}

function updateNotifications() {
    alert('Notification preferences saved successfully!');
}

function testNotifications() {
    alert('Test notification sent! Check your configured notification channels.');
}

function updateDataSettings() {
    alert('Data management settings saved successfully!');
}

function exportAllData() {
    // Create a sample CSV export
    const csvData = `Timestamp,Solar Production (kW),Home Consumption (kW),Grid Import (kW),Grid Export (kW),Battery Level (%)
2025-08-30T00:00:00Z,0.0,2.1,2.1,0.0,65
2025-08-30T06:00:00Z,1.2,3.8,2.6,0.0,62
2025-08-30T12:00:00Z,8.5,4.1,0.0,4.4,75
2025-08-30T18:00:00Z,2.1,5.2,3.1,0.0,72`;

    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'lunar_vault_complete_data.csv';
    a.click();
    window.URL.revokeObjectURL(url);
}

function generateMonthlyReport() {
    alert('Generating monthly energy report... The PDF will be downloaded shortly.');

    // In production, this would generate and download a PDF
    setTimeout(() => {
        alert('Monthly report generated and downloaded successfully!');
    }, 2000);
}

function deleteAllData() {
    if (confirm('WARNING: This will permanently delete ALL your energy data. This action cannot be undone. Are you absolutely sure?')) {
        if (confirm('This is your final warning. All data will be lost forever. Continue?')) {
            alert('All data has been permanently deleted.');
        }
    }
}

function updateSecuritySettings() {
    alert('Security settings updated successfully!');
}

function setup2FA() {
    alert('Two-Factor Authentication setup wizard would be launched here. This would typically involve scanning a QR code with an authenticator app.');
}

function regenerateKey(keyType) {
    if (confirm(`Are you sure you want to regenerate the ${keyType} API key? The old key will be immediately invalidated.`)) {
        alert(`New ${keyType} API key generated successfully!`);
    }
}

function revokeKey(keyType) {
    if (confirm(`Are you sure you want to revoke the ${keyType} API key? This action cannot be undone.`)) {
        alert(`${keyType} API key has been revoked.`);
    }
}

function generateNewKey() {
    const keyName = prompt('Enter a name for the new API key:');
    if (keyName) {
        alert(`New API key "${keyName}" generated successfully!`);
    }
}

function terminateSession(sessionType) {
    if (confirm(`Are you sure you want to terminate the ${sessionType} session?`)) {
        alert(`${sessionType} session terminated successfully.`);
    }
}

function terminateAllSessions() {
    if (confirm('Are you sure you want to terminate all other sessions? You will remain logged in on this device.')) {
        alert('All other sessions have been terminated.');
    }
}

function updateRecoveryEmail() {
    const newEmail = prompt('Enter new recovery email address:');
    if (newEmail) {
        alert(`Recovery email updated to: ${newEmail}`);
    }
}

function generateRecoveryCodes() {
    alert('Recovery codes generated! Please save these codes in a secure location. They can be used to recover your account if you lose access to your authentication device.');
}

// Diagnostic functions
function runSystemScan() {
    alert('Starting comprehensive system scan... This will check all components and connections.');

    setTimeout(() => {
        alert('System scan completed! No issues detected. All components are functioning normally.');
    }, 3000);
}

function runPerformanceTest() {
    alert('Starting performance test... Analyzing system efficiency and identifying optimization opportunities.');

    setTimeout(() => {
        alert('Performance test completed! System is operating at 97.2% efficiency. 2 optimization recommendations available.');
    }, 4000);
}

function runConnectionTest() {
    alert('Testing all network and device connections...');

    setTimeout(() => {
        alert('Connection test completed! All devices are properly connected and communicating.');
    }, 2000);
}

function runCalibration() {
    if (confirm('System calibration will temporarily interrupt monitoring for 5-10 minutes. Continue?')) {
        alert('Calibration started... You will be notified when complete.');

        setTimeout(() => {
            alert('Calibration completed successfully! All sensors have been recalibrated.');
        }, 5000);
    }
}

function scheduleMainenance() {
    alert('Maintenance scheduling interface would be displayed here, allowing you to book appointments with certified technicians.');
}

function viewFullLogs() {
    alert('Full system logs viewer would be opened in a new window, displaying detailed system activity history.');
}

function exportDiagnostics() {
    alert('Exporting diagnostic data... This file can be shared with technical support for analysis.');

    const diagnosticData = 'Lunar Vault Diagnostic Report\nGenerated: ' + new Date().toISOString() + '\n\nSystem Status: All components operational\nLast Maintenance: 2 weeks ago\nTotal Runtime: 1,247 hours';

    const blob = new Blob([diagnosticData], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'lunar_vault_diagnostics.txt';
    a.click();
    window.URL.revokeObjectURL(url);
}

function contactSupport() {
    alert('Opening support center... You would be connected with a technical support specialist.');
}

function saveAllSettings() {
    alert('Saving all settings across all categories... Please wait.');

    setTimeout(() => {
        alert('All settings have been saved successfully!');
    }, 1500);
}

document.addEventListener('DOMContentLoaded', function() {
    initializeSettingsPage();
    setupPasswordStrength();
    setupThemeSelector();
    loadSystemLogs();
});
