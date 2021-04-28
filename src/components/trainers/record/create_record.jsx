/* eslint-disable react/prop-types */
import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import axios from 'axios'
import { selectTrainerHeaders } from '../../../slices/trainer';
import { useSelector } from 'react-redux';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Paper from '@material-ui/core/Paper';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';
import { useHistory } from 'react-router-dom';
import clsx from 'clsx';
import CircularProgress from '@material-ui/core/CircularProgress';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    // display: 'flex',
    // alignItems: 'center',
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
  formControl: {
    margin: theme.spacing(1),
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
    display: 'block',
    top: '50%',
    left: '50%',
    marginTop: 32,
    textAlign: 'center',
    marginLeft: 'auto',
    marginRight: 'auto'
  },
}));

function CheckBoxChip({data, setSelectMenues, selectMenues}){
    function handleChange(e){
        // TODO
        if(e.target.checked){
            //追加
            selectMenues.push(data);
            setSelectMenues((prev)=> selectMenues)
        }else{
            //削除
            const deletedDatas = selectMenues.filter((menu) => {
                return menu.id != data.id;
            });
            setSelectMenues((prev) =>  deletedDatas)
        }
    }
    return(
        <FormControlLabel
            control={<Checkbox onChange={handleChange} name="gilad" />}
            label={data.name}
        />
    )
}


export default function TrainerCreateRecord(props) {
    const trainerHeaders = useSelector(selectTrainerHeaders);
    const [fitnessData, setFitnessData] = React.useState([]);
    const [selectMenues, setSelectMenues] = React.useState([]);
    const classes = useStyles();
    const history = useHistory();
    const [loading, setLoading] = React.useState(false);
    const [success, setSuccess] = React.useState(false);
    const [dataCheck, setDataCheck] = React.useState(true);
    const buttonClassname = clsx({
      [classes.buttonSuccess]: success,
    });
    const url = `/get/res_second/fitness/${props.match.params.fitness_id}`
    console.log({props})
    useEffect(()=>{
        if (!loading) {
            setSuccess(false);
            setLoading(true);
        }
        axios.get(url, trainerHeaders)
        .then(function(res) {
            setSuccess(true);
            setLoading(false);
            if(res.data.data.length == 0) {
                setDataCheck(false)
            }
            setFitnessData(res.data.data)
        })
        .catch(function(error) {
            setLoading(false);
            console.log({error})
        });

    },[])

    return (<>
    {dataCheck? (<>
        <div className={classes.root}>
            <Paper variant="outlined" style={{padding: 5, margin: 10, textAlign: 'center'}}>
                カルテを発行する
            </Paper>
           <Paper variant="outlined"style={{padding: 20, margin: 10}}>
            <span className="karute_text">内容を選んでください</span>
             {loading && <CircularProgress size={40} className={classes.buttonProgress} />}
            {fitnessData.map((data, index) => (
                <Accordion key={index} style={{marginTop: 5}}>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                        style={{backgroundColor: '#4DA7F0'}}
                    >
                    <Typography className={classes.heading} style={{color: 'white', fontWeight: 600}}>
                        {data.second.name}
                    </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                    <Typography>
                        <FormControl component="fieldset" className={classes.formControl}>
                            <FormGroup>
                            {data.third.map((d, dindex) => (<>
                                <CheckBoxChip key={dindex} data={d} setSelectMenues={setSelectMenues} selectMenues={selectMenues}/>
                            </>))}
                                </FormGroup>
                            </FormControl>
                        </Typography>
                    </AccordionDetails>
                </Accordion>
            ))}
            <div style={{textAlign: 'right', marginLeft: 'auto'}}>
                <Button variant="contained" color="primary" 
                    style={{marginTop: 20 , color: 'white', fontWeight: '500', width: '100%',marginLeft: 'auto', marginRight: 'auto'}}
                    onClick = {() => 
                        history.push({
                            pathname: [`/trainers/set/details`],
                            record: props.location.data,
                            data: selectMenues
                    })}
                >
                    次へ
                </Button>
            </div>
            </Paper>
        </div>
        </>):(<>
        <div className={classes.root}>
            <Paper variant="outlined" style={{padding: 5, margin: 10, textAlign: 'center'}}>
                カルテを発行する
            </Paper>
           <Paper variant="outlined"style={{padding: 20, margin: 10}}>
            <span className="karute_text">このまま次へをクリックしてください</span>
            <div style={{textAlign: 'right', marginLeft: 'auto'}}>
                <Button variant="contained" color="primary" 
                    style={{marginTop: 20 , color: 'white', fontWeight: '500', width: '100%',marginLeft: 'auto', marginRight: 'auto'}}
                    onClick = {() => 
                        history.push({
                            pathname: [`/trainers/set/details`],
                            record: props.location.data,
                            data: selectMenues
                    })}
                >
                    次へ
                </Button>
            </div>
            </Paper>
        </div>
        </>)
    }

    </>)
}
