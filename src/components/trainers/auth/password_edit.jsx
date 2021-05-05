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
import CircularProgress from '@material-ui/core/CircularProgress';
import {setCurrentTrainer,  setHeaders} from  '../../../slices/trainer';
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
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  root: {
    flexGrow: 1,
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

export default function TrainerPasswordEdit(props) {
    console.log({props})
    const url = `/v1/trainer_auth/password`
    const classes = useStyles();
    const dispatch = useDispatch();
    const history = useHistory();
    const [ submitData, setSubmitData ] = useState({password: "", password_confirmation: ""});
    const [ tokenHeader, setTokenHeader ] = useState();
    const [loading, setLoading] = React.useState(false);
    const [success, setSuccess] = React.useState(false);
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    
    useEffect(()=>{
        let params = (new URL(document.location)).searchParams;
        let reset_password_token = params.get('reset_password_token'); 
        console.log({reset_password_token})
        const dataSet = {reset_password_token: reset_password_token, redirect_url: "http://localhost:3000"}
        const get_token_url = '/v1/trainer_auth/password/edit'
        axios.get(get_token_url, {params: dataSet})
        .then(function(res) { 
          console.log({res})
          const str = res.data.tokens
          const tokensString =  str.split('?')[1];
          const tokenSet =  tokensString.split('&');
          var tokens = {};
          tokenSet.forEach(function( t ) {
              var key = t.split('=')[0]
              var value = ""
              if(key=="uid"){
                value = t.split('=')[1]
                value = value.replace("%40", "@");
              }else{
                value = t.split('=')[1]
              }
              tokens[`${key}`] = value
          });
          setTokenHeader(tokens)
          const message = "新しいパスワードを設定してください"
          enqueueSnackbar(message, { 
              variant: 'info',
          });
        })
        .catch(function(error) {
          const message = "リンクが無効です。再度設定し直す場合は「パスワードをお忘れの方」よりメールをお送りください"
          enqueueSnackbar(message, { 
              variant: 'error',
          });
          console.log({error})
        });
    },[])

    function handlePasswordResetSubmit() {
      if (!loading) {
        setSuccess(false);
        setLoading(true);
      }
      axios.put(url, submitData, {headers: tokenHeader})
      .then((res) => {
        setSuccess(true);
        setLoading(false);
        dispatch(setCurrentTrainer(res.data.data));
        dispatch(setHeaders(res.headers));
        const message = res.data.message
        enqueueSnackbar(message, { 
            variant: 'success',
        });
        history.push('/');
      })
      .catch((err) => {
        // すでにパスワードの設定済みや有効期限切れの場合
        console.log({err})
        setLoading(false);
        const message = err.response?.data.errors[0]
        enqueueSnackbar(message, { 
            variant: 'error',
        });
      });
    }

    function handlePasswordChange(e) {
      setSubmitData((prev) => ({password: e.target.value, password_confirmation: prev.password_confirmation}))
    }

    function handlePasswordConfirmationChange(e) {
      setSubmitData((prev) => ({password: prev.password, password_confirmation: e.target.value}))
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
              【トレーナー】パスワードを変更する
            </Typography>
              <Box mb={2}>
                    <TextField
                      variant="outlined"
                      label="パスワード"
                      fullWidth
                      value={submitData.password}
                      onChange={handlePasswordChange}
                    />
              </Box>
              <Box mb={2}>
                    <TextField
                      variant="outlined"
                      label="パスワード"
                      fullWidth
                      value={submitData.password_confirmation}
                      onChange={handlePasswordConfirmationChange}
                    />
              </Box>
              <div className={classes.wrapper}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
                onClick={ handlePasswordResetSubmit }
                disabled={
                  loading || success || !tokenHeader || 
                  submitData.password == "" ||
                  submitData.password_confirmation == "" ||
                 !submitData.password === submitData.password_confirmation
                }
              >
                パスワードを変更する
              </Button>
                {loading && <CircularProgress size={24} className={classes.buttonProgress} />}
              </div>
          </Box>
        </div>
        </Paper>
      </Container>
    </Box>

    </>
  );
}
