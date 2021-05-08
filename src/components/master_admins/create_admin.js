/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import axios from 'axios'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import { useForm } from "react-hook-form";
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Container from '@material-ui/core/Container';
import Avatar from '@material-ui/core/Avatar';
import CssBaseline from '@material-ui/core/CssBaseline';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { selectCurrentMasterAdmin, selectMasterAdminHeaders, masterAdminRemove, } from '../../slices/master_admin';
import clsx from 'clsx';
import CircularProgress from '@material-ui/core/CircularProgress';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    alignItems: 'center',
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

function CreateAdmin(props) {
    const params = props.match.params
    const url = `/companies/${ params.company_id }/v1/admin_auth`
    const classes = useStyles();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [password_confirmation, setPasswordConfirmation] = useState("");
    const history = useHistory();
    const { handleSubmit } = useForm();
    const master_admin_headers = useSelector(selectMasterAdminHeaders);
    const [loading, setLoading] = React.useState(false);
    const [success, setSuccess] = React.useState(false);
    const buttonClassname = clsx({
      [classes.buttonSuccess]: success,
    });

    function onSubmit() {
        if (!loading) {
          setSuccess(false);
          setLoading(true);
        }
        var header_tokens = {}
        axios.post( url, 
            {
              email: email,
              password: password,
              password_confirmation: password_confirmation
            },
            master_admin_headers
        )
        .then(function (response) {
          setSuccess(true);
          setLoading(false);
          if (response.status==200) {
              history.push(`/master_admin`)
          } else {
              console.log(response);
          }
        }).catch(function (response) {
          setLoading(false);
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
          管理者新規登録
        </Typography>
        <form className={classes.form} noValidate onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
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

        </form>
      </div>
    </Container>
  );
}

export default CreateAdmin;