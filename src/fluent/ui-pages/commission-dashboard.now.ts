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
      --shadow: 0 10px 24px rgba(0,0,0,.25);
      --radius:16px;
    }
    *{box-sizing:border-box}
    body{
      margin:0;
      font-family: system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial;
      background: radial-gradient(1200px 700px at 20% 0%, rgba(110,168,255,.20), transparent 60%),
                  radial-gradient(900px 600px at 80% 10%, rgba(40,209,124,.14), transparent 55%),
                  var(--bg);
      color:var(--text);
    }
    a{color:inherit}
    .wrap{max-width:1200px;margin:0 auto;padding:22px}
    .top{
      display:flex;align-items:flex-start;justify-content:space-between;gap:16px;
      margin-bottom:16px;
    }
    .title{
      font-size:22px;font-weight:900;letter-spacing:.2px;margin:0;
    }
    .sub{
      margin:6px 0 0;color:var(--muted);max-width:70ch;line-height:1.4;
    }
    .chips{display:flex;gap:8px;flex-wrap:wrap;justify-content:flex-end}
    .chip{
      font-size:12px;padding:6px 10px;border-radius:999px;
      border:1px solid var(--border);background:rgba(255,255,255,.06);
      color:var(--muted);
    }

    .grid{display:grid;grid-template-columns:repeat(12,minmax(0,1fr));gap:12px}

    .card{
      background:linear-gradient(180deg, rgba(255,255,255,.07), rgba(255,255,255,.04));
      border:1px solid var(--border);
      border-radius:var(--radius);
      box-shadow: var(--shadow);
      overflow:hidden;
    }
    .cardPad{padding:14px}
    .kpi{grid-column:span 3}
    .kLabel{font-size:12px;color:var(--muted)}
    .kValue{margin-top:8px;font-size:22px;font-weight:900}
    .kHint{margin-top:6px;font-size:12px;color:var(--muted)}
    .dot{display:inline-block;width:8px;height:8px;border-radius:999px;margin-right:8px;vertical-align:middle}
    .dot.good{background:var(--good)}
    .dot.warn{background:var(--warn)}
    .dot.bad{background:var(--bad)}

    .panel{grid-column:span 4}
    .panelHead{
      padding:12px 14px;
      border-bottom:1px solid var(--border);
      background:rgba(0,0,0,.14);
      font-weight:800;font-size:13px;letter-spacing:.2px;
      display:flex;align-items:center;justify-content:space-between;gap:10px;
    }
    .panelBody{padding:12px 14px}
    .btn{
      display:flex;align-items:center;justify-content:space-between;gap:10px;
      padding:11px 12px;margin-bottom:10px;
      border-radius:12px;
      border:1px solid var(--border);
      background:rgba(255,255,255,.06);
      text-decoration:none;
      transition: transform .12s ease, background .12s ease, border-color .12s ease;
    }
    .btn:hover{transform:translateY(-1px);background:rgba(110,168,255,.10);border-color:rgba(110,168,255,.35)}
    .btn .meta{font-size:12px;color:var(--muted)}
    .btn .go{font-size:12px;color:var(--muted)}

    .wide{grid-column:span 12}
    .bar{
      display:flex;gap:10px;flex-wrap:wrap;align-items:center;
      padding:12px 14px;
    }
    .search{
      flex: 1 1 320px;
      display:flex;gap:10px;align-items:center;
      border:1px solid var(--border);
      background:rgba(255,255,255,.06);
      border-radius:12px;
      padding:10px 12px;
    }
    .search input{
      width:100%;
      border:0;outline:0;background:transparent;
      color:var(--text);
      font-size:14px;
    }
    .pillRow{display:flex;gap:8px;flex-wrap:wrap}
    .pill{
      border:1px solid var(--border);
      background:rgba(255,255,255,.06);
      padding:8px 10px;border-radius:999px;
      font-size:12px;color:var(--muted);
      text-decoration:none;
    }
    .pill:hover{border-color:rgba(110,168,255,.35);background:rgba(110,168,255,.10);color:var(--text)}

    .foot{
      margin-top:12px;color:var(--muted);font-size:12px;line-height:1.4
    }

    @media (max-width:1100px){
      .kpi{grid-column:span 6}
      .panel{grid-column:span 6}
      .top{flex-direction:column}
      .chips{justify-content:flex-start}
    }
    @media (max-width:720px){
      .kpi{grid-column:span 12}
      .panel{grid-column:span 12}
    }
  </style>
