// Cyberbullying Visualization App Logic

document.addEventListener('DOMContentLoaded', () => {
    initTabs();
    initCharts();
});

// --- Tab Functionality ---
function initTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));

            // Add active class to clicked
            btn.classList.add('active');
            const targetId = btn.getAttribute('data-tab');
            document.getElementById(targetId).classList.add('active');
        });
    });
}

// --- Chart Data & Logic ---

// Placeholder Data
const chartData = {
    // Annual Trend (2015-2024)
    trendLabels: ['2015', '2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023', '2024'],

    prevalence: {
        trend: [34, 33.5, 36, 37.2, 36.5, 38, 41, 40.5, 43, 42.5], // Rising trend
        age: [12, 18, 28, 42, 45, 41, 35, 25, 18], // Peak at 13-15 (index 3,4,5 corresponds to Age 13,14,15)
        color: '#38bdf8' // Sky 400
    },

    reporting: {
        trend: [25, 26, 28, 29, 30, 32, 35, 34, 33, 35], // Slow rise but low
        age: [50, 45, 40, 35, 30, 25, 22, 20, 15], // Younger kids report more?
        color: '#818cf8' // Violet 400
    },

    ageLabels: ['10', '11', '12', '13', '14', '15', '16', '17', '18']
};

let mainChartInstance = null;
let secondaryChartInstance = null;

function initCharts() {
    const ctxTrend = document.getElementById('trendChart').getContext('2d');
    const ctxAge = document.getElementById('ageChart').getContext('2d');
    const metricSelect = document.getElementById('metric-select');

    // Chart Global Defaults for Dark Mode
    Chart.defaults.color = '#94a3b8';
    Chart.defaults.borderColor = 'rgba(255, 255, 255, 0.1)';
    Chart.defaults.font.family = "'Inter', sans-serif";

    // render initial charts
    renderCharts(ctxTrend, ctxAge, 'prevalence');

    // Listener for dropdown
    metricSelect.addEventListener('change', (e) => {
        updateCharts(e.target.value);
    });
}

function renderCharts(ctxTrend, ctxAge, metricKey) {
    const data = chartData[metricKey];

    // Gradient for Line Chart
    let gradientTrend = ctxTrend.createLinearGradient(0, 0, 0, 400);
    gradientTrend.addColorStop(0, hexToRgba(data.color, 0.5));
    gradientTrend.addColorStop(1, hexToRgba(data.color, 0.0));

    // 1. Main Trend Chart (Line)
    mainChartInstance = new Chart(ctxTrend, {
        type: 'line',
        data: {
            labels: chartData.trendLabels,
            datasets: [{
                label: 'Percentage (%)',
                data: data.trend,
                borderColor: data.color,
                backgroundColor: gradientTrend,
                borderWidth: 3,
                tension: 0.4, // Smooths the line
                pointBackgroundColor: '#0f172a',
                pointBorderColor: data.color,
                pointBorderWidth: 2,
                pointRadius: 4,
                pointHoverRadius: 6,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    backgroundColor: 'rgba(15, 23, 42, 0.9)',
                    titleColor: '#f1f5f9',
                    bodyColor: '#cbd5e1',
                    borderColor: 'rgba(255,255,255,0.1)',
                    borderWidth: 1
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    grid: { borderDash: [4, 4] }
                },
                x: {
                    grid: { display: false }
                }
            }
        }
    });

    // 2. Secondary Age Chart (Bar)
    secondaryChartInstance = new Chart(ctxAge, {
        type: 'bar',
        data: {
            labels: chartData.ageLabels,
            datasets: [{
                label: 'By Age',
                data: data.age,
                backgroundColor: data.color,
                borderRadius: 4,
                hoverBackgroundColor: '#fff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 60,
                    grid: { display: false }
                },
                x: {
                    grid: { display: false },
                    title: { display: true, text: 'Age' }
                }
            }
        }
    });
}

function updateCharts(metricKey) {
    const data = chartData[metricKey];

    // Update Main Chart
    mainChartInstance.data.datasets[0].data = data.trend;
    mainChartInstance.data.datasets[0].borderColor = data.color;
    mainChartInstance.data.datasets[0].pointBorderColor = data.color;

    // Update gradient (requires accessing context again usually, but for simple update we can skip or recreate)
    // For simplicity, we just update the solid color fallback or re-create gradient if strictly needed.
    // Let's just update the solid colors for simplicity of valid update logic.
    const ctx = mainChartInstance.ctx;
    let gradient = ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, hexToRgba(data.color, 0.5));
    gradient.addColorStop(1, hexToRgba(data.color, 0.0));
    mainChartInstance.data.datasets[0].backgroundColor = gradient;

    mainChartInstance.update();

    // Update Secondary Chart
    secondaryChartInstance.data.datasets[0].data = data.age;
    secondaryChartInstance.data.datasets[0].backgroundColor = data.color;
    secondaryChartInstance.update();
}

// Utility to convert hex to rgba for gradients
function hexToRgba(hex, alpha) {
    let r = parseInt(hex.slice(1, 3), 16);
    let g = parseInt(hex.slice(3, 5), 16);
    let b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
