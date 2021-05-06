import { useSelector, useDispatch } from 'react-redux';
import { selectCurrentCustomer, selectCustomerHeaders, customerRemove } from '../../slices/customer';
import { selectCurrentTrainer, selectTrainerHeaders, trainerRemove, } from '../../slices/trainer';
import { selectCurrentAdmin, selectAdminHeaders, adminRemove, } from '../../slices/admin';
import { selectCurrentMasterAdmin, selectMasterAdminHeaders, masterAdminRemove, } from '../../slices/master_admin';

const DeleteAuth = () => {
    const dispatch = useDispatch();
    const customerHeader = useSelector(selectCustomerHeaders);
    const trainerHeader = useSelector(selectTrainerHeaders);
    const adminHeader = useSelector(selectAdminHeaders);
    const masterAdminHeader = useSelector(selectMasterAdminHeaders);
    if(customerHeader){
        dispatch(customerRemove());
    }else if(trainerHeader){
        dispatch(trainerRemove());
    }else if(adminHeader){
        dispatch(adminRemove());
    }else if(masterAdminHeader){
        dispatch(masterAdminRemove());
    }   
}

export default  DeleteAuth