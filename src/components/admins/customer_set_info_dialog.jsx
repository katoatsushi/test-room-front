/* eslint-disable react/prop-types */
import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import MenuItem from '@material-ui/core/MenuItem';
import axios from 'axios';
import { selectAdminHeaders} from '../../slices/admin'
import { useSelector} from 'react-redux';

const useStyles = makeStyles((theme) => ({
  root: {
    '& .MuiTextField-root': {
      margin: theme.spacing(1),
      width: '25ch',
    },
  },
}));

export default function CustomerSetInfoDialog({customer, setAllCustomers,setTheChange}) {
    const classes = useStyles();
    const adminHeaders = useSelector(selectAdminHeaders);
    const [change, setChange] = React.useState(false);
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setChange(true);
    };

    const [paid, setPaid] = React.useState();
    const handlePaidChange = (event) => {
        setPaid(event.target.value);
        if (event.target.value){
            setCurrency(0);
            setCurrency(false);
        }
        setChange(true);
    };
    const [roomPlus, setRoomPlus] = React.useState();
    const handleRoomPlusChange = (event) => {
        setRoomPlus(event.target.value);
        setChange(true);
    };
    const [currency, setCurrency] = React.useState(0);
    const handleCurrencyChange = (event) => {
        setCurrency(event.target.value);
        setChange(true);
    };
    const numbers = [ 4,8,12,16,20,24,28 ];

    useEffect(()=>{
        if(customer.room_plus){
            setRoomPlus('true');
        }else{  
            setRoomPlus('false');
        }
        if(customer.paid){
            setPaid('true');
        }else{  
            setPaid('false');
        }
    },[])

    function handleUpdateSubmit(){
        const url = `/customer_statuses/${customer.id}`
        axios.put(url, {paid: paid,room_plus: roomPlus, dozen_sessions: false, numbers_of_contractnt: currency}, adminHeaders)
        .then(res => {
            handleClose();
            setTheChange((prev) => (!prev))
        })
        .catch(error => {
            console.log({error})
        });
    }
  return (
    <div>
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
      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">???????????????????????????</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ??????:{customer.first_name} {customer.last_name} / {customer.age}??? / {customer.sex}
          </DialogContentText>
          <DialogContentText>
            ?????????????????????:{customer.email}
          </DialogContentText>
        <hr/>
        <FormControl component="paid">
            <FormLabel component="paid">????????????</FormLabel>
            <RadioGroup
                value={paid}
                onChange={handlePaidChange}
            >
                <FormControlLabel control={<Radio />} label="????????????" value={'true'}/>
                <FormControlLabel control={<Radio />} label="????????????" value={'false'}/>
            </RadioGroup>
        </FormControl><hr/>
        {paid=="true" ? (
            <>
            <FormControl component="fieldset">
                <form className={classes.root} noValidate autoComplete="off">
                <div>
                    <FormLabel component="legend">???????????????????????????????????????</FormLabel>
                    <TextField
                    id="filled-select-currency"
                    select
                    label="????????????????????????"
                    defaultValue={customer.numbers_of_contractnt}
                    onChange={handleCurrencyChange}
                    variant="filled"
                    >
                    {numbers.map((n, index) => (
                        <MenuItem key={index} value={n}>
                            {n}???/???
                        </MenuItem>
                    ))}
                    </TextField>
                </div>
                </form>
            </FormControl><hr/>
            </>
        ) : (
            <></>
        )} 

        <FormControl component="fieldset">
            <FormLabel component="legend">??????????????????</FormLabel>
            <RadioGroup
                aria-label="gender"
                name="customer_nfo"
                value={roomPlus}
                onChange={handleRoomPlusChange}
            >
                <FormControlLabel value='true' control={<Radio />} label="??????" />
                <FormControlLabel value='false' control={<Radio />} label="?????????" />
            </RadioGroup>
        </FormControl>

        </DialogContent>
        <DialogActions>
            <Button onClick={handleClose}>??????</Button>
            {change ? (
                <Button variant="contained" onClick={handleUpdateSubmit} color="secondary">
                    ????????????
                </Button>
            ) : (
                <Button variant="contained" disabled>
                    ????????????
                </Button>
            )} 
        </DialogActions>
      </Dialog>
    </div>
  );
}
