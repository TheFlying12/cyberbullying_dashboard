// Cyberbullying Visualization App Logic

document.addEventListener('DOMContentLoaded', () => {
    initTabs();
    initCharts();
    initImpactVisualization();
    initTakeAction();
});

function initTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));

            btn.classList.add('active');
            const targetId = btn.getAttribute('data-tab');
            document.getElementById(targetId).classList.add('active');
        });
    });
}

const chartData = {
    trendLabels: ['2013', '2015', '2017', '2019', '2021', '2023'],
    summaryLabels: ['2013', '2023'],
    electronic: {
        trend: [15, 16, 15, 16, 16, 16],
        summary: [15, 16],
        color: '#38bdf8',
        title: 'Electronically Bullied (CDC YRBS)'
    },
    school: {
        trend: [20, 20, 19, 20, 15, 19],
        summary: [20, 19],
        color: '#f59e0b',
        title: 'Bullied at School (CDC YRBS)'
    }
};

let mainChartInstance = null;
let secondaryChartInstance = null;

function initCharts() {
    const trendCanvas = document.getElementById('trendChart');
    const ageCanvas = document.getElementById('ageChart');
    const metricSelect = document.getElementById('metric-select');

    if (!trendCanvas || !ageCanvas || !metricSelect) return;

    const ctxTrend = trendCanvas.getContext('2d');
    const ctxAge = ageCanvas.getContext('2d');

    Chart.defaults.color = '#94a3b8';
    Chart.defaults.borderColor = 'rgba(255, 255, 255, 0.1)';
    Chart.defaults.font.family = "'Inter', sans-serif";

    renderCharts(ctxTrend, ctxAge, 'electronic');

    metricSelect.addEventListener('change', (e) => {
        updateCharts(e.target.value);
    });
}

function renderCharts(ctxTrend, ctxAge, metricKey) {
    const data = chartData[metricKey];

    const gradientTrend = ctxTrend.createLinearGradient(0, 0, 0, 400);
    gradientTrend.addColorStop(0, hexToRgba(data.color, 0.45));
    gradientTrend.addColorStop(1, hexToRgba(data.color, 0));

    mainChartInstance = new Chart(ctxTrend, {
        type: 'line',
        data: {
            labels: chartData.trendLabels,
            datasets: [{
                label: 'Percent (%)',
                data: data.trend,
                borderColor: data.color,
                backgroundColor: gradientTrend,
                borderWidth: 3,
                tension: 0.35,
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
                    backgroundColor: 'rgba(15, 23, 42, 0.95)',
                    titleColor: '#f1f5f9',
                    bodyColor: '#cbd5e1',
                    borderColor: 'rgba(255,255,255,0.1)',
                    borderWidth: 1
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    suggestedMax: 30,
                    grid: { borderDash: [4, 4] },
                    ticks: { callback: (value) => `${value}%` }
                },
                x: { grid: { display: false } }
            }
        }
    });

    secondaryChartInstance = new Chart(ctxAge, {
        type: 'bar',
        data: {
            labels: chartData.summaryLabels,
            datasets: [{
                label: 'Percent (%)',
                data: data.summary,
                backgroundColor: [hexToRgba(data.color, 0.7), data.color],
                borderRadius: 8
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
                    suggestedMax: 30,
                    ticks: { callback: (value) => `${value}%` },
                    grid: { display: false }
                },
                x: { grid: { display: false } }
            }
        }
    });

    updateChartLabels(metricKey);
}

function updateCharts(metricKey) {
    const data = chartData[metricKey];

    mainChartInstance.data.datasets[0].data = data.trend;
    mainChartInstance.data.datasets[0].borderColor = data.color;
    mainChartInstance.data.datasets[0].pointBorderColor = data.color;

    const gradient = mainChartInstance.ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, hexToRgba(data.color, 0.45));
    gradient.addColorStop(1, hexToRgba(data.color, 0));
    mainChartInstance.data.datasets[0].backgroundColor = gradient;
    mainChartInstance.update();

    secondaryChartInstance.data.datasets[0].data = data.summary;
    secondaryChartInstance.data.datasets[0].backgroundColor = [hexToRgba(data.color, 0.7), data.color];
    secondaryChartInstance.update();

    updateChartLabels(metricKey);
}

function updateChartLabels(metricKey) {
    const trendTitle = document.getElementById('trend-chart-title');
    const ageTitle = document.getElementById('age-chart-title');

    if (trendTitle) {
        trendTitle.textContent = `${chartData[metricKey].title} Trend (2013-2023)`;
    }
    if (ageTitle) {
        ageTitle.textContent = `${chartData[metricKey].title}: 2013 vs 2023`;
    }
}

