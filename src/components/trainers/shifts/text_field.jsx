/* eslint-disable react/prop-types */
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Checkbox from '@material-ui/core/Checkbox';
import Grid from '@material-ui/core/Grid';

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 200,
  },
}));

export default function FormattedInputs(props) {
    const classes = useStyles();
    const [checked, setChecked] = React.useState(false);
    const handleChange = (event) => {
        setChecked(event.target.checked);
        props.setButton((prev)=> (prev, true))
        if(event.target.checked){
            props.setShift((prev)=>{ prev[props.date]["start"] = [7,30]
                return {...prev}
            });
            props.setShift((prev)=>{ prev[props.date]["end"] = [17, 30]
                return {...prev}
            });
        }else{
            props.setShift((prev)=>{ prev[props.date]["start"] = null
                return {...prev}
            });
            props.setShift((prev)=>{ prev[props.date]["end"] = null
                return {...prev}
            });   
        }
    };

    function handleTimeStartChange(e){
        console.log(e.target.value)
        const times = e.target.value.split(':');
        const times_array = [Number(times[0]),Number(times[1])]
        props.setShift((prev)=>{ prev[props.date]["start"] = times_array
            return {...prev}
        });
    }
    function handleTimeEndChange(e){
        console.log(e.target.value)
        const times = e.target.value.split(':');
        const times_array = [Number(times[0]),Number(times[1])]
        props.setShift((prev)=>{ prev[props.date]["end"] = times_array
            return {...prev}
        });
    }
  return (
    <>
    <Grid item xs={2} style={{paddingBottom: 0, marginBottom: 0}}>
      <Checkbox
        checked={checked}
        onChange={handleChange}
        inputProps={{ 'aria-label': 'primary checkbox' }}
      />
    </Grid>
    <Grid item xs={2} style={{paddingBottom: 0, marginBottom: 0}}>
    <div style={{marginTop: 5}}>{props.date}日</div>
    </Grid>
    <Grid item xs={8} style={{paddingBottom: 0, marginBottom: 0}}>
    {checked? (
        <>
            <TextField
                id="time"
                type="time"
                defaultValue="07:30"
                className={classes.textField}
                onChange={handleTimeStartChange}
                InputLabelProps={{
                    shrink: true,
                }}
                inputProps={{
                    step: 300, // 5 min
                }}
                // style={{display: 'inline-block'}}
                style={{display: 'inline-block'}}
            />
            <TextField
                id="time"
                type="time"
                defaultValue="17:30"
                className={classes.textField}
                onChange={handleTimeEndChange}
                InputLabelProps={{
                    shrink: true,
                }}
                inputProps={{
                    step: 300, // 5 min
                }}
                // style={{display: 'inline-block'}}
                style={{display: 'inline-block'}}
            />
      </>
    ):(
        <>
            <TextField
                id="time"
                type="time"
                defaultValue="07:30"
                className={classes.textField}
                onChange={handleTimeStartChange}
                InputLabelProps={{
                    shrink: true,
                }}
                disabled
                inputProps={{
                    step: 300, // 5 min
                }}
                style={{display: 'inline-block'}}
            />
            <TextField
                id="time"
                type="time"
                defaultValue="17:30"
                className={classes.textField}
                onChange={handleTimeEndChange}
                InputLabelProps={{
                    shrink: true,
                }}
                disabled
                inputProps={{
                    step: 300, // 5 min
                }}
                style={{display: 'inline-block'}}
            />
        </>
    )}

    </Grid>
    </>
  );
}
