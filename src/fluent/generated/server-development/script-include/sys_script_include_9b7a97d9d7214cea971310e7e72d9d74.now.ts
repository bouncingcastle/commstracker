import { ScriptInclude } from '@servicenow/sdk/core'

ScriptInclude({
    $id: Now.ID['9b7a97d9d7214cea971310e7e72d9d74'],
    name: 'CommissionProgressDataService',
    script: Now.include('./sys_script_include_9b7a97d9d7214cea971310e7e72d9d74.server.js'),
    apiName: 'x_823178_commissio.CommissionProgressDataService',
    clientCallable: true,
    mobileCallable: false,
    sandboxCallable: true,
    accessibleFrom: 'public',
    active: true,
})
