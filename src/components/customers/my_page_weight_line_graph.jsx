import React, { Component, useState, useEffect } from "react"
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer ,CartesianGrid} from "recharts"
import {selectCurrentCustomer, selectCustomerHeaders} from '../../slices/customer'
import { useSelector, useDispatch } from 'react-redux';

export default function LineGraph(props){
    const [weightHistory, setWeightHistory] = useState([]);
    const currentCustomer = useSelector(selectCurrentCustomer);
    const headers = useSelector(selectCustomerHeaders);
    const url = `http://localhost:3000/customer_weights`

    useEffect(()=>{
      fetch(url, headers)
        .then( res => res.json() )
        .then( res => {
            setWeightHistory(res);
        })
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