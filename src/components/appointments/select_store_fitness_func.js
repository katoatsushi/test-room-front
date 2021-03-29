import React, { useEffect, useState, Component } from 'react';
import {
    BrowserRouter as Router,
    Route,
    Switch,
    useParams,
    useHistory,
    useLocation,
  } from 'react-router-dom';
import axios from 'axios'
import { connect } from 'react-redux'
import { Field, reduxForm } from 'redux-form'
// import { storeFitness } from '../actions'
import Button from '@material-ui/core/Button'
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Grid from '@material-ui/core/Grid';
import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import { useForm } from "react-hook-form";

const SelectStoreFitness = (props) => {
      console.log("SelectStoreFitness", {props})
      const [customer_menu, setCustomerMenu] = useState([]);
      const [store, setStore] = useState([]);
      const [selectCustomerMenu, setSelectCustomerMenu] = useState();
      const [selectStore, setSelectStore] = useState();
      const history = useHistory();
      useEffect(()=>{
        const url = `/calendar`
        axios.get(url)
        .then(function(res) {
            setCustomerMenu(res.data.fitnesses);
            setStore(res.data.store);
        })
        .catch(function(error) {
          console.log({error})
        });
      },[])
    function handleCustomerMenuChange(e) { setSelectCustomerMenu(e.target.value) }
    function handleStoreChange(e) {  setSelectStore(e.target.value) }

    const onSubmit = (data) => console.log(data);
    const { handleSubmit } = useForm();
    const stores_box = store.map((store,store_index) =>
        <MenuItem value={store} key={store_index}>{ store.store_name }</MenuItem>
    );

    const customer_menu_box = customer_menu.map((customer_menu,customer_menu_index) =>
        <MenuItem value={customer_menu} key={customer_menu_index} >{ customer_menu.name }</MenuItem>
    );
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [year, setYear] = useState();
    const [month, setMonth] = useState();
    const [date, setDate] = useState();
    return (
        <>
        <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container alignItems="center" justify="center">
        <Grid item xs={9}>
            <div className="customer_info_tag">店舗を選択して下さい</div>
            <FormControl variant="outlined" className="select_style">
                <InputLabel id="demo-store-select-outlined-label" >店舗</InputLabel>
                    <Select
                        labelId="demo-store-select-outlined-label"
                        id="demo-store-select-outlined"
                        label="store"
                        style={{backgroundColor: 'white'}}
                        onChange={ handleStoreChange }
                    >
                    {stores_box}
                </Select>
            </FormControl>
            <div className="customer_info_tag">メニューを選択して下さい</div>
            <FormControl variant="outlined" className="select_style">
                <InputLabel id="demo-fitness-select-outlined-label">メニュー</InputLabel>
                    <Select
                        labelId="demo-fitness-select-outlined-label"
                        id="demo-fitness-select-outlined"
                        label="fitness"
                        style={{backgroundColor: 'white'}}
                        onChange = {  handleCustomerMenuChange }
                    >
                    {  customer_menu_box }
                </Select>
            </FormControl>
            <div className="calendar_page_button">
                <Button 
                    variant="contained" 
                    size='large' 
                    color="secondary"
                    style={{width: '100%'}} 
                    onClick = {() => 
                        history.push({
                            pathname: [`/customer/${props.match.params.customer_id}/calendar_new/customer_menu/${selectCustomerMenu.id}/store/${selectStore.id}`],
                            state: { store: selectStore.store_name, customer_menu: selectCustomerMenu.name}
                        })}>
                    時間を選ぶ
                </Button>
            </div>
        </Grid>   
        </Grid>
        </form>
    </>
    );
  };
  
export default SelectStoreFitness;
