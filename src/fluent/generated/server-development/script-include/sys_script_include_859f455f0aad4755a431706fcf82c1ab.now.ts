import { ScriptInclude } from '@servicenow/sdk/core'

ScriptInclude({
    $id: Now.ID['859f455f0aad4755a431706fcf82c1ab'],
    name: 'CommissionProgressDataService',
    script: Now.include('./sys_script_include_859f455f0aad4755a431706fcf82c1ab.server.js'),
    apiName: 'x_823178_commissio.CommissionProgressDataService',
    clientCallable: true,
    mobileCallable: false,
    sandboxCallable: true,
    accessibleFrom: 'public',
    active: true,
})
