/* eslint-disable react/prop-types */
import React , { useState } from 'react';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import { useForm } from "react-hook-form";
import axios from 'axios'
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { useHistory } from 'react-router-dom';
import clsx from 'clsx';
import CircularProgress from '@material-ui/core/CircularProgress';
import Fab from '@material-ui/core/Fab';
import CheckIcon from '@material-ui/icons/Check';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://material-ui.com/">
        Room
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

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
    // backgroundColor: 'silver',
    '&:hover': {
      backgroundColor: '#4DA7F0',
      // backgroundColor: 'silver',
    },
  },
  submitButtonSuccess: {
    // backgroundColor: '#4DA7F0',
    backgroundColor: 'silver',
    '&:hover': {
      // backgroundColor: '#4DA7F0',
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


function SignUp() {
    const [companyId, setCompanyId] = React.useState();
    const classes = useStyles();
    const [email, setEmail] = useState("ka.baseball1997@gmail.com");
    const [password, setPassword] = useState("gonza1026");
    const [password_confirmation, setPasswordConfirmation] = useState("gonza1026");
    const history = useHistory();
    const { handleSubmit } = useForm();
    const [loading, setLoading] = React.useState(false);
    const [success, setSuccess] = React.useState(false);
    const timer = React.useRef();
    const [open, setOpen] = React.useState(false);
    const [name, setName] = useState({first_name_kanji: "", last_name_kanji: "", first_name_kana: "",last_name_kana: ""});
    const handleClose = () => {
      setOpen(false);
    };
    const buttonClassname = clsx({
      [classes.buttonSuccess]: success,
    });

    React.useEffect(() => {
      axios.get('/customer/get_company_id')
      .then(function(res) {
          setCompanyId(res.data.id)
      })
      return () => {
        clearTimeout(timer.current);
      };
    }, []);

    function onSubmit() {
      console.log({companyId})
      const url = `/companies/${ companyId }/v1/customer_auth`
      if (!loading) {
        setSuccess(false);
        setLoading(true);
      }
      axios.post( url, {
          first_name_kana: name.first_name_kana,
          last_name_kana: name.last_name_kana,
          first_name_kanji: name.first_name_kanji,
          last_name_kanji: name.last_name_kanji,
          email: email,
          password: password,
          password_confirmation: password_confirmation
      })
      .then(function (response) {
          setSuccess(true);
          setLoading(false);
          setOpen(true);
          console.log(response.data.data)
          history.push(`/`)
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
        <div className={classes.wrapper}>
          <Fab
            aria-label="save"
            color="primary"
            className={buttonClassname}
          >
            {success ? <CheckIcon /> : <LockOutlinedIcon/>}
          </Fab>
          {loading && <CircularProgress size={68} className={classes.fabProgress} />}
        </div>
        <Typography component="h1" variant="h5">
          新規登録
        </Typography>
        <form className={classes.form} noValidate onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={2}>
            <Grid item xs={6} sm={6}>
              <TextField
                autoComplete="fname"
                // name="firstName"
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
                // name="lastName"
                onChange={(e) => setName((prev) => ({...prev, last_name_kanji: e.target.value}))}
                autoComplete="lname"
              />
            </Grid>
            <Grid item xs={6} sm={6}>
              <TextField
                autoComplete="fname"
                // name="firstName"
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
                // name="lastNamekana"
                onChange={(e) => setName((prev) => ({...prev, last_name_kana: e.target.value}))}
                autoComplete="lname"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                fullWidth
                id="email"
                label="メールアドレスを入力してください"
                value={email}
                name="email"
                onChange={ handleEMailChange }
                autoComplete="email"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                fullWidth
                name="password"
                label="パスワードを入力してください"
                value={password}
                type="password"
                id="password"
                onChange={handlePasswordChange}
                autoComplete="current-password"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                fullWidth
                name="password"
                label="再度パスワードを入力してください"
                value={password_confirmation}
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

          <Grid container justify="flex-end">
            <Grid item>
              <Link href="/customer/log_in" variant="body2">
                すでにアカウントをお持ちの方はこちらへ
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
      <Box mt={5}>
        <Copyright />
      </Box>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        style={{textAlign: 'center'}}
      ><br/>
      <Fab
        aria-label="save"
        color="primary"
        className={buttonClassname}
        style={{ margin: '0 auto'}}
        >
          <CheckIcon/>
        </Fab>
        <DialogTitle id="alert-dialog-title">
        認証メールを送信しました！
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            ご登録されたメールアドレス宛に認証メールを送信しました。<br/>
            添付されているリンクから、認証を完了させてください。
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            閉じる
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default SignUp;