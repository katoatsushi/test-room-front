
/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import axios from 'axios'
import {selectCurrentCustomer} from '../../slices/customer'
import {selectCurrentAdmin} from '../../slices/admin'
import {selectCurrentTrainer} from '../../slices/trainer'
import {selectCurrentMasterAdmin} from '../../slices/master_admin'
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { useSnackbar } from 'notistack';

export default function RoomPlus(){
    const currentCustomer = useSelector(selectCurrentCustomer);
    const currentAdmin = useSelector(selectCurrentAdmin);
    const currentTrainer = useSelector(selectCurrentTrainer);
    const currentMasterAdmin = useSelector(selectCurrentMasterAdmin);
    const [aposDatas, setAposDatas] = React.useState([]);
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    var message = ""
    var company_id = null
    if(currentCustomer){
        company_id = currentCustomer.company_id
    }else if(currentAdmin){
        company_id = currentAdmin.company_id
    }else if(currentTrainer){
        company_id = currentTrainer.company_id
    }
    const history = useHistory();
    useEffect(()=>{
        if(company_id){
        const url = `/room_plus/comapny/${company_id}`
        axios.get(url)
        .then(function (response) {
            console.log({response})
            setAposDatas(response.data.data)
            message = response.data.message
            enqueueSnackbar(message, { 
                variant: 'success',
            });
        })
        .catch(function (response) {
            console.log("error", {response})
        })
        }else{
            history.push('/');
        }
    },[])

    function timeArrage(t){
        const start = new Date(t[0])
        const finish = new Date(t[1])
        return (<>
            ・{ start.getHours()}:{ start.getMinutes() } 〜 { finish.getHours()}:{ finish.getMinutes() }<br/>
        </>)
    }

    const render_appoints = aposDatas?  
       aposDatas.map((datas, index) => (<>
        {datas.month}月{datas.day}日
        【{datas.store_name.store_name}】空き状況<br/>
        {   
            datas.data.map((d, index) => (<>
                {(d[1] > 0)? (
                    <span key={index}>{ timeArrage(d[0]) }</span>
                ):<></>
                }
            </>))
        }<br/>
        </>))
    : 
        <></>

    return(<>

    <div style={{width: '90%', marginLeft: 'auto', marginRight: 'auto', backgroundColor: 'white', padding: 10, marginTop: 10}}>
        <span style={{color: 'grey'}}>※ご予約の方はLINEにご連絡下さい</span><hr/>
        { render_appoints }
        <hr/>
        <span style={{color: 'grey'}}>※ご予約の方はLINEにご連絡下さい</span>
    </div>
    </>)
}