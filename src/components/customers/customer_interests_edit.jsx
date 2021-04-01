import React , { useEffect, useState } from 'react';
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
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { BrowserRouter as Router, Route, Switch, useParams, useHistory, useLocation, } from 'react-router-dom';
import Select from '@material-ui/core/Select';
import styled from 'styled-components'
import Chip from '@material-ui/core/Chip';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '20%',
    color: '#555555',
    backgroundColor: 'white',
    textAlign: 'center',
  },
  checked: {
    marginRight: theme.spacing(1),
    backgroundColor: 'silver',
  },
  chip: {
    justifyContent: 'center',
    '& > *': {
      margin: theme.spacing(0.5),
    },
  },
}));

function SetChipEdit({interest, setInterestIDs, interestIDs, clickedInterests, setUpdateInterestsIDs}) {
// function SetChipEdit({interest, setUpdateInterestsIDs}) {
    const classes = useStyles();
    const [value, setValue] = React.useState(false)
    useEffect(()=>{
        if (clickedInterests){
            const index = clickedInterests.findIndex(item => item.name === interest.name)
            if (index != -1){
                setValue(true);
            }
        }
    },[])

    function handleValueChange(){
        if(value){
            const deletedIDs = interestIDs.filter((ID, index) => {
                return ID != interest.id;
            });
            setInterestIDs(deletedIDs)
            setUpdateInterestsIDs((prev) => deletedIDs)
        }else{
            const newIDs =  interestIDs.splice(-1, 0, interest.id);
            setInterestIDs((prev) => [...prev, ...newIDs])
            setUpdateInterestsIDs((prev) => interestIDs)
        }
        setValue(!value);
    }
    return(
        <>
        {
            value?
            (<Chip
                key={interest.id}
                label={ interest.name }
                clickable
                color="primary"
                onClick={ handleValueChange }
            />)
            :
            (<Chip
                key={interest.id}
                label={ interest.name }
                clickable
                color="primary"
                variant="outlined"
                style={{backgroundColor: 'white'}}
                onClick={ handleValueChange }
            />)
        }
        </>
    );
}


export default function CustomerInterestsEdit(props) {
    const url = '/customer_info/intarests_new'
    const [allInterests, setAllInterests] = React.useState([])
    const classes = useStyles();
    // マイページから変更する際
    let interests_array = []
    if (props.interests){
        var index = props.interests.map(function( item ) {
            interests_array.push(item.id)            
        });
    }
    const [interestIDs, setInterestIDs] = React.useState(interests_array)

    useEffect(()=>{
        axios.get(url)
        .then(function(res) {
            setAllInterests(res.data.intarests)
        })
        .catch(function(error) {
            console.log({error})
        });

        if(props.setCustomerStatus){
            props.setCustomerStatus((prev) => ({...prev, interests: interestIDs}))
        }
     },[interestIDs])

    const select_interests = allInterests.length ?  
        allInterests.map((interest,index) =>
        <>
        {props?.interests? 
            <SetChipEdit key={index} interest={interest} setInterestIDs={setInterestIDs} interestIDs={interestIDs} clickedInterests={props.interests} setUpdateInterestsIDs={props.setUpdateInterestsIDs} />
            :
            <SetChipEdit key={index} interest={interest} setInterestIDs={setInterestIDs} interestIDs={interestIDs}/>
        }
        </>
    )
    : 
        <></>

    return (
        <>
        <Grid container alignItems="center" justify="center">
        <Grid item xs={11}>
            <div className="customer_info_tag">関心のある分野を選んでください</div>
            <div className={classes.chip}>
            　{ select_interests }
            </div>
        </Grid>   
        </Grid>
        </>
    );
}