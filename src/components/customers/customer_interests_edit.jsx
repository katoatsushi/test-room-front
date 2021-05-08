/* eslint-disable react/prop-types */
import React , { useEffect } from 'react';
import Grid from '@material-ui/core/Grid';
import axios from 'axios';
import { makeStyles } from '@material-ui/core/styles';
import Chip from '@material-ui/core/Chip';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '20%',
    color: '#555555',
    backgroundColor: 'white',
    textAlign: 'center',
  },
  checked: {
    marginRight: theme.spacing(1),
    backgroundColor: 'silver',
  },
  chip: {
    justifyContent: 'center',
    '& > *': {
      margin: theme.spacing(0.5),
    },
  },
}));

function SetChipEdit({thisInterest, setInterestIDs, interestIDs}) {
    const [value, setValue] = React.useState(false)

    useEffect(()=>{
        interestIDs.includes(thisInterest.id)? setValue(true) :setValue(false);
    },[])

    function handleValueChange(){
        if(value){
            const deletedIDs = interestIDs.filter((ID) => {
                return ID != thisInterest.id;
            });
            setInterestIDs(deletedIDs)
        }else{
            setInterestIDs((prev) => [...prev, thisInterest.id])
        }
        setValue(!value);
    }
    return(
        <>
        {
            value?
            (<Chip
                key={thisInterest.id}
                label={ thisInterest.name }
                clickable
                color="primary"
                onClick={ handleValueChange }
            />)
            :
            (<Chip
                key={thisInterest.id}
                label={ thisInterest.name }
                clickable
                color="primary"
                variant="outlined"
                style={{backgroundColor: 'white'}}
                onClick={ handleValueChange }
            />)
        }
        </>
    );
}


export default function CustomerInterestsEdit({interestIDs, setInterestIDs}) {
    const url = '/customer_info/intarests_new'
    const [allInterests, setAllInterests] = React.useState([])
    const classes = useStyles();

    useEffect(()=>{
        axios.get(url)
        .then(function(res) {
            setAllInterests(res.data.intarests)
        })
        .catch(function(error) {
            console.log({error})
        });
     },[interestIDs])

    const select_interests = allInterests.length ?  
        allInterests.map((interest,index) =>
        <>
            <SetChipEdit key={index} thisInterest={interest} setInterestIDs={setInterestIDs} interestIDs={interestIDs} />
        </>
    )
    : 
        <></>

    return (
        <>
        <Grid container alignItems="center" justify="center">
        <Grid item xs={11}>
            <div className="customer_info_tag">関心のある分野を選んでください</div>
            <div className={classes.chip}>
             { select_interests }
            </div>
        </Grid>   
        </Grid>
        </>
    );
}