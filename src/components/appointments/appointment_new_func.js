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
import CircularProgress from '@material-ui/core/CircularProgress';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    alignItems: 'center',
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
    top: '80%',
    left: '80%',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: 30,
    marginBottom: 10,
  },
}));

const AppointmentNew = (props) => {
    console.log("AppointmentNew", {props})
    const classes = useStyles();
    const [appointments, setAppointments] = useState([]);
    const [ appoDate, setAppoDate ] = useState();
    const [value, setValue] = useState('');
    const [timeValue, setTimeValue] = useState([]);
    const { handleSubmit } = useForm();
    const history = useHistory();
    const [loading, setLoading] = React.useState(false);
    const [success, setSuccess] = React.useState(false);
    const buttonClassname = clsx({
      [classes.buttonSuccess]: success,
    });
    const params = props.match.params
    const url = `/appointments/new/${params.store_id}/${params.customer_menu_id}/${params.year}/${params.month}/${params.day}`

    useEffect(()=>{
        if (!loading) {
          setSuccess(false);
          setLoading(true);
        }
       axios.get(url)
        .then(function(res) {
            setSuccess(true);
            setLoading(false);
            setAppointments(res.data);
        })
        .catch(function(error) {
            setLoading(false);
            console.log({error})
        });
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
                        {/* {loading && <CircularProgress size={24} className={classes.buttonProgress} />} */}
                        {loading?(<>
                            <CircularProgress size={50} className={classes.buttonProgress} />
                            <div>
                                空いているスケジュールを取得中です
                            </div>
                        </>):(<></>)}
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