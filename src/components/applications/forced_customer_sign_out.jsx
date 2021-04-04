import { useHistory } from 'react-router-dom';
import { customerRemove } from '../../slices/customer';
import { useDispatch } from 'react-redux';

export default function ForceCustomerSignOut(){
    const dispatch = useDispatch();
    const history = useHistory();
    dispatch(customerRemove());
    history.push(`/`)
}