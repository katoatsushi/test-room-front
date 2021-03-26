import React, {useContext,  useEffect, useState ,useCallback} from 'react';
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
import FormLabel from '@material-ui/core/FormLabel';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import { BrowserRouter as Router, Route, Switch, useParams, useHistory, useLocation, } from 'react-router-dom';
import { Controller, useForm, SubmitHandler } from 'react-hook-form';
import axios from 'axios'

export default function InputName(props) {
    console.log({props})
    function handleName_A(e){
        console.log({e})
        props.setTrainerInfo((prev) =>  ({...prev, name: {
                    first_name_kanji: e.target.value, 
                    last_name_kanji:  prev.name.last_name_kanji,
                    first_name_kana: prev.name.first_name_kana,
                    last_name_kana: prev.name.last_name_kana
                }}))
    }
    function handleName_B(e){
        console.log({e})
        props.setTrainerInfo((prev) =>  ({...prev, name: {
                    first_name_kanji: prev.name.first_name_kanji,
                    last_name_kanji:  e.target.value,
                    first_name_kana: prev.name.first_name_kana,
                    last_name_kana: prev.name.last_name_kana
                }}))
    }
    function handleName_C(e){
        console.log({e})
        props.setTrainerInfo((prev) =>  ({...prev, name: {
                    first_name_kanji: prev.name.first_name_kanji,
                    last_name_kanji:  prev.name.last_name_kanji,
                    first_name_kana: e.target.value,
                    last_name_kana: prev.name.last_name_kana
                }}))
    }
    function handleName_D(e){
        console.log({e})
        props.setTrainerInfo((prev) =>  ({...prev, name: {
                    first_name_kanji: prev.name.first_name_kanji,
                    last_name_kanji:  prev.name.last_name_kanji,
                    first_name_kana: prev.name.first_name_kana,
                    last_name_kana: e.target.value
                }}))
    }
    return(<>
        <div className="trainer_name_input_label">お名前を入力してください</div>
        <Grid container spacing={3} style={{fontWeight: 500,overflowWrap: 'break-word', paddingLeft: 10, paddingRight: 10, marginBottom: 50}}>
            <Grid item xs={6} style={{marginTop: 'auto', marginBottom: 'auto'}}>
                <TextField id="outlined-basic" onChange={handleName_A} label="姓" variant="outlined" style={{ backgroundColor: 'white'}}/>
            </Grid>
            <Grid item xs={6} style={{marginTop: 'auto', marginBottom: 'auto'}}>
                <TextField id="outlined-basic" onChange={handleName_B }label="名" variant="outlined" style={{ backgroundColor: 'white'}}/>
            </Grid>
            <Grid item xs={6} style={{marginTop: 'auto', marginBottom: 'auto'}}>
                <TextField id="outlined-basic" onChange={handleName_C} label="せい" variant="outlined" style={{ backgroundColor: 'white'}}/>
            </Grid>
            <Grid item xs={6} style={{marginTop: 'auto', marginBottom: 'auto'}}>
                <TextField id="outlined-basic" onChange={handleName_D}  label="めい" variant="outlined" style={{ backgroundColor: 'white'}}/>
            </Grid>
        </Grid>
    </>)
}