/* eslint-disable react/prop-types */
import React, { useEffect } from 'react';
import axios from 'axios'
import { selectTrainerHeaders } from '../../../slices/trainer';
import { useSelector } from 'react-redux';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import { useHistory } from 'react-router-dom';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';

export default function ShowRecord(props) {
    const record_id = props.match.params.id
    const history = useHistory();
    const trainerHeaders = useSelector(selectTrainerHeaders);
    const url = `/show/record/${record_id}`
    const [customer, setCustomer] = React.useState();
    const [apo, setApo] = React.useState();
    const [recordMenues, setRecordMenues] = React.useState([]);
    const [open, setOpen] = React.useState(false);
    const message = ""
    function showDate(time){
        const date = new Date(`${time}`);
        return(<>
            {date.getMonth() + 1}月{date.getDate()}日<br/>
            {date.getHours()}:{date.getMinutes()}〜
        </>)
    }

    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };

    useEffect(()=>{

        axios.get(url, trainerHeaders)
        .then(function(res) {
            setCustomer(res.data.customer)
            setApo(res.data.apo)
            setRecordMenues(res.data.records_menues)
        })
        .catch(function(error) {
            console.log({error})
        });
        
    },[])

    function handleDelete(){
        const delete_url =  `/delete/record/${record_id}`
        axios.delete(delete_url, trainerHeaders)
        .then(res => {         
            setOpen(false);
            history.push(`/trainers/customer_session_records`);   
        })
        .catch(function (response) {
            console.log("error", {response})
        })
    }
    return(<>  
        <div>
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
                            {customer?(<>{customer.first_name_kanji}{customer.last_name_kanji}様</>):(<></>)}
                    </Grid>
                    <Grid item xs={4} style={{marginTop: 'auto'}}>
                        {apo?(<>{ showDate(apo.appointment_time) }</>):(<></>)}
                    </Grid>
                    <Grid item xs={4} style={{marginTop: 'auto',marginBottom: 'auto'}}>
                        {apo?(<>{apo.fitness_name}</>):(<></>)}
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
            {recordMenues?(<>
                {recordMenues.map((menu, index) => (<>
                  <Grid container key={index} style={{fontWeight: 500, marginBottom: 10, marginTop: 3, fontSize: 12}}>
                    <Grid item xs={5} style={{justifyContent: 'center'}}>
                        {menu.fitness_third_name}
                    </Grid>
                    <Grid item xs={3}>
                        <span style={{fontSize: 10}}>【{menu.fitness_name}】</span>
                    </Grid>
                    <Grid item xs={2}>
                        {menu.time}回
                    </Grid>
                    <Grid item xs={2}>
                        {menu.weight}Kg
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
                multiline
                disabled
                style={{width: '100%', color: '#4DA7F0', marginTop: 10}}
                rows={4}
                defaultValue={message}
                variant="outlined"
            />
            <Grid container spacing={3} style={{paddingTop: 10, marginTop: 50}}>
                <Grid item xs={6}>
                    <div className="button_cancel" onClick = {() => history.push(`/trainers/customer_session_records`)}>
                        一覧に戻る
                    </div>
                </Grid>
                <Grid item xs={6}>
                    <div className="button_submit" style={{backgroundColor: 'red'}} onClick={handleClickOpen}>
                        削除する
                    </div>
                </Grid>
            </Grid>
            </Paper>

        <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogContent style={{height: 'auto'}}>
            <div style={{fontSize: 17, fontWeight: 600, textAlign: 'center', marginTop: 30, marginBottom: 20 }}>カルテを削除しますか？</div>
            <DialogContentText id="alert-dialog-description">
                削除したカルテは復元することができません。
                このままカルテの削除に進む場合は「削除」をクリックしてください
            </DialogContentText>
            <hr/>
            <Grid container spacing={3} style={{paddingTop: 10}}>
                <Grid item xs={6}>
                    <div className="button_cancel" onClick={handleClose}>
                        戻る
                    </div>
                </Grid>
                <Grid item xs={6}>
                    <div className="button_submit" onClick={handleDelete} style={{backgroundColor: 'red'}}>
                        削除
                    </div>
                </Grid>
            </Grid>
            </DialogContent>
        </Dialog>
        </div>
    </>)
}
