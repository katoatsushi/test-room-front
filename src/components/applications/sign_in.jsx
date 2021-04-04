import React , { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
}));

export default function SignIn(setSubmitData){
    const classes = useStyles();
    
    return(
    <div className={classes.root}>
      <Grid container spacing={3}>
        <Grid item xs={12} style={{textAlign: 'center'}}>
            <TextField 
                id="outlined-basic" 
                label="メールアドレス" 
                variant="outlined"
                onChange={(e) => setSubmitData((prev) => ({password: prev.password, email: e.target.value}))}
            />
          </Grid>
          <Grid item xs={12} style={{textAlign: 'center'}}>
            <TextField 
                id="outlined-basic" 
                label="パスワード" 
                variant="outlined"
                onChange={(e) => setSubmitData((prev) => ({email: prev.email, password: e.target.value}))}
            />
        </Grid>
      </Grid>
    </div>
    )
}