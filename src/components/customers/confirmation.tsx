import React , { useEffect, useState } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import { useDispatch } from 'react-redux';
import TextField from '@material-ui/core/TextField';
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
import { setHeaders, setCurrentCustomer } from '../../slices/customer';
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

function Confirmation(props) {
    const classes = useStyles();
    const dispatch = useDispatch();
    const history = useHistory();
    const { control, errors, handleSubmit } = useForm<ISignInFormValues>();
    const [serverMessages, setServerMessages] = useState<IServerMessages>();

    const onSubmit = (data: SubmitHandler<ISignInFormValues>) => {
        const confirmation_response = props.location.search
        let confirmations = confirmation_response.split('&');
        const confirmation_token = confirmations[1].split('=');
        const confirmation_token_values = confirmation_token[1]
        const confirm_url = `http://localhost:3000/customer_confirm_ok`
        const sign_in_url = `http://localhost:3000/v1/customer_auth/sign_in`
        axios.post(confirm_url, {token: confirmation_token_values})
        .then((res) => {
            axios.post<ISignInSuccessResponse>(sign_in_url, data)
            .then((res) => {
                console.log({res})
                dispatch(setCurrentCustomer(res.data.data));
                dispatch(setHeaders(res.headers));
                history.push('/customer_info/new');
            })
            .catch((err: AxiosError<IErrorResponse>) => {
                setServerMessages({
                severity: 'error',
                alerts: err.response?.data.errors || [],
                });
            });
        })
        .catch((err: AxiosError<IErrorResponse>) => {
            console.log({err})
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
              認証を完了させる
            </Typography>
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
                      fullWidth
                      inputRef={ref}
                      value={value as string}
                      onChange={(e) => onChange(e.target.value)}
                    />
                  )}
                />
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
                      fullWidth
                      inputRef={ref}
                      value={value as string}
                      onChange={(e) => onChange(e.target.value)}
                    />
                  )}
                />
              </Box>
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="secondary"
                    // onClick={onSubmit}
                    >
                    認証を完了する
                </Button>
              <Grid container justify="flex-end">
                <Grid item>
                  <Link href="/customer/sign_up" variant="body2">
                    {/* まだアカウントをお持ちでない方はこちらへ */}
                  </Link>
                </Grid>
              </Grid>
            </form>
          </Box>
        </div>
        </Paper>
      </Container>
    </Box>
    </>
  );
}

export default Confirmation;