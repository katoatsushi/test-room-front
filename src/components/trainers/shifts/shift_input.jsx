/* eslint-disable react/prop-types */
import React , { useEffect, useState } from 'react';
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


export default function ShiftInput({setButton, shift, all_shift, setShift, workDays}) {
    const classes = useStyles();
    const [checked, setChecked] = React.useState(false);
    const [startArray, setStartArray] = React.useState([7,30]);
    const [finishArray, setFinishArray] = React.useState([19,30]);
    useEffect(()=>{
        if(shift.shift.start || shift.shift.end){
            setChecked(true)
            setStartArray(shift.shift.start)
            setFinishArray(shift.shift.end)
        }
    },[])
    const handleChange = (event) => {
        setChecked(event.target.checked);
        setButton((prev)=> (prev, true))
        const shiftCopy = all_shift
        shiftCopy.filter
        // 出勤追加
        if(event.target.checked){
            const newSfhift = shiftCopy.map((s) => {
                if(s.date == shift.date){
                    if(!workDays.includes(shift.date)){
                        // 新規追加のシフト
                        return {date: shift.date, shift: {start: startArray, end: finishArray}, edit: true, work: false, new_shiift: true}
                    }else{
                         // 既存のシフト
                        return {date: shift.date, shift: {start: s.shift.start, end: s.shift.end}, edit: false, work: false, new_shift: false, id: s.id}
                    }
                }else{
                    return s
                }
            });
            setShift(newSfhift)
        }else{
        // 出勤削除
            const newSfhift = shiftCopy.map((s) => {
                if(s.date == shift.date){
                    if(workDays.includes(shift.date)){
                        // 過去に追加していたけれど削除した場合
                        return {date: shift.date, shift: {start: s.shift.start, end: s.shift.end}, edit: true, work: false, new_shift: false, id: s.id}
                    }else{
                         // 追加してやっぱり削除をした場合
                        return {date: shift.date, shift: {start: null, end: null}, edit: false, work: false, new_shift: false}
                    }
                }else{
                    return s
                }
            });
            setShift(newSfhift)
        }
    };

    function TimeStringToArray(e){
        const times = e.target.value.split(':');
        const times_array = [Number(times[0]),Number(times[1])]
        return times_array
    }

    function handleTimeStartChange(e){
        setButton((prev)=> (prev, true))
        const times_array = TimeStringToArray(e)
        setStartArray(times_array)
        const shiftCopy = all_shift
        const newSfhift = shiftCopy.map((s) => {
            if(s.date == shift.date){
                if(workDays.includes(shift.date)){
                    // 過去に存在する
                    return {date: shift.date, shift: {start: s.shift.start, end: s.shift.end},  edit: true, work: true, new_shift: false, id: s.id}
                }else{
                    // 存在しない
                    return {date: shift.date, shift: {start: s.shift.start, end: s.shift.end},  edit: true, work: true, new_shift: true}
                }
            }else{
                return s
            }
        });
        setShift(newSfhift)

    }
    function handleTimeEndChange(e){
        setButton((prev)=> (prev, true))
        const times_array = TimeStringToArray(e)
        setFinishArray(times_array)
        const shiftCopy = all_shift
        const newSfhift = shiftCopy.map((s) => {
            if(s.date == shift.date){
                if(workDays.includes(shift.date)){
                    // 過去に存在する
                    return {date: shift.date, shift: {start: s.shift.start, end: times_array}, edit: true, work: true, new_shift: false, id: s.id}
                }else{
                    // 存在しない
                    return {date: shift.date, shift: {start: s.shift.start, end: times_array}, edit: true, work: true, new_shift: true}
                }
            }else{
                return s
            }
        });
        setShift(newSfhift)
    }

    function TimeToString(e){
        const hour = e[0]/10 < 1 ? "0"+String(e[0]) : String(e[0])
        var min = e[1]/10 < 1 ? "0"+String(e[0]) : String(e[0])
        if(e[1]/10 < 1){
            if(e[1]/10 == 0){
                min = "00"
            }else{
                min = "0"+String(e[1])
            }
        }else{
            min = String(e[1])
        }
        return hour + ":" + min
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
        <div style={{marginTop: 5}}>{shift.date}日</div>
        </Grid>
        <Grid item xs={8} style={{paddingBottom: 0, marginBottom: 0}}>
            <TextField
                id="time"
                type="time"
                value={TimeToString(startArray)}
                className={classes.textField}
                onChange={handleTimeStartChange}
                InputLabelProps={{
                    shrink: true,
                }}
                disabled = {!checked}
                inputProps={{
                    step: 300, 
                }}
                style={{display: 'inline'}}
            />
            <TextField
                id="time"
                type="time"
                value={TimeToString(finishArray)}
                className={classes.textField}
                onChange={handleTimeEndChange}
                InputLabelProps={{
                    shrink: true,
                }}
                disabled = {!checked}
                inputProps={{
                    step: 300,
                }}
                style={{display: 'inline'}}
            />
        </Grid>
        </>
    );
}