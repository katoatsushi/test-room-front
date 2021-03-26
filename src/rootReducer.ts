import { combineReducers } from 'redux';
// eslint-disable-next-line import/no-cycle
import currentCustomerReducer from './slices/customer';
import currentTrainerReducer  from './slices/trainer';
import currentAdminReducer  from './slices/admin';
import currentMasterAdminReducer  from './slices/master_admin';
import customerRecordsReducer  from './slices/customer_record';

export default combineReducers({ 
                                currentCustomer: currentCustomerReducer,
                                currentTrainer: currentTrainerReducer,
                                currentAdmin: currentAdminReducer,
                                currentMasterAdmin: currentMasterAdminReducer,
                                customerRecord: customerRecordsReducer
                            });
