import React, { useEffect, useState } from 'react';
// import _ from 'lodash'
import Button from '@material-ui/core/Button' 
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import { useForm } from "react-hook-form";
import axios from 'axios'
import TextField from '@material-ui/core/TextField';
import { BrowserRouter as Router, Route, Switch, useParams, useHistory, useLocation, } from 'react-router-dom';

const AppointmentNew = (props) => {
    console.log("AppointmentNew", {props})
    const [appointments, setAppointments] = useState([]);
    const [ appoDate, setAppoDate ] = useState();
    const [value, setValue] = useState('');
    const [timeValue, setTimeValue] = useState([]);
    const { handleSubmit } = useForm();
    const history = useHistory();
    const params = props.match.params
    const url = `http://localhost:3000/appointments/new/${params.store_id}/${params.customer_menu_id}/${params.year}/${params.month}/${params.day}`
    useEffect(()=>{
      fetch(url)
        .then( res => res.json() )
        .then( res => {
            console.log({url})
            console.log({res})
            setAppointments(res);
        })
    },[])
    function handleTimeSelect(e){
        setTimeValue(e);
    }
    const radio_buttons = appointments.map((time,index) =>
        <React.Fragment key={index}>
            {!(time[1] == 0) && (
                <FormControlLabel 
                    value={time[0][0]}
                    onClick={() => handleTimeSelect(time)}
                    control={<Radio />} 
                    label= {time[2][0][0]+ "時"+ time[2][0][1] + "分" + " 〜 " + time[2][1][0] + "時"　+ time[2][1][1] + "分"} 
                />
            )}
            {(time[1] == 0) && (
                <FormControlLabel 
                    value="disabled" disabled control={<Radio />} 
                    label={time[2][0][0]+ "時"+ time[2][0][1] + "分" +  " 〜 " + time[2][1][0] + "時"　+ time[2][1][1] + "分"}  
                />
            )}
        </React.Fragment>
    );

    function handleAppointmentChange(e) { 
        setAppoDate(e.target.value)
    }  
  
    const handleChange = (e) => {
        setValue(e.target.value);
    };
    function handleClick(){
        history.push({
            pathname: `/customer/${props.match.params.customer_id}/appointments/confirm/${props.match.params.store_id}/${props.match.params.customer_menu_id}/${props.match.params.year}/${props.match.params.month}/${props.match.params.day}`,
            state: { 
                store: props.location.state.store, customer_menu: props.location.state.customer_menu,
                time_default: timeValue[0][0], time_array: timeValue[2], free_box: value,}
        })
    }
    
    return (
        <>
            <div style={{textAlign: 'center'}}>
            <br/>
                <FormLabel component="legend">日時を選択してください</FormLabel>
                <div className="chose_time">
                    <FormControl component="fieldset">
                        <RadioGroup aria-label="gender" name="gender1" onChange={ handleAppointmentChange }> 
                            { radio_buttons }
                        </RadioGroup>
                    </FormControl>
                </div>
                <TextField
                  id="outlined-multiline-static"
                  label="備考"
                  onChange={handleChange}
                  multiline
                  style={{width: '80%', backgroundColor: 'white'}}
                  rows={4}
                  variant="outlined"
                /><br/><br/>
                <Button variant="contained" size='large' style={{marginRight: 10}} color="primary" href="/">キャンセル</Button>
                <Button variant="contained" size='large' color="secondary" onClick={handleClick} >予約する</Button>
            </div>
            {/* </form> */}
        </>
    )
}

export default AppointmentNew;