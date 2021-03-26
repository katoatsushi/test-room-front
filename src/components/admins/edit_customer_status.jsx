import React, { useEffect, useState, Component } from 'react';
import axios from 'axios'
import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import IconButton from '@material-ui/core/IconButton';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import Grid from '@material-ui/core/Grid';

export default function EditCustomerStatus(){
    const url = `http://localhost:3000/customer_statuses/:customer_id`
    const [ customerStatus, setCustomerStatus] = useState({});

    useEffect(()=>{
      fetch(url)
        .then( res => res.json() )
        .then( res => {
            setCustomerStatus(res);
        })
    },[])
    function handleEditSubmit(){
        // TODO::ここに更新の処理をかく
    }
    return(
        <>
            あああああ
        </>
    );  
}