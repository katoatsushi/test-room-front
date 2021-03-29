import React, { useEffect, useState, Component } from 'react';
import axios from 'axios'
import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import IconButton from '@material-ui/core/IconButton';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import Grid from '@material-ui/core/Grid';
import {selectCurrentAdmin, selectAdminHeaders} from '../../slices/admin'
import {selectCurrentTrainer, selectTrainerHeaders} from '../../slices/trainer'
import { useSelector, useDispatch } from 'react-redux';
import {
    BrowserRouter as Router,
    Route,
    Switch,
    useParams,
    useHistory,
    useLocation,
  } from 'react-router-dom';
import { DataGrid } from '@material-ui/data-grid';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import CustomerSetInfoDialog from './customer_set_info_dialog'
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Avatar from '@material-ui/core/Avatar';

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

function TrainerBooking({customer, setAllCustomers}){
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
              有料会員
              {customer.room_plus ? <div style={{fontSize: 15}}>プラス</div> : <></>}
              &nbsp;{customer.numbers_of_contractnt}回/月
          </Button>
      </>
      ) : (
      <Button variant="contained" color="secondary" onClick={handleClickOpen}>
          無料会員
      </Button>
      )} 
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{customer.first_name_kanji}{customer.last_name_kanji} 様の予約を行いますか？</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            このまま進むをクリックすると{customer.first_name_kanji}{customer.last_name_kanji} 様の予約を行うことができます。
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            キャンセル
          </Button>
          <Button onClick={handleHref} color="primary" autoFocus>
            このまま進む
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

function CustomerCell({customer, index, setAllCustomers}){
  const history = useHistory();
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
          通常:{customer.phone_number}<br/>
          緊急:{customer.emergency_phone_number}
        </StyledTableCell>
        <StyledTableCell align="left">
               {
                  (() => {
                    if (currentAdmin) {
                        return(<CustomerSetInfoDialog customer={customer} setAllCustomers={setAllCustomers}/>);
                    } else if(currentTrainer) {
                      return (<TrainerBooking customer={customer} setAllCustomers={setAllCustomers}/>);
                    }
                  })()
                }
        </StyledTableCell>
      </StyledTableRow>
    </>
  );
}

export default function AllCustomers(){
    const classes = useStyles();
    const url = `/get/all_customers`
    const serch_url = `/serch/customers`
    const [allCustomers, setAllCustomers] = useState([]);
    const [searchCustomers, setSearchCustomers] = useState([]);
    const adminHeaders = useSelector(selectAdminHeaders);
    const trainerHeaders = useSelector(selectTrainerHeaders);

    useEffect(()=>{

      if(adminHeaders){
       axios.get(url, adminHeaders)
        .then(function(res) {
            setAllCustomers(res.data.all_customers);
        })
        .catch(function(error) {
          console.log({error})
        });
      }else if(trainerHeaders){
       axios.get(url, trainerHeaders)
        .then(function(res) {
            setAllCustomers(res.data.all_customers);
        })
        .catch(function(error) {
          console.log({error})
        });
      }
    },[])
  console.log({allCustomers})
    return(
        <>
          <TableContainer component={Paper}>
            <Table className={classes.table} aria-label="customized table">
              <TableHead>
                <TableRow>
                  <StyledTableCell></StyledTableCell>
                  <StyledTableCell>お名前</StyledTableCell>
                  <StyledTableCell align="left">メールアドレス</StyledTableCell>
                  <StyledTableCell align="left">住所</StyledTableCell>
                  <StyledTableCell align="left">電話番号</StyledTableCell>
                  <StyledTableCell align="left">会員情報</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                { allCustomers.map((customer, index) => <CustomerCell key={index} customer={customer} setAllCustomers={setAllCustomers}/>) }
              </TableBody>
            </Table>
          </TableContainer>
        </>
    );  
}
