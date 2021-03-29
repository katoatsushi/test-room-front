import React, { Component, useState, useEffect } from "react"
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer ,CartesianGrid} from "recharts"
import {selectCurrentCustomer, selectCustomerHeaders} from '../../slices/customer'
import { useSelector, useDispatch } from 'react-redux';
import axios, { AxiosError } from 'axios';

export default function LineGraph(props){
    const [weightHistory, setWeightHistory] = useState([]);
    const currentCustomer = useSelector(selectCurrentCustomer);
    const headers = useSelector(selectCustomerHeaders);
    const url = `/customer_weights`

    useEffect(()=>{
        axios.get(url, headers)
        .then(function(response) {
            console.log({response}, "確認だよん")
            setWeightHistory(response.data);
        })
        .catch(function(error) {
          console.log({error})
        });
    },[])

     return (
         <>
        {weightHistory.length?  (
            <>
                {/* <div className="App"> */}
                    <ResponsiveContainer
                    width="96%"
                    height="40%"
                    minWidth={100}
                    minHeight={200}
                    style={{textAlign: 'left'}}
                    >
                    {/* <LineChart data={data}> */}
                    <LineChart data={weightHistory}>
                        <CartesianGrid stroke="#eee" strokeDasharray="10 10" />
                        <XAxis dataKey="name" />
                        {/* <YAxis  domain={['dataMin', 'dataMax']} ticks={[77,78,79,80,81,82]} /> */}
                        <YAxis domain={['dataMin', 'dataMax']} />
                        <Line dataKey="uv" stroke="#8884d8" />
                        <Line dataKey="pv" stroke="#82ca9d" />
                    </LineChart>
                    </ResponsiveContainer>
                {/* </div> */}
            </>
        ) : (
            <>
            </>
        )}
        </>
    );      
}