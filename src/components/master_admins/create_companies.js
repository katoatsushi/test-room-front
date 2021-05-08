/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import axios from 'axios'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import {  makeStyles } from '@material-ui/core/styles';
import { useForm } from "react-hook-form";
import { useHistory } from 'react-router-dom';
import Container from '@material-ui/core/Container';
import Avatar from '@material-ui/core/Avatar';
import CssBaseline from '@material-ui/core/CssBaseline';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

function CreateCompany() {
    const url = `/companies`
    const classes = useStyles();
    const [name, setName] = useState("");
    const [address, setAddress] = useState("");
    const [telFirst, setTelFirst] = useState("");
    const [telSecond, setTelSecond] = useState("");
    const [telThird, setTelThird] = useState("");
    const history = useHistory();
    const { handleSubmit } = useForm();

    function onSubmit() {
        const tel = `${telFirst}-${telSecond}-${telThird}`
        axios.post( url, {
            name: name,
            address: address,
            tel: tel
        })
        .then(function (response) {
            if (response.status==200) {
                history.push(`/master_admin`)
            } else {
               console.log(response);
            }
        })
    }

    const handleNameChange = (e) => {
        setName(e.target.value);
    };
    const handleAddressChange = (e) => {
        setAddress(e.target.value);
    };
    const handleTelFirstChange = (e) => {
        setTelFirst(e.target.value);
    };
    const handleTelSecondChange = (e) => {
        setTelSecond(e.target.value);
    };
    const handlesetTelThirdChange = (e) => {
        setTelThird(e.target.value);
    };
  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          企業新規発行
        </Typography>

        <form className={classes.form} noValidate onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                fullWidth
                id="name"
                label="会社名を入力してください"
                name="name"
                onChange={ handleNameChange }
                autoComplete="name"
              />
            </Grid>
            <Grid item xs={10}>
              <TextField
                variant="outlined"
                fullWidth
                name="address"
                label="住所を入力してください"
                type="address"
                id="address"
                onChange={handleAddressChange}
                autoComplete="current-address"
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                autoComplete="fname"
                name="firstName"
                variant="outlined"
                fullWidth
                id="firstname"
                placeholder="012"
                // label="電話番号"
                onChange={handleTelFirstChange}
                autoFocus
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                variant="outlined"
                fullWidth
                id="lastName"
                // label="345"
                placeholder="012"
                name="lastName"
                onChange={handleTelSecondChange}
                autoComplete="lname"
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                variant="outlined"
                fullWidth
                id="lastName"
                // label="678"
                placeholder="012"
                name="lastName"
                onChange={handlesetTelThirdChange}
                autoComplete="lname"
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            企業を追加する
          </Button>
        </form>
      </div>
    </Container>
  );
}

export default CreateCompany;