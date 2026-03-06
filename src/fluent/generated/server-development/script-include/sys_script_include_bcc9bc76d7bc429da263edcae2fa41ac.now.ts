import { ScriptInclude } from '@servicenow/sdk/core'

ScriptInclude({
    $id: Now.ID['bcc9bc76d7bc429da263edcae2fa41ac'],
    name: 'CommissionProgressDataService',
    script: Now.include('./sys_script_include_bcc9bc76d7bc429da263edcae2fa41ac.server.js'),
    apiName: 'x_823178_commissio.CommissionProgressDataService',
    clientCallable: true,
    mobileCallable: false,
    sandboxCallable: true,
    accessibleFrom: 'public',
    active: true,
})
