import { ScriptInclude } from '@servicenow/sdk/core'

ScriptInclude({
    $id: Now.ID['7551c03c77dd492e8a284421317ff39d'],
    name: 'CommissionProgressHelper',
    script: Now.include('./sys_script_include_7551c03c77dd492e8a284421317ff39d.server.js'),
    apiName: 'x_823178_commissio.CommissionProgressHelper',
    clientCallable: true,
    mobileCallable: false,
    sandboxCallable: true,
    accessibleFrom: 'public',
    active: true,
})
