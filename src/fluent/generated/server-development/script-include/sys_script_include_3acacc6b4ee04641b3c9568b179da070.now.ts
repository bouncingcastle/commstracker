import { ScriptInclude } from '@servicenow/sdk/core'

ScriptInclude({
    $id: Now.ID['3acacc6b4ee04641b3c9568b179da070'],
    name: 'CommissionP1Helper',
    script: Now.include('./sys_script_include_3acacc6b4ee04641b3c9568b179da070.server.js'),
    apiName: 'x_823178_commissio.CommissionP1Helper',
    clientCallable: true,
    mobileCallable: false,
    sandboxCallable: true,
    accessibleFrom: 'public',
    active: false,
})
