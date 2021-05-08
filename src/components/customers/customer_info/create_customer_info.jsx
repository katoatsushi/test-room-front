/* eslint-disable react/prop-types */
import React, {useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepButton from '@material-ui/core/StepButton';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import BirthDay from './customer_birthday';
import Address from './customer_address';
import { useHistory } from 'react-router-dom';
import { selectCustomerHeaders} from '../../../slices/customer'
import { setCurrentCustomerInfo} from '../../../slices/customer';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios'

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  button: {
    marginRight: theme.spacing(1),
    backgroundColor: 'silver',
  },
  backButton: {
    marginRight: theme.spacing(1),
  },
  completed: {
    display: 'inline-block',
  },
  instructions: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
}));

function getSteps() {
  return ['性別を選択', '生年月日を選択', '住所を入力', 'ご連絡先'];
}

function getStepContent(step, setCustomerInfo, setButton) {
  switch (step) {
    case 0:
      return <Gender setCustomerInfo={setCustomerInfo} setButton={setButton}/>;
    case 1:
      return <BirthDay setCustomerInfo={setCustomerInfo} setButton={setButton}/>;
    case 2:
      return <Address setCustomerInfo={setCustomerInfo} setButton={setButton}/>;
    case 3:
      return <PhoneNumber setCustomerInfo={setCustomerInfo} setButton={setButton}/>;
    default:
      return 'Unknown step';
  }
}

function Gender(props) {
    const handleChange = (event) => {
        props.setCustomerInfo((prev) => ({...prev, gender: event.target.value}))
        props.setButton(true)
    };
    
    return(
        <div style={{margin: 'auto 0', textAlign: 'center'}}>
        <FormControl component="fieldset">
        <div className="customer_info_tag">性別を教えてください</div>
        <RadioGroup aria-label="gender" name="gender1"  onChange={handleChange}>
            <FormControlLabel value='女性' control={<Radio style={{backgroundColor: "white", padding: 0}}/>} label="&nbsp;&nbsp;&nbsp;&nbsp;女性" />
            <FormControlLabel value='男性' control={<Radio style={{backgroundColor: "white", padding: 0}}/>} label="&nbsp;&nbsp;&nbsp;&nbsp;男性" />
            <FormControlLabel value='どちらでもない' control={<Radio style={{backgroundColor: "white", padding: 0}}/>} label="&nbsp;&nbsp;&nbsp;&nbsp;どちらでもない" />
        </RadioGroup>
        </FormControl>
        </div>
    );
}

function PhoneNumber(props) {
    const [phoneNumber, setPhoneNumber] = React.useState('');
    const [phoneNumberE, setPhoneNumberE] = React.useState('');
    const handlePhoneNumber = (event) => {
        setPhoneNumber(event.target.value);
    };
    const handlePhoneNumberE = (event) => {
        setPhoneNumberE(event.target.value);
    };
    useEffect(()=>{
      props.setCustomerInfo((prev) => ({...prev, phoneNumber: {nomal: phoneNumber,emergency: phoneNumberE}}))
    },[phoneNumber, phoneNumberE])

    return(
        <>
        <Grid container alignItems="center" justify="center">
          <Grid item xs={9}>
              <div className="customer_info_tag">連絡先を教えてください</div>
              通常時<br/>
              <TextField
                  style={{width: '100%', backgroundColor: "white"}}
                  id="outlined-size-small"
                  placeholder="入力してください(ハイフンなし)"
                  value={phoneNumber}
                  variant="outlined"
                  size="large"
                  onChange={handlePhoneNumber}
              /><br/>
              緊急時（通常時とは異なるもの)
              <TextField
                  style={{width: '100%', backgroundColor: "white"}}
                  id="outlined-size-small"
                  placeholder="入力してください(ハイフンなし)"
                  value={phoneNumberE}
                  variant="outlined"
                  size="large"
                  onChange={handlePhoneNumberE}
              />
          </Grid>   
        </Grid>
        </>
    );
}

