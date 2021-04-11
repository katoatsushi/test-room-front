import { useHistory } from 'react-router-dom';
import { customerRemove } from '../../slices/customer';
import { trainerRemove } from '../../slices/trainer';
import { adminRemove } from '../../slices/admin';
import { masterAdminRemove } from '../../slices/master_admin';
import { useDispatch } from 'react-redux';

export default function ForceCustomerSignOut(){
    const dispatch = useDispatch();
    const history = useHistory();
    dispatch(customerRemove());
    // history.push(`/`)
    history.push(`/customer/sign_up`)
    // window.location.reload()
}
export function ForceTrainerSignOut(){
    console.log("ログアウトする")
    const dispatch = useDispatch();
    dispatch(trainerRemove());
    // history.push(`/`)
    // history.push(`/trainer/log_in`)
    // // window.location.reload()
}

export function ForceAdminSignOut(){
    const dispatch = useDispatch();
    const history = useHistory();
    dispatch(trainerRemove());
    // history.push(`/`)
    history.push(`/admin/log_in`)
    // window.location.reload()
}
export function ForceMasterAdminSignOut(){
    const dispatch = useDispatch();
    const history = useHistory();
    dispatch(trainerRemove());
    // history.push(`/`)
    history.push(`/master_admin/log_in`)
    // window.location.reload()
}

// export default ForceCustomerSignOut()
// export ForceTrainerSignOut()
// export ForceAdminSignOut()
// export ForceMasterAdminSignOut()