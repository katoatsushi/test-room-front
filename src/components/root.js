/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Container from '@material-ui/core/Container';
import { selectCurrentAdmin } from '../slices/admin';
import { selectCurrentTrainer} from '../slices/trainer';
import { selectCurrentMasterAdmin} from '../slices/master_admin';
import { selectCurrentCustomer, selectCustomerHeaders, customerRemove, selectCurrentCustomerStatus} from '../slices/customer';
import { setCustomerRecords, customerRecordRemove, getCustomerRecords } from '../slices/customer_record';
import RoomPlusBox from './customers/room_plus'
import ShiftNew  from './trainers/shifts/shift_new';
import Evaluation from './customers/evaluation'
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    '& > *': {
      margin: theme.spacing(1),
      width: theme.spacing(16),
      // height: theme.spacing(16),
    },
  },
}));

export default function Root() {
  const currentAdmin = useSelector(selectCurrentAdmin);
  const currentTrainer = useSelector(selectCurrentTrainer);
  const currentCustomer = useSelector(selectCurrentCustomer);
  const customerRecords = useSelector(getCustomerRecords);
  const customerStatus = useSelector(selectCurrentCustomerStatus);
  const currentMasterAdmin = useSelector(selectCurrentMasterAdmin);
  const [ auth, setAuth ] = useState(false);
  const classes = useStyles();
  const today = new Date()

  useEffect(()=>{
    if(currentAdmin){
      setAuth(true)
    }else if(currentTrainer){
      setAuth(true)
    }else if(currentCustomer){
      setAuth(true)
    }else if(currentMasterAdmin){
      setAuth(true)
    }
  },[])


  return (
    <Container component="main" maxWidth="xs">
    {!auth? (<>
      <div className={classes.root}>
        <Paper style={{width: '100%', padding: 5, fontSize: 12, backgroundColor: '#FFCCFF'}} variant="outlined" >
          何らかのエラーにより、ログアウトされました。<br/>
          もう一度右上のタブより、ログインしていただくようお願いいたします。
        </Paper>
      </div>
    </>):<></>}
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