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
// import { BrowserRouter as useHistory } from 'react-router-dom';
import { useHistory } from 'react-router-dom';
import { setHeaders, setCurrentMasterAdmin } from '../../slices/master_admin';
import Paper from '@material-ui/core/Paper';
import SignIn from '../applications/sign_in'

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

function MasterAdminLogIn() {
    const url = `/v1/master_admin_auth/sign_in`
    const classes = useStyles();
    const dispatch = useDispatch();
    const history = useHistory();
    const [submitData, setSubmitData] = useState({email: "", password: ""});

    function handleSubmit(){
      axios
      .post(url,submitData)
      .then((res) => {
        dispatch(setCurrentMasterAdmin(res.data.data));
        dispatch(setHeaders(res.headers));
        history.push('/');
      })
      .catch((err) => {
        console.log({err})
      });
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
            <Typography variant="h5" align="center" gutterBottom>
              マスタ管理者ログイン
            </Typography>
              <SignIn setSubmitData={setSubmitData} />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                onClick={handleSubmit}
                className={classes.submit}
              >
                ログインする
              </Button>
          </Box>
        </div>
        </Paper>
      </Container>
    </Box>
    </>
  );
}

export default MasterAdminLogIn;