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
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Avatar from '@material-ui/core/Avatar';
import { trainerRemove } from '../../slices/trainer'
import { adminRemove } from '../../slices/admin'
import { useDispatch } from 'react-redux';
// import { ForceCustomerSignOut, ForceTrainerSignOut, ForceAdminSignOut, ForceMasterAdminSignOut } from '../applications/forced_sign_out';

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

function TrainerCell({trainer, index}){
  const classes = useStyles();
  const history = useHistory();

  return(
    <>
      <StyledTableRow key={index}>
        <StyledTableCell align="left">
        </StyledTableCell>
        <StyledTableCell component="th" scope="row" >
        
          {/* <Button color="primary" onClick = {moveToTrainePage}> */}
          <Button color="primary" href={`/trainer_page/${trainer.id}`}>
              {trainer.first_name_kana} {trainer.last_name_kana}<br/>
              {trainer.first_name_kanji} {trainer.last_name_kanji}
          </Button>

        </StyledTableCell>
        <StyledTableCell align="left">{trainer.email}</StyledTableCell>
        <StyledTableCell align="left">
          通常:{trainer.phone_number}<br/>
          緊急:{trainer.emergency_phone_number}
        </StyledTableCell>
      </StyledTableRow>
    </>
  );
}

export default function AllTrainers(){
    const dispatch = useDispatch();
    const history = useHistory();
    const classes = useStyles();
    const url = `/admin/get/trainer_all`
    const [allTrainers, setAllTrainers] = useState([]);
    const adminHeaders = useSelector(selectAdminHeaders);
    const [theChange, setTheChange] = useState(false);

    useEffect(()=>{
      if(adminHeaders){
       axios.get(url, adminHeaders)
        .then(function(res) {
            setAllTrainers(res.data.trainers);
        })
        .catch(function(error) {
          dispatch(adminRemove());
          history.push("/admin/log_in")
        });
      }
    },[])

    return(
        <>
          <TableContainer component={Paper}>
            <Table className={classes.table} aria-label="customized table">
              <TableHead>
                <TableRow>
                  <StyledTableCell></StyledTableCell>
                  <StyledTableCell>お名前</StyledTableCell>
                  <StyledTableCell align="left">メールアドレス</StyledTableCell>
                  <StyledTableCell align="left">電話番号</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                { allTrainers.map((trainer, index) => <TrainerCell key={index} trainer={trainer} />) }
              </TableBody>
            </Table>
          </TableContainer>
        </>
    );  
}
