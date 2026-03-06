import { ScriptInclude } from '@servicenow/sdk/core'

ScriptInclude({
    $id: Now.ID['b809274d061a43ea835da077c6106fdd'],
    name: 'CommissionProgressDataService',
    script: Now.include('./sys_script_include_b809274d061a43ea835da077c6106fdd.server.js'),
    apiName: 'x_823178_commissio.CommissionProgressDataService',
    clientCallable: true,
    mobileCallable: false,
    sandboxCallable: true,
    accessibleFrom: 'public',
    active: true,
})
