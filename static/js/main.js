// Main application JavaScript
class LunarVault {
    constructor() {
        this.socket = io();
        this.currentTheme = 'dark';
        this.energyData = null;
        this.charts = {};
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.initializeTheme();
        this.startRealTimeUpdates();
        this.loadInitialData();
    }
    
    setupEventListeners() {
        // Theme toggle
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => this.toggleTheme());
        }
        
        // Navigation
        document.querySelectorAll('.nav-icon').forEach(icon => {
            icon.addEventListener('click', (e) => this.handleNavigation(e));
        });
        
        // KPI cards
        document.querySelectorAll('.kpi-card').forEach(card => {
            card.addEventListener('click', (e) => this.handleKPIClick(e));
        });
        
        // Socket events
        this.socket.on('energy_update', (data) => this.handleEnergyUpdate(data));
        
        // Chart filters
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.handleChartFilter(e));
        });

        // Date chips
        document.querySelectorAll('.chip-date').forEach(chip => {
            chip.addEventListener('click', () => {
                document.querySelectorAll('.chip-date').forEach(c => c.classList.remove('active'));
                chip.classList.add('active');
            });
        });
    }
    
    initializeTheme() {
        const savedTheme = localStorage.getItem('theme') || 'light';
        this.setTheme(savedTheme);
    }
    
    toggleTheme() {
        const newTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
        this.setTheme(newTheme);
        
        // Save to server
        fetch('/api/theme', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ theme: newTheme })
        });
    }
    
    setTheme(theme) {
        this.currentTheme = theme;
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        
        // Update theme toggle icon
        const themeIcon = document.querySelector('.theme-toggle-icon');
        if (themeIcon) {
            themeIcon.className = `fas fa-${theme === 'dark' ? 'sun' : 'moon'} theme-toggle-icon`;
        }
    }
    
    startRealTimeUpdates() {
        // Request initial update
        this.socket.emit('request_energy_update');
        
        // Set up periodic updates every 5 seconds
        setInterval(() => {
            this.socket.emit('request_energy_update');
        }, 5000);
    }
    
    handleEnergyUpdate(data) {
        this.energyData = data;
        this.updateKPIValues(data);
        this.updateEnergyFlow(data);
    }
    
    updateKPIValues(data) {
        // Update solar production
        const solarValue = document.getElementById('solar-value');
        if (solarValue) {
            solarValue.textContent = `${data.solar_production.toFixed(1)} kW`;
            this.animateValue(solarValue);
            this.updateTrendIndicator('solar-trend', data.solar_trend || 12);
        }

        // Update solar total for today
        const solarTotal = document.getElementById('solar-total');
        if (solarTotal) {
            solarTotal.textContent = `${(data.solar_production * 8).toFixed(1)} kWh`; // Assuming 8 hours of production
        }

        // Update home consumption
        const homeValue = document.getElementById('home-value');
        if (homeValue) {
            homeValue.textContent = `${data.home_consumption.toFixed(1)} kW`;
            this.animateValue(homeValue);
            this.updateTrendIndicator('home-trend', data.home_trend || -5);
        }

        // Update home peak consumption
        const homePeak = document.getElementById('home-peak');
        if (homePeak) {
            homePeak.textContent = `${(data.home_consumption * 1.3).toFixed(1)} kW`; // Assuming peak is 30% higher
        }

        // Update grid status
        const gridValue = document.getElementById('grid-value');
        if (gridValue) {
            const gridText = data.grid_import > 0 ?
                `Importing ${data.grid_import.toFixed(1)} kW` :
                data.grid_export > 0 ?
                `Exporting ${data.grid_export.toFixed(1)} kW` :
                'Balanced';
            gridValue.textContent = gridText;
            this.animateValue(gridValue);
            this.updateGridStatus(data);
        }

        // Update battery level
        const batteryValue = document.getElementById('battery-value');
        if (batteryValue) {
            batteryValue.textContent = `${data.battery_level}%`;
            this.animateValue(batteryValue);
            this.updateBatteryIcon(data.battery_level);
            this.updateTrendIndicator('battery-trend', data.battery_trend || 8);
        }

        // Update savings
        const savingsValue = document.getElementById('savings-value');
        if (savingsValue) {
            savingsValue.textContent = `$${Math.abs(data.net_savings).toFixed(2)}`;
            this.animateValue(savingsValue);
            this.updateTrendIndicator('savings-trend', data.savings_trend || 15);
        }

        // Update new dashboard elements
        this.updateNewDashboardElements(data);
    }

    updateNewDashboardElements(data) {
        // Current month energy
        const currentMonth = document.getElementById('current-month');
        if (currentMonth) {
            currentMonth.textContent = `${(data.solar_production * 240).toFixed(1)} kWh`; // Assuming 30 days * 8 hours
        }

        // Last month energy
        const lastMonth = document.getElementById('last-month');
        if (lastMonth) {
            lastMonth.textContent = `${(data.solar_production * 220).toFixed(1)} kWh`; // Slightly less than current
        }

        // Grid activity values
        const gridImport = document.getElementById('grid-import');
        if (gridImport) {
            gridImport.textContent = `${data.grid_import.toFixed(1)} kW`;
        }

        const gridExport = document.getElementById('grid-export');
        if (gridExport) {
            gridExport.textContent = `${data.grid_export.toFixed(1)} kW`;
        }

        const gridNet = document.getElementById('grid-net');
        if (gridNet) {
            const net = data.grid_export - data.grid_import;
            gridNet.textContent = `${net.toFixed(1)} kW`;
        }

        // Daily values for radial chart
        const solarDaily = document.getElementById('solar-daily');
        if (solarDaily) {
            solarDaily.textContent = `${data.solar_production.toFixed(1)}/5.0 kWh`;
        }

        const consumptionDaily = document.getElementById('consumption-daily');
        if (consumptionDaily) {
            consumptionDaily.textContent = `${data.home_consumption.toFixed(1)}/8.0 kWh`;
        }

        const batteryDaily = document.getElementById('battery-daily');
        if (batteryDaily) {
            batteryDaily.textContent = `${data.battery_level}/100 %`;
        }

        // Total energy
        const totalEnergy = document.getElementById('total-energy');
        if (totalEnergy) {
            totalEnergy.textContent = `${(data.solar_production * 8).toFixed(1)} kWh`;
        }

        // System uptime
        const systemUptime = document.getElementById('system-uptime');
        if (systemUptime) {
            // Calculate uptime (this would come from backend in real app)
            const uptimeHours = Math.floor(Math.random() * 24) + 1;
            const uptimeMinutes = Math.floor(Math.random() * 60);
            systemUptime.textContent = `${uptimeHours}h ${uptimeMinutes}m`;
        }
    }
    
    animateValue(element) {
        element.style.transform = 'scale(1.1)';
        element.style.transition = 'transform 0.2s ease';
        
        setTimeout(() => {
            element.style.transform = 'scale(1)';
        }, 200);
    }
    
    updateBatteryIcon(level) {
        const batteryIcon = document.querySelector('.kpi-battery .kpi-icon');
        if (batteryIcon) {
            let iconClass = 'fas fa-battery-';
            if (level > 75) iconClass += 'full';
            else if (level > 50) iconClass += 'three-quarters';
            else if (level > 25) iconClass += 'half';
            else if (level > 10) iconClass += 'quarter';
            else iconClass += 'empty';

            batteryIcon.className = iconClass;
        }
    }

    updateTrendIndicator(trendId, percentage) {
        const trendElement = document.getElementById(trendId);
        if (!trendElement) return;

        const isPositive = percentage >= 0;
        const absPercentage = Math.abs(percentage);

        trendElement.innerHTML = `
            <i class="fas fa-arrow-${isPositive ? 'up' : 'down'}"></i>
            <span>${absPercentage}%</span>
        `;

        trendElement.className = `kpi-trend ${isPositive ? 'positive' : 'negative'}`;

        // Add pulse animation for significant changes
        if (absPercentage > 10) {
            trendElement.style.animation = 'pulse 0.5s ease';
            setTimeout(() => {
                trendElement.style.animation = '';
            }, 500);
        }
    }

    updateGridStatus(data) {
        const gridStatus = document.getElementById('grid-status');
        if (!gridStatus) return;

        let status = 'Balanced';
        let statusClass = 'balanced';

        if (data.grid_import > 0.5) {
            status = 'Importing';
            statusClass = 'importing';
        } else if (data.grid_export > 0.5) {
            status = 'Exporting';
            statusClass = 'exporting';
        }

        gridStatus.textContent = status;
        gridStatus.className = `kpi-status ${statusClass}`;
    }
    
    updateEnergyFlow(data) {
        // This will be handled by the energy-flow.js module
        if (window.EnergyFlowVisualizer) {
            window.EnergyFlowVisualizer.update(data);
        }
    }
    
    handleNavigation(e) {
        e.preventDefault();
        const icon = e.currentTarget;
        const page = icon.dataset.page;
        
        // Add click animation
        icon.style.transform = 'scale(0.9)';
        setTimeout(() => {
            icon.style.transform = 'scale(1.1)';
            setTimeout(() => {
                icon.style.transform = 'scale(1)';
                
                // Navigate to page
                if (page) {
                    window.location.href = `/${page}`;
                }
            }, 100);
        }, 100);
    }
    
    handleKPIClick(e) {
        const card = e.currentTarget;
        const type = card.dataset.metric || card.dataset.type;

        // Enhanced mobile touch feedback
        if (this.isMobile()) {
            // Add haptic-like feedback for mobile
            card.style.transform = 'scale(0.96)';
            card.style.transition = 'all 0.1s ease';

            // Add ripple effect
            this.createRippleEffect(e, card);

            setTimeout(() => {
                card.style.transform = 'scale(1)';
                setTimeout(() => {
                    // Navigate to dedicated page
                    if (type) {
                        this.navigateWithTransition(type);
                    }
                }, 100);
            }, 150);
        } else {
            // Desktop animation
            card.style.transform = 'scale(0.95)';
            setTimeout(() => {
                card.style.transform = 'scale(1.05)';
                setTimeout(() => {
                    card.style.transform = 'scale(1)';

                    // Navigate to dedicated page
                    if (type) {
                        this.navigateWithTransition(type);
                    }
                }, 150);
            }, 100);
        }
    }
    
    navigateWithTransition(type) {
        // Create transition effect
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: radial-gradient(circle, var(--accent-primary), transparent);
            opacity: 0;
            z-index: 9999;
            pointer-events: none;
            transition: opacity 0.5s ease;
        `;
        
        document.body.appendChild(overlay);
        
        setTimeout(() => {
            overlay.style.opacity = '0.3';
        }, 10);
        
        setTimeout(() => {
            window.location.href = `/${type}`;
        }, 500);
    }
    
    handleChartFilter(e) {
        const btn = e.currentTarget;
        const period = btn.dataset.period;
        
        // Update active state
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        // Load new chart data
        this.loadChartData(period);
    }
    
    async loadChartData(period) {
        try {
            const response = await fetch(`/api/energy/history/${period}`);
            const data = await response.json();
            
            if (window.ChartsManager) {
                window.ChartsManager.updateChart(data);
            }
        } catch (error) {
            console.error('Error loading chart data:', error);
        }
    }
    
    async loadInitialData() {
        try {
            // Load current energy data
            const energyResponse = await fetch('/api/energy/current');
            const energyData = await energyResponse.json();
            this.handleEnergyUpdate(energyData);
            
            // Load recommendations
            const recResponse = await fetch('/api/recommendations');
            const recommendations = await recResponse.json();
            this.updateRecommendations(recommendations);
            
            // Load weather forecast
            const weatherResponse = await fetch('/api/weather/forecast');
            const forecast = await weatherResponse.json();
            this.updateWeatherForecast(forecast);
            
        } catch (error) {
            console.error('Error loading initial data:', error);
        }
    }
    
    updateRecommendations(recommendations) {
        const container = document.getElementById('recommendations-container');
        if (!container) return;
        
        container.innerHTML = recommendations.map(rec => `
            <div class="recommendation-card glass-panel">
                <div class="recommendation-header">
                    <i class="fas fa-${rec.icon} recommendation-icon"></i>
                    <h4 class="recommendation-title">${rec.title}</h4>
                </div>
                <p class="recommendation-message">${rec.message}</p>
            </div>
        `).join('');
    }
    
    updateWeatherForecast(forecast) {
        const container = document.getElementById('weather-forecast');
        if (!container) return;
        
        const next6Hours = forecast.slice(0, 6);
        container.innerHTML = next6Hours.map(hour => `
            <div class="weather-item">
                <i class="fas fa-${this.getWeatherIcon(hour.condition)} weather-icon ${hour.condition}"></i>
                <span>${hour.hour}:00</span>
                <span>${hour.temperature}°C</span>
            </div>
        `).join('');
    }
    
    getWeatherIcon(condition) {
        const icons = {
            'sunny': 'sun',
            'partly-cloudy': 'cloud-sun',
            'cloudy': 'cloud',
            'rainy': 'cloud-rain'
        };
        return icons[condition] || 'sun';
    }
    
    // Utility methods
    formatValue(value, unit = '') {
        if (typeof value === 'number') {
            return `${value.toFixed(2)} ${unit}`.trim();
        }
        return value;
    }
    
    addGlowEffect(element) {
        element.classList.add('animate-glow');
        setTimeout(() => {
            element.classList.remove('animate-glow');
        }, 2000);
    }

    isMobile() {
        return window.innerWidth <= 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }

    createRippleEffect(event, element) {
        const ripple = document.createElement('div');
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;

        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: rgba(255, 69, 0, 0.3);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 0.6s ease-out;
            pointer-events: none;
            z-index: 10;
        `;

        element.style.position = 'relative';
        element.style.overflow = 'hidden';
        element.appendChild(ripple);

        setTimeout(() => {
            ripple.remove();
        }, 600);
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.lunarVault = new LunarVault();
});

// Export for use in other modules
window.LunarVault = LunarVault;