</head>
<body>
  <div class="wrap">
    <div class="top">
      <div>
        <h1 class="title">Commission Management</h1>
        <p class="sub">Operational dashboard for navigating deals, invoices, payments, calculations and statements. We can wire real KPIs next.</p>
      </div>
      <div class="chips" id="roleChips">
        <span class="chip">Loading roles…</span>
      </div>
    </div>

    <div class="grid">
      <!-- KPI row (placeholders for now) -->
      <div class="card kpi"><div class="cardPad">
        <div class="kLabel"><span class="dot good"></span>Commissions</div>
        <div class="kValue" id="kpiCommissions">—</div>
        <div class="kHint">Monthly statements total (to be wired)</div>
      </div></div>

      <div class="card kpi"><div class="cardPad">
        <div class="kLabel"><span class="dot warn"></span>Pending</div>
        <div class="kValue" id="kpiPending">—</div>
        <div class="kHint">Reviews / exceptions (to be wired)</div>
      </div></div>

      <div class="card kpi"><div class="cardPad">
        <div class="kLabel"><span class="dot good"></span>Active Deals</div>
        <div class="kValue" id="kpiDeals">—</div>
        <div class="kHint">Deals in-flight (to be wired)</div>
      </div></div>

      <div class="card kpi"><div class="cardPad">
        <div class="kLabel"><span class="dot bad"></span>System</div>
        <div class="kValue" id="kpiAlerts">—</div>
        <div class="kHint">Alerts / failures (to be wired)</div>
      </div></div>

      <!-- Jump/search bar -->
      <div class="card wide">
        <div class="bar">
          <div class="search">
            <span style="color:rgba(233,238,252,.70);font-size:13px;">Jump</span>
            <input id="jumpInput" type="text" placeholder="Type: deals, invoices, payments, calculations, plans, statements, exceptions, alerts…" />
          </div>
          <div class="pillRow" aria-label="Quick links">
            <a class="pill" href="/x_823178_commissio_deals_list.do">Deals</a>
            <a class="pill" href="/x_823178_commissio_invoices_list.do">Invoices</a>
            <a class="pill" href="/x_823178_commissio_payments_list.do">Payments</a>
            <a class="pill" href="/x_823178_commissio_commission_calculations_list.do">Calculations</a>
            <a class="pill" href="/x_823178_commissio_commission_plans_list.do">Plans</a>
            <a class="pill" href="/x_823178_commissio_commission_statements_list.do">Statements</a>
            <a class="pill" href="/x_823178_commissio_exception_approvals_list.do">Exceptions</a>
            <a class="pill" href="/x_823178_commissio_system_alerts_list.do">Alerts</a>
          </div>
        </div>
      </div>

      <!-- Panels -->
      <div class="card panel">
        <div class="panelHead">📊 Data <span class="chip">lists</span></div>
        <div class="panelBody">
          <a class="btn" href="/x_823178_commissio_deals_list.do"><span>Deals</span><span class="go">Open →</span></a>
          <a class="btn" href="/x_823178_commissio_invoices_list.do"><span>Invoices</span><span class="go">Open →</span></a>
          <a class="btn" href="/x_823178_commissio_payments_list.do"><span>Payments</span><span class="go">Open →</span></a>
          <div class="meta" style="color:var(--muted);font-size:12px;">Use these to validate sync output first.</div>
        </div>
      </div>

      <div class="card panel">
        <div class="panelHead">💰 Commissions <span class="chip">workflow</span></div>
        <div class="panelBody">
          <a class="btn" href="/x_823178_commissio_commission_calculations_list.do"><span>Calculations</span><span class="go">Open →</span></a>
          <a class="btn" href="/x_823178_commissio_commission_statements_list.do"><span>Statements</span><span class="go">Open →</span></a>
          <a class="btn" href="/x_823178_commissio_commission_plans_list.do"><span>Plans</span><span class="go">Open →</span></a>
          <div class="meta" style="color:var(--muted);font-size:12px;">When ready, we’ll add “Create month”, “Lock”, “Pay”.</div>
        </div>
      </div>

      <div class="card panel">
        <div class="panelHead">⚙️ Admin / Audit <span class="chip">ops</span></div>
        <div class="panelBody">
          <a class="btn" href="/x_823178_commissio_exception_approvals_list.do"><span>Exception Approvals</span><span class="go">Open →</span></a>
          <a class="btn" href="/x_823178_commissio_reconciliation_log_list.do"><span>Reconciliation Log</span><span class="go">Open →</span></a>
          <a class="btn" href="/x_823178_commissio_system_alerts_list.do"><span>System Alerts</span><span class="go">Open →</span></a>
          <div class="meta" style="color:var(--muted);font-size:12px;">This is where you keep the machine honest.</div>
        </div>
      </div>
    </div>

    <div class="foot">
      Next step: wire KPI values via a simple endpoint (Script Include + GlideAjax) or a lightweight REST call.
      For now, this dashboard is a fast navigation hub that users can actually use.
    </div>
  </div>
