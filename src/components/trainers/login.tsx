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
import {
  ISignInFormValues,
  ISignInSuccessResponse,
  IErrorResponse,
  IServerMessages,
} from '../../interfaces';
import { setHeaders, setCurrentTrainer } from '../../slices/trainer';
import Paper from '@material-ui/core/Paper';
import errorMessages from '../../constants/errorMessages.json';

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

function TrainerLogIn() {
    const url = `http://localhost:3000/v1/trainer_auth/sign_in`
    const classes = useStyles();
    const dispatch = useDispatch();
    const history = useHistory();
    const { control, errors, handleSubmit } = useForm<ISignInFormValues>();
    const [serverMessages, setServerMessages] = useState<IServerMessages>();

    const onSubmit = (data: SubmitHandler<ISignInFormValues>) => {
      // setLoading(true);
      console.log({data})
      axios
      .post<ISignInSuccessResponse>(url, data)
      .then((res) => {
        console.log("trainer", {res})
        dispatch(setCurrentTrainer(res.data.data));
        dispatch(setHeaders(res.headers));
        history.push('/');
      })
      .catch((err: AxiosError<IErrorResponse>) => {
        // setLoading(false);
        setServerMessages({
          severity: 'error',
          alerts: err.response?.data.errors || [],
        });
      });
  };

  return (
    <>
    <Box my={5}>
      <Container maxWidth="xs">
        <Paper>
        <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
          <Box p={2}>
            <Typography variant="h5" align="center" gutterBottom>
              トレーナーログイン
            </Typography>
            {/* <ServerAlert serverMessages={serverMessages} /> */}
            <form className={classes.form} onSubmit={handleSubmit(onSubmit)}>
              <Box mb={2}>
                <Controller
                  name="email"
                  control={control}
                  defaultValue=""
                  rules={{
                    required: {
                      value: true,
                      message:
                        errorMessages.email.text + errorMessages.required,
                    },
                    maxLength: {
                      value: errorMessages.email.maxLength,
                      message:
                        errorMessages.email.text +
                        errorMessages.is +
                        String(errorMessages.email.maxLength) +
                        errorMessages.maxLength,
                    },
                  }}
                  render={({ ref, value, onChange }, { invalid }) => (
                    <TextField
                      variant="outlined"
                      label="メールアドレス"
                      error={invalid}
                      // disabled={loading}
                      fullWidth
                      inputRef={ref}
                      value={value as string}
                      onChange={(e) => onChange(e.target.value)}
                    />
                  )}
                />
                {/* <ErrorMessage
                  errors={errors}
                  name="email"
                  render={({ message }) => (
                    <Alert severity="error">{message}</Alert>
                  )}
                /> */}
              </Box>
              <Box mb={2}>
                <Controller
                  name="password"
                  control={control}
                  defaultValue=""
                  rules={{
                    required: {
                      value: true,
                      message:
                        errorMessages.password.text + errorMessages.required,
                    },
                    maxLength: {
                      value: errorMessages.password.maxLength,
                      message:
                        errorMessages.password.text +
                        errorMessages.is +
                        String(errorMessages.password.maxLength) +
                        errorMessages.maxLength,
                    },
                  }}
                  render={({ ref, value, onChange }, { invalid }) => (
                    <TextField
                      type="password"
                      variant="outlined"
                      label="パスワード"
                      error={invalid}
                      // disabled={loading}
                      fullWidth
                      inputRef={ref}
                      value={value as string}
                      onChange={(e) => onChange(e.target.value)}
                    />
                  )}
                />
                {/* <ErrorMessage
                  errors={errors}
                  name="password"
                  render={({ message }) => (
                    <Alert severity="error">{message}</Alert>
                  )}
                /> */}
              </Box>
              {/* <LoadingButton loading={loading} primary="SignIn" /> */}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
              >
                ログインする
              </Button>
            </form>
          </Box>
        </div>
        </Paper>
      </Container>
    </Box>
    </>
  );
}

export default TrainerLogIn;