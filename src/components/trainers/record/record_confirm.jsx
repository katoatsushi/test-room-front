import React, { useEffect, useState, Component } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import axios from 'axios'
import { selectCurrentTrainer, selectTrainerHeaders } from '../../../slices/trainer';
import { useSelector } from 'react-redux';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Paper from '@material-ui/core/Paper';
import FormLabel from '@material-ui/core/FormLabel';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import {
    BrowserRouter as Router,
    Route,
    Switch,
    useParams,
    useHistory,
    useLocation,
} from 'react-router-dom';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

export default function RecordConfirm(props) {
    console.log({props})
    const history = useHistory();
    const record = props.location.record
    const data = props.location.data
    const message = props.location.message
    const currentTrainer = useSelector(selectCurrentTrainer);
    const trainerHeaders = useSelector(selectTrainerHeaders);

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
       const url = `/create/record/session_menues/appointment/${record.id}`
        axios.post( url, 
        {customer_record_session_menu: {
            apo: record,
            data: data,
            message: message,
        }
        }, trainerHeaders)
        .then(function (response) {
            console.log({response})
            history.push(`/`);
        })
        .catch(function (response) {
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
                  <Grid container style={{fontWeight: 500}} style={{marginBottom: 10, marginTop: 3}}>
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
                    <div className="button_submit" onClick={handleSubmit}>
                        発行する
                    </div>
                </Grid>
            </Grid>
            </DialogContent>
        </Dialog>
        </div>
    </>)
}
