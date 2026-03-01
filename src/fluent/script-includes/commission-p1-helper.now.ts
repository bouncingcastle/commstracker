import '@servicenow/sdk/global'
import { Record } from '@servicenow/sdk/core'

Record({
    $id: Now.ID['commission_p1_helper_script_include'],
    table: 'sys_script_include',
    data: {
        name: 'CommissionP1Helper',
        active: false,
        client_callable: true,
        access: 'public',
        script: Now.include('../../server/script-includes/commission-p1-helper.js')
    }
})
