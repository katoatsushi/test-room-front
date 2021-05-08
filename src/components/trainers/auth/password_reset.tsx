/* eslint-disable react/prop-types */
import React , { useEffect, useState } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import { useDispatch } from 'react-redux';
import TextField from '@material-ui/core/TextField';
import Box from '@material-ui/core/Box';
import axios from 'axios';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { useHistory } from 'react-router-dom';
import Paper from '@material-ui/core/Paper';
import clsx from 'clsx';
import CircularProgress from '@material-ui/core/CircularProgress';
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

export default function TrainerPasswordReset() {
    let redirect_url = ''
    switch (process.env.NODE_ENV) {
    case 'development':
        redirect_url = 'http://localhost:3001/trainer/password/'
        break;
    case 'production':
        redirect_url = 'https://room-backend-sample.herokuapp.com/'
        break;
    default:
        redirect_url  = 'http://localhost:3001/trainer/password/';
    }
    
    const url = `/v1/trainer_auth/password`
    const classes = useStyles();
    const [ submitData, setSubmitData ] = useState({email: "", redirect_url: redirect_url});
    const [loading, setLoading] = React.useState(false);
    const [success, setSuccess] = React.useState(false);
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const buttonClassname = clsx({
      [classes.buttonSuccess]: success,
    });

    function handlePasswordResetSubmit() {
      if (!loading) {
        setSuccess(false);
        setLoading(true);
      }
      axios.post(url, submitData)
      .then((res) => {
        setSuccess(true);
        setLoading(false);
        const message = res.data.message
        enqueueSnackbar(message, { 
            variant: 'success',
        });
      })
      .catch((err) => {
        setLoading(false);
        const message = err.response?.data.errors[0]
        enqueueSnackbar(message, { 
            variant: 'error',
        });
      });
    }

    function handleEmailChange(e) {
      setSubmitData((prev) => ({email: e.target.value, redirect_url: prev.redirect_url}))
    }

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
            <Typography variant="h6" align="center" gutterBottom>
              【トレーナー】パスワード再発行
            </Typography>
              <Box mb={2}>
                    <TextField
                      variant="outlined"
                      label="メールアドレス"
                      fullWidth
                      value={submitData.email}
                      onChange={handleEmailChange}
                    />
              </Box>
              <div className={classes.wrapper}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
                 disabled={loading || success}
                onClick={ handlePasswordResetSubmit }
              >
                パスワードのリセットの案内を送る
              </Button>
              {loading && <CircularProgress size={30} className={classes.buttonProgress} />}
              </div>
          </Box>
        </div>
        </Paper>
      </Container>
    </Box>

    </>
  );
}
