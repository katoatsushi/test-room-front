/* eslint-disable react/prop-types */
import React , { useEffect } from 'react';
import Input from '@material-ui/core/Input';
import InputAdornment from '@material-ui/core/InputAdornment';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import {  withStyles, makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
import { useSelector } from 'react-redux';
import { selectCurrentCustomer , selectCustomerHeaders } from '../../slices/customer';
import { useHistory } from 'react-router-dom';
import axios from 'axios'
import { useSnackbar } from 'notistack';

const BootstrapButton = withStyles({
  root: {
    boxShadow: 'none',
    textTransform: 'none',
    fontSize: 16,
    padding: '6px 25px',
    border: '1px solid',
    lineHeight: 1.5,
    backgroundColor: '#4DA7F0',
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
    '&:hover': {
      backgroundColor: '#0069d9',
      borderColor: '#0062cc',
      boxShadow: 'none',
    },
    '&:focus': {
      boxShadow: '0 0 0 0.2rem rgba(0,123,255,.5)',
    },
  },
})(Button);

const useStyles = makeStyles((theme) => ({
  margin: {
    margin: theme.spacing(1),
  },
}));
export default function CustomerWeightNew(){
    const [weight, setWeight] = React.useState()
    const [weightHistory, setWeightHistory] = React.useState([])
    const currentCustomer = useSelector(selectCurrentCustomer);
    const customerHeaders = useSelector(selectCustomerHeaders);
    const classes = useStyles();
    const url = `/customer_weights`
    const history = useHistory();
    const data = null
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();

    useEffect(async()=>{

        axios.get(url, customerHeaders)
        .then(function(res) {
            console.log({res})
            setWeightHistory(res.data)
        })
        .catch(function(error) {
            console.log({error})
        });
        
    },[])
    function handleWeightChange(e){
        setWeight(e.target.value);
    }

    function handleSubmit(){
        axios.post( url, { weight: weight },customerHeaders)
        .then(function (response) {
            setWeight();
            console.log('成功',{response})
            const message = "更新に成功しました！"
            enqueueSnackbar(message, { 
                variant: 'success',
            });
            history.push(`/customer/my_page/${currentCustomer.id}`);
        })
        .catch(function (err) {
            console.log("error", {err})
            const message = err.response?.data.errors[0] + "体重の更新に失敗しました"
            enqueueSnackbar(message, { 
                variant: 'error',
            });
        })
    }

    const renderLineChart = data?
        (
        <LineChart width={600} height={300} data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
            <Line type="monotone" dataKey="uv" stroke="#8884d8" />
            <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
        </LineChart>
        ):
        <></>

    return(
            <>
            <Paper elevation={3} variant="outlined" square>
            <Grid container style={{marginBottom: 10}}>
                <Grid item xs={2}/>
                <Grid item xs={10} style={{marginBottom: 10}}>
                    <div className="customer_info_tag">現在の体重を教えてください</div>
                    <Input
                        id="standard-adornment-weight"
                        value={weight}
                        onChange={handleWeightChange}
                        style={{textAlign: 'center'}}
                        type="number"
                        endAdornment={<InputAdornment position="end">Kg</InputAdornment>}
                        aria-describedby="standard-weight-helper-text"
                        inputProps={{
                        'aria-label': 'weight',
                        }}
                    />
                </Grid>
                <Grid item xs={12} style={{textAlign: 'right', marginRight: 30}}>
                {
                    weight?
                    (<BootstrapButton variant="contained" onClick={handleSubmit} color="primary" disableRipple className={classes.margin}>
                        更新する
                    </BootstrapButton>)
                    :
                    (<BootstrapButton variant="contained" disabled color="primary" disableRipple className={classes.margin}>
                        更新する
                    </BootstrapButton>)
                }
                </Grid>
            </Grid>
            </Paper>
            <div style={{paddingTop: 30}}/>
            <Paper elevation={3} variant="outlined" square style={{textAlign: 'center', padding: 10, fontSize: '1em', fontWeight: 600}}>
                履歴
            </Paper>
            { renderLineChart }
            </>
    )
}

