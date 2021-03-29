import React, { useEffect, useState, Component } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import axios from 'axios'
import { selectCurrentTrainer, selectTrainerHeaders } from '../../../slices/trainer';
import { useSelector } from 'react-redux';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Paper from '@material-ui/core/Paper';
import FormLabel from '@material-ui/core/FormLabel';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';
import {
        BrowserRouter as Router,
        Route,
        Switch,
        useParams,
        useHistory,
        useLocation,
    } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
  formControl: {
    margin: theme.spacing(1),
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
            const deletedDatas = selectMenues.filter((menu, index) => {
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
    console.log({props})

    const currentTrainer = useSelector(selectCurrentTrainer);
    const trainerHeaders = useSelector(selectTrainerHeaders);
    const [fitnessData, setFitnessData] = React.useState([]);
    const [selectMenues, setSelectMenues] = React.useState([]);
    const classes = useStyles();
    const history = useHistory();
    const url = `/get/res_second/fitness/${props.match.params.fitness_id}`
    useEffect(()=>{

        axios.get(url, trainerHeaders)
        .then(function(res) {
            setFitnessData(res.data.data)
        })
        .catch(function(error) {
            console.log({error})
        });
        // console.log("確認",{selectMenues})
    },[])

    

    return (<>
        <div className={classes.root}>
            <Paper variant="outlined" style={{padding: 5, margin: 10, textAlign: 'center'}}>
                カルテを発行する
            </Paper>
           <Paper variant="outlined"style={{padding: 20, margin: 10}}>
            <span className="karute_text">内容を選んでください</span>
            {fitnessData.map((data, index) => (
                <Accordion style={{marginTop: 5}}>
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
                            {data.third.map((d, index) => (<>
                                <CheckBoxChip data={d} setSelectMenues={setSelectMenues} selectMenues={selectMenues}/>
                            </>))}
                                </FormGroup>
                            </FormControl>
                        </Typography>
                    </AccordionDetails>
                </Accordion>
            ))}
            <div style={{textAlign: 'right', marginLeft: 'auto'}}>
                <Button variant="contained" color="primary" style={{margin: 10 , color: 'white', fontWeight: '500', paddingLeft: 30, paddingRight: 30}}
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
