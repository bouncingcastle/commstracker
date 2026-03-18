import '@servicenow/sdk/global'
import { UiPage } from '@servicenow/sdk/core'

UiPage({
    $id: Now.ID['commission_dashboard_page'],
    endpoint: 'x_823178_commissio_dashboard.do',
    description: 'Commission Management Dashboard - Operational',
    category: 'general',
    html: `
<html lang="en">
  <head>
    <meta charset="UTF-8"></meta>
    <meta name="viewport" content="width=device-width, initial-scale=1.0"></meta>
    <title>Commission Management</title>
    <style>:root{
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
      cursor:pointer;
      transition:all 150ms ease;
      padding:16px 20px;
    }
    .card.metric:hover{
      background:rgba(110,168,255,.08);
      border-color:rgba(110,168,255,.3);
      transform:translateY(-1px);
    }
    .metric-value{
      font-size:36px;font-weight:900;margin:8px 0 0;
      font-variant-numeric:tabular-nums;
    }
    .metric-label{
      font-size:13px;color:var(--muted);font-weight:500;
      text-transform:uppercase;letter-spacing:.5px;
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
    }</style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1 class="title">Commission Operations</h1>
        <p class="subtitle">Operational dashboard for plans, calculations, statements, and source-system synchronization.</p>
      </div>
      <!-- Key Metrics -->
      <div class="grid">
        <div class="card metric" data-kpi="statements" title="Open statements list">
          <div class="metric-label">Total Statements</div>
          <div class="metric-value" id="kpiStatements">—</div>
        </div>
        <div class="card metric" data-kpi="exceptions" title="Open pending exceptions list">
          <div class="metric-label">Pending Exceptions</div>
          <div class="metric-value" id="kpiExceptions">—</div>
        </div>
        <div class="card metric" data-kpi="deals" title="Open active deals list">
          <div class="metric-label">Active Deals</div>
          <div class="metric-value" id="kpiDeals">—</div>
        </div>
        <div class="card metric" data-kpi="alerts" title="Open system alerts list">
          <div class="metric-label">Open Alerts</div>
          <div class="metric-value" id="kpiAlerts">—</div>
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
            <a class="nav-item" href="/x_823178_commissio_commission_plans.do?sys_id=-1$[AMP]sysparm_view=default">
              <span>Plan Setup Form (New)</span>
              <span>→</span>
            </a>
            <a class="nav-item" href="/x_823178_commissio_commission_plans_list.do?sysparm_query=is_active=true^ORDERBYsales_rep^ORDERBYDESCeffective_start_date">
              <span>Plan Structure Reference (By Rep)</span>
              <span>→</span>
            </a>
            <a class="nav-item" href="/x_823178_commissio_plan_hierarchy.do">
              <span>Plan Hierarchy View</span>
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
            <a class="nav-item" href="/x_823178_commissio_bonus_earnings_list.do">
              <span>Bonus Earnings</span>
              <span>→</span>
            </a>
            <a class="nav-item" href="/x_823178_commissio_deal_types_list.do">
              <span>Deal Types</span>
              <span>→</span>
            </a>
            <a class="nav-item" href="/x_823178_commissio_plan_recognition_policies_list.do">
              <span>Plan Recognition Policies</span>
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
            <a class="nav-item" href="/x_823178_commissio_forecast_scenarios_list.do">
              <span>Forecast Scenarios</span>
              <span>→</span>
            </a>
            <p style="font-size:12px;color:var(--muted);margin-top:8px;">Use Plan Setup Form for new plans. Use Plan Structure Reference to open an individual rep plan and review full structure via related lists.</p>
          </div>
        </div>
        <div class="big-card">
          <div class="card-title">
            
            <span class="icon">⚙️</span>
            Administration $[AMP] Audit
          </div>
          <div class="nav-group">
            <a class="nav-item" href="/x_823178_commissio_exception_approvals_list.do">
              <span>Exception Approvals</span>
              <span>→</span>
            </a>
            <a class="nav-item" href="/x_823178_commissio_statement_approvals_list.do">
              <span>Statement Approvals</span>
              <span>→</span>
            </a>
            <a class="nav-item" href="/x_823178_commissio_bulk_plan_assignment_runs_list.do">
              <span>Bulk Plan Assignments</span>
              <span>→</span>
            </a>
            <a class="nav-item" href="/x_823178_commissio_manager_team_memberships_list.do">
              <span>Manager Team Governance</span>
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
            <a class="nav-item" href="/sys_properties_list.do?sysparm_query=nameSTARTSWITHx_823178_commissio.">
              <span>System Preferences</span>
              <span>→</span>
            </a>
            <a class="nav-item" href="/sysauto_script_list.do?sysparm_query=name=Commission%20Bonus%20Scenario%20Seed">
              <span>Run Bonus Scenario Seed</span>
              <span>→</span>
            </a>
            <p style="font-size:12px;color:var(--muted);margin-top:8px;">Oversee exceptions, reconciliation outcomes, and operational alerts.</p>
          </div>
        </div>
      </div>
    </div>
    <div class="footer">Commission Management · Synchronized with Zoho Bigin and Zoho Books</div>
  </body>
</html>`,
    clientScript: `
    (function () {
      try {
        console.log('Commission dashboard loaded');

        function invokeHelper(methodName, params, callback) {
          var helperNames = [
            'x_823178_commissio.CommissionProgressDataServiceV2',
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

        // Dashboard KPIs from real tables
        var setText = function (id, val) {
          var el = document.getElementById(id);
          if (el) el.textContent = val;
        };

        var kpiYear = 'all';

        function getYearQueryPrefix(fieldName, yearValue) {
          if (!yearValue || String(yearValue).toLowerCase() === 'all') return '';
          var year = String(yearValue);
          return fieldName + '>=' + year + '-01-01^' + fieldName + '<=' + year + '-12-31';
        }

        function openKpiDrilldown(metricType) {
          var basePath = '';
          var query = '';

          if (metricType === 'statements') {
            basePath = '/x_823178_commissio_commission_statements_list.do';
            query = String(kpiYear).toLowerCase() === 'all' ? '' : ('statement_year=' + kpiYear);
          } else if (metricType === 'exceptions') {
            basePath = '/x_823178_commissio_exception_approvals_list.do';
            query = 'status=pending';
            if (String(kpiYear).toLowerCase() !== 'all') {
              query += '^' + getYearQueryPrefix('request_date', kpiYear);
            }
          } else if (metricType === 'deals') {
            basePath = '/x_823178_commissio_deals_list.do';
            query = 'is_won=false^stage!=closed_lost';
          } else if (metricType === 'alerts') {
            basePath = '/x_823178_commissio_system_alerts_list.do';
            query = 'statusINopen,acknowledged';
            if (String(kpiYear).toLowerCase() !== 'all') {
              query += '^' + getYearQueryPrefix('alert_date', kpiYear);
            }
          }

          if (!basePath) return;
          var url = basePath + (query ? ('?sysparm_query=' + encodeURIComponent(query)) : '');
          window.location.href = url;
        }

        function initializeKpiDrilldowns() {
          var cards = document.querySelectorAll('.card.metric[data-kpi]');
          for (var i = 0; i < cards.length; i++) {
            (function(card) {
              var metricType = card.getAttribute('data-kpi');
              if (!metricType) return;

              card.addEventListener('click', function() {
                openKpiDrilldown(metricType);
              });

              card.addEventListener('keydown', function(evt) {
                if (evt.key === 'Enter' || evt.key === ' ') {
                  evt.preventDefault();
                  openKpiDrilldown(metricType);
                }
              });

              card.setAttribute('tabindex', '0');
              card.setAttribute('role', 'button');
            })(cards[i]);
          }
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
              return;
            }

            try {
              var payload = typeof response === 'string' ? JSON.parse(response) : response;
              if (payload && payload.status === 'success' && payload.data) {
                setText('kpiStatements', String(payload.data.total_statements || 0));
                setText('kpiExceptions', String(payload.data.pending_reviews || 0));
                setText('kpiDeals', String(payload.data.active_deals || 0));
                setText('kpiAlerts', String(payload.data.open_alerts || 0));
              } else {
                setText('kpiStatements', '0');
                setText('kpiExceptions', '0');
                setText('kpiDeals', '0');
                setText('kpiAlerts', '0');
              }
            } catch (e) {
              console.log('Dashboard metrics parse error:', e);
              setText('kpiStatements', '0');
              setText('kpiExceptions', '0');
              setText('kpiDeals', '0');
              setText('kpiAlerts', '0');
            }
          });
        }

        initializeKpiDrilldowns();
        loadMetrics(kpiYear);

      } catch (err) {
        console.log('Dashboard error:', err);
      }
    })();
  `,
})
