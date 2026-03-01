import '@servicenow/sdk/global'
import { UiPage } from '@servicenow/sdk/core'

UiPage({
  $id: Now.ID['commission_progress_page'],
  endpoint: 'x_823178_commissio_progress.do',
  description: 'Sales Rep Commission Progress - Personal Earnings & Pipeline',
  category: 'general',
  html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>My Commission Progress</title>
  <style>
    :root{
      --bg:#0b1020;
      --panel:#101a33;
      --panel2:#0f1830;
      --border:rgba(255,255,255,.10);
      --text:#e9eefc;
      --muted:rgba(233,238,252,.70);
      --brand:#6ea8ff;
      --good:#28d17c;
      --warn:#ffcc66;
      --bad:#ff6b6b;
      --shadow:0 4px 12px rgba(0,0,0,.3);
      --radius:8px;
    }
    *{margin:0;padding:0;box-sizing:border-box}
    body{
      background:var(--bg);color:var(--text);font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;
      font-size:14px;line-height:1.6;min-height:100vh;display:flex;flex-direction:column;
    }
    .container{
      max-width:1400px;margin:0 auto;padding:24px;width:100%;flex:1;
    }
    .header{
      margin-bottom:32px;
      border-bottom:1px solid var(--border);padding-bottom:24px;
    }
    .title{
      font-size:32px;font-weight:900;letter-spacing:.2px;margin:0 0 8px 0;
    }
    .subtitle{
      color:var(--muted);font-size:15px;
    }
    .userInfo{
      font-size:13px;color:var(--muted);margin-top:8px;
    }
    .chips{display:flex;gap:8px;flex-wrap:wrap;margin-top:12px;}
    .chip{
      font-size:11px;padding:6px 10px;border-radius:999px;
      border:1px solid var(--border);background:rgba(255,255,255,.06);
      color:var(--muted);font-weight:500;
    }

    .grid{
      display:grid;
      grid-template-columns:repeat(auto-fit,minmax(280px,1fr));
      gap:16px;margin-bottom:24px;
    }
    .card{
      background:linear-gradient(180deg, rgba(255,255,255,.07), rgba(255,255,255,.04));
      border:1px solid var(--border);
      border-radius:var(--radius);
      padding:20px;overflow:hidden;position:relative;
    }
    .card.metric{
      grid-column:span 1;
    }
    .metric-value{
      font-size:36px;font-weight:900;margin:12px 0 4px;
      font-variant-numeric:tabular-nums;
    }
    .metric-label{
      font-size:13px;color:var(--muted);font-weight:500;
      text-transform:uppercase;letter-spacing:.5px;
    }
    .metric-sub{
      font-size:12px;color:var(--muted);margin-top:8px;padding-top:8px;border-top:1px solid var(--border);
    }

    .progress-bar{
      width:100%;height:8px;background:rgba(255,255,255,.06);
      border-radius:4px;overflow:hidden;margin-top:8px;
    }
    .progress-fill{
      height:100%;background:linear-gradient(90deg, var(--brand), var(--good));
      border-radius:4px;transition:width 300ms ease;
    }
    .progress-label{
      display:flex;justify-content:space-between;font-size:11px;color:var(--muted);margin-top:6px;
    }

    .big-grid{
      display:grid;
      grid-template-columns:repeat(auto-fit,minmax(600px,1fr));
      gap:16px;margin-bottom:24px;
    }
    .big-card{
      background:linear-gradient(180deg, rgba(255,255,255,.07), rgba(255,255,255,.04));
      border:1px solid var(--border);
      border-radius:var(--radius);
      padding:24px;
    }
    .card-title{
      font-size:16px;font-weight:700;margin-bottom:16px;
      display:flex;align-items:center;gap:8px;
    }
    .icon{font-size:18px;}

    .breakdown{
      display:flex;flex-direction:column;gap:12px;
    }
    .break-item{
      display:flex;justify-content:space-between;align-items:center;padding:8px 0;
      border-bottom:1px solid var(--border);
    }
    .break-label{font-size:13px;color:var(--muted);}
    .break-value{font-size:16px;font-weight:700;font-variant-numeric:tabular-nums;}
    .break-value.good{color:var(--good);}
    .break-value.warn{color:var(--warn);}
    .break-value.bad{color:var(--bad);}

    .list-table{
      width:100%;border-collapse:collapse;font-size:13px;
    }
    .list-table th{
      text-align:left;padding:12px;background:rgba(255,255,255,.04);
      border:1px solid var(--border);font-weight:600;color:var(--muted);
      text-transform:uppercase;font-size:11px;letter-spacing:.5px;
    }
    .list-table td{
      padding:10px 12px;border:1px solid var(--border);
    }
    .list-table tr:hover{background:rgba(255,255,255,.03);}

    .status-badge{
      display:inline-block;padding:4px 8px;border-radius:4px;font-size:11px;
      font-weight:600;text-transform:uppercase;letter-spacing:.3px;
    }
    .status-paid{background:rgba(40,209,124,.15);color:var(--good);}
    .status-locked{background:rgba(255,204,102,.15);color:var(--warn);}
    .status-draft{background:rgba(110,168,255,.15);color:var(--brand);}

    .empty{
      text-align:center;padding:32px 16px;color:var(--muted);
    }
    .empty-icon{font-size:48px;margin-bottom:12px;}

    .loading{
      text-align:center;padding:24px;color:var(--muted);
    }

    .user-selector{
      display:none;margin-bottom:16px;padding:16px;background:rgba(255,255,255,.04);
      border:1px solid var(--border);border-radius:var(--radius);
    }
    .user-selector.visible{
      display:block;
    }
    .selector-label{
      font-size:12px;font-weight:600;text-transform:uppercase;
      color:var(--muted);margin-bottom:8px;letter-spacing:.5px;
    }
    .selector-field{
      display:flex;gap:8px;
    }
    .selector-field input{
      flex:1;padding:8px 12px;background:rgba(255,255,255,.08);
      border:1px solid var(--border);border-radius:6px;color:var(--text);
    }
    .selector-field button{
      padding:8px 16px;background:var(--brand);color:var(--bg);
      border:0;border-radius:6px;font-weight:600;cursor:pointer;
      transition:background 200ms ease;
    }
    .selector-field button:hover{
      background:rgba(110,168,255,.8);
    }

    .plan-card{
      background:linear-gradient(135deg, rgba(110,168,255,.15), rgba(40,209,124,.08));
      border:1px solid var(--border);border-radius:var(--radius);
      padding:24px;margin-bottom:24px;
    }
    .plan-header{
      display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:20px;
    }
    .plan-title{
      font-size:18px;font-weight:700;
    }
    .plan-year{
      font-size:12px;color:var(--muted);background:rgba(255,255,255,.06);
      padding:4px 8px;border-radius:4px;
    }
    .plan-rows{
      display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:16px;margin-bottom:20px;
    }
    .plan-item{
      display:flex;flex-direction:column;
    }
    .plan-item-label{
      font-size:11px;color:var(--muted);text-transform:uppercase;
      margin-bottom:4px;letter-spacing:.3px;
    }
    .plan-item-value{
      font-size:20px;font-weight:700;font-variant-numeric:tabular-nums;
    }
    .plan-progress{
      background:rgba(255,255,255,.06);padding:16px;border-radius:8px;
    }
    .plan-progress-label{
      font-size:12px;color:var(--muted);margin-bottom:12px;
      display:flex;justify-content:space-between;
    }
    .plan-progress-bar{
      width:100%;height:12px;background:rgba(255,255,255,.04);
      border-radius:6px;overflow:hidden;margin-bottom:8px;
    }
    .plan-progress-fill{
      height:100%;background:linear-gradient(90deg, var(--brand), var(--good));
      border-radius:6px;transition:width 300ms ease;
    }
    .plan-progress-percentage{
      font-size:13px;color:var(--good);font-weight:600;text-align:right;
    }

    .foot{
      padding:16px 24px;text-align:center;color:var(--muted);font-size:12px;
      border-top:1px solid var(--border);background:rgba(0,0,0,.2);
    }

    @media (max-width:1024px){
      .grid{
        grid-template-columns:repeat(auto-fit,minmax(200px,1fr));
      }
      .big-grid{
        grid-template-columns:1fr;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <!-- Admin User Selector -->
      <div class="user-selector" id="userSelector">
        <div class="selector-label">👤 View User Progress (Admin Only)</div>
        <div class="selector-field">
          <input type="text" id="userSearchInput" placeholder="Enter user name or ID..." />
          <button onclick="searchAndSelectUser()">Load User</button>
          <button onclick="resetToCurrentUser()" style="background:var(--warn);color:var(--bg);">Reset to Me</button>
        </div>
      </div>

      <h1 class="title">My Commission Progress</h1>
      <p class="subtitle">Track your earnings, pending amounts, and deal pipeline</p>
      <div class="userInfo">
        <span id="userName">Loading...</span>
        <span id="periodInfo" style="margin-left:16px;"></span>
      </div>
      <div class="chips" id="roleChips"></div>
    </div>

    <!-- Plan Progress Card -->
    <div class="plan-card" id="planCard">
      <div class="loading">Loading plan data...</div>
    </div>

    <!-- KPI Cards -->
    <div class="grid">
      <div class="card metric">
        <div class="metric-label">💰 Total Earned</div>
        <div class="metric-value" id="totalEarned">$0.00</div>
        <div class="metric-sub" id="earnedPeriod">Current Year</div>
      </div>

      <div class="card metric">
        <div class="metric-label">⏳ Pending Commissions</div>
        <div class="metric-value" id="pendingAmount">$0.00</div>
        <div class="metric-sub" id="pendingCount">0 draft calculations</div>
      </div>

      <div class="card metric">
        <div class="metric-label">✅ Locked & Paid</div>
        <div class="metric-value" id="paidAmount">$0.00</div>
        <div class="metric-sub" id="paidCount">0 locked/paid</div>
      </div>

      <div class="card metric">
        <div class="metric-label">🚀 Active Deals</div>
        <div class="metric-value" id="activeDeals">0</div>
        <div class="metric-sub" id="dealPipeline">Total pipeline value</div>
      </div>
    </div>

    <!-- Commission Breakdown & Pipeline -->
    <div class="big-grid">
      <div class="big-card">
        <div class="card-title">
          <span class="icon">📊</span>
          Commission Summary
        </div>
        <div class="breakdown" id="commissionBreakdown">
          <div class="loading">Loading data...</div>
        </div>
      </div>

      <div class="big-card">
        <div class="card-title">
          <span class="icon">💼</span>
          Deal Pipeline by Type
        </div>
        <div class="breakdown" id="dealBreakdown">
          <div class="loading">Loading data...</div>
        </div>
      </div>
    </div>

    <!-- Recent Calculations -->
    <div class="big-card">
      <div class="card-title">
        <span class="icon">📈</span>
        Recent Commission Calculations (Last 10)
      </div>
      <table class="list-table" id="calculationsTable">
        <thead>
          <tr>
            <th>Deal</th>
            <th>Type</th>
            <th>Base Amount</th>
            <th>Rate</th>
            <th>Commission</th>
            <th>Payment Date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody id="calcTableBody">
          <tr><td colspan="7" style="text-align:center;padding:24px;color:var(--muted);">Loading...</td></tr>
        </tbody>
      </table>
    </div>

    <!-- Active Deals -->
    <div class="big-card" style="margin-top:16px;">
      <div class="card-title">
        <span class="icon">🎯</span>
        Your Active Deals (Not Won/Lost)
      </div>
      <table class="list-table" id="dealsTable">
        <thead>
          <tr>
            <th>Deal Name</th>
            <th>Account</th>
            <th>Amount</th>
            <th>Type</th>
            <th>Stage</th>
            <th>Close Date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody id="dealsTableBody">
          <tr><td colspan="7" style="text-align:center;padding:24px;color:var(--muted);">Loading...</td></tr>
        </tbody>
      </table>
    </div>
  </div>

  <div class="foot">
    Data updates in real-time from commission calculations and deal records.
    Last updated: <span id="lastUpdate">now</span>
  </div>
</body>
</html>
  `,
  clientScript: `
    (function () {
      try {
        console.log('Commission progress page loaded');

        var currentUserId = null;
        var viewingUserId = null;

        // Role chips and admin selector
        var chips = document.getElementById('roleChips');
        var isAdmin = false;
        if (chips && window.g_user && typeof window.g_user.hasRole === 'function') {
          var roles = [];
          if (g_user.hasRole('x_823178_commissio.admin')) {
            roles.push('Admin');
            isAdmin = true;
          }
          if (g_user.hasRole('x_823178_commissio.finance')) roles.push('Finance');
          if (g_user.hasRole('x_823178_commissio.rep')) roles.push('Rep');
          if (roles.length === 0) roles.push('User');

          for (var i = 0; i < roles.length; i++) {
            var s = document.createElement('span');
            s.className = 'chip';
            s.textContent = roles[i];
            chips.appendChild(s);
          }
        }

        // Show admin user selector
        if (isAdmin) {
          var selector = document.getElementById('userSelector');
          if (selector) selector.classList.add('visible');
        }

        // Set user name
        if (window.g_user) {
          currentUserId = window.g_user.getID();
          viewingUserId = currentUserId;
          var userEl = document.getElementById('userName');
          if (userEl) {
            userEl.textContent = 'Welcome, ' + (window.g_user.getFullName ? window.g_user.getFullName() : 'Sales Rep') + '!';
          }
        }

        // Set current year period
        var now = new Date();
        var periodEl = document.getElementById('periodInfo');
        if (periodEl) {
          periodEl.textContent = 'Year-to-Date: Jan 1 - ' + (now.getMonth() + 1) + '/' + now.getDate() + '/' + now.getFullYear();
        }

        // Admin user search
        window.searchAndSelectUser = function() {
          var input = document.getElementById('userSearchInput');
          var searchTerm = input ? input.value.trim() : '';
          if (!searchTerm) {
            alert('Please enter a user name or ID');
            return;
          }
          
          var ajax = new GlideAjax('CommissionProgressHelper');
          ajax.addParam('sysparm_name', 'searchUsers');
          ajax.addParam('search_term', searchTerm);
          ajax.getXMLAnswer(function(response) {
            if (response && response.status === 'success' && response.data.user_id) {
              viewingUserId = response.data.user_id;
              loadRepProgress(viewingUserId, response.data.user_name);
            } else {
              alert('User not found');
            }
          });
        };

        // Reset to current user
        window.resetToCurrentUser = function() {
          viewingUserId = currentUserId;
          if (window.g_user) {
            loadRepProgress(currentUserId, window.g_user.getFullName ? window.g_user.getFullName() : 'You');
          }
        };

        // Load initial data
        loadRepProgress(viewingUserId, null);

        function loadRepProgress(userId, displayName) {
          if (!userId) return;

          var ajax = new GlideAjax('CommissionProgressHelper');
          ajax.addParam('sysparm_name', 'getRepProgress');
          ajax.addParam('user_id', userId);
          ajax.getXMLAnswer(function(response) {
            if (response && response.status === 'success') {
              var data = response.data;
              
              // Update header if viewing different user
              if (displayName && userId !== currentUserId) {
                var userEl = document.getElementById('userName');
                if (userEl) {
                  userEl.textContent = 'Viewing: ' + displayName;
                }
              }

              updatePlanCard(data);
              updateMetrics(data);
              updateCalculationsTable(data.recent_calculations || []);
              updateDealsTable(data.active_deals || []);
            } else {
              console.error('Failed to load progress data', response);
            }
          });
        }

        function updatePlanCard(data) {
          var planCard = document.getElementById('planCard');
          if (!planCard) return;

          if (!data.active_plan) {
            planCard.innerHTML = '<div class="empty"><div class="empty-icon">📋</div>No active commission plan assigned</div>';
            return;
          }

          var plan = data.active_plan;
          var planYear = plan.plan_year || new Date().getFullYear();
          var targetAmount = parseFloat(plan.plan_target_amount || 0);
          var earnedAmount = parseFloat(data.total_earned || 0);
          var progressPercent = targetAmount > 0 ? Math.min((earnedAmount / targetAmount) * 100, 100) : 0;
          var remainingAmount = Math.max(targetAmount - earnedAmount, 0);

          planCard.innerHTML = 
            '<div class="plan-header">' +
              '<div class="plan-title">📈 ' + (plan.plan_name || 'Active Plan') + '</div>' +
              '<div class="plan-year">' + planYear + '</div>' +
            '</div>' +
            '<div class="plan-rows">' +
              '<div class="plan-item">' +
                '<div class="plan-item-label">Plan Target</div>' +
                '<div class="plan-item-value">$' + targetAmount.toFixed(2) + '</div>' +
              '</div>' +
              '<div class="plan-item">' +
                '<div class="plan-item-label">Earned to Date</div>' +
                '<div class="plan-item-value good">$' + earnedAmount.toFixed(2) + '</div>' +
              '</div>' +
              '<div class="plan-item">' +
                '<div class="plan-item-label">Remaining</div>' +
                '<div class="plan-item-value ' + (remainingAmount > 0 ? 'warn' : 'good') + '">$' + remainingAmount.toFixed(2) + '</div>' +
              '</div>' +
            '</div>' +
            '<div class="plan-progress">' +
              '<div class="plan-progress-label">' +
                '<span>Progress</span>' +
                '<span class="plan-progress-percentage">' + progressPercent.toFixed(1) + '%</span>' +
              '</div>' +
              '<div class="plan-progress-bar">' +
                '<div class="plan-progress-fill" style="width:' + progressPercent + '%;"></div>' +
              '</div>' +
            '</div>';
        }

        function updateMetrics(data) {
          // Total Earned
          var earned = parseFloat(data.total_earned || 0);
          document.getElementById('totalEarned').textContent = '$' + earned.toFixed(2);

          // Pending Commissions
          var pending = parseFloat(data.pending_amount || 0);
          var pendingCount = data.pending_count || 0;
          document.getElementById('pendingAmount').textContent = '$' + pending.toFixed(2);
          document.getElementById('pendingCount').textContent = pendingCount + ' draft calculation' + (pendingCount !== 1 ? 's' : '');

          // Locked & Paid
          var paid = parseFloat(data.paid_amount || 0);
          var paidCount = data.paid_count || 0;
          document.getElementById('paidAmount').textContent = '$' + paid.toFixed(2);
          document.getElementById('paidCount').textContent = paidCount + ' locked/paid';

          // Active Deals
          var activeCount = data.active_deals_count || 0;
          var pipelineValue = parseFloat(data.pipeline_value || 0);
          document.getElementById('activeDeals').textContent = activeCount;
          document.getElementById('dealPipeline').textContent = '$' + pipelineValue.toFixed(2) + ' pipeline';

          // Commission breakdown
          var breakdown = document.getElementById('commissionBreakdown');
          breakdown.innerHTML = '';
          if (data.breakdown) {
            Object.keys(data.breakdown).forEach(function(key) {
              var val = data.breakdown[key];
              var item = document.createElement('div');
              item.className = 'break-item';
              item.innerHTML = '<span class="break-label">' + key + '</span>' +
                '<span class="break-value">$' + parseFloat(val).toFixed(2) + '</span>';
              breakdown.appendChild(item);
            });
          }

          // Deal breakdown
          var dealBd = document.getElementById('dealBreakdown');
          dealBd.innerHTML = '';
          if (data.deal_breakdown) {
            Object.keys(data.deal_breakdown).forEach(function(key) {
              var val = data.deal_breakdown[key];
              var item = document.createElement('div');
              item.className = 'break-item';
              item.innerHTML = '<span class="break-label">' + key + '</span>' +
                '<span class="break-value">$' + parseFloat(val).toFixed(2) + '</span>';
              dealBd.appendChild(item);
            });
          }

          // Update timestamp
          var lastUpEl = document.getElementById('lastUpdate');
          if (lastUpEl) {
            var now = new Date();
            lastUpEl.textContent = now.toLocaleTimeString();
          }
        }

        function updateCalculationsTable(calcs) {
          var tbody = document.getElementById('calcTableBody');
          tbody.innerHTML = '';
          if (calcs.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7" class="empty">No commission calculations yet. Active deals and payments will generate calculations.</td></tr>';
            return;
          }
          calcs.forEach(function(calc) {
            var row = document.createElement('tr');
            var statusClass = 'status-' + (calc.status || 'draft');
            row.innerHTML = 
              '<td>' + (calc.deal_name || '–') + '</td>' +
              '<td>' + (calc.deal_type || '–') + '</td>' +
              '<td>$' + (parseFloat(calc.commission_base_amount) || 0).toFixed(2) + '</td>' +
              '<td>' + (parseFloat(calc.commission_rate) || 0).toFixed(2) + '%</td>' +
              '<td><strong>$' + (parseFloat(calc.commission_amount) || 0).toFixed(2) + '</strong></td>' +
              '<td>' + (calc.payment_date || '–') + '</td>' +
              '<td><span class="status-badge ' + statusClass + '">' + (calc.status || 'draft') + '</span></td>';
            tbody.appendChild(row);
          });
        }

        function updateDealsTable(deals) {
          var tbody = document.getElementById('dealsTableBody');
          tbody.innerHTML = '';
          if (deals.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7" class="empty">No active deals. Once you have open deals, they\'ll appear here.</td></tr>';
            return;
          }
          deals.forEach(function(deal) {
            var row = document.createElement('tr');
            row.innerHTML = 
              '<td>' + (deal.deal_name || '–') + '</td>' +
              '<td>' + (deal.account_name || '–') + '</td>' +
              '<td>$' + (parseFloat(deal.amount) || 0).toFixed(2) + '</td>' +
              '<td>' + (deal.deal_type || '–') + '</td>' +
              '<td>' + (deal.stage || '–') + '</td>' +
              '<td>' + (deal.close_date || '–') + '</td>' +
              '<td><span class="status-badge status-draft">' + deal.stage + '</span></td>';
            tbody.appendChild(row);
          });
        }

      } catch (e) {
        console.error('Commission progress error:', e);
      }
    })();
  `,
  serverScript: `
    var processor = this;

    // This is a placeholder. We'll implement CommissionProgressHelper as a Script Include
    // that handles the AJAX calls and returns the metrics data.
  `
})
