document.addEventListener('DOMContentLoaded', function() {
    // Initialize battery chart
    const ctx = document.getElementById('battery-chart');
    if(!ctx) return;

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'],
            datasets: [{
                label: 'Battery Level (%)',
                data: [45, 60, 80, 70, 55, 50],
                borderColor: 'var(--primary-orange)',
                backgroundColor: 'rgba(233, 89, 24, 0.1)',
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                        color: 'var(--text-secondary)'
                    },
                    grid: {
                        color: 'var(--border-color)'
                    }
                },
                x: {
                    ticks: {
                        color: 'var(--text-secondary)'
                    },
                    grid: {
                        display: false
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });
});