</body>
</html>
  `,
  clientScript: `
    (function () {
      try {
        console.log('Commission dashboard loaded');

        // Simple role chips (best-effort: works in many UI contexts)
        var chips = document.getElementById('roleChips');
        if (chips) {
          chips.innerHTML = '';
          // If g_user exists, show roles. If not, show generic.
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

        // Jump box routing
        var routes = [
          { k: 'deal', url: '/x_823178_commissio_deals_list.do' },
          { k: 'invoice', url: '/x_823178_commissio_invoices_list.do' },
          { k: 'payment', url: '/x_823178_commissio_payments_list.do' },
          { k: 'calc', url: '/x_823178_commissio_commission_calculations_list.do' },
          { k: 'calculation', url: '/x_823178_commissio_commission_calculations_list.do' },
          { k: 'plan', url: '/x_823178_commissio_commission_plans_list.do' },
          { k: 'statement', url: '/x_823178_commissio_commission_statements_list.do' },
          { k: 'exception', url: '/x_823178_commissio_exception_approvals_list.do' },
          { k: 'alert', url: '/x_823178_commissio_system_alerts_list.do' },
          { k: 'recon', url: '/x_823178_commissio_reconciliation_log_list.do' }
        ];

        var input = document.getElementById('jumpInput');
        if (input) {
          input.addEventListener('keydown', function (e) {
            if (e.key !== 'Enter') return;
            var v = (input.value || '').toLowerCase().trim();
            if (!v) return;

            for (var i = 0; i < routes.length; i++) {
              if (v.indexOf(routes[i].k) !== -1) {
                window.location.href = routes[i].url;
                return;
              }
            }
            // fallback: try open a global search to the table list if user typed an exact table-ish keyword
            console.log('No route match for jump:', v);
          });
        }

        // Placeholder KPI values (until wired)
        var setText = function (id, val) {
          var el = document.getElementById(id);
          if (el) el.textContent = val;
        };
        setText('kpiCommissions', '$—');
        setText('kpiPending', '—');
        setText('kpiDeals', '—');
        setText('kpiAlerts', '—');

      } catch (err) {
        console.log('Dashboard clientScript error', err);
      }
    })();
  `
})