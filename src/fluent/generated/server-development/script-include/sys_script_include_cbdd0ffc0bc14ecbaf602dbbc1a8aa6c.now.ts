import { ScriptInclude } from '@servicenow/sdk/core'

ScriptInclude({
    $id: Now.ID['cbdd0ffc0bc14ecbaf602dbbc1a8aa6c'],
    name: 'CommissionProgressDataService',
    script: Now.include('./sys_script_include_cbdd0ffc0bc14ecbaf602dbbc1a8aa6c.server.js'),
    apiName: 'x_823178_commissio.CommissionProgressDataService',
    clientCallable: true,
    mobileCallable: false,
    sandboxCallable: true,
    accessibleFrom: 'public',
    active: true,
})
