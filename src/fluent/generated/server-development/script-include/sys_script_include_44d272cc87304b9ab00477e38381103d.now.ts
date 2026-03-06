import { ScriptInclude } from '@servicenow/sdk/core'

ScriptInclude({
    $id: Now.ID['44d272cc87304b9ab00477e38381103d'],
    name: 'CommissionProgressDataService',
    script: Now.include('./sys_script_include_44d272cc87304b9ab00477e38381103d.server.js'),
    apiName: 'x_823178_commissio.CommissionProgressDataService',
    clientCallable: true,
    mobileCallable: false,
    sandboxCallable: true,
    accessibleFrom: 'public',
    active: true,
})
