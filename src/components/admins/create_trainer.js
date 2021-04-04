/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import axios from 'axios'
import Button from '@material-ui/core/Button'
import InputLabel from '@material-ui/core/InputLabel';
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
import { useSelector} from 'react-redux';
import { selectCurrentAdmin, selectAdminHeaders } from '../../slices/admin';
import CheckTrainerMenues from './check_trainer_menues'
import clsx from 'clsx';
import CircularProgress from '@material-ui/core/CircularProgress';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    alignItems: 'center',
  },
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
  wrapper: {
    margin: theme.spacing(1),
    position: 'relative',
  },
  buttonSuccess: {
    backgroundColor: '#4DA7F0',
    '&:hover': {
      backgroundColor: '#4DA7F0',
    },
  },
  submitButtonSuccess: {
    backgroundColor: 'silver',
    '&:hover': {
      backgroundColor: 'silver',
    },
  },
  fabProgress: {
    color: '#4DA7F0',
    position: 'absolute',
    top: -6,
    left: -6,
    zIndex: 1,
  },
  buttonProgress: {
    color: '#4DA7F0',
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  },
}));

function CreateTrainer() {
    const classes = useStyles();
    const currentAdmin = useSelector(selectCurrentAdmin);
    const admin_headers = useSelector(selectAdminHeaders);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [password_confirmation, setPasswordConfirmation] = useState("");
    const [trainerMenues, setTrainerMenues] = useState([]);
    const history = useHistory();
    const { handleSubmit } = useForm();
    const getFitnesses = `/fitnesses`
    const [allFitnesses, setAllFitnesses] = useState([]);
    const [loading, setLoading] = React.useState(false);
    const [success, setSuccess] = React.useState(false);
    const [name, setName] = useState({first_name_kanji: "", last_name_kanji: "", first_name_kana: "",last_name_kana: ""});

    const buttonClassname = clsx({
      [classes.buttonSuccess]: success,
    });
    useEffect(()=>{
       axios.get(getFitnesses, admin_headers)
        .then(function(res) {
            if (res.data.status==200) {
                setAllFitnesses(res.data.fitnesses);
            }
        })
        .catch(function(error) {
          console.log({error})
        });
    },[])

    function onSubmit() {
        if (!loading) {
          setSuccess(false);
          setLoading(true);
        }
        const url = `/companies/${ currentAdmin.company_id }/v1/trainer_auth`
        axios.post( url,
            // トレーナーの登録
            {
              first_name_kana: name.first_name_kana,
              last_name_kana: name.last_name_kana,
              first_name_kanji: name.first_name_kanji,
              last_name_kanji: name.last_name_kanji,
              email: email,
              password: password,
              password_confirmation: password_confirmation,
              company_id: currentAdmin.company_id
            },
            admin_headers
        )
        .then(function (response) {
            // fitnessとの関連付け
            const fitness_url = `/set_fitnesses`
            console.log({response})
            axios.post( fitness_url,
                {
                  trainer: response.data,
                  fitness_data: trainerMenues
                },
                admin_headers
            )
            .then(function (response) {
                setSuccess(true);
                setLoading(false);
                console.log({response})
                history.push(`/`)
            }).catch(function (response) {
              setLoading(false);
              console.log({response})
            })
        }).catch(function (response) {
            setLoading(false);
            console.log({response})
        })
    }
    const handleEMailChange = (e) => {
        setEmail(e.target.value);
    };
    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };
    const handlePasswordConfirmationChange = (e) => {
        setPasswordConfirmation(e.target.value);
    };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          トレーナーを新規登録する
        </Typography>
        <form className={classes.form} noValidate onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={2}>
            <InputLabel id="demo-store-select-outlined-label" >セッションスキルを選択してください(複数可)</InputLabel>
            <Grid item xs={12}>
              <CheckTrainerMenues setTrainerMenues={setTrainerMenues} trainerMenues={trainerMenues} allFitnesses={allFitnesses}/>
            </Grid>

            <Grid item xs={6} sm={6}>
              <TextField
                autoComplete="fname"
                variant="outlined"
                fullWidth
                id="firstnamekanji"
                onChange={(e) => setName((prev) => ({...prev, first_name_kanji: e.target.value}))}
                label="姓"
                autoFocus
              />
            </Grid>
            <Grid item xs={6} sm={6}>
              <TextField
                variant="outlined"
                fullWidth
                id="lastNamekanji"
                label="名"
                onChange={(e) => setName((prev) => ({...prev, last_name_kanji: e.target.value}))}
                autoComplete="lname"
              />
            </Grid>
            <Grid item xs={6} sm={6}>
              <TextField
                autoComplete="fname"
                variant="outlined"
                fullWidth
                id="firstnamekana"
                onChange={(e) => setName((prev) => ({...prev, first_name_kana: e.target.value}))}
                label="せい(かな)"
              />
            </Grid>
            <Grid item xs={6} sm={6}>
              <TextField
                variant="outlined"
                fullWidth
                id="lastName"
                label="めい(かな)"
                onChange={(e) => setName((prev) => ({...prev, last_name_kana: e.target.value}))}
                autoComplete="lname"
              />
            </Grid>

            <InputLabel id="demo-store-select-outlined-label" >メールアドレス・パスワードを入力してください</InputLabel>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                // required
                fullWidth
                id="email"
                label="メールアドレスを入力してください"
                name="email"
                onChange={ handleEMailChange }
                autoComplete="email"
              />
            </Grid>
            <Grid item xs={10}>
              <TextField
                variant="outlined"
                // required
                fullWidth
                name="password"
                label="パスワードを入力してください"
                type="password"
                id="password"
                onChange={handlePasswordChange}
                autoComplete="current-password"
              />
            </Grid>
            <Grid item xs={10}>
              <TextField
                variant="outlined"
                // required
                fullWidth
                name="password"
                label="(確認)再度パスワードを入力してください"
                type="password"
                id="password"
                onChange={handlePasswordConfirmationChange}
                autoComplete="current-password"
              />
            </Grid>

          </Grid>
          {name.first_name_kanji && name.last_name_kanji  && name.first_name_kana  && name.last_name_kana && 
            email && password && password_confirmation &&
            password == password_confirmation? (<>
              <div className={classes.wrapper}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  className={buttonClassname}
                  disabled={loading || success}
                >
                  新規登録する
                </Button>
                {loading && <CircularProgress size={24} className={classes.buttonProgress} />}
              </div>
            </>) : (<>
            <div className={classes.wrapper}>
              <Button
                type="submit"
                variant="contained"
                fullWidth
                className={buttonClassname}
                disabled
              >
                新規登録する
              </Button>
              {loading && <CircularProgress size={24} className={classes.buttonProgress} />}
            </div>
            </>)}
        </form>
      </div>
    </Container>
  );
}

export default CreateTrainer;