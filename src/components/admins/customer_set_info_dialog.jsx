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

export default function CustomerSetInfoDialog({customer, setAllCustomers}) {
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
    const [currency, setCurrency] = React.useState();
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
            setAllCustomers((prev) => prev.map((p) => {
                if(p.id == res.data.id) {
                    p = res.data
                }
                return p
                })
            );
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
      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">会員情報を変更する</DialogTitle>
        <DialogContent>
          <DialogContentText>
            氏名:{customer.first_name} {customer.last_name} / {customer.age}歳 / {customer.sex}
          </DialogContentText>
          <DialogContentText>
            メールアドレス:{customer.email}
          </DialogContentText>
        <hr/>
        <FormControl component="paid">
            <FormLabel component="paid">会員状況</FormLabel>
            <RadioGroup
                value={paid}
                onChange={handlePaidChange}
            >
                <FormControlLabel control={<Radio />} label="有料会員" value={'true'}/>
                <FormControlLabel control={<Radio />} label="無料会員" value={'false'}/>
            </RadioGroup>
        </FormControl><hr/>
        {paid=="true" ? (
            <>
            <FormControl component="fieldset">
                <form className={classes.root} noValidate autoComplete="off">
                <div>
                    <FormLabel component="legend">月あたりの予約可能数を変更</FormLabel>
                    <TextField
                    id="filled-select-currency"
                    select
                    label="選択してください"
                    defaultValue={customer.numbers_of_contractnt}
                    onChange={handleCurrencyChange}
                    variant="filled"
                    >
                    {numbers.map((n, index) => (
                        <MenuItem key={index} value={n}>
                            {n}回/月
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
            <FormLabel component="legend">ルームプラス</FormLabel>
            <RadioGroup
                aria-label="gender"
                name="customer_nfo"
                value={roomPlus}
                onChange={handleRoomPlusChange}
            >
                <FormControlLabel value='true' control={<Radio />} label="はい" />
                <FormControlLabel value='false' control={<Radio />} label="いいえ" />
            </RadioGroup>
        </FormControl>

        </DialogContent>
        <DialogActions>
            <Button onClick={handleClose}>戻る</Button>
            {change ? (
                <Button variant="contained" onClick={handleUpdateSubmit} color="secondary">
                    変更する
                </Button>
            ) : (
                <Button variant="contained" disabled>
                    変更する
                </Button>
            )} 
        </DialogActions>
      </Dialog>
    </div>
  );
}
