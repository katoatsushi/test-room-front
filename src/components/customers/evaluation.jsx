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
import { useSelector } from 'react-redux';
import Rating from '@material-ui/lab/Rating';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { IErrorResponse } from '../../interfaces';
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
}));

function RecordDialog({session}) {
    const [open, setOpen] = useState(true);
    // const [value, setValue] = React.useState(0);
    const [value, setValue] = React.useState(0);
    const [food, setFood] = React.useState(0);
    const handleClose = () => {
        setOpen(false);
    };
    const menues = session.menues
    const classes = useStyles();
    const show_menues = menues.map((menu,index) =>
        <div key={index}>・{menu.fitness_name}/{menu.fitness_third_name}:{menu.time}回×{menu.set_num}セット</div>
    );

    function handleSubmit(e) {
        const url = `/evaluations`
        axios.post( url, {
            trainer_id:  e.trainer_id,
            customer_id: e.customer_id,
            customer_record_id: e.id,
            food_score: food,
            trainer_score: value
          })
          .then(function (response) {
            setOpen(false);
          })
          .catch(function (response) {
            console.log(response.data);
          })
    }
    return(
        <>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
            <Card className={ classes.root } variant="outlined">
            <CardContent>
                <Typography color="textSecondary" gutterBottom style={{textAlign: 'center'}}>
                    トレーナーからのフィードバック<br/>
                    <div style={{textAlign: 'left'}}>{ session.month }/{ session.day }
                     担当: トレーナー名
                    </div>
                </Typography>
                <Typography color="textSecondary" gutterBottom >
                <Accordion>
                    <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                    >
                    <Typography >セッション詳細</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                    <Typography style={{textAlign: 'left', fontSize: '0.8em'}}>
                        { show_menues }
                        { show_menues }
                    </Typography>
                    </AccordionDetails>
                </Accordion>
                </Typography>
                <Typography variant="h6" component="h4">
                セッションはいかがでしたか？
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
                <Typography variant="h6" component="h4">
                食事はいかがでしたか？
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
                    (<Button variant="contained" disabled>
                        送信
                        </Button>)
                    :
                    (<Button size="large" color="secondary" onClick={() => handleSubmit(session)} variant="contained">
                        送信
                    </Button>)
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
                console.log({customerRecords})
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
