import React, { Component, useState, useEffect } from "react"
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer ,CartesianGrid} from "recharts"
import {selectCurrentCustomer, selectCustomerHeaders} from '../../slices/customer'
import { useSelector, useDispatch } from 'react-redux';
import Chip from '@material-ui/core/Chip';


export default function InterestChips(props){

    const [interests, setInterests] = useState([]);
    useEffect(()=>{
        setInterests(props.interests);
    },[])
    console.log("チェック", {interests})

    const InterestsChips = interests.length ?  
        interests.map((interest,index) =>
        <>
        <Chip
            key={interest.id}
            label={ interest.name }
            style={{margin: 2}}
            color="primary"
        />
        </>
    )
    : 
        <></>
    return(
        <>  
            {/* {interests? (<>{ InterestsChips }</>):(<></>)} */}
            { InterestsChips }
        </>
    )
}