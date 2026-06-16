/**
 * Retail Sales Performance Analysis
 * Frontend Chart.js implementation script
 */

document.addEventListener("DOMContentLoaded", () => {
    // Read the encoded JSON payload from the HTML Data Island
    const dataIsland = document.getElementById("results-data-island");
    if (!dataIsland) return;

    let payload;
    try {
        payload = JSON.parse(dataIsland.textContent);
    } catch (e) {
        console.error("Failed to parse data island payload", e);
        return;
    }

    const { monthly_trend, category_data, region_data, top_products, segment_data } = payload;

    // --- CHART 1: MONTHLY SALES TREND (LINE CHART) ---
    const checkTrendCtx = document.getElementById("monthlyTrendChart");
    if (checkTrendCtx) {
        new Chart(checkTrendCtx, {
            type: 'line',
            data: {
                labels: monthly_trend.labels,
                datasets: [
                    {
                        label: 'Gross Sales total',
                        data: monthly_trend.sales,
                        borderColor: '#2563eb',
                        backgroundColor: 'rgba(37, 99, 235, 0.05)',
                        borderWidth: 2.5,
                        tension: 0.15,
                        fill: true
                    },
                    {
                        label: 'Net Profit margin',
                        data: monthly_trend.profit,
                        borderColor: '#10b981',
                        backgroundColor: 'transparent',
                        borderWidth: 2.5,
                        tension: 0.15
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { position: 'top', labels: { boxWidth: 12, font: { size: 11 } } }
                },
                scales: {
                    x: { grid: { display: false } },
                    y: { grid: { color: '#f1f5f9' }, ticks: { callback: value => '₹' + value } }
                }
            }
        });
    }

    // --- CHART 2: REVENUE vs PROFIT BY CATEGORY (COMBI-BAR CHART) ---
    const checkCatCtx = document.getElementById("categoryChart");
    if (checkCatCtx) {
        new Chart(checkCatCtx, {
            type: 'bar',
            data: {
                labels: category_data.labels,
                datasets: [
                    {
                        label: 'Gross Sales',
                        data: category_data.sales,
                        backgroundColor: 'rgba(124, 58, 237, 0.85)',
                        borderRadius: 4
                    },
                    {
                        label: 'Net Profit',
                        data: category_data.profit,
                        backgroundColor: 'rgba(16, 185, 129, 0.85)',
                        borderRadius: 4
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { position: 'top', labels: { boxWidth: 12, font: { size: 11 } } }
                },
                scales: {
                    x: { grid: { display: false } },
                    y: { grid: { color: '#f1f5f9' }, ticks: { callback: value => '₹' + value } }
                }
            }
        });
    }

    // --- CHART 3: PERFORMANCE BY REGION (BAR CHART) ---
    const checkRegionCtx = document.getElementById("regionChart");
    if (checkRegionCtx) {
        new Chart(checkRegionCtx, {
            type: 'bar',
            data: {
                labels: region_data.labels,
                datasets: [
                    {
                        label: 'Revenue Sales',
                        data: region_data.sales,
                        backgroundColor: 'rgba(59, 130, 246, 0.85)',
                        borderRadius: 4
                    },
                    {
                        label: 'Profit Return',
                        data: region_data.profit,
                        backgroundColor: 'rgba(6, 182, 212, 0.85)',
                        borderRadius: 4
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { position: 'top', labels: { boxWidth: 12, font: { size: 11 } } }
                },
                scales: {
                    x: { grid: { display: false } },
                    y: { grid: { color: '#f1f5f9' }, ticks: { callback: value => '₹' + value } }
                }
            }
        });
    }

    // --- CHART 4: SEGMENTATION DONUT (PIE CHART) ---
    const checkSegmentCtx = document.getElementById("segmentChart");
    if (checkSegmentCtx) {
        new Chart(checkSegmentCtx, {
            type: 'doughnut',
            data: {
                labels: segment_data.labels,
                datasets: [{
                    data: segment_data.values,
                    backgroundColor: [
                        '#4f46e5',
                        '#8b5cf6',
                        '#06b6d4',
                        '#22c55e',
                        '#f59e0b'
                    ],
                    borderWidth: 2,
                    hoverOffset: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { position: 'right', labels: { boxWidth: 10, font: { size: 10 } } }
                }
            }
        });
    }

    // --- CHART 5: TOP 10 INVENTORY ITEMS (HORIZONTAL BAR CHART) ---
    const checkProdCtx = document.getElementById("productsBillboardChart");
    if (checkProdCtx) {
        new Chart(checkProdCtx, {
            type: 'bar',
            data: {
                labels: top_products.labels,
                datasets: [{
                    label: 'Sales Revenue',
                    data: top_products.values,
                    backgroundColor: '#f59e0b',
                    borderRadius: 4
                }]
            },
            options: {
                indexAxis: 'y',
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    x: { grid: { color: '#f1f5f9' }, ticks: { callback: value => '₹' + value } },
                    y: { grid: { display: false }, ticks: { font: { size: 9 } } }
                }
            }
        });
    }
});
