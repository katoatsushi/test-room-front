import React, { useEffect, useState } from 'react';
// import _ from 'lodash'
import Button from '@material-ui/core/Button' 
import { useForm } from "react-hook-form";
import axios from 'axios'
import { BrowserRouter as Router, Route, Switch, useParams, useHistory, useLocation, } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';

const useStyles = makeStyles({
  root: {
    // minWidth: 275,
    width: '90%',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: 80,
    // fontSize: '1.2em',
    // color: '#959393',
    // fontWeight: '900'
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  title: {
    fontSize: 14,
    marginLeft: 30,
    marginRight: 30,
  },
  pos: {
    marginBottom: 12,
  },
});

const AppointmentConfirm = (props) => {
    console.log("AppointmentConfirm", {props})
    const classes = useStyles();
    const bull = <span className={classes.bullet}>•</span>;
    const time_strings = props.location.state.time_default
    const time_array_start = props.location.state.time_array[0]
    const time_array_finish = props.location.state.time_array[1]
    const [check, setCheck] = useState(false);
    const [customerMenu, setCustomerMenu] = useState();
    const history = useHistory();

    function handleCheckOk() {
        const params = props.match.params
        const create_url = `http://localhost:3000/customer/${props.match.params.customer_id}/appointments/new/${params.store_id}/${params.customer_menu_id}/${params.year}/${params.month}/${params.day}`
        axios.post( create_url, {
            appointment_time: time_strings,
            free_box: props.location.state.free_box,
          })
          .then(function (response) {
            setCheck(true);
          })
    }

    useEffect(async()=>{
      const url = `http://localhost:3000/customer_menu_serch/${props.match.params.customer_menu_id}`
      await fetch(url)
        .then( res => res.json() )
        .then( res => {
            setCustomerMenu(res.customer_menu);
        })
    },[])

  function show_customer_menu() {
    if(customerMenu.name){
      return(
          <>{customerMenu.name}</>
          );
    }else{
      return <></>;
    }
  }


    return (
        <>
            <div>
            <br/>
                {check && (
                    <Card className="apo_success" >
                    <div style={{textAlign: 'center', marginTop: 10 }}>
                        <CheckCircleIcon style={{color: '#005FFF', fontSize: 30}}/>
                    </div>
                    <CardContent>
                        <Typography className={classes.title} color="textSecondary" gutterBottom>
                            <span style={{fontSize: '1.2em',color: '#959393',fontWeight: '900'}}>予約が確定しました!</span>
                        </Typography>
                        <Typography className={classes.title}>
                            <span style={{fontSize: '1.0em',color: '#959393',fontWeight: '900'}}>内容</span>
                            <div style={{fontSize: '1.3em',color: '#959393',fontWeight: '500'}}>
                               &nbsp; 【{props.location.state.store}店】  {props.location.state.customer_menu}
                            </div>
                            <hr/>
                        </Typography>
                        <Typography className={classes.title} color="textSecondary">
                            <span style={{fontSize: '1.0em',color: '#959393',fontWeight: '900'}}>日時</span>
                            <div style={{fontSize: '1.3em',color: '#959393',fontWeight: '500'}}>
                                &nbsp;{props.match.params.month}月{props.match.params.day}日&nbsp;
                                {time_array_start[0] + ":" + time_array_start[1]}
                                〜
                                {time_array_finish[0] + ":" + time_array_finish[1]}
                            </div><hr/>
                        </Typography>
                    </CardContent>
                    <div style={{ textAlign: 'center', marginBottom: 20}}>
                        <Button size="large" href='/' style={{backgroundColor: '#4DA7F0', color: 'white', fontWeight: '700', width: '80%'}}>
                            ホームに戻る
                        </Button>
                    </div>
                    </Card>
                )}
                {!check && (
                    <Card className={classes.root} variant="outlined">
                    <CardContent>
                        <Typography className={classes.title} color="textSecondary" gutterBottom>
                            <span style={{fontSize: '1.2em',color: '#959393',fontWeight: '900'}}>予約を確定しますか？</span>
                        </Typography>
                        <Typography className={classes.title}>
                            <span style={{fontSize: '1.0em',color: '#959393',fontWeight: '900'}}>内容</span>
                            <div style={{fontSize: '1.3em',color: '#959393',fontWeight: '500'}}>
                                &nbsp; 【{props.location.state.store}店】 {props.location.state.customer_menu}
                            </div>
                            <hr/>
                        </Typography>
                        <Typography className={classes.title} color="textSecondary">
                            <span style={{fontSize: '1.0em',color: '#959393',fontWeight: '900'}}>日時</span>
                            <div style={{fontSize: '1.3em',color: '#959393',fontWeight: '500'}}>
                                &nbsp;{props.match.params.month}月{props.match.params.day}日&nbsp;
                                {time_array_start[0] + ":" + time_array_start[1]}
                                〜
                                {time_array_finish[0] + ":" + time_array_finish[1]}
                            </div><hr/>
                        </Typography>
                    </CardContent>
                    <div style={{ textAlign: 'center'}}>
                        <Button size="large" style={{width: '40%',margin: 10,backgroundColor: '#F1F1F1', color: '#959393', fontWeight: '700'}}>
                            キャンセル
                        </Button>
                        <Button size="large" onClick={handleCheckOk} style={{width: '40%' ,margin: 10,backgroundColor: '#4DA7F0', color: 'white', fontWeight: '700'}}>
                            確定する
                        </Button>
                    </div>
                    </Card>
                )}
            </div>
        </>
    )
}

export default AppointmentConfirm;