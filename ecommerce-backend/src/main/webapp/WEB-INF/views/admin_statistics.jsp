<%@ page contentType="text/html;charset=UTF-8" %>
<!DOCTYPE html>
<html>
<head>
    <title>📈 Admin Statistics | E-Commerce</title>

    <!-- Bootstrap -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet"/>

    <!-- Chart.js CDN -->
    <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"></script>

    <style>
        body {
            background: linear-gradient(180deg,#f6f9fc,#eef6fb 60%);
            font-family: 'Segoe UI', Roboto, Arial, sans-serif;
            color: #222;
        }
        .wrap { max-width: 1100px; margin: 48px auto; }
        h2 { text-align:center; color:#0d6efd; margin-bottom: 28px; font-weight:700; }
        .stat-card { border-radius:12px; padding:18px; }
        .stat-number { font-size:1.6rem; font-weight:700; }
        .card-ghost { background: white; box-shadow: 0 6px 18px rgba(12,40,80,0.06); border: 1px solid rgba(20,40,80,0.04); }
        .charts-row { margin-top:18px; gap:18px; }
        .chart-box { background:white; padding:18px; border-radius:12px; box-shadow: 0 6px 18px rgba(12,40,80,0.05); }
        .small-meta { color:#666; font-size:0.9rem; }
        .back-btn { margin-top:18px; }
        footer { text-align:center; color:#777; margin-top:28px; font-size:0.9rem; }
    </style>
</head>
<body>
<div class="wrap">

    <h2>📊 Admin — Statistics (Dummy / Demo)</h2>

    <!-- Top stat tiles -->
    <div class="row gy-3">
        <div class="col-md-4">
            <div class="stat-card card-ghost stat-card text-center">
                <div class="small-meta">Total Users</div>
                <div class="stat-number text-primary" id="stat-users">0</div>
                <div class="small-meta">Active in last 30 days</div>
            </div>
        </div>

        <div class="col-md-4">
            <div class="stat-card card-ghost stat-card text-center">
                <div class="small-meta">Total Orders</div>
                <div class="stat-number text-success" id="stat-orders">0</div>
                <div class="small-meta">Completed + Pending</div>
            </div>
        </div>

        <div class="col-md-4">
            <div class="stat-card card-ghost stat-card text-center">
                <div class="small-meta">Total Revenue</div>
                <div class="stat-number text-warning" id="stat-revenue">₹0</div>
                <div class="small-meta">Last 30 days (demo)</div>
            </div>
        </div>
    </div>

    <!-- Charts -->
    <div class="row charts-row mt-4">
        <div class="col-lg-7">
            <div class="chart-box">
                <div class="d-flex justify-content-between align-items-center mb-2">
                    <strong>Sales Trend (Last 12 weeks)</strong>
                    <span class="small-meta">Orders & Revenue</span>
                </div>
                <canvas id="salesLine" height="160"></canvas>
            </div>
        </div>

        <div class="col-lg-5">
            <div class="chart-box">
                <div class="d-flex justify-content-between align-items-center mb-2">
                    <strong>Top Categories</strong>
                    <span class="small-meta">Share of orders</span>
                </div>
                <canvas id="catPie" height="160"></canvas>
                <div class="mt-3 small-meta">Categories (demo): Electronics, Clothing, Home, Grocery, Others</div>
            </div>
        </div>
    </div>

    <!-- Mini metrics row -->
    <div class="row mt-4 gy-3">
        <div class="col-md-3">
            <div class="chart-box text-center">
                <div class="small-meta">Avg Order Value</div>
                <div class="stat-number" id="stat-aov">₹0</div>
            </div>
        </div>
        <div class="col-md-3">
            <div class="chart-box text-center">
                <div class="small-meta">New Customers</div>
                <div class="stat-number" id="stat-newcust">0</div>
            </div>
        </div>
        <div class="col-md-3">
            <div class="chart-box text-center">
                <div class="small-meta">Conversion Rate</div>
                <div class="stat-number" id="stat-cr">0%</div>
            </div>
        </div>
        <div class="col-md-3">
            <div class="chart-box text-center">
                <div class="small-meta">Pending Orders</div>
                <div class="stat-number text-danger" id="stat-pending">0</div>
            </div>
        </div>
    </div>

    <div class="text-center back-btn">
        <a class="btn btn-outline-primary" href="${pageContext.request.contextPath}/admin/dashboard">← Back to Dashboard</a>
    </div>

    <footer>
        © 2025 E-Commerce Admin Panel — Dummy statistics for demo/presentation
    </footer>
</div>

<script>
    // ---------- DUMMY DATA ----------
    const demo = {
        users: 342,
        orders: 128,
        revenue: 183450,
        aov: 1434,
        newCustomers: 46,
        conversion: 2.9,
        pending: 8,
        // weekly sales (12 weeks)
        weeks: ['W-11','W-10','W-9','W-8','W-7','W-6','W-5','W-4','W-3','W-2','W-1','This'],
        ordersSeries: [6,9,12,10,14,11,16,18,20,22,24,28],
        revenueSeries: [4200,6300,8400,7000,9800,7700,11200,12600,14000,15400,16800,19600],
        categoryShare: {
            labels: ['Electronics','Clothing','Home','Grocery','Others'],
            values: [32,24,18,16,10]
        }
    };

    // populate stat numbers with small animations
    function animateNumber(id, endVal, prefix = '', suffix = '', duration = 900) {
        const el = document.getElementById(id);
        if (!el) return;
        const start = 0;
        const range = endVal - start;
        let startTime = null;
        function step(timestamp) {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            const value = Math.floor(start + (range * progress));
            el.textContent = prefix + value.toLocaleString() + suffix;
            if (progress < 1) window.requestAnimationFrame(step);
        }
        window.requestAnimationFrame(step);
    }

    // set stat tiles
    animateNumber('stat-users', demo.users);
    animateNumber('stat-orders', demo.orders);
    animateNumber('stat-revenue', demo.revenue, '₹');
    animateNumber('stat-aov', demo.aov, '₹');
    animateNumber('stat-newcust', demo.newCustomers);
    animateNumber('stat-cr', Math.round(demo.conversion * 10)/10, '', '%');
    animateNumber('stat-pending', demo.pending);

    // ---------- Sales Line Chart (Orders + Revenue) ----------
    const salesCtx = document.getElementById('salesLine').getContext('2d');

    const salesChart = new Chart(salesCtx, {
        type: 'line',
        data: {
            labels: demo.weeks,
            datasets: [
                {
                    label: 'Orders',
                    data: demo.ordersSeries,
                    yAxisID: 'y',
                    tension: 0.35,
                    borderWidth: 2,
                    pointRadius: 3,
                    fill: false,
                },
                {
                    label: 'Revenue (₹)',
                    data: demo.revenueSeries,
                    yAxisID: 'y1',
                    type: 'bar',
                    backgroundColor: 'rgba(13,110,253,0.12)',
                    borderColor: 'rgba(13,110,253,0.3)',
                }
            ]
        },
        options: {
            responsive: true,
            interaction: { mode: 'index', intersect: false },
            plugins: {
                legend: { position: 'top' },
                tooltip: { enabled: true }
            },
            scales: {
                y: {
                    type: 'linear',
                    position: 'left',
                    beginAtZero: true,
                    grid: { drawOnChartArea: false },
                    title: { display: true, text: 'Orders' }
                },
                y1: {
                    type: 'linear',
                    position: 'right',
                    beginAtZero: true,
                    grid: { drawOnChartArea: false },
                    title: { display: true, text: 'Revenue (₹)' },
                    ticks: { callback: function(value){ return '₹' + value.toLocaleString(); } }
                }
            },
            animation: { duration: 900 }
        }
    });

    // ---------- Category Pie Chart ----------
    const pieCtx = document.getElementById('catPie').getContext('2d');
    const catChart = new Chart(pieCtx, {
        type: 'doughnut',
        data: {
            labels: demo.categoryShare.labels,
            datasets: [{
                data: demo.categoryShare.values,
                backgroundColor: [
                    'rgba(13,110,253,0.85)',
                    'rgba(25,135,84,0.85)',
                    'rgba(255,193,7,0.85)',
                    'rgba(108,117,125,0.85)',
                    'rgba(255,99,132,0.85)'
                ],
                hoverOffset: 6
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { position: 'bottom' }
            },
            animation: { animateRotate: true, duration: 900 }
        }
    });

</script>
</body>
</html>