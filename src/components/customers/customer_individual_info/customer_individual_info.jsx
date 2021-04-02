/* eslint-disable react/prop-types */
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepButton from '@material-ui/core/StepButton';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import CustomerConditions from './customer_condition';
import CustomerJobs from './customer_jobs';
import CustomerInterests from  './customer_interests';
import { useHistory } from 'react-router-dom';
import {selectCustomerHeaders} from '../../../slices/customer'
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios'
import { setCurrentCustomerInfo, setCurrentCustomerInterests} from '../../../slices/customer';

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
  return ['身長・体重', 'ご職業', '趣味'];
}

function getStepContent(step, setCustomerStatus) {
  switch (step) {
    case 0:
        return <CustomerConditions setCustomerStatus={setCustomerStatus}/>;
    case 1:
      return <CustomerJobs setCustomerStatus={setCustomerStatus}/>;
    case 2:
      return <CustomerInterests setCustomerStatus={setCustomerStatus}/>;
    default:
      return 'Unknown step';
  }
}

export default function CreateCustomerIndividualInfo() {
  const classes = useStyles();
  const history = useHistory();
  const [activeStep, setActiveStep] = React.useState(0);
  const [completed, setCompleted] = React.useState(new Set());
  const steps = getSteps();
  const dispatch = useDispatch();
  const customerHeaders = useSelector(selectCustomerHeaders);
  const [customerStatus, setCustomerStatus] = React.useState({condition: {weight: null, height: null}, jobs: {}, interests: []});

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


  const handleComplete = () => {
    const newCompleted = new Set(completed);
    newCompleted.add(activeStep);
    setCompleted(newCompleted);
    if (completed.size !== totalSteps()) {
      handleNext();
    }
    if (completedSteps() === totalSteps() - 1){
      const url = `/customer_individual_infos`
      axios.put(url, customerStatus, customerHeaders)
      .then(function (response) {
        console.log("success", {response})
        dispatch(setCurrentCustomerInfo(response.data.data));
        dispatch(setCurrentCustomerInterests(response.data.interests));
        history.push('/');
      }).catch(function (response) {
        console.log("error", {response})
      })
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
                {/* {label} */}
              </StepButton>
            </Step>
          );
        })}
      </Stepper>
      <div>
        {allStepsCompleted() ? (
          <div>
            <Typography className={classes.instructions}>
                {/* <Evaluation /> */}
                ご回答ありがとうございました！
            </Typography>
          </div>
        ) : (
          <div>
            <Typography className={classes.instructions}>{getStepContent(activeStep, setCustomerStatus)}</Typography>
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


