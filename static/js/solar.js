function exportSolarData() {
    // Simulate CSV export
    const csvContent = `Date,Solar Production (kWh),Weather,Efficiency
${new Date().toISOString().split('T')[0]},25.4,Sunny,98.5%
${new Date(Date.now() - 86400000).toISOString().split('T')[0]},22.1,Partly Cloudy,96.2%
${new Date(Date.now() - 172800000).toISOString().split('T')[0]},18.7,Cloudy,94.1%`;

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'solar_analytics_data.csv';
    a.click();
    window.URL.revokeObjectURL(url);
}

function printSolarReport() {
    window.print();
}

// Generate forecast data
document.addEventListener('DOMContentLoaded', function() {
    generateSolarForecast();
    generateOptimizationRecommendations();
    updateSolarMetrics();
});

function generateSolarForecast() {
    const container = document.getElementById('solar-forecast-container');
    if (!container) return;
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const weather = ['☀️', '⛅', '☁️', '☀️', '☀️', '⛅', '☀️'];
    const production = [28.5, 22.1, 15.8, 30.2, 29.8, 25.4, 27.6];
    const conditions = ['Sunny', 'Partly Cloudy', 'Cloudy', 'Clear', 'Sunny', 'Mixed', 'Clear'];

    container.innerHTML = days.map((day, index) => `
        <div class="forecast-day">
            <div class="forecast-date">${day}</div>
            <div class="forecast-weather">${weather[index]}</div>
            <div class="forecast-production">${production[index]} kWh</div>
            <div class="forecast-conditions">${conditions[index]}</div>
        </div>
    `).join('');
}

function generateOptimizationRecommendations() {
    const container = document.getElementById('solar-recommendations');
    if (!container) return;
    const recommendations = [
        {
            title: 'Panel Cleaning Schedule',
            description: 'Your panels haven\'t been cleaned in 45 days. Regular cleaning can improve efficiency by 3-5%.',
            savings: '+$15/month',
            difficulty: 'Easy'
        },
        {
            title: 'Optimize Panel Angle',
            description: 'Adjusting panel tilt by 5° for winter season could increase production by 8%.',
            savings: '+$32/month',
            difficulty: 'Moderate'
        },
        {
            title: 'Add Battery Storage',
            description: 'With your current excess production, a 10kWh battery could save an additional 15% on energy costs.',
            savings: '+$85/month',
            difficulty: 'Professional'
        },
        {
            title: 'Smart Inverter Upgrade',
            description: 'Upgrading to a smart inverter with DC optimizers could increase overall system efficiency by 12%.',
            savings: '+$48/month',
            difficulty: 'Professional'
        }
    ];

    container.innerHTML = recommendations.map(rec => `
        <div class="optimization-card">
            <div class="optimization-title">${rec.title}</div>
            <div class="optimization-description">${rec.description}</div>
            <div class="optimization-impact">
                <span class="optimization-savings">${rec.savings}</span>
                <span class="optimization-difficulty">${rec.difficulty}</span>
            </div>
        </div>
    `).join('');
}

function updateSolarMetrics() {
    // Simulate real metrics - in production these would come from API
    const totalSolarToday = document.getElementById('total-solar-today');
    if(totalSolarToday) totalSolarToday.textContent = '28.5 kWh';

    const peakSolarPower = document.getElementById('peak-solar-power');
    if(peakSolarPower) peakSolarPower.textContent = '8.2 kW';

    const solarEfficiency = document.getElementById('solar-efficiency');
    if(solarEfficiency) solarEfficiency.textContent = '98.5%';

    const avgDailyProduction = document.getElementById('avg-daily-production');
    if(avgDailyProduction) avgDailyProduction.textContent = '25.8 kWh';

    const bestDayProduction = document.getElementById('best-day-production');
    if(bestDayProduction) bestDayProduction.textContent = '32.1 kWh';

    const daysAboveAvg = document.getElementById('days-above-avg');
    if(daysAboveAvg) daysAboveAvg.textContent = '18';

    const sunnyDays = document.getElementById('sunny-days');
    if(sunnyDays) sunnyDays.textContent = '22';

    const cloudyDays = document.getElementById('cloudy-days');
    if(cloudyDays) cloudyDays.textContent = '8';

    const weatherEfficiency = document.getElementById('weather-efficiency');
    if(weatherEfficiency) weatherEfficiency.textContent = '94.2%';

    const thisMonthProduction = document.getElementById('this-month-production');
    if(thisMonthProduction) thisMonthProduction.textContent = '748 kWh';

    const lastMonthProduction = document.getElementById('last-month-production');
    if(lastMonthProduction) lastMonthProduction.textContent = '692 kWh';

    const lastYearProduction = document.getElementById('last-year-production');
    if(lastYearProduction) lastYearProduction.textContent = '651 kWh';

    const productionTrend = document.getElementById('production-trend');
    if(productionTrend) productionTrend.textContent = '+15% improvement year-over-year';
}
