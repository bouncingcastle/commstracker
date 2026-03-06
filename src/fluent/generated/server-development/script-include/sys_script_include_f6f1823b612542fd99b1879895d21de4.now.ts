import { ScriptInclude } from '@servicenow/sdk/core'

ScriptInclude({
    $id: Now.ID['f6f1823b612542fd99b1879895d21de4'],
    name: 'CommissionProgressDataService',
    script: Now.include('./sys_script_include_f6f1823b612542fd99b1879895d21de4.server.js'),
    apiName: 'x_823178_commissio.CommissionProgressDataService',
    clientCallable: true,
    mobileCallable: false,
    sandboxCallable: true,
    accessibleFrom: 'public',
    active: true,
})
