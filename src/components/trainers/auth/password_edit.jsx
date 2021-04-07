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
// import PasswordResetSnackBar from './password_reset_snack_bar'
import PasswordResetBar from '../../snackBars/password_reset'
import CircularProgress from '@material-ui/core/CircularProgress';
import {setCurrentTrainer,  setHeaders} from  '../../../slices/trainer';

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
    const [ message, setMessage ] = useState("");
    const [ error, setError ] = useState(false);
    const [ barOpen, setBarOpen ] = useState(false);
    const [ tokenHeader, setTokenHeader ] = useState();
    const [loading, setLoading] = React.useState(false);
    const [success, setSuccess] = React.useState(false);
    
    useEffect(()=>{
        setBarOpen(false)
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
            setError(false)
            setBarOpen(true)
            setMessage("このページはリロードしないでください")
        })
        .catch(function(error) {
            setError(true)
            setBarOpen(true)
            setMessage("すでにパスワードの設定が完了しました。再度設定し直す場合は「パスワードをお忘れの方」よりメールをお送りください")
          console.log({error})
        });
    },[])

    function handlePasswordResetSubmit() {
      setBarOpen(false)
      if (!loading) {
        setSuccess(false);
        setLoading(true);
      }
      console.log({tokenHeader})
      axios.put(url, submitData, {headers: tokenHeader})
      .then((res) => {
        console.log({res})
        setSuccess(true);
        setLoading(false);
        setError(false)
        setBarOpen(true)
        setMessage(res.data.message)
        dispatch(setCurrentTrainer(res.data.data));
        dispatch(setHeaders(res.headers));
        history.push('/');
      })
      .catch((err) => {
        // すでにパスワードの設定済みや有効期限切れの場合
        console.log({err})
        setLoading(false);
        setBarOpen(true)
        setError(true)
        if(err){
          if(err.response){
            if(err.response.data){
              if(err.response.data.errors.length){
                console.log(err.response.data.errors[0])
                const error = err.response.data.errors[0]
                setMessage(error)
              }
            }
          }
          if(err.response.status){
              setError(true)
              setBarOpen(true)
              setMessage("パスワード再設定のリンクが有効期限切れであるか、すでにパスワードの設定が完了しました。再度パスワードの設定を行う場合はもう一度メールアドレス宛にリンクをお送りください")
          }
        }
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
                disabled={loading || success}
              >
                パスワードを変更する
              </Button>
                {loading && <CircularProgress size={24} className={classes.buttonProgress} />}
              </div>
          </Box>
        </div>
        </Paper>
        {barOpen? (
          // <PasswordResetSnackBar barOpen={barOpen} error={error} message={message} />
          <PasswordResetBar  error={error} message={message} />
        ):<></>}
      </Container>
    </Box>

    </>
  );
}
