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
        solarGradient.addColorStop(0, 'rgba(233, 89, 24, 0.4)');
        solarGradient.addColorStop(1, 'rgba(233, 89, 24, 0.05)');

        const consumptionGradient = ctx.getContext('2d').createLinearGradient(0, 0, 0, 400);
        consumptionGradient.addColorStop(0, 'rgba(160, 174, 192, 0.3)');
        consumptionGradient.addColorStop(1, 'rgba(160, 174, 192, 0.05)');

        this.charts.energyTrend = new Chart(ctx, {
            type: 'line',
            data: {
                labels: [],
                datasets: [
                    {
                        label: 'Solar Production',
                        data: [],
                        borderColor: 'var(--primary-orange)',
                        backgroundColor: solarGradient,
                        fill: true,
                        tension: 0.4,
                    },
                    {
                        label: 'Home Consumption',
                        data: [],
                        borderColor: 'var(--text-secondary)',
                        backgroundColor: consumptionGradient,
                        fill: true,
                        tension: 0.4,
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        labels: {
                            color: 'var(--text-primary)',
                        }
                    }
                },
                scales: {
                    x: {
                        grid: {
                            color: 'var(--border-color)',
                        },
                        ticks: {
                            color: 'var(--text-secondary)',
                        }
                    },
                    y: {
                        grid: {
                            color: 'var(--border-color)',
                        },
                        ticks: {
                            color: 'var(--text-secondary)',
                        }
                    }
                }
            }
        });
    }

    createWeeklyUsageChart() {
        const ctx = document.getElementById('weekly-usage-chart');
        if (!ctx) return;

        const labels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const data = [3.2, 4.0, 7.26, 5.1, 6.2, 4.6, 3.8];
        const highlightIndex = 2; // Tue

        const bg = labels.map((_, i) => (i === highlightIndex ? 'var(--primary-orange)' : 'rgba(160, 174, 192, 0.2)'));
        const border = labels.map((_, i) => (i === highlightIndex ? 'var(--primary-orange)' : 'rgba(160, 174, 192, 0.2)'));

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
                },
                scales: {
                    x: {
                        grid: { display: false },
                        ticks: { color: 'var(--text-secondary)' }
                    },
                    y: {
                        beginAtZero: true,
                        suggestedMax: 8,
                        grid: { color: 'var(--border-color)' },
                        ticks: {
                            color: 'var(--text-secondary)',
                            callback: (v) => `${v}h`
                        }
                    }
                }
            }
        });
    }

    createSummaryDonutChart() {
        const ctx = document.getElementById('summary-donut-chart');
        if (!ctx) return;

        const completed = 48, pending = 34, overdue = 18;

        this.charts.summaryDonut = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Completed', 'Pending', 'Overdue'],
                datasets: [
                    {
                        data: [completed, pending, overdue],
                        backgroundColor: ['var(--primary-orange)', 'var(--neutral-light-gray)', 'var(--primary-black)'],
                        borderWidth: 0,
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '70%',
                plugins: {
                    legend: { display: false },
                }
            }
        });
    }

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
                    borderColor: 'var(--primary-orange)',
                    backgroundColor: 'rgba(233, 89, 24, 0.1)',
                    fill: true,
                    tension: 0.4,
                    pointRadius: 0,
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                },
                scales: {
                    x: { display: false },
                    y: { display: false }
                }
            }
        });
    }

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
                    borderColor: 'var(--text-secondary)',
                    backgroundColor: 'rgba(160, 174, 192, 0.1)',
                    fill: true,
                    tension: 0.4,
                    pointRadius: 0,
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                },
                scales: {
                    x: { display: false },
                    y: { display: false }
                }
            }
        });
    }

    createBatteryStatusChart() {
        const ctx = document.getElementById('battery-status-chart');
        if (!ctx) return;

        const data = [75];

        this.charts.batteryStatus = new Chart(ctx, {
            type: 'doughnut',
            data: {
                datasets: [{
                    data: [data[0], 100 - data[0]],
                    backgroundColor: ['var(--primary-orange)', 'rgba(233, 89, 24, 0.1)'],
                    borderWidth: 0,
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '70%',
                plugins: {
                    legend: { display: false },
                    tooltip: { enabled: false }
                }
            }
        });
    }

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
                        borderColor: 'var(--text-secondary)',
                        backgroundColor: 'rgba(160, 174, 192, 0.1)',
                        fill: true,
                        tension: 0.4,
                        pointRadius: 0,
                    },
                    {
                        label: 'Export',
                        data: exportData,
                        borderColor: 'var(--primary-orange)',
                        backgroundColor: 'rgba(233, 89, 24, 0.1)',
                        fill: true,
                        tension: 0.4,
                        pointRadius: 0,
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                },
                scales: {
                    x: { display: false },
                    y: { display: false }
                }
            }
        });
    }

    createEnergyRadialChart() {
        const ctx = document.getElementById('energy-radial-chart');
        if (!ctx) return;

        const data = [60, 40, 75];

        this.charts.energyRadial = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Solar', 'Consumption', 'Battery'],
                datasets: [{
                    data,
                    backgroundColor: ['var(--primary-orange)', 'var(--text-secondary)', 'var(--neutral-light-gray)'],
                    borderWidth: 0,
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '60%',
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            color: 'var(--text-primary)'
                        }
                    },
                }
            }
        });
    }

    createActiveEnergyChart() {
        const ctx = document.getElementById('active-energy-chart');
        if (!ctx) return;

        const data = [85];

        this.charts.activeEnergy = new Chart(ctx, {
            type: 'doughnut',
            data: {
                datasets: [{
                    data: [data[0], 100 - data[0]],
                    backgroundColor: ['var(--primary-orange)', 'rgba(233, 89, 24, 0.1)'],
                    borderWidth: 0,
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '70%',
                plugins: {
                    legend: { display: false },
                    tooltip: { enabled: false }
                }
            }
        });
    }

    createUptimeChart() {
        const ctx = document.getElementById('uptime-chart');
        if (!ctx) return;

        const data = [92];

        this.charts.uptime = new Chart(ctx, {
            type: 'doughnut',
            data: {
                datasets: [{
                    data: [data[0], 100 - data[0]],
                    backgroundColor: ['var(--primary-orange)', 'rgba(233, 89, 24, 0.1)'],
                    borderWidth: 0,
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '70%',
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
                    backgroundColor: 'var(--primary-orange)',
                    borderRadius: 8,
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
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
                            color: 'var(--border-color)',
                        },
                        ticks: {
                            color: 'var(--text-secondary)',
                        }
                    }
                }
            }
        });
    }
    
    createConsumptionChart() {
        const ctx = document.getElementById('consumption-chart');
        if (!ctx) return;
        
        this.charts.consumption = new Chart(ctx, {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    label: 'Home Consumption',
                    data: [],
                    borderColor: 'var(--primary-orange)',
                    backgroundColor: 'rgba(233, 89, 24, 0.1)',
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
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
                            color: 'var(--border-color)',
                        },
                        ticks: {
                            color: 'var(--text-secondary)',
                        }
                    }
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
                        borderColor: 'var(--text-secondary)',
                        backgroundColor: 'rgba(160, 174, 192, 0.1)',
                        fill: true,
                        tension: 0.4
                    },
                    {
                        label: 'Export',
                        data: [],
                        borderColor: 'var(--primary-orange)',
                        backgroundColor: 'rgba(233, 89, 24, 0.1)',
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
                        }
                    }
                },
                scales: {
                    x: {
                        grid: {
                            color: 'var(--border-color)',
                        },
                        ticks: {
                            color: 'var(--text-secondary)'
                        }
                    },
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'var(--border-color)',
                        },
                        ticks: {
                            color: 'var(--text-secondary)',
                        }
                    }
                }
            }
        });
    }
}

// Initialize charts when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    if (typeof Chart !== 'undefined') {
        window.ChartsManager = new ChartsManager();
    }
});
