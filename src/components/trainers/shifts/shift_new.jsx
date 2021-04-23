/* eslint-disable react/prop-types */
import React , { useEffect, useState } from 'react';
import axios from 'axios'
import FormattedInputs from './text_field'
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import { selectCurrentTrainer, selectTrainerHeaders } from '../../../slices/trainer';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

export default function ShiftNew(props){
    const history = useHistory();
    const currentTrainer = useSelector(selectCurrentTrainer);
    const trainer_headers = useSelector(selectTrainerHeaders);
    var dt = new Date(props.year, props.month);
    var items = [];
    const last_day = new Date(dt.getFullYear(), dt.getMonth() + 2, 0)
    const the_last_day = last_day.getDate()
    const stateInit = {}

    const url = `/trainer/shifts/my_requested_shift/year/${last_day.getFullYear()}/month/${last_day.getMonth() + 1}`
    useEffect(()=>{
        axios.get(url, trainer_headers)
        .then(function(res) {
            console.log({res})
        })
        .catch(function(error) {
          console.log({error})
        });
    },[])

    function DateInit(){
        for (let i=1; i<the_last_day+1 ; i++) {
            items.push(i);
            stateInit[i] = {start: null, end: null}
        }
        return {items, stateInit};
    }

    const dateInits =  DateInit()
    // STATE
    const [shift, setShift] = useState(dateInits.stateInit);
    const [button, setButton] = useState(false);


    function handleSubmit(){
        console.log(last_day.getMonth() + 1,"月")
        const url = `/trainer/shift/create/year/${last_day.getFullYear()}/month/${last_day.getMonth() + 1}/`
        console.log({shift})
        axios.post( url, {
            trainer_shift: shift
        }, trainer_headers)
        .then(function (response) {
            console.log('成功', {response})
            history.push(`/trainer/${currentTrainer.id}`);
        })
        .catch(function (response) {
            console.log(response.data);
        })
    }
    return(
        <>
        <div style={{textAlign: 'center', fontSize: '1.7em'}}>
            {last_day.getMonth() + 1}月シフト希望提出
        </div>
        <div style={{overflow: 'scroll', height: 400,backgroundColor: 'white', marginTop: 15}}>
            <Grid container spacing={3}>
            {dateInits.items.map((date, index) => (
                    <>
                        <FormattedInputs key={index} setButton={setButton} date={date} shift={shift} setShift={setShift}/>
                    </>
                ))}
            </Grid>
        </div>
        <div style={{marginBottom: 20}}></div>

        {button? (
            <>
            <Button variant="contained" style={{width: '100%'}} color="secondary" onClick={handleSubmit}>
                シフトを送信
            </Button>
            </>
        ):(
            <Button variant="contained" style={{width: '100%'}} disabled>
                シフトを送信
            </Button>
        )}
        </>
    )
}
