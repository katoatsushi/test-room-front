/* eslint-disable react/prop-types */
import React, { useEffect } from 'react';
import axios from 'axios'
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import InputBase from '@material-ui/core/InputBase';
import { useSelector } from 'react-redux';
import { selectCurrentTrainer, selectTrainerHeaders } from '../../slices/trainer';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import { useHistory } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import Grow from '@material-ui/core/Grow';

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
    const [selectTag, setSelectTag] = React.useState("");
    const [currentRecords, setCurrentRecords] = React.useState();
    const [change, setChange] = React.useState(false);
    const history = useHistory();
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();

    const url = `/trainer/get/customer_records`

    useEffect(()=>{
        axios.get(url, trainerHeaders)
        .then(function(res) {
            setRecords(res.data.data);
            // ???????????????????????????????????????"???"all"?????????
            const selectRecord = res.data.data.filter((record, index) => {
                return record.store.store_name == "???????????????"
            });
            setCurrentRecords(selectRecord[0].not_finish_data)
            setSelectTag("???????????????")
            setRadioStatus("not_finish")
            // if (thisStoreRecord.length == 0){
            const message = "??????????????????????????????????????????????????????"
            enqueueSnackbar(message, {
                variant: 'success',
                autoHideDuration: 1000,
                anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'center',
                },
                TransitionComponent: Grow,
            });
            // }
        })
        .catch(function(error) {
            console.log({error})
        });

    },[])

    function handleStoreChange(e) {
        if(e.target.value){
            setSelectTag(e.target.value)
        }
        setChange(true)
        setThisStoreRecord(e.target.value)
        if (radioStatus == ""){
            const message = "??????????????????????????????????????????"
            enqueueSnackbar(message, { 
                autoHideDuration: 1500,
                variant: 'warning',
            });
        }
        const selectRecord = records.filter((record, index) => {
            return record.store.store_name == e.target.value
        });
    
        if (selectRecord.length != 0 && radioStatus){
            if(radioStatus == "not_finish"){
                setCurrentRecords(selectRecord[0].not_finish_data)
            }else if(radioStatus == "finish"){
                setCurrentRecords(selectRecord[0].finish_data)
            }else if(radioStatus == "all"){
                setCurrentRecords(selectRecord[0].all_data)
            }
        }else{
            setThisStoreRecord(e.target.value)
            if (radioStatus == ""){
                const message = "??????????????????????????????????????????"
                enqueueSnackbar(message, { 
                    autoHideDuration: 1500,
                    variant: 'warning',
                });
            }
        }
    }

    function showDate(time){
        const date = new Date(`${time}`);
        return(<>
            {date.getMonth() + 1}???{date.getDate()}???<br/>
            {date.getHours()}:{date.getMinutes()}???
        </>)
    }
    function handleRadioChange(e){
        setChange(true)
        const selectRecord = records.filter((record, index) => {
            return record.store.store_name == selectTag
        });
        if (selectRecord.length != 0 && e.target.value){
            if(e.target.value == "not_finish"){
                setCurrentRecords(selectRecord[0].not_finish_data)
            }else if(e.target.value == "finish"){
                setCurrentRecords(selectRecord[0].finish_data)
            }else if(e.target.value == "all"){
                setCurrentRecords(selectRecord[0].all_data)
            }
        }else{
            console.log("?????????????????????????????????")
        }

        setRadioStatus(e.target.value)
    }
    const selectStore = records?  
       records.map((r, index) =>
            <MenuItem key={index} value={r.store.store_name} onChange={handleStoreChange}>{r.store.store_name}</MenuItem>
        )
    : 
        <MenuItem />


    return(
        <>
        <FormControl component="fieldset" style={{margin: '2%',padding: 10, width: '90%' , backgroundColor: '#EEEEEE',border: 1, borderColor: '#888888'}}>
            ??????????????????????????????<br/>
            <RadioGroup row aria-label="position" name="position" defaultValue="top" value={radioStatus} onChange={handleRadioChange}>
                    &nbsp;
                    <FormControlLabel value="not_finish" control={<Radio color="primary" style={{backgroundColor: 'white', padding: 0}} />} label="?????????" />&nbsp;
                    <FormControlLabel value="finish" control={<Radio color="primary" style={{backgroundColor: 'white', padding: 0}}/>} label="????????????" />&nbsp;
                    <FormControlLabel value="all" control={<Radio color="primary" style={{backgroundColor: 'white', padding: 0}}/>} label="??????" />
            </RadioGroup>
            <br/>
            <FormControl className={classes.margin}>
                 ?????????????????????<br/>
                <Select
                    value={selectTag}
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
        {change? (<>
            {/* ?????????????????????????????????????????????????????????????????????????????????????????? */}
            <Paper variant="outlined">
                <Grid container spacing={3} style={{fontWeight: 500}}>
                    <Grid item xs={3} >
                        <span style={{marginLeft: 5}}>?????????</span>
                    </Grid>
                    <Grid item xs={3}>
                        ??????
                    </Grid>
                    <Grid item xs={3}>
                        ????????????
                    </Grid>
                    <Grid item xs={3}>
                    </Grid>
                </Grid>
            </Paper>
        </>):(<>
            <Paper variant="outlined">
                <Grid container spacing={3} style={{fontWeight: 500}}>
                <Grid item xs={12} >
                    <span style={{marginLeft: 5}}>????????????????????????????????????????????????</span>
                </Grid>
                </Grid>
            </Paper>
        </>)

        }

        {currentRecords? (<>
            {currentRecords.map((record, index) => (
                <Paper variant="outlined" key={index} style={{ marginTop: 10, marginBottom: 10}}>
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
                             <span style={{fontSize: 12}}>
                             {selectTag=="???????????????"?(<>
                                {record.store_name}/{record.fitness_name}
                             </>):(<>
                                {record.fitness_name}
                             </>)}
                              </span>
                        </Grid>
                        {record.finish==1?(
                            <Grid item xs={3} style={{paddingLeft: 0, marginTop: 'auto',marginBottom: 'auto'}}>
                                <div className="box_show" onClick = {() => history.push(`/record/${record.id}`)}>
                                    ??????
                                </div>
                            </Grid>
                        ) : (
                            <Grid item xs={3} style={{paddingLeft: 0, marginTop: 'auto',marginBottom: 'auto', width: '100%'}}>
                                <div className="box_2" 
                                    onClick = {() => 
                                    history.push({
                                        pathname: [`/trainers/${currentTrainer.id}/fitness/${record.fitness_id}`],
                                        data: record
                                    })}
                                >
                                    ??????????????????
                                </div>
                            </Grid>
                        )}
                    </Grid>
                </Paper>
            ))}
        </>) : (<>
            <div className="info_box">
                ??? ??????????????????????????????
            </div>
        </>)}
        </div>
        </>
    )
}
