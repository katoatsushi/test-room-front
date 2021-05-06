/* eslint-disable react/prop-types */
import React , { useEffect, useState } from 'react';
import axios from 'axios'
import ShiftInput from './shift_input'
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import { selectCurrentTrainer, selectTrainerHeaders } from '../../../slices/trainer';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { useSnackbar } from 'notistack';
import CircularProgress from '@material-ui/core/CircularProgress';
import clsx from 'clsx';

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  root: {
    display: 'flex',
    alignItems: 'center',
  },
  wrapper: {
    margin: theme.spacing(1),
    position: 'relative',
  },
  buttonSuccess: {
    backgroundColor: '#4DA7F0',
    '&:hover': {
      backgroundColor: '#4DA7F0',
    },
  },
  buttonProgress: {
    color: '#4DA7F0',
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  },
}));
export default function ShiftNew(props){
    const history = useHistory();
    const currentTrainer = useSelector(selectCurrentTrainer);
    const trainer_headers = useSelector(selectTrainerHeaders);
    var dt = new Date(props.year, props.month);
    const last_day = new Date(dt.getFullYear(), dt.getMonth() + 2, 0)
    const the_last_day = last_day.getDate()
    var dataSet = []
    const [workDays, setWorkDays] = useState();
    const [shift, setShift] = useState();
    const url = `/trainer/shifts/my_requested_shift/year/${last_day.getFullYear()}/month/${last_day.getMonth() + 1}`
    const [loading, setLoading] = React.useState(false);
    const [success, setSuccess] = React.useState(false);
    const classes = useStyles();
    const buttonClassname = clsx({
      [classes.buttonSuccess]: success,
    });
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();

    useEffect(()=>{
        if (!loading) {
            setSuccess(false);
            setLoading(true);
        }
        axios.get(url, trainer_headers)
        .then(function(res) {
            setWorkDays(res.data.work_day)
            for (let i=1; i<the_last_day+1 ; i++) {
                var thisDateDate = {date: null, shift: {start: null, end: null}, edit: false, work: false, new_shift: false, id: null}
                if(res.data.data){
                    if(res.data.data[i-1]){
                        const start_datetime = new Date(res.data.data[i-1].start)
                        const start = [start_datetime.getHours(), start_datetime.getMinutes()]
                        const finish_datetime = new Date(res.data.data[i-1].finish)
                        const finish = [finish_datetime.getHours(), finish_datetime.getMinutes()]
                        thisDateDate.shift.start = start
                        thisDateDate.shift.end = finish
                        thisDateDate.id = res.data.data[i-1].id
                        thisDateDate.work = true
                    }
                }
                thisDateDate.date = i
                dataSet.push(thisDateDate)
                setSuccess(true);
                setLoading(false);
            }
            setShift(dataSet)
        })
        .catch(function(error) {
            setLoading(false);
            console.log({error})
        });
    },[])

    useEffect(()=>{
        console.log({shift})
    },[shift])

    const [button, setButton] = useState(false);
    function handleSubmit(){
        if (!loading) {
            setSuccess(false);
            setLoading(true);
        }
        const url = `/trainer/shift/create/year/${last_day.getFullYear()}/month/${last_day.getMonth() + 1}/`
        axios.put( url, {
            trainer_shift: shift
        }, trainer_headers)
        .then(function (response) {
            setSuccess(true);
            setLoading(false);
            const message = "シフト情報を更新しました！"
            enqueueSnackbar(message, {
                autoHideDuration: 1000,
                variant: 'success',
            });
            // history.push(`/trainer/${currentTrainer.id}`);
            history.push(`/`);
        })
        .catch(function (response) {
            setLoading(false);
            const message = "シフトの更新に失敗しました"+"再ログインしてもう一度お確かめ下さい"
            enqueueSnackbar(message, {
                autoHideDuration: 1000,
                variant: 'error',
            });
            console.log(response.data);
        })
    }
    return(
        <>
        <div style={{textAlign: 'center', fontSize: '1.7em'}}>
            {last_day.getMonth() + 1}月シフト希望提出
        </div>
        <div style={{overflow: 'scroll', height: 400,backgroundColor: 'white', marginTop: 15}}>
            <Grid container spacing={3}>
            {shift? (<>
                {shift.map((s, index) => (
                    <ShiftInput key={index} setButton={setButton} shift={s} all_shift={shift} setShift={setShift} workDays={workDays} />
                ))}
            </>):(<>
                {loading && <CircularProgress size={60} style={{marginLeft: 'auto', marginRight: 'auto', marginTop: 180, color: '#4DA7F0', paddingTop: 5}} />}
            </>)}
            </Grid>
        </div>
        <div style={{marginBottom: 20}}></div>
        <div className={classes.wrapper}>
        <Button variant="contained" style={{width: '100%'}} 
            color="secondary" 
            onClick={handleSubmit}
            disabled={!button}
        >
            シフトを送信
        </Button>
        {loading && <CircularProgress size={24} className={classes.buttonProgress} />}
        </div>

        </>
    )
}
