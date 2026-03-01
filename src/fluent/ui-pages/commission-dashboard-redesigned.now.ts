import '@servicenow/sdk/global'
import { UiPage } from '@servicenow/sdk/core'

UiPage({
  $id: Now.ID['commission_dashboard_page'],
  endpoint: 'x_823178_commissio_dashboard.do',
  description: 'Commission Management Dashboard - Operational',
  category: 'general',
  html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Commission Management</title>
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
      color:var(--muted);font-size:15px;max-width:70ch;
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
    .toolbar{
      margin-top:12px;display:flex;align-items:center;gap:8px;flex-wrap:wrap;
    }
    .toolbar-label{
      font-size:11px;color:var(--muted);text-transform:uppercase;letter-spacing:.3px;font-weight:600;
    }
    .toolbar select{
      background:var(--panel2) !important;color:var(--text) !important;border:1px solid var(--border) !important;
      border-radius:6px;padding:6px 10px;font-size:12px;
      appearance:none;-webkit-appearance:none;color-scheme:dark;
      opacity:1 !important;
      pointer-events:auto !important;
    }
    .toolbar select option,
    .toolbar select optgroup{
      background:var(--panel2) !important;color:var(--text) !important;
    }
    .toolbar select:focus{
      outline:none;
      border-color:rgba(110,168,255,.6) !important;
      box-shadow:0 0 0 2px rgba(110,168,255,.2);
    }
    .toolbar-note{
      font-size:12px;color:var(--muted);
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

    .big-grid{
      display:grid;
      grid-template-columns:repeat(auto-fit,minmax(500px,1fr));
      gap:16px;margin-bottom:24px;
    }
    .big-card{
      background:linear-gradient(180deg, rgba(255,255,255,.07), rgba(255,255,255,.04));
      border:1px solid var(--border);
      border-radius:var(--radius);
      padding:20px;overflow:hidden;
    }
    .card-title{
      font-size:16px;font-weight:700;margin-bottom:16px;display:flex;align-items:center;gap:8px;color:var(--text);
    }
    .card-title .icon{font-size:18px;}

    .nav-group{
      margin-bottom:12px;
    }
    .nav-label{
      font-size:11px;color:var(--muted);text-transform:uppercase;
      font-weight:600;letter-spacing:.3px;margin-bottom:8px;display:block;
    }
    .nav-item{
      display:flex;align-items:center;justify-content:space-between;
      padding:12px;background:rgba(255,255,255,.04);border:1px solid var(--border);
      border-radius:6px;text-decoration:none;color:var(--text);
      margin-bottom:8px;transition:all 150ms ease;
      cursor:pointer;
    }
    .nav-item:hover{
      background:rgba(110,168,255,.08);border-color:rgba(110,168,255,.3);transform:translateX(2px);
    }
    .nav-item span:first-child{font-weight:500;}
    .nav-item span:last-child{color:var(--muted);font-size:12px;}

    .footer{
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
      <h1 class="title">Commission Operations</h1>
      <p class="subtitle">Operational dashboard for plans, calculations, statements, and source-system synchronization.</p>
      <div class="toolbar">
        <span class="toolbar-label">Reporting Year</span>
        <select id="kpiYearSelect"></select>
        <span class="toolbar-note" id="kpiYearNote"></span>
      </div>
      <div class="chips" id="roleChips"></div>
    </div>

    <!-- Key Metrics -->
    <div class="grid">
      <div class="card metric">
        <div class="metric-label">Total Statements</div>
        <div class="metric-value" id="kpiStatements">—</div>
        <div class="metric-sub">Statements generated</div>
      </div>

      <div class="card metric">
        <div class="metric-label">Pending Exceptions</div>
        <div class="metric-value" id="kpiExceptions">—</div>
        <div class="metric-sub">Exceptions awaiting review</div>
      </div>

      <div class="card metric">
        <div class="metric-label">Active Deals</div>
        <div class="metric-value" id="kpiDeals">—</div>
        <div class="metric-sub">Open deals in pipeline</div>
      </div>

      <div class="card metric">
        <div class="metric-label">Open Alerts</div>
        <div class="metric-value" id="kpiAlerts">—</div>
        <div class="metric-sub">Monitoring alerts</div>
      </div>
    </div>

    <!-- Navigation Sections -->
    <div class="big-grid">
      <div class="big-card">
        <div class="card-title">
          <span class="icon">👤</span>
          Sales Rep
        </div>
        <div class="nav-group">
          <a class="nav-item" href="/x_823178_commissio_progress.do">
            <span>Performance Dashboard</span>
            <span>→</span>
          </a>
          <p style="font-size:12px;color:var(--muted);margin-top:8px;">Review representative earnings, targets, and pipeline performance by year.</p>
        </div>
      </div>

      <div class="big-card">
        <div class="card-title">
          <span class="icon">📊</span>
          Data Tables
        </div>
        <div class="nav-group">
          <a class="nav-item" href="/x_823178_commissio_deals_list.do">
            <span>Deals</span>
            <span>→</span>
          </a>
          <a class="nav-item" href="/x_823178_commissio_invoices_list.do">
            <span>Invoices</span>
            <span>→</span>
          </a>
          <a class="nav-item" href="/x_823178_commissio_payments_list.do">
            <span>Payments</span>
            <span>→</span>
          </a>
          <p style="font-size:12px;color:var(--muted);margin-top:8px;">Review source records synchronized from Zoho Bigin and Zoho Books.</p>
        </div>
      </div>
    </div>

    <div class="big-grid">
      <div class="big-card">
        <div class="card-title">
          <span class="icon">💵</span>
          Commission Workflow
        </div>
        <div class="nav-group">
          <a class="nav-item" href="/x_823178_commissio_commission_plans_list.do">
            <span>Commission Plans</span>
            <span>→</span>
          </a>
          <a class="nav-item" href="/x_823178_commissio_plan_targets_list.do">
            <span>Plan Targets</span>
            <span>→</span>
          </a>
          <a class="nav-item" href="/x_823178_commissio_plan_tiers_list.do">
            <span>Plan Tiers</span>
            <span>→</span>
          </a>
          <a class="nav-item" href="/x_823178_commissio_plan_bonuses_list.do">
            <span>Plan Bonuses</span>
            <span>→</span>
          </a>
          <a class="nav-item" href="/x_823178_commissio_commission_calculations_list.do">
            <span>Calculations</span>
            <span>→</span>
          </a>
          <a class="nav-item" href="/x_823178_commissio_commission_statements_list.do">
            <span>Statements</span>
            <span>→</span>
          </a>
          <p style="font-size:12px;color:var(--muted);margin-top:8px;">Manage plan design, calculations, and statement lifecycle records.</p>
        </div>
      </div>

      <div class="big-card">
        <div class="card-title">
          <span class="icon">⚙️</span>
          Administration & Audit
        </div>
        <div class="nav-group">
          <a class="nav-item" href="/x_823178_commissio_exception_approvals_list.do">
            <span>Exception Approvals</span>
            <span>→</span>
          </a>
          <a class="nav-item" href="/x_823178_commissio_reconciliation_log_list.do">
            <span>Reconciliation Log</span>
            <span>→</span>
          </a>
          <a class="nav-item" href="/x_823178_commissio_system_alerts_list.do">
            <span>System Alerts</span>
            <span>→</span>
          </a>
          <p style="font-size:12px;color:var(--muted);margin-top:8px;">Oversee exceptions, reconciliation outcomes, and operational alerts.</p>
        </div>
      </div>
    </div>
  </div>

  <div class="footer">
    Commission Management · Synchronized with Zoho Bigin and Zoho Books
  </div>
</body>
</html>
  `,
  clientScript: `
    (function () {
      try {
        console.log('Commission dashboard loaded');

        function invokeHelper(methodName, params, callback) {
          var helperNames = [
            'x_823178_commissio.CommissionProgressDataService',
            'x_823178_commissio.CommissionProgressHelper'
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
        if (chips) {
          chips.innerHTML = '';
          var roles = [];
          if (window.g_user && typeof window.g_user.hasRole === 'function') {
            if (g_user.hasRole('x_823178_commissio.admin')) roles.push('Admin');
            if (g_user.hasRole('x_823178_commissio.finance')) roles.push('Finance');
            if (g_user.hasRole('x_823178_commissio.rep')) roles.push('Rep');
          }
          if (roles.length === 0) roles.push('User');

          for (var i = 0; i < roles.length; i++) {
            var s = document.createElement('span');
            s.className = 'chip';
            s.textContent = roles[i];
            chips.appendChild(s);
          }
        }

        // Dashboard KPIs from real tables
        var setText = function (id, val) {
          var el = document.getElementById(id);
          if (el) el.textContent = val;
        };

        var kpiYear = String(new Date().getFullYear());

        function setMetricSubs(year) {
          var subLabels = document.querySelectorAll('.metric-sub');
          var yearLabel = String(year).toLowerCase() === 'all' ? 'All Years' : String(year);
          for (var idx = 0; idx < subLabels.length; idx++) {
            var text = subLabels[idx].textContent || '';
            subLabels[idx].textContent = text.replace(/\s\((\d{4}|All Years)\)$/, '') + ' (' + yearLabel + ')';
          }
          var note = document.getElementById('kpiYearNote');
          if (note) note.textContent = String(year).toLowerCase() === 'all' ? 'Showing records across all years' : 'Showing records for ' + year;
        }

        function initKpiYearSelect(years, defaultYear) {
          var select = document.getElementById('kpiYearSelect');
          if (!select) return;

          var currentYear = new Date().getFullYear();
          var options = (years && years.length) ? years : [currentYear + 2, currentYear + 1, currentYear, currentYear - 1, currentYear - 2];
          kpiYear = (defaultYear ? String(defaultYear) : kpiYear);
          select.innerHTML = '';

          var allOption = document.createElement('option');
          allOption.value = 'all';
          allOption.textContent = 'All Years';
          if (String(kpiYear).toLowerCase() === 'all') allOption.selected = true;
          select.appendChild(allOption);

          for (var i = 0; i < options.length; i++) {
            var year = parseInt(options[i], 10);
            if (isNaN(year)) continue;
            var option = document.createElement('option');
            option.value = String(year);
            option.textContent = String(year);
            if (String(year) === String(kpiYear)) option.selected = true;
            select.appendChild(option);
          }

          select.addEventListener('change', function() {
            kpiYear = select.value || 'all';
            select.disabled = false;
            loadMetrics(kpiYear);
          });
        }

        function initializeYearContext(callback) {
          var currentYear = new Date().getFullYear();
          invokeHelper('getYearContext', {
            sysparm_year: String(kpiYear),
            sysparm_year_window: '2'
          }, function(response) {
            if (!response) {
              initKpiYearSelect(null, currentYear);
              setMetricSubs(kpiYear);
              if (callback) callback();
              return;
            }

            try {
              var payload = typeof response === 'string' ? JSON.parse(response) : response;
              if (payload && payload.status === 'success' && payload.data) {
                initKpiYearSelect(payload.data.years, payload.data.default_year);
              } else {
                initKpiYearSelect(null, currentYear);
              }
            } catch (e) {
              initKpiYearSelect(null, currentYear);
            }

            setMetricSubs(kpiYear);
            if (callback) callback();
          });
        }

        function loadMetrics(year) {
          setText('kpiStatements', '...');
          setText('kpiExceptions', '...');
          setText('kpiDeals', '...');
          setText('kpiAlerts', '...');

          invokeHelper('getDashboardMetrics', {
            sysparm_year: String(year)
          }, function(response) {
            if (!response) {
              setText('kpiStatements', '0');
              setText('kpiExceptions', '0');
              setText('kpiDeals', '0');
              setText('kpiAlerts', '0');
              setMetricSubs(year);
              return;
            }

            try {
              var payload = typeof response === 'string' ? JSON.parse(response) : response;
              if (payload && payload.status === 'success' && payload.data) {
                setText('kpiStatements', String(payload.data.total_statements || 0));
                setText('kpiExceptions', String(payload.data.pending_reviews || 0));
                setText('kpiDeals', String(payload.data.active_deals || 0));
                setText('kpiAlerts', String(payload.data.open_alerts || 0));
                setMetricSubs(payload.data.report_year || year);
              } else {
                setText('kpiStatements', '0');
                setText('kpiExceptions', '0');
                setText('kpiDeals', '0');
                setText('kpiAlerts', '0');
                setMetricSubs(year);
              }
            } catch (e) {
              console.log('Dashboard metrics parse error:', e);
              setText('kpiStatements', '0');
              setText('kpiExceptions', '0');
              setText('kpiDeals', '0');
              setText('kpiAlerts', '0');
              setMetricSubs(year);
            }
          });
        }

        initializeYearContext(function() {
          loadMetrics(kpiYear);
        });

      } catch (err) {
        console.log('Dashboard error:', err);
      }
    })();
  `
})
