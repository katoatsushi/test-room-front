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

function CheckMenu(props){
    const classes = useStyles();
    const [value, setValue] = React.useState(false) 
    // menu} key={index} setTrainerMenues={props.setTrainerMenues
    
    function handleValueChange(){
        if(value){
            //削除
            const deletedIDs = props.trainerMenues.filter((m, index) => {
                return m.name != props.menu.name;
            });
            props.setTrainerMenues(deletedIDs)
        }else{
            // 追加
            const newIDs =  props.trainerMenues.splice(-1, 0, props.menu);
            props.setTrainerMenues((prev) => [...prev, ...newIDs])
        }
        setValue(!value);
    }
    return(
        <>
        {
            value?
            (<Chip
                key={props.menu.id}
                label={ props.menu.name }
                clickable
                color="primary"
                onClick={ handleValueChange }
                style={{margin: 8}}
            />)
            :
            (<Chip
                key={props.menu.id}
                label={ props.menu.name }
                clickable
                color="primary"
                variant="outlined"
                style={{backgroundColor: 'white'}}
                onClick={ handleValueChange }
                style={{margin: 8}}
            />)
        }
        </>
    );
}


export default function CheckTrainerMenues(props){
    //    props.setTrainerMenues
    //    props.trainerMenues
    //    props.allFitnesses
    return(
        <>
          {props.allFitnesses.map((menu, index) => (
                <>
                    <CheckMenu menu={menu} key={index} trainerMenues={props.trainerMenues} setTrainerMenues={props.setTrainerMenues}/>
                </>
            ))}
        </>
    )
}