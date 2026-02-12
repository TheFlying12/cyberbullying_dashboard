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
    const repSearch = document.getElementById('rep-search');
    const chamberFilter = document.getElementById('chamber-filter');
    const stateFilter = document.getElementById('state-filter');
    const refreshDirectoryBtn = document.getElementById('refresh-directory-btn');
    const directoryStatus = document.getElementById('directory-status');
    const directorySummary = document.getElementById('directory-summary');
    const directoryBody = document.getElementById('directory-body');

    const senderName = document.getElementById('sender-name');
    const senderCity = document.getElementById('sender-city');
    const senderState = document.getElementById('sender-state');
    const templateBox = document.getElementById('email-template');
    const generateTemplateBtn = document.getElementById('generate-template-btn');
    const copyTemplateBtn = document.getElementById('copy-template-btn');
    const copyStatus = document.getElementById('copy-status');

    const hasDirectoryElements = repSearch && chamberFilter && stateFilter && refreshDirectoryBtn && directoryStatus && directorySummary && directoryBody;
    if (hasDirectoryElements) {
        let directoryData = [];

        const populateStateFilter = (rows) => {
            const stateOptions = Array.from(new Set(rows.map(row => row.state))).sort();
            stateFilter.innerHTML = '<option value="all">All States</option>';
            stateOptions.forEach(stateCode => {
                const option = document.createElement('option');
                option.value = stateCode;
                option.textContent = stateCode;
                stateFilter.appendChild(option);
            });
        };

        const renderDirectory = (rows) => {
            if (!rows.length) {
                directoryBody.innerHTML = '<tr><td colspan="6">No representatives match the current filters.</td></tr>';
                directorySummary.textContent = 'Showing 0 results.';
                return;
            }

            directoryBody.innerHTML = rows.map(row => {
                const districtValue = row.chamber === 'House' ? row.district : '-';
                return `<tr>
                    <td>${escapeHtml(row.name)}</td>
                    <td>${row.chamber}</td>
                    <td>${row.state}</td>
                    <td>${districtValue}</td>
                    <td>${row.party}</td>
                    <td>${escapeHtml(row.phone)}</td>
                </tr>`;
            }).join('');

            const senateCount = rows.filter(row => row.chamber === 'Senate').length;
            const houseCount = rows.filter(row => row.chamber === 'House').length;
            directorySummary.textContent = `Showing ${rows.length} members (${senateCount} Senate, ${houseCount} House).`;
        };

        const applyFilters = () => {
            const query = repSearch.value.trim().toLowerCase();
            const chamber = chamberFilter.value;
            const state = stateFilter.value;

            const filteredRows = directoryData.filter(row => {
                const queryMatch = query.length === 0
                    || row.name.toLowerCase().includes(query)
                    || row.party.toLowerCase().includes(query);
                const chamberMatch = chamber === 'all' || row.roleType === chamber;
                const stateMatch = state === 'all' || row.state === state;
                return queryMatch && chamberMatch && stateMatch;
            });

            renderDirectory(filteredRows);
        };

        const extractCurrentRole = (member) => {
            const terms = member.terms || [];
            if (!terms.length) return null;
            const currentRole = terms[terms.length - 1];
            if (!currentRole || !['sen', 'rep'].includes(currentRole.type)) return null;

            const districtValue = currentRole.type === 'rep'
                ? (currentRole.district === 0 ? 'At-Large' : currentRole.district || '-')
                : '-';

            return {
                name: member.name?.official_full
                    || [member.name?.first, member.name?.middle, member.name?.last, member.name?.suffix].filter(Boolean).join(' '),
                chamber: currentRole.type === 'sen' ? 'Senate' : 'House',
                roleType: currentRole.type,
                state: currentRole.state || '-',
                district: districtValue,
                party: currentRole.party || 'Unknown',
                phone: currentRole.phone || 'Not listed'
            };
        };

        const loadNationalDirectory = async () => {
            directoryStatus.textContent = 'Loading national congressional roster...';
            directorySummary.textContent = '';
            directoryBody.innerHTML = '<tr><td colspan="6">Loading...</td></tr>';

            try {
                const response = await fetch('https://unitedstates.github.io/congress-legislators/legislators-current.json', { cache: 'no-store' });
                if (!response.ok) {
                    throw new Error(`Directory request failed (${response.status})`);
                }

                const json = await response.json();
                directoryData = json
                    .map(extractCurrentRole)
                    .filter(Boolean)
                    .sort((a, b) => a.state.localeCompare(b.state) || a.chamber.localeCompare(b.chamber) || a.name.localeCompare(b.name));

                populateStateFilter(directoryData);
                applyFilters();
                directoryStatus.textContent = `Loaded ${directoryData.length} members from the national Congress dataset.`;
            } catch (_error) {
                directoryBody.innerHTML = '<tr><td colspan="6">Unable to load live directory data right now.</td></tr>';
                directoryStatus.textContent = 'National directory failed to load. Try Refresh Data in a moment.';
                directorySummary.textContent = '';
            }
        };

        repSearch.addEventListener('input', applyFilters);
        chamberFilter.addEventListener('change', applyFilters);
        stateFilter.addEventListener('change', applyFilters);
        refreshDirectoryBtn.addEventListener('click', loadNationalDirectory);

        loadNationalDirectory();
    }

    if (!templateBox || !generateTemplateBtn || !copyTemplateBtn || !copyStatus) return;

    const renderTemplate = () => {
        const name = senderName?.value.trim() || '[Your Name]';
        const city = senderCity?.value.trim() || '_______';
        const state = senderState?.value.trim().toUpperCase();
        const location = state ? `${city}, ${state}` : city;

        templateBox.value = `My name is ${name} and I live in ${location}.

I hope this letter finds you well. I am writing to urge you to support stronger protections for children and teenagers online, particularly on social media.

The U.S. Surgeon General has warned that social media poses a serious risk to youth mental health. I want children in my community to grow up safe and healthy, without being targeted by addictive platform designs that prioritize profit over well-being. Too many young people are experiencing anxiety, depression, cyberbullying, and sleep disruption as a result of algorithm-driven “infinite scroll” feeds.

For this reason, I urge you to support legislation like the SAFE for Kids Act and related children’s online safety measures, including:

Limiting addictive, algorithm-driven feeds for users under 18 without parental consent

Requiring age verification and parental approval for these features

Restricting late-night notifications between 12:00 a.m. and 6:00 a.m.

Protecting children’s privacy by limiting the collection and use of their personal data

By taking these steps, we can help create a safer digital environment for families and put children’s health and privacy first.

Thank you for your time and consideration. I appreciate your leadership on this important issue.

Sincerely,
${name}`;
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

    renderTemplate();
}

function escapeHtml(value) {
    return String(value)
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#39;');
}

function hexToRgba(hex, alpha) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
