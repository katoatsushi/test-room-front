import { combineReducers } from 'redux';
import currentCustomerReducer from './slices/customer';
import currentTrainerReducer  from './slices/trainer';
import currentAdminReducer  from './slices/admin';
import currentMasterAdminReducer  from './slices/master_admin';
import customerRecordsReducer  from './slices/customer_record';
import snackBarReducer  from './slices/snack_bar';

export default combineReducers({ 
                                currentCustomer: currentCustomerReducer,
                                currentTrainer: currentTrainerReducer,
                                currentAdmin: currentAdminReducer,
                                currentMasterAdmin: currentMasterAdminReducer,
                                customerRecord: customerRecordsReducer,
                                snackBar: snackBarReducer
                            });
