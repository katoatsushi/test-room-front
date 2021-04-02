/* eslint-disable react/prop-types */
import React , { useEffect } from 'react';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import Input from '@material-ui/core/Input';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormControl from '@material-ui/core/FormControl';
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