export default function CreateCustomerInfo() {
  const classes = useStyles();
  const history = useHistory();
  const dispatch = useDispatch();
  const [activeStep, setActiveStep] = React.useState(0);
  const [completed, setCompleted] = React.useState(new Set());
  const steps = getSteps();
  const [open, setOpen] = React.useState(true);
  const [customerInfo, setCustomerInfo] = React.useState({gender: "", birthday: null, address: {}, phoneNumber: {}});
  // eslint-disable-next-line no-unused-vars
  const [button, setButton] = React.useState(false);
  const customerHeaders = useSelector(selectCustomerHeaders);

  const totalSteps = () => {
    return getSteps().length;
  };
  const completedSteps = () => {
    return completed.size;
  };
  const allStepsCompleted = () => {
    return completedSteps() === totalSteps();
  };
  const isLastStep = () => {
    return activeStep === totalSteps() - 1;
  };
  const handleNext = () => {
    const newActiveStep =
      isLastStep() && !allStepsCompleted()
        ? 
          steps.findIndex((step, i) => !completed.has(i))
        : activeStep + 1;

    setActiveStep(newActiveStep);
  };
  // const handleClickOpen = () => {
  //   setOpen(true);
  // };
  // const handleClose = () => {
  //   setOpen(false);
  // };
  const handleSkip = () => {
    setOpen(false);
    history.push('/');
  }

  const handleComplete = () => {
    const newCompleted = new Set(completed);
    newCompleted.add(activeStep);
    setCompleted(newCompleted);
    if (completed.size !== totalSteps()) {
      handleNext();
    }
    // 最終ステップ完了時
    if (completedSteps() === totalSteps() - 1){
      const url = `/customer_infos`
      axios.put(url, customerInfo, customerHeaders)
      .then(function (response) {
        dispatch(setCurrentCustomerInfo(response.data.data));
      }).catch(function (response) {
        console.log({response})
      })
      // TODO::ページ遷移&post
    }
  };

  function isStepComplete(step) {
    return completed.has(step);
  }

  return (
    <div className={classes.root}>
      <Stepper alternativeLabel nonLinear activeStep={activeStep}>
        {steps.map((label, index) => {
          const stepProps = {};
          const buttonProps = {};
          return (
            <Step key={label} {...stepProps}>
              <StepButton
                completed={isStepComplete(index)}
                {...buttonProps}
              >
              </StepButton>
            </Step>
          );
        })}
      </Stepper>
      <div>
        {allStepsCompleted() ? (
          <Dialog
              open={open}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
          >
              <DialogTitle id="alert-dialog-title">
                  プロフィールを充足しましょう！
              </DialogTitle>
              <DialogContent>
              <DialogContentText id="alert-dialog-description">
                  次に、トレーナーとのコミュニケーションを円滑にするために、
                  4つの質問に答えてあなたのプロフィールを作成しましょう！
              </DialogContentText>
              </DialogContent>
              <DialogActions>
              <Button onClick={handleSkip} color="secondary">
                  スキップ
              </Button>
              <Button  color="primary" autoFocus>
                  <Link color="inherit" href="/customer_info_indivi/new">このまま進む</Link>
              </Button>
              </DialogActions>
          </Dialog>
        ) : (
          <div>
            <Typography className={classes.instructions}>{getStepContent(activeStep, setCustomerInfo, setButton)}</Typography>
            <div style={{textAlign: 'center'}}>

              {activeStep !== steps.length &&
                (completed.has(activeStep) ? (
                  <Typography variant="caption" className={classes.completed}>
                    ステップ {activeStep + 1} 完了！
                  </Typography>
                ) : (
                  <Button variant="contained" style={{width: '80%'}} color="primary" onClick={handleComplete}>
                    {completedSteps() === totalSteps() - 1 ? '完了する' : '次へ進む'}
                  </Button>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


