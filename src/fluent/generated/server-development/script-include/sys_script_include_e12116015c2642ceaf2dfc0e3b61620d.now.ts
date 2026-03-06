import { ScriptInclude } from '@servicenow/sdk/core'

ScriptInclude({
    $id: Now.ID['e12116015c2642ceaf2dfc0e3b61620d'],
    name: 'CommissionProgressHelper',
    script: Now.include('./sys_script_include_e12116015c2642ceaf2dfc0e3b61620d.server.js'),
    apiName: 'x_823178_commissio.CommissionProgressHelper',
    clientCallable: true,
    mobileCallable: false,
    sandboxCallable: true,
    accessibleFrom: 'public',
    active: true,
})
