/* eslint-disable react/prop-types */
import React,{ useState } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import axios, { AxiosError } from 'axios';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import { Controller, useForm, SubmitHandler } from 'react-hook-form';
import { setCustomerRecords, customerRecordRemove, getCustomerRecords } from '../../slices/customer_record';
import { selectCurrentCustomer, selectCustomerHeaders, customerRemove } from '../../slices/customer';
import { useSelector, useDispatch } from 'react-redux';
import Rating from '@material-ui/lab/Rating';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import clsx from 'clsx';
import CircularProgress from '@material-ui/core/CircularProgress';

const useStyles = makeStyles((theme) => ({
  root: {
    height: '80%',
    color: '#555555',
    backgroundColor: 'white',
    borderColor: '#4DA7F0',
    textAlign: 'center',
  },
  checked: {
    marginRight: theme.spacing(1),
    backgroundColor: 'silver',
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

function RecordDialog({session}) {
    const [open, setOpen] = useState(true);
    const [value, setValue] = React.useState(0);
    const [food, setFood] = React.useState(0);
    const dispatch = useDispatch();
    const customerHeader = useSelector(selectCustomerHeaders);
    const handleClose = () => {
        setOpen(false);
    };
    const menues = session.menues
    const classes = useStyles();
    const show_menues = menues.map((menu,index) =>
        <div key={index}>???{menu.fitness_name}/{menu.fitness_third_name}:{menu.weight}Kg??{menu.time}???</div>
    );
    const [loading, setLoading] = React.useState(false);
    const [success, setSuccess] = React.useState(false);
    const buttonClassname = clsx({
      [classes.buttonSuccess]: success,
    });

    function setDate(obj){
        const date = new Date(`${obj}`)
        var min = null
        var hour = null
        const day = `${date.getFullYear()}` + "/" + `${date.getMonth() + 1}`+ "/" + `${date.getDate()} `
        date.getMinutes()==0?  min = "00": min = String(date.getMinutes())
        min.length == 1? min = "0" + min: min
        String(date.getHours()).length == 1? hour = "0" + String(date.getHours()): hour = String(date.getHours())
        const newDate = day + `${hour}:` + `${min}~`
        return newDate
    }

    function handleSubmit(e) {
        if (!loading) {
            setSuccess(false);
            setLoading(true);
        }
        const url = `/evaluations`
        axios.post( url, {
            trainer_id:  e.trainer_id,
            customer_id: e.customer_id,
            customer_record_id: e.id,
            food_score: food,
            trainer_score: value
        },customerHeader )
        .then(function (response) {
            setSuccess(true);
            setLoading(false);
            setOpen(false);
            if(response.data.evaluations.length){
                dispatch(setCustomerRecords(response.data.evaluations));
            }else{
                dispatch(customerRecordRemove());
            }
        })
        .catch(function (response) {
            dispatch(customerRemove());
            dispatch(customerRecordRemove());
            setLoading(false);
        })
    }
    return(
        <>
            <Dialog
                open={open}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
            <Card className={ classes.root } variant="outlined">
            <CardContent>
                <Typography color="textSecondary" gutterBottom style={{textAlign: 'center'}}>
                    {/* ?????????????????????????????????????????????<br/> */}
                    <div style={{textAlign: 'left', fontSize: 14}}>
                     {session.trainer.first_name_kanji} {session.trainer.last_name_kanji}?????????????????????????????????????????????<br/>
                    </div>
                </Typography>
                <Typography color="textSecondary" gutterBottom >

                <Accordion>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                    >
                        <Typography >???{ session.month }/{ session.day }???????????????????????????</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                    <Typography style={{textAlign: 'left', fontSize: '0.8em'}}>
                        {setDate(session.apo_time)}
                        { show_menues }<br/>
                        ??????????????????<br/>
                        { session.detail }
                    </Typography>
                    </AccordionDetails>
                </Accordion>

                </Typography>
                <Typography  style={{fontSize: 15}}>
                    ??????????????????????????????????????????
                </Typography>
                <Typography  color="textSecondary">
                    <Rating
                        name="simple-controlled-session"
                        size="large"
                        value={ value }
                        onChange={(event, newValue) => {
                            setValue(newValue);
                        }}
                    />
                </Typography>
                <Typography style={{fontSize: 15}}>
                ?????????????????????????????????
                </Typography>
                <Typography  color="textSecondary">
                    <Rating
                        name="simple-controlled-food"
                        size="large"
                        food={ food }
                        onChange={(event, newValue) => {
                            setFood(newValue);
                        }}
                    />
                </Typography>
                <Typography variant="body2" component="p">
                <br/>
                </Typography>
            </CardContent>
            <CardActions>
                {
                    value==0||food==0?
                    (<Button variant="contained" style={{width: '90%', marginRight: 'auto', marginLeft: 'auto'}} disabled>
                        ??????
                        </Button>)
                    :
                    (<>
                        <Button size="large" color="secondary" 
                            style={{width: '90%', marginRight: 'auto', marginLeft: 'auto'}} 
                            onClick={() => handleSubmit(session)} variant="contained"
                            disabled={loading || success}
                        >
                            ??????
                        </Button>
                        {loading && <CircularProgress size={24} className={classes.buttonProgress} />}
                    </>)
                }
            </CardActions>
            </Card>
            </Dialog>
        </>);
}


export default function Evaluation(props) {
    const classes = useStyles();
    const customerRecords = useSelector(getCustomerRecords);
    function CustomerRecordsDialog() {
        if (customerRecords){
            if(customerRecords.length){
                const this_session = customerRecords.slice(-1)[0]
                return (
                    <RecordDialog session={ this_session } />
                )
            }
        }
    }
    return (
    <div>
        <CustomerRecordsDialog/>
    </div>
    );
}
