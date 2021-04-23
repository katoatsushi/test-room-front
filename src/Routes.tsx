/* eslint-disable react/prop-types */
import React from 'react';
import { BrowserRouter, Route, Switch} from 'react-router-dom';
import './index.css';
import Root from './components/root';
import { useSelector, useDispatch } from 'react-redux';
import SelectStoreFitness from './components/appointments/select_store_fitness_func';
import AppointmentNew from './components/appointments/appointment_new_func';
// customer auth
import SignUp from './components/customers/auth/sign_up';
import LogIn from './components/customers/auth/login';
import CustomerPasswordReset from './components/customers/auth/password_reset'
import CustomerPasswordEdit from './components/customers/auth/password_edit'
// trainer auth
import TrainerLogIn from  './components/trainers/auth/login';
import TrainerPasswordReset from './components/trainers/auth/password_reset'
import TrainerPasswordEdit from './components/trainers/auth/password_edit'

import MasterAdminLogIn from './components/master_admins/login';
import AdminTop from './components/admins/admin_top';
import AdminLogIn from  './components/admins/login';
import AllTrainers from './components/admins/trainer_all';
import CreateTrainer from './components/admins/create_trainer';
import MasterAdminTop from './components/master_admins/master_admin_top';
import CreateAdmin from './components/master_admins/create_admin';
import CreateCompany from './components/master_admins/create_companies';
import CustomerHome from './components/customers/home';
import CustomerMyPage from './components/customers/my_page'
import AppointmentRecordNew from './components/appointment_records/new';
import AppointmentRecordMenusCreate from './components/appointment_records/create_menues';
import SelectDate from './components/appointments/select_date';
import AppointmentConfirm from './components/appointments/appointent_confirm';
import Confirmation from './components/customers/confirmation';
import CreateCustomerInfo from './components/customers/customer_info/create_customer_info';
import CustomerJobs from './components/customers/customer_individual_info/customer_jobs';
import CustomerInterests from './components/customers/customer_individual_info/customer_interests'
import CustomerConditions from './components/customers/customer_individual_info/customer_condition'
import CreateCustomerIndividualInfo from  './components/customers/customer_individual_info/customer_individual_info'
import { selectCurrentCustomer, selectCustomerHeaders, customerRemove, } from './slices/customer';
import CustomerWeightNew from './components/customers/weight_new';
import RecordsHistory from './components/customers/records_history'
import AllCustomers from './components/admins/customer_all'
import AdminMenues from './components/admins/admin_menues'
import CreateAdminSchedule from './components/admins/create_admin_schedule'
import ManageTrainerShift from './components/admins/shifts/trainer_shifts'
import ThisMonthTrainerShift from './components/admins/shifts/this_month_trainer_shift'
import EvaluationData from './components/customers/customer_evaluation_data';
import TrainerMyPage from './components/trainers/my_page'
import SessionRecordList from './components/trainers/customers_session_records'
import TrainerCreateRecord from './components/trainers/record/create_record'
import SetTimesWeight from './components/trainers/record/set_times_weight'
import RecordConfirm from './components/trainers/record/record_confirm'
import ShowRecord from './components/trainers/record/record_show'
import EditMyProfile from './components/trainers/edit_profile/edit_my_profile'
import AdminEditStore from './components/admins/edit_store'

