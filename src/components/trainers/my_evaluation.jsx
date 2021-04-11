/* eslint-disable react/prop-types */
import React, { useEffect } from 'react';
import axios from 'axios'
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import InputBase from '@material-ui/core/InputBase';
import { useSelector } from 'react-redux';
import { selectCurrentTrainer, selectTrainerHeaders } from '../../slices/trainer';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import { useHistory } from 'react-router-dom';
import { Bar } from 'react-chartjs-2';

function BarChart({avaTrainer}) {
    console.log({avaTrainer})
    const graphData= {
        labels: avaTrainer.name,
        datasets: [
        {
            data: avaTrainer.score,
            backgroundColor: 'rgba(30, 144, 255, 0.5)',
            borderColor: 'rgba(54, 162, 235, 1)',
            label: avaTrainer.name,
            borderWidth: 2,
        },],
    };
    const graphOption = {
        scales: {
        xAxes: [ // x軸設定
            {
            scaleLabel: { // 軸ラベル設定
                display: true,
                labelString: 'お客様からの評価',
            },
            },
        ],
        yAxes: [ // y軸設定
            {
            scaleLabel: {
                display: true,
                labelString: 'スコア平均点',
            },
            ticks: { // 軸目盛設定
                beginAtZero: true,
                max: 5,
                // eslint-disable-next-line no-unused-vars
                callback: function (value, index, values) {
                    return `${value}`;
                },
            },},
        ],},
    };


    return (
        <div className="App">
            <Bar data={graphData} options={graphOption} />
        </div>
    );
}


export default function MyEvaluation(props) {
    const url = `/trainer/get/my_evaluation`
    const currentTrainer = useSelector(selectCurrentTrainer);
    const trainerHeaders = useSelector(selectTrainerHeaders);
    const [myEvaluation, setMyEvaluation] = React.useState();

    console.log({props})
    console.log(props.props.match.params.id)
    useEffect(()=>{
        axios.get(url, trainerHeaders)
        // axios.get(url)
        .then(function(res) {
            console.log({res})
            setMyEvaluation(res.data.data)
            console.log("res.data.intial_data", res.data.intial_data)
        })
        .catch(function(error) {
            console.log({error})
            // setMyEvaluation()
        });
        
    },[])
    return (<> 
        {myEvaluation?(<>
            <hr/>
            <BarChart avaTrainer={myEvaluation} />
        </>):(<></>)}
    </>)
}