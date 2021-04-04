/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import axios from 'axios'
import { selectCustomerHeaders } from '../../slices/customer';
import { useSelector } from 'react-redux';

function SetTime(time){
    const d = new Date(time)
    // d.getFullYear()
    // d.getDate()
    // d.getMonth() + 1
    // d.getHours()
    // d.getMinutes()
    const newTime = String(d.getFullYear()) + "年" + String(d.getDate()) + "月" + String(d.getMonth() + 1) + "日　 "  + String(d.getHours()) + ":"  + String(d.getMinutes()) + "~"
    return newTime
}
function ShowRecords({record}) {
    return (
        <Paper className="border_light records_paper">
        <Grid container spacing={2} style={{height: '80%'}}>
            <Grid item xs={10}>
            <div style={{fontWeight: 700, color: '#555555'}}>
                { record.fitness_name }<br/>
                { SetTime(record.appointment_time) }
                {/* { record.appointment_date[0] + '/' + record.appointment_date[1] + '/' + record.appointment_date[2] }
                &nbsp;&nbsp;
                { record.appointment_start[0] + ':' + record.appointment_start[1] } 〜 
                { record.appointment_finish[0] + ':' + record.appointment_finish[1] } */}
            </div>
            {/* { record.session_menus.map((menu, index) => <span key={index}> {menu} </span>) } */}
            </Grid>
        </Grid>
        </Paper>
    );
}
export default function RecordsHistory(props) {
    console.log({props})
    const url = `/customer_page/my_past/records`
    const customer_headers = useSelector(selectCustomerHeaders);
    const [finishRecords, setFinishRecords] = useState([]);

    useEffect(()=>{
        axios.get(url, customer_headers)
        .then(function(res) {
            console.log({res})
            setFinishRecords(res.data.customer_records);
        })
        .catch(function(error) {
            console.log({error})
        });
    },[])
    
    return(
        <>  
            <div style={{marginTop: 20}}>過去のセッションログ</div>
            {/* <div className="month_split">1月</div> */}
            {finishRecords? finishRecords.map((record, index) => <ShowRecords key={index} record={record}/>) : <></> }
            {/* <div className="month_split">2月</div>
            {finishRecords? finishRecords.map((record, index) => <ShowRecords key={index} record={record}/>) : <></> } */}
        </>
    );
}