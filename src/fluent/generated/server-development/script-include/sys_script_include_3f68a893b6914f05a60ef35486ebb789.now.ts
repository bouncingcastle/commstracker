import { ScriptInclude } from '@servicenow/sdk/core'

ScriptInclude({
    $id: Now.ID['3f68a893b6914f05a60ef35486ebb789'],
    name: 'CommissionProgressDataService',
    script: Now.include('./sys_script_include_3f68a893b6914f05a60ef35486ebb789.server.js'),
    apiName: 'x_823178_commissio.CommissionProgressDataService',
    clientCallable: true,
    mobileCallable: false,
    sandboxCallable: true,
    accessibleFrom: 'public',
    active: true,
})
