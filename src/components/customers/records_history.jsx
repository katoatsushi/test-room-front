/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import axios from 'axios'
import { selectCustomerHeaders } from '../../slices/customer';
import { selectTrainerHeaders } from '../../slices/trainer';
import { selectAdminHeaders } from '../../slices/admin';
import { useSelector } from 'react-redux';

function SetTime(time){
    const d = new Date(time)
    // const newTime = String(d.getFullYear()) + "/" + String(d.getMonth() + 1) + "/" + String(d.getDate()) + ""  + String(d.getHours()) + ":"  + String(d.getMinutes())
    const newTime = String(d.getMonth() + 1) + "/" + String(d.getDate())
    return newTime
}

function SessionMenues({menu}) {
    return(<>
    <span style={{fontWeight: 500, fontSize: 14}}>・{menu.fitness_third_name}/{menu.time}回/{menu.weight}Kg<br/></span>
    </>)
}
function ShowRecords({record}) {
    console.log({record})
    return (
        <Paper className="border_light records_paper">
        <Grid container spacing={2} style={{height: '80%'}}>
            <Grid item xs={10}>
            <div style={{fontWeight: 700, color: '#555555'}}>
                { SetTime(record.apos.appointment_time) }【{ record.apos.store_name }店】{ record.apos.fitness_name }<br/>
                担当:{record.trainer.first_name_kanji}トレーナー<br/>
                {record.menues? record.menues.map((menu, index) => <SessionMenues key={index} menu={menu} />) : <></> }
                <span style={{fontWeight: 500, fontSize: 14}}>{record.record.detail }</span>
            </div>
            </Grid>
        </Grid>
        </Paper>
    );
}
export default function RecordsHistory(props) {
    const url = `/customer_page/my_past/records/${props.match.params.id}`
    const customer_headers = useSelector(selectCustomerHeaders);
    const trainer_headers = useSelector(selectTrainerHeaders);
    const admin_headers = useSelector(selectAdminHeaders);
    const [finishRecords, setFinishRecords] = useState();
    const header = customer_headers || trainer_headers || admin_headers
    useEffect(()=>{
        axios.get(url, header)
        .then(function(res) {
            setFinishRecords(res.data.response);
        })
        .catch(function(error) {
            console.log({error})
        });
    },[])
    
    return(
        <>  
            <div style={{margin: 20, textAlign: 'center'}}>過去のセッションログ</div>
            {/* <div className="month_split">1月</div> */}
            {finishRecords? finishRecords.map((record, index) => <ShowRecords key={index} record={record}/>) : <></> }
            {/* <div className="month_split">2月</div>
            {finishRecords? finishRecords.map((record, index) => <ShowRecords key={index} record={record}/>) : <></> } */}
        </>
    );
}