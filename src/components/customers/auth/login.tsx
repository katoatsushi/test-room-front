/* eslint-disable react/prop-types */
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
import CircularProgress from '@material-ui/core/CircularProgress';
import clsx from 'clsx';
import { useHistory } from 'react-router-dom';
import {
  ISignInFormValues,
  ISignInSuccessResponse,
  IErrorResponse,
  IServerMessages,
} from '../../../interfaces';
import {setCurrentCustomer, setCurrentCustomerInfo, setCurrentCustomerStatus, setCurrentCustomerInterests, setHeaders, selectCurrentCustomer} from  '../../../slices/customer';
import { setCustomerRecords, customerRecordRemove, getCustomerRecords } from '../../../slices/customer_record';
import Paper from '@material-ui/core/Paper';
import errorMessages from '../../../constants/errorMessages.json';
import { useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';

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
  // ロード
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
  buttonProgress: {
    color: '#4DA7F0',
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  },
}));

export default function LogIn() {
    const url = `/v1/customer_auth/sign_in`
    const get_customer_datas_url = `/customer/after/sign_in`
    const classes = useStyles();
    const dispatch = useDispatch();
    const history = useHistory();
    const { control, errors, handleSubmit } = useForm<ISignInFormValues>();
    const [serverMessages, setServerMessages] = useState<IServerMessages>();
    const customerRecords = useSelector(getCustomerRecords);
    const [loading, setLoading] = React.useState(false);
    const [success, setSuccess] = React.useState(false);
    const buttonClassname = clsx({
      [classes.buttonSuccess]: success,
    });
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();

    const onSubmit = (data: SubmitHandler<ISignInFormValues>) => {
      if (!loading) {
        setSuccess(false);
        setLoading(true);
      }
      axios
      .post<ISignInSuccessResponse>(url, data)
      .then((res) => {
        setSuccess(true);
        setLoading(false);
        console.log("ログイン",{res})
        const customer_id = res.data.data.id
        dispatch(setCurrentCustomer(res.data.data));
        dispatch(setHeaders(res.headers));
        // お客様の詳細情報を入手
        axios.get(get_customer_datas_url, {headers: res.headers} )
        .then(function(response) {
          // TODO::トレーナーを評価するものを取得
          console.log("成功",{response})
          dispatch(setCurrentCustomerInfo(response.data.customer_info));
          dispatch(setCurrentCustomerStatus(response.data.customer_status));
          dispatch(setCurrentCustomerInterests(response.data.customer_interests));
          if(response.data.evaluations.length){
            dispatch(setCustomerRecords(response.data.evaluations));
            // history.push(`/customer_evaluation_data/${res.data.data.id}`);
            history.push(`/customer/my_page/${customer_id}`);
          }else{
            // console.log("現在返すべきトレーナーの評価はありません")
            history.push(`/customer/my_page/${customer_id}`);
            // history.push(`/customer_evaluation_data/${res.data.data.id}`);
          }
          const message = "ログインに成功しました！"
          enqueueSnackbar(message, { 
              autoHideDuration: 1000,
              variant: 'success',
          });
        })
        .catch(function(error) {
          console.log({error})
        });
      })
      .catch((err: AxiosError<IErrorResponse>) => {
        console.log({err})
        const message = err.response?.data.errors[0];
        enqueueSnackbar(message, { 
            variant: 'error',
        });
        setLoading(false);
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
              ログイン
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
                      // disabled={loading}
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
                      // disabled={loading}
                      fullWidth
                      inputRef={ref}
                      value={value as string}
                      onChange={(e) => onChange(e.target.value)}
                    />
                  )}
                />
              </Box>
              <Link href={`/customer/password/reset`}>
                  パスワードをお忘れの方はこちら
              </Link>
              <div className={classes.wrapper}>
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    className={buttonClassname}
                    disabled={loading || success}
                >
                  ログインする
                </Button>
                {loading && <CircularProgress size={24} className={classes.buttonProgress} />}
              </div>
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