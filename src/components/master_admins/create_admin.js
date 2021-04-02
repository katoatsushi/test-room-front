/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import axios from 'axios'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import { useForm } from "react-hook-form";
import { useHistory } from 'react-router-dom';
import Container from '@material-ui/core/Container';
import Avatar from '@material-ui/core/Avatar';
import CssBaseline from '@material-ui/core/CssBaseline';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
// import TokenHeaders from '../../actions/token_headers';

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

function CreateAdmin(props) {
    const params = props.match.params
    const url = `/companies/${ params.company_id }/v1/admin_auth`
    const classes = useStyles();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [password_confirmation, setPasswordConfirmation] = useState("");
    const history = useHistory();
    const { handleSubmit } = useForm();
    function onSubmit() {
        // var header_tokens = TokenHeaders()
        var header_tokens = {}
        axios.post( url, 
            {
              email: email,
              password: password,
              password_confirmation: password_confirmation
            },
            header_tokens
        )
        .then(function (response) {
            console.log(response);
            if (response.status==200) {
                console.log(response.data);
                history.push(`/master_admin`)
            } else {
               console.log(response);
            }

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
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          管理者新規登録
        </Typography>
        <form className={classes.form} noValidate onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                // required
                fullWidth
                id="email"
                label="メールアドレスを入力してください"
                name="email"
                onChange={ handleEMailChange }
                autoComplete="email"
              />
            </Grid>
            <Grid item xs={10}>
              <TextField
                variant="outlined"
                // required
                fullWidth
                name="password"
                label="パスワードを入力してください"
                type="password"
                id="password"
                onChange={handlePasswordChange}
                autoComplete="current-password"
              />
            </Grid>
            <Grid item xs={10}>
              <TextField
                variant="outlined"
                // required
                fullWidth
                name="password"
                label="(確認)再度パスワードを入力してください"
                type="password"
                id="password"
                onChange={handlePasswordConfirmationChange}
                autoComplete="current-password"
              />
            </Grid>

          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            新規登録する
          </Button>
        </form>
      </div>
    </Container>
  );
}

export default CreateAdmin;