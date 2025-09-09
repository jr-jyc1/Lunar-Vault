// Charts Management for Lunar Vault
class ChartsManager {
    constructor() {
        this.charts = {};
        this.init();
    }
    
    init() {
        // New modern charts for the redesigned dashboard
        this.createWeeklyUsageChart();
        this.createSummaryDonutChart();
        this.createSolarDailyChart();
        this.createHomeConsumptionChart();
        this.createMonthlyProgressChart();
        this.createLastMonthChart();
        this.createBatteryStatusChart();
        this.createGridActivityChart();
        this.createEnergyRadialChart();
        this.createActiveEnergyChart();
        this.createUptimeChart();

        // Existing charts (rendered only if canvas exists)
        this.createEnergyTrendChart();
        this.createSolarAnalyticsChart();
        this.createConsumptionChart();
        this.createGridChart();
    }
    
    createEnergyTrendChart() {
        const ctx = document.getElementById('energy-trend-chart');
        if (!ctx) return;

        // Create gradient backgrounds
        const solarGradient = ctx.getContext('2d').createLinearGradient(0, 0, 0, 400);
        solarGradient.addColorStop(0, 'rgba(245, 158, 11, 0.4)');
        solarGradient.addColorStop(1, 'rgba(245, 158, 11, 0.05)');

        const consumptionGradient = ctx.getContext('2d').createLinearGradient(0, 0, 0, 400);
        consumptionGradient.addColorStop(0, 'rgba(16, 185, 129, 0.3)');
        consumptionGradient.addColorStop(1, 'rgba(16, 185, 129, 0.05)');

        const importGradient = ctx.getContext('2d').createLinearGradient(0, 0, 0, 400);
        importGradient.addColorStop(0, 'rgba(239, 68, 68, 0.3)');
        importGradient.addColorStop(1, 'rgba(239, 68, 68, 0.05)');

        const exportGradient = ctx.getContext('2d').createLinearGradient(0, 0, 0, 400);
        exportGradient.addColorStop(0, 'rgba(139, 92, 246, 0.3)');
        exportGradient.addColorStop(1, 'rgba(139, 92, 246, 0.05)');

        this.charts.energyTrend = new Chart(ctx, {
            type: 'line',
            data: {
                labels: [],
                datasets: [
                    {
                        label: 'Solar Production ☀️',
                        data: [],
                        borderColor: '#fbbf24',
                        backgroundColor: solarGradient,
                        fill: true,
                        tension: 0.4,
                        pointBackgroundColor: '#fbbf24',
                        pointBorderColor: '#fff',
                        pointBorderWidth: 2,
                        pointRadius: 0,
                        pointHoverRadius: 8,
                        pointHoverBackgroundColor: '#fbbf24',
                        pointHoverBorderColor: '#fff',
                        pointHoverBorderWidth: 3,
                        borderWidth: 4
                    },
                    {
                        label: 'Home Consumption 🏠',
                        data: [],
                        borderColor: '#34d399',
                        backgroundColor: consumptionGradient,
                        fill: true,
                        tension: 0.4,
                        pointBackgroundColor: '#34d399',
                        pointBorderColor: '#fff',
                        pointBorderWidth: 2,
                        pointRadius: 0,
                        pointHoverRadius: 8,
                        pointHoverBackgroundColor: '#34d399',
                        pointHoverBorderColor: '#fff',
                        pointHoverBorderWidth: 3,
                        borderWidth: 3
                    },
                    {
                        label: 'Grid Import ⚡',
                        data: [],
                        borderColor: '#f87171',
                        backgroundColor: importGradient,
                        fill: false,
                        tension: 0.4,
                        pointBackgroundColor: '#f87171',
                        pointBorderColor: '#fff',
                        pointBorderWidth: 2,
                        pointRadius: 0,
                        pointHoverRadius: 6,
                        pointHoverBackgroundColor: '#f87171',
                        pointHoverBorderColor: '#fff',
                        pointHoverBorderWidth: 3,
                        borderWidth: 2,
                        borderDash: [5, 5]
                    },
                    {
                        label: 'Grid Export 🔋',
                        data: [],
                        borderColor: '#a78bfa',
                        backgroundColor: exportGradient,
                        fill: false,
                        tension: 0.4,
                        pointBackgroundColor: '#a78bfa',
                        pointBorderColor: '#fff',
                        pointBorderWidth: 2,
                        pointRadius: 0,
                        pointHoverRadius: 6,
                        pointHoverBackgroundColor: '#a78bfa',
                        pointHoverBorderColor: '#fff',
                        pointHoverBorderWidth: 3,
                        borderWidth: 2,
                        borderDash: [10, 5]
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                        labels: {
                            color: 'var(--text-primary)',
                            usePointStyle: true,
                            padding: 25,
                            font: {
                                size: 12,
                                weight: '500'
                            },
                            generateLabels: function(chart) {
                                const datasets = chart.data.datasets;
                                return datasets.map((dataset, i) => ({
                                    text: dataset.label,
                                    fillStyle: dataset.borderColor,
                                    strokeStyle: dataset.borderColor,
                                    lineWidth: 2,
                                    hidden: !chart.isDatasetVisible(i),
                                    index: i,
                                    pointStyle: 'rectRounded'
                                }));
                            }
                        }
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        titleColor: '#fff',
                        bodyColor: '#fff',
                        borderColor: 'var(--accent-primary)',
                        borderWidth: 1,
                        cornerRadius: 12,
                        padding: 12,
                        titleFont: {
                            size: 14,
                            weight: 'bold'
                        },
                        bodyFont: {
                            size: 13
                        },
                        callbacks: {
                            title: function(context) {
                                const date = new Date(context[0].parsed.x);
                                return date.toLocaleString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                });
                            },
                            label: function(context) {
                                const value = context.parsed.y.toFixed(2);
                                const unit = 'kW';
                                const change = context.datasetIndex === 0 ? '↑' : '↓';
                                return `${context.dataset.label.split(' ')[0]}: ${value} ${unit}`;
                            },
                            afterBody: function(context) {
                                const total = context.reduce((sum, item) => sum + item.parsed.y, 0);
                                return `Total: ${total.toFixed(2)} kW`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        type: 'time',
                        time: {
                            displayFormats: {
                                hour: 'HH:mm',
                                day: 'MMM DD',
                                month: 'MMM YYYY'
                            }
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)',
                            drawBorder: false,
                            lineWidth: 1
                        },
                        ticks: {
                            color: 'var(--text-secondary)',
                            font: {
                                size: 11
                            }
                        }
                    },
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)',
                            drawBorder: false,
                            lineWidth: 1
                        },
                        ticks: {
                            color: 'var(--text-secondary)',
                            callback: function(value) {
                                return value + ' kW';
                            },
                            font: {
                                size: 11
                            }
                        }
                    }
                },
                interaction: {
                    mode: 'nearest',
                    axis: 'x',
                    intersect: false
                },
                elements: {
                    point: {
                        radius: 0,
                        hoverRadius: 8
                    },
                    line: {
                        borderWidth: 3
                    }
                },
                animation: {
                    duration: 2000,
                    easing: 'easeInOutQuart'
                },
                hover: {
                    animationDuration: 300,
                    mode: 'nearest',
                    intersect: false
                }
            }
        });
    }

    // New rounded bar chart similar to the reference (weekly usage)
    createWeeklyUsageChart() {
        const ctx = document.getElementById('weekly-usage-chart');
        if (!ctx) return;

        const labels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        // Placeholder demo data; real data can be wired from backend later
        const data = [3.2, 4.0, 7.26, 5.1, 6.2, 4.6, 3.8];
        const highlightIndex = 2; // Tue

        const bg = labels.map((_, i) => (i === highlightIndex ? '#ff4500' : 'rgba(0,0,0,0.08)'));
        const border = labels.map((_, i) => (i === highlightIndex ? '#ff4500' : 'rgba(0,0,0,0.1)'));

        this.charts.weeklyUsage = new Chart(ctx, {
            type: 'bar',
            data: {
                labels,
                datasets: [
                    {
                        data,
                        backgroundColor: bg,
                        borderColor: border,
                        borderWidth: 1,
                        borderRadius: 10,
                        borderSkipped: false,
                        maxBarThickness: 38
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        backgroundColor: 'rgba(17,17,17,0.92)',
                        titleColor: '#fff',
                        bodyColor: '#fff',
                        cornerRadius: 10,
                        callbacks: {
                            label: (ctx) => `${ctx.parsed.y} h`
                        }
                    }
                },
                scales: {
                    x: {
                        grid: { display: false },
                        ticks: { color: 'var(--text-secondary)' }
                    },
                    y: {
                        beginAtZero: true,
                        suggestedMax: 8,
                        grid: { color: 'rgba(0,0,0,0.06)', drawBorder: false },
                        ticks: {
                            color: 'var(--text-secondary)',
                            callback: (v) => `${v}h`
                        }
                    }
                }
            }
        });
    }

    // Donut completion with center text
    createSummaryDonutChart() {
        const ctx = document.getElementById('summary-donut-chart');
        if (!ctx) return;

        // Lightweight center text plugin
        const centerText = {
            id: 'centerText',
            afterDraw(chart, args, opts) {
                const { ctx } = chart;
                const { left, right, top, bottom } = chart.chartArea;
                const cx = (left + right) / 2;
                const cy = (top + bottom) / 2;

                ctx.save();
                ctx.font = '700 18px Montserrat, sans-serif';
                ctx.fillStyle = 'var(--text-primary)';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(opts.top || 'Total', cx, cy - 12);
                ctx.font = '600 14px Inter, sans-serif';
                ctx.fillStyle = 'var(--text-secondary)';
                ctx.fillText(opts.bottom || 'Summary', cx, cy + 10);
                ctx.restore();
            }
        };

        const completed = 48, pending = 34, overdue = 18;

        this.charts.summaryDonut = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Completed', 'Pending', 'Overdue'],
                datasets: [
                    {
                        data: [completed, pending, overdue],
                        backgroundColor: ['#ff4500', '#e5e7eb', '#111318'],
                        borderWidth: 0,
                        hoverOffset: 8,
                        spacing: 2
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '70%',
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        backgroundColor: 'rgba(17,17,17,0.92)',
                        titleColor: '#fff',
                        bodyColor: '#fff',
                        cornerRadius: 10
                    },
                    centerText: { top: 'Total', bottom: 'Summary' }
                }
            },
            plugins: [centerText]
        });
    }

    // Solar daily production chart
    createSolarDailyChart() {
        const ctx = document.getElementById('solar-daily-chart');
        if (!ctx) return;

        const labels = ['6AM', '8AM', '10AM', '12PM', '2PM', '4PM', '6PM'];
        const data = [0.1, 1.2, 2.8, 4.2, 3.9, 2.1, 0.3];

        this.charts.solarDaily = new Chart(ctx, {
            type: 'line',
            data: {
                labels,
                datasets: [{
                    data,
                    borderColor: '#ff4500',
                    backgroundColor: 'rgba(255, 69, 0, 0.1)',
                    fill: true,
                    tension: 0.4,
                    pointRadius: 0,
                    pointHoverRadius: 4,
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        backgroundColor: 'rgba(17,17,17,0.92)',
                        titleColor: '#fff',
                        bodyColor: '#fff',
                        cornerRadius: 10,
                        callbacks: {
                            label: (ctx) => `${ctx.parsed.y} kW`
                        }
                    }
                },
                scales: {
                    x: {
                        display: false,
                        grid: { display: false }
                    },
                    y: {
                        display: false,
                        grid: { display: false }
                    }
                },
                elements: {
                    point: {
                        hoverRadius: 6
                    }
                }
            }
        });
    }

    // Home consumption chart
    createHomeConsumptionChart() {
        const ctx = document.getElementById('home-consumption-chart');
        if (!ctx) return;

        const labels = ['6AM', '8AM', '10AM', '12PM', '2PM', '4PM', '6PM'];
        const data = [0.8, 1.5, 2.2, 3.1, 2.8, 1.9, 1.2];

        this.charts.homeConsumption = new Chart(ctx, {
            type: 'line',
            data: {
                labels,
                datasets: [{
                    data,
                    borderColor: '#45003',
                    backgroundColor: 'rgba(69, 0, 3, 0.1)',
                    fill: true,
                    tension: 0.4,
                    pointRadius: 0,
                    pointHoverRadius: 4,
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        backgroundColor: 'rgba(17,17,17,0.92)',
                        titleColor: '#fff',
                        bodyColor: '#fff',
                        cornerRadius: 10,
                        callbacks: {
                            label: (ctx) => `${ctx.parsed.y} kW`
                        }
                    }
                },
                scales: {
                    x: {
                        display: false,
                        grid: { display: false }
                    },
                    y: {
                        display: false,
                        grid: { display: false }
                    }
                },
                elements: {
                    point: {
                        hoverRadius: 6
                    }
                }
            }
        });
    }

    // Monthly progress chart
    createMonthlyProgressChart() {
        const ctx = document.getElementById('monthly-progress-chart');
        if (!ctx) return;

        const data = [65]; // Percentage

        this.charts.monthlyProgress = new Chart(ctx, {
            type: 'doughnut',
            data: {
                datasets: [{
                    data: [data[0], 100 - data[0]],
                    backgroundColor: ['#ff4500', 'rgba(255, 69, 0, 0.1)'],
                    borderWidth: 0,
                    cutout: '70%'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: { enabled: false }
                }
            }
        });
    }

    // Last month chart
    createLastMonthChart() {
        const ctx = document.getElementById('last-month-chart');
        if (!ctx) return;

        const data = [58]; // Percentage

        this.charts.lastMonth = new Chart(ctx, {
            type: 'doughnut',
            data: {
                datasets: [{
                    data: [data[0], 100 - data[0]],
                    backgroundColor: ['#45003', 'rgba(69, 0, 3, 0.1)'],
                    borderWidth: 0,
                    cutout: '70%'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: { enabled: false }
                }
            }
        });
    }

    // Battery status chart
    createBatteryStatusChart() {
        const ctx = document.getElementById('battery-status-chart');
        if (!ctx) return;

        const data = [75]; // Percentage

        this.charts.batteryStatus = new Chart(ctx, {
            type: 'doughnut',
            data: {
                datasets: [{
                    data: [data[0], 100 - data[0]],
                    backgroundColor: ['#10b981', 'rgba(16, 185, 129, 0.1)'],
                    borderWidth: 0,
                    cutout: '70%'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: { enabled: false }
                }
            }
        });
    }

    // Grid activity chart
    createGridActivityChart() {
        const ctx = document.getElementById('grid-activity-chart');
        if (!ctx) return;

        const labels = ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'];
        const importData = [0.5, 0.3, 0.1, 0.8, 1.2, 0.6];
        const exportData = [0.2, 0.4, 0.6, 0.3, 0.1, 0.2];

        this.charts.gridActivity = new Chart(ctx, {
            type: 'line',
            data: {
                labels,
                datasets: [
                    {
                        label: 'Import',
                        data: importData,
                        borderColor: '#ef4444',
                        backgroundColor: 'rgba(239, 68, 68, 0.1)',
                        fill: true,
                        tension: 0.4,
                        pointRadius: 0,
                        pointHoverRadius: 4
                    },
                    {
                        label: 'Export',
                        data: exportData,
                        borderColor: '#10b981',
                        backgroundColor: 'rgba(16, 185, 129, 0.1)',
                        fill: true,
                        tension: 0.4,
                        pointRadius: 0,
                        pointHoverRadius: 4
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        backgroundColor: 'rgba(17,17,17,0.92)',
                        titleColor: '#fff',
                        bodyColor: '#fff',
                        cornerRadius: 10
                    }
                },
                scales: {
                    x: {
                        display: false,
                        grid: { display: false }
                    },
                    y: {
                        display: false,
                        grid: { display: false }
                    }
                }
            }
        });
    }

    // Energy radial chart
    createEnergyRadialChart() {
        const ctx = document.getElementById('energy-radial-chart');
        if (!ctx) return;

        const data = [60, 40, 75]; // Solar, Consumption, Battery percentages

        this.charts.energyRadial = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Solar', 'Consumption', 'Battery'],
                datasets: [{
                    data,
                    backgroundColor: ['#ff4500', '#45003', '#10b981'],
                    borderWidth: 0,
                    hoverOffset: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '60%',
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        backgroundColor: 'rgba(17,17,17,0.92)',
                        titleColor: '#fff',
                        bodyColor: '#fff',
                        cornerRadius: 10
                    }
                }
            }
        });
    }

    // Active energy chart
    createActiveEnergyChart() {
        const ctx = document.getElementById('active-energy-chart');
        if (!ctx) return;

        const data = [85]; // Percentage

        this.charts.activeEnergy = new Chart(ctx, {
            type: 'doughnut',
            data: {
                datasets: [{
                    data: [data[0], 100 - data[0]],
                    backgroundColor: ['#ff4500', 'rgba(255, 69, 0, 0.1)'],
                    borderWidth: 0,
                    cutout: '70%'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: { enabled: false }
                }
            }
        });
    }

    // Uptime chart
    createUptimeChart() {
        const ctx = document.getElementById('uptime-chart');
        if (!ctx) return;

        const data = [92]; // Percentage

        this.charts.uptime = new Chart(ctx, {
            type: 'doughnut',
            data: {
                datasets: [{
                    data: [data[0], 100 - data[0]],
                    backgroundColor: ['#10b981', 'rgba(16, 185, 129, 0.1)'],
                    borderWidth: 0,
                    cutout: '70%'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: { enabled: false }
                }
            }
        });
    }
    
    createSolarAnalyticsChart() {
        const ctx = document.getElementById('solar-analytics-chart');
        if (!ctx) return;
        
        this.charts.solarAnalytics = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: [],
                datasets: [{
                    label: 'Solar Production',
                    data: [],
                    backgroundColor: 'rgba(245, 158, 11, 0.8)',
                    borderColor: '#f59e0b',
                    borderWidth: 2,
                    borderRadius: 8,
                    borderSkipped: false
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: 'var(--glass-bg)',
                        titleColor: 'var(--text-primary)',
                        bodyColor: 'var(--text-primary)',
                        borderColor: 'var(--solar-color)',
                        borderWidth: 1,
                        cornerRadius: 8
                    }
                },
                scales: {
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            color: 'var(--text-secondary)'
                        }
                    },
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'var(--glass-border)',
                            drawBorder: false
                        },
                        ticks: {
                            color: 'var(--text-secondary)',
                            callback: function(value) {
                                return value + ' kWh';
                            }
                        }
                    }
                },
                animation: {
                    duration: 1200,
                    easing: 'easeOutBounce'
                }
            }
        });
    }
    
    createConsumptionChart() {
        const ctx = document.getElementById('consumption-chart');
        if (!ctx) return;
        
        this.charts.consumption = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['HVAC', 'Lighting', 'Appliances', 'EV Charging', 'Other'],
                datasets: [{
                    data: [40, 15, 20, 20, 5],
                    backgroundColor: [
                        '#ef4444',
                        '#f59e0b',
                        '#10b981',
                        '#3b82f6',
                        '#8b5cf6'
                    ],
                    borderWidth: 0,
                    hoverOffset: 10
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'right',
                        labels: {
                            color: 'var(--text-primary)',
                            usePointStyle: true,
                            padding: 20
                        }
                    },
                    tooltip: {
                        backgroundColor: 'var(--glass-bg)',
                        titleColor: 'var(--text-primary)',
                        bodyColor: 'var(--text-primary)',
                        borderColor: 'var(--accent-primary)',
                        borderWidth: 1,
                        cornerRadius: 8,
                        callbacks: {
                            label: function(context) {
                                const percentage = ((context.parsed / context.dataset.data.reduce((a, b) => a + b, 0)) * 100).toFixed(1);
                                return `${context.label}: ${percentage}%`;
                            }
                        }
                    }
                },
                cutout: '60%',
                animation: {
                    animateRotate: true,
                    duration: 1500
                }
            }
        });
    }
    
    createGridChart() {
        const ctx = document.getElementById('grid-chart');
        if (!ctx) return;
        
        this.charts.grid = new Chart(ctx, {
            type: 'line',
            data: {
                labels: [],
                datasets: [
                    {
                        label: 'Import',
                        data: [],
                        borderColor: '#ef4444',
                        backgroundColor: 'rgba(239, 68, 68, 0.1)',
                        fill: true,
                        tension: 0.4
                    },
                    {
                        label: 'Export',
                        data: [],
                        borderColor: '#10b981',
                        backgroundColor: 'rgba(16, 185, 129, 0.1)',
                        fill: true,
                        tension: 0.4
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                        labels: {
                            color: 'var(--text-primary)',
                            usePointStyle: true
                        }
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                        backgroundColor: 'var(--glass-bg)',
                        titleColor: 'var(--text-primary)',
                        bodyColor: 'var(--text-primary)',
                        borderColor: 'var(--accent-primary)',
                        borderWidth: 1,
                        cornerRadius: 8
                    }
                },
                scales: {
                    x: {
                        type: 'time',
                        time: {
                            displayFormats: {
                                hour: 'HH:mm',
                                day: 'MMM DD'
                            }
                        },
                        grid: {
                            color: 'var(--glass-border)',
                            drawBorder: false
                        },
                        ticks: {
                            color: 'var(--text-secondary)'
                        }
                    },
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'var(--glass-border)',
                            drawBorder: false
                        },
                        ticks: {
                            color: 'var(--text-secondary)',
                            callback: function(value) {
                                return value + ' kW';
                            }
                        }
                    }
                },
                elements: {
                    point: {
                        radius: 0,
                        hoverRadius: 4
                    },
                    line: {
                        borderWidth: 2
                    }
                }
            }
        });
    }
    
    updateChart(data, chartName = 'energyTrend') {
        const chart = this.charts[chartName];
        if (!chart) return;
        
        // Process data based on chart type
        if (chartName === 'energyTrend') {
            this.updateEnergyTrendData(chart, data);
        } else if (chartName === 'solarAnalytics') {
            this.updateSolarAnalyticsData(chart, data);
        } else if (chartName === 'grid') {
            this.updateGridData(chart, data);
        }
        
        chart.update('active');
    }
    
    updateEnergyTrendData(chart, data) {
        const labels = data.map(point => new Date(point.timestamp));
        const solarData = data.map(point => point.solar_production);
        const homeData = data.map(point => point.home_consumption);
        const gridImportData = data.map(point => point.grid_import);
        const gridExportData = data.map(point => point.grid_export);
        
        chart.data.labels = labels;
        chart.data.datasets[0].data = solarData;
        chart.data.datasets[1].data = homeData;
        chart.data.datasets[2].data = gridImportData;
        chart.data.datasets[3].data = gridExportData;
    }
    
    updateSolarAnalyticsData(chart, data) {
        // Aggregate data by hour or day
        const aggregated = this.aggregateData(data, 'hour');
        
        chart.data.labels = aggregated.labels;
        chart.data.datasets[0].data = aggregated.values;
    }
    
    updateGridData(chart, data) {
        const labels = data.map(point => new Date(point.timestamp));
        const importData = data.map(point => point.grid_import);
        const exportData = data.map(point => point.grid_export);
        
        chart.data.labels = labels;
        chart.data.datasets[0].data = importData;
        chart.data.datasets[1].data = exportData;
    }
    
    aggregateData(data, interval) {
        const aggregated = {};
        
        data.forEach(point => {
            const date = new Date(point.timestamp);
            let key;
            
            if (interval === 'hour') {
                key = date.toISOString().substr(0, 13); // YYYY-MM-DDTHH
            } else if (interval === 'day') {
                key = date.toISOString().substr(0, 10); // YYYY-MM-DD
            }
            
            if (!aggregated[key]) {
                aggregated[key] = {
                    sum: 0,
                    count: 0
                };
            }
            
            aggregated[key].sum += point.solar_production;
            aggregated[key].count++;
        });
        
        const labels = Object.keys(aggregated).sort();
        const values = labels.map(key => aggregated[key].sum / aggregated[key].count);
        
        return { labels, values };
    }
    
    // Theme update method
    updateTheme() {
        Object.values(this.charts).forEach(chart => {
            if (chart.options.plugins.legend && chart.options.plugins.legend.labels) {
                chart.options.plugins.legend.labels.color = 'var(--text-primary)';
            }
            if (chart.options.plugins.tooltip) {
                chart.options.plugins.tooltip.backgroundColor = 'var(--glass-bg)';
                chart.options.plugins.tooltip.titleColor = 'var(--text-primary)';
                chart.options.plugins.tooltip.bodyColor = 'var(--text-primary)';
            }
            if (chart.options.scales && chart.options.scales.x) {
                chart.options.scales.x.ticks.color = 'var(--text-secondary)';
                chart.options.scales.x.grid.color = 'var(--glass-border)';
            }
            if (chart.options.scales && chart.options.scales.y) {
                chart.options.scales.y.ticks.color = 'var(--text-secondary)';
                chart.options.scales.y.grid.color = 'var(--glass-border)';
            }
            chart.update('none');
        });
    }
    
    // Resize all charts
    resize() {
        Object.values(this.charts).forEach(chart => {
            chart.resize();
        });
    }
    
    // Destroy all charts
    destroy() {
        Object.values(this.charts).forEach(chart => {
            chart.destroy();
        });
        this.charts = {};
    }
}

// Initialize charts when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    if (typeof Chart !== 'undefined') {
        // Configure Chart.js defaults
        Chart.defaults.font.family = "'Roboto', sans-serif";
        Chart.defaults.color = 'var(--text-primary)';
        Chart.defaults.backgroundColor = 'var(--glass-bg)';
        
        window.ChartsManager = new ChartsManager();
        
        // Handle window resize
        window.addEventListener('resize', () => {
            if (window.ChartsManager) {
                window.ChartsManager.resize();
            }
        });
        
        // Handle theme changes
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.attributeName === 'data-theme') {
                    if (window.ChartsManager) {
                        window.ChartsManager.updateTheme();
                    }
                }
            });
        });
        
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['data-theme']
        });
    }
});

// Export for use in other modules
window.ChartsManagerClass = ChartsManager;
