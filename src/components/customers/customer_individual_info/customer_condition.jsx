import React , { useEffect, useState } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import { useDispatch } from 'react-redux';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import { Controller, useForm, SubmitHandler } from 'react-hook-form';
import axios, { AxiosError } from 'axios';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { BrowserRouter as Router, Route, Switch, useParams, useHistory, useLocation, } from 'react-router-dom';
import Paper from '@material-ui/core/Paper';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import IconButton from '@material-ui/core/IconButton';
import Input from '@material-ui/core/Input';
import FilledInput from '@material-ui/core/FilledInput';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import clsx from 'clsx';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  margin: {
    margin: theme.spacing(1),
  },
  withoutLabel: {
    marginTop: theme.spacing(1),
  },
  textField: {
    width: '25ch',
  },
}));

function CustomerConditions(props) {
    const classes = useStyles();
    const [weight, setWeight] = React.useState()
    const [height, setHeight] = React.useState()
    function handleHeightChange(e){
      setHeight(e.target.value);
    }
    function handleWeightChange(e){
      setWeight(e.target.value);
    }

    useEffect(()=>{
      props.setCustomerStatus((prev) => ({...prev, condition: {weight: weight, height: height}}))
    },[weight, height])

    return (
        <>
        <Grid container alignItems="center" justify="center">
        <Grid item xs={9}>
            <div className="customer_info_tag">身長・体重を教えてください</div>
            <FormControl className={clsx( classes.withoutLabel, classes.textField)}>
            <div className="customer_info_tag">身長(現在)</div>
            <Input
                id="standard-adornment-height"
                value={height}
                onChange={handleHeightChange}
                type="number"
                endAdornment={<InputAdornment position="end">cm</InputAdornment>}
                aria-describedby="standard-weight-helper-text"
                inputProps={{
                'aria-label': 'height',
                }}
            />
            </FormControl>
            <FormControl className={clsx( classes.withoutLabel, classes.textField)}>
            <div className="customer_info_tag">体重(現在)</div>
            <Input
                id="standard-adornment-weight"
                value={weight}
                onChange={handleWeightChange}
                type="number"
                endAdornment={<InputAdornment position="end">Kg</InputAdornment>}
                aria-describedby="standard-weight-helper-text"
                inputProps={{
                'aria-label': 'weight',
                }}
            />
            </FormControl>
            <br/>
            {/* <Link href="/customer_info/interests">
                次へ
            </Link> */}
        </Grid>   
        </Grid>
        </>
    );
}

export default CustomerConditions;