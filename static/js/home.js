function exportConsumptionData() {
    const csvContent = `Date,Time,HVAC (kW),Lighting (kW),Appliances (kW),EV Charging (kW),Other (kW),Total (kW)
${new Date().toISOString().split('T')[0]},00:00,2.1,0.3,0.8,0.0,0.2,3.4
${new Date().toISOString().split('T')[0]},06:00,3.8,1.2,1.1,0.0,0.3,6.4
${new Date().toISOString().split('T')[0]},12:00,2.9,0.1,1.5,3.2,0.4,8.1
${new Date().toISOString().split('T')[0]},18:00,4.2,1.8,2.1,0.0,0.5,8.6`;

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'home_consumption_data.csv';
    a.click();
    window.URL.revokeObjectURL(url);
}

function generateUsageReport() {
    alert('Generating comprehensive usage report... This would create a detailed PDF with consumption patterns, efficiency metrics, and recommendations.');
}

// Initialize page content
document.addEventListener('DOMContentLoaded', function() {
    updateCurrentUsage();
    generateWeeklyChart();
    generateRecommendations();
    generateUsageAlerts();
    updateConsumptionMetrics();
});

function updateCurrentUsage() {
    const appliances = [
        { name: 'HVAC System', icon: 'fas fa-snowflake', usage: '3.2 kW', status: 'Cooling', color: '#ef4444' },
        { name: 'Water Heater', icon: 'fas fa-fire', usage: '2.1 kW', status: 'Heating', color: '#f59e0b' },
        { name: 'Refrigerator', icon: 'fas fa-cube', usage: '0.8 kW', status: 'Running', color: '#10b981' },
        { name: 'Lighting', icon: 'fas fa-lightbulb', usage: '0.6 kW', status: 'Auto Mode', color: '#f59e0b' },
        { name: 'EV Charger', icon: 'fas fa-car', usage: '0.0 kW', status: 'Idle', color: '#3b82f6' },
        { name: 'Entertainment', icon: 'fas fa-tv', usage: '0.4 kW', status: 'Standby', color: '#8b5cf6' }
    ];

    const container = document.getElementById('appliances-grid');
    if(!container) return;

    container.innerHTML = appliances.map(appliance => `
        <div class="appliance-card">
            <div class="appliance-header">
                <span class="appliance-name">${appliance.name}</span>
                <i class="${appliance.icon} appliance-icon appliance-color-${appliance.color.replace('#', '')}"></i>
            </div>
            <div class="appliance-usage appliance-color-${appliance.color.replace('#', '')}">${appliance.usage}</div>
            <div class="appliance-status">
                <div class="status-indicator appliance-bg-${appliance.color.replace('#', '')}"></div>
                <span>${appliance.status}</span>
            </div>
        </div>
    `).join('');

    // Update total usage
    const totalUsage = appliances.reduce((sum, appliance) => {
        const usage = parseFloat(appliance.usage.split(' ')[0]);
        return sum + usage;
    }, 0);

    const totalCurrentUsage = document.getElementById('total-current-usage');
    if(totalCurrentUsage) totalCurrentUsage.textContent = `${totalUsage.toFixed(1)} kW`;
}

function generateWeeklyChart() {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const usage = [28.5, 26.8, 31.2, 29.7, 27.4, 33.1, 30.8];
    const maxUsage = Math.max(...usage);

    const container = document.getElementById('weekly-usage-chart');
    if(!container) return;

    container.innerHTML = days.map((day, index) => `
        <div class="day-usage">
            <div class="day-name">${day}</div>
            <div class="day-value">${usage[index]} kWh</div>
            <div class="day-bar">
                <div class="day-fill" data-width="${(usage[index] / maxUsage) * 100}"></div>
            </div>
        </div>
    `).join('');

    // Set widths programmatically to avoid inline styles
    const fills = container.querySelectorAll('.day-fill');
    fills.forEach(fill => {
        const width = fill.getAttribute('data-width');
        fill.style.width = width + '%';
    });
}

function generateRecommendations() {
    const recommendations = [
        {
            icon: 'fas fa-thermometer-half',
            title: 'Optimize HVAC Schedule',
            description: 'Your HVAC system runs during peak solar hours. Shift cooling to early morning and pre-cool your home using solar power.',
            savings: 'Save $45/month',
            effort: 'Easy'
        },
        {
            icon: 'fas fa-clock',
            title: 'Delay Water Heating',
            description: 'Schedule water heater to run between 10 AM - 2 PM when solar production is highest.',
            savings: 'Save $28/month',
            effort: 'Easy'
        },
        {
            icon: 'fas fa-car-battery',
            title: 'Smart EV Charging',
            description: 'Enable smart charging to automatically charge your EV during peak solar production hours.',
            savings: 'Save $62/month',
            effort: 'Moderate'
        },
        {
            icon: 'fas fa-lightbulb',
            title: 'LED Upgrade Opportunity',
            description: 'Replace remaining incandescent bulbs with smart LEDs to reduce lighting consumption by 35%.',
            savings: 'Save $18/month',
            effort: 'Easy'
        }
    ];

    const container = document.getElementById('consumption-recommendations');
    if(!container) return;

    container.innerHTML = recommendations.map(rec => `
        <div class="recommendation-card">
            <div class="recommendation-header">
                <i class="${rec.icon} recommendation-icon"></i>
                <span class="recommendation-title">${rec.title}</span>
            </div>
            <div class="recommendation-description">${rec.description}</div>
            <div class="recommendation-savings">
                <span class="savings-amount">${rec.savings}</span>
                <span class="effort-level">${rec.effort}</span>
            </div>
        </div>
    `).join('');
}

function generateUsageAlerts() {
    const alerts = [
        {
            icon: 'fas fa-exclamation-triangle',
            title: 'High Evening Usage Detected',
            message: 'Your consumption between 6-8 PM is 23% higher than average. Consider shifting some activities to off-peak hours.',
            time: '2 hours ago'
        },
        {
            icon: 'fas fa-snowflake',
            title: 'HVAC Running Efficiency Alert',
            message: 'Your air conditioning has been running 15% longer than optimal. Check air filters and consider a thermostat adjustment.',
            time: '1 day ago'
        },
        {
            icon: 'fas fa-info-circle',
            title: 'Phantom Load Detection',
            message: 'Standby power consumption has increased by 8% this week. Review connected devices and unplug unused electronics.',
            time: '3 days ago'
        }
    ];

    const container = document.getElementById('usage-alerts');
    if(!container) return;
    container.innerHTML = alerts.map(alert => `
        <div class="alert-item">
            <i class="${alert.icon} alert-icon"></i>
            <div class="alert-content">
                <div class="alert-title">${alert.title}</div>
                <div class="alert-message">${alert.message}</div>
            </div>
            <div class="alert-time">${alert.time}</div>
        </div>
    `).join('');
}

function updateConsumptionMetrics() {
    const currentUsage = document.getElementById('current-usage');
    if(currentUsage) currentUsage.textContent = '7.1 kW';

    const dailyConsumption = document.getElementById('daily-consumption');
    if(dailyConsumption) dailyConsumption.textContent = '29.8 kWh';

    const efficiencyScore = document.getElementById('efficiency-score');
    if(efficiencyScore) efficiencyScore.textContent = '85%';
}
