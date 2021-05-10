/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import {selectCurrentAdmin, selectAdminHeaders} from '../../slices/admin'
import { useSelector } from 'react-redux';
import axios from 'axios'
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import ja from "date-fns/locale/ja";
import Paper from '@material-ui/core/Paper';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import Button from '@material-ui/core/Button';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import { useHistory } from 'react-router-dom';
import ScheduleShow from '../appointments/admin/schedule_show'

const useStyles = makeStyles((theme) => ({
    container: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    textField: {
        width: 100,
    },
    resize:{
        fontSize:50
    },
    dateField:{
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        width: 300,  
    },
    root: {
        '& > *': {
            margin: theme.spacing(1),
            width: '25ch',
        },
    },
}));


function TrialSession({setTrialValue}){
    function handleName(e){
        setTrialValue((prev) => ({...prev, name: e.target.value}))
    }
    function handleEmail(e){
        setTrialValue((prev) => ({...prev, email: e.target.value}))
    }
    function handleTel(e){
        setTrialValue((prev) => ({...prev, tel: e.target.value}))
    }
    function handleAddress(e){
        setTrialValue((prev) => ({...prev, address: e.target.value}))
    }
    function handleDetails(e){
        setTrialValue((prev) => ({...prev, details: e.target.value}))
    }
    return(
        <>
        <FormLabel component="legend" style={{marginTop: 20}}>以下の項目を入力してください</FormLabel>
        <Paper className="paper_box">
            <FormLabel component="legend" style={{marginBottom: 5, paddingTop: 5}}>・お名前</FormLabel>
            <TextField id="outlined-basic"  onChange={handleName} style={{width: '100%'}} label="お名前を入力してください" variant="outlined" />
            <FormLabel component="legend" style={{marginBottom: 5, paddingTop: 5}}>・メールアドレス</FormLabel>
            <TextField id="outlined-basic" onChange={handleEmail} style={{width: '100%'}} label="メールアドレスを入力してください" variant="outlined" />
            <FormLabel component="legend" style={{marginBottom: 5, paddingTop: 5}}>・電話番号</FormLabel>
            <TextField id="outlined-basic" onChange={handleTel} style={{width: '100%'}} label="電話番号を入力してください" variant="outlined" />
            <FormLabel component="legend" style={{marginBottom: 5, paddingTop: 5}}>・住所</FormLabel>
            <TextField id="outlined-basic" onChange={handleAddress} style={{width: '100%'}} label="住所を入力してください" variant="outlined" />
            <FormLabel component="legend" style={{marginBottom: 5, paddingTop: 5}}>・お問い合わせ</FormLabel>
            <TextField
                id="outlined-multiline-static"
                label="お問い合わせ内容を入力してください"
                multiline
                onChange={handleDetails}
                rows={4}
                style={{width: '100%'}}
                variant="outlined"
            />
        </Paper>
        </>
    )
}

