/* eslint-disable react/prop-types */
import React , { useEffect, useState } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Box from '@material-ui/core/Box';
import { Controller, useForm, SubmitHandler } from 'react-hook-form';
import axios, { AxiosError } from 'axios';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { useHistory } from 'react-router-dom';
import {
  ISignInFormValues,
  ISignInSuccessTrainerResponse,
  IErrorResponse,
  IServerMessages,
} from '../../../interfaces';
import { useSelector, useDispatch } from 'react-redux';
import { selectCustomerHeaders, customerRemove, selectCurrentCustomer} from  '../../../slices/customer';
import { selectCurrentTrainer, selectTrainerHeaders, trainerRemove,setHeaders, setCurrentTrainer } from '../../../slices/trainer';
import { selectCurrentAdmin, selectAdminHeaders, adminRemove, } from '../../../slices/admin';
import { selectCurrentMasterAdmin, selectMasterAdminHeaders, masterAdminRemove, } from '../../../slices/master_admin'
import Paper from '@material-ui/core/Paper';
import errorMessages from '../../../constants/errorMessages.json';
import { useSnackbar } from 'notistack';
import CircularProgress from '@material-ui/core/CircularProgress';
import clsx from 'clsx';

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

export default function TrainerLogIn() {
    const url = `/v1/trainer_auth/sign_in`
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const classes = useStyles();
    const dispatch = useDispatch();
    const history = useHistory();
    const { control, errors, handleSubmit } = useForm<ISignInFormValues>();
    const [serverMessages, setServerMessages] = useState<IServerMessages>();
    const [loading, setLoading] = React.useState(false);
    const [success, setSuccess] = React.useState(false);
    const buttonClassname = clsx({
      [classes.buttonSuccess]: success,
    });
    // 認証用
    const customerHeader = useSelector(selectCustomerHeaders);
    const trainerHeader = useSelector(selectTrainerHeaders);
    const adminHeader = useSelector(selectAdminHeaders);
    const masterAdminHeader = useSelector(selectMasterAdminHeaders);

    function DeleteAuth() {
        if(customerHeader){
            dispatch(customerRemove());
        }else if(trainerHeader){
            dispatch(trainerRemove());
        }else if(adminHeader){
            dispatch(adminRemove());
        }else if(masterAdminHeader){
            dispatch(masterAdminRemove());
        } 
    }

    const onSubmit = (data: SubmitHandler<ISignInFormValues>) => {
      DeleteAuth()
      if (!loading) {
        setSuccess(false);
        setLoading(true);
      }
      axios
      .post<ISignInSuccessTrainerResponse>(url, data)
      .then((res) => {
        setSuccess(true);
        setLoading(false);
        const trainer_id = res.data.data.id
        dispatch(setCurrentTrainer(res.data.data));
        dispatch(setHeaders(res.headers));
        const message = "ログインに成功しました！"
        enqueueSnackbar(message, {
            autoHideDuration: 1000,
            variant: 'success',
        });
        history.push('/trainers/customer_session_records');
      })
      .catch((err: AxiosError<IErrorResponse>) => {
        setLoading(false);
        console.log({err})
        const message = err.response?.data.errors[0];
        enqueueSnackbar(message, { 
            variant: 'error',
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
                      // disabled={loading}
                      fullWidth
                      inputRef={ref}
                      value={value as string}
                      onChange={(e) => onChange(e.target.value)}
                    />
                  )}
                />
              <Link href={`/trainer/password/reset`}>
                  パスワードをお忘れの方はこちら
              </Link>
              </Box>
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
            </form>
          </Box>
        </div>
        </Paper>
      </Container>
    </Box>
    </>
  );
}