import React, { useEffect, useState, Component } from 'react';
import axios from 'axios'
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import IconButton from '@material-ui/core/IconButton';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import Grid from '@material-ui/core/Grid';
import { useTable } from 'react-table'
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TextField from '@material-ui/core/TextField';
import InputBase from '@material-ui/core/InputBase';
import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';
import { useSelector } from 'react-redux';
import { selectCurrentTrainer, selectTrainerHeaders } from '../../slices/trainer';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import NativeSelect from '@material-ui/core/NativeSelect';
import {
    BrowserRouter as Router,
    Route,
    Switch,
    useParams,
    useHistory,
    useLocation,
  } from 'react-router-dom';

const BootstrapInput = withStyles((theme) => ({
  root: {
    'label + &': {
      marginTop: theme.spacing(3),
    },
  },
  input: {
    borderRadius: 4,
    position: 'relative',
    backgroundColor: theme.palette.background.paper,
    border: '1px solid #ced4da',
    fontSize: 16,
    padding: '10px 26px 10px 12px',
    transition: theme.transitions.create(['border-color', 'box-shadow']),
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
    '&:focus': {
      borderRadius: 4,
      borderColor: '#80bdff',
      boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)',
    },
  },
}))(InputBase);


const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    '& > *': {
      margin: theme.spacing(1),
      width: theme.spacing(16),
      height: theme.spacing(16),
    },
  },
}));


export default function SessionRecordList() {
    const classes = useStyles();
    const currentTrainer = useSelector(selectCurrentTrainer);
    const trainerHeaders = useSelector(selectTrainerHeaders);
    const [thisStoreRecord, setThisStoreRecord] = React.useState([]);
    const [records, setRecords] = React.useState([]);
    const [radioStatus, setRadioStatus] = React.useState("");
    const [currentRecords, setCurrentRecords] = React.useState();
    const history = useHistory();

    const url = `http://localhost:3000/trainer/get/customer_records`

    useEffect(()=>{
        fetch(url, trainerHeaders)
        .then( res => res.json())
        .then( res => {
            setRecords(res.data);
        })
    },[])

    function handleStoreChange(e) {
        console.log({e})
        // setCurrentRecords(e.target.value.data)
        setThisStoreRecord(e.target.value)
        if (radioStatus){
            console.log("中身あり！")
            if(radioStatus == "not_finish"){
                setCurrentRecords(e.target.value.not_finish_data)
            }else if(radioStatus == "finish"){
                setCurrentRecords(e.target.value.finish_data)
            }else if(radioStatus == "all"){
                setCurrentRecords(e.target.value.all_data)
            }
        }else{
            console.log("中身なし！")
            setCurrentRecords(e.target.value.all_data)
        }
    }

    function showDate(time){
        const date = new Date(`${time}`);
        return(<>
            {date.getMonth() + 1}月{date.getDate()}日<br/>
            {date.getHours()}:{date.getMinutes()}〜
        </>)
    }
    function handleRadioChange(e){
        if(e.target.value == "not_finish"){
            setCurrentRecords(thisStoreRecord.not_finish_data)
        }else if(e.target.value == "finish"){
            setCurrentRecords(thisStoreRecord.finish_data)
        }else if(e.target.value == "all"){
            setCurrentRecords(thisStoreRecord.all_data)
        }
        setRadioStatus(e.target.value)
    }
    const selectStore = records?  
       records.map((r, index) =>
       <MenuItem value={r} onChange={handleStoreChange}>{r.store.store_name}</MenuItem>
        )
    : 
        <MenuItem />
    return(
        <>
        <FormControl component="fieldset" style={{margin: '2%',padding: 10, width: '90%' , backgroundColor: '#EEEEEE',border: 1, borderColor: '#888888'}}>
            ステータスで絞り込む<br/>
            <RadioGroup row aria-label="position" name="position" defaultValue="top" onChange={handleRadioChange}>
                    &nbsp;
                    <FormControlLabel value="not_finish" control={<Radio color="primary" style={{backgroundColor: 'white', padding: 0}} />} label="未発行" />&nbsp;
                    <FormControlLabel value="finish" control={<Radio color="primary" style={{backgroundColor: 'white', padding: 0}}/>} label="発行済み" />&nbsp;
                    <FormControlLabel value="all" control={<Radio color="primary" style={{backgroundColor: 'white', padding: 0}}/>} label="全て" />
            </RadioGroup>
            <br/>
            <FormControl className={classes.margin}>
                {/* <InputLabel id="demo-customized-select-label">店舗</InputLabel> */}
                 店舗を選択する<br/>
                <Select
                    labelId="demo-customized-select-label"
                    id="demo-customized-select"
                    onChange={handleStoreChange}
                    input={<BootstrapInput />}
                >
                {selectStore}
                </Select>
            </FormControl>
        </FormControl>

        <div style={{margin: 5}}>
        <Paper variant="outlined">
            <Grid container spacing={3} style={{fontWeight: 500}}>
                <Grid item xs={3} >
                    <span style={{marginLeft: 5}}>顧客名</span>
                </Grid>
                <Grid item xs={3}>
                    日時
                </Grid>
                <Grid item xs={3}>
                    メニュー
                </Grid>
                <Grid item xs={3}>
                </Grid>
            </Grid>
        </Paper>
        {currentRecords? (<>
            {currentRecords.map((record, index) => (
                <Paper variant="outlined" style={{ marginTop: 10, marginBottom: 10}}>
                    <Grid container spacing={3} style={{fontWeight: 500,overflowWrap: 'break-word'}}>
                        <Grid item xs={3} style={{marginTop: 'auto', marginBottom: 'auto'}}>
                                <span style={{fontSize: 15, marginLeft: 10}}>
                                    {record.first_name_kanji}{record.last_name_kanji}
                                </span>
                        </Grid>
                        <Grid item xs={3} style={{marginTop: 'auto',marginBottom: 'auto'}}>
                            <span style={{fontSize: 12}}>{ showDate(record.appointment_time) }</span>
                        </Grid>
                        <Grid item xs={3} style={{marginTop: 'auto',marginBottom: 'auto'}}>
                             <span style={{fontSize: 12}}>{record.fitness_name}</span>
                        </Grid>
                        {record.finish==1?(
                            <Grid item xs={3} style={{paddingLeft: 0, marginTop: 'auto',marginBottom: 'auto'}}>
                                <div className="box_show" onClick = {() => history.push(`/record/${record.id}`)}>
                                    詳細
                                </div>
                            </Grid>
                        ) : (
                            <Grid item xs={3} style={{paddingLeft: 0, marginTop: 'auto',marginBottom: 'auto'}}>
                                <div className="box_2" onClick = {() => 
                                    history.push({
                                        pathname: [`/trainers/${currentTrainer.id}/fitness/${record.fitness_id}`],
                                        data: record
                                    })}>
                                    カルテを発行
                                </div>
                            </Grid>
                        )}
                    </Grid>
                </Paper>
            ))}
        </>) : (<>
            <div className="info_box">
                ※ 店舗を選択してください
            </div>
        </>)}
        </div>
        </>
    )
}