function initImpactVisualization() {
    const grid = document.getElementById('impact-grid');
    const counterEl = document.getElementById('impact-counter');
    const factEl = document.getElementById('impact-fact-text');

    if (!grid || !counterEl || !factEl) return;

    const totalDots = 30;
    const highlightedDots = 5;
    const facts = [
        'CDC (2023): 16% of U.S. high school students reported being electronically bullied in the past year.',
        'Pew (2022): 46% of U.S. teens say they have experienced at least one form of cyberbullying.',
        'Pew (2022): 53% of teens view online harassment and cyberbullying as a major problem.'
    ];

    for (let i = 0; i < totalDots; i += 1) {
        const dot = document.createElement('div');
        dot.className = 'impact-dot';
        if (i < highlightedDots) dot.classList.add('impacted');
        grid.appendChild(dot);
    }

    let pulseIndex = 0;
    const impactedDotEls = Array.from(grid.querySelectorAll('.impact-dot.impacted'));

    setInterval(() => {
        impactedDotEls.forEach(el => el.classList.remove('pulse'));
        impactedDotEls[pulseIndex].classList.add('pulse');
        pulseIndex = (pulseIndex + 1) % impactedDotEls.length;
    }, 700);

    animateCounter(counterEl, highlightedDots, 900);

    let factIndex = 0;
    factEl.textContent = facts[factIndex];
    setInterval(() => {
        factIndex = (factIndex + 1) % facts.length;
        factEl.classList.remove('show');
        setTimeout(() => {
            factEl.textContent = facts[factIndex];
            factEl.classList.add('show');
        }, 140);
    }, 4500);
    factEl.classList.add('show');
}

function animateCounter(element, targetValue, duration) {
    const start = performance.now();

    function step(now) {
        const progress = Math.min((now - start) / duration, 1);
        const current = Math.floor(progress * targetValue);
        element.textContent = current;
        if (progress < 1) requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
}

function initTakeAction() {
    const lookupBtn = document.getElementById('lookup-btn');
    const zipInput = document.getElementById('zip-input');
    const houseLink = document.getElementById('house-link');
    const lookupStatus = document.getElementById('lookup-status');

    const senderName = document.getElementById('sender-name');
    const senderCity = document.getElementById('sender-city');
    const senderState = document.getElementById('sender-state');
    const policyPriority = document.getElementById('policy-priority');
    const repEmail = document.getElementById('rep-email');
    const templateBox = document.getElementById('email-template');
    const generateTemplateBtn = document.getElementById('generate-template-btn');
    const copyTemplateBtn = document.getElementById('copy-template-btn');
    const openMailtoBtn = document.getElementById('open-mailto-btn');
    const copyStatus = document.getElementById('copy-status');

    if (lookupBtn && zipInput && houseLink && lookupStatus) {
        lookupBtn.addEventListener('click', () => {
            const cleaned = zipInput.value.trim().match(/^\d{5}$/);
            if (!cleaned) {
                lookupStatus.textContent = 'Enter a valid 5-digit ZIP code to build the direct House lookup URL.';
                return;
            }

            const zip = cleaned[0];
            houseLink.href = `https://ziplook.house.gov/htbin/findrep_house?ZIP=${zip}`;
            lookupStatus.textContent = `House lookup link updated for ZIP ${zip}. Open the link below.`;
        });
    }

    if (!templateBox || !generateTemplateBtn || !copyTemplateBtn || !openMailtoBtn || !copyStatus) return;

    const renderTemplate = () => {
        const name = senderName?.value.trim() || '[Your Full Name]';
        const city = senderCity?.value.trim() || '[City]';
        const state = senderState?.value.trim().toUpperCase() || '[State]';
        const ask = policyPriority?.value.trim() || 'fund evidence-based school cyberbullying prevention programs';
        const date = new Date().toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        });

        templateBox.value = `Subject: Protect Children from Cyberbullying\n\n${date}\n\nDear [Representative/Senator Last Name],\n\nMy name is ${name}, and I am a constituent from ${city}, ${state}. I am writing to ask you to prioritize legislation and funding that will ${ask}.\n\nRecent national data shows this issue is urgent. In 2023, 16% of U.S. high school students reported being electronically bullied, and 19% reported being bullied at school (CDC YRBS).\n\nI respectfully ask your office to:\n1. Support dedicated funding for school-based cyberbullying prevention and counseling.\n2. Require clear reporting and response standards so families know incidents are addressed quickly.\n3. Encourage digital safety education that includes bystander intervention and responsible platform use.\n\nPlease let me know what actions you will take on this issue. Thank you for your service to our community.\n\nSincerely,\n${name}\n${city}, ${state}`;
    };

    generateTemplateBtn.addEventListener('click', () => {
        renderTemplate();
        copyStatus.textContent = 'Template refreshed.';
    });

    copyTemplateBtn.addEventListener('click', async () => {
        try {
            await navigator.clipboard.writeText(templateBox.value);
            copyStatus.textContent = 'Template copied to clipboard.';
        } catch (_error) {
            copyStatus.textContent = 'Copy failed. Please select all text and copy manually.';
        }
    });

    openMailtoBtn.addEventListener('click', () => {
        const draft = templateBox.value.trim();
        if (!draft) {
            copyStatus.textContent = 'Generate a template first.';
            return;
        }

        const to = repEmail?.value.trim() || '';
        const lines = draft.split('\n');
        let subject = 'Protect Children from Cyberbullying';
        let body = draft;

        if (lines[0] && lines[0].startsWith('Subject:')) {
            subject = lines[0].replace('Subject:', '').trim() || subject;
            body = lines.slice(2).join('\n').trim();
        }

        const mailtoUrl = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        window.location.href = mailtoUrl;
        copyStatus.textContent = 'Opening your default email app with a prefilled draft.';
    });

    renderTemplate();
}

function hexToRgba(hex, alpha) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
