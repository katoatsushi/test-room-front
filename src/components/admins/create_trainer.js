import React, { useEffect, useState, Component } from 'react';
import axios from 'axios'
import { connect } from 'react-redux'
import { Field, reduxForm } from 'redux-form'
import Button from '@material-ui/core/Button'
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Grid from '@material-ui/core/Grid';
import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import TextField from '@material-ui/core/TextField';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import { useForm } from "react-hook-form";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import {
    BrowserRouter as Router,
    Route,
    Switch,
    useParams,
    useHistory,
    useLocation,
  } from 'react-router-dom';
import { Link } from 'react-router-dom'
import Container from '@material-ui/core/Container';
import Avatar from '@material-ui/core/Avatar';
import CssBaseline from '@material-ui/core/CssBaseline';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { useSelector, useDispatch } from 'react-redux';
import { selectCurrentAdmin, selectAdminHeaders, adminRemove, } from '../../slices/admin';
import CheckTrainerMenues from './check_trainer_menues'
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

function CreateTrainer(props) {
    const classes = useStyles();
    const currentAdmin = useSelector(selectCurrentAdmin);
    const admin_headers = useSelector(selectAdminHeaders);
    const [companyId, setCompanyId] = useState();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [password_confirmation, setPasswordConfirmation] = useState("");
    const [trainerMenues, setTrainerMenues] = useState([]);
    const history = useHistory();
    const { handleSubmit } = useForm();
    const getFitnesses = `/fitnesses`
    const [allFitnesses, setAllFitnesses] = useState([]);

    useEffect(()=>{
       axios.get(getFitnesses, admin_headers)
        .then(function(res) {
            if (res.data.status==200) {
                setAllFitnesses(res.data.fitnesses);
            }
        })
        .catch(function(error) {
          console.log({error})
        });
    },[])

    function onSubmit() {
        const url = `/companies/${ currentAdmin.company_id }/v1/trainer_auth`
        axios.post( url,
            // トレーナーの登録
            {
              email: email,
              password: password,
              password_confirmation: password_confirmation,
              company_id: currentAdmin.company_id
            },
            admin_headers
        )
        .then(function (response) {
            // fitnessとの関連付け
            const fitness_url = `/set_fitnesses`
            console.log({response})
            axios.post( fitness_url,
                {
                  trainer: response.data,
                  fitness_data: trainerMenues
                },
                admin_headers
            )
            .then(function (response) {
                history.push(`/`)
            })
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
          トレーナーを新規登録する
        </Typography>
        <form className={classes.form} noValidate onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={2}>
            <InputLabel id="demo-store-select-outlined-label" >セッションスキルを選択してください(複数可)</InputLabel>
            <Grid item xs={12}>
              <CheckTrainerMenues setTrainerMenues={setTrainerMenues} trainerMenues={trainerMenues} allFitnesses={allFitnesses}/>
            </Grid>
            <InputLabel id="demo-store-select-outlined-label" >メールアドレス・パスワードを入力してください</InputLabel>
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
            トレーナーを登録する
          </Button>
        </form>
      </div>
    </Container>
  );
}

export default CreateTrainer;