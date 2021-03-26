import React, { useEffect, useState, Component } from 'react';
import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import IconButton from '@material-ui/core/IconButton';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import Grid from '@material-ui/core/Grid';

function ShowRecords({record}) {
    return (
        <Paper className="border_light records_paper">
        <Grid container spacing={2} style={{height: '80%'}}>
            <Grid item xs={10}>
            <div style={{fontWeight: 700, color: '#555555'}}>
                { record.appointment_date[0] + '/' + record.appointment_date[1] + '/' + record.appointment_date[2] }
                &nbsp;&nbsp;
                { record.appointment_start[0] + ':' + record.appointment_start[1] } 〜 
                { record.appointment_finish[0] + ':' + record.appointment_finish[1] }
            </div>
            { record.session_menus.map((menu, index) => <span> {menu} </span>) }
            </Grid>
        </Grid>
        </Paper>
    );
}
export default function RecordsHistory(props) {
    const url = `http://localhost:3000/customer_page/${props.match.params}`
    const [finishRecords, setFinishRecords] = useState([]);
    useEffect(()=>{
      fetch(url)
        .then( res => res.json() )
        .then( res => {
            setFinishRecords(res.customer_records);
        })
    },[])
    
    return(
        <>  
            <div style={{marginTop: 20}}>過去のセッションログ</div>
            <div className="month_split">1月</div>
            {finishRecords? finishRecords.map((record, index) => <ShowRecords key={index} record={record}/>) : <></> }
            <div className="month_split">2月</div>
            {finishRecords? finishRecords.map((record, index) => <ShowRecords key={index} record={record}/>) : <></> }
        </>
    );
}