import { ScriptInclude } from '@servicenow/sdk/core'

ScriptInclude({
    $id: Now.ID['edd1efb116eb4a2ca800a5018af84285'],
    name: 'CommissionProgressDataService',
    script: Now.include('./sys_script_include_edd1efb116eb4a2ca800a5018af84285.server.js'),
    apiName: 'x_823178_commissio.CommissionProgressDataService',
    clientCallable: true,
    mobileCallable: false,
    sandboxCallable: true,
    accessibleFrom: 'public',
    active: true,
})
