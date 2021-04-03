/* eslint-disable react/prop-types */
import React from 'react';
import axios from 'axios'
import { selectTrainerHeaders } from '../../../slices/trainer';
import { useSelector } from 'react-redux';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import { useHistory } from 'react-router-dom';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import clsx from 'clsx';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  // ロード
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

export default function RecordConfirm(props) {
    console.log({props})
    const history = useHistory();
    const record = props.location.record
    const data = props.location.data
    const message = props.location.message
    const classes = useStyles();
    const trainerHeaders = useSelector(selectTrainerHeaders);
    const [loading, setLoading] = React.useState(false);
    const [success, setSuccess] = React.useState(false);
    const buttonClassname = clsx({
      [classes.buttonSuccess]: success,
    });

    function showDate(time){
        const date = new Date(`${time}`);
        return(<>
            {date.getMonth() + 1}月{date.getDate()}日<br/>
            {date.getHours()}:{date.getMinutes()}〜
        </>)
    }
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    function handleSubmit(){
        if (!loading) {
            setSuccess(false);
            setLoading(true);
        }
       const url = `/create/record/session_menues/appointment/${record.id}`
        axios.post( url, 
            {customer_record_session_menu: {
                apo: record,
                data: data,
                message: message,
            }
        }, trainerHeaders)
        .then(function (response) {
            setSuccess(true);
            setLoading(false);
            console.log({response})
            history.push(`/`);
        })
        .catch(function (response) {
            setLoading(false);
            console.log("error", {response})
        })
    }
    return(<>  
        <div>
            <Paper variant="outlined" style={{padding: 5, margin: 10, textAlign: 'center'}}>
                内容を確認してください
            </Paper>
           <Paper variant="outlined"style={{padding: 10, margin: 5}}>

            <Paper variant="outlined" style={{padding: 5,backgroundColor: '#b2d2f8',  margin: 0, textAlign: 'left', fontSize: '0.7em'}}>
                <Grid container style={{fontWeight: 500}}>
                    <Grid item xs={4} >
                        顧客名
                    </Grid>
                    <Grid item xs={4}>
                        日時
                    </Grid>
                    <Grid item xs={4}>
                        メニュー
                    </Grid>
                </Grid>
            </Paper>

            <Paper variant="outlined" style={{ marginTop: 10, marginBottom: 10, paddingLeft: 5}}>
                <Grid container  style={{fontWeight: 500,overflowWrap: 'break-word'}}>
                    <Grid item xs={4} style={{marginTop: 'auto', marginBottom: 'auto'}}>
                            {record.first_name_kanji}{record.last_name_kanji}様
                    </Grid>
                    <Grid item xs={4} style={{marginTop: 'auto'}}>
                        { showDate(record.appointment_time) }
                    </Grid>
                    <Grid item xs={4} style={{marginTop: 'auto',marginBottom: 'auto'}}>
                            {record.fitness_name}
                    </Grid>
                </Grid>
            </Paper>

            <Paper variant="outlined" style={{padding: 5,backgroundColor: '#b2d2f8',  margin: 0, textAlign: 'left', fontSize: '0.7em'}}>
                <Grid container style={{fontWeight: 500}}>
                    <Grid item xs={5} >
                        内容
                    </Grid>
                    <Grid item xs={3}>
                        カテゴリー
                    </Grid>
                    <Grid item xs={2}>
                        総回数
                    </Grid>
                    <Grid item xs={2}>
                        重量
                    </Grid>
                </Grid>
            </Paper>
            {data?(<>
                {data.map((d, index) => (<>
                  <Grid key={index} container style={{fontWeight: 500,marginBottom: 10, marginTop: 3}}>
                    <Grid item xs={5} >
                        {d.data.name}
                    </Grid>
                    <Grid item xs={3}>
                        {d.data.fitness_second_name}
                    </Grid>
                    <Grid item xs={2}>
                    {d.data.set? (<>
                        {d.time}回
                    </>):(<></>)}
                    </Grid>
                    <Grid item xs={2}>
                    {d.data.weight? (<>
                        {d.weight}kg
                    </>):(<></>)}
                    </Grid>
                </Grid>
                    <hr/>
                </>))}
            </>):(<></>)}

            <Paper variant="outlined" style={{padding: 5,backgroundColor: '#b2d2f8',  margin: 0, textAlign: 'left', fontSize: '0.7em', fontWeight: 500}}>
                コメント
            </Paper>

            <TextField
                id="outlined-multiline-static"
                label="コメント"
                multiline
                disabled
                style={{width: '100%', color: '#4DA7F0', marginTop: 10}}
                rows={4}
                defaultValue={message}
                variant="outlined"
            />
            <Button style={{margin: 5, backgroundColor: '#4DA7F0', color: 'white', fontWeight: '500', width: '100%'}}
                    onClick={handleClickOpen}
            >
                カルテを発行する
            </Button>
            </Paper>

        <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogContent style={{height: 'auto'}}>
            <div style={{fontSize: 17, fontWeight: 600, textAlign: 'center', marginTop: 30, marginBottom: 20 }}>内容に間違いはありませんか？</div>
            <DialogContentText id="alert-dialog-description">
                カルテがお客様に送信されます。<br/>
                内容に間違いがなければ発行を完了させてください。
            </DialogContentText>
            <hr/>
            <Grid container spacing={3} style={{paddingTop: 10}}>
                <Grid item xs={6}>
                    <div className="button_cancel" onClick={handleClose}>
                        戻る
                    </div>
                </Grid>
                <Grid item xs={6}>
                {loading || success? (
                        <div 
                            className="button_submit"
                            onClick={handleSubmit}
                            style={{backgroundColor: 'silver'}}
                        >
                            発行する
                        </div>
                    ):(
                        <div 
                            className="button_submit"
                            onClick={handleSubmit}
                        >
                            発行する
                        </div>
                    )}
                    {loading && <CircularProgress size={50} className={classes.buttonProgress} />}
                </Grid>
            </Grid>
            </DialogContent>
        </Dialog>
        </div>
    </>)
}
