/* eslint-disable react/prop-types */
import React , { useEffect, useState } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Box from '@material-ui/core/Box';
import { Controller, useForm, SubmitHandler } from 'react-hook-form';
import axios from 'axios';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { BrowserRouter as Router, Route, Switch, useParams, useHistory, useLocation, } from 'react-router-dom';
import clsx from 'clsx';
import {
  ISignInFormValues,
  ISignInSuccessAdminResponse,
  IServerMessages,
} from '../../interfaces';
import Paper from '@material-ui/core/Paper';
import errorMessages from '../../constants/errorMessages.json';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import CircularProgress from '@material-ui/core/CircularProgress';
import { useSnackbar } from 'notistack';
import { useSelector, useDispatch } from 'react-redux';
import { selectCustomerHeaders, customerRemove, selectCurrentCustomer} from  '../../slices/customer';
import { selectCurrentTrainer, selectTrainerHeaders, trainerRemove, setCurrentTrainer } from '../../slices/trainer';
import { selectCurrentAdmin, selectAdminHeaders, adminRemove, setHeaders, setCurrentAdmin } from '../../slices/admin';
import { selectCurrentMasterAdmin, selectMasterAdminHeaders, masterAdminRemove, } from '../../slices/master_admin'

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

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export default function AdminLogIn() {
    const url = `/v1/admin_auth/sign_in`
    const classes = useStyles();
    const dispatch = useDispatch();
    const history = useHistory();
    const { control, errors, handleSubmit } = useForm<ISignInFormValues>();
    const [serverMessages, setServerMessages] = useState<IServerMessages>();
    const [snackOpen, setSnackOpen] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState();
    const [loading, setLoading] = React.useState(false);
    const [success, setSuccess] = React.useState(false);
    const buttonClassname = clsx({
      [classes.buttonSuccess]: success,
    });
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const customerHeader = useSelector(selectCustomerHeaders);
    const trainerHeader = useSelector(selectTrainerHeaders);
    const adminHeader = useSelector(selectAdminHeaders);
    const masterAdminHeader = useSelector(selectMasterAdminHeaders);

    const handleSnackbarClick = () => {
      setSnackOpen(true);
    };
    const handleSnackbarClose = (event, reason) => {
      if (reason === 'clickaway') {
        return;
      }
      setSnackOpen(false);
    };

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
      .post<ISignInSuccessAdminResponse>(url, data)
      .then((res) => {
        setSuccess(true);
        setLoading(false);
        console.log("admin",{res})
        dispatch(setCurrentAdmin(res.data.data));
        dispatch(setHeaders(res.headers));
        const message = "ログインに成功しました！"
        enqueueSnackbar(message, {
            autoHideDuration: 1000,
            variant: 'success',
        });
        history.push('/customer_all');
      })
      .catch((err) => {
        const message = err.response?.data.errors[0];
        enqueueSnackbar(message, { 
            variant: 'error',
        });
        setLoading(false);
        console.log({err})
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
              管理者ログイン
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
      {/* 追加 */}
      <Snackbar  anchorOrigin={{ vertical: 'top', horizontal: 'center' }} open={snackOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert severity="error" onClose={handleSnackbarClose}>{errorMessage}</Alert>
      </Snackbar>
      {/* 追加 */}
    </Box>
    </>
  );
}