import { ScriptInclude } from '@servicenow/sdk/core'

ScriptInclude({
    $id: Now.ID['e444e4c410704be0a96e717af02b2e63'],
    name: 'CommissionProgressDataService',
    script: Now.include('./sys_script_include_e444e4c410704be0a96e717af02b2e63.server.js'),
    apiName: 'x_823178_commissio.CommissionProgressDataService',
    clientCallable: true,
    mobileCallable: false,
    sandboxCallable: true,
    accessibleFrom: 'public',
    active: true,
})
