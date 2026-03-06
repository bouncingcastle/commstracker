import { ScriptInclude } from '@servicenow/sdk/core'

ScriptInclude({
    $id: Now.ID['5b53e47aea7842ccb8f88776570fe52c'],
    name: 'CommissionProgressDataService',
    script: Now.include('./sys_script_include_5b53e47aea7842ccb8f88776570fe52c.server.js'),
    apiName: 'x_823178_commissio.CommissionProgressDataService',
    clientCallable: true,
    mobileCallable: false,
    sandboxCallable: true,
    accessibleFrom: 'public',
    active: true,
})
