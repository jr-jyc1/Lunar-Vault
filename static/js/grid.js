function exportGridData() {
    const today = new Date().toISOString().split('T')[0];
    const csvContent = `Date,Time,Import (kW),Export (kW),Voltage (V),Frequency (Hz),Power Factor
${today},00:00,2.4,0.0,240.1,60.01,0.98
${today},06:00,3.8,0.0,239.8,60.02,0.97
${today},12:00,0.0,4.2,240.3,59.99,0.99
${today},18:00,1.8,0.0,240.0,60.00,0.98`;

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'grid_connection_data.csv';
    a.click();
    window.URL.revokeObjectURL(url);
}

function generateGridReport() {
    alert('Generating comprehensive grid analysis report... This would create a detailed PDF with connection metrics, power quality analysis, and optimization recommendations.');
}

// Initialize page content
document.addEventListener('DOMContentLoaded', function() {
    updateGridMetrics();
    generateRateSchedule();
    generateOptimizationTips();
    generateGridEvents();
    startRealTimeUpdates();
});

function updateGridMetrics() {
    const gridStatus = document.getElementById('grid-status');
    if(gridStatus) gridStatus.textContent = 'Connected';

    const currentFlow = document.getElementById('current-flow');
    if(currentFlow) currentFlow.textContent = '2.4 kW';

    const gridFrequency = document.getElementById('grid-frequency');
    if(gridFrequency) gridFrequency.textContent = '60.02 Hz';

    const gridVoltage = document.getElementById('grid-voltage');
    if(gridVoltage) gridVoltage.textContent = '240.2 V';

    const gridFreq = document.getElementById('grid-freq');
    if(gridFreq) gridFreq.textContent = '60.02 Hz';

    const powerFactor = document.getElementById('power-factor');
    if(powerFactor) powerFactor.textContent = '0.98';

    const gridUptime = document.getElementById('grid-uptime');
    if(gridUptime) gridUptime.textContent = '99.94%';

    const flowRate = document.getElementById('flow-rate');
    if(flowRate) flowRate.textContent = '2.4 kW';

    const dailyImport = document.getElementById('daily-import');
    if(dailyImport) dailyImport.textContent = '12.8 kWh';

    const dailyExport = document.getElementById('daily-export');
    if(dailyExport) dailyExport.textContent = '8.6 kWh';
}

function generateRateSchedule() {
    const schedule = document.getElementById('rate-schedule');
    if(!schedule) return;
    const rates = [
        // Hour 0-5: Off-peak
        ...Array(6).fill('off-peak'),
        // Hour 6-8: Mid-peak
        ...Array(3).fill('mid-peak'),
        // Hour 9-16: Off-peak
        ...Array(8).fill('off-peak'),
        // Hour 17-20: On-peak
        ...Array(4).fill('on-peak'),
        // Hour 21-23: Mid-peak
        ...Array(3).fill('mid-peak')
    ];

    const rateLabels = {
        'off-peak': '$0.08',
        'mid-peak': '$0.12',
        'on-peak': '$0.18'
    };

    schedule.innerHTML = rates.map((rate, hour) => `
        <div class="rate-hour rate-${rate}" title="Hour ${hour}: ${rateLabels[rate]}/kWh">
            ${hour}
        </div>
    `).join('');
}

function generateOptimizationTips() {
    const tips = [
        {
            title: 'Shift High-Energy Tasks',
            description: 'Move energy-intensive activities to off-peak hours (9 AM - 4 PM) to save up to 55% on electricity costs.'
        },
        {
            title: 'Maximize Solar Export',
            description: 'Your peak solar production (11 AM - 2 PM) aligns with off-peak rates. Export excess to maximize savings.'
        },
        {
            title: 'Battery Timing Optimization',
            description: 'Charge your battery during off-peak hours and discharge during on-peak hours for maximum benefit.'
        },
        {
            title: 'Load Scheduling',
            description: 'Schedule EV charging, water heating, and HVAC pre-cooling for off-peak periods.'
        }
    ];

    const container = document.getElementById('rate-optimization-tips');
    if(!container) return;
    container.innerHTML = tips.map(tip => `
        <div class="tip-item">
            <div class="tip-title">${tip.title}</div>
            <div class="tip-description">${tip.description}</div>
        </div>
    `).join('');
}

function generateGridEvents() {
    const events = [
        {
            icon: 'fas fa-info-circle',
            title: 'Planned Maintenance',
            description: 'Grid maintenance scheduled for tomorrow 2:00 AM - 4:00 AM. Backup power will be automatically activated.',
            time: '1 hour ago'
        },
        {
            icon: 'fas fa-check-circle',
            title: 'Peak Demand Avoided',
            description: 'Your solar and battery system successfully avoided peak demand charges during today\'s high usage period.',
            time: '3 hours ago'
        },
        {
            icon: 'fas fa-exclamation-triangle',
            title: 'Voltage Fluctuation',
            description: 'Minor voltage fluctuation detected at 14:32. System automatically compensated with no impact to home power.',
            time: '1 day ago'
        },
        {
            icon: 'fas fa-dollar-sign',
            title: 'Export Credit Milestone',
            description: 'Congratulations! You\'ve reached $100 in grid export credits this month - 25% ahead of last month.',
            time: '2 days ago'
        }
    ];

    const container = document.getElementById('grid-events');
    if(!container) return;
    container.innerHTML = events.map(event => `
        <div class="event-item">
            <i class="${event.icon} event-icon"></i>
            <div class="event-content">
                <div class="event-title">${event.title}</div>
                <div class="event-description">${event.description}</div>
            </div>
            <div class="event-time">${event.time}</div>
        </div>
    `).join('');
}

function startRealTimeUpdates() {
    // Simulate real-time updates of grid metrics
    // Store interval ID to allow cleanup
    if (window.gridUpdateInterval) {
        clearInterval(window.gridUpdateInterval);
    }
    window.gridUpdateInterval = setInterval(() => {
        // Update flow direction randomly
        const isImporting = Math.random() > 0.6;
        const flowDirection = document.getElementById('flow-direction');
        if(!flowDirection) return;
        const flowIcon = flowDirection.querySelector('.flow-icon');
        const flowStatus = flowDirection.querySelector('.flow-status');

        if (isImporting) {
            flowIcon.className = 'fas fa-arrow-right flow-icon';
            flowStatus.textContent = 'Importing';
            flowStatus.classList.remove('flow-status-export');
            flowStatus.classList.add('flow-status-import');
        } else {
            flowIcon.className = 'fas fa-arrow-left flow-icon';
            flowStatus.textContent = 'Exporting';
            flowStatus.classList.remove('flow-status-import');
            flowStatus.classList.add('flow-status-export');
        }

        // Update flow rate
        const rate = (Math.random() * 5).toFixed(1);
        const flowRate = document.getElementById('flow-rate');
        if(flowRate) flowRate.textContent = `${rate} kW`;

        // Update voltage and frequency with small variations
        const voltage = (240 + (Math.random() - 0.5) * 2).toFixed(1);
        const frequency = (60 + (Math.random() - 0.5) * 0.1).toFixed(2);

        const gridVoltage = document.getElementById('grid-voltage');
        if(gridVoltage) gridVoltage.textContent = `${voltage} V`;

        const gridFreq = document.getElementById('grid-freq');
        if(gridFreq) gridFreq.textContent = `${frequency} Hz`;

    }, 5000);
}
