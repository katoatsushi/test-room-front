import React , { useEffect, useState, PureComponent } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import { Controller, useForm, SubmitHandler } from 'react-hook-form';
import axios, { AxiosError } from 'axios';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { BrowserRouter as Router, Route, Switch, useParams, useHistory, useLocation, } from 'react-router-dom';
import { selectCurrentTrainer, selectTrainerHeaders }  from '../../slices/trainer';
import { useSelector, useDispatch } from 'react-redux';
import Paper from '@material-ui/core/Paper';
import { Bar } from 'react-chartjs-2';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Chart from "react-google-charts";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
}));



function BarChart({avaTrainer}) {
  const graphData= {
    // labels: [['2019年', '1月'],['2019年', '2月'],],
    labels: avaTrainer.name,
    datasets: [
      // 表示するデータセット
      {
        // data: [3.2, 4, 4.2, 3.5, 2.5, 3.2, 3.1, 2.8, 1.7, 2.9, 2.9, 4.0],
        data: avaTrainer.score,
        backgroundColor: 'rgba(30, 144, 255, 0.5)',
        borderColor: 'rgba(54, 162, 235, 1)',
        label: avaTrainer.details,
        borderWidth: 2,
      },
    ],
  };
    const graphOption = {
    scales: {
      xAxes: [ // x軸設定
        {
          scaleLabel: { // 軸ラベル設定
            display: true,
            labelString: 'トレーナー名',
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
            callback: function (value, index, values) {
              return `${value}`;
            },
          },
        },
      ],
    },
  };


  return (
    <div className="App">
       <Bar data={graphData} options={graphOption} />
    </div>
  );
}


export default function EvaluationData(props) {
    const classes = useStyles();
    const trainerHeader = useSelector(selectTrainerHeaders);
    const currentTrainer = useSelector(selectCurrentTrainer);
    const url = `/check_evaluation/${props.customer_id}`
    const [avaTrainer, setAvaTrainer] = React.useState({details: null,name: [], score: []});
    const [fitnessTrainerData, setFitnessTrainerData] = React.useState([]);
    const [selectFitnessTrainerData, setSelectFitnessTrainerData] = React.useState({details: null,name: [], score: []});
    const [pieChartData, setPieChartData] = React.useState([]);
    useEffect(()=>{
        axios.get(url)
        .then(function(res) {
            console.log({res})
            setAvaTrainer({details: res.data.average.trainer[0], name: res.data.average.trainer[1], score: res.data.average.trainer[2]})
            setFitnessTrainerData(res.data.average.all)
            setPieChartData(res.data.count.all)
        })
        .catch(function(error) {
          console.log({error})
        });
    },[])

    function handleFitnessChange(e) {
        if (e.target.value == "reset"){
            setSelectFitnessTrainerData({details: null,name: [], score: []})
        }else{
            setSelectFitnessTrainerData({details: e.target.value[0],name: e.target.value[2], score: e.target.value[3]})
        }
    }

    const select_fitness = fitnessTrainerData.length ?  
    fitnessTrainerData.map((tag, index) =>
        <MenuItem value={tag} key={index}>{ tag[1].name}</MenuItem>
    ):
        <MenuItem />

    console.log({pieChartData})
    return (
    <div>
        {/* <div style={{width: '70%', backgroundColor: 'white'}}> */} 
        <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <Paper className={classes.paper}>
            <FormControl variant="outlined" className="select_style">
                <InputLabel id="demo-store-select-outlined-label" >メニューを選択してください</InputLabel>
                    <Select
                        labelId="demo-store-select-outlined-label"
                        id="demo-store-select-outlined"
                        label="store"
                        style={{backgroundColor: 'white'}}
                        onChange={ handleFitnessChange }
                    >
                     <MenuItem value="reset">全体</MenuItem>
                    { select_fitness　}
                </Select>
            </FormControl>
            {selectFitnessTrainerData?.details? (
                <BarChart avaTrainer={selectFitnessTrainerData}/>
            ):(
                <BarChart avaTrainer={avaTrainer}/>
            )}
          </Paper>
        </Grid>
        </Grid>
        {/* </div> */}
        <Grid container spacing={3}>
        
        {pieChartData?(
            <>
            {pieChartData.map((chartData,index) => (
                <Grid item xs={12} sm={4}> 
                    <Chart
                    width={'100%'}
                    height={'300px'}
                    chartType="PieChart"
                    loader={<div>Loading Chart</div>}
                    // data={[
                    //     ['Task', 'Hours per Day'],
                    //     ['Work', 11],['Eat', 2],['Commute', 2],['Watch TV', 2],['Sleep', 7],
                    // ]}
                    data={chartData[2]}
                    options={{
                        title: `${chartData[0]}`,
                    }}
                    rootProps={{ 'data-testid': '1' }}
                    />
                </Grid>
            ))}
            </>
        ):(
            <></>
        )}
        </Grid>
    </div>
    );
}