export default function CreateAdminSchedule(){
    const history = useHistory();
    const classes = useStyles();
    const adminHeaders = useSelector(selectAdminHeaders);
    const currentAdmin = useSelector(selectCurrentAdmin);
    const today = new Date()
    const [selectedDate, setSelectedDate] = React.useState(today);
    const company_id = currentAdmin.company_id
    const [dayInfo, setDayInfo] = useState({year: selectedDate.getFullYear(), month: selectedDate.getMonth() + 1, day: selectedDate.getDate()});
    const [ok, setOk] = useState(false);
    const [stores, setStores] = useState([]);
    const [selectStore, setSelectStore] = useState();
    const [timeStart, setTimeStart] = useState({hour: 7, min: 30})
    const [timeFin, setTimeFin] = useState({hour: 7, min: 30})
    const [check, setCheck] = React.useState('false');
    const [trialValue, setTrialValue] = useState({name: "", address: "", tel: "", email: "", details: ""});
    function handleStartChange(e){
        const hour_min = e.target.value.split(':') 
        setTimeStart({hour: Number(hour_min[0]), min: Number(hour_min[1])})
    }
    function handleFinChange(e){
        const hour_min = e.target.value.split(':') 
        setTimeFin({hour: Number(hour_min[0]), min: Number(hour_min[1])})
    }
    const handleDateChange = (date) => {
        setSelectedDate(date);
        setDayInfo({year: date.getFullYear(), month: date.getMonth() + 1, day: date.getDate()})
    };
    const handleCheckChange = (event) => {
        setCheck(event.target.value);
    };
    function handleAdminScheduleSubmit() {
        const submit_url  = `/black_schedules`
        axios.post( submit_url, {
            dayInfo: dayInfo,
            timeStart: timeStart,
            timeFin: timeFin,
            store_id: selectStore.value.store_id,
            customer_service: check,
            trial_session: trialValue
        }, adminHeaders)
        .then(function (response) {
            history.push('/customer_all');
        })
    }
    useEffect(()=>{
        const check_scedule_url = `/admin/company_id/${currentAdmin.company_id}/year/${today.getFullYear()}/month/${today.getMonth() + 1}/day/${today.getDate()}`
        axios.get(check_scedule_url, adminHeaders)
        .then(function(res) {
            setStores(res.data.today_schedules);
        })
        .catch(function(error) {
          console.log({error})
        });
      },[selectedDate])

    const stores_box = stores.length ?  
    stores.map((store,index) =>
        <MenuItem  value={store} key={index}>{ store.store_name }</MenuItem>
    ): 
        <MenuItem />

    function handleStoreChange(e){
        setSelectStore(e.target.value)
        setOk(true)
    }

    return(
        <>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
            <Grid container>
                <Grid item sm={2}/>
                <Grid item sm={9}>
                <form className={classes.container} noValidate>
                    <h5 style={{fontSize: 20}}>管理者のスケジュールを追加する</h5>
                    <FormLabel component="legend" style={{marginBottom: 10, paddingTop: 15}}>店舗を選択してください</FormLabel>
                    <FormControl variant="outlined" style={{ width: '70%', paddingBottom: 5}} className="select_style">
                    <InputLabel id="demo-store-select-outlined-label" >店舗を選択</InputLabel>
                        <Select
                        labelId="demo-store-select-outlined-label"
                        id="demo-store-select-outlined"
                        label="store"
                        onChange={ handleStoreChange }
                        style={{ backgroundColor: 'white'}}
                        >
                        { stores_box }
                        </Select>
                    </FormControl>
                    <FormLabel component="legend" style={{marginTop: 15}}>日時を選択してください</FormLabel>
                    <MuiPickersUtilsProvider utils={DateFnsUtils} locale={ja}>
                        <Grid container>
                            <KeyboardDatePicker
                                disableToolbar
                                variant="inline"
                                format="yyyy/MM/dd"
                                margin="normal"
                                id="date-picker-inline"
                                label="日にちを選択してください"
                                value={selectedDate}
                                onChange={handleDateChange}
                                style={{backgroundColor: 'white', padding: 10}}
                                KeyboardButtonProps={{
                                    'aria-label': 'change date',
                                }}
                            />
                        </Grid>
                    </MuiPickersUtilsProvider>
                    <Grid container justifyContent="space-around">
                        <TextField
                            id="time"
                            label="開始時刻"
                            autoFocus={true}
                            type="time"
                            defaultValue="07:30"
                            className={classes.textField}
                            style={{backgroundColor: 'white', padding: 10, marginRight: 20}}
                            onChange={handleStartChange}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            inputProps={{
                                step: 300, // 5 min
                            }}
                        />
                        <TextField
                            style={{backgroundColor: 'white', padding: 10}}
                            id="time"
                            autoFocus={true}
                            label="終了時刻"
                            type="time"
                            defaultValue="07:30"
                            onChange={handleFinChange}
                            className={classes.textField}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            inputProps={{
                                step: 300, // 5 min
                            }}
                        />
                    </Grid>
                </form>
                <Grid container justifyContent="space-around" style={{marginTop: 15}}>
                    <FormLabel component="legend" style={{marginBottom: 10}}>スケジュールを選択してください</FormLabel>
                    <FormControl component="fieldset" style={{backgroundColor: 'white', padding: 10}}>
                        <RadioGroup aria-label="gender" name="gender1" value={check} onChange={handleCheckChange}>
                            <FormLabel component="legend">体験トレーニングの予約ですか？</FormLabel>
                            <FormControlLabel value="true" control={<Radio />} label="はい" />
                            <FormControlLabel value="false" control={<Radio />} label="いいえ" />
                        </RadioGroup>
                    </FormControl>
                </Grid>
                {check=='true'? (
                    <>
                    {/* 体験セッションの際の入力項目 */}
                    <TrialSession setTrialValue={setTrialValue} />
                    </>
                    ) : (<></>)
                }

                <div style={{marginTop: 30}}>
                {ok ? (
                    <Button variant="contained" color="secondary" onClick={handleAdminScheduleSubmit}>
                        スケジュールを登録する
                    </Button>
                ) : (
                    <Button variant="contained" disabled>
                        スケジュールを登録する
                    </Button>
                )}
                </div>
                </Grid>
            </Grid>
            </Grid>{/* <Grid item xs={12} sm={4}> */}
            <Grid item xs={12} sm={7}>
                <Paper style={{textAlign: 'center', padding: 20, backgroundColor: '#DDDDDD'}}>
                    {selectedDate.getFullYear()}/{selectedDate.getMonth() + 1}/{selectedDate.getDate()}のスケジュールを確認してください
                </Paper>
                <ScheduleShow company_id={company_id}  day={dayInfo} scroll={true} />
            </Grid>
            <Grid item xs={12} sm={1} />
        </Grid>
        </>
    );
}