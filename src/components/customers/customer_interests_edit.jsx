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

function SetChipEdit({interest, setInterestIDs, interestIDs, clickedInterests, setUpdateInterestsIDs}) {

    const [value, setValue] = React.useState(false)
    useEffect(()=>{
        if (clickedInterests){
            const index = clickedInterests.findIndex(item => item.name === interest.name)
            if (index != -1){
                setValue(true);
            }
        }
    },[])

    function handleValueChange(){
        // if(value){
        //     //  console.log("AAAAAAAAAAAAAAAA")
        //     const deletedIDs = interestIDs.filter((ID) => {
        //         return ID != interest.id;
        //     });
        //     setInterestIDs(deletedIDs)
        //     setUpdateInterestsIDs((prev) => deletedIDs)
        // }else{
        //     // console.log("AAAAAAAAAAAAAAAA")
        //     const newIDs =  interestIDs.splice(-1, 0, interest.id);
        //     setInterestIDs((prev) => [...prev, ...newIDs])
        //     setUpdateInterestsIDs((prev) => interestIDs)
        // }
        setValue(!value);
    }
    return(
        <>
        {
            value?
            (<Chip
                key={interest.id}
                label={ interest.name }
                clickable
                color="primary"
                onClick={ handleValueChange }
            />)
            :
            (<Chip
                key={interest.id}
                label={ interest.name }
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


export default function CustomerInterestsEdit(props) {
    const url = '/customer_info/intarests_new'
    const [allInterests, setAllInterests] = React.useState([])
    const classes = useStyles();
    // マイページから変更する際
    let interests_array = []
    if (props.interests){
        // eslint-disable-next-line no-unused-vars
        var index = props.interests.map(function( item ) {
            interests_array.push(item.id)            
        });
    }
    const [interestIDs, setInterestIDs] = React.useState(interests_array)

    useEffect(()=>{
        axios.get(url)
        .then(function(res) {
            setAllInterests(res.data.intarests)
        })
        .catch(function(error) {
            console.log({error})
        });

        if(props.setCustomerStatus){
            props.setCustomerStatus((prev) => ({...prev, interests: interestIDs}))
        }
     },[interestIDs])

    const select_interests = allInterests.length ?  
        allInterests.map((interest,index) =>
        <>
        {props?.interests? 
            <SetChipEdit key={index} interest={interest} setInterestIDs={setInterestIDs} interestIDs={interestIDs} clickedInterests={props.interests} setUpdateInterestsIDs={props.setUpdateInterestsIDs} />
            :
            <SetChipEdit key={index} interest={interest} setInterestIDs={setInterestIDs} interestIDs={interestIDs}/>
        }
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