const Routes: React.FC = () => {
  const currentCustomer = useSelector(selectCurrentCustomer);
  return (
    <BrowserRouter>
    <Switch>
        {currentCustomer?.id ? (
            <Route exact path="/" component={ Root } />
        ) : (
            <Route exact path="/" component={ Root } />
        )}
        {/* customer */}
        <Route exact path="/customer_info/new" component={ CreateCustomerInfo } />
        <Route exact path="/customer_info/jobs" component={ CustomerJobs } />
        <Route exact path="/customer_info/interests" component={ CustomerInterests } />
        <Route exact path="/customer_info/conditions" component={ CustomerConditions } />
        <Route exact path="/customer_info_indivi/new" component={ CreateCustomerIndividualInfo } />
        <Route exact path="/customer_page/:id" component={ CustomerHome } />
        <Route exact path="/customer/my_page/:id" component={ CustomerMyPage } />
        <Route exact path="/customer/weight/new" component={ CustomerWeightNew } />
        {/* appointment */}
        <Route exact path="/customer/:customer_id/calendar_new" component={ SelectStoreFitness } />
        <Route exact path="/customer/:customer_id/calendar_new/customer_menu/:customer_menu_id/store/:store_id" component={ SelectDate } />
        <Route exact path="/customer/:customer_id/appointments/new/:store_id/:customer_menu_id/:year/:month/:day" component={AppointmentNew} />
        <Route exact path="/customer/:customer_id/appointments/confirm/:store_id/:customer_menu_id/:year/:month/:day" component={AppointmentConfirm} />
        <Route exact path="/customer_evaluation_data/:customer_id" component={ EvaluationData } />
        {/* customer auth */}
        <Route exact path="/customer/sign_up" component={ SignUp } />
        <Route exact path="/customer/log_in" component={ LogIn } />
        <Route exact path="/customer/password/reset" component={ CustomerPasswordReset } />
        <Route exact path="/v1/customer_auth/password/:token" component={ CustomerPasswordEdit } />
        <Route exact path="/v1/customer_auth/:token" component={ Confirmation } />
        {/* trainer */}
        <Route exact path="/customer/:customer_id/appointment/:appointment_id/new_record" component={ AppointmentRecordNew } />
        <Route exact path="/customer_record/:customer_record_id/new" component={ AppointmentRecordMenusCreate  } />
        <Route exact path="/customer_records/:id" component={ RecordsHistory } />
        <Route exact path="/customer_all" component={ AllCustomers } />
        <Route exact path="/trainer_page/:id" component={ TrainerMyPage } />
        <Route exact path="/trainers/customer_session_records" component={ SessionRecordList } />
        <Route exact path="/trainers/:trainer_id/fitness/:fitness_id" component={ TrainerCreateRecord } />
        <Route exact path="/trainers/set/details" component={ SetTimesWeight} />
        <Route exact path="/trainers/record/confirm" component={  RecordConfirm } />
        {/* trainer auth */}
        <Route exact path="/trainer/log_in" component={ TrainerLogIn } />
        <Route exact path="/trainer/password/reset" component={ TrainerPasswordReset } />
        <Route exact path="/v1/trainer_auth/password/:token" component={ TrainerPasswordEdit } />
        {/* admim auth */}
        <Route exact path="/admin/log_in" component={ AdminLogIn } /> 
        {/* admin */}
        <Route exact path="/record/:id" component={ ShowRecord } />
        <Route exact path="/admin/trainers/all" component={ AllTrainers } />
        <Route exact path="/trainer/edit/me" component={ EditMyProfile } />
        <Route exact path="/admin/company_id/:company_id/year/:year/month/:month/day/:day" component={ AdminTop } />
        <Route exact path="/trainer/sign_up" component={ CreateTrainer } /> 
        <Route exact path="/admin_menues" component={ AdminMenues } />
        <Route exact path="/admin_schedule" component={ CreateAdminSchedule } />
        <Route exact path="/admin/trainer_shifts" component={ ManageTrainerShift } />
        <Route exact path="/admin/this_month/trainer_shift" component={ ThisMonthTrainerShift } />
        <Route exact path="/admin/store/all" component={ AdminEditStore } />
        {/* master admin auth */}
        <Route exact path="/master_admin/log_in" component={ MasterAdminLogIn } />
        {/* master admin */}
        <Route exact path="/master_admin" component={ MasterAdminTop } />            
        <Route exact path="/:company_id/admin/sign_up" component={ CreateAdmin } />
        <Route exact path="/company/new" component={ CreateCompany } /> 
    </Switch>
    </BrowserRouter>
  );
};

export default Routes;
