import React , { useEffect, useState } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import { BrowserRouter as Router, Route, Switch, useParams, useHistory, useLocation, } from 'react-router-dom';
import Paper from '@material-ui/core/Paper';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import Select from '@material-ui/core/Select';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import axios from 'axios'

function CustomerJobs(props) {
    const url = '/customer_info/jobs_new'
    const [jobs, setJobs] = React.useState([])
    const [selectJob, setSelectJob] = React.useState()

    useEffect(()=>{

        axios.get(url)
        .then(function(res) {
            setJobs(res.data.jobs)
        })
        .catch(function(error) {
            console.log({error})
        });

        props.setCustomerStatus((prev) => ({...prev, jobs: selectJob}))
    },[selectJob])


    const select_jobs = jobs.map((job ,index) =>
        <FormControlLabel 
            key={index} 
            value={job.name} 
            onClick={()=>handleJobChange(job)} 
            control={<Radio/>} 
            label= { job.name }/>
    );
    
    function handleJobChange(e){
        console.log({e})
        setSelectJob(e);
    }

    return (
        <>  
        <div className="customer_info_tag" style={{textAlign: 'center'}}>ご職業を教えてください</div>
        <div className="chose_jobs">
            <Grid container alignItems="center" justify="center">
                <Grid item xs={9}>
                    <FormControl component="fieldset">
                        <RadioGroup value={selectJob} aria-label="gender" name="customized-radios">
                            { select_jobs }
                        </RadioGroup>
                    </FormControl>
                </Grid>   
            </Grid>
        </div>
        </>
    );
}

export default CustomerJobs;