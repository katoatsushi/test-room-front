/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios'
import Button from '@material-ui/core/Button'
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Grid from '@material-ui/core/Grid';
import { useForm } from "react-hook-form";
import { useSelector } from 'react-redux';
import { selectCustomerHeaders} from '../../slices/customer'
import { selectTrainerHeaders} from '../../slices/trainer'

const SelectStoreFitness = (props) => {
    const customerHeader = useSelector(selectCustomerHeaders);
    const trainerHeader = useSelector(selectTrainerHeaders);
    const [customer_menu, setCustomerMenu] = useState([]);
    const [store, setStore] = useState([]);
    const [selectCustomerMenu, setSelectCustomerMenu] = useState();
    const [selectStore, setSelectStore] = useState();
    const history = useHistory();
    const [storeCheck, setStoreCheck] = useState(false);
    const [fitnessCheck, setFitnessCheck] = useState(false);

    useEffect(()=>{
        const url = `/calendar`
        var header = null
        if(customerHeader){
            header = customerHeader
        }else if(trainerHeader){
            header = trainerHeader
        }
        axios.get(url, header)
        .then(function(res) {
            setCustomerMenu(res.data.fitnesses);
            setStore(res.data.store);
        })
        .catch(function(error) {
            console.log({error})
        });
    },[])

    function handleCustomerMenuChange(e) { 
        setSelectCustomerMenu(e.target.value)
        setFitnessCheck(true)
    }
    function handleStoreChange(e) {  
        setSelectStore(e.target.value)
        setStoreCheck(true)
    }

    const onSubmit = (data) => console.log(data);
    const { handleSubmit } = useForm();

    const stores_box = store.length ?
    store.map((store,store_index) =>
        <MenuItem value={store} key={store_index}>{ store.store_name }</MenuItem>
    ):
        <MenuItem/>

    const customer_menu_box = customer_menu.length ?
    customer_menu.map((customer_menu,customer_menu_index) =>
        <MenuItem value={customer_menu} key={customer_menu_index} >{ customer_menu.name }</MenuItem>
    ):
        <MenuItem/>

    return (
        <>
        <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container alignItems="center" justify="center">
        <Grid item xs={9}>
            <div className="customer_info_tag">??????????????????????????????</div>
            <FormControl variant="outlined" className="select_style">
                <InputLabel id="demo-store-select-outlined-label" >??????</InputLabel>
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
            <div className="customer_info_tag">????????????????????????????????????</div>
            <FormControl variant="outlined" className="select_style">
                <InputLabel id="demo-fitness-select-outlined-label">????????????</InputLabel>
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
            {storeCheck&&fitnessCheck? (<>
                <Button 
                    variant="contained" 
                    size='large' 
                    color="secondary"
                    style={{width: '100%', marginTop: 100}} 
                    onClick = {() => 
                        history.push({
                            pathname: [`/customer/${props.match.params.customer_id}/calendar_new/customer_menu/${selectCustomerMenu.id}/store/${selectStore.id}`],
                            state: { store: selectStore.store_name, customer_menu: selectCustomerMenu.name}
                        })}
                >
                    ???????????????
                </Button>
            </>):(<>
                <Button 
                    variant="contained" 
                    size='large' 
                    style={{width: '100%', marginTop: 100}} 
                    disabled
                >
                    ???????????????
                </Button>
            </>)}
        </Grid>   
        </Grid>
        </form>
    </>
    );
  };
  
export default SelectStoreFitness;
