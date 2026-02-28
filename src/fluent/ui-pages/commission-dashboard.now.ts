import '@servicenow/sdk/global'
import { UiPage } from '@servicenow/sdk/core'

UiPage({
  $id: Now.ID['commission_dashboard_page'],
  endpoint: 'x_823178_commissio_dashboard.do',
  description: 'Commission Management Dashboard - Operational',
  category: 'general',

  // NOTE: leaving direct undefined is fine; Jelly wrapper below makes it render reliably.
  // direct: true,

  html: `
<j:jelly xmlns:j="jelly:core" xmlns:g="glide">
  <style>
    .cm-wrap{max-width:1200px;margin:0 auto;padding:18px 18px 28px}
    .cm-title{font-size:22px;font-weight:800;margin:2px 0 4px}
    .cm-sub{color:#5b6470;margin:0 0 16px}
    .cm-grid{display:grid;grid-template-columns:repeat(12,minmax(0,1fr));gap:12px}
    .cm-card{background:#fff;border:1px solid #e6e8eb;border-radius:14px;box-shadow:0 1px 2px rgba(0,0,0,.04);padding:14px}
    .cm-kpi{grid-column:span 3}
    .cm-kpi .label{font-size:12px;color:#6b7480}
    .cm-kpi .val{font-size:22px;font-weight:900;margin-top:6px}
    .cm-kpi .hint{font-size:12px;color:#6b7480;margin-top:4px}
    .cm-section{grid-column:span 4}
    .cm-h{font-weight:800;margin:0 0 10px;font-size:14px}
    .cm-btn{display:flex;align-items:center;justify-content:space-between;gap:10px;
      padding:10px 12px;border-radius:10px;border:1px solid #e6e8eb;background:#f7f8fa;
      text-decoration:none;color:#1f2937;margin-bottom:8px}
    .cm-btn:hover{background:#eef2ff;border-color:#c7d2fe}
    .cm-badge{font-size:12px;color:#6b7480}
    .cm-note{grid-column:span 12;color:#6b7480;font-size:12px;margin-top:6px}
    .cm-alert{border-left:4px solid #f59e0b;background:#fffbeb;border-color:#fde68a}
    .cm-good{border-left:4px solid #10b981;background:#ecfdf5;border-color:#a7f3d0}
    .cm-danger{border-left:4px solid #ef4444;background:#fef2f2;border-color:#fecaca}

    @media (max-width:1100px){
      .cm-kpi{grid-column:span 6}
      .cm-section{grid-column:span 6}
    }
    @media (max-width:720px){
      .cm-kpi{grid-column:span 12}
      .cm-section{grid-column:span 12}
    }
  </style>

  <div class="cm-wrap">
    <div class="cm-title">Commission Management</div>
    <div class="cm-sub">Operational dashboard (navigation + quick checks). Data widgets can come later.</div>

    <div class="cm-grid">
      <!-- KPIs (static placeholders for now) -->
      <div class="cm-card cm-kpi cm-good">
        <div class="label">This month</div>
        <div class="val">Statements</div>
        <div class="hint">Open statements list to review</div>
      </div>

      <div class="cm-card cm-kpi cm-alert">
        <div class="label">Exceptions</div>
        <div class="val">Approvals</div>
        <div class="hint">Check exception queue</div>
      </div>

      <div class="cm-card cm-kpi">
        <div class="label">Deals</div>
        <div class="val">Pipeline</div>
        <div class="hint">View deals list</div>
      </div>

      <div class="cm-card cm-kpi cm-danger">
        <div class="label">System</div>
        <div class="val">Alerts</div>
        <div class="hint">Open alerts list</div>
      </div>

      <!-- Sections -->
      <div class="cm-card cm-section">
        <div class="cm-h">Data</div>
        <a class="cm-btn" href="/x_823178_commissio_deals_list.do">
          <span>Deals</span><span class="cm-badge">list</span>
        </a>
        <a class="cm-btn" href="/x_823178_commissio_invoices_list.do">
          <span>Invoices</span><span class="cm-badge">list</span>
        </a>
        <a class="cm-btn" href="/x_823178_commissio_payments_list.do">
          <span>Payments</span><span class="cm-badge">list</span>
        </a>
      </div>

      <div class="cm-card cm-section">
        <div class="cm-h">Commissions</div>
        <a class="cm-btn" href="/x_823178_commissio_commission_calculations_list.do">
          <span>Calculations</span><span class="cm-badge">list</span>
        </a>
        <a class="cm-btn" href="/x_823178_commissio_commission_plans_list.do">
          <span>Plans</span><span class="cm-badge">list</span>
        </a>
        <a class="cm-btn" href="/x_823178_commissio_commission_statements_list.do">
          <span>Statements</span><span class="cm-badge">list</span>
        </a>
      </div>

      <div class="cm-card cm-section">
        <div class="cm-h">Admin / Audit</div>
        <a class="cm-btn" href="/x_823178_commissio_exception_approvals_list.do">
          <span>Exception Approvals</span><span class="cm-badge">queue</span>
        </a>
        <a class="cm-btn" href="/x_823178_commissio_reconciliation_log_list.do">
          <span>Reconciliation Log</span><span class="cm-badge">audit</span>
        </a>
        <a class="cm-btn" href="/x_823178_commissio_system_alerts_list.do">
          <span>System Alerts</span><span class="cm-badge">monitor</span>
        </a>
      </div>

      <div class="cm-note">
        If this page ever goes blank again, the #1 cause is a broken template literal in the <code>html: \`...\`</code> block.
        Avoid backticks inside HTML and avoid the sequence <code>\${</code> anywhere in the HTML/CSS/JS.
      </div>
    </div>

    <script>
      (function () {
        if (window && window.console) {
          console.log('Commission dashboard loaded');
        }
      })();
    </script>
  </div>
</j:jelly>
  `,
})