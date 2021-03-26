import React, { useEffect, useState ,useCallback} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import axios from 'axios'
import {
    BrowserRouter as Router,
    Route,
    Switch,
    useParams,
    useHistory,
    useLocation,
  } from 'react-router-dom';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';
import { useForm } from "react-hook-form";

const useStyles = makeStyles({
  root: {
    width: '90%',
    margin: '0 auto',
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
});

const AppointmentRecordMenusCreate = (props) => {
    const classes = useStyles();
    const history = useHistory();
    const [fitnessMenues, setFitnessMenues] = useState([]);
    const [fitnessMenuesFirstID, setFitnessMenuesFirstID] = useState([]);
    const [fitnessMenuesSecond, setFitnessMenuesSecond] = useState([]);
    const [fitnessMenuesThird, setFitnessMenuesThird] = useState([]);
    const [getFitnessMenuesThird, setGetFitnessMenuesThird] = useState([]);
    const [time, setTime] = useState();
    const [setNum, setSetNum] = useState();
    const [detail, setDetail] = useState("");
    const { handleSubmit } = useForm();
    const url = `http://localhost:3000/customer_record/${props.match.params.customer_record_id}/new`
    useEffect(()=>{
      fetch(url)
        .then( res => res.json() )
        .then( res => {
            if (res.status==200) {
                setFitnessMenues(res.fitness_menues);
            }
        })
    },[])
    function onSubmit() {
        const submit_url = `http://localhost:3000/customer/${props.match.params.customer_record_id}/fitness/${fitnessMenuesFirstID}/fitness_third/${getFitnessMenuesThird.id}/session/create`
        axios.post( submit_url, {
            time: time,
            set_num: setNum,
            detail: detail,
        })
        .then(function (response) {
            console.log('response is')
            console.log(response)
            history.push(`/`)
        })
    }
    function handleSecondChange(e) {
        if(e.target.value.second){
            setFitnessMenuesFirstID(e.target.value.id);
            setFitnessMenuesSecond(e.target.value.second);
        }
    }
    function handleThirdChange(e) {
        if(e.target.value.third){
            setFitnessMenuesThird(e.target.value.third);
        }
    }
    function handleTimeChange(e) {
        setTime(e.target.value);
    }
    function handleSetNumChange(e) {
        setSetNum(e.target.value);
    }
    function handleDetailChange(e) {
        setDetail(e.target.value);
    }
    function handleGetThirdMenu(e){
        setGetFitnessMenuesThird(e.target.value);
    }
    
    
    const select_fitness_menu = fitnessMenues.length?
    fitnessMenues.map((menu, index) =>
        <MenuItem value={menu} key={index}>{ menu.name }</MenuItem>
    ): 
        <MenuItem />
    const select_fitness_second_menu = fitnessMenuesSecond.length?
    fitnessMenuesSecond.map((menu, index) =>
        <MenuItem  value={menu} key={index}>{ menu.name }</MenuItem>
    ): 
        <MenuItem />
    const select_fitness_third_menu = fitnessMenuesThird.length?
    fitnessMenuesThird.map((menu, index) =>
        <MenuItem  value={menu} key={index}>{ menu.name }</MenuItem>
    ): 
        <MenuItem />
    
    return (
    <>
        <form onSubmit={handleSubmit(onSubmit)}>
        <br/>
        <div style={{textAlign: 'center'}}>
            <FormControl variant="outlined" style={{ width: '90%',textAlign: 'left',backgroundColor: 'white'}} className="select_style">
              <InputLabel id="demo-store-select-outlined-label" >メニューを選んでください。</InputLabel>
                <Select
                  labelId="demo-store-select-outlined-label"
                  id="demo-store-select-outlined"
                  label="store"
                  onChange={ handleSecondChange }
                >
                  { select_fitness_menu }
                </Select>
            </FormControl> <br/>
        </div>
        <br/>
        <div style={{textAlign: 'center'}}>
            <FormControl variant="outlined" style={{ width: '90%',textAlign: 'left',backgroundColor: 'white'}} className="select_style">
              <InputLabel id="demo-store-select-outlined-label" >メニュー2を選んでください。</InputLabel>
                <Select
                  labelId="demo-store-select-outlined-label"
                  id="demo-store-select-outlined"
                  label="store"
                  onChange={ handleThirdChange }
                >
                  <MenuItem value="メニューを選んでください。"><em>未選択</em></MenuItem>
                  { select_fitness_second_menu }
                </Select>
            </FormControl> <br/>
        </div>
        <br/>
        <div style={{textAlign: 'center'}}>
            <FormControl variant="outlined" style={{ width: '90%',textAlign: 'left',backgroundColor: 'white'}} className="select_style">
              <InputLabel id="demo-store-select-outlined-label" >メニュー3を選んでください。</InputLabel>
                <Select
                  labelId="demo-store-select-outlined-label"
                  id="demo-store-select-outlined"
                  label="store"
                  onChange={ handleGetThirdMenu }
                >
                  <MenuItem value="メニューを選んでください。"><em>未選択</em></MenuItem>
                  { select_fitness_third_menu }
                </Select>
            </FormControl> <br/>
        </div>
        <div style={{textAlign: 'center'}}>
            <TextField id="filled-basic" 
                style={{width: '90%', margin: 10, backgroundColor: 'white'}}  
                label="回数を入力してください" 
                onChange={handleTimeChange}
                type="number"
                variant="filled" />

            <TextField id="filled-basic" 
                style={{width: '90%', margin: 10, backgroundColor: 'white'}}  
                label="セット数を入力してください"
                onChange={handleSetNumChange} 
                type="number"
                variant="filled" />
            <TextField
                id="outlined-multiline-static"
                style={{width: '90%', margin: 10,backgroundColor: 'white'}} 
                label="備考/フィードバック"
                multiline
                onChange={handleDetailChange} 
                rows={4}
                variant="outlined"
            />
            <Button
                type="submit"
                fullWidth
                variant="contained"
                color="secondary"
                style={{width: '90%', margin: 10}} 
                className={classes.submit}
            >
            フィードバックを送る
          </Button>
        </div>
        </form>
    </>
  );
}

export default AppointmentRecordMenusCreate;