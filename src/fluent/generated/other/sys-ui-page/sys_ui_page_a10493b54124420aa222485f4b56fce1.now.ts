import { UiPage } from '@servicenow/sdk/core'

UiPage({
    $id: Now.ID['a10493b54124420aa222485f4b56fce1'],
    category: 'general',
    endpoint: 'x_823178_commissio_plan_hierarchy.do',
    description: 'Commission Plan Structure Hierarchy',
    html: `
<html lang="en">
  <head>
    <meta charset="UTF-8"></meta>
    <meta name="viewport" content="width=device-width, initial-scale=1.0"></meta>
    <title>Plan Structure Hierarchy</title>
    <style>:root{
      --bg:#0b1020;--panel:#101a33;--border:rgba(255,255,255,.12);
      --text:#e9eefc;--muted:rgba(233,238,252,.72);--brand:#6ea8ff;
      --radius:10px;
    }
    *{box-sizing:border-box}
    body{margin:0;background:var(--bg);color:var(--text);font:14px/1.5 -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif}
    .wrap{max-width:980px;margin:0 auto;padding:24px}
    h1{margin:0 0 8px 0;font-size:28px}
    .sub{color:var(--muted);margin-bottom:20px}
    .panel{background:var(--panel);border:1px solid var(--border);border-radius:var(--radius);padding:16px;margin-bottom:16px}
    .tree{margin:8px 0 0 0;padding-left:0;list-style:none}
    .tree li{margin:10px 0;padding:12px;border:1px solid var(--border);border-radius:8px;background:rgba(255,255,255,.03)}
    .label{font-weight:700}
    .meta{display:block;color:var(--muted);font-size:12px;margin-top:4px}
    a{color:var(--brand);text-decoration:none}
    a:hover{text-decoration:underline}
    .actions{display:flex;flex-wrap:wrap;gap:10px;margin-top:14px}
    .btn{display:inline-block;padding:8px 12px;border:1px solid var(--border);border-radius:8px;background:rgba(255,255,255,.04)}</style>
  </head>
  <body>
    <div class="wrap">
      <h1>Plan Structure Hierarchy</h1>
      <div class="sub">Canonical hierarchy: Commission Plan → Targets, Tiers, Bonuses, Recognition Policies.</div>
      <div class="panel">
        <div>
          <strong>Selected Plan ID:</strong>
          <span id="planId">(not provided)</span>
        </div>
        <div class="actions" id="topActions"></div>
      </div>
      <div class="panel">
        <ul class="tree" id="tree"></ul>
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

      function row(label, href, note){
        return '<li>' +
          '<a class="label" href="' + href + '">' + label + '</a>' +
          '<span class="meta">' + note + '</span>' +
        '</li>';
      }

      var planId = q('sysparm_plan_id') || q('plan_id') || q('sys_id');
      var planIdEl = document.getElementById('planId');
      var treeEl = document.getElementById('tree');
      var actionsEl = document.getElementById('topActions');

      if (!planId) {
        planIdEl.textContent = '(not provided)';
        treeEl.innerHTML = '<li><span class="label">No plan selected</span><span class="meta">Open Plan Structure Reference, then open a specific plan and launch hierarchy with that plan sys_id.</span></li>';
        actionsEl.innerHTML =
          '<a class="btn" href="/x_823178_commissio_commission_plans_list.do?sysparm_query=is_active=true^ORDERBYsales_rep^ORDERBYDESCeffective_start_date">Open Plan Structure Reference</a>' +
          '<a class="btn" href="/x_823178_commissio_commission_plans.do?sys_id=-1&sysparm_view=default">Create New Plan</a>';
        return;
      }

      planIdEl.textContent = planId;

      actionsEl.innerHTML =
        '<a class="btn" href="/x_823178_commissio_commission_plans.do?sys_id=' + planId + '&sysparm_view=default">Open Plan Form</a>' +
        '<a class="btn" href="/x_823178_commissio_commission_plans_list.do?sysparm_query=sys_id=' + planId + '">Open Plan Record in List</a>';

      treeEl.innerHTML =
        row('Commission Plan', '/x_823178_commissio_commission_plans.do?sys_id=' + planId + '&sysparm_view=default', 'Parent configuration record') +
        row('└─ Plan Targets', '/x_823178_commissio_plan_targets_list.do?sysparm_query=commission_plan=' + planId + '^ORDERBYdeal_type_ref', 'Quota by deal type') +
        row('└─ Plan Tiers', '/x_823178_commissio_plan_tiers_list.do?sysparm_query=commission_plan=' + planId + '^ORDERBYattainment_floor_percent', 'Rate bands and accelerators') +
        row('└─ Plan Bonuses', '/x_823178_commissio_plan_bonuses_list.do?sysparm_query=commission_plan=' + planId + '^ORDERBYbonus_name', 'Structured bonus rules') +
        row('└─ Recognition Policies', '/x_823178_commissio_plan_recognition_policies_list.do?sysparm_query=commission_plan=' + planId + '^ORDERBYDESCeffective_start_date', 'Versioned recognition basis policies');
    })();
  `,
})
