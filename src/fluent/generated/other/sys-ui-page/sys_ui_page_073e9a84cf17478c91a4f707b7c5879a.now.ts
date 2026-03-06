import { UiPage } from '@servicenow/sdk/core'

UiPage({
    $id: Now.ID['073e9a84cf17478c91a4f707b7c5879a'],
    category: 'general',
    endpoint: 'x_823178_commissio_statement_explainability.do',
    description: 'Commission Statement Explainability Drill-Down',
    html: `
<html lang="en">
  <head>
    <meta charset="UTF-8"></meta>
    <meta name="viewport" content="width=device-width, initial-scale=1.0"></meta>
    <title>Statement Explainability</title>
    <style>:root{--bg:#0b1020;--panel:#101a33;--border:rgba(255,255,255,.12);--text:#e9eefc;--muted:rgba(233,238,252,.72);--brand:#6ea8ff;--good:#28d17c;--warn:#ffcc66;--bad:#ff6b6b;--radius:10px}
    *{box-sizing:border-box}
    body{margin:0;background:var(--bg);color:var(--text);font:14px/1.5 -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif}
    .wrap{max-width:1280px;margin:0 auto;padding:24px}
    h1{margin:0 0 6px 0;font-size:30px}
    .sub{color:var(--muted);margin-bottom:18px}
    .panel{background:var(--panel);border:1px solid var(--border);border-radius:var(--radius);padding:16px;margin-bottom:16px}
    .meta{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:12px}
    .meta-item{padding:10px;border:1px solid var(--border);border-radius:8px;background:rgba(255,255,255,.03)}
    .meta-label{font-size:11px;color:var(--muted);text-transform:uppercase;letter-spacing:.4px}
    .meta-value{font-size:16px;font-weight:700;margin-top:4px}
    .summary{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:12px}
    .kpi{padding:12px;border:1px solid var(--border);border-radius:8px;background:rgba(255,255,255,.03)}
    .kpi-label{font-size:11px;color:var(--muted);text-transform:uppercase;letter-spacing:.4px}
    .kpi-value{font-size:24px;font-weight:900;margin-top:6px;font-variant-numeric:tabular-nums}
    .table{width:100%;border-collapse:collapse;background:rgba(255,255,255,.02)}
    .table th{font-size:11px;color:var(--muted);text-transform:uppercase;letter-spacing:.4px;text-align:left;padding:10px;border:1px solid var(--border)}
    .table td{padding:10px;border:1px solid var(--border);vertical-align:top}
    .pill{display:inline-block;padding:2px 8px;border-radius:999px;font-size:11px;border:1px solid var(--border)}
    .actions{display:flex;flex-wrap:wrap;gap:8px;margin-top:10px}
    .btn{display:inline-block;padding:8px 12px;border:1px solid var(--border);border-radius:8px;background:rgba(255,255,255,.04);color:var(--brand);text-decoration:none}
    .loading{color:var(--muted);text-align:center;padding:20px}
    .warn{color:var(--warn)} .good{color:var(--good)} .bad{color:var(--bad)}</style>
  </head>
  <body>
    <div class="wrap">
      <h1>Statement Explainability</h1>
      <div class="sub">Breakdown of statement totals into base commission, accelerator delta, and bonus components.</div>
      <div class="panel" id="headerPanel">
        <div class="loading">Loading statement explainability...</div>
      </div>
      <div class="panel">
        <div class="summary" id="summaryPanel">
          <div class="loading">Loading summary...</div>
        </div>
      </div>
      <div class="panel">
        <table class="table">
          <thead>
            <tr>
              <th>Deal</th>
              <th>Type</th>
              <th>Payment Date</th>
              <th>Base</th>
              <th>Accelerator</th>
              <th>Bonus</th>
              <th>Total</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody id="lineItemsBody">
            <tr>
              <td colspan="8" class="loading">Loading line items...</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </body>
</html>`,
    clientScript: `
    (function(){
      function q(name){
        var m = new URLSearchParams(window.location.search).get(name);
        return m || '';
      }

      function money(value){
        return '$' + (parseFloat(value || 0).toFixed(2));
      }

      function invokeHelper(methodName, params, callback) {
        var ajax = new GlideAjax('x_823178_commissio.CommissionProgressDataService');
        ajax.addParam('sysparm_name', methodName);
        Object.keys(params || {}).forEach(function(k){ ajax.addParam(k, params[k]); });
        ajax.getXMLAnswer(function(response){ callback(response || null); });
      }

      function renderEmpty(message){
        document.getElementById('headerPanel').innerHTML =
          '<div class="meta"><div class="meta-item"><div class="meta-label">Status</div><div class="meta-value">No statement available</div></div></div>' +
          '<div class="actions">' +
          '<a class="btn" href="/x_823178_commissio_commission_statements_list.do">Open Statements List</a>' +
          '</div>' +
          '<div class="sub" style="margin-top:10px;">' + (message || 'No statement found in your access scope.') + '</div>';
        document.getElementById('summaryPanel').innerHTML = '<div class="loading">No explainability summary available.</div>';
        document.getElementById('lineItemsBody').innerHTML = '<tr><td colspan="8" class="loading">No line items available.</td></tr>';
      }

      function renderPayload(data){
        if (!data || !data.statement) {
          renderEmpty();
          return;
        }

        var statement = data.statement || {};
        var summary = data.summary || {};
        var rows = data.line_items || [];

        document.getElementById('headerPanel').innerHTML =
          '<div class="meta">' +
            '<div class="meta-item"><div class="meta-label">Statement</div><div class="meta-value">' + (statement.statement_number || '—') + '</div></div>' +
            '<div class="meta-item"><div class="meta-label">Sales Rep</div><div class="meta-value">' + (statement.sales_rep_name || '—') + '</div></div>' +
            '<div class="meta-item"><div class="meta-label">Period</div><div class="meta-value">' + (statement.period_start_date || '—') + ' → ' + (statement.period_end_date || '—') + '</div></div>' +
            '<div class="meta-item"><div class="meta-label">Status</div><div class="meta-value"><span class="pill">' + (statement.status || 'draft') + '</span></div></div>' +
          '</div>' +
          '<div class="actions">' +
            '<a class="btn" href="/x_823178_commissio_commission_statements.do?sys_id=' + statement.sys_id + '">Open Statement Form</a>' +
            '<a class="btn" href="/x_823178_commissio_commission_calculations_list.do?sysparm_query=statement=' + statement.sys_id + '">Open Statement Line Items</a>' +
          '</div>';

        var unexplained = parseFloat(summary.unexplained_delta || 0);
        var unexplainedClass = Math.abs(unexplained) < 0.01 ? 'good' : (unexplained > 0 ? 'warn' : 'bad');

        document.getElementById('summaryPanel').innerHTML =
          '<div class="kpi"><div class="kpi-label">Base Component</div><div class="kpi-value">' + money(summary.base_component) + '</div></div>' +
          '<div class="kpi"><div class="kpi-label">Accelerator Delta</div><div class="kpi-value">' + money(summary.accelerator_component) + '</div></div>' +
          '<div class="kpi"><div class="kpi-label">Bonus Component</div><div class="kpi-value">' + money(summary.bonus_component) + '</div></div>' +
          '<div class="kpi"><div class="kpi-label">Statement Total</div><div class="kpi-value">' + money(summary.total_commission) + '</div></div>' +
          '<div class="kpi"><div class="kpi-label">Unexplained Delta</div><div class="kpi-value ' + unexplainedClass + '">' + money(unexplained) + '</div></div>' +
          '<div class="kpi"><div class="kpi-label">Line Items</div><div class="kpi-value">' + (parseInt(summary.line_items_count || 0, 10) || 0) + '</div></div>';

        var body = document.getElementById('lineItemsBody');
        body.innerHTML = '';
        if (!rows.length) {
          body.innerHTML = '<tr><td colspan="8" class="loading">No calculations are linked to this statement.</td></tr>';
          return;
        }

        rows.forEach(function(row){
          var tr = document.createElement('tr');
          tr.innerHTML =
            '<td>' + (row.deal_name || '—') + '</td>' +
            '<td>' + (row.deal_type || '—') + '</td>' +
            '<td>' + (row.payment_date || '—') + '</td>' +
            '<td>' + money(row.base_component) + '</td>' +
            '<td>' + money(row.accelerator_component) + '</td>' +
            '<td>' + money(row.bonus_component) + '</td>' +
            '<td><strong>' + money(row.commission_amount) + '</strong></td>' +
            '<td><span class="pill">' + (row.status || 'draft') + '</span></td>';
          body.appendChild(tr);
        });
      }

      var statementId = q('sysparm_statement_id') || q('statement_id') || q('sys_id');
      invokeHelper('getStatementExplainability', { sysparm_statement_id: statementId }, function(response){
        if (!response) {
          renderEmpty('Statement explainability service did not return data.');
          return;
        }

        try {
          var payload = typeof response === 'string' ? JSON.parse(response) : response;
          if (!payload || payload.status !== 'success') {
            renderEmpty(payload && payload.message ? payload.message : 'Unable to load statement explainability.');
            return;
          }
          renderPayload(payload.data || {});
        } catch (e) {
          renderEmpty('Unable to parse statement explainability response.');
        }
      });
    })();
  `,
})
