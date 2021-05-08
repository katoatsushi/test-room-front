/* eslint-disable react/prop-types */
import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import { useHistory } from 'react-router-dom';
import TextField from '@material-ui/core/TextField';
import { useSnackbar } from 'notistack';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
  formControl: {
    margin: theme.spacing(1),
  },
}));

function InputTimesWeight({data, setSubmitData, submitData}){
    function handleTimeChange(e){
        const changeTime = submitData.map((sd) => {
            if(sd.data.id == data.data.id){
                return {data: sd.data, time: e.target.value, weight: sd.value}
            }else{
                return sd
            }
        });
        setSubmitData((prev) => changeTime)
    }

    function handleWeightChange(e){
         const changeWeight = submitData.map((sd) => {
            if(sd.data.id == data.data.id){
                return {data: sd.data, time: sd.time, weight: e.target.value}
            }else{
                return sd
            }
        });
        setSubmitData((prev) => changeWeight)
    }

    return(
        <Grid container  style={{fontWeight: 500, marginBottom: 10, marginTop: 3}}>
            <Grid item xs={5} >
                {data.data.name}
            </Grid>
            <Grid item xs={3}>
                {data.data.fitness_second_name}
            </Grid>
            <Grid item xs={2}>
            {data.data.set? (<>
                <input type="number" required style={{width: '60%'}} onChange={handleTimeChange}/><span style={{fontSize: 5}}>回</span>
            </>):(<></>)}
            </Grid>
            <Grid item xs={2}>
            {data.data.weight? (<>
                <input type="number" required style={{width: '60%'}} onChange={handleWeightChange}/><span style={{fontSize: 5}}>kg</span>
            </>):(<></>)}
            </Grid>
        </Grid>
    )
}

export default function SetTimesWeight(props) {
    const classes = useStyles();
    const [ submitData, setSubmitData ] = React.useState([]);
    const [ message, setMessage ] = React.useState("");
    const allData = props.location.data
    const history = useHistory();
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const [dataCheck, setDataCheck] = React.useState(true);

    useEffect(()=>{
        if (props.location.data.length == 0) {
            setDataCheck(false)
        }
        if (allData){
            var DataInit = allData.map(function(d){
                return {data: d, time: null, weight: null}
            })
        }else{
            DataInit = []
        }
        setSubmitData(DataInit)
    },[])

    function handleMessageChange(e){
        setMessage(e.target.value);
    }

    return (<>
    {dataCheck? (<>
        <div className={classes.root}>
            <Paper variant="outlined" style={{padding: 5, margin: 10, textAlign: 'center'}}>
                カルテを発行する
            </Paper>
           <Paper variant="outlined"style={{padding: 10, margin: 5}}>

            <Paper variant="outlined" style={{padding: 5,backgroundColor: '#CCCCCC',  margin: 0, textAlign: 'left', fontSize: '0.7em'}}>
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

            {submitData?(<>
                {submitData.map((data, index) => (<>
                    <InputTimesWeight key={index} data={data} setSubmitData={setSubmitData} submitData={submitData}/>
                    <hr/>
                </>))}
            </>):(<></>)}
            <Paper variant="outlined" style={{padding: 5,backgroundColor: '#CCCCCC',  margin: 0, textAlign: 'left', fontSize: '0.7em', fontWeight: 500}}>
                コメント
            </Paper>

            <TextField
                id="outlined-multiline-static"
                label="コメント"
                multiline
                style={{width: '100%', color: '#4DA7F0', marginTop: 10}}
                rows={4}
                onChange={handleMessageChange}
                variant="outlined"
            />
            <div style={{textAlign: 'right', marginLeft: 'auto', marginRight: 'auto',}}>
                <Button style={{marginTop: 10, backgroundColor: '#4DA7F0', color: 'white', fontWeight: '500', width: '100%'}}
                    onClick = {() => 
                        history.push({
                            pathname: [`/trainers/record/confirm`],
                            record: props.location.record,
                            message: message,
                            data: submitData })}
                >
                    カルテを発行する
                </Button>
            </div>
            </Paper>
        </div>
        </>):(<>
        <div className={classes.root}>
            <Paper variant="outlined" style={{padding: 5, margin: 10, textAlign: 'center'}}>
                カルテを発行する
            </Paper>
            <Paper variant="outlined"style={{padding: 10, margin: 5}}>
            <Paper variant="outlined" style={{padding: 5,backgroundColor: '#CCCCCC',  margin: 0, textAlign: 'left', fontSize: '0.7em', fontWeight: 500}}>
                コメント
            </Paper>

            <TextField
                id="outlined-multiline-static"
                label="コメント"
                multiline
                style={{width: '100%', color: '#4DA7F0', marginTop: 10}}
                rows={4}
                onChange={handleMessageChange}
                variant="outlined"
            />
            <div style={{textAlign: 'right', marginLeft: 'auto', marginRight: 'auto',}}>
                <Button style={{marginTop: 10, backgroundColor: '#4DA7F0', color: 'white', fontWeight: '500', width: '100%'}}
                    onClick = {() => 
                        history.push({
                            pathname: [`/trainers/record/confirm`],
                            record: props.location.record,
                            message: message,
                            data: submitData })}
                >
                    カルテを発行する
                </Button>
            </div>
            </Paper>
        </div>  
        </>)
    }

    </>)
}
