import '@servicenow/sdk/global'
import { UiPage } from '@servicenow/sdk/global'

// ✅ Fluent-safe, compile-first version.
// Key goals:
// - NO TypeScript casts/types
// - NO clientScript property (your SDK typing is problematic there)
// - Keep HTML short to avoid template-literal breakage
//
// Once this builds, you can expand the HTML/CSS incrementally.

UiPage({
  $id: Now.ID['commission_dashboard_page'],
  endpoint: 'x_823178_commissio_dashboard.do',
  description: 'Commission Management Dashboard',
  category: 'general',
  html: `
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Commission Dashboard</title>
  <style>
    body{margin:0;font-family:system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial;background:#0b1220;color:#fff}
    .wrap{max-width:1100px;margin:0 auto;padding:24px}
    .card{border:1px solid rgba(255,255,255,.12);border-radius:16px;background:rgba(255,255,255,.06);padding:18px}
    .muted{color:rgba(255,255,255,.7)}
    .row{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px;margin-top:14px}
    .kpi{border:1px solid rgba(255,255,255,.12);border-radius:16px;background:rgba(255,255,255,.05);padding:14px;min-height:84px}
    .label{font-size:12px;color:rgba(255,255,255,.7)}
    .value{margin-top:8px;font-size:22px;font-weight:800}
    @media(max-width:900px){.row{grid-template-columns:repeat(2,minmax(0,1fr))}}
    @media(max-width:520px){.row{grid-template-columns:1fr}}
  </style>
</head>
<body>
  <div class="wrap">
    <div class="card">
      <div style="font-size:20px;font-weight:900;">Commission Dashboard</div>
      <div class="muted" style="margin-top:6px;line-height:1.35;">
        Quota is credited on <b>deal close date</b>. Commissions are paid on <b>cash received</b>. Base is <b>invoice subtotal (ex tax)</b>. Only the <b>AE</b> earns when the deal closes.
      </div>
      <div class="row">
        <div class="kpi"><div class="label">Cash received (period)</div><div class="value">—</div></div>
        <div class="kpi"><div class="label">Commission payable (period)</div><div class="value">—</div></div>
        <div class="kpi"><div class="label">Quota credited (period)</div><div class="value">—</div></div>
        <div class="kpi"><div class="label">Exceptions needing action</div><div class="value">—</div></div>
      </div>
      <div class="muted" style="margin-top:14px;font-size:12px;">
        Next: wire KPIs from your tables (payments → invoices → deals), then expand this UI.
      </div>
    </div>
  </div>
</body>
</html>
  `,
})
