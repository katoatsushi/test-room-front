import React from 'react';
import { BrowserRouter, Route, Switch} from 'react-router-dom';
import './index.css';
import Root from './components/root';
import { useSelector, useDispatch } from 'react-redux';
import SelectStoreFitness from './components/appointments/select_store_fitness_func';
import AppointmentNew from './components/appointments/appointment_new_func';
// import ScheduleCheck from './components/admins/admin_schedule_cehck';
import SignUp from './components/customers/sign_up';
import LogIn from './components/customers/login';
import MasterAdminLogIn from './components/master_admins/login';
import TrainerLogIn from  './components/trainers/login';
import AdminTop from './components/admins/admin_top';
import AdminLogIn from  './components/admins/login';
import CreateTrainer from './components/admins/create_trainer';
import MasterAdminTop from './components/master_admins/master_admin_top';
import CreateAdmin from './components/master_admins/create_admin';
import CreateCompany from './components/master_admins/create_companies';
// import Header from './components/applications/header';
// import Footer from './components/applications/footer';
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
import WeightNew from './components/customers/weight_new';
import RecordsHistory from './components/customers/records_history'
import EditCustomerStatus from './components/admins/edit_customer_status'
import AllCustomers from './components/admins/customer_all'
import AdminMenues from './components/admins/admin_menues'
import CreateAdminSchedule from './components/admins/create_admin_schedule'
import ManageTrainerShift from './components/admins/trainer_shifts'
import EvaluationData from './components/customers/customer_evaluation_data';
import TrainerMyPage from './components/trainers/my_page'
import SessionRecordList from './components/trainers/customers_session_records'
import TrainerCreateRecord from './components/trainers/record/create_record'
import SetTimesWeight from './components/trainers/record/set_times_weight'
import RecordConfirm from './components/trainers/record/record_confirm'
import ShowRecord from './components/trainers/record/record_show'
import EditMyProfile from './components/trainers/edit_profile/edit_my_profile'

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
        {/* <Route exact path="/" component={ Root } /> */}
        <Route exact path="/customer_info/new" component={ CreateCustomerInfo } />
        <Route exact path="/customer_info/jobs" component={ CustomerJobs } />
        <Route exact path="/customer_info/interests" component={ CustomerInterests } />
        <Route exact path="/customer_info/conditions" component={ CustomerConditions } />
        <Route exact path="/customer_info_indivi/new" component={ CreateCustomerIndividualInfo } />
        {/* TODO::customer_idを入力 */}
        <Route exact path="/customer/:customer_id/calendar_new" component={ SelectStoreFitness } />
        <Route exact path="/customer/:customer_id/calendar_new/customer_menu/:customer_menu_id/store/:store_id" component={ SelectDate } />
        <Route exact path="/customer/:customer_id/appointments/new/:store_id/:customer_menu_id/:year/:month/:day" component={AppointmentNew} />
        <Route exact path="/customer/:customer_id/appointments/confirm/:store_id/:customer_menu_id/:year/:month/:day" component={AppointmentConfirm} />
        <Route exact path="/admin/company_id/:company_id/year/:year/month/:month/day/:day" component={ AdminTop } />
        <Route exact path="/customer/sign_up" component={ SignUp } />
        <Route exact path="/v1/customer_auth/:token" component={ Confirmation } />
        <Route exact path="/customer/log_in" component={ LogIn } />
        <Route exact path="/master_admin/log_in" component={ MasterAdminLogIn } />
        <Route exact path="/trainer/log_in" component={ TrainerLogIn } />
        <Route exact path="/admin/log_in" component={ AdminLogIn } />
        <Route exact path="/master_admin" component={ MasterAdminTop } />            
        <Route exact path="/:company_id/admin/sign_up" component={ CreateAdmin } />  
        <Route exact path="/trainer/sign_up" component={ CreateTrainer } /> 
        <Route exact path="/company/new" component={ CreateCompany } /> 
        <Route exact path="/customer/:id" component={ CustomerHome } />
        <Route exact path="/customer/my_page/:id" component={ CustomerMyPage } />
        <Route exact path="/customer/weight/new" component={ WeightNew } />
        <Route exact path="/customer/:customer_id/appointment/:appointment_id/new_record" component={ AppointmentRecordNew } />
        <Route exact path="/customer_record/:customer_record_id/new" component={ AppointmentRecordMenusCreate  } />
        <Route exact path="/customer_records/:id" component={ RecordsHistory }　/>
        <Route exact path="/customer/edit_status/:id" component={ EditCustomerStatus }　/>
        <Route exact path="/customer_all" component={ AllCustomers }　/>
        <Route exact path="/admin_menues" component={ AdminMenues }　/>
        <Route exact path="/admin_schedule" component={ CreateAdminSchedule }　/>
        <Route exact path="/admin/trainer_shifts" component={ ManageTrainerShift }　/>
        <Route exact path="/customer_evaluation_data/:customer_id" component={ EvaluationData }　/>
        <Route exact path="/trainer/:id" component={ TrainerMyPage }　/>
        <Route exact path="/trainers/customer_session_records" component={ SessionRecordList }　/>
        <Route exact path="/trainers/:trainer_id/fitness/:fitness_id" component={ TrainerCreateRecord }　/>
        <Route exact path="/trainers/set/details" component={ SetTimesWeight}　/>
        <Route exact path="/trainers/record/confirm" component={  RecordConfirm }　/>
        <Route exact path="/record/:id" component={ ShowRecord }　/>
        <Route exact path="/trainer/edit/me" component={ EditMyProfile }　/>
  
    </Switch>
    </BrowserRouter>
  );
};

export default Routes;
