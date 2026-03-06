import { ScriptInclude } from '@servicenow/sdk/core'

ScriptInclude({
    $id: Now.ID['1dbcef9a485b40ed874a89d29378c584'],
    name: 'CommissionProgressDataService',
    script: Now.include('./sys_script_include_1dbcef9a485b40ed874a89d29378c584.server.js'),
    apiName: 'x_823178_commissio.CommissionProgressDataService',
    clientCallable: true,
    mobileCallable: false,
    sandboxCallable: true,
    accessibleFrom: 'public',
    active: true,
})
