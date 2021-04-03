/* eslint-disable react/prop-types */
import React  from 'react';
import { useSelector } from 'react-redux';
import Container from '@material-ui/core/Container';
import { selectCurrentAdmin } from '../slices/admin';
import { selectCurrentTrainer} from '../slices/trainer';
import { selectCurrentCustomer, selectCustomerHeaders, customerRemove, } from '../slices/customer';
import { setCustomerRecords, customerRecordRemove, getCustomerRecords } from '../slices/customer_record';
import RoomPlusBox from './customers/room_plus'
import ShiftNew  from './trainers/shifts/shift_new';
import Evaluation from './customers/evaluation'

export default function Root() {
  const currentAdmin = useSelector(selectCurrentAdmin);
  const currentTrainer = useSelector(selectCurrentTrainer);
  const currentCustomer = useSelector(selectCurrentCustomer);
  const customerRecords = useSelector(getCustomerRecords);

  const today = new Date()
  return (
    <Container component="main" maxWidth="xs">
      {currentTrainer? (
        <ShiftNew year={today.getFullYear()} month={today.getMonth()} />
      ):(<></>)}
      {currentCustomer? (
        <>
        <RoomPlusBox/>
        {customerRecords? (
          <Evaluation/>
        ):(<></>)}
        </>
      ):(<></>)}


         {currentAdmin?.id ? (
              <div>企業ID:{currentAdmin.company_id}</div>
            ) : (
              <>
              </>
            )}
    </Container>
  );
}