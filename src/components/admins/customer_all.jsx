/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import axios from 'axios'
import Paper from '@material-ui/core/Paper';
import {selectCurrentAdmin, selectAdminHeaders} from '../../slices/admin'
import {selectCurrentTrainer, selectTrainerHeaders} from '../../slices/trainer'
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import CustomerSetInfoDialog from './customer_set_info_dialog'
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Avatar from '@material-ui/core/Avatar';
import { trainerRemove } from '../../slices/trainer'
import { adminRemove } from '../../slices/admin'
import { useDispatch } from 'react-redux';
import { ForceCustomerSignOut, ForceTrainerSignOut, ForceAdminSignOut, ForceMasterAdminSignOut } from '../applications/forced_sign_out';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    margin: 10,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    wordWrap: 'break-word',
  },
  table: {
    minWidth: 700,
  },
}));

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
  root: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
  },
}))(TableRow);

function TrainerBooking({customer}){
    const [open, setOpen] = React.useState(false);
    const history = useHistory();
    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };
    function handleHref(){
      history.push(`/customer/${customer.id}/calendar_new`);
      setOpen(false);
    }
  return(
    <>
      {customer.paid ? (
      <>
          <Button variant="contained" color="primary" onClick={handleClickOpen}>
              ????????????
              {customer.room_plus ? <div style={{fontSize: 15}}>?????????</div> : <></>}
              &nbsp;{customer.numbers_of_contractnt}???/???
          </Button>
      </>
      ) : (
      <Button variant="contained" color="secondary" onClick={handleClickOpen}>
          ????????????
      </Button>
      )} 
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{customer.first_name_kanji}{customer.last_name_kanji} ?????????????????????????????????</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            ??????????????????????????????????????????{customer.first_name_kanji}{customer.last_name_kanji} ?????????????????????????????????????????????
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            ???????????????
          </Button>
          <Button onClick={handleHref} color="primary" autoFocus>
            ??????????????????
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

function CustomerCell({customer, index, setAllCustomers, setTheChange}){
  const classes = useStyles();
  const currentAdmin = useSelector(selectCurrentAdmin);
  const currentTrainer = useSelector(selectCurrentTrainer);
  return(
    <>
      <StyledTableRow key={index}>
        <StyledTableCell align="left">
          {customer.avatar_url? (
              <Avatar variant="rounded" style={{marginLeft: 'auto'}} src={customer.avatar_url} className={classes.rounded}/>
            ):(
              <Avatar variant="rounded" style={{marginLeft: 'auto'}} className={classes.rounded}/>
          )}
        </StyledTableCell>
        <StyledTableCell component="th" scope="row" >
          <Button color="primary" href={`/customer/my_page/${customer.id}`}>
              {customer.first_name_kana} {customer.last_name_kana}<br/>
              {customer.first_name_kanji} {customer.last_name_kanji}
          </Button>
        </StyledTableCell>
        <StyledTableCell align="left">{customer.email}</StyledTableCell>
        <StyledTableCell align="left">{customer.address}</StyledTableCell>
        <StyledTableCell align="left">
          ??????:{customer.phone_number}<br/>
          ??????:{customer.emergency_phone_number}
        </StyledTableCell>
        <StyledTableCell align="left">
               {
                  (() => {
                    if (currentAdmin) {
                        return(<CustomerSetInfoDialog customer={customer} setAllCustomers={setAllCustomers} setTheChange={setTheChange}/>);
                    } else if(currentTrainer) {
                      return (<TrainerBooking customer={customer}/>);
                    }
                  })()
                }
        </StyledTableCell>
      </StyledTableRow>
    </>
  );
}

export default function AllCustomers(){
    const dispatch = useDispatch();
    const history = useHistory();
    const classes = useStyles();
    const url = `/get/all_customers`
    const admin_url = `/admin/get/all_customers`
    const trainer_url = `/trainer/get/all_customers`

    const [allCustomers, setAllCustomers] = useState([]);
    const adminHeaders = useSelector(selectAdminHeaders);
    const trainerHeaders = useSelector(selectTrainerHeaders);
    const [theChange, setTheChange] = useState(false);

    useEffect(()=>{

      if(adminHeaders){
       axios.get(admin_url, adminHeaders)
        .then(function(res) {
            if(res.data.error){
              ForceAdminSignOut()
            }else{
              setAllCustomers(res.data.all_customers);
            }
        })
        .catch(function(error) {
          dispatch(adminRemove());
          history.push("/admin/log_in")
        });
      }else if(trainerHeaders){

      axios.get(trainer_url, trainerHeaders)
        .then(function(res) {
          setAllCustomers(res.data.all_customers);
        })
        .catch(function(error) {
          dispatch(trainerRemove());
          history.push("/trainer/log_in")
        });

      }
    },[theChange])

    return(
        <>
          <TableContainer component={Paper}>
            <Table className={classes.table} aria-label="customized table">
              <TableHead>
                <TableRow>
                  <StyledTableCell></StyledTableCell>
                  <StyledTableCell>?????????</StyledTableCell>
                  <StyledTableCell align="left">?????????????????????</StyledTableCell>
                  <StyledTableCell align="left">??????</StyledTableCell>
                  <StyledTableCell align="left">????????????</StyledTableCell>
                  <StyledTableCell align="left">
                  ????????????
                  </StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                { allCustomers.map((customer, index) => <CustomerCell key={index} customer={customer} setAllCustomers={setAllCustomers} setTheChange={setTheChange} />) }
              </TableBody>
            </Table>
          </TableContainer>
        </>
    );  
}
