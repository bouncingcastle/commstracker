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
    html{background:var(--bg);}
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
      width:100%;border-collapse:collapse;font-size:13px;background:var(--panel2);color:var(--text);
    }
    .list-table th{
      text-align:left;padding:12px;background:rgba(255,255,255,.04);
      border:1px solid var(--border);font-weight:600;color:var(--muted);
      text-transform:uppercase;font-size:11px;letter-spacing:.5px;
    }
    .list-table td{
      padding:10px 12px;border:1px solid var(--border);
    }
    .list-table td.empty{
      color:var(--muted) !important;
      background:rgba(255,255,255,.03) !important;
      text-align:center;
      padding:24px !important;
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
    .selector-field select{
      flex:1;padding:8px 12px;background:var(--panel2) !important;
      border:1px solid var(--border) !important;border-radius:6px;color:var(--text) !important;
      appearance:none;-webkit-appearance:none;color-scheme:dark;
    }
    .selector-field select option,
    .selector-field select optgroup{
      background:var(--panel2) !important;color:var(--text) !important;
    }
    .selector-field select:focus,
    .selector-field input:focus{
      outline:none;
      border-color:rgba(110,168,255,.6) !important;
      box-shadow:0 0 0 2px rgba(110,168,255,.2);
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

    .ote-container{
      display:grid;grid-template-columns:1fr 1fr;gap:20px;
    }
    .ote-box{
      background:rgba(255,255,255,.04);border:1px solid var(--border);
      border-radius:8px;padding:16px;
    }
    .ote-label{
      font-size:12px;color:var(--muted);text-transform:uppercase;
      margin-bottom:8px;letter-spacing:.3px;
    }
    .ote-value{
      font-size:28px;font-weight:900;color:var(--good);
      font-variant-numeric:tabular-nums;margin:8px 0;
    }
    .ote-description{
      font-size:11px;color:var(--muted);margin-top:12px;
      padding-top:12px;border-top:1px solid rgba(255,255,255,.05);
    }

    .quota-item{
      display:flex;justify-content:space-between;align-items:center;
      padding:12px 0;border-bottom:1px solid rgba(255,255,255,.05);
    }
    .quota-item:last-child{border-bottom:none;}
    .quota-label{font-size:13px;color:var(--text);}
    .quota-amount{font-size:15px;font-weight:700;color:var(--good);font-variant-numeric:tabular-nums;}
    .quota-total{
      padding:12px 0;margin-top:12px;
      border-top:2px solid var(--border);font-weight:700;
      display:flex;justify-content:space-between;
    }

    .tier-item{
      padding:12px;background:rgba(255,255,255,.04);border-radius:6px;
      margin-bottom:8px;display:flex;justify-content:space-between;align-items:center;
    }
    .tier-name{font-size:13px;font-weight:600;color:var(--text);}
    .tier-range{font-size:11px;color:var(--muted);margin-top:4px;}
    .tier-rate{
      font-size:16px;font-weight:700;color:var(--brand);
      font-variant-numeric:tabular-nums;
    }

    .bonus-item{
      padding:12px;background:rgba(255,255,255,.04);border-radius:6px;
      margin-bottom:8px;
    }
    .bonus-header{
      display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;
    }
    .bonus-name{font-size:13px;font-weight:600;color:var(--text);}
    .bonus-amount{
      font-size:15px;font-weight:700;color:var(--good);
      font-variant-numeric:tabular-nums;
    }
    .bonus-trigger{
      font-size:11px;color:var(--muted);line-height:1.5;
    }
    .bonus-badge{
      display:inline-block;font-size:10px;padding:4px 8px;
      border-radius:4px;background:rgba(255,255,255,.08);
      color:var(--muted);margin-right:6px;margin-top:6px;
      text-transform:uppercase;letter-spacing:.2px;
    }
    .bonus-badge.discretionary{background:rgba(255,204,102,.15);color:var(--warn);}
    .bonus-badge.auto{background:rgba(40,209,124,.15);color:var(--good);}

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
      <h1 class="title">Commission Performance</h1>
      <p class="subtitle">Track earned commissions, pending exposure, targets, and pipeline performance.</p>
      <div class="userInfo">
        <span id="userName">Loading user context...</span>
        <span id="periodInfo" style="margin-left:16px;"></span>
      </div>
      <div class="chips" id="roleChips"></div>

      <!-- User Selector -->
      <div class="user-selector" id="userSelector">
        <div class="selector-label">View As</div>
        <div class="selector-field">
          <select id="userSelect">
            <option value="">Select representative...</option>
          </select>
          <select id="yearSelect"></select>
        </div>
      </div>
    </div>

    <!-- Plan Progress Card -->
    <div class="plan-card" id="planCard">
      <div class="loading">Loading plan details...</div>
    </div>

    <!-- KPI Cards -->
    <div class="grid">
      <div class="card metric">
        <div class="metric-label">Total Commissions</div>
        <div class="metric-value" id="totalEarned">$0.00</div>
        <div class="metric-sub" id="earnedPeriod">Selected Year</div>
      </div>

      <div class="card metric">
        <div class="metric-label">Pending Commissions</div>
        <div class="metric-value" id="pendingAmount">$0.00</div>
        <div class="metric-sub" id="pendingCount">0 pending calculations</div>
      </div>

      <div class="card metric">
        <div class="metric-label">Finalized Commissions</div>
        <div class="metric-value" id="paidAmount">$0.00</div>
        <div class="metric-sub" id="paidCount">0 finalized entries</div>
      </div>

      <div class="card metric">
        <div class="metric-label">Open Deals</div>
        <div class="metric-value" id="activeDeals">0</div>
        <div class="metric-sub" id="dealPipeline">Pipeline value</div>
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
          <div class="loading">Loading summary...</div>
        </div>
      </div>

      <div class="big-card">
        <div class="card-title">
          <span class="icon">💼</span>
          Deal Pipeline by Type
        </div>
        <div class="breakdown" id="dealBreakdown">
          <div class="loading">Loading pipeline...</div>
        </div>
    </div>
    </div>

    <!-- Compensation & OTE Section -->
    <div class="big-grid" id="compensationSection" style="display:none;">
      <div class="big-card">
        <div class="card-title">
          <span class="icon">🎯</span>
          Quota Targets by Deal Type
        </div>
        <div class="breakdown" id="quotaTargets">
          <div class="loading">Loading targets...</div>
        </div>
      </div>

      <div class="big-card">
        <div class="card-title">
          <span class="icon">💵</span>
          On-Target Earnings (OTE)
        </div>
        <div id="oteDisplay" style="padding:16px;">
          <div class="loading">Loading earnings model...</div>
        </div>
      </div>
    </div>

    <!-- Commission Tiers & Bonuses -->
    <div class="big-grid" id="bonusSection" style="display:none;">
      <div class="big-card">
        <div class="card-title">
          <span class="icon">📈</span>
          Commission Tier Structure
        </div>
        <div class="breakdown" id="tierDisplay">
          <div class="loading">Loading tiers...</div>
        </div>
      </div>

      <div class="big-card">
        <div class="card-title">
          <span class="icon">🎁</span>
          Active Bonuses
        </div>
        <div class="breakdown" id="bonusDisplay">
          <div class="loading">Loading bonuses...</div>
        </div>
      </div>
    </div>

    <!-- Forecast, Simulation & Estimator -->
    <div class="big-grid" id="forecastSection">
      <div class="big-card">
        <div class="card-title">
          <span class="icon">🔮</span>
          Forecast Simulation
        </div>
        <div class="selector-field" style="margin-bottom:12px;">
          <select id="scenarioSelect">
            <option value="">Live view (no saved scenario)</option>
          </select>
          <input id="winRateMultiplier" type="number" min="0.1" step="0.05" value="1" placeholder="Win-rate multiplier" />
          <input id="pipelineMultiplier" type="number" min="0.1" step="0.05" value="1" placeholder="Pipeline multiplier" />
          <button onclick="applyForecastScenario()">Apply</button>
          <button onclick="saveForecastScenario()">Save</button>
        </div>
        <div class="breakdown" id="forecastSummary">
          <div class="loading">Loading forecast insights...</div>
        </div>
      </div>

      <div class="big-card">
        <div class="card-title">
          <span class="icon">🧮</span>
          Commission Estimator
        </div>
        <div class="selector-field" style="margin-bottom:12px;">
          <input id="estimateAmount" type="number" min="0" step="100" placeholder="Deal amount" />
          <select id="estimateDealType">
            <option value="new_business">New Business</option>
            <option value="renewal">Renewal</option>
            <option value="expansion">Expansion</option>
            <option value="upsell">Upsell</option>
          </select>
          <select id="estimateStage">
            <option value="lead">Lead</option>
            <option value="qualified" selected>Qualified</option>
            <option value="proposal">Proposal</option>
            <option value="negotiation">Negotiation</option>
            <option value="closed_won">Closed Won</option>
          </select>
          <button onclick="runCommissionEstimate()">Estimate</button>
        </div>
        <div class="breakdown" id="estimatorResult">
          <div class="break-item">Run an estimate to view projected payout for a deal scenario.</div>
        </div>
      </div>
    </div>

    <div class="big-card" style="margin-bottom:16px;">
      <div class="card-title">
        <span class="icon">🏁</span>
        Prioritized Opportunities by Projected Commission
      </div>
      <table class="list-table" id="priorityTable">
        <thead>
          <tr>
            <th>Deal</th>
            <th>Type</th>
            <th>Stage</th>
            <th>Amount</th>
            <th>Probability</th>
            <th>Rate</th>
            <th>Expected Commission</th>
          </tr>
        </thead>
        <tbody id="priorityTableBody">
          <tr><td colspan="7" class="empty">Loading prioritized opportunities...</td></tr>
        </tbody>
      </table>
    </div>


    <!-- Recent Calculations -->
    <div class="big-card">
      <div class="card-title">
        <span class="icon">🎯</span>
        Quota Progress by Deal Type
      </div>
      <div class="breakdown" id="quotaProgress">
        <div class="loading">No quota progress available for the selected year</div>
      </div>
    </div>

    <!-- Recent Calculations -->
    <div class="big-card">
      <div class="card-title">
        <span class="icon">📈</span>
        Recent Commission Calculations
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
          <tr><td colspan="7" style="text-align:center;padding:24px;color:var(--muted);">Loading records...</td></tr>
        </tbody>
      </table>
    </div>

    <!-- Active Deals -->
    <div class="big-card" style="margin-top:16px;">
      <div class="card-title">
        <span class="icon">🎯</span>
        Open Deals (Not Won/Lost)
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
          <tr><td colspan="7" style="text-align:center;padding:24px;color:var(--muted);">Loading records...</td></tr>
        </tbody>
      </table>
    </div>
  </div>

  <div class="foot">
    Data reflects commission calculations and deal records.
    Last refreshed: <span id="lastUpdate">now</span>
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
        var viewingYear = new Date().getFullYear();
        var activeScenarioId = '';

        function hasRole(roleName) {
          try {
            if (window.g_user && typeof window.g_user.hasRole === 'function') {
              return !!window.g_user.hasRole(roleName);
            }
            if (window.NOW && NOW.user) {
              var roles = NOW.user.roles || NOW.user.role || '';
              if (Array.isArray(roles)) return roles.indexOf(roleName) !== -1;
              return String(roles).indexOf(roleName) !== -1;
            }
          } catch (e) {
            console.log('Role check error:', e);
          }
          return false;
        }

        function getCurrentUserContext() {
          try {
            if (window.g_user && typeof window.g_user.getID === 'function') {
              return {
                id: window.g_user.getID(),
                name: window.g_user.getFullName ? window.g_user.getFullName() : 'Sales Rep'
              };
            }

            if (window.NOW && NOW.user) {
              return {
                id: NOW.user.userID || NOW.user.userId || NOW.user_id || null,
                name: NOW.user_display_name || NOW.user.name || 'Sales Rep'
              };
            }
          } catch (e) {
            console.log('User context error:', e);
          }
          return { id: null, name: 'Sales Rep' };
        }

        function invokeHelper(methodName, params, callback) {
          var helperNames = [
            'x_823178_commissio.CommissionProgressDataService'
          ];

          function tryIndex(index) {
            if (index >= helperNames.length) {
              callback(null);
              return;
            }

            var ajax = new GlideAjax(helperNames[index]);
            ajax.addParam('sysparm_name', methodName);

            if (params) {
              Object.keys(params).forEach(function(k) {
                ajax.addParam(k, params[k]);
              });
            }

            ajax.getXMLAnswer(function(response) {
              if (response) {
                callback(response);
                return;
              }

              ajax.getXML(function(res) {
                var xmlAnswer = null;
                try {
                  if (res && res.responseXML && res.responseXML.documentElement) {
                    xmlAnswer = res.responseXML.documentElement.getAttribute('answer');
                  }
                } catch (e) {
                  xmlAnswer = null;
                }

                if (!xmlAnswer && index < helperNames.length - 1) {
                  tryIndex(index + 1);
                  return;
                }

                callback(xmlAnswer);
              });
            });
          }

          tryIndex(0);
        }

        function invokeP1Helper(methodName, params, callback) {
          var helperNames = [
            'x_823178_commissio.CommissionProgressDataService'
          ];

          function tryIndex(index) {
            if (index >= helperNames.length) {
              callback(null);
              return;
            }

            var ajax = new GlideAjax(helperNames[index]);
            ajax.addParam('sysparm_name', methodName);

            if (params) {
              Object.keys(params).forEach(function(k) {
                ajax.addParam(k, params[k]);
              });
            }

            ajax.getXMLAnswer(function(response) {
              if (response) {
                callback(response);
                return;
              }

              ajax.getXML(function(res) {
                var xmlAnswer = null;
                try {
                  if (res && res.responseXML && res.responseXML.documentElement) {
                    xmlAnswer = res.responseXML.documentElement.getAttribute('answer');
                  }
                } catch (e) {
                  xmlAnswer = null;
                }

                if (!xmlAnswer && index < helperNames.length - 1) {
                  tryIndex(index + 1);
                  return;
                }

                callback(xmlAnswer);
              });
            });
          }

          tryIndex(0);
        }

        // Role chips
        var chips = document.getElementById('roleChips');
        var canSelectUsers = false;
        if (chips) {
          var roles = [];
          if (hasRole('x_823178_commissio.admin') || hasRole('admin')) {
            roles.push('Admin');
            canSelectUsers = true;
          }
          if (hasRole('x_823178_commissio.finance')) {
            roles.push('Finance');
          }
          if (hasRole('x_823178_commissio.rep')) roles.push('Rep');
          if (roles.length === 0) roles.push('User');

          for (var i = 0; i < roles.length; i++) {
            var s = document.createElement('span');
            s.className = 'chip';
            s.textContent = roles[i];
            chips.appendChild(s);
          }
        }

        // Show user selector
        var selector = document.getElementById('userSelector');
        if (selector) selector.classList.add('visible');

        // Set user name
        var userCtx = getCurrentUserContext();
        currentUserId = userCtx.id;
        viewingUserId = currentUserId;
        var userEl = document.getElementById('userName');
        if (userEl) {
          userEl.textContent = 'Representative: ' + (userCtx.name || 'Sales Rep');
        }

        function resolveViewerAccess(callback) {
          invokeHelper('getViewerAccess', {}, function(response) {
            if (!response) {
              if (callback) callback();
              return;
            }

            try {
              var payload = typeof response === 'string' ? JSON.parse(response) : response;
              if (payload && payload.status === 'success' && payload.data) {
                canSelectUsers = !!payload.data.can_select_users;
                if (chips && payload.data.roles && payload.data.roles.admin) {
                  var hasAdminChip = false;
                  var chipNodes = chips.querySelectorAll('.chip');
                  for (var i = 0; i < chipNodes.length; i++) {
                    if ((chipNodes[i].textContent || '').toLowerCase() === 'admin') {
                      hasAdminChip = true;
                      break;
                    }
                  }
                  if (!hasAdminChip) {
                    var adminChip = document.createElement('span');
                    adminChip.className = 'chip';
                    adminChip.textContent = 'Admin';
                    chips.insertBefore(adminChip, chips.firstChild);
                  }
                }
              }
            } catch (e) {
              console.log('Viewer access parse error:', e);
            }

            if (callback) callback();
          });
        }

        function updatePeriodInfo(year, isYtd) {
          var periodEl = document.getElementById('periodInfo');
          if (!periodEl) return;

          var targetYear = parseInt(year, 10) || new Date().getFullYear();
          if (isYtd) {
            var now = new Date();
            periodEl.textContent = 'Year-to-date (' + targetYear + '): Jan 1 - ' + (now.getMonth() + 1) + '/' + now.getDate() + '/' + now.getFullYear();
          } else {
            periodEl.textContent = 'Year view: ' + targetYear;
          }
        }

        function initYearOptions(years, defaultYear) {
          var yearSelect = document.getElementById('yearSelect');
          if (!yearSelect) return;

          var currentYear = new Date().getFullYear();
          var options = (years && years.length) ? years : [currentYear + 2, currentYear + 1, currentYear, currentYear - 1, currentYear - 2];
          viewingYear = parseInt(defaultYear, 10) || viewingYear;
          yearSelect.innerHTML = '';

          for (var i = 0; i < options.length; i++) {
            var year = parseInt(options[i], 10);
            if (isNaN(year)) continue;
            var option = document.createElement('option');
            option.value = String(year);
            option.textContent = String(year);
            if (year === viewingYear) option.selected = true;
            yearSelect.appendChild(option);
          }

          yearSelect.disabled = false;
        }

        function initializeYearContext(callback) {
          var currentYear = new Date().getFullYear();
          invokeHelper('getYearContext', {
            sysparm_year: String(viewingYear),
            sysparm_year_window: '2'
          }, function(response) {
            if (!response) {
              initYearOptions(null, currentYear);
              updatePeriodInfo(viewingYear, viewingYear === currentYear);
              if (callback) callback();
              return;
            }

            try {
              var payload = typeof response === 'string' ? JSON.parse(response) : response;
              if (payload && payload.status === 'success' && payload.data) {
                initYearOptions(payload.data.years, payload.data.default_year);
              } else {
                initYearOptions(null, currentYear);
              }
            } catch (e) {
              initYearOptions(null, currentYear);
            }

            updatePeriodInfo(viewingYear, viewingYear === currentYear);
            if (callback) callback();
          });
        }

        function loadUserOptions() {
          var select = document.getElementById('userSelect');
          if (!select) return;

          function ensureCurrentUserOption() {
            if (!currentUserId) return;
            var exists = false;
            for (var i = 0; i < select.options.length; i++) {
              if (select.options[i].value === currentUserId) {
                select.selectedIndex = i;
                exists = true;
                break;
              }
            }
            if (!exists) {
              var option = document.createElement('option');
              option.value = currentUserId;
              option.textContent = (userCtx && userCtx.name) ? userCtx.name + ' (You)' : 'Current User';
              option.selected = true;
              select.appendChild(option);
            }
          }

          if (!canSelectUsers) {
            select.innerHTML = '<option value="">Select representative...</option>';
            ensureCurrentUserOption();
            select.disabled = true;
            return;
          }

          select.disabled = false;

          invokeHelper('listUsersWithData', {
            sysparm_year: String(viewingYear)
          }, function(response) {
            if (!response) {
              select.innerHTML = '<option value="">No representatives with plans</option>';
              select.disabled = true;
              return;
            }

            try {
              var payload = typeof response === 'string' ? JSON.parse(response) : response;
              if (!payload || payload.status !== 'success' || !payload.data || !payload.data.length) {
                select.innerHTML = '<option value="">No representatives with plans</option>';
                select.disabled = true;
                return;
              }

              select.innerHTML = '<option value="">Select representative...</option>';
              payload.data.forEach(function(item) {
                if (!item || !item.user_id) return;
                var option = document.createElement('option');
                option.value = item.user_id;
                option.textContent = item.user_name || item.user_id;
                if (currentUserId && currentUserId === item.user_id) option.selected = true;
                select.appendChild(option);
              });
            } catch (e) {
              console.log('User options parse error:', e);
              select.innerHTML = '<option value="">No representatives with plans</option>';
              select.disabled = true;
            }
          });
        }

        function applySelectedUserAndYear() {
          var select = document.getElementById('userSelect');
          var yearSelect = document.getElementById('yearSelect');
          if (!select) {
            return;
          }

          if (!select.value && currentUserId) {
            select.value = currentUserId;
          }

          if (!select.value) {
            if (currentUserId) {
              select.value = currentUserId;
            } else {
              return;
            }
          }

          viewingYear = parseInt(yearSelect && yearSelect.value ? yearSelect.value : viewingYear, 10) || viewingYear;

          var selectedName = select.options[select.selectedIndex] ? select.options[select.selectedIndex].text : 'Selected User';
          viewingUserId = select.value;
          loadRepProgress(viewingUserId, selectedName, viewingYear);
        }

        function bindSelectorAutoApply() {
          var select = document.getElementById('userSelect');
          var yearSelect = document.getElementById('yearSelect');
          if (select) {
            select.addEventListener('change', function() {
              if (!select.value && currentUserId) {
                select.value = currentUserId;
              }
              applySelectedUserAndYear();
            });
          }

          if (yearSelect) {
            yearSelect.addEventListener('change', function() {
              applySelectedUserAndYear();
            });
          }
        }

        function loadInitialData() {
          if (!viewingUserId) {
            invokeHelper('getCurrentUser', {}, function(response) {
              if (!response) {
                showGlobalLoadError('Unable to resolve current user context. Please refresh or contact admin.');
                return;
              }

              try {
                var payload = typeof response === 'string' ? JSON.parse(response) : response;
                if (payload && payload.status === 'success' && payload.data && payload.data.user_id) {
                  currentUserId = payload.data.user_id;
                  viewingUserId = payload.data.user_id;
                  if (userEl) {
                    userEl.textContent = 'Representative: ' + (payload.data.user_name || userCtx.name || 'Sales Rep');
                  }
                  loadRepProgress(viewingUserId, null, viewingYear);
                } else {
                  showGlobalLoadError('Unable to resolve current user context.');
                }
              } catch (e) {
                showGlobalLoadError('Unable to resolve current user context.');
              }
            });
          } else {
            loadRepProgress(viewingUserId, null, viewingYear);
          }
        }

        resolveViewerAccess(function() {
          bindSelectorAutoApply();
          loadUserOptions();
          initializeYearContext(function() {
            loadUserOptions();
            loadInitialData();
          });
        });

        function loadRepProgress(userId, displayName, reportYear) {
          if (!userId) return;

          var targetYear = parseInt(reportYear, 10) || new Date().getFullYear();
          viewingYear = targetYear;

          invokeHelper('getRepProgress', {
            sysparm_user_id: userId,
            sysparm_year: String(targetYear)
          }, function(response) {
            if (response) {
              try {
                var data = typeof response === 'string' ? JSON.parse(response) : response;
                if (data && data.status === 'success' && data.data) {
                  // Update header if viewing different user
                  if (displayName && userId !== currentUserId) {
                    var userEl = document.getElementById('userName');
                    if (userEl) {
                      userEl.textContent = 'Viewing representative: ' + displayName;
                    }
                  }

                  var responseYear = parseInt(data.data.report_year, 10) || targetYear;
                  updatePeriodInfo(responseYear, responseYear === new Date().getFullYear());

                  updatePlanCard(data.data);
                  updateMetrics(data.data);
                  loadForecastAndPriorities(userId, responseYear);
                  updateCalculationsTable(data.data.recent_calculations || []);
                  updateDealsTable(data.data.active_deals || []);
                } else {
                  console.error('Invalid response format', data);
                  showGlobalLoadError((data && data.message) ? data.message : 'Error loading commission progress data.');
                }
              } catch (e) {
                console.error('Error parsing response:', e);
                showGlobalLoadError('Error parsing response: ' + e.message);
              }
            } else {
              console.error('No response from server');
              showGlobalLoadError('Commission data service did not return a response.');
            }
          });
        }

        function showGlobalLoadError(message) {
          var msg = message || 'Commission performance data is currently unavailable.';

          var planCard = document.getElementById('planCard');
          if (planCard) {
            planCard.innerHTML = '<div class="empty"><div class="empty-icon">⚠️</div>' + msg + '</div>';
          }

          var metricIds = ['totalEarned', 'pendingAmount', 'paidAmount', 'activeDeals'];
          for (var i = 0; i < metricIds.length; i++) {
            var metricEl = document.getElementById(metricIds[i]);
            if (metricEl) metricEl.textContent = '—';
          }

          var pendingCount = document.getElementById('pendingCount');
          if (pendingCount) pendingCount.textContent = 'Data unavailable';

          var paidCount = document.getElementById('paidCount');
          if (paidCount) paidCount.textContent = 'Data unavailable';

          var dealPipeline = document.getElementById('dealPipeline');
          if (dealPipeline) dealPipeline.textContent = 'Data unavailable';

          var breakdown = document.getElementById('commissionBreakdown');
          if (breakdown) breakdown.innerHTML = '<div class="break-item">Commission summary is unavailable</div>';

          var dealBreakdown = document.getElementById('dealBreakdown');
          if (dealBreakdown) dealBreakdown.innerHTML = '<div class="break-item">Pipeline summary is unavailable</div>';

          var quotaProgress = document.getElementById('quotaProgress');
          if (quotaProgress) quotaProgress.innerHTML = '<div class="break-item">Quota progress is unavailable</div>';

          var calcBody = document.getElementById('calcTableBody');
          if (calcBody) {
            calcBody.innerHTML = '<tr><td colspan="7" class="empty">Commission calculation records are unavailable</td></tr>';
          }

          var dealsBody = document.getElementById('dealsTableBody');
          if (dealsBody) {
            dealsBody.innerHTML = '<tr><td colspan="7" class="empty">Deal records are unavailable</td></tr>';
          }

          var priorityBody = document.getElementById('priorityTableBody');
          if (priorityBody) {
            priorityBody.innerHTML = '<tr><td colspan="7" class="empty">Prioritized opportunities are unavailable</td></tr>';
          }

          var lastUpEl = document.getElementById('lastUpdate');
          if (lastUpEl) lastUpEl.textContent = 'Error';
        }

        function updatePlanCard(data) {
          var planCard = document.getElementById('planCard');
          if (!planCard) return;

          if (!data.active_plan) {
            planCard.innerHTML = '<div class="empty"><div class="empty-icon">📋</div>No commission plan is assigned for the selected year</div>';
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
          var earnedPeriod = document.getElementById('earnedPeriod');
          if (earnedPeriod) {
            earnedPeriod.textContent = (data.report_year || viewingYear || new Date().getFullYear()) + ' performance';
          }

          // Pending Commissions
          var pending = parseFloat(data.pending_amount || 0);
          var pendingCount = data.pending_count || 0;
          document.getElementById('pendingAmount').textContent = '$' + pending.toFixed(2);
          document.getElementById('pendingCount').textContent = pendingCount + ' pending calculation' + (pendingCount !== 1 ? 's' : '');

          // Locked & Paid
          var paid = parseFloat(data.paid_amount || 0);
          var paidCount = data.paid_count || 0;
          document.getElementById('paidAmount').textContent = '$' + paid.toFixed(2);
          document.getElementById('paidCount').textContent = paidCount + ' finalized entries';

          // Active Deals
          var activeCount = data.active_deals_count || 0;
          var pipelineValue = parseFloat(data.pipeline_value || 0);
          document.getElementById('activeDeals').textContent = activeCount;
          document.getElementById('dealPipeline').textContent = '$' + pipelineValue.toFixed(2) + ' pipeline amount';

          // Commission breakdown
          var breakdown = document.getElementById('commissionBreakdown');
          breakdown.innerHTML = '';
          if (data.breakdown) {
            Object.keys(data.breakdown).forEach(function(key) {
              var val = data.breakdown[key];
              var item = document.createElement('div');
              item.className = 'break-item';
              item.innerHTML = '<span class="break-label">' + formatDealTypeLabel(key) + '</span>' +
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
              item.innerHTML = '<span class="break-label">' + formatDealTypeLabel(key) + '</span>' +
                '<span class="break-value">$' + parseFloat(val).toFixed(2) + '</span>';
              dealBd.appendChild(item);
            });
          }

          // Update compensation sections if data available
          if (data.active_plan && data.active_plan.targets && Object.keys(data.active_plan.targets).length > 0) {
            document.getElementById('compensationSection').style.display = '';
            updateQuotaTargets(data.active_plan);
            updateOTE(data.active_plan);
          }

          if (data.active_plan && data.active_plan.tiers && data.active_plan.tiers.length > 0) {
            document.getElementById('bonusSection').style.display = '';
            updateTiers(data.active_plan.tiers);
            updateBonuses(data.active_plan.bonuses || []);
          }

          // Update quota progress tracker
          if (data.quota_progress && Object.keys(data.quota_progress).length > 0) {
            updateQuotaProgress(data.quota_progress);
          }

          // Update timestamp
          var lastUpEl = document.getElementById('lastUpdate');
          if (lastUpEl) {
            var now = new Date();
            lastUpEl.textContent = now.toLocaleTimeString();
          }
        }

        function updateQuotaProgress(quotaProgress) {
          var container = document.getElementById('quotaProgress');
          container.innerHTML = '';

          if (!quotaProgress || Object.keys(quotaProgress).length === 0) {
            container.innerHTML = '<div class="break-item">No quota progress is available for this year</div>';
            return;
          }

          Object.keys(quotaProgress).forEach(function(dealType) {
            var progress = quotaProgress[dealType];
            var target = parseFloat(progress.target_amount || 0);
            var achieved = parseFloat(progress.achieved_amount || 0);
            var attainment = parseFloat(progress.attainment_percent || 0);
            var remaining = parseFloat(progress.remaining_amount || 0);

            var item = document.createElement('div');
            item.className = 'progress-item';
            item.style.cssText = 'padding:16px;border:1px solid rgba(255,255,255,.05);border-radius:8px;margin-bottom:12px;';
            
            var statusColor = attainment >= 100 ? 'var(--good)' : attainment >= 80 ? 'var(--brand)' : 'var(--warn)';
            var statusEmoji = attainment >= 100 ? '✅' : attainment >= 80 ? '📈' : '⏳';

            item.innerHTML = 
              '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">' +
                '<div style="font-weight:600;color:var(--text);">' + statusEmoji + ' ' + capitalizeFirst(dealType.replace(/_/g, ' ')) + '</div>' +
                '<div style="font-size:14px;font-weight:700;color:' + statusColor + ';font-variant-numeric:tabular-nums;">' + attainment.toFixed(1) + '%</div>' +
              '</div>' +
              '<div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:12px;font-size:12px;">' +
                '<div>' +
                  '<div style="color:var(--muted);margin-bottom:4px;">Target</div>' +
                  '<div style="font-size:16px;font-weight:700;color:var(--text);font-variant-numeric:tabular-nums;">$' + target.toFixed(0) + '</div>' +
                '</div>' +
                '<div>' +
                  '<div style="color:var(--muted);margin-bottom:4px;">Achieved</div>' +
                  '<div style="font-size:16px;font-weight:700;color:var(--good);font-variant-numeric:tabular-nums;">$' + achieved.toFixed(0) + '</div>' +
                '</div>' +
              '</div>' +
              '<div style="width:100%;height:8px;background:rgba(255,255,255,.06);border-radius:4px;overflow:hidden;">' +
                '<div style="height:100%;background:linear-gradient(90deg,' + 
                  (attainment >= 100 ? 'var(--good)' : 'var(--brand)') + 
                  ',var(--good));width:' + Math.min(attainment, 100) + '%;border-radius:4px;transition:width 300ms ease;"></div>' +
              '</div>' +
              '<div style="margin-top:12px;font-size:12px;color:var(--muted);">' +
                '<strong>$' + remaining.toFixed(0) + '</strong> remaining' +
              '</div>';
            
            container.appendChild(item);
          });
        }

        function updateQuotaTargets(plan) {
          var container = document.getElementById('quotaTargets');
          container.innerHTML = '';
          
          if (!plan.targets || Object.keys(plan.targets).length === 0) {
            container.innerHTML = '<div class="break-item">No quota targets are configured for this plan</div>';
            return;
          }

          var total = 0;
          Object.keys(plan.targets).forEach(function(dealType) {
            var amount = plan.targets[dealType];
            total += amount;
            var item = document.createElement('div');
            item.className = 'quota-item';
            item.innerHTML = 
              '<span class="quota-label">' + capitalizeFirst(dealType.replace(/_/g, ' ')) + '</span>' +
              '<span class="quota-amount">$' + parseFloat(amount).toFixed(0) + '</span>';
            container.appendChild(item);
          });

          // Add total
          var totalItem = document.createElement('div');
          totalItem.className = 'quota-total';
          totalItem.innerHTML = 
            '<span>Total Quota</span>' +
            '<span class="quota-amount">$' + parseFloat(total).toFixed(0) + '</span>';
          container.appendChild(totalItem);
        }

        function updateOTE(plan) {
          var container = document.getElementById('oteDisplay');
          
          var ote100 = parseFloat(plan.ote_at_100_percent || 0);
          var oteWithBonus = parseFloat(plan.ote_with_bonuses || 0);
          var bonusAmount = oteWithBonus - ote100;

          container.innerHTML = 
            '<div class="ote-container">' +
              '<div class="ote-box">' +
                '<div class="ote-label">At 100% Quota</div>' +
                '<div class="ote-value">$' + ote100.toFixed(0) + '</div>' +
                '<div class="ote-description">Base commission at full quota attainment</div>' +
              '</div>' +
              '<div class="ote-box">' +
                '<div class="ote-label">With Bonuses</div>' +
                '<div class="ote-value" style="color:var(--warn);">$' + oteWithBonus.toFixed(0) + '</div>' +
                '<div class="ote-description">OTE + ' + (bonusAmount > 0 ? '$' + bonusAmount.toFixed(0) : '$0') + ' in potential bonuses</div>' +
              '</div>' +
            '</div>';
        }

        function updateTiers(tiers) {
          var container = document.getElementById('tierDisplay');
          container.innerHTML = '';

          if (!tiers || tiers.length === 0) {
            container.innerHTML = '<div class="break-item">No commission tiers are configured for this plan</div>';
            return;
          }

          tiers.forEach(function(tier) {
            var rate = parseFloat(tier.rate_percent || 0);
            var floor = parseFloat(tier.floor_percent || 0);
            var ceiling = null;
            
            // Find ceiling (next tier's floor)
            for (var i = 0; i < tiers.length; i++) {
              var t = tiers[i];
              var tf = parseFloat(t.floor_percent || 0);
              if (tf > floor && (ceiling === null || tf < ceiling)) {
                ceiling = tf;
              }
            }

            var rangeStr = floor + '% - ' + (ceiling !== null ? ceiling + '%' : '∞');

            var item = document.createElement('div');
            item.className = 'tier-item';
            item.innerHTML = 
              '<div>' +
                '<div class="tier-name">' + (tier.tier_name || 'Tier') + '</div>' +
                '<div class="tier-range">' + rangeStr + ' of quota</div>' +
              '</div>' +
              '<div class="tier-rate">' + rate.toFixed(1) + '%</div>';
            container.appendChild(item);
          });
        }

        function updateBonuses(bonuses) {
          var container = document.getElementById('bonusDisplay');
          container.innerHTML = '';

          if (!bonuses || bonuses.length === 0) {
            container.innerHTML = '<div class="break-item">No active bonuses are configured for this plan</div>';
            return;
          }

          bonuses.forEach(function(bonus) {
            var amount = parseFloat(bonus.amount || 0);
            var isDiscretionary = bonus.is_discretionary;
            var dealType = bonus.deal_type || 'Any deal type';

            var item = document.createElement('div');
            item.className = 'bonus-item';
            item.innerHTML = 
              '<div class="bonus-header">' +
                '<span class="bonus-name">' + (bonus.name || 'Bonus') + '</span>' +
                '<span class="bonus-amount">$' + amount.toFixed(0) + '</span>' +
              '</div>' +
              '<div class="bonus-trigger">' + (bonus.trigger || 'N/A') + '</div>' +
              '<div style="margin-top:8px;">' +
                '<span class="bonus-badge ' + (isDiscretionary ? 'discretionary' : 'auto') + '">' + 
                  (isDiscretionary ? 'Discretionary' : 'Auto-Earned') + 
                '</span>' +
                '<span class="bonus-badge">' + capitalizeFirst(dealType.replace(/_/g, ' ')) + '</span>' +
              '</div>';
            container.appendChild(item);
          });
        }

        function loadForecastAndPriorities(userId, reportYear) {
          var winMultiplier = parseFloat((document.getElementById('winRateMultiplier') || {}).value || '1') || 1;
          var pipelineMultiplier = parseFloat((document.getElementById('pipelineMultiplier') || {}).value || '1') || 1;

          invokeP1Helper('getForecastAndPriorities', {
            sysparm_user_id: userId,
            sysparm_year: String(reportYear),
            sysparm_scenario_id: activeScenarioId,
            sysparm_win_rate_multiplier: String(winMultiplier),
            sysparm_pipeline_multiplier: String(pipelineMultiplier)
          }, function(response) {
            if (!response) {
              renderForecastError('Forecast service did not return data.');
              return;
            }

            try {
              var payload = typeof response === 'string' ? JSON.parse(response) : response;
              if (!payload || payload.status !== 'success' || !payload.data) {
                renderForecastError(payload && payload.message ? payload.message : 'Unable to compute forecast.');
                return;
              }

              renderForecastSummary(payload.data.summary || {});
              renderPrioritizedDeals(payload.data.prioritized_deals || []);
              renderScenarioOptions(payload.data.scenarios || [], payload.data.summary || {});
            } catch (e) {
              renderForecastError('Unable to parse forecast response.');
            }
          });
        }

        function renderForecastError(message) {
          var summary = document.getElementById('forecastSummary');
          if (summary) {
            summary.innerHTML = '<div class="break-item">' + (message || 'Forecast unavailable') + '</div>';
          }

          var tbody = document.getElementById('priorityTableBody');
          if (tbody) {
            tbody.innerHTML = '<tr><td colspan="7" class="empty">No prioritized opportunities available.</td></tr>';
          }
        }

        function renderForecastSummary(summary) {
          var container = document.getElementById('forecastSummary');
          if (!container) return;

          var scenarioName = summary.active_scenario_name ? summary.active_scenario_name : 'Live view';
          container.innerHTML = '';

          var rows = [
            { label: 'Scenario', value: scenarioName },
            { label: 'Expected Revenue', value: '$' + (parseFloat(summary.expected_revenue || 0)).toFixed(2) },
            { label: 'Expected Commission', value: '$' + (parseFloat(summary.expected_commission || 0)).toFixed(2) },
            { label: 'Projected Attainment', value: (parseFloat(summary.projected_attainment_percent || 0)).toFixed(1) + '%' },
            { label: 'Won Revenue YTD', value: '$' + (parseFloat(summary.won_revenue_ytd || 0)).toFixed(2) },
            { label: 'Total Quota', value: '$' + (parseFloat(summary.total_quota || 0)).toFixed(2) }
          ];

          rows.forEach(function(row) {
            var item = document.createElement('div');
            item.className = 'break-item';
            item.innerHTML = '<span class="break-label">' + row.label + '</span><span class="break-value">' + row.value + '</span>';
            container.appendChild(item);
          });
        }

        function renderPrioritizedDeals(deals) {
          var tbody = document.getElementById('priorityTableBody');
          if (!tbody) return;

          tbody.innerHTML = '';
          if (!deals || deals.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7" class="empty">No open opportunities available for prioritization.</td></tr>';
            return;
          }

          deals.forEach(function(deal) {
            var row = document.createElement('tr');
            row.innerHTML =
              '<td>' + (deal.deal_name || '–') + '</td>' +
              '<td>' + formatDealTypeLabel(deal.deal_type || 'other') + '</td>' +
              '<td>' + (deal.stage || '–') + '</td>' +
              '<td>$' + (parseFloat(deal.amount || 0)).toFixed(2) + '</td>' +
              '<td>' + ((parseFloat(deal.probability || 0) * 100).toFixed(1)) + '%</td>' +
              '<td>' + (parseFloat(deal.commission_rate || 0)).toFixed(2) + '%</td>' +
              '<td><strong>$' + (parseFloat(deal.expected_commission || 0)).toFixed(2) + '</strong></td>';
            tbody.appendChild(row);
          });
        }

        function renderScenarioOptions(scenarios, summary) {
          var select = document.getElementById('scenarioSelect');
          if (!select) return;

          var selected = (summary && summary.active_scenario_id) ? summary.active_scenario_id : activeScenarioId;
          select.innerHTML = '<option value="">Live view (no saved scenario)</option>';

          (scenarios || []).forEach(function(s) {
            var option = document.createElement('option');
            option.value = s.scenario_id;
            option.textContent = (s.scenario_name || 'Scenario') + ' (' + (parseFloat(s.projected_attainment_percent || 0)).toFixed(1) + '%)';
            if (selected && selected === s.scenario_id) {
              option.selected = true;
              activeScenarioId = selected;
            }
            select.appendChild(option);
          });

          var winInput = document.getElementById('winRateMultiplier');
          var pipelineInput = document.getElementById('pipelineMultiplier');
          if (winInput && summary && summary.win_rate_multiplier) {
            winInput.value = String(parseFloat(summary.win_rate_multiplier).toFixed(2));
          }
          if (pipelineInput && summary && summary.pipeline_multiplier) {
            pipelineInput.value = String(parseFloat(summary.pipeline_multiplier).toFixed(2));
          }
        }

        window.applyForecastScenario = function() {
          var select = document.getElementById('scenarioSelect');
          activeScenarioId = (select && select.value) ? select.value : '';
          loadForecastAndPriorities(viewingUserId || currentUserId, viewingYear);
        };

        window.saveForecastScenario = function() {
          var scenarioName = window.prompt('Scenario name');
          if (!scenarioName) return;

          var winMultiplier = parseFloat((document.getElementById('winRateMultiplier') || {}).value || '1') || 1;
          var pipelineMultiplier = parseFloat((document.getElementById('pipelineMultiplier') || {}).value || '1') || 1;

          invokeP1Helper('saveForecastScenario', {
            sysparm_user_id: viewingUserId || currentUserId,
            sysparm_year: String(viewingYear),
            sysparm_scenario_name: scenarioName,
            sysparm_win_rate_multiplier: String(winMultiplier),
            sysparm_pipeline_multiplier: String(pipelineMultiplier)
          }, function(response) {
            if (!response) {
              alert('Scenario save failed.');
              return;
            }

            try {
              var payload = typeof response === 'string' ? JSON.parse(response) : response;
              if (payload && payload.status === 'success' && payload.data && payload.data.scenario_id) {
                activeScenarioId = payload.data.scenario_id;
                loadForecastAndPriorities(viewingUserId || currentUserId, viewingYear);
                return;
              }
              alert(payload && payload.message ? payload.message : 'Scenario save failed.');
            } catch (e) {
              alert('Scenario save failed.');
            }
          });
        };

        window.runCommissionEstimate = function() {
          var amount = parseFloat((document.getElementById('estimateAmount') || {}).value || '0');
          var dealType = (document.getElementById('estimateDealType') || {}).value || 'new_business';
          var stage = (document.getElementById('estimateStage') || {}).value || 'qualified';

          if (!amount || amount <= 0) {
            alert('Enter an amount greater than 0.');
            return;
          }

          invokeP1Helper('estimateCommission', {
            sysparm_user_id: viewingUserId || currentUserId,
            sysparm_year: String(viewingYear),
            sysparm_amount: String(amount),
            sysparm_deal_type: dealType,
            sysparm_stage: stage,
            sysparm_scenario_id: activeScenarioId
          }, function(response) {
            var container = document.getElementById('estimatorResult');
            if (!container) return;

            if (!response) {
              container.innerHTML = '<div class="break-item">Estimator service did not return data.</div>';
              return;
            }

            try {
              var payload = typeof response === 'string' ? JSON.parse(response) : response;
              if (!payload || payload.status !== 'success' || !payload.data) {
                container.innerHTML = '<div class="break-item">' + (payload && payload.message ? payload.message : 'Unable to estimate commission.') + '</div>';
                return;
              }

              var data = payload.data;
              container.innerHTML = '';
              var rows = [
                { label: 'Adjusted Amount', value: '$' + (parseFloat(data.adjusted_amount || 0)).toFixed(2) },
                { label: 'Commission Rate', value: (parseFloat(data.commission_rate_percent || 0)).toFixed(2) + '%' },
                { label: 'Stage Probability', value: ((parseFloat(data.probability || 0) * 100).toFixed(1)) + '%' },
                { label: 'Expected Commission', value: '$' + (parseFloat(data.expected_commission || 0)).toFixed(2) },
                { label: 'Scenario', value: data.scenario_name || 'Live view' }
              ];

              rows.forEach(function(row) {
                var item = document.createElement('div');
                item.className = 'break-item';
                item.innerHTML = '<span class="break-label">' + row.label + '</span><span class="break-value">' + row.value + '</span>';
                container.appendChild(item);
              });
            } catch (e) {
              container.innerHTML = '<div class="break-item">Unable to parse estimator response.</div>';
            }
          });
        };

        function capitalizeFirst(str) {
          return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
        }

        function formatDealTypeLabel(raw) {
          if (!raw) return 'Other';
          var key = String(raw).toLowerCase();
          if (key === 'new_business') return 'New Business';
          if (key === 'renewal') return 'Renewal';
          if (key === 'expansion') return 'Expansion';
          if (key === 'upsell') return 'Upsell';
          return capitalizeFirst(key.replace(/_/g, ' '));
        }

        function updateCalculationsTable(calcs) {
          var tbody = document.getElementById('calcTableBody');
          tbody.innerHTML = '';
          if (calcs.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7" class="empty">No commission calculations are available for the selected year.</td></tr>';
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
            tbody.innerHTML = '<tr><td colspan="7" class="empty">No open deals are available for the selected year.</td></tr>';
            return;
          }
          deals.forEach(function(deal) {
            var row = document.createElement('tr');
            row.innerHTML = 
              '<td>' + (deal.deal_name || '–') + '</td>' +
              '<td>' + (deal.account_name || '–') + '</td>' +
              '<td>$' + (parseFloat(deal.amount) || 0).toFixed(2) + '</td>' +
              '<td>' + formatDealTypeLabel(deal.deal_type || 'other') + '</td>' +
